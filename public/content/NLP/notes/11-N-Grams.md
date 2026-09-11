---
title: "11 — N-Grams"
description: How ngram_range rescues 'not good' from looking like 'good', with the full vector comparison and a tuning strategy.
---

# 11 — N-Grams

---

## 1. The problem being solved

From note 10 — the failure that makes bag of words unusable for sentiment:

```
   S1: "the food is good"          POSITIVE
   S2: "the food is not good"      NEGATIVE     ← exact opposite
```

Clean both (remove `the`, `is`; **deliberately keep `not`**) and build a BoW:

```
   vocabulary:     food   not   good

   S1 "food good"  [  1     0     1  ]
   S2 "food not good" [ 1    1     1  ]
                        └─ ONE position differs out of three
```

Those two vectors are geometrically nearly identical. The model sees two almost-identical
inputs with opposite labels and cannot learn a rule. **The problem is that `not` and `good`
are recorded as independent facts** — nothing records that `not` was sitting *immediately
before* `good`.

---

## 2. The idea

> **An n-gram is a contiguous sequence of n words treated as a single feature.**

| Name | n | From *"the food is not good"* |
|---|---|---|
| **Unigram** | 1 | `the`, `food`, `is`, `not`, `good` |
| **Bigram** | 2 | `the food`, `food is`, `is not`, `not good` |
| **Trigram** | 3 | `the food is`, `food is not`, `is not good` |

`"not good"` becomes **one feature**. Not two independent words that happen to co-occur —
one atomic column that means "negated positive". That is the whole trick.

---

## 3. The fix, worked out

Keep the unigrams and **add** the bigrams as extra columns:

```
   FEATURES:   food   not   good  │ food_good   food_not   not_good
              └─ unigrams ───────┘└──── bigrams ─────────────────┘

   S1 "food good"      1     0     1  │    1          0          0
   S2 "food not good"  1     1     1  │    0          1          1
                       └ 1 diff ─────┘└──── 3 more differences ──┘
```

Differences went from **1 out of 3** to **4 out of 6**. The vectors are now far apart, and
the model can separate them.

```
   BEFORE (unigrams)            AFTER (uni + bi)
       S2 ●                          S2 ●
          ╲ tiny angle                    ╲
           ● S1                            ╲    large angle
                                            ● S1
   "looks 90% similar"           "clearly different"
```

### Why not just keep bigrams?

You could (`ngram_range=(2,2)`), but you would lose the robustness of single words. The
usual answer is **both**, because unigrams generalise and bigrams disambiguate.

---

## 4. `ngram_range` in scikit-learn

Both `CountVectorizer` and `TfidfVectorizer` take:

```python
ngram_range = (min_n, max_n)
```

| Setting | Produces | Typical use |
|---|---|---|
| `(1,1)` | unigrams only | **default**; start here |
| `(1,2)` | unigrams **+** bigrams | **best all-round choice** |
| `(1,3)` | uni + bi + trigrams | long documents, more data |
| `(2,2)` | bigrams only | when you specifically want phrases |
| `(2,3)` | bi + trigrams, no unigrams | phrase extraction |

```python
from sklearn.feature_extraction.text import CountVectorizer

corpus = ["food good", "food not good"]

for rng in [(1,1), (1,2), (2,2)]:
    cv = CountVectorizer(ngram_range=rng)
    X  = cv.fit_transform(corpus).toarray()
    print(rng, list(cv.get_feature_names_out()))
    print("   ", X.tolist())
```
```
(1, 1) ['food', 'good', 'not']
       [[1, 1, 0], [1, 1, 1]]
(1, 2) ['food', 'food good', 'food not', 'good', 'not', 'not good']
       [[1, 1, 0, 1, 0, 0], [1, 0, 1, 1, 1, 1]]
(2, 2) ['food good', 'food not', 'not good']
       [[1, 0, 0], [0, 1, 1]]
```

With `(2,2)` the vectors share **nothing at all** — maximum separation.

---

## 5. On real data

The spam dataset (5,572 SMS messages):

```python
cv = CountVectorizer(max_features=100, ngram_range=(1,1))
X  = cv.fit_transform(corpus).toarray()
list(cv.vocabulary_)[:10]
# ['go','great','txt','free','win','say','get','call','claim','ok']    single words
```

```python
cv = CountVectorizer(max_features=500, ngram_range=(1,2))
X  = cv.fit_transform(corpus).toarray()
[f for f in cv.get_feature_names_out() if ' ' in f][:10]
# ['call custom','custom servic','good morn','good night','guarante call',
#  'ltd deciem','please call','price guarante','text txt','tri contact']
```

Look at those bigrams: **`please call`, `custom servic`, `price guarante`, `guarante call`,
`tri contact`.** These are *spam phrases*. `call` alone is ambiguous (friends say "call
me"); `please call` with `price guarante` is not. The bigrams carry far more signal than
their parts.

```python
cv = CountVectorizer(max_features=500, ngram_range=(3,3))
[f for f in cv.get_feature_names_out()][:5]
# ['call claim code','call custom servic','call landlin claim','po box ltd', ...]
```

*"call claim code"* — that is a scam template captured as a single feature.

> The stems (`custom servic`, `guarante`) look odd because stemming ran first. That is
> expected and harmless: `custom servic` is a consistent token, and the model only needs
> consistency.

---

## 6. The cost: feature explosion

This is the trade-off, and it is steep.

| `ngram_range` | Features on a 10,000-word vocabulary |
|---|---|
| `(1,1)` | 10,000 |
| `(1,2)` | 10,000 + up to ~100,000 observed bigrams |
| `(1,3)` | + up to millions of trigrams |

In practice only observed combinations are stored, but the growth is still explosive. Two
consequences:

1. **Sparser matrix.** A specific trigram appears in maybe 3 documents out of 10,000 — that
   column is 99.97% zeros.
2. **Overfitting.** A trigram seen in only two training documents that both happen to be
   spam becomes a "perfect" rule that generalises to nothing.

**Always pair `ngram_range` with `max_features` or `min_df`:**

```python
CountVectorizer(ngram_range=(1,2), max_features=5000)   # cap the count
CountVectorizer(ngram_range=(1,2), min_df=5)            # or require ≥5 documents
```

---

## 7. Tuning strategy

`ngram_range` is a **hyperparameter**. Tune it like any other:

```
   ① Start at (1,1) with a sensible max_features. Record accuracy.
   ② Try (1,2).  Better? Keep it.
   ③ Try (1,3).  Usually only helps with lots of data.
   ④ Still stuck? Tune max_features (1000 / 2500 / 5000).
   ⑤ Task is phrase-heavy? Try (2,2) or (2,3).
```

Or let the machine do it:

```python
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GridSearchCV
from sklearn.naive_bayes import MultinomialNB

pipe = Pipeline([('vec', CountVectorizer()), ('clf', MultinomialNB())])

grid = GridSearchCV(pipe, {
    'vec__ngram_range':  [(1,1), (1,2), (1,3)],
    'vec__max_features': [1000, 2500, 5000],
    'vec__binary':       [True, False],
}, cv=5, scoring='f1')

grid.fit(X_train, y_train)
grid.best_params_
```

> **Why a `Pipeline` and not two separate steps?** Because `GridSearchCV` refits on each CV
> fold, and the pipeline guarantees the vectorizer is fitted on **only the training part of
> each fold**. Doing it manually is how leakage sneaks back in (note 16).

---

## 8. What n-grams do and do not fix

| Problem | Before | After n-grams |
|---|---|---|
| Word order | ❌ completely lost | ⚠️ **local** order captured (within n words) |
| `"not good"` vs `"good"` | ❌ nearly identical | ✅ clearly separated |
| Sparse matrix | ❌ | ❌ **worse** |
| Semantic meaning | ❌ | ❌ still none |
| OOV | ❌ | ❌ still (and worse — unseen *phrases* too) |

**Local order only.** A bigram sees two adjacent words. It cannot connect a negation to a
word eight positions away:

```
   "I would not, given everything I have read, call this good"
        └── "not" and "good" are 9 words apart ──┘
```

No practical n-gram catches that. You need **RNN/LSTM or Transformers**, which read the
sequence properly. That is the boundary where this course's techniques stop.

---

## 9. Self-check

1. List every feature `ngram_range=(1,2)` produces for `"I love this movie"`.
2. Why does `(1,2)` beat `(1,1)` for sentiment but perhaps not for topic classification?
3. Your accuracy went **down** when you switched from `(1,1)` to `(1,3)`. What happened, and what would you try?
4. Which of BoW's disadvantages do n-grams make worse?

<details>
<summary>Answers</summary>

1. Unigrams `I, love, this, movie` + bigrams `I love, love this, this movie` = **7 features**
   (sklearn's default token pattern would drop the single letter `I`; with a custom
   tokenizer you would keep it).
2. Sentiment depends on negation and intensifiers, which are **adjacent-word** phenomena
   (`not good`, `very bad`). Topic classification usually only needs the presence of
   content words (`cricket`, `election`), so bigrams add features without adding signal.
3. Feature explosion → overfitting: rare trigrams became near-perfect training rules that
   fail on test data. Fix with `max_features`, raise `min_df`, or go back to `(1,2)`.
4. **Sparsity** — far more columns, each populated in far fewer documents.

</details>

---

**Next:** [12 — TF-IDF](12-TF-IDF.md) — instead of just counting words, weighting them by
how informative they actually are.
