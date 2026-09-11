---
title: "16 — Best Practices & Data Leakage"
description: The single most common mistake in NLP pipelines — vectorizing before splitting — why it inflates your accuracy, and the Pipeline that makes it impossible.
---

# 16 — Best Practices & Data Leakage

---

## 1. The mistake

Here is the order almost every tutorial (and notes 10 and 12 of this course, deliberately)
uses:

```
   ❌ WRONG
   ① Pre-processing & cleaning        (feature engineering)
   ② Convert text → vectors           BoW / TF-IDF on the WHOLE dataset
   ③ train_test_split
   ④ Train the model
```

The correct order swaps ② and ③:

```
   ✅ RIGHT
   ① Pre-processing & cleaning        (feature engineering)
   ② train_test_split                 ← FIRST
   ③ Convert text → vectors           fit on TRAIN only, transform TEST
   ④ Train the model
```

That is the entire note. The rest explains why it matters enough to have a note.

---

## 2. Why it is wrong: data leakage

> **Data leakage** is when information from the test set influences the training process.
> The model then scores well on the test set for a reason that will not exist in production,
> so your reported accuracy is a lie.

### The exam analogy

```
   Your training data  =  the syllabus you study
   Your test data      =  the exam paper

   Vectorizing before splitting  =  glancing at the exam paper while revising
```

You would score brilliantly. That score would tell you nothing about whether you had
learned the subject.

### What specifically leaks

`CountVectorizer.fit()` and `TfidfVectorizer.fit()` **learn things from the data they see**:

| Vectorizer | What `fit()` learns | Leaks when fitted on everything |
|---|---|---|
| `CountVectorizer` | the **vocabulary**, and which words are frequent enough for `max_features` | your feature set is chosen partly using test documents |
| `TfidfVectorizer` | the vocabulary **plus every word's IDF** | the IDF weights encode document frequencies measured over the test set |

TF-IDF is the more serious case. `IDF(w) = log(N / df(w))` is computed across **all N
documents**. Fit on the full dataset and every single feature value in your training matrix
has been influenced by the test documents.

```
   FIT ON EVERYTHING                  FIT ON TRAIN ONLY
   ┌──────────────────────┐           ┌────────────┐  ┌───────────┐
   │  train   +   test    │           │   train    │  │   test    │
   │  ▲                   │           │     ▲      │  │           │
   │  └─ vocabulary & IDF │           │     └─ vocabulary & IDF   │
   │     computed from    │           │        computed here only │
   │     BOTH             │           │                ↓          │
   └──────────────────────┘           └────────────┘  └─ transform only
        ✗ leakage                            ✓ clean
```

---

## 3. The correct code

```python
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer

# ① clean the text first — this part IS safe on the whole dataset (see §4)
corpus = [clean_text(msg) for msg in messages['message']]

# ② SPLIT FIRST — note we split the TEXT, not vectors
X_train, X_test, y_train, y_test = train_test_split(
    corpus, y, test_size=0.20, random_state=42, stratify=y)

# ③ fit on train, transform test
cv = CountVectorizer(max_features=2500, ngram_range=(1,2))
X_train_bow = cv.fit_transform(X_train).toarray()   # fit_transform  ← learns vocabulary
X_test_bow  = cv.transform(X_test).toarray()        # transform ONLY ← reuses it

# ④ train
model.fit(X_train_bow, y_train)
```

### The one-line difference

```python
X_train_bow = cv.fit_transform(X_train).toarray()    # ✅ fit + apply
X_test_bow  = cv.transform(X_test).toarray()         # ✅ apply only

X_test_bow  = cv.fit_transform(X_test).toarray()     # ❌ refits — different columns entirely!
```

Calling `fit_transform` on the test set is doubly wrong: it leaks **and** it produces a
matrix whose columns mean something completely different from the training matrix's columns.
Your model would be reading column 7 as "free" when it was trained with column 7 meaning
"call".

### What happens to unseen test words — and why that is correct

```python
cv.transform(["a brand new unseen word"]).toarray()    # → all zeros for the unknown words
```

Unknown words are silently dropped. **That is the desired behaviour**, because it is exactly
what happens in production: a model deployed today will meet words that did not exist when
it was trained. Fitting on test data hides that reality; transform-only exposes it.

---

## 4. Which steps are safe before the split?

Not everything is leakage. The test is: **does this step learn parameters from the data?**

| Step | Learns from data? | Safe before split? |
|---|---|---|
| Lowercasing | No | ✅ |
| Regex removal of specials/URLs/HTML | No | ✅ |
| Tokenization | No | ✅ |
| Stopword removal (fixed list) | No | ✅ |
| Stemming / lemmatization | No | ✅ |
| **`CountVectorizer` / `TfidfVectorizer`** | **Yes — vocabulary, IDF** | ❌ **fit on train only** |
| **`StandardScaler` / `MinMaxScaler`** | **Yes — mean, std, min, max** | ❌ |
| **Imputation (mean/median fill)** | **Yes — the statistic** | ❌ |
| **`SelectKBest` / feature selection** | **Yes — the scores** | ❌ |
| **SMOTE / oversampling** | **Yes** | ❌ **train only** |
| **Word2Vec training** | **Yes — the embeddings** | ⚠️ train only, to be strict |

> **The rule in one line:** *anything with a `.fit()` method must be fitted on the training
> set only.*

Cleaning is row-independent — lowercasing document 5 does not consult document 6 — so it is
safe anywhere. Vectorizing is corpus-dependent, so it is not.

**On Word2Vec:** strictly, train it on the training split only. In practice, training
embeddings on the full *unlabelled* corpus is widely accepted (it is how pre-trained models
work, and no labels are involved). Know the distinction and be able to defend your choice.

---

## 5. How much does it actually change the number?

Usually **less than you fear, but always in the optimistic direction** — which is the
dangerous direction.

| Situation | Typical inflation |
|---|---|
| Large dataset, plain BoW | ~0–0.5% |
| TF-IDF (IDF computed globally) | 0.5–2% |
| Small dataset (< 1,000 rows) | 2–5% |
| With `SelectKBest` feature selection | **5–15%** |
| With SMOTE applied before splitting | **can be catastrophic** |

The last two are the ones that destroy projects. Feature selection on the full dataset picks
features *because* they separate the test set. SMOTE before splitting can place synthetic
copies of a training point directly into the test set — the model is graded on data it
memorised.

**And the deeper cost is not the number; it is that you can no longer tell whether your model
works.** Every subsequent decision — which vectorizer, which `ngram_range`, which classifier
— is made on a corrupted signal.

---

## 6. The best practice checklist

```
 ① LOAD          →  pd.read_csv(...)
 ② CLEAN         →  lowercase, regex, stopwords, lemmatize     (row-independent: safe)
 ③ ENCODE y      →  labels → 0/1
 ④ SPLIT         →  train_test_split(..., stratify=y, random_state=42)   ◀── HERE
 ⑤ VECTORIZE     →  fit_transform(X_train)  /  transform(X_test)
 ⑥ TRAIN         →  model.fit(X_train_vec, y_train)
 ⑦ EVALUATE      →  accuracy, precision, recall, F1, confusion matrix
```

### Three more habits worth having

**`stratify=y`** — keeps the class ratio identical in train and test. On an imbalanced
dataset, without it a random split can give you a test set with almost no positives:

```python
train_test_split(corpus, y, test_size=0.2, random_state=42, stratify=y)
```

**`random_state=42`** — reproducibility. Without it every run gives a different accuracy and
you cannot tell whether your change helped or the split moved.

**Never look at test-set performance more than you have to.** If you tune `max_features`,
`ngram_range` and the classifier by checking test accuracy each time, you have leaked through
*yourself*. Use cross-validation on the training set, and touch the test set once at the end:

```python
from sklearn.model_selection import cross_val_score
cross_val_score(pipe, X_train, y_train, cv=5, scoring='f1')    # tune against this
```

---

## 7. The bulletproof solution: `Pipeline`

Manual ordering works until you add cross-validation, where each fold needs its own
vectorizer fit. `Pipeline` handles it for you and **makes leakage structurally impossible**.

```python
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import cross_val_score, GridSearchCV

pipe = Pipeline([
    ('tfidf', TfidfVectorizer(max_features=2500, ngram_range=(1,2))),
    ('clf',   MultinomialNB()),
])

# each CV fold fits the vectorizer on that fold's TRAIN portion only — automatically
cross_val_score(pipe, X_train, y_train, cv=5, scoring='f1').mean()

grid = GridSearchCV(pipe, {
    'tfidf__max_features': [1000, 2500, 5000],
    'tfidf__ngram_range':  [(1,1), (1,2)],
    'clf__alpha':          [0.1, 0.5, 1.0],
}, cv=5, scoring='f1', n_jobs=-1)

grid.fit(X_train, y_train)
grid.best_params_
grid.score(X_test, y_test)      # the test set, touched exactly once
```

**Use a `Pipeline` by default.** The double-underscore syntax (`step__parameter`) is how you
reach a parameter inside a step.

---

## 8. Self-check

1. What is data leakage, in one sentence?
2. Why is lowercasing safe before the split but TF-IDF not?
3. What does `cv.transform(X_test)` do with a word that was never in the training vocabulary — and why is that right?
4. You get 99.2% accuracy; a colleague points out you fitted the vectorizer before splitting. Is 99.2% too high or too low?
5. Why is `Pipeline` safer than doing the steps by hand?
6. Your dataset is 95% ham, 5% spam. Which `train_test_split` argument is essential, and why?

<details>
<summary>Answers</summary>

1. Information from the test set influencing training, so the reported score reflects
   something that will not exist in production.
2. Lowercasing is **row-independent** — it needs no knowledge of other documents. TF-IDF
   **fits parameters** (vocabulary, IDF) from the whole corpus, so fitting on everything
   bakes test-set statistics into the training features.
3. **Drops it silently.** Correct, because that is exactly what a deployed model faces —
   and because the feature count must stay fixed.
4. **Too high (optimistically biased).** The honest number is lower; you cannot know by how
   much without redoing it correctly.
5. It refits every `.fit()`-bearing step on the correct subset automatically, including
   inside each cross-validation fold — where manual code almost always leaks.
6. **`stratify=y`.** Without it, a random 20% test split could contain very few spam
   messages, making the score meaningless and unstable.

</details>

---

**Next:** [17 — Project 1: Spam/Ham Classification](17-Project-Spam-Ham-Classification.md) —
everything so far, applied correctly, end to end.
