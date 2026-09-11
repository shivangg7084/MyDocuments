---
title: "18 — Project 2: Kindle Review Sentiment Analysis"
description: A messier 12,000-review dataset with URLs, HTML and emails. Production-grade cleaning, the space-vs-empty-string bug, and a full diagnosis of why the first model scores only 58%.
---

# 18 — Project 2: Kindle Review Sentiment Analysis

Project 1 was clean. Real text is not. This project is about **industrial-strength cleaning**
and, more importantly, about **what to do when your model performs badly.**

> Runnable version: [`notebooks/05-kindle-sentiment-project.ipynb`](../notebooks/05-kindle-sentiment-project.ipynb)

---

## 1. The dataset

**Amazon Kindle Store book reviews**, May 1996 – July 2014. A 12,000-row subset of the
5-core set (every reviewer and every product has ≥ 5 reviews).

Source: [Julian McAuley's Amazon product data](https://jmcauley.ucsd.edu/data/amazon/) —
credit and licence belong to the original authors.

```python
import pandas as pd

df = pd.read_csv('all_kindle_review.csv')
df = df[['reviewText', 'rating']]        # the only two columns we need
df.shape                                 # (12000, 2)
df.isnull().sum()                        # 0, 0
df['rating'].value_counts()
```
```
5    3000
4    3000
3    2000
2    2000
1    2000
```

Five rating levels, reasonably balanced.

---

## 2. Turning 5 ratings into 2 classes

We want **positive vs negative**, so collapse the scale:

```python
df['rating'] = df['rating'].apply(lambda x: 0 if x < 3 else 1)
df['rating'].value_counts()
# 1    8000     positive  (ratings 3, 4, 5)
# 0    4000     negative  (ratings 1, 2)
```

`lambda x: 0 if x < 3 else 1` runs on every value: **< 3 → negative (0), ≥ 3 → positive (1)**.

### ⚠️ The decision hidden in that line

**Where do 3-star reviews go?** Here they are counted as positive. That is a *choice*, and it
directly damages the model:

- A 3-star review is genuinely **neutral** — "it was okay, a bit slow in the middle".
- Its language overlaps heavily with both 4-star and 2-star reviews.
- 2,000 of 12,000 rows (17%) are these ambiguous cases, **labelled positive**.

**You are asking the model to learn a distinction that is not really in the text.** Two
better options:

```python
# Option A — drop the neutrals entirely (cleanest signal)
df = df[df['rating'] != 3]
df['rating'] = (df['rating'] > 3).astype(int)

# Option B — three classes (most faithful to the data)
df['sentiment'] = pd.cut(df['rating'], bins=[0,2,3,5], labels=['neg','neu','pos'])
```

Remember this when the accuracy comes out at 58% in §6. **Some of that 58% was decided here,
before a single model was trained.**

---

## 3. Production-grade cleaning

Real reviews contain HTML from web scraping, URLs, email addresses and inconsistent
whitespace. Six steps:

```python
import re
import nltk
from nltk.corpus import stopwords
from bs4 import BeautifulSoup

nltk.download('stopwords')
STOP = set(stopwords.words('english'))

# ① lowercase
df['reviewText'] = df['reviewText'].str.lower()

# ② remove special characters  (NOTE THE SPACE — see below)
df['reviewText'] = df['reviewText'].apply(lambda x: re.sub('[^a-z0-9 ]', ' ', x))

# ③ remove stopwords
df['reviewText'] = df['reviewText'].apply(
    lambda x: ' '.join(w for w in x.split() if w not in STOP))

# ④ remove URLs and email addresses
df['reviewText'] = df['reviewText'].apply(
    lambda x: re.sub(r'(http|https|ftp|ssh)://[\w_-]+(\.[\w_-]+)+\S*', '', x))

# ⑤ remove HTML tags
df['reviewText'] = df['reviewText'].apply(
    lambda x: BeautifulSoup(x, 'lxml').get_text())

# ⑥ collapse repeated whitespace
df['reviewText'] = df['reviewText'].apply(lambda x: ' '.join(x.split()))
```

### 🐛 The bug: `''` vs `' '`

```python
re.sub('[^a-z0-9]', '',  "great book,loved it")   # 'greatbookloved it'   ❌
re.sub('[^a-z0-9 ]', ' ', "great book,loved it")  # 'great book loved it' ✅
```

Replacing with an **empty string glues words together**, manufacturing junk tokens
(`bookloved`) that appear once each and pollute the vocabulary. Replacing with a **space**
keeps the word boundaries.

Note also the **space inside the character class** `[^a-z0-9 ]` — without it, your existing
spaces are themselves deleted and the entire review becomes one enormous token.

> **Two characters, `' '` instead of `''`, is the difference between a working model and a
> vocabulary full of nonsense.** It is the most common silent bug in text cleaning.

### The URL regex, decoded

```
r'(http|https|ftp|ssh)://[\w_-]+(\.[\w_-]+)+\S*'
 └──── scheme ──────┘  └─ domain ─┘└─ .tld  ─┘└ rest
```

| Part | Matches |
|---|---|
| `(http\|https\|ftp\|ssh)` | the protocol |
| `://` | the literal separator |
| `[\w_-]+` | domain name — word characters, underscore, hyphen |
| `(\.[\w_-]+)+` | one or more `.something` parts (`.co.uk` works) |
| `\S*` | the rest of the URL — path, query string, anything non-space |

Emails need a separate pattern:

```python
re.sub(r'\S+@\S+\.\S+', '', text)     # anything@anything.anything
```

### Why BeautifulSoup for HTML rather than regex

```python
BeautifulSoup("<p>Great <b>book</b>!</p>", 'lxml').get_text()   # 'Great book!'
```

A naive `re.sub('<.*?>', '', text)` breaks on nested tags, unclosed tags, attributes
containing `>`, and HTML entities (`&amp;`). BeautifulSoup parses properly. It is slower —
noticeably so over 12,000 rows — but correct.

> **Order matters.** Step ② strips `<` and `>` before step ⑤ ever sees them, so
> BeautifulSoup has nothing left to do. **Move HTML removal to the front** in your own code:
> `HTML → URLs/emails → lowercase → specials → stopwords → whitespace`.

### Then lemmatize

```python
from nltk.stem import WordNetLemmatizer
nltk.download('wordnet')

lemmatizer = WordNetLemmatizer()

def lemmatize_words(text):
    return ' '.join(lemmatizer.lemmatize(w) for w in text.split())

df['reviewText'] = df['reviewText'].apply(lemmatize_words)
```

**Expect this to take a couple of minutes** on 12,000 reviews — WordNet lookups are slow
(note 05). To speed it up, cache:

```python
from functools import lru_cache
lemmatize_cached = lru_cache(maxsize=None)(lemmatizer.lemmatize)
```

Most words repeat thousands of times across a corpus, so caching gives a large speed-up for
one line of code.

---

## 4. Split, then vectorize

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    df['reviewText'], df['rating'], test_size=0.20, random_state=42, stratify=df['rating'])
```

```python
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

bow = CountVectorizer()
X_train_bow = bow.fit_transform(X_train).toarray()
X_test_bow  = bow.transform(X_test).toarray()

tfidf = TfidfVectorizer()
X_train_tfidf = tfidf.fit_transform(X_train).toarray()
X_test_tfidf  = tfidf.transform(X_test).toarray()

X_train_bow.shape     # (9600, ~30000)  ← no max_features: the FULL vocabulary
```

⚠️ **`.toarray()` on 9,600 × 30,000 float64 is ~2.3 GB of RAM.** The sparse matrix itself is
a few MB. For anything bigger, **do not densify** — sklearn's text models accept sparse
matrices directly:

```python
X_train_bow = bow.fit_transform(X_train)     # keep it sparse
X_test_bow  = bow.transform(X_test)
```

---

## 5. Train

```python
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

nb_bow   = GaussianNB().fit(X_train_bow,   y_train)
nb_tfidf = GaussianNB().fit(X_train_tfidf, y_train)

y_pred_bow   = nb_bow.predict(X_test_bow)
y_pred_tfidf = nb_tfidf.predict(X_test_tfidf)

print("BoW   accuracy:", accuracy_score(y_test, y_pred_bow))     # ≈ 0.58
print("TFIDF accuracy:", accuracy_score(y_test, y_pred_tfidf))   # ≈ 0.58
print(confusion_matrix(y_test, y_pred_bow))
```

---

## 6. 58% is bad. Diagnose it.

Baseline: always predict "positive" → **66.7%** (8,000 of 12,000). **The model is worse than
guessing.** Do not shrug and move on — work through the causes.

### Cause 1 — `GaussianNB` is the wrong model 🔴

```python
GaussianNB()      # assumes each feature is NORMALLY DISTRIBUTED
```

Word counts are **not** normally distributed. They are counts: mostly 0, sometimes 1,
occasionally 2 — a discrete, extremely right-skewed distribution. Gaussian NB fits a bell
curve to a spike at zero, and its probability estimates are nonsense.

```python
from sklearn.naive_bayes import MultinomialNB
MultinomialNB().fit(X_train_bow, y_train)      # the correct NB for counts
```

**This one change typically moves accuracy from ~58% to ~80%+.** It is the biggest single
win available.

```
   GaussianNB      →  continuous, normally-distributed features (height, temperature)
   MultinomialNB   →  counts (BoW, TF-IDF)          ← use this for text
   BernoulliNB     →  binary presence/absence       ← good with binary=True
```

### Cause 2 — no `max_features`, so ~30,000 columns 🟠

9,600 training rows and 30,000 features. **More features than samples** guarantees
overfitting, and the long tail (words appearing once) is pure noise.

```python
CountVectorizer(max_features=5000, ngram_range=(1,2), min_df=5)
```

### Cause 3 — the 3-star problem 🟠

From §2: 2,000 neutral reviews labelled positive. Their language is ambiguous, so the model
is being trained on partly-contradictory labels. Dropping them usually adds several points.

### Cause 4 — negation was removed 🟡

Step ③ used the default NLTK stopword list, which contains **`not`, `no`, `never`** and every
`n't` contraction (note 06). For **sentiment analysis** this is severe:

```
   "this book was not good"  →  "book good"     ← now looks POSITIVE
```

```python
keep = {'not','no','nor','never',"don't","doesn't","isn't","wasn't","didn't","won't"}
STOP = set(stopwords.words('english')) - keep
```

### Cause 5 — no n-grams 🟡

`ngram_range=(1,2)` makes `"not good"` a single feature, which is exactly the fix sentiment
needs (note 11).

### Cause 6 — sentiment is simply harder than spam 🟢

Spam detection is keyword spotting (`free`, `win`, `claim`). Sentiment requires handling
negation, sarcasm, comparison ("better than the last one, which was awful") and mixed
opinions ("great story, terrible editing"). **90%+ is realistic for spam; 80–85% is a good
result for review sentiment with bag-of-words methods.**

### The fixed version

```python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# drop the neutrals
df2 = df[df['rating_original'] != 3].copy()

X_train, X_test, y_train, y_test = train_test_split(
    df2['reviewText'], df2['rating'], test_size=0.2, random_state=42, stratify=df2['rating'])

pipe = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=5000, ngram_range=(1,2), min_df=3)),
    ('clf',   LogisticRegression(max_iter=1000, class_weight='balanced')),
])

pipe.fit(X_train, y_train)
print(classification_report(y_test, pipe.predict(X_test)))
# accuracy typically ≈ 0.85 — up from 0.58
```

**Six changes, ~27 points.** None of them was a fancier algorithm.

---

## 7. The diagnostic checklist — the real deliverable

When a text model underperforms, work down this list **in order**:

```
 ① MODEL/FEATURE MISMATCH   GaussianNB on counts? MultinomialNB on negatives?   ← biggest wins
 ② LABELS                   Are the classes actually separable in the text?
                            Neutral rows forced into a binary label?
 ③ BASELINE                 Are you beating "always predict the majority class"?
 ④ FEATURE COUNT            More features than samples? Set max_features / min_df.
 ⑤ CLEANING                 Did you delete the signal? (negations, digits, emoji)
 ⑥ N-GRAMS                  Does the task need local word order?
 ⑦ LEAKAGE                  Fitted the vectorizer before splitting? (note 16)
 ⑧ IMBALANCE                Checked precision/recall per class, not just accuracy?
 ⑨ ONLY NOW                 Try a different/bigger model.
```

**Almost every real fix is in steps ①–⑥.** Reaching for a bigger model first is the classic
beginner move, and it is usually the least effective one.

---

## 8. Exercises

1. **Run the diagnosis yourself.** Apply the six fixes one at a time and record the accuracy
   after each. Which single change helped most?
2. **Try average Word2Vec** on this dataset (note 15). Reviews are longer and more nuanced
   than SMS — does it beat TF-IDF here, unlike in project 1?
3. **Three-class version** — neg/neutral/pos. Look at the confusion matrix: which pairs does
   the model confuse, and does that match your intuition?
4. **Inspect the learned weights:**
   ```python
   import numpy as np
   names  = pipe['tfidf'].get_feature_names_out()
   coefs  = pipe['clf'].coef_[0]
   print("most positive:", names[np.argsort(coefs)[-15:]])
   print("most negative:", names[np.argsort(coefs)[:15]])
   ```
   Do the top features look like real sentiment words? If you see author names or book
   titles, your model is memorising products rather than learning sentiment.
5. **Error analysis** — print 20 misclassified reviews and read them. This teaches more than
   any hyperparameter sweep.

---

## 9. Self-check

1. Why does `re.sub('[^a-z0-9]', '', text)` corrupt your vocabulary?
2. Why BeautifulSoup rather than a regex for HTML, and where must that step go in the order?
3. Why is `GaussianNB` wrong for bag-of-words features?
4. Your model gets 58% on a dataset that is 2/3 positive. What is the first thing to check?
5. Name three cleaning decisions in this project that actively hurt sentiment accuracy.

<details>
<summary>Answers</summary>

1. Words get glued together (`book,loved` → `bookloved`), creating junk tokens that appear
   once each, inflating the vocabulary and adding noise. Substitute a **space**.
2. BeautifulSoup parses HTML properly — nested/unclosed tags, attributes containing `>`,
   entities — where a regex breaks. It must run **before** the special-character regex,
   which otherwise strips `<` and `>` and leaves nothing to parse.
3. It assumes each feature is normally distributed; word counts are discrete and spiked at
   zero. Use `MultinomialNB` (counts) or `BernoulliNB` (binary).
4. **Compare against the majority-class baseline (66.7%).** The model is *worse* than
   guessing, which points at a model/feature mismatch (cause ①), not at needing more data.
5. (a) 3-star reviews labelled positive; (b) `not`/`no`/`never` removed with the default
   stopword list; (c) no `max_features`, giving 30,000 features for 9,600 samples. (Bonus:
   no n-grams, so `"not good"` is never a feature.)

</details>

---

## 10. You have finished the course

Back to the [index](00-README-NLP-Index.md) — and try the twelve questions in Part 4 now
that you have the answers.

**Where to go next:**

```
   You are here ──▶  RNN / LSTM / GRU  ──▶  Attention  ──▶  Transformers  ──▶  BERT / GPT
                     (word order,           (which words      (parallel,       (contextual
                      real sequences)        matter where)     scalable)        embeddings)
```

Concretely: learn ANN fundamentals (forward/backward propagation, loss, optimizers), then
Keras/PyTorch embedding layers, then `sentence-transformers` and HuggingFace. Everything you
learned here — tokenization, vocabularies, embeddings, leakage discipline — carries straight
over.
