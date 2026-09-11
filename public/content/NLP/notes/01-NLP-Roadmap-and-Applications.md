---
title: "01 — NLP Roadmap & Real-World Applications"
description: The bottom-to-top learning path from Python to BERT, why each rung exists, and the NLP you already use every day without noticing.
---

# 01 — NLP Roadmap & Real-World Applications

---

## 1. Why NLP exists at all

In ordinary supervised machine learning you have a table:

| f1 (age) | f2 (city) | f3 (salary) | → | y (will churn?) |
|---|---|---|---|---|
| 34 | Pune | 82000 | | 0 |
| 51 | Delhi | 45000 | | 1 |

`f1, f2, f3` are **independent features** (inputs), `y` is the **dependent feature**
(output). You feed the table to a model, the model learns the pattern, done.

Now consider **spam classification**. The features are:

| sender | subject | **body** | → | spam? |
|---|---|---|---|---|
| promo@xyz.com | "YOU WON" | *"Congratulations!! Claim your free ticket now!!!"* | | 1 |

The most informative feature — the body — is **free-form text**. A model cannot multiply
`"Congratulations"` by a weight. Something has to sit between the text and the model and
convert one into the other.

> **NLP, for our purposes, is that something.** It is the set of techniques that turn
> language into numbers while preserving as much meaning as possible.

---

## 2. The roadmap — read it bottom to top

Think of it as a pyramid. You start at the base and climb. **As you climb, accuracy goes
up and so does model size** — that trade-off never goes away.

```
                          ┌──────────────────────────┐
            ▲             │   BERT                   │   biggest, most accurate
            │             ├──────────────────────────┤
     A      │             │   Transformers           │
     C      │             ├──────────────────────────┤
     C      │             │   Word embeddings        │   (trainable, task-specific)
     U      │             ├──────────────────────────┤
     R      │             │   RNN · LSTM · GRU       │   ← deep learning starts here
     A      │             ├──────────────────────────┤     (TensorFlow / PyTorch)
     C      │             │   Word2Vec,              │
     Y      │             │   Average Word2Vec       │   ▲
            │             ├──────────────────────────┤   │ THIS COURSE
     &      │             │   Text pre-processing 2  │   │ (NLTK / spaCy /
            │             │   BoW · TF-IDF · n-grams │   │  scikit-learn / gensim)
     S      │             ├──────────────────────────┤   │
     I      │             │   Text pre-processing 1  │   │
     Z      │             │   tokenize · stem ·      │   │
     E      │             │   lemmatize · stopwords  │   ▼
            │             ├──────────────────────────┤
            │             │   Python                 │   the ground floor
                          └──────────────────────────┘
```

### What each rung actually does

| Rung | Purpose | Library |
|---|---|---|
| **Python** | Everything is written in it. Non-negotiable. | — |
| **Text pre-processing 1** | **Clean the input.** Tokenization, stemming, lemmatization, stopwords. | NLTK, spaCy |
| **Text pre-processing 2** | **Convert text → vectors**, first attempt. Bag of words, TF-IDF, unigrams/bigrams. | scikit-learn |
| **Word2Vec / Avg Word2Vec** | **Convert text → vectors**, much better. Captures meaning. | gensim |
| **RNN / LSTM / GRU** | Sequence models that read text *in order*. | TensorFlow, PyTorch |
| **Word embeddings** | Embedding layers you train for your own task. | TensorFlow, PyTorch |
| **Transformers / BERT** | Attention-based; a word's vector depends on its sentence. | HuggingFace |

### "Steps 2 and 3 both say 'convert text to vectors' — why two rungs?"

Because they do it **at different levels of quality**. Bag of words tells you *which words
appeared*. Word2Vec tells you *what those words mean*. Both produce vectors; only one knows
that *king* and *queen* are related. You learn the weaker one first because:

1. It is simple enough to compute by hand, which builds real intuition.
2. It is genuinely good enough for many production problems (spam filtering, for instance).
3. Its **failures** are exactly what motivates the next technique. The ladder only makes
   sense if you have felt the rung below wobble.

### Where this course stops

**The bottom three rungs** — pre-processing 1, pre-processing 2, and Word2Vec — which is
"NLP for machine learning". Deep-learning NLP (RNN → BERT) is a separate course and needs
ANN fundamentals (forward/backward propagation, loss functions, optimizers) first.

> **Prerequisite warning for note 14:** the CBOW/Skip-gram architectures are neural
> networks. If you have never seen a fully-connected network, loss function and
> backpropagation, read note 14 for the *shape* of the idea and come back later for the
> mechanics.

---

## 3. The libraries, and which to choose

| | **NLTK** | **spaCy** |
|---|---|---|
| Style | Research toolkit — many algorithms, you pick | Opinionated — one good algorithm per task |
| Speed | Slower (pure Python in places) | Fast (Cython) |
| Best for | **Learning**; seeing *why* Porter differs from Snowball | Production pipelines |
| Models | Rule/statistics-based, small downloads | Pre-trained statistical models |

**This course uses NLTK**, deliberately: it exposes each algorithm separately so you can
compare them. Once you know NLTK, spaCy takes an afternoon.

For vectorization: **scikit-learn** (`CountVectorizer`, `TfidfVectorizer`) and **gensim**
(`Word2Vec`, pre-trained model downloads).

---

## 4. NLP you already use every day

Every one of these is "text in → something useful out". Naming them makes the abstract
concrete.

| Application | What is really happening |
|---|---|
| **Gmail autocorrect** | Spelling correction over a language model |
| **Gmail Smart Reply / Smart Compose** | Text generation conditioned on the message you received |
| **LinkedIn suggested replies** | Same idea, short-form classification + generation |
| **Google Translate** | Sequence-to-sequence translation (`"how are you"` → `"क्या हाल है"`) |
| **"See translation" on social posts** | Language detection + translation |
| **Google image/video search for a name** | Text understood, then matched to non-text media |
| **Alexa / Google Assistant** | Speech → text → *intent classification* → action ("do I have a doctor's appointment tomorrow?" hits your calendar) |
| **Spam filters** | Exactly the project in note 17 |
| **Grammarly** | Grammatical error correction |

### The HuggingFace task list — the industry's own taxonomy

If you browse [huggingface.co/models](https://huggingface.co/models), the task categories
*are* the field's job list: **question answering, summarization, text classification,
translation, token classification, text generation.** Thousands of pre-trained models per
task. Google, Microsoft, Intel and Grammarly all publish there.

**Everything on that list is the same shape:** take text, understand it, produce something.
The only thing that changes is what "produce something" means.

---

## 5. What to actually do next

1. Read note 02 (terminology) — it is short and every later note depends on it.
2. Install the setup block from [note 00](00-README-NLP-Index.md#part-3--setup-do-this-once).
3. Work notes 03–08 with [`notebooks/01-text-preprocessing.ipynb`](../notebooks/01-text-preprocessing.ipynb) open beside you.

> **Assignment (do it, it is worth it):** install spaCy, tokenize the same paragraph with
> both NLTK and spaCy, and write down three concrete differences you observe. You will
> understand both libraries better in 20 minutes than from any comparison table.
