---
title: "13 — Word Embeddings & Word2Vec"
description: Feature representation, dense vectors, cosine similarity, and why king − man + woman ≈ queen actually works.
---

# 13 — Word Embeddings & Word2Vec

---

## 1. The umbrella term

> **A word embedding is any representation of words as real-valued vectors, such that words
> closer in the vector space have closer meanings.** *(Wikipedia, paraphrased)*

By that definition **everything you have learned so far is a word embedding technique.**
They split into two families:

```
                     WORD EMBEDDING TECHNIQUES
                              │
            ┌─────────────────┴──────────────────┐
            │                                    │
   ① COUNT / FREQUENCY BASED           ② DEEP-LEARNING TRAINED
            │                                    │
      one-hot encoding                      Word2Vec
      bag of words                            ├── CBOW
      TF-IDF                                  └── Skip-gram
            │                                  GloVe, FastText
   "how often does the word            "what does the word MEAN,
    appear?"                            judged by its company?"
```

Family ① counts. Family ② **learns**. Everything good about Word2Vec follows from that one
difference.

### What "similar words are close" should look like

```
              happy ●
                     ● excited          "happy" and "excited" land near each other
                                        because they appear in similar contexts

     angry ●                            "angry" lands far away
```

Bag of words cannot do this — `happy` and `excited` share no columns and are therefore
exactly as unrelated as `happy` and `tectonic`.

---

## 2. The core idea: feature representation

Forget neural networks for a moment. Imagine you sat down and **hand-designed** features for
words:

```
              gender    royal     age      food     ...  (300 features total)
   boy        -1.00     0.01     0.03     0.00
   girl       +1.00     0.02     0.02     0.00
   king       -0.92     0.95     0.70     0.00
   queen      +0.93     0.96     0.69     0.00
   apple      -0.05    -0.20     0.65     0.91
   mango       0.23     0.02     0.68     0.92
```

Every word becomes **a point in 300-dimensional space**, where each dimension is some
property. Read the table:

- `boy` is −1 on gender, `girl` is +1 → **opposites on that axis**.
- `king` and `queen` both ≈ 0.95 on royal → **they share royalty**.
- `apple` and `mango` both ≈ 0.9 on food → **they share food-ness**, and both ≈ 0 on gender.
- `boy` and `king` are both negative on gender → **both male**.

Similar words have **similar numbers in the same slots**, so they end up geometrically close.
That is the semantic meaning that one-hot, BoW and TF-IDF could not express.

### The crucial caveat

**Nobody hand-labels these features.** In a real trained Word2Vec model, dimension 47 has no
name — it is whatever the training process found useful. The table above is a *teaching
fiction* that makes the idea concrete. What is real:

| Fiction | Reality |
|---|---|
| Dimension = "gender" | Dimension = an unnamed learned direction |
| Values assigned by a human | Values learned by gradient descent (note 14) |
| 4 interpretable features | 100–300 uninterpretable ones |

What *is* true is that **directions in the space turn out to be meaningful**, which is what
makes §4's arithmetic work.

---

## 3. Dense vs sparse — the shape of the win

```
   BAG OF WORDS (vocabulary 50,000)
   "king" → [0, 0, 0, ..., 1, ..., 0, 0]
             └────── 49,999 zeros ──────┘        SPARSE, 50,000-dimensional

   WORD2VEC (Google pre-trained)
   "king" → [0.125, -0.043, 0.891, ..., 0.234]   DENSE, 300-dimensional
             └── every one of 300 numbers is meaningful ──┘
```

| | BoW / TF-IDF | Word2Vec |
|---|---|---|
| Dimensions | = vocabulary size (10k–100k) | **fixed** (100, 200, 300) |
| Mostly zeros? | Yes — sparse | **No — dense** |
| Grows with vocabulary? | **Yes** | **No** — a million-word vocabulary is still 300 dims |
| Captures meaning? | No | Yes |

**The "fixed set of dimensions" property is easy to undervalue.** With BoW, doubling your
corpus doubles your feature count. With Word2Vec, adding 10 million words to the training
data changes the vocabulary but **not** the 300 dimensions. Model size stays constant.

---

## 4. `king − man + woman ≈ queen`

The famous result from Google's 2013 paper, and the clearest evidence that the vectors
encode real structure.

```
   vec("king")  −  vec("man")  +  vec("woman")   ≈   vec("queen")
```

**Why it works, intuitively:** if one direction in the space corresponds to "royalty" and
another to "gender", then:

```
   king  − man    =  [the royalty direction, roughly]
          ↓ then add the female gender direction
   + woman        =  royalty + female  ≈  queen
```

The relationship *"male → female"* is a **consistent displacement vector** that applies to
many word pairs at once:

```
        man ●─────────────▶● woman
                 (the same
        king ●────────────▶● queen      displacement)

        boy ●─────────────▶● girl
```

The same holds for other relations:

```
   Paris  − France + Italy  ≈  Rome        (capital-of)
   walked − walk   + swim   ≈  swam        (past-tense)
   bigger − big    + small  ≈  smaller     (comparative)
```

**No counting method can produce this.** In BoW, `king` and `queen` are two unrelated
columns; subtracting them is meaningless.

---

## 5. Cosine similarity — how "closeness" is measured

Once words are points in space, "similar" needs a definition. Word2Vec uses the **angle**
between vectors, not the straight-line distance.

```
   cosine similarity = cos(θ),  θ = the angle between the two vectors
   cosine distance   = 1 − cos(θ)
```

| Angle θ | cos θ | Distance `1 − cos θ` | Interpretation |
|---|---|---|---|
| **0°** | 1.0 | **0.0** | identical direction — same meaning |
| 45° | 0.7071 | 0.293 | quite similar |
| **90°** | 0.0 | **1.0** | unrelated (orthogonal) |
| 180° | −1.0 | 2.0 | opposite direction |

```
              ▲
              │     ● king
              │    ╱
              │   ╱ θ = 45°  →  cos θ = 0.707  →  distance = 0.293
              │  ╱                                 "quite similar"
              │ ╱ ● queen
              │╱
              └──────────────▶
                         ● tectonic      θ = 90° → distance = 1.0 → "unrelated"
```

### Why angle and not Euclidean distance?

Because **magnitude carries little meaning while direction carries a lot.** A word appearing
very often can acquire a long vector without being more "meaningful". Cosine ignores length
and compares only orientation — which is exactly the semantic part.

```python
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

### The same idea powers recommendation systems

```
        Avengers ●
                  ● Iron Man          both are action/comic/Marvel
                                      → their feature vectors point the same way
     Documentary ●                    → cosine similarity is high
```

Replace "words" with "movies" and "gender/royal/age" with "action/comedy/romance" and you
have collaborative filtering. **Same mathematics, different nouns.**

---

## 6. Word2Vec in practice — the pre-trained Google model

```python
!pip install gensim
import gensim.downloader as api

wv = api.load('word2vec-google-news-300')      # ~1.6 GB download, be patient
```

| | |
|---|---|
| Trained on | Google News, ~100 billion words |
| Vocabulary | 3 million words and phrases |
| Dimensions | **300** |
| Size on disk | ~1.6 GB |

### Getting a vector

```python
vec_king = wv['king']
vec_king.shape        # (300,)
vec_king[:5]          # array([ 0.125 , 0.0297, 0.1104, 0.0605, -0.0908], dtype=float32)

wv['cricket'].shape   # (300,) — every word, same 300 dimensions
```

### Finding similar words

```python
wv.most_similar('cricket')
```
```
[('cricketing', 0.8372), ('cricketers', 0.8165), ('Test_cricket', 0.8065),
 ('Twenty##_cricket', 0.8004), ('Twenty##', 0.7987), ('Cricket', 0.7749),
 ('cricketer', 0.7749), ('twenty##', 0.7626), ('T##_cricket', 0.7609),
 ('West_Indies_cricket', 0.7526)]
```

```python
wv.most_similar('happy')
# [('glad', 0.741), ('pleased', 0.673), ('ecstatic', 0.660), ('overjoyed', 0.639),
#  ('thrilled', 0.621), ('satisfied', 0.615), ('proud', 0.600), ('delighted', 0.597), ...]
```

**Look at that list.** `glad`, `pleased`, `ecstatic`, `overjoyed` — genuine synonyms of
`happy`, discovered with **no dictionary, no thesaurus, no human labelling.** Purely from
observing which words appear in similar contexts across 100 billion words of news.

### Similarity between two specific words

```python
wv.similarity('hockey', 'sports')    # 0.5342
wv.similarity('king', 'queen')       # 0.6511
wv.similarity('king', 'banana')      # 0.1385
```

### The famous arithmetic, run for real

```python
vec = wv['king'] - wv['man'] + wv['woman']
wv.most_similar([vec], topn=5)
```
```
[('king', 0.8065), ('queen', 0.6896), ('monarch', 0.5575),
 ('princess', 0.5473), ('crown_prince', 0.5386)]
```

`king` comes first (you started from it and moved only a little), but **the first *new* word
is `queen`** — followed by `monarch`, `princess`, `crown_prince`. The neighbourhood is
exactly right.

Or let gensim do the subtraction for you:

```python
wv.most_similar(positive=['king', 'woman'], negative=['man'], topn=3)
# [('queen', 0.7118), ('monarch', 0.6190), ('princess', 0.5902)]
```

---

## 7. Advantages of Word2Vec

### ✅ 1. Dense matrix instead of sparse
300 meaningful numbers, not 50,000 mostly-zeros. **Less overfitting, less memory, faster
training.**

### ✅ 2. Semantic information is captured
`happy → glad, pleased, ecstatic`. Synonyms, antonyms and analogies all fall out of the
geometry.

### ✅ 3. Fixed dimensions, independent of vocabulary
300 dims whether your corpus has 1,000 words or 3 million. **Model size stops growing with
data.**

### ✅ 4. Out-of-vocabulary largely mitigated
The Google model knows 3 million words and phrases, so most test-time words are covered.

⚠️ **Honest caveat:** classic Word2Vec still **fails on words it has genuinely never seen** —
`wv['asdfgh']` raises `KeyError`. It is much better than BoW, not perfect. **FastText** is
the proper fix: it embeds character n-grams, so it can construct a vector for *any* string,
including typos and new words.

```python
try:
    wv['supercalifragilistic']
except KeyError as e:
    print("OOV:", e)          # classic Word2Vec has no answer
```

---

## 8. Remaining limitations

### ❌ 1. One vector per word — no context
```
   "I went to the river bank"      ← bank = riverside
   "I deposited cash at the bank"  ← bank = financial institution
```
Word2Vec assigns `bank` **one** vector, a blurred average of both senses. Fixing this
requires **contextual embeddings** — ELMo, BERT, GPT — where the vector depends on the
sentence. That is the next course.

### ❌ 2. It embeds *words*, not sentences
You need one vector per **document** to train a classifier, but Word2Vec gives you one per
**word**. A 10-word sentence yields a 10 × 300 matrix — variable-sized again, the exact
problem from note 09.

**That is what note 15 (average Word2Vec) solves, and why it is mandatory before any
classification project.**

### ❌ 3. It inherits the bias of its training data
```python
wv.most_similar(positive=['doctor','woman'], negative=['man'])
# often returns 'nurse' near the top
```
The model learned from human-written news. **Real-world harm** follows if such a model is
used in hiring or lending without auditing. Know this before shipping anything.

---

## 9. Scorecard

| Problem | BoW | TF-IDF | **Word2Vec** |
|---|---|---|---|
| Fixed-size input | ✅ | ✅ | ⚠️ needs averaging (note 15) |
| Word importance | ❌ | ✅ | ⚠️ implicit |
| Sparse matrix | ❌ | ❌ | ✅ **dense** |
| Semantic meaning | ❌ | ❌ | ✅ |
| Out of vocabulary | ❌ | ❌ | ⚠️ mostly |
| Dimensions grow with vocabulary | ❌ | ❌ | ✅ **fixed** |
| Context-dependent meaning | ❌ | ❌ | ❌ (needs BERT) |

---

## 10. Self-check

1. Which two families do word embedding techniques split into, and which does TF-IDF belong to?
2. In `[gender, royal, age]` space, why do `king` and `queen` end up close?
3. Cosine distance is 0 / 1 / 0.29 — what does each mean?
4. Why cosine and not Euclidean distance?
5. Give two reasons Word2Vec alone is not enough for text classification.

<details>
<summary>Answers</summary>

1. **Count/frequency based** (one-hot, BoW, TF-IDF) and **deep-learning trained** (Word2Vec,
   GloVe, FastText). TF-IDF is count-based.
2. They agree on almost every dimension (both ≈0.95 royal, both ≈0.7 age) and differ mainly
   on gender, so the angle between them is small.
3. `0` = identical direction (same meaning); `1` = orthogonal (unrelated); `0.29` =
   cos θ ≈ 0.71, θ ≈ 45° — quite similar.
4. Vector **length** reflects frequency/magnitude more than meaning; **direction** carries
   the semantics. Cosine compares direction only.
5. (a) It produces one vector **per word**, so documents come out variable-sized — you need
   averaging (note 15). (b) One vector per word means no context — `bank` has a single
   blurred meaning.

</details>

---

**Next:** [14 — CBOW & Skip-gram](14-CBOW-and-SkipGram.md) — opening the box: the actual
neural network that produces these vectors.
