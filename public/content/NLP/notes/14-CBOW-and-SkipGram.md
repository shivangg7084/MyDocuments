---
title: "14 — CBOW & Skip-gram: How Word2Vec Is Actually Trained"
description: The neural network behind Word2Vec, layer by layer, with the training pairs built by hand — plus a correction to a very common misconception about window size.
---

# 14 — CBOW & Skip-gram

> **Prerequisite:** a fully-connected neural network, forward/backward propagation, loss
> functions and optimizers. If those are new, read this note for the *shape* of the idea
> (§1–§4 are readable without the maths) and return after an ANN course.

---

## 1. The question this note answers

Note 13 showed you *what* Word2Vec produces — a 300-number vector per word where similar
words sit close together. It did not say **where those numbers come from.** Nobody typed
them. They are the **learned weights of a small neural network**.

The trick that makes it possible:

> **Invent a fake supervised task out of unlabelled text, train a network on it, then throw
> away the task and keep the weights.**

The fake task is *"predict a word from its neighbours"* (CBOW) or *"predict the neighbours
from a word"* (Skip-gram). Nobody cares about the predictions. The **weights** are the prize.

This is called a **self-supervised** or **pretext** task, and it is one of the most important
ideas in modern machine learning — BERT and GPT are built on the same principle.

---

## 2. Step 1 — turn a corpus into training pairs

Our toy corpus (real Word2Vec uses billions of words; 7 keeps it drawable):

```
   "ineuron company is related to data science"
```

**Vocabulary (V = 7):**

```
   ┌─────────┬─────────┬────┬─────────┬────┬──────┬─────────┐
   │ ineuron │ company │ is │ related │ to │ data │ science │
   └─────────┴─────────┴────┴─────────┴────┴──────┴─────────┘
       0         1       2      3       4     5        6
```

### Choose a window size

Let **window size = 5**: look at 5 consecutive words, take the **middle one** as the target
and the **4 surrounding ones** as the context.

> **Use an odd window size.** With an even one there is no middle word, so the context is
> lopsided (3 before, 2 after).

### Slide the window

```
  Position 1:  [ineuron company  IS  related to]  data science
                └─── context ──┘  ↑  └ context ┘
                                target

  Position 2:  ineuron [company is  RELATED  to data]  science
                        └─ context ─┘   ↑   └ context ┘

  Position 3:  ineuron company [is related  TO  data science]
                                └ context ─┘ ↑  └── context ──┘
```

### The resulting dataset

| | **Input (X)** — context | **Output (y)** — target |
|---|---|---|
| 1 | ineuron, company, related, to | **is** |
| 2 | company, is, to, data | **related** |
| 3 | is, related, data, science | **to** |

**You just created a labelled dataset from unlabelled text.** No human annotation. Slide the
window across 100 billion words and you have 100 billion training examples for free.

### Why context on *both* sides?

Because meaning is bidirectional. To know what `is` means in this sentence you need what
came before *and* what comes after. Only looking backwards would learn half the story.

---

## 3. Step 2 — one-hot encode the words

The network needs numbers. Each of the 7 vocabulary words becomes a 7-dimensional one-hot
vector (yes — note 09's technique, now used as a *lookup index*, not as a final
representation):

```
   ineuron  →  [1,0,0,0,0,0,0]
   company  →  [0,1,0,0,0,0,0]
   is       →  [0,0,1,0,0,0,0]
   related  →  [0,0,0,1,0,0,0]
   to       →  [0,0,0,0,1,0,0]
   data     →  [0,0,0,0,0,1,0]
   science  →  [0,0,0,0,0,0,1]
```

---

## 4. CBOW — Continuous Bag of Words

> **Given the surrounding words, predict the middle word.**

```
                 INPUT LAYER            HIDDEN LAYER         OUTPUT LAYER
              (4 words × 7 dims)         (N units)            (7 dims)

   ineuron  ○○○○○○○ ─┐
                      │
   company  ○○○○○○○ ─┤                  ○                    ○  ineuron
                      ├──── W ────▶     ○   ──── W' ────▶    ○  company
   related  ○○○○○○○ ─┤   (7×N)          ○       (N×7)        ○  is   ◀── TARGET
                      │                 ○                    ○  related
   to       ○○○○○○○ ─┘                  ○                    ○  to
                                        ↑                    ○  data
                              average of the 4               ○  science
                              projected contexts                   ↑
                                                              softmax → ŷ
```

### The forward pass

1. Each input word's one-hot vector is multiplied by the **7 × N** weight matrix `W`.
   Because the input is one-hot, this multiplication just **selects one row of `W`** — that
   row *is* the word's embedding.
2. The 4 selected rows are **averaged** into a single N-dimensional hidden vector. (This
   averaging is the "bag" in Continuous Bag of Words — context order is ignored.)
3. The hidden vector is multiplied by the **N × 7** matrix `W'`, giving 7 scores.
4. **Softmax** turns the scores into probabilities `ŷ` over the vocabulary.

### The backward pass

```
   y (truth, "is")       = [0, 0, 1, 0, 0, 0, 0]
   ŷ (prediction)        = [0.25, 0.33, 0.10, 0.09, 0.11, 0.07, 0.05]
                                       ↑ should be near 1.0

   loss = cross-entropy(y, ŷ)
        → backpropagate
        → update W and W'
        → repeat for every window, for every epoch
```

As the loss falls, the rows of `W` arrange themselves so that words appearing in similar
contexts get similar rows. **When training finishes, row `i` of `W` is the embedding of
vocabulary word `i`.** The output layer `W'` is discarded.

```
   W  (7 × N)  after training
   ┌──────────────────────────────────┐
   │ ineuron : [0.92, 0.94, 0.25, ...] │  ← this row IS the word vector
   │ company : [0.88, 0.91, 0.31, ...] │  ← similar row = similar meaning
   │ is      : [0.12, 0.45, 0.88, ...] │
   │ ...                               │
   └──────────────────────────────────┘
```

---

## 5. ⚠️ Correction: window size ≠ embedding dimension

You will frequently hear *"the hidden layer size equals the window size, so a 300-dimensional
Google vector means window size 300."* **That is wrong**, and it will cost you marks and
confuse your code.

They are **two independent hyperparameters**:

| Parameter | What it controls | gensim argument | Typical value |
|---|---|---|---|
| **Window size** | How many neighbouring words count as context | `window=5` | 3–10 |
| **Vector size** | Size of the hidden layer = **length of each word vector** | `vector_size=100` | 50–300 |

```python
from gensim.models import Word2Vec

model = Word2Vec(sentences,
                 vector_size=100,   # ← THIS is the embedding dimension (hidden layer)
                 window=5,          # ← THIS is the context window
                 min_count=1)

model.wv['good'].shape    # (100,)  — comes from vector_size, NOT from window
```

Set `window=5, vector_size=300` and you get 300-dimensional vectors from a 5-word window.
Google's model used roughly `window=5, vector_size=300`.

**Where the confusion comes from:** in a *drawing* of the toy network it is convenient to
sketch the hidden layer with as many circles as the window has words. They are unrelated
quantities that happened to be drawn the same size.

**What is true:** *larger `vector_size` → more expressive vectors (up to a point), and
larger `window` → more "topical" similarity, smaller `window` → more "syntactic"
similarity.*

---

## 6. Skip-gram — CBOW reversed

> **Given the middle word, predict the surrounding words.**

Same corpus, same window, **inputs and outputs swapped**:

| | **Input (X)** | **Output (y)** |
|---|---|---|
| 1 | **is** | ineuron, company, related, to |
| 2 | **related** | company, is, to, data |
| 3 | **to** | is, related, data, science |

```
                  INPUT           HIDDEN            OUTPUT (4 predictions)
                (1 word)         (N units)

                                                    ○○○○○○○  → ineuron
                                    ○               ○○○○○○○  → company
     is  ○○○○○○○ ───── W ────▶      ○  ──── W' ──▶  ○○○○○○○  → related
                      (7×N)         ○      (N×7)    ○○○○○○○  → to
                                    ○
```

### The only differences

| | **CBOW** | **Skip-gram** |
|---|---|---|
| Input | context words | **target word** |
| Output | target word | **context words** |
| Training examples per window | 1 | **4** (one per context word) |
| Speed | **Faster** | Slower |
| Small datasets | **Better** ✅ | Worse |
| Large datasets | Worse | **Better** ✅ |
| Rare words | Poorly represented | **Well represented** ✅ |

### Why Skip-gram handles rare words better

CBOW **averages** the context, so a rare word contributes a small, smoothed-out share of one
prediction. Skip-gram makes the rare word the **input** of several separate predictions, so
it receives full, undiluted gradient updates. More signal per occurrence.

### Choosing

```
   Small corpus (< a few million words),
   want speed, common words matter most     ──────▶   CBOW       (sg=0, the default)

   Large corpus, rare/technical words matter,
   willing to wait                          ──────▶   SKIP-GRAM  (sg=1)
```

```python
Word2Vec(sentences, sg=0)   # CBOW      (default)
Word2Vec(sentences, sg=1)   # Skip-gram
```

---

## 7. How to improve either model

### 1. More training data
The single most effective lever. Google used ~100 billion words. Every doubling of clean,
in-domain text helps more than any hyperparameter tweak.

### 2. Increase `vector_size`
More dimensions = more capacity to encode distinctions. 50 → 100 → 300. Beyond ~300 the
returns flatten and overfitting risk rises on small corpora.

### 3. Tune `window`
```
   window = 2–5   →  syntactic  similarity  ("run" ~ "runs", "ran")
   window = 10+   →  topical    similarity  ("run" ~ "marathon", "athlete")
```
Pick according to whether you want *grammatically* or *topically* similar words.

### 4. More epochs
gensim's default is `epochs=5`. Raising it to 20–50 noticeably improves a small corpus,
at linear cost in time.

### 5. Use negative sampling (already the default)
Computing softmax over a 3-million-word vocabulary for every training example would be
impossibly slow. **Negative sampling** replaces it: update the correct word plus ~5–20
randomly sampled wrong words. Same result, orders of magnitude faster.

```python
Word2Vec(sentences, negative=5)   # 5 negative samples (default); 0 → use hierarchical softmax
```

---

## 8. Training your own model

```python
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess

# gensim expects a LIST OF LISTS OF TOKENS — not a list of strings
sentences = [simple_preprocess(doc) for doc in corpus]
# [['go','until','jurong','point','crazy'], ['ok','lar','joking','wif','u','oni'], ...]

model = Word2Vec(
    sentences,
    vector_size = 100,   # embedding dimension
    window      = 5,     # context window
    min_count   = 2,     # ignore words appearing fewer than 2 times
    workers     = 4,     # CPU threads
    sg          = 0,     # 0 = CBOW, 1 = Skip-gram
    epochs      = 10,
)

model.wv.index_to_key[:10]          # the learned vocabulary
model.corpus_count                  # number of training documents
model.epochs                        # epochs actually run
model.wv['good'].shape              # (100,)
model.wv.most_similar('good')
model.wv.similar_by_word('kid')
```

> **The #1 beginner error:** passing a list of *strings* instead of a list of *token lists*.
> gensim will iterate each string character-by-character and build a vocabulary of single
> letters. If `model.wv.index_to_key` looks like `['e','a','t','o',...]`, that is what
> happened.

### Saving and loading

```python
model.save("word2vec.model")
model = Word2Vec.load("word2vec.model")

model.wv.save_word2vec_format("vectors.txt", binary=False)   # portable text format
```

### Continuing training on new data

```python
model.build_vocab(new_sentences, update=True)
model.train(new_sentences, total_examples=len(new_sentences), epochs=model.epochs)
```

---

## 9. Pre-trained or train your own?

| | **Pre-trained (Google/GloVe)** | **Train your own** |
|---|---|---|
| Data needed | none | **a lot** (≥ millions of words for quality) |
| Time | download only | minutes to hours |
| Vocabulary | 3 million general words | only your corpus's words |
| Domain fit | general English | **your exact domain** |
| Size | 1.6 GB | as small as you like |

```
   General English text, modest dataset      ──────▶  PRE-TRAINED
   Specialised domain (medical, legal, code),
   plenty of in-domain text                  ──────▶  TRAIN YOUR OWN
   Best of both                              ──────▶  start pre-trained, fine-tune
```

A pre-trained news model has never seen your company's product codes or a medical corpus's
drug names. A domain model trained on 50,000 documents will often beat it **on that domain**
despite being far smaller.

---

## 10. Self-check

1. What is the "fake task" Word2Vec trains on, and what do we actually keep?
2. From `"the quick brown fox jumps"` with window 5, write the CBOW input/output pair.
3. Same sentence, same window — write the Skip-gram pairs.
4. `Word2Vec(sentences, window=5, vector_size=200)` — how long is each word vector?
5. Why does Skip-gram represent rare words better?
6. You have 2,000 short product reviews. CBOW or Skip-gram? Pre-trained or your own?

<details>
<summary>Answers</summary>

1. Predicting a word from its context (or vice versa). We keep the **input weight matrix
   `W`** — each of its rows is a word embedding. The predictions and `W'` are discarded.
2. Input = `the, quick, fox, jumps`; Output = `brown` (the middle word).
3. Input = `brown`; Outputs = `the`, `quick`, `fox`, `jumps` — **four** training examples
   from the one window.
4. **200** — `vector_size` sets the dimension. `window` has nothing to do with it.
5. A rare word becomes the network's *input* for several separate predictions and gets full
   gradient updates, rather than being averaged away inside a CBOW context vector.
6. **CBOW** (small dataset, faster, better with limited data) and **pre-trained** embeddings
   — 2,000 short reviews is far too little to learn good vectors from scratch.

</details>

---

**Next:** [15 — Average Word2Vec](15-Average-Word2Vec.md) — the mandatory step that turns
word vectors into sentence vectors.
