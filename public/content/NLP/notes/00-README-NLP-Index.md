---
title: "00 — NLP Study Index: The Whole Subject in One Story"
description: Read this page top to bottom and you already understand what NLP for machine learning is about and how every other note fits into it.
---

# 00 — NLP Study Index

Plain-language notes for the complete **NLP for Machine Learning** course. Read this page
first, top to bottom — by the end of it you will already understand what the subject is
about and *why* each technique exists. The numbered notes then fill in the detail.

---

## Part 1 — The Whole Subject in One Story

### The one problem NLP has to solve

A machine learning model is, underneath, a pile of arithmetic. Linear regression multiplies
numbers by weights. A neural network multiplies matrices. Naive Bayes multiplies
probabilities. **Every single one of them needs numbers as input.**

But your data is this:

```
"Congratulations!! You have WON a free ticket. Claim now!!!"   →  spam
"Hey, are we still on for lunch tomorrow?"                     →  not spam
```

There is no way to multiply `"Congratulations"` by a weight. So before any modelling can
begin, you must answer one question:

> **How do I turn a piece of text into a list of numbers — without throwing away what the
> text actually meant?**

That question *is* this entire course. Every technique in these notes — bag of words,
TF-IDF, Word2Vec — is one more attempt at answering it, each better than the last.

### The pipeline every NLP project follows

```
  Raw text
     │
     │  ┌─────────────────────────────────────────────────┐
     ├─▶│ STEP 1 — Text pre-processing (CLEANING)         │  notes 02–08
     │  │  tokenize · lowercase · regex · stopwords ·     │
     │  │  stemming / lemmatization · POS · NER           │
     │  └─────────────────────────────────────────────────┘
     │
     │  ┌─────────────────────────────────────────────────┐
     ├─▶│ STEP 2 — Train/test split   (DO THIS EARLY!)    │  note 16
     │  └─────────────────────────────────────────────────┘
     │
     │  ┌─────────────────────────────────────────────────┐
     ├─▶│ STEP 3 — Text → vectors     (VECTORIZATION)     │  notes 09–15
     │  │  one-hot · bag of words · n-grams · TF-IDF ·    │
     │  │  Word2Vec · average Word2Vec                    │
     │  └─────────────────────────────────────────────────┘
     │
     │  ┌─────────────────────────────────────────────────┐
     └─▶│ STEP 4 — Train an ML model & evaluate           │  notes 17–18
        │  Naive Bayes · Random Forest · accuracy/F1      │
        └─────────────────────────────────────────────────┘
```

**Steps 1 and 3 are where 90% of the work and 100% of the interesting ideas live.**
Step 4 is ordinary machine learning that you already know.

### The ladder of techniques — and why it is a ladder

Each vectorization method was invented because the one below it failed in a specific way.
**Learn the failures and the whole subject becomes memorable:**

```
        ACCURACY ▲                                    MODEL SIZE ▲
                 │
   BERT /        │  contextual — the same word gets different vectors
   Transformers  │  in different sentences                        (beyond this course)
                 │
   Word2Vec /    │  fixes: sparsity, semantics, fixed dimensions   note 13–15
   embeddings    │  "king − man + woman ≈ queen" actually works
                 │
   TF-IDF        │  fixes: all words treated as equally important  note 12
                 │  rare-but-telling words now score higher
                 │
   Bag of Words  │  fixes: variable-length input                   note 10
                 │  one vector per *sentence*, not per word
                 │
   One-hot       │  the naive starting point — and it breaks       note 09
                 │  in four different ways
                 └────────────────────────────────────────────────────
```

### The four problems that drive the whole ladder

Memorise these four phrases. Every "advantages and disadvantages" question in an exam or
interview is asking about one of them:

| # | Problem | What it means | Fixed by |
|---|---|---|---|
| **1** | **Sparse matrix** | Vectors that are almost entirely zeros. Wastes memory and **leads to overfitting**. | Word2Vec (dense vectors) |
| **2** | **Fixed-size input** | ML models need every row to have the *same* number of columns. One-hot gives different shapes per sentence. | Bag of words, TF-IDF |
| **3** | **No semantic meaning** | The vectors cannot tell you that *"good"* and *"great"* are related, or that *"good"* and *"bad"* are opposites. | Word2Vec |
| **4** | **OOV (out of vocabulary)** | A word appears at test time that was never in the training vocabulary → it is silently dropped. | Word2Vec (largely) |

### The one sentence to take into an interview

> *Bag of words asks "which words appeared?", TF-IDF asks "which words appeared and how
> telling are they?", and Word2Vec asks "what does each word **mean**?"*

---

## Part 2 — The Notes

### Foundations

| # | Note | What it gives you |
|---|---|---|
| 01 | [Roadmap & Real-World Applications](01-NLP-Roadmap-and-Applications.md) | The learning path from Python to BERT, and where NLP is already in your daily life |
| 02 | [Core Terminology](02-Core-Terminology.md) | Corpus, document, vocabulary, word — the four words repeated in every later note |

### Text pre-processing (cleaning the input)

| # | Note | What it gives you |
|---|---|---|
| 03 | [Tokenization](03-Tokenization.md) | Paragraph → sentences → words. Five NLTK tokenizers and how they differ |
| 04 | [Stemming](04-Stemming.md) | Chopping words to a stem. Porter vs Snowball vs RegexpStemmer, and why `history → histori` |
| 05 | [Lemmatization](05-Lemmatization.md) | Dictionary-based root words. Why POS tags change the answer, and the speed trade-off |
| 06 | [Stopwords & the Full Cleaning Pipeline](06-Stopwords-and-Cleaning-Pipeline.md) | Removing filler words — and the one-function pipeline you will reuse in every project |
| 07 | [POS Tagging](07-POS-Tagging.md) | The 36 Penn Treebank tags, and why lemmatization needs them |
| 08 | [Named Entity Recognition](08-Named-Entity-Recognition.md) | Pulling people, places, organisations and money out of raw text |

### Text → vectors (the heart of the course)

| # | Note | What it gives you |
|---|---|---|
| 09 | [One-Hot Encoding](09-One-Hot-Encoding.md) | The naive baseline, hand-computed, plus the four ways it fails |
| 10 | [Bag of Words](10-Bag-of-Words.md) | `CountVectorizer`, binary vs count mode, `max_features`, and what it still gets wrong |
| 11 | [N-Grams](11-N-Grams.md) | How `ngram_range` rescues *"not good"* from looking like *"good"* |
| 12 | [TF-IDF](12-TF-IDF.md) | Term frequency × inverse document frequency, computed by hand and verified in sklearn |
| 13 | [Word Embeddings & Word2Vec](13-Word-Embeddings-and-Word2Vec.md) | Feature representation, cosine similarity, `king − man + woman` |
| 14 | [CBOW & Skip-gram](14-CBOW-and-SkipGram.md) | The actual neural network architecture, layer by layer, weights and all |
| 15 | [Average Word2Vec](15-Average-Word2Vec.md) | The missing step that turns word vectors into *sentence* vectors |

### Practice

| # | Note | What it gives you |
|---|---|---|
| 16 | [Best Practices & Data Leakage](16-Best-Practices-and-Data-Leakage.md) | The single most common mistake in NLP pipelines — and the interview question about it |
| 17 | [Project 1 — Spam/Ham Classification](17-Project-Spam-Ham-Classification.md) | End to end with BoW, TF-IDF and average Word2Vec compared |
| 18 | [Project 2 — Kindle Review Sentiment Analysis](18-Project-Kindle-Review-Sentiment.md) | A messier, larger dataset: URLs, HTML, and what to do when accuracy is bad |

### Notebooks

Run these alongside the notes — every code block in the notes appears here in executable form.

| Notebook | Covers notes |
|---|---|
| [`01-text-preprocessing.ipynb`](../notebooks/01-text-preprocessing.ipynb) | 03–08 |
| [`02-text-to-vectors.ipynb`](../notebooks/02-text-to-vectors.ipynb) | 09–12 |
| [`03-word2vec-gensim.ipynb`](../notebooks/03-word2vec-gensim.ipynb) | 13–15 |
| [`04-spam-ham-project.ipynb`](../notebooks/04-spam-ham-project.ipynb) | 16–17 |
| [`05-kindle-sentiment-project.ipynb`](../notebooks/05-kindle-sentiment-project.ipynb) | 18 |

---

## Part 3 — Setup (do this once)

```bash
pip install nltk scikit-learn gensim pandas numpy beautifulsoup4 lxml tqdm
```

```python
import nltk
for pkg in ["punkt", "punkt_tab", "stopwords", "wordnet", "omw-1.4",
            "averaged_perceptron_tagger", "averaged_perceptron_tagger_eng",
            "maxent_ne_chunker", "maxent_ne_chunker_tab", "words"]:
    nltk.download(pkg)
```

> **Why the `_tab` and `_eng` duplicates?** NLTK 3.8.2+ renamed several data packages.
> Downloading both names means the same code works on old and new NLTK without edits.
> If you see `LookupError: Resource punkt_tab not found`, this cell is the fix.

---

## Part 4 — The 12 questions this course is really asking

Use these as a self-test. If you can answer all twelve, you know the subject.

1. What is tokenization, and what are the two kinds of token?
2. Difference between stemming and lemmatization — output, speed, and when to use each?
3. Why does `PorterStemmer` turn *history* into *histori*, and what fixes it?
4. What is a stopword, and name one case where removing them **hurts**.
5. Why is one-hot encoding unusable for NLP? (Four reasons.)
6. How does bag of words produce a fixed-size input when sentences have different lengths?
7. What is the difference between binary BoW and normal BoW?
8. Write the TF and IDF formulas. What does IDF do to a word appearing in *every* document?
9. Why does `ngram_range=(1,2)` help with the sentence *"the food is not good"*?
10. Draw the CBOW architecture. What is the input, what is the output?
11. Why do you need **average** Word2Vec and not just Word2Vec for text classification?
12. Why must `train_test_split` happen **before** `fit_transform`?

Answers live in notes 03, 04–05, 04, 06, 09, 10, 10, 12, 11, 14, 15, 16 respectively.
