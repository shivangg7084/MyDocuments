---
title: "02 — Core Terminology: Corpus, Document, Vocabulary, Word"
description: The four words that appear in every other note, defined precisely with a worked counting example.
---

# 02 — Core Terminology

Four terms. They appear in **every** later note, in every formula, and in every interview
question. Ten minutes here saves confusion for the rest of the course.

---

## 1. The four terms

| Term | Definition | In our data |
|---|---|---|
| **Corpus** | The **entire body of text** you are working with. | A paragraph, a book, a whole CSV column, 3 billion Google News words |
| **Document** | **One sentence** (or one record / one review / one email). | One row of your dataset |
| **Vocabulary** | The set of **unique words** across the whole corpus. | The "dictionary" of your dataset |
| **Words** | **Every** word occurrence, repeats included. | The raw token stream |

### The relationship, drawn

```
   CORPUS  (everything)
   ┌────────────────────────────────────────────────────────┐
   │  DOCUMENT 1: "I like to drink apple juice."            │
   │  DOCUMENT 2: "My friend likes mango juice."            │
   └────────────────────────────────────────────────────────┘
              │                              │
              │ split into words             │ collect unique words
              ▼                              ▼
   WORDS (11 total, repeats kept)   VOCABULARY (10 unique)
   I, like, to, drink, apple,       I, like, to, drink, apple,
   juice, My, friend, likes,        juice, My, friend, likes, mango
   mango, juice                     ("juice" counted once)
```

> **The mental shortcut:** *corpus = paragraph, document = sentence, vocabulary = the
> dictionary, words = everything.*

---

## 2. The counting example — do this by hand once

```
"I like to drink apple juice. My friend likes mango juice."
```

**Documents:** 2 (there is one full stop separating them).

**Words — count every occurrence:**

```
Doc 1:  I(1) like(2) to(3) drink(4) apple(5) juice(6)          →  6
Doc 2:  My(7) friend(8) likes(9) mango(10) juice(11)           →  5
                                                     TOTAL = 11 words
```

**Vocabulary — count unique only:**

```
 1. I        4. drink     7. friend    10. mango
 2. like     5. apple     8. likes
 3. to       6. juice     9. My
                                        "juice" appears twice → counted ONCE
                                                     TOTAL = 10 unique words
```

### The trap that catches everyone

`like` and `likes` are **two different vocabulary entries.** A computer compares strings,
not meanings — `"like" != "likes"`. Vocabulary size = **10**.

Now change `likes` → `like` in document 2:

```
"I like to drink apple juice. My friend like mango juice."
                                       ↑
       vocabulary drops to 9 — "like" is now a repeat
```

**This single observation is the entire motivation for stemming and lemmatization**
(notes 04 and 05). Those techniques deliberately collapse `like / likes / liked / liking`
into one entry, because:

- Vocabulary size = **number of columns in your feature matrix**.
- Fewer, more meaningful columns = less sparsity = less overfitting = a better model.

---

## 3. Why vocabulary size dominates everything later

Hold on to this, because notes 09–12 all hinge on it:

```
   vocabulary size  =  number of features (columns) in your X matrix
```

| Vocabulary | Feature matrix for 5,000 sentences | Consequence |
|---|---|---|
| 10 words | 5,000 × 10 | Tiny, dense, but probably too crude |
| 2,500 words | 5,000 × 2,500 | Typical after cleaning + `max_features` |
| 50,000 words | 5,000 × 50,000 | **Mostly zeros** → sparse matrix → overfitting |

Every cleaning step in notes 03–06 exists to **push the vocabulary size down while keeping
the meaning**:

```
  raw text
     │  lowercase          "The" and "the" stop being two entries
     │  remove specials    "good!!!" and "good" stop being two entries
     │  remove stopwords   the/is/a/of never carried meaning anyway
     │  stem or lemmatize  eating/eats/eaten collapse into eat
     ▼
  a vocabulary that is 3–10× smaller, and *better*
```

---

## 4. A caution about "sentence" vs "document"

In this course these are used interchangeably, and that is fine. But note the general rule:

> **A document is one row of your dataset — one thing that gets one label.**

- Spam dataset → one document = one SMS message (which may be several sentences).
- Kindle reviews → one document = one review.
- A research paper corpus → one document = one paper.

When note 12 says *"IDF = log(number of sentences / number of sentences containing the
word)"*, read "sentence" as "document/row". The formula counts **rows**, not grammatical
sentences.

---

## 5. Self-check

Given the corpus:

```
"Hello welcome to NLP tutorials. Please watch the entire course! Learn NLP well."
```

1. How many documents?
2. How many words (occurrences)?
3. What is the vocabulary size, treating `NLP` as one token and ignoring punctuation?
4. If you lowercase everything, does the vocabulary size change here?

<details>
<summary>Answers</summary>

1. **3** documents — split at `.`, `!`, `.`
2. **13** words: Hello, welcome, to, NLP, tutorials, Please, watch, the, entire, course, Learn, NLP, well
3. **12** — `NLP` appears twice, counted once.
4. **No** — no word here differs only by case. But in a real dataset it almost always does,
   which is why lowercasing is step one of every pipeline.

</details>

---

**Next:** [03 — Tokenization](03-Tokenization.md) — the mechanics of actually splitting a
corpus into documents and words.
