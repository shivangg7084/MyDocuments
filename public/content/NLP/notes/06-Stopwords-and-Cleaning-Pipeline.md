---
title: "06 — Stopwords & the Full Cleaning Pipeline"
description: What stopwords are, the one case where removing them destroys your model, and the reusable cleaning function used by every project in this course.
---

# 06 — Stopwords & the Full Cleaning Pipeline

---

## 1. What a stopword is

> **Stopwords are extremely common words that carry grammatical structure but almost no
> topic-specific meaning** — `the`, `is`, `a`, `and`, `of`, `he`, `she`, `there`, `to`.

Take a sentence from Dr. APJ Abdul Kalam's *"I have three visions for India"* speech:

```
"In 3000 years of our history, people from all over the world have come and invaded us."
```

For the question *"is this text about India's history?"*, which words matter?

```
In  3000  years  of  our  HISTORY  ,  PEOPLE  from  all  over  the  WORLD
have  COME  and  INVADED  us  .
└─┬─┘             └──┬──┘        └──────┬────┘      └──┬──┘   └───┬────┘
 noise            signal              noise          signal     signal
```

Roughly **half the tokens are pure noise**. Removing them:

- **Shrinks the vocabulary** → fewer columns → less sparsity → less overfitting (note 02).
- **Shrinks every document** → faster training.
- **Raises signal-to-noise** → the model's counts are dominated by words that matter.

---

## 2. Using NLTK's list

```python
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords

stopwords.words('english')[:20]
# ['i','me','my','myself','we','our','ours','ourselves','you',"you're",
#  "you've","you'll","you'd",'your','yours','yourself','yourselves','he','him','his']

len(stopwords.words('english'))    # ~179
```

### Other languages

```python
stopwords.words('german')[:10]     # ['aber','alle','allem','allen','aller','alles', ...]
stopwords.words('french')[:10]
stopwords.words('arabic')[:10]
stopwords.fileids()                # every language available — check before assuming
```

**Hindi is not in NLTK's list.** If you need it, use the `advertools` package, spaCy's
language data, or simply write your own list — a stopword list is just a set of strings.

---

## 3. ⚠️ The trap: when removing stopwords destroys your model

Look carefully at what is inside the English list:

```python
sw = stopwords.words('english')
[w for w in sw if 'n' in w and ("not" in w or "n't" in w)]
# ['no','nor','not','don',"don't",'aren',"aren't",'couldn',"couldn't",
#  'didn',"didn't",'doesn',"doesn't", ... ]
```

**`not` is a stopword. So are `no`, `nor`, and every `n't` contraction.**

Now run sentiment analysis on these two reviews:

```
"The food is good."       →  POSITIVE
"The food is not good."   →  NEGATIVE
```

Remove stopwords from both:

```
"The food is good."      →  ['food','good']
"The food is not good."  →  ['food','good']      ← IDENTICAL
```

**You have just made the two sentences indistinguishable.** Your classifier cannot possibly
get the second one right — the single word that flipped the meaning was deleted.

### The fix: curate your own list

```python
default_sw = set(stopwords.words('english'))

# keep negations and contrast words — they carry sentiment
keep = {'not','no','nor','never','none','cannot',
        "don't","doesn't","didn't","isn't","wasn't","aren't","weren't",
        "won't","wouldn't","couldn't","shouldn't","can't","hasn't","haven't",
        'but','however','although'}

my_stopwords = default_sw - keep
len(default_sw), len(my_stopwords)     # 179, 154
```

> **Always treat the stopword list as a starting point, never as gospel.** For sentiment,
> keep negation. For a search engine, you might also keep `who`/`what`/`where`. It depends
> on the task, and the default list does not know your task.

Note 11 (n-grams) shows a **second, complementary** fix for the same problem: even if `not`
survives, `"not good"` as a *bigram* is a far stronger feature than `not` and `good`
separately.

---

## 4. The pipeline: stopwords + stemming together

This is the loop you will write in every project. Read it once, then memorise its shape.

```python
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

paragraph = """I have three visions for India. In 3000 years of our history,
people from all over the world have come and invaded us, captured our lands,
conquered our minds."""

stemmer   = PorterStemmer()
sentences = nltk.sent_tokenize(paragraph)      # 1. paragraph → sentences

for i in range(len(sentences)):
    words = nltk.word_tokenize(sentences[i])   # 2. sentence  → words
    words = [stemmer.stem(word)                # 4. stem what survives
             for word in words
             if word not in set(stopwords.words('english'))]   # 3. drop stopwords
    sentences[i] = ' '.join(words)             # 5. words → sentence again

sentences
```

```
['I three vision india .',
 'In 3000 year histori , peopl world come invad us , captur land , conquer mind .']
```

### Reading the code, line by line

| Line | Why it is written that way |
|---|---|
| `for i in range(len(sentences))` | We need the **index** so we can write the cleaned sentence *back* into the list. `for s in sentences` gives you a copy, not a slot. |
| `set(stopwords.words('english'))` | `set` gives **O(1)** lookup instead of O(n) list scanning. Over 5,000 documents × 179 stopwords this is the difference between seconds and minutes. |
| the list comprehension | `if` filters first, `stemmer.stem(...)` applies only to survivors — you never waste time stemming a word you are about to delete. |
| `' '.join(words)` | Vectorizers in notes 10–12 expect **strings**, not lists. This step undoes the tokenization on purpose. |

### ⚡ Performance note (do this in real code)

`set(stopwords.words('english'))` inside the comprehension **rebuilds the set for every
single word.** Hoist it out:

```python
STOP = set(stopwords.words('english'))          # built ONCE
...
words = [stemmer.stem(w) for w in words if w not in STOP]
```

On a large corpus this alone can be a 10× speed-up.

---

## 5. The same pipeline with the three cleaners compared

### (a) Porter stemmer

```
['I three vision india .',
 'In 3000 year histori , peopl world come invad us , captur land , conquer mind .']
```
`history → histori` ❌, and capital `I`/`In` survive.

### (b) Snowball stemmer

```python
from nltk.stem import SnowballStemmer
snowball = SnowballStemmer('english')
# ... same loop, snowball.stem(word) ...
```
```
['i three vision india .',
 'in 3000 year histori , peopl world come invad us , captur land , conquer mind .']
```
Note **everything is lowercase now** — Snowball lowercases as a side-effect. Good, because
`India` and `india` would otherwise be two columns. `histori` is still wrong.

### (c) WordNet lemmatizer

```python
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

for i in range(len(sentences)):
    words = nltk.word_tokenize(sentences[i])
    words = [lemmatizer.lemmatize(word.lower(), pos='v')
             for word in words if word.lower() not in STOP]
    sentences[i] = ' '.join(words)
```
```
['three vision india .',
 '3000 year history people world come invade us , capture land , conquer mind .']
```

**`history` stays `history`. `invaded → invade`. `captured → capture`.** Slower, but every
token is a real word.

> Note the `.lower()` placed **inside** the comprehension, applied to `word` before both the
> stopword check and the lemmatize call. Getting this order right matters: `"The"` is not in
> the stopword list, but `"the"` is.

---

## 6. The reusable function — copy this into every project

```python
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer, PorterStemmer

STOP       = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
stemmer    = PorterStemmer()

def clean_text(text, mode='lemmatize', keep_negations=True):
    """Lowercase, strip non-letters, drop stopwords, then stem or lemmatize.

    mode : 'lemmatize' | 'stem' | 'none'
    """
    stop = STOP - {'not','no','nor','never'} if keep_negations else STOP

    text  = re.sub('[^a-zA-Z]', ' ', str(text))   # keep letters, everything else → space
    text  = text.lower()
    words = text.split()
    words = [w for w in words if w not in stop]

    if   mode == 'lemmatize': words = [lemmatizer.lemmatize(w, pos='v') for w in words]
    elif mode == 'stem':      words = [stemmer.stem(w) for w in words]

    return ' '.join(words)


clean_text("Congratulations!!! You've WON a FREE ticket... claim now!!")
# 'congratulations you ve won free ticket claim'
```

### Why `re.sub('[^a-zA-Z]', ' ', text)` and not `''`?

Replacing with **empty string** glues words together:

```python
re.sub('[^a-zA-Z]', '',  "hello,world")   # 'helloworld'   ← one fake word
re.sub('[^a-zA-Z]', ' ', "hello,world")   # 'hello world'  ← two real words ✅
```

This exact bug appears in note 18's project and costs real accuracy. **Always substitute a
space.**

### ⚠️ What `[^a-zA-Z]` also deletes

**All digits.** For the spam dataset that matters: a message that is entirely digits
(`"645"`) becomes an **empty string**, and note 17 shows how three such rows silently
desynchronised `X` from `y` and broke the model. If numbers matter to you, use
`[^a-zA-Z0-9]` instead.

---

## 7. Where this sits in the pipeline

```
   raw text
      │
      │  ① lowercase                 ──┐
      │  ② regex: strip specials       │  THIS NOTE
      │  ③ tokenize                    │  (text pre-processing part 1)
      │  ④ remove stopwords            │
      │  ⑤ stem / lemmatize          ──┘
      ▼
   clean text  ──────▶  train/test split (note 16)  ──────▶  vectorize (notes 09–15)
```

---

## 8. Self-check

1. Why use `set(stopwords.words('english'))` rather than the list?
2. Give a concrete sentence pair that stopword removal makes identical, and name the task it breaks.
3. Why does the loop use `range(len(sentences))` instead of iterating the list directly?
4. What does `re.sub('[^a-zA-Z]', ' ', "don't")` produce, and is that a problem?

<details>
<summary>Answers</summary>

1. `in` on a set is O(1) hash lookup; on a list it is O(n) scan. With ~179 stopwords × every
   word × every document the difference is large.
2. `"The food is good"` vs `"The food is not good"` → both become `food good`. Breaks
   **sentiment analysis** (and any task where negation matters).
3. Because we assign the cleaned result **back** into `sentences[i]`. Iterating values gives
   you a copy of each string; strings are immutable, so there is no slot to write into.
4. `"don t"` — the apostrophe becomes a space, leaving a stray `t`. Usually harmless (`t`
   gets filtered by `max_features` or a min-length rule), but if it bothers you, expand
   contractions *before* the regex, or add single letters to your stopword set.

</details>

---

**Next:** [07 — POS Tagging](07-POS-Tagging.md) — labelling each word as noun/verb/adjective,
which is what makes lemmatization accurate.
