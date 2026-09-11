---
title: "10 — Bag of Words"
description: One vector per document instead of per word. Hand-worked example, CountVectorizer in full, binary vs count mode, max_features, and the two problems it still cannot solve.
---

# 10 — Bag of Words (BoW)

---

## 1. The one change that fixes everything

One-hot encoding gave you **one vector per word**, which is why document shapes differed.
Bag of words gives you:

> **One vector per DOCUMENT, of length = vocabulary size.**

```
   ONE-HOT                              BAG OF WORDS
   "the food is good"  →  4 × 7         "the food is good"  →  1 × 7
   "pizza is amazing"  →  3 × 7         "pizza is amazing"  →  1 × 7
                          ↑ mismatch                            ↑ always the same
```

Every document, whatever its length, becomes **exactly V numbers**. Fixed-size input,
solved. That is the whole idea.

The name is literal: you throw all the words of a document into a bag and shake it. You
record **which words are in the bag and how many** — and you lose **the order they were in**.
That loss is the price, and note 11 (n-grams) is how you buy some of it back.

---

## 2. Worked by hand

### Step 1 — the raw data

| | Sentence | Output |
|---|---|---|
| **S1** | He is a good boy | 1 |
| **S2** | She is a good girl | 1 |
| **S3** | Boy and girl are good | 1 |

### Step 2 — clean (lowercase + stopwords)

```
S1: "He is a good boy"       → he, is, a  are stopwords → "good boy"
S2: "She is a good girl"     → she, is, a are stopwords → "good girl"
S3: "Boy and girl are good"  → and, are  are stopwords  → "boy girl good"
```

Lowercasing matters here: without it, `Boy` (S3) and `boy` (S1) would be **two different
columns** for the same word.

### Step 3 — vocabulary with frequencies, sorted descending

| Word | Appears in | Frequency |
|---|---|---|
| **good** | S1, S2, S3 | **3** |
| **boy** | S1, S3 | **2** |
| **girl** | S2, S3 | **2** |

Sorting by frequency is not cosmetic — it is what makes `max_features` meaningful (§5).

### Step 4 — the vectors

Each vocabulary word becomes a **column**; each sentence becomes a **row**:

```
            good   boy   girl          output
   S1  [     1      1     0     ]  →     1
   S2  [     1      0     1     ]  →     1
   S3  [     1      1     1     ]  →     1

   shape = 3 × 3        every row the same width ✅
```

Read S1: *"good boy"* contains `good` ✅ and `boy` ✅ but not `girl` ❌ → `[1,1,0]`.

### Step 5 — repeated words

What if S1 were **"good boy good"**?

```
   NORMAL BoW  :  [2, 1, 0]     ← "good" appeared twice, so the count is 2
   BINARY BoW  :  [1, 1, 0]     ← presence only; any count > 0 becomes 1
```

| | Normal BoW | Binary BoW |
|---|---|---|
| Cell value | **count** of the word in the document | **1 if present, 0 if not** |
| Question it answers | "how many times?" | "was it there at all?" |
| Better for | long documents, topic modelling | **short documents** (SMS, tweets) |

For short texts, a word appearing twice is usually not twice as meaningful, so binary often
works better — which is why note 17's spam project uses `binary=True`.

---

## 3. `CountVectorizer` — the implementation

```python
from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd

corpus = ["good boy", "good girl", "boy girl good"]

cv = CountVectorizer()
X  = cv.fit_transform(corpus).toarray()

print(cv.get_feature_names_out())   # ['boy' 'girl' 'good']
print(X)
```
```
[[1 0 1]
 [0 1 1]
 [1 1 1]]
```

```python
pd.DataFrame(X, columns=cv.get_feature_names_out(), index=['S1','S2','S3'])
```
```
    boy  girl  good
S1    1     0     1
S2    0     1     1
S3    1     1     1
```

> **Note the column order.** sklearn sorts feature names **alphabetically**, not by
> frequency. Frequency ordering is used internally for `max_features` selection, but the
> output columns come back alphabetical. Do not expect your hand-drawn column order.

### `fit_transform` vs `transform` — read this twice

| Method | What it does | Use on |
|---|---|---|
| **`fit_transform(X)`** | **Learns** the vocabulary from X, *then* vectorizes X | **training data only** |
| **`transform(X)`** | Uses the **already-learned** vocabulary to vectorize X | **test data, and all future data** |

```python
X_train_bow = cv.fit_transform(X_train).toarray()   # ✅ learn + apply
X_test_bow  = cv.transform(X_test).toarray()        # ✅ apply only
```

Calling `fit_transform` on the test set is **data leakage** — the vocabulary would be built
partly from data the model is supposed to have never seen. Note 16 is devoted to this.

### Inspecting the vocabulary

```python
cv.vocabulary_
# {'good': 2, 'boy': 0, 'girl': 1}       word → COLUMN INDEX (not a count!)

cv.get_feature_names_out()
# array(['boy', 'girl', 'good'], dtype=object)
```

`vocabulary_` maps word → **column index**. A common misreading is to treat the number as a
frequency. It is not.

---

## 4. The parameters that matter

```python
CountVectorizer(
    lowercase    = True,     # lowercases for you — you can skip .lower()
    stop_words   = None,     # 'english' uses sklearn's own (different from NLTK's!)
    max_features = None,     # keep only the N most frequent words
    binary       = False,    # True → presence/absence instead of counts
    ngram_range  = (1, 1),   # note 11
    min_df       = 1,        # ignore words appearing in fewer than N documents
    max_df       = 1.0,      # ignore words appearing in more than this fraction of docs
)
```

### `max_features` — the one you will actually tune

```python
cv = CountVectorizer(max_features=2500)
```

> **"Keep only the 2,500 most frequent words; discard the rest."**

Why you need it: a real corpus has tens of thousands of unique words, and the long tail
appears once or twice each. Those columns are almost entirely zeros — pure noise that
inflates dimensionality and invites overfitting.

```python
# spam dataset, 5,572 messages
X = CountVectorizer(max_features=2500).fit_transform(corpus).toarray()
X.shape        # (5572, 2500)   ← 2500 columns, guaranteed

X = CountVectorizer(max_features=100).fit_transform(corpus).toarray()
X.shape        # (5572, 100)
```

The number of columns **always equals `max_features`** (or the vocabulary size, if smaller).

### `binary=True`

```python
cv = CountVectorizer(max_features=100, binary=True)
X  = cv.fit_transform(corpus).toarray()
X.max()      # 1  — never 2, never 3
```

Without it you will see `2`s and `3`s in the matrix; with it, only `0` and `1`.

### `min_df` / `max_df` — the smarter alternative to `max_features`

```python
CountVectorizer(min_df=5,      # word must appear in ≥ 5 documents
                max_df=0.7)    # and in ≤ 70% of documents
```

`min_df` kills typos and one-off names. `max_df` kills corpus-specific stopwords — words so
common in *your* data they carry no signal (e.g. `"phone"` in a phone-review dataset). Often
more principled than a fixed `max_features`, because it is relative to your data.

---

## 5. Advantages

### ✅ 1. Simple and intuitive
Count words. You can explain it to a non-technical stakeholder in one sentence.

### ✅ 2. Fixed-size input — the big one

```
   "hi"                                      →  [0,0,1,0, ... ]   1 × 2500
   "a much longer sentence with many words"  →  [1,0,1,1, ... ]   1 × 2500
```

Any length in, always 2,500 numbers out. **This is what makes ML training possible at all**,
and it is what one-hot could not do.

### ✅ 3. Genuinely effective
Note 17 gets **98% accuracy** on spam detection with BoW + Naive Bayes. It is not a toy.

---

## 6. Disadvantages

### ❌ 1. Sparse matrix persists

Vocabulary of 50,000 → every document is a 50,000-long vector, of which maybe 20 entries are
non-zero. Still 99.96% zeros. Still overfitting risk. Fixed only by embeddings (note 13).

### ❌ 2. Word order is destroyed

This is the defining limitation, right there in the name — a *bag*, not a sequence.

```
   "good boy"     →  [1, 1, 0]
   "boy good"     →  [1, 1, 0]      ← identical
```

Fine here. Devastating here:

```
   "the man bit the dog"   and   "the dog bit the man"
   →  identical vectors, opposite meanings
```

### ❌ 3. No semantic meaning — and the `not` disaster

BoW captures *a bit* more than one-hot (a document vector at least shows co-occurrence), but
it cannot rank importance or relate words. The classic failure:

```
   S1: "the food is good"        →  the=1  food=1  is=1  good=1  not=0   → [1,1,1,1,0]
   S2: "the food is not good"    →  the=1  food=1  is=1  good=1  not=1   → [1,1,1,1,1]
```

**These two vectors differ in exactly one position out of five.** Measure their angle and
they look ~90% similar. But the sentences are **opposites**. A model trained on this will
confuse positive and negative reviews.

```
         S2 ●
            ╲ tiny angle
             ● S1
        ────────────────▶
        "almost identical vectors, completely opposite meanings"
```

Two complementary fixes: **n-grams** (note 11) makes `"not good"` its own feature, and
**Word2Vec** (note 13) gives words real meaning.

### ❌ 4. OOV still unsolved

A test word absent from the training vocabulary is silently dropped:

```
   Train vocabulary:  good, boy, girl
   Test:  "boy girl good school"
                          ↑ no column exists → ignored entirely
```

`transform()` will not error. It just drops the word. That is correct behaviour (you must
not change the feature count), but the information is gone.

---

## 7. Scorecard

| Problem | One-hot | **BoW** | Fixed by |
|---|---|---|---|
| Sparse matrix | ❌ | ❌ | Word2Vec |
| Fixed-size input | ❌ | ✅ | **BoW** |
| Word order | ❌ | ❌ | n-grams (partly), RNN/Transformers (fully) |
| Semantic meaning | ❌ | ⚠️ barely | Word2Vec |
| Out of vocabulary | ❌ | ❌ | Word2Vec |
| **Word importance** | ❌ | ❌ | **TF-IDF (note 12)** |

**1½ out of 6.** Real progress — the fixed-size fix is what makes everything downstream
possible — but four problems remain.

---

## 8. Full worked example on real data

```python
import pandas as pd, re, nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer

messages = pd.read_csv('SMSSpamCollection', sep='\t', names=['label','message'])

ps   = PorterStemmer()
STOP = set(stopwords.words('english'))
corpus = []

for i in range(len(messages)):
    review = re.sub('[^a-zA-Z]', ' ', messages['message'][i])   # strip specials
    review = review.lower().split()                             # lowercase + tokenize
    review = [ps.stem(w) for w in review if w not in STOP]       # stopwords + stem
    corpus.append(' '.join(review))                              # back to a string

cv = CountVectorizer(max_features=2500, binary=True)
X  = cv.fit_transform(corpus).toarray()

X.shape          # (5572, 2500)
X.max()          # 1  (because binary=True)
list(cv.vocabulary_.items())[:5]
```

Every line of that block is reused verbatim in note 17.

---

## 9. Self-check

1. Corpus of 10,000 documents, vocabulary 8,000, `max_features=3000`. What is `X.shape`?
2. Why does `"the man bit the dog"` vectorize identically to `"the dog bit the man"`?
3. When does `binary=True` help, and why?
4. What happens when `transform()` meets an unseen word — error, new column, or silent drop?
5. Why `fit_transform` on train but only `transform` on test?

<details>
<summary>Answers</summary>

1. `(10000, 3000)` — rows = documents, columns = `max_features`.
2. Bag of words records **which** words and **how many**, never their order. Both sentences
   contain the same multiset `{the:2, man:1, bit:1, dog:1}`.
3. Short documents (SMS, tweets) where a repeat does not mean "twice as relevant". It also
   caps the influence of a word someone spammed 20 times.
4. **Silent drop.** The feature count is fixed at fit time and must not change, so unknown
   words are ignored without warning.
5. `fit` learns the vocabulary. Learning it from test data leaks information about the test
   set into the model — see [note 16](16-Best-Practices-and-Data-Leakage.md).

</details>

---

**Next:** [11 — N-Grams](11-N-Grams.md) — recovering some of the word order that the bag
threw away.
