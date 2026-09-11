---
title: "04 — Stemming"
description: Chopping words down to a word stem. Porter vs Snowball vs RegexpStemmer compared on the same words, plus exactly why history becomes histori.
---

# 04 — Stemming

---

## 1. The definition and the motivation

> **Stemming is the process of reducing a word to its word stem** — chopping off affixes
> (prefixes/suffixes) to reach a common root form.

Suppose you are building a **positive/negative review classifier**. Your reviews contain:

```
eating   eats   eaten          →  all about "eat"
going    goes   gone           →  all about "go"
program  programs  programming →  all about "program"
```

For deciding *positive or negative*, the difference between `eating` and `eats` is
**worthless**. But to a computer they are three different strings, therefore:

```
   3 different words  =  3 different vocabulary entries  =  3 different COLUMNS
```

Three columns carrying one idea. Multiply that across a real vocabulary and you get a huge,
sparse feature matrix that overfits. Stemming collapses them:

```
   eating ┐
   eats   ├──▶  eat          3 columns become 1
   eaten  ┘
```

> **The payoff in one line:** stemming shrinks the vocabulary, which shrinks the feature
> matrix, which reduces sparsity and overfitting.

---

## 2. The test set for this whole note

```python
words = ["eating", "eats", "eaten", "writing", "writes",
         "programming", "programs", "history", "finally", "finalized"]
```

---

## 3. Porter Stemmer — the classic

```python
from nltk.stem import PorterStemmer

stemming = PorterStemmer()
for word in words:
    print(word + " ----> " + stemming.stem(word))
```

```
eating      ----> eat        ✅
eats        ----> eat        ✅
eaten       ----> eaten      ❌ unchanged (irregular verb)
writing     ----> write      ✅
writes      ----> write      ✅
programming ----> program    ✅
programs    ----> program    ✅
history     ----> histori    ❌ not a word at all
finally     ----> final      ✅
finalized   ----> final      ✅
```

### Why `history → histori`

Porter is a **rule-based suffix stripper**. One of its rules says roughly *"a word ending in
consonant + `y` → replace `y` with `i`"* (so `happy → happi`, `pony → poni`), which lets
`happier` and `happy` land on the same stem `happi`. Applied to `history` the same rule
produces `histori`.

**Porter never checks whether the output is a real English word.** It is a string
transformation, nothing more. It has no dictionary. That is simultaneously why it is fast
and why it produces garbage sometimes.

More casualties:

```python
stemming.stem('congratulations')  # 'congratul'   ← meaningless
stemming.stem('sitting')          # 'sit'         ← fine
stemming.stem('goes')             # 'goe'         ← wrong
stemming.stem('fairly')           # 'fairli'      ← wrong
stemming.stem('sportingly')       # 'sportingli'  ← wrong
```

### So is it useless?

**No.** For most words it is right, and for tasks where you only need a *signal* — spam vs
ham, positive vs negative — it does not matter that the feature is spelled `histori` as
long as **every occurrence of `history`, `historical`, `histories` maps to that same
token**. The model does not read English; it counts columns.

> **Rule of thumb:** use stemming for **classification** tasks (spam/ham, sentiment). Do
> not use it for anything a **human will read** — chatbots, summarization, Q&A — because
> the output words must be real words there.

---

## 4. RegexpStemmer — bring your own rule

Sometimes you want total control: "strip exactly these endings, nothing else."

```python
from nltk.stem import RegexpStemmer

reg_stemmer = RegexpStemmer('ing$|s$|e$|able$', min=4)
```

Two parameters:

| Parameter | Meaning |
|---|---|
| the regex | Any substring matching it is **removed** |
| `min=4` | Words shorter than this are left alone (prevents destroying short words) |

### The `$` is the whole lesson

```python
reg_stemmer.stem('eating')      # 'eat'     — 'ing' at the END is stripped
reg_stemmer.stem('ingeating')   # 'ingeat'  — the LEADING 'ing' survives!
```

`$` anchors the pattern to the **end** of the string. Drop it and the rule fires anywhere:

```python
RegexpStemmer('ing', min=4).stem('ingeating')   # 'eat' — both 'ing's removed
```

And anchoring with `^` matches only the start:

```python
RegexpStemmer('^ing', min=4).stem('ingeating')  # 'eating'
```

### When is this actually useful?

Domain jargon that a general stemmer mangles — chemical names, product codes, medical
terms. You write the three rules your domain needs and nothing else changes.

---

## 5. Snowball Stemmer — Porter, improved

Snowball (also called "Porter2") is the same idea with a better rule set, written by the
same author. **It is strictly better than Porter; prefer it.**

```python
from nltk.stem import SnowballStemmer

snowball = SnowballStemmer('english')
for word in words:
    print(word + " ----> " + snowball.stem(word))
```

On the standard list the output looks identical to Porter (`history → histori` still).
**The difference shows on the awkward `-ly` words:**

```python
                          # Porter          Snowball
stemming.stem('fairly')       # 'fairli'   →  snowball.stem('fairly')      # 'fair'  ✅
stemming.stem('sportingly')   # 'sportingli'→ snowball.stem('sportingly')  # 'sport' ✅
stemming.stem('goes')         # 'goe'      →  snowball.stem('goes')        # 'goe'   ❌ still
```

So Snowball fixes some cases, not all. `goes` still fails; only lemmatization gets that
right.

### The extra feature: languages

```python
SnowballStemmer.languages
# ('arabic','danish','dutch','english','finnish','french','german','hungarian',
#  'italian','norwegian','porter','portuguese','romanian','russian','spanish','swedish')
```

Porter is English-only. Snowball covers 15+ languages — which is the practical reason to
default to it.

### One convenient side-effect

Snowball **lowercases its output**:

```python
snowball.stem("India")   # 'india'
```

Useful, because `India` and `india` would otherwise be two vocabulary entries. But do not
*rely* on a stemmer for lowercasing — do it explicitly with `.lower()`.

---

## 6. All three side by side

| Word | Porter | Snowball | Correct root |
|---|---|---|---|
| eating | eat | eat | eat ✅ |
| eaten | eaten | eaten | eat ❌ |
| history | **histori** | **histori** | history ❌ |
| congratulations | **congratul** | **congratul** | congratulate ❌ |
| fairly | **fairli** | **fair** ✅ | fair |
| sportingly | **sportingli** | **sport** ✅ | sport |
| goes | **goe** | **goe** | go ❌ |
| finalized | final | final | finalize ~ |

**Score:** Snowball ≥ Porter, always. Neither is reliable on irregular verbs or on words
where the suffix is part of the root.

---

## 7. The honest summary

### Advantages

- **Fast.** Pure string manipulation, no dictionary lookup, no disk access.
- **Shrinks the vocabulary** a lot, which is the point.
- **Language-independent-ish** (Snowball).

### Disadvantages

- **The output is often not a real word** (`histori`, `congratul`).
- **Meaning can change or vanish**, so it is unusable where humans read the output.
- **Irregular forms are missed** (`eaten`, `goes`, `went`).

### The decision rule

```
Will a human ever read these tokens?
   ├─ NO  (spam/ham, sentiment, topic classification)  ──▶  STEMMING  (use Snowball)
   └─ YES (chatbot, Q&A, summarization, translation)   ──▶  LEMMATIZATION (note 05)
```

---

## 8. Self-check

1. Why does `PorterStemmer` produce `histori`? Does it "know" that is wrong?
2. `RegexpStemmer('ing$')` vs `RegexpStemmer('ing')` on `"ingesting"` — what differs?
3. Name two tasks where stemming is the *wrong* choice, and say why.

<details>
<summary>Answers</summary>

1. A suffix rule rewrites terminal `y` → `i` (so that `happy`/`happier` unify). Porter has
   **no dictionary**, so it cannot know `histori` is not a word — it never checks.
2. `'ing$'` → `'ingest'` (only the trailing `ing` goes). `'ing'` → `'est'` (both the
   leading and the trailing `ing` go). The `$` anchors to end-of-string.
3. Chatbots and text summarization — the output text is shown to a user, so tokens must be
   real words. Also anything where you later look words up in a dictionary/knowledge base.

</details>

---

**Next:** [05 — Lemmatization](05-Lemmatization.md) — the dictionary-backed version that
gets `goes → go` right.
