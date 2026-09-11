---
title: "15 — Average Word2Vec"
description: Word2Vec gives one vector per word, but classifiers need one per sentence. The averaging step, its implementation, its pitfalls, and the better alternatives.
---

# 15 — Average Word2Vec

---

## 1. The problem

Word2Vec is excellent — and, on its own, **unusable for classification.** Here is why.

```
   Sentence: "the food is good"          label: 1

   Word2Vec gives:
       the   →  [300 numbers]
       food  →  [300 numbers]
       is    →  [300 numbers]
       good  →  [300 numbers]
                 ─────────────
                 a 4 × 300 MATRIX for one sentence
```

But your training table needs **one row per sentence**:

```
        feature vector          label
   S1   [ ??? 300 numbers ]  →    1
   S2   [ ??? 300 numbers ]  →    0
```

And sentence lengths vary:

```
   "the food is good"                    →  4 × 300
   "pizza is amazing and the service"    →  6 × 300      ← different shape again
```

**This is note 09's fixed-size-input problem, returning in a new costume.** Bag of words
solved it by producing one vector per *document*; Word2Vec went back to one per *word*.

---

## 2. The solution

> **Average all the word vectors in the sentence, element by element.**

```
   the    [0.2, 0.5, 0.1, ... ]  ┐
   food   [0.8, 0.3, 0.6, ... ]  │  average
   is     [0.1, 0.4, 0.2, ... ]  │  column by
   good   [0.9, 0.7, 0.5, ... ]  ┘  column
   ────────────────────────────────────────────
   S1     [0.5, 0.475, 0.35, ...]   ← ONE 300-dim vector for the whole sentence
```

Concretely, for dimension 0: `(0.2 + 0.8 + 0.1 + 0.9) / 4 = 0.5`. Repeat for all 300.

**Key property: the result is 300-dimensional regardless of sentence length.** Average 4
vectors or 40 — you always get 300 numbers.

```
   "the food is good"                 4 × 300  ──average──▶  1 × 300
   "pizza is amazing and the service" 6 × 300  ──average──▶  1 × 300
   "ok"                               1 × 300  ──average──▶  1 × 300
                                                              ↑ always
```

Now you can build the table:

```
        300 dense features             label
   S1   [0.5, 0.475, 0.35, ...]   →      1
   S2   [0.3, 0.612, 0.21, ...]   →      0
   S3   [0.7, 0.334, 0.48, ...]   →      1
```

That is a perfectly ordinary ML dataset. **Train any classifier you like on it.**

---

## 3. Why averaging is a defensible thing to do

It sounds crude. Two reasons it works:

1. **Word vectors are meaningful directions.** Averaging several of them lands you in the
   region of space those words share. A sentence full of `delicious, wonderful, amazing`
   averages to a point in "positive food" territory; one full of `terrible, awful, refund`
   averages somewhere else entirely. **The classifier only needs those regions to be
   separable.**

2. **Semantic information survives.** Two different sentences that *mean* the same thing —
   `"great movie"` and `"excellent film"` — contain words that are already close in the
   space, so their averages are close too. **TF-IDF gave those sentences zero overlap; the
   average embedding gives them high similarity.** That is the concrete win.

---

## 4. Implementation

### The function

```python
import numpy as np

def avg_word2vec(doc, model):
    """doc: list of tokens. Returns one vector = the mean of known word vectors."""
    return np.mean(
        [model.wv[word] for word in doc if word in model.wv.index_to_key],
        axis=0
    )
```

Two details that matter:

- **`if word in model.wv.index_to_key`** — skips out-of-vocabulary words. Without this guard
  a single unknown word raises `KeyError` and kills the loop.
- **`axis=0`** — average **down the columns** (across words), not across dimensions.
  `axis=1` would collapse each word to a single scalar: silently wrong, no error.

```
   axis=0  ↓ average down this way  ✅        axis=1  → average across  ❌
   [0.2, 0.5, 0.1]                            [0.2, 0.5, 0.1] → 0.27
   [0.8, 0.3, 0.6]                            [0.8, 0.3, 0.6] → 0.57
   ───────────────                            gives one number per WORD — wrong
   [0.5, 0.4, 0.35]  ← 300-dim result
```

### Applying it to a corpus

```python
from tqdm import tqdm

X = []
for doc in tqdm(words):            # words = list of token-lists
    X.append(avg_word2vec(doc, model))

X_new = np.array(X)
X_new.shape                        # (5569, 100)
```

`tqdm` is worth the import — on tens of thousands of documents you want to see progress
rather than stare at a blank cell.

### Then to a DataFrame

```python
import pandas as pd

df = pd.DataFrame()
for i in range(len(X)):
    df = pd.concat([df, pd.DataFrame(X[i].reshape(1, -1))], ignore_index=True)

df.shape        # (5569, 100)
```

**Why `.reshape(1, -1)`?** Each `X[i]` has shape `(100,)` — a 1-D array. A DataFrame needs
2-D. `reshape(1, -1)` turns it into `(1, 100)`: one row, 100 columns. `-1` means "work the
remaining dimension out yourself".

> **Do it the fast way instead.** The loop above is O(n²) — `pd.concat` copies the whole
> frame every iteration and takes minutes on 5,000 rows. This is one line and instant:
> ```python
> df = pd.DataFrame(np.vstack(X))     # same result, ~1000× faster
> ```

---

## 5. ⚠️ Three pitfalls that will bite you

### Pitfall 1 — empty documents produce `NaN`

```python
np.mean([], axis=0)     # nan   (+ a RuntimeWarning)
```

A document becomes empty when cleaning removed everything — a message of only digits and
`re.sub('[^a-zA-Z]',' ',...)`, or an all-stopword sentence. The `NaN` row then propagates:

```
   ValueError: Input contains NaN, infinity or a value too large for dtype('float32')
```

sklearn raises this at `fit()` time, far from the actual cause. **Guard at the source:**

```python
def avg_word2vec(doc, model):
    vecs = [model.wv[w] for w in doc if w in model.wv.index_to_key]
    if len(vecs) == 0:
        return np.zeros(model.vector_size)      # all-zeros instead of NaN
    return np.mean(vecs, axis=0)
```

Or clean up afterwards:

```python
df['Output'] = y
df.dropna(axis=0, inplace=True)     # axis=0 → drop ROWS containing NaN
X = df.drop('Output', axis=1)
y = df['Output']
```

> **Attach `y` to the DataFrame *before* dropping**, as above. Dropping rows from `X` alone
> silently desynchronises it from `y`, and every prediction afterwards is against the wrong
> label.

### Pitfall 2 — X and y going out of sync

The classic version of this bug, straight from the spam project:

```python
len(messages)    # 5572   ← original rows
X_new.shape      # (5569, 100)   ← only 5569 survived
y.shape          # (5572,)       ← MISMATCH
```

Three messages consisted only of digits (`"645"`), and `re.sub('[^a-zA-Z]', ' ', ...)`
reduced them to empty strings, which produced no vectors.

**Find them:**

```python
for i, (length, doc, msg) in enumerate(zip(map(len, corpus), corpus, messages['message'])):
    if length < 1:
        print(i, repr(msg))
# 1: '645'  →  ''
```

**Fix by filtering `y` with the *same* mask used on `X`:**

```python
mask = [len(doc) > 0 for doc in corpus]
y = pd.get_dummies(messages.loc[mask, 'label'], drop_first=True).values.ravel()
```

> **The general rule: any row you drop from X, drop from y in the same operation.** Build the
> mask once and apply it to both.

### Pitfall 3 — averaging destroys word order *and* negation

```
   "the food is good"      →  average of [the, food, is, good]
   "the food is not good"  →  average of [the, food, is, not, good]
```

The two averages differ only by the contribution of one word out of five — **exactly the
problem from note 10, unchanged.** Averaging is order-blind by construction.

**Mitigations:**
- **Keep negations** out of your stopword list (note 06), so `not` at least contributes.
- **TF-IDF-weighted averaging** (§7) so meaningful words dominate the mean.
- **Do not average at all** — use an RNN/LSTM or Transformer, which reads the sequence.

---

## 6. What averaging does and does not fix

| Problem | Word2Vec alone | **Average Word2Vec** |
|---|---|---|
| Fixed-size input | ❌ (n × 300 per sentence) | ✅ **always 300** |
| Dense vectors | ✅ | ✅ |
| Semantic meaning | ✅ | ✅ (mostly preserved) |
| Word order | ❌ | ❌ |
| Negation | ❌ | ❌ |
| Long documents | — | ⚠️ **degrades** |

### Why long documents degrade

Averaging 500 word vectors pulls everything towards the corpus mean — all long documents
start looking alike. **Average Word2Vec is at its best on short texts**: SMS, tweets,
review sentences, search queries. For long documents prefer Doc2Vec, TF-IDF-weighted
averaging, or a transformer sentence encoder.

---

## 7. Better alternatives to a plain mean

### (a) TF-IDF-weighted average

Weight each word vector by that word's TF-IDF score, so informative words dominate:

```python
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

tfidf  = TfidfVectorizer()
tfidf.fit(corpus_strings)
idf_of = dict(zip(tfidf.get_feature_names_out(), tfidf.idf_))
default_idf = max(tfidf.idf_)              # unseen word → treat as maximally rare

def tfidf_weighted_w2v(doc, model):
    vecs, weights = [], []
    for w in doc:
        if w in model.wv.index_to_key:
            vecs.append(model.wv[w])
            weights.append(idf_of.get(w, default_idf))
    if not vecs:
        return np.zeros(model.vector_size)
    return np.average(vecs, axis=0, weights=weights)
```

Usually a small but consistent improvement — `the` stops counting as much as `refund`.

### (b) Doc2Vec — learn the document vector directly

```python
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

tagged = [TaggedDocument(doc, [i]) for i, doc in enumerate(sentences)]
d2v    = Doc2Vec(tagged, vector_size=100, window=5, min_count=2, epochs=40)
d2v.dv[0]        # the learned vector for document 0
```

Doc2Vec adds a trainable "document ID" vector to the Word2Vec architecture, so the document
representation is **learned** rather than derived. Better on long documents.

### (c) Sentence transformers — the modern answer

```python
from sentence_transformers import SentenceTransformer
sbert = SentenceTransformer('all-MiniLM-L6-v2')
X = sbert.encode(corpus_strings)     # (n_docs, 384), order-aware, context-aware
```

Handles negation and word order properly because it is a transformer. If you are building
something today rather than studying for an exam, **this is what you use.**

---

## 8. The complete pipeline

```python
import numpy as np, pandas as pd
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# 1. tokenize  (list of lists — see note 14's warning)
sentences = [simple_preprocess(doc) for doc in corpus]

# 2. train Word2Vec
model = Word2Vec(sentences, vector_size=100, window=5, min_count=2, epochs=10)

# 3. average to one vector per document
def avg_w2v(doc):
    vecs = [model.wv[w] for w in doc if w in model.wv.index_to_key]
    return np.mean(vecs, axis=0) if vecs else np.zeros(model.vector_size)

X = np.vstack([avg_w2v(doc) for doc in sentences])   # (n_docs, 100)

# 4. keep y aligned with X
mask = np.array([len(d) > 0 for d in sentences])
X, y = X[mask], np.asarray(y)[mask]

# 5. ordinary machine learning from here
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier(n_estimators=200, random_state=42).fit(X_train, y_train)
y_pred = clf.predict(X_test)

print(accuracy_score(y_test, y_pred))
print(classification_report(y_test, y_pred))
```

> **Why Random Forest and not Multinomial Naive Bayes here?** `MultinomialNB` assumes
> **non-negative count-like** features. Word2Vec vectors contain negative numbers, so it
> will raise an error. For dense embeddings use Random Forest, Logistic Regression, SVM, or
> `GaussianNB`. Matching the model to the feature type is a real decision, not a detail.

---

## 9. Self-check

1. Word2Vec gives 300 numbers per word. Why can't you feed a 10-word sentence straight to a classifier?
2. Average a 4-word and a 40-word sentence with a 100-dim model. What shapes come out?
3. What does `axis=0` do in `np.mean`, and what breaks if you use `axis=1`?
4. Your X has 5,569 rows and y has 5,572. What happened, and how do you fix it properly?
5. Why does `MultinomialNB` fail on average-Word2Vec features?
6. Name two techniques better than plain averaging, and say when each wins.

<details>
<summary>Answers</summary>

1. It produces a **10 × 300 matrix**, and a different sentence gives a different number of
   rows. Classifiers need one fixed-length row per sample.
2. **Both `(100,)`** — that length-independence is the entire point.
3. `axis=0` averages **down the columns** (across words), giving one vector of length
   `vector_size`. `axis=1` averages across dimensions, giving one number per word — wrong
   shape, no error raised, silently broken model.
4. Three documents became empty after cleaning and produced no vectors. Build a boolean mask
   of non-empty documents and apply it to **both** X and y in the same step (or attach y to
   the DataFrame before `dropna`).
5. It assumes non-negative, count-like features; embeddings contain negative values. Use
   Random Forest, Logistic Regression, SVM, or `GaussianNB`.
6. **TF-IDF-weighted averaging** (cheap, lets informative words dominate) and **sentence
   transformers / Doc2Vec** (order- and context-aware; best on long or negation-heavy text).

</details>

---

**Next:** [16 — Best Practices & Data Leakage](16-Best-Practices-and-Data-Leakage.md) — the
one ordering mistake that invalidates results, before we start the projects.
