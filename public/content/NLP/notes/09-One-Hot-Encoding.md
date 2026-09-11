---
title: "09 — One-Hot Encoding"
description: The naive way to turn words into vectors, computed by hand, plus the four specific failures that motivate every technique that follows.
---

# 09 — One-Hot Encoding

---

## 1. Where we are

Pre-processing is finished. You have clean text. Now the central problem of the course:

> **Convert text into vectors — numerical representations — such that the meaning survives.**

There are five techniques, learned in order of increasing quality:

```
   ① one-hot encoding   ← this note (the baseline that fails)
   ② bag of words       ← note 10
   ③ TF-IDF             ← note 12
   ④ Word2Vec           ← note 13
   ⑤ average Word2Vec   ← note 15
```

**Nobody uses one-hot encoding for text in practice.** You learn it because its four
failures are precisely what the next four techniques fix, one at a time.

---

## 2. The technique

### The dataset

| | Document | Sentiment |
|---|---|---|
| **D1** | the food is good | 1 |
| **D2** | the food is bad | 0 |
| **D3** | pizza is amazing | 1 |

### Step 1 — build the vocabulary

Collect the unique words across all documents:

```
D1:  the  food  is  good
D2:  the  food  is  bad            ← "the","food","is" repeat → not added again
D3:  pizza  is  amazing            ← "is" repeats

VOCABULARY  (V = 7):
  ┌─────┬──────┬────┬──────┬─────┬───────┬─────────┐
  │ the │ food │ is │ good │ bad │ pizza │ amazing │
  └─────┴──────┴────┴──────┴─────┴───────┴─────────┘
     1      2     3     4      5      6        7
```

### Step 2 — one vector per WORD

Each word becomes a vector of length **V = 7**, with `1` in its own position and `0`
everywhere else:

```
   the      →  [1, 0, 0, 0, 0, 0, 0]
   food     →  [0, 1, 0, 0, 0, 0, 0]
   is       →  [0, 0, 1, 0, 0, 0, 0]
   good     →  [0, 0, 0, 1, 0, 0, 0]
   bad      →  [0, 0, 0, 0, 1, 0, 0]
   pizza    →  [0, 0, 0, 0, 0, 1, 0]
   amazing  →  [0, 0, 0, 0, 0, 0, 1]
```

Hence the name: exactly **one** position is "hot" (set to 1).

### Step 3 — a document is a stack of word vectors

**D1 = "the food is good"** (4 words):

```
        the  food  is  good  bad  pizza  amazing
 the  [  1     0    0    0    0     0       0   ]
 food [  0     1    0    0    0     0       0   ]
 is   [  0     0    1    0    0     0       0   ]
 good [  0     0    0    1    0     0       0   ]

 shape = 4 × 7    (4 words × 7 vocabulary)
```

**D2 = "the food is bad"** — the first three rows are identical to D1; only the last differs:

```
 the  [ 1 0 0 0 0 0 0 ]
 food [ 0 1 0 0 0 0 0 ]
 is   [ 0 0 1 0 0 0 0 ]
 bad  [ 0 0 0 0 1 0 0 ]     ← the 1 moved to position 5

 shape = 4 × 7
```

**D3 = "pizza is amazing"** — only **3** words:

```
 pizza   [ 0 0 0 0 0 1 0 ]
 is      [ 0 0 1 0 0 0 0 ]
 amazing [ 0 0 0 0 0 0 1 ]

 shape = 3 × 7      ⚠️  DIFFERENT FROM THE OTHERS
```

**That shape mismatch is disadvantage #2, and it is fatal.** Hold that thought.

---

## 3. In code

You will not use this for text, but it is worth seeing that it is one line:

```python
import pandas as pd

corpus = ["the food is good", "the food is bad", "pizza is amazing"]
vocab  = sorted({w for doc in corpus for w in doc.split()})

pd.get_dummies(pd.Series(corpus[0].split())).reindex(columns=vocab, fill_value=0)
```

```
   amazing  bad  food  good  is  pizza  the
0        0    0     0     0   0      0    1     ← the
1        0    0     1     0   0      0    0     ← food
2        0    0     0     0   1      0    0     ← is
3        0    0     0     1   0      0    0     ← good
```

Or with sklearn:

```python
from sklearn.preprocessing import OneHotEncoder
import numpy as np

enc = OneHotEncoder(sparse_output=False)
enc.fit(np.array(vocab).reshape(-1, 1))
enc.transform(np.array("the food is good".split()).reshape(-1, 1))
```

---

## 4. Advantages

1. **Easy to implement** — `pd.get_dummies()` or `sklearn.OneHotEncoder`, one line.
2. **Intuitive** — no maths, you can draw it on paper.

That is the complete list.

---

## 5. The four disadvantages (learn these — they drive the rest of the course)

### ❌ 1. Sparse matrix → overfitting

Every vector is **one 1 and V−1 zeros.** With a real vocabulary of 50,000 words:

```
   one word  =  [0, 0, 0, ..., 1, ..., 0, 0]
                 └───── 49,999 zeros ─────┘
```

A matrix that is ~99.998% zeros is a **sparse matrix**. Why it hurts:

- **Memory.** 5,000 documents × 20 words × 50,000 dims = 5 billion numbers, nearly all zero.
- **Overfitting.** With far more features than samples, a model can find a spurious feature
  that happens to separate the training data perfectly and generalises to nothing.
  *(Overfitting = great training accuracy, poor test accuracy.)*

### ❌ 2. No fixed-size input — the fatal one

```
   D1 →  4 × 7
   D2 →  4 × 7
   D3 →  3 × 7      ← different number of rows
```

**Every ML algorithm requires every sample to have the same number of features.** You cannot
`fit()` a model where row 1 has 28 numbers and row 3 has 21. And sentence lengths vary by
definition.

There is no workaround within one-hot encoding. **This alone disqualifies it**, and it is
the first thing bag of words fixes (note 10) by producing **one vector per document**
instead of one per word.

### ❌ 3. No semantic meaning captured

Take three foods:

```
   food   →  [1, 0, 0]
   pizza  →  [0, 1, 0]
   burger →  [0, 0, 1]
```

Plot them in 3-D:

```
              burger (0,0,1)
                 │
                 │
                 └──────── pizza (0,1,0)
                /
               /
          food (1,0,0)

   distance(food, pizza)  = √2
   distance(food, burger) = √2
   distance(pizza, burger)= √2      ← ALL EQUAL
```

Every pair of words is **equidistant**. The encoding cannot express that *pizza* is closer
to *burger* than either is to *democracy*. All relatedness information is destroyed by
construction, because each word is assigned its own orthogonal axis.

That is what "no semantic meaning is captured" means, and it is why note 13's Word2Vec —
where `king − man + woman ≈ queen` actually works — is such a leap.

### ❌ 4. Out of Vocabulary (OOV)

Train on the three documents above; your vocabulary is those 7 words. Now a test sentence
arrives:

```
   TEST:  "burger is bad"
             ↑
        never seen in training
```

There is **no column for `burger`**. You cannot invent one (the model was fitted with 7
features), and you cannot represent the word. It is silently dropped — and it might have
been the most informative word in the sentence.

Real text always contains OOV words: new slang, typos, product names, proper nouns. Bag of
words and TF-IDF **do not fix this**; only embeddings meaningfully do.

---

## 6. Scorecard

| Problem | One-hot | Fixed by |
|---|---|---|
| Sparse matrix → overfitting | ❌ | Word2Vec (note 13) |
| Fixed-size input | ❌ | **Bag of words (note 10)** |
| Semantic meaning | ❌ | Word2Vec (note 13) |
| Out of vocabulary | ❌ | Word2Vec (partly) |

**0 out of 4.** Everything from here on is climbing this table.

> **Where one-hot *is* still used:** ordinary categorical ML features — city, gender,
> product category. A handful of categories, no semantics needed, fixed size by
> construction. The technique is fine; **text** is what it is bad at.

---

## 7. Self-check

1. Vocabulary of 10,000 words, a 15-word sentence. What is the one-hot matrix shape, and how many of its entries are non-zero?
2. Why can't you train a model on D1, D2, D3 above?
3. Prove in one sentence that one-hot captures no semantics.
4. Which disadvantage does bag of words fix, and which does it *not*?

<details>
<summary>Answers</summary>

1. **15 × 10,000 = 150,000** entries, of which exactly **15** are non-zero (0.01%).
2. D1 and D2 are 4 × 7 but D3 is 3 × 7 — inconsistent feature counts. ML models need a
   fixed-size input per sample.
3. Every pair of distinct one-hot vectors is orthogonal and therefore exactly the same
   distance apart, so no pair can be "more similar" than any other.
4. Fixes **fixed-size input** (one vector per document, length = vocabulary size). Does
   **not** fix sparsity, semantics, or OOV.

</details>

---

**Next:** [10 — Bag of Words](10-Bag-of-Words.md) — the first technique you can actually
ship.
