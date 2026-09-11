---
title: "12 — TF-IDF (Term Frequency × Inverse Document Frequency)"
description: Weighting words by how informative they are. Full hand calculation, then the exact reason sklearn's numbers look different from yours.
---

# 12 — TF-IDF

---

## 1. The problem: bag of words treats every word as equally important

```
   "good boy"  →  good=1, boy=1
                   └──── both weighted exactly 1 ────┘
```

But suppose `good` appears in **every single review** in your dataset and `boy` in only a
third of them. Which one tells you more about *this particular* review?

**`boy`.** A word in every document distinguishes nothing — it is, functionally, a stopword
that your stopword list happened to miss.

> **The TF-IDF principle:**
> *A word is important to a document if it appears **often in that document** but **rarely
> across the corpus**.*

---

## 2. The two components

### Term Frequency (TF) — "how much does this document talk about this word?"

```
              number of times the word appears in the sentence
   TF(w, d) = ────────────────────────────────────────────────
                    total number of words in the sentence
```

Dividing by document length is what stops long documents from dominating. TF is
**document-local** — computed independently for each document.

### Inverse Document Frequency (IDF) — "how rare is this word overall?"

```
                     ⎛      total number of sentences        ⎞
   IDF(w) = log_e    ⎜ ─────────────────────────────────────  ⎟
                     ⎝ number of sentences containing the word ⎠
```

IDF is **corpus-global** — one number per vocabulary word, the same for every document.

**Read the behaviour off the formula:**

| Word appears in | Ratio | IDF | Meaning |
|---|---|---|---|
| **all** 3 of 3 documents | 3/3 = 1 | `ln(1)` = **0** | zero weight — tells you nothing |
| 2 of 3 documents | 3/2 = 1.5 | `ln(1.5)` = **0.405** | moderately informative |
| 1 of 3 documents | 3/1 = 3 | `ln(3)` = **1.099** | highly distinctive |

**A word in every document gets multiplied by zero and disappears.** That is the whole
mechanism — IDF is an automatic, data-driven stopword remover.

### The product

```
   TF-IDF(w, d) = TF(w, d) × IDF(w)
```

High only when **both** are high: frequent *here*, rare *elsewhere*.

---

## 3. Full hand calculation

Same corpus as note 10 (after cleaning):

| | Sentence | Words |
|---|---|---|
| **S1** | good boy | 2 |
| **S2** | good girl | 2 |
| **S3** | boy girl good | 3 |

### Step 1 — the TF table

```
              good        boy         girl
   S1        1/2         1/2         0/2 = 0
   S2        1/2         0/2 = 0     1/2
   S3        1/3         1/3         1/3
```

S1 has 2 words; `good` appears once → 1/2. S3 has 3 words; each appears once → 1/3 each.

### Step 2 — the IDF table

3 sentences total.

```
   good  : appears in S1, S2, S3  (3 of 3)  →  ln(3/3) = ln(1)   = 0
   boy   : appears in S1, S3      (2 of 3)  →  ln(3/2) = ln(1.5) = 0.4055
   girl  : appears in S2, S3      (2 of 3)  →  ln(3/2)           = 0.4055
```

### Step 3 — multiply

```
                good           boy                    girl
   S1      ½ × 0 = 0     ½ × 0.4055 = 0.2027     0 × 0.4055 = 0
   S2      ½ × 0 = 0     0 × 0.4055 = 0          ½ × 0.4055 = 0.2027
   S3      ⅓ × 0 = 0     ⅓ × 0.4055 = 0.1352     ⅓ × 0.4055 = 0.1352
```

### The final vectors

```
              good     boy      girl
   S1    [    0.0    0.2027    0.0    ]      "good boy"
   S2    [    0.0    0.0       0.2027 ]      "good girl"
   S3    [    0.0    0.1352    0.1352 ]      "boy girl good"
```

### Read what happened

- **The `good` column is entirely zero.** `good` is in every sentence, so it carries no
  discriminating information. TF-IDF discovered that by itself — you did not put `good` on
  any stopword list.
- **S1's signal is `boy`; S2's signal is `girl`.** The vectors now say *what each sentence is
  distinctively about*.
- **S3 mentions both, so both get weight** — but *less* (0.1352 < 0.2027), because S3 is
  longer, so each word is a smaller share of it.

> **Contrast with bag of words**, where all three sentences were `[1,1,0] / [1,0,1] /
> [1,1,1]` and every present word scored an identical 1.

---

## 4. `TfidfVectorizer`

```python
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np, pandas as pd

corpus = ["good boy", "good girl", "boy girl good"]

tfidf = TfidfVectorizer()
X     = tfidf.fit_transform(corpus).toarray()

pd.DataFrame(np.round(X, 4), columns=tfidf.get_feature_names_out(),
             index=['S1','S2','S3'])
```
```
       boy    girl    good
S1  0.7898  0.0000  0.6134
S2  0.0000  0.7898  0.6134
S3  0.6198  0.6198  0.4813
```

## 5. ⚠️ "That's not what I calculated!"

Correct — and this discrepancy confuses everyone, so here is exactly why.

**scikit-learn does three things differently from the textbook formula:**

### (a) Smoothed IDF (`smooth_idf=True`, the default)

```
                   ⎛ 1 + n ⎞
   IDF(w) = log_e  ⎜ ───── ⎟  + 1
                   ⎝ 1 + df⎠
```

Two changes: `+1` on numerator and denominator (prevents division by zero for a word with
`df=0`, as can happen at transform time), and **`+1` on the whole thing**.

That trailing `+1` is the important one: it means **IDF is never zero**, so a
universal word is down-weighted but not annihilated.

```python
tfidf.idf_
# boy 1.2877,  girl 1.2877,  good 1.0
```

Check: `boy` → `ln(4/3) + 1 = 0.2877 + 1 = 1.2877` ✅ and `good` → `ln(4/4) + 1 = 0 + 1 =
1.0` ✅ (not 0).

### (b) TF is the **raw count**, not divided by document length

sklearn uses `tf = count`. The length normalisation happens in step (c) instead.

### (c) L2 row normalisation (`norm='l2'`, the default)

Every row is scaled so its vector length is exactly 1:

```
   S1 raw:  boy 1×1.2877 = 1.2877,  good 1×1.0 = 1.0
   ‖v‖ = √(1.2877² + 1.0²) = √2.6581 = 1.6304
   S1 normalised: [1.2877/1.6304, 0, 1.0/1.6304] = [0.7898, 0, 0.6134]   ✅ matches
```

L2 normalisation is why every row's values sum in squares to 1 — which makes **cosine
similarity between documents equal to their dot product**, a big convenience downstream.

### Reproduce the textbook numbers if you want them

```python
tfidf_raw = TfidfVectorizer(norm=None, smooth_idf=False)
X_raw = tfidf_raw.fit_transform(corpus).toarray()
tfidf_raw.idf_        # boy 1.4055, girl 1.4055, good 1.0  (= ln(3/2)+1, ln(1)+1)
```

> **Which is "right"?** Both. The textbook formula teaches the *idea*; sklearn's variant is
> the numerically robust production version. **Learn the textbook one for exams, use
> sklearn's for code, and know why they differ** — that is a common interview follow-up.

---

## 6. Useful parameters

```python
TfidfVectorizer(
    max_features = 2500,      # same as CountVectorizer
    ngram_range  = (1, 2),    # note 11 — works here too
    min_df       = 5,
    max_df       = 0.7,
    sublinear_tf = False,     # True → use 1 + log(tf) instead of tf
    norm         = 'l2',
    smooth_idf   = True,
    use_idf      = True,      # False → TF only (≈ length-normalised BoW)
)
```

**There is no `binary` parameter that behaves like BoW's** — TF-IDF produces continuous
weights by design, so presence/absence is not the point.

`sublinear_tf=True` is worth knowing: it replaces `tf` with `1 + log(tf)`, on the theory
that a word appearing 100 times is not 100× more relevant than one appearing once. It often
helps on long documents.

---

## 7. Advantages

### ✅ 1. Word importance is captured — the headline feature

This is the one thing TF-IDF adds over bag of words, and it is why TF-IDF is still the
default baseline for text classification decades later.

```
   BoW   :  good=1  boy=1        "both present, equally"
   TF-IDF:  good=0  boy=0.2027   "boy is what makes this document distinctive"
```

### ✅ 2. Fixed-size input
Inherited from BoW — vocabulary size columns, always.

### ✅ 3. Automatic stopword handling
Corpus-specific filler (`"phone"` in a phone-review dataset) gets a low IDF automatically.
You do not need to know in advance which words are uninformative in *your* data.

### ✅ 4. Simple, fast, and a genuinely strong baseline
TF-IDF + linear SVM or Naive Bayes beats a badly-tuned neural network on small datasets
more often than people expect. **Always run it first** to establish the number a fancier
model has to beat.

---

## 8. Disadvantages

### ❌ 1. Sparsity remains
Still one column per vocabulary word, still mostly zeros. Only dense embeddings fix this.

### ❌ 2. Still no semantic meaning
```
   "great movie"  and  "excellent film"
```
**Zero overlap.** Not one shared column, so TF-IDF sees them as completely unrelated
documents, when a human sees paraphrases. IDF weights words; it does not understand them.

### ❌ 3. OOV unsolved
Unseen test words have no column and are dropped, exactly as with BoW.

### ❌ 4. Word order still lost
It is BoW with better weights — the bag is still a bag. Use `ngram_range` for local order.

---

## 9. Scorecard

| Problem | One-hot | BoW | **TF-IDF** | Word2Vec (note 13) |
|---|---|---|---|---|
| Fixed-size input | ❌ | ✅ | ✅ | ✅ |
| **Word importance** | ❌ | ❌ | **✅** | ✅ |
| Sparse matrix | ❌ | ❌ | ❌ | ✅ |
| Semantic meaning | ❌ | ❌ | ❌ | ✅ |
| Out of vocabulary | ❌ | ❌ | ❌ | ⚠️ mostly |
| Word order | ❌ | ❌ | ⚠️ with n-grams | ⚠️ |

**TF-IDF is the best technique that does not require a neural network.** Everything above it
on the ladder needs training.

---

## 10. End-to-end on real data

```python
import pandas as pd, re, nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer

messages = pd.read_csv('SMSSpamCollection', sep='\t', names=['label','message'])

lemmatizer = WordNetLemmatizer()
STOP = set(stopwords.words('english'))
corpus = []

for i in range(len(messages)):
    review = re.sub('[^a-zA-Z]', ' ', messages['message'][i]).lower().split()
    review = [lemmatizer.lemmatize(w) for w in review if w not in STOP]
    corpus.append(' '.join(review))

tfidf = TfidfVectorizer(max_features=2500, ngram_range=(1,2))
X = tfidf.fit_transform(corpus).toarray()

X.shape          # (5572, 2500)
X[0][:10]        # 0.  0.  0.344  0.  0.446 ...   ← decimals, not 0/1

# Which words does this model consider most informative overall?
import numpy as np
names = tfidf.get_feature_names_out()
top = np.argsort(tfidf.idf_)[-10:]          # highest IDF = rarest = most distinctive
print([names[i] for i in top])
```

---

## 11. Self-check

1. A word appears in every document. What is its textbook IDF, and what happens to its TF-IDF?
2. Why divide by document length in TF?
3. Your hand calculation gives 0.2027 but sklearn gives 0.7898. Name the three reasons.
4. Does TF-IDF see `"great movie"` and `"excellent film"` as similar? Why?
5. When would you prefer plain BoW over TF-IDF?

<details>
<summary>Answers</summary>

1. `ln(N/N) = ln(1) = 0`, so `TF × 0 = 0` — the word is eliminated. (With sklearn's
   `smooth_idf`, IDF = 1 instead of 0, so it is down-weighted, not deleted.)
2. So that a long document does not score higher on every word merely for being long. TF is
   a *share* of the document, not a raw count.
3. (a) `smooth_idf` adds +1 inside the log and +1 outside; (b) sklearn uses **raw counts**
   for TF, not count/length; (c) **L2 row normalisation** rescales each row to unit length.
4. **No** — zero shared vocabulary, so their vectors are orthogonal. TF-IDF weights words
   but has no notion of synonymy. Word2Vec (note 13) is the fix.
5. With a **Multinomial Naive Bayes** classifier (whose maths assumes counts), or when you
   genuinely want raw occurrence counts (e.g. "how many times did this review say 'refund'").
   Also when documents are so short that TF ≈ presence anyway.

</details>

---

**Next:** [13 — Word Embeddings & Word2Vec](13-Word-Embeddings-and-Word2Vec.md) — leaving
counting behind and giving words actual meaning.
