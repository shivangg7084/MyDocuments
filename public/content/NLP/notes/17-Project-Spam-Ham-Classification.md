---
title: "17 — Project 1: SMS Spam/Ham Classification"
description: End-to-end classification of 5,572 SMS messages with Bag of Words, TF-IDF and Average Word2Vec compared, including the row-mismatch bug and how to find it.
---

# 17 — Project 1: SMS Spam/Ham Classification

Everything from notes 03–16, applied. Three vectorization strategies on the same data, with
their accuracies compared.

> Runnable version: [`notebooks/04-spam-ham-project.ipynb`](../notebooks/04-spam-ham-project.ipynb)

---

## 1. The dataset

**SMS Spam Collection** — 5,572 real SMS messages labelled `ham` or `spam`. Tab-separated,
no header:

```
ham	Go until jurong point, crazy.. Available only in bugis n great world la e buffet...
ham	Ok lar... Joking wif u oni...
spam	Free entry in 2 a wkly comp to win FA Cup final tkts 21st May 2005. Text FA to 87121...
ham	U dun say so early hor... U c already then say...
```

Download: [UCI SMS Spam Collection](https://archive.ics.uci.edu/dataset/228/sms+spam+collection).

```python
import pandas as pd

messages = pd.read_csv('SMSSpamCollection', sep='\t', names=['label', 'message'])
messages.shape            # (5572, 2)
messages['label'].value_counts()
# ham     4825
# spam     747
```

**~13% spam — an imbalanced dataset.** Consequences you must respect:

- A model predicting `ham` for everything scores **86.6% accuracy** while being useless.
  **Accuracy alone is not a valid metric here.**
- Use **precision, recall and F1 on the spam class**, and always print the confusion matrix.
- Use `stratify=y` when splitting.

Which error is worse? **A false positive (real message in the spam folder) is worse than a
false negative (spam in the inbox)** — you can delete spam, but you cannot read a message you
never saw. So you want **high precision on spam**, even at some cost to recall.

---

## 2. Steps ① and ② — clean, then encode the label

```python
import re, nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

nltk.download('stopwords')

ps   = PorterStemmer()
STOP = set(stopwords.words('english'))

corpus = []
for i in range(len(messages)):
    review = re.sub('[^a-zA-Z]', ' ', messages['message'][i])   # specials → space
    review = review.lower().split()                             # lowercase + tokenize
    review = [ps.stem(w) for w in review if w not in STOP]       # stopwords + stem
    corpus.append(' '.join(review))                              # back to a string

corpus[:3]
```
```
['go jurong point crazi avail bugi n great world la e buffet cine got amor wat',
 'ok lar joke wif u oni',
 'free entri wkli comp win fa cup final tkt st may text fa receiv entri question...']
```

The stems look odd (`crazi`, `joke`, `entri`) — that is Porter doing its job (note 04). The
model does not read English; it only needs every occurrence of `crazy` to become the same
token.

```python
y = pd.get_dummies(messages['label'], drop_first=True).values.ravel().astype(int)
# 'ham'/'spam' → 0/1 ; drop_first keeps only the 'spam' column
y[:5]      # array([0, 0, 1, 0, 0])
```

`drop_first=True` matters: two categories need only one column, and keeping both would give
you perfectly collinear features.

---

## 3. Step ③ — split BEFORE vectorizing

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    corpus, y, test_size=0.20, random_state=42, stratify=y)

len(X_train), len(X_test)      # 4457, 1115
```

Note we split the **cleaned text**, not vectors. Everything in
[note 16](16-Best-Practices-and-Data-Leakage.md) applies.

---

## 4. Approach A — Bag of Words + Multinomial Naive Bayes

```python
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

cv = CountVectorizer(max_features=2500, ngram_range=(1,2), binary=True)
X_train_bow = cv.fit_transform(X_train).toarray()     # fit + transform  (TRAIN)
X_test_bow  = cv.transform(X_test).toarray()          # transform only   (TEST)

X_train_bow.shape                                     # (4457, 2500)

model_bow = MultinomialNB().fit(X_train_bow, y_train)
y_pred_bow = model_bow.predict(X_test_bow)

print(accuracy_score(y_test, y_pred_bow))             # ≈ 0.98
print(classification_report(y_test, y_pred_bow))
print(confusion_matrix(y_test, y_pred_bow))
```

```
              precision    recall  f1-score   support
           0       0.98      1.00      0.99       966
           1       0.97      0.89      0.93       149
    accuracy                           0.98      1115
```

### Reading the report properly

| Metric | Value | What it means here |
|---|---|---|
| **Precision (spam)** | 0.97 | Of messages flagged spam, 97% really were — only ~3% false alarms |
| **Recall (spam)** | 0.89 | We caught 89% of actual spam; ~11% slipped into the inbox |
| **F1 (spam)** | 0.93 | The balanced summary — **this is the number to compare across models** |
| **Accuracy** | 0.98 | Real, but remember 86.6% was free |

High precision, moderate recall — exactly the trade-off you want for a spam filter.

### Why Multinomial Naive Bayes for text?

- It is **built for count data** — its likelihood is literally a multinomial over word counts.
- It handles **high-dimensional sparse matrices** without blinking.
- **Very fast** — one pass of counting, no iteration.
- On small-to-medium text datasets it frequently **beats logistic regression and SVM**.

> `MultinomialNB` requires **non-negative** features. It works with BoW and TF-IDF; it will
> fail on Word2Vec vectors (§6).

---

## 5. Approach B — TF-IDF + Multinomial Naive Bayes

Identical except for the vectorizer:

```python
from sklearn.feature_extraction.text import TfidfVectorizer

tv = TfidfVectorizer(max_features=2500, ngram_range=(1,2))
X_train_tfidf = tv.fit_transform(X_train).toarray()
X_test_tfidf  = tv.transform(X_test).toarray()

model_tfidf = MultinomialNB().fit(X_train_tfidf, y_train)
y_pred_tfidf = model_tfidf.predict(X_test_tfidf)

print(accuracy_score(y_test, y_pred_tfidf))     # ≈ 0.97
print(classification_report(y_test, y_pred_tfidf))
```

```
              precision    recall  f1-score   support
           0       0.97      1.00      0.98       966
           1       1.00      0.79      0.88       149
    accuracy                           0.97      1115
```

### ⚠️ TF-IDF scored *lower* than BoW. Why?

A genuinely useful result, and a good interview answer:

1. **Naive Bayes is a count model.** `MultinomialNB` assumes multinomial counts; TF-IDF's
   normalised fractional weights violate that assumption. Pair TF-IDF with **Logistic
   Regression or LinearSVC** instead and it usually wins.
2. **Messages are very short.** TF-IDF's advantage is down-weighting words that saturate long
   documents. In a 12-word SMS, term frequency ≈ presence, so there is little for TF-IDF to
   add.
3. **Precision 1.00, recall 0.79.** TF-IDF became *more conservative* — never a false alarm,
   but it missed 21% of spam. Different operating point, not strictly worse.

**The lesson: match the vectorizer to the classifier.** There is no globally best choice.

```python
from sklearn.linear_model import LogisticRegression
lr = LogisticRegression(max_iter=1000).fit(X_train_tfidf, y_train)
print(classification_report(y_test, lr.predict(X_test_tfidf)))   # TF-IDF now shines
```

---

## 6. Approach C — Average Word2Vec + Random Forest

```python
import numpy as np
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess
from nltk.stem import WordNetLemmatizer
```

This time use **lemmatization** and **keep the stopwords**, so Word2Vec can learn from the
full context (Word2Vec's whole premise is that context words carry information — stripping
them removes the signal it learns from):

```python
lemmatizer = WordNetLemmatizer()
corpus_w2v = []
for i in range(len(messages)):
    review = re.sub('[^a-zA-Z]', ' ', messages['message'][i]).lower().split()
    review = [lemmatizer.lemmatize(w) for w in review]       # NO stopword removal
    corpus_w2v.append(' '.join(review))

# gensim needs a LIST OF TOKEN LISTS
words = [simple_preprocess(sent)
         for doc in corpus_w2v
         for sent in nltk.sent_tokenize(doc)]

model = Word2Vec(words, vector_size=100, window=5, min_count=2, epochs=10)

model.wv.index_to_key[:10]              # vocabulary
model.corpus_count                      # 5569 ← note: not 5572
model.wv['good'].shape                  # (100,)
model.wv.similar_by_word('good')
```

### 🐛 The bug: 5,569 rows, not 5,572

```python
X_new.shape      # (5569, 100)
y.shape          # (5572,)      ← MISMATCH
```

**Three rows vanished.** Find them:

```python
for i, (n, doc, msg) in enumerate(zip(map(len, corpus_w2v), corpus_w2v, messages['message'])):
    if n < 1:
        print(i, repr(msg))
```
```
1  '645'
2  '08714712388 between 10am-7pm Cost 10p'
3  '07946746291/07880867867'
```

Messages made entirely of **digits and punctuation**. `re.sub('[^a-zA-Z]', ' ', ...)` strips
every character, leaving an empty string, which produces no word vectors, so
`np.mean([], axis=0)` returns `NaN`.

**Three fixes, best first:**

```python
# (a) keep digits — arguably the real fix, since numbers ARE spam signal
review = re.sub('[^a-zA-Z0-9]', ' ', messages['message'][i])

# (b) return zeros instead of NaN
def avg_w2v(doc):
    vecs = [model.wv[w] for w in doc if w in model.wv.index_to_key]
    return np.mean(vecs, axis=0) if vecs else np.zeros(model.vector_size)

# (c) drop the rows — from X AND y together, never separately
mask = np.array([len(d) > 0 for d in words])
X, y_aligned = X_new[mask], y[mask]
```

> **Option (a) is worth thinking about.** `"Free entry, call 87121 now"` — the phone number
> is one of the strongest spam signals in the dataset, and `[^a-zA-Z]` deletes it. Stripping
> digits reflexively can cost real accuracy.

### Averaging and training

```python
from tqdm import tqdm

X = np.vstack([avg_w2v(doc) for doc in tqdm(words)])
X.shape                                  # (5572, 100) with fix (b)

from sklearn.ensemble import RandomForestClassifier

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y)

clf = RandomForestClassifier(n_estimators=200, random_state=42).fit(X_train, y_train)
y_pred = clf.predict(X_test)

print(accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
```

### Why Random Forest and not Naive Bayes here?

```python
MultinomialNB().fit(X_train, y_train)
# ValueError: Negative values in data passed to MultinomialNB (input X)
```

Word2Vec vectors contain **negative numbers**; `MultinomialNB` requires non-negative counts.
For dense embeddings use **Random Forest, Logistic Regression, SVM or `GaussianNB`.**

```
   SPARSE count features (BoW, TF-IDF)  ──▶  MultinomialNB, LinearSVC, LogisticRegression
   DENSE embeddings (Word2Vec)          ──▶  RandomForest, LogisticRegression, SVM, GaussianNB
```

**This is a real modelling decision, not trivia.** Feature type constrains model choice.

---

## 7. Results

| Approach | Vectorizer | Model | Features | Accuracy | Spam F1 |
|---|---|---|---|---|---|
| **A** | Bag of Words `(1,2)`, binary | MultinomialNB | 2,500 sparse | **≈0.98** | **≈0.93** |
| **B** | TF-IDF `(1,2)` | MultinomialNB | 2,500 sparse | ≈0.97 | ≈0.88 |
| **C** | Average Word2Vec | RandomForest | 100 dense | ≈0.97 | ≈0.90 |

*(Exact figures shift with `random_state` and preprocessing choices — the pattern is what matters.)*

### What the table actually teaches

**1. The simplest method won.** BoW + Naive Bayes, the oldest technique here, beat Word2Vec.
Do not assume sophistication equals accuracy.

**2. Why?** Spam detection is nearly a **keyword problem**. `free`, `win`, `claim`, `txt`,
`prize` — their *presence* is the signal. You do not need to know what "free" *means*; you
need to know it is there. BoW captures presence perfectly.

**3. Word2Vec's strengths do not pay off here.** Semantic similarity helps when meaning
matters (paraphrase detection, sentiment nuance). For keyword spotting it adds nothing, and
averaging 100 dims actively **destroys** the "this exact word is present" signal that BoW
preserves.

**4. Compression.** Approach C used **100 features** vs 2,500, for near-identical accuracy —
25× smaller, dense, no sparsity. On a bigger or more nuanced dataset that pays off (note 18).

> **The real lesson: always run the simple baseline first.** If BoW + Naive Bayes gets you
> 98% in ten seconds, a heavier model must justify itself against that number.

---

## 8. Where to take it further

1. **Replace stemming with lemmatization** in approach A and compare. Does it help?
2. **Use the Google pre-trained Word2Vec** (300-dim) instead of training your own on 5,572
   messages — more data, better vectors.
3. **Tune with `GridSearchCV`** over `max_features`, `ngram_range`, `binary`, and `alpha`.
4. **Try `[^a-zA-Z0-9]`** so phone numbers survive. Measure the difference.
5. **Optimise precision, not accuracy** — `scoring='precision'` — because false positives
   cost the most.
6. **Handle the imbalance** with `class_weight='balanced'` or SMOTE **on the training split
   only**.

---

## 9. Self-check

1. Why is 98% accuracy on this dataset less impressive than it sounds?
2. Why did TF-IDF underperform BoW with Naive Bayes?
3. Why did three rows disappear in approach C, and what is the cleanest fix?
4. Why can't you use `MultinomialNB` with average Word2Vec features?
5. BoW beat Word2Vec. Why, given that Word2Vec is the more advanced technique?
6. For a spam filter, do you optimise precision or recall? Why?

<details>
<summary>Answers</summary>

1. 86.6% of messages are ham, so always predicting "ham" scores 86.6% for free. The real
   measure is spam-class precision/recall/F1 and the confusion matrix.
2. `MultinomialNB` assumes multinomial **counts**; TF-IDF's normalised fractional weights
   break that assumption. Also, SMS messages are too short for IDF to add much. Pair TF-IDF
   with Logistic Regression instead.
3. Three messages were only digits/punctuation; `re.sub('[^a-zA-Z]',' ',...)` emptied them,
   so `np.mean([])` gave `NaN`. Cleanest fix: keep digits (`[^a-zA-Z0-9]`), or return
   `np.zeros(vector_size)` for empty documents.
4. Embedding vectors contain negative values; `MultinomialNB` requires non-negative
   count-like features. Use RandomForest / LogisticRegression / SVM / GaussianNB.
5. Spam detection is a keyword-presence problem, which BoW models exactly. Semantic
   similarity adds nothing, and averaging dilutes the "this word is present" signal.
6. **Precision** — a false positive puts a real message in the spam folder where the user
   never sees it. Missing some spam is merely annoying.

</details>

---

**Next:** [18 — Project 2: Kindle Review Sentiment](18-Project-Kindle-Review-Sentiment.md) —
a messier dataset with URLs, HTML and a much harder target.
