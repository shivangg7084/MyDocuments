---
title: "05 — Lemmatization"
description: WordNetLemmatizer, why the POS tag changes the answer completely, and the speed trade-off against stemming.
---

# 05 — Lemmatization

---

## 1. The definition, and the one-word difference from stemming

> **Lemmatization reduces a word to its lemma — a real, dictionary-valid root word.**

Compare directly:

| | Stemming | Lemmatization |
|---|---|---|
| Output is called | **word stem** | **lemma** |
| Method | Chop suffixes by rule | **Look the word up in WordNet** |
| Output guaranteed to be a real word? | **No** (`histori`) | **Yes** (`history`) |
| `goes` → | `goe` ❌ | `go` ✅ |
| `history` → | `histori` ❌ | `history` ✅ |
| Speed | Fast | **Slow** |

The mechanism is the entire difference. NLTK's `WordNetLemmatizer` is a thin wrapper around
the **WordNet corpus** — a hand-built lexical database of English. It calls WordNet's
`morphy()` function, which tries morphological rules *and then verifies the result exists
in the dictionary*. A stemmer never verifies anything.

---

## 2. Basic use

```python
import nltk
nltk.download('wordnet')
nltk.download('omw-1.4')      # Open Multilingual WordNet — needed by newer NLTK

from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

lemmatizer.lemmatize("going")     # 'going'   ← surprising!
```

**`going` came back unchanged.** That is not a bug, and understanding why is the most
important thing in this note.

---

## 3. The POS tag — the parameter that changes everything

`lemmatize()` has a second parameter:

```python
lemmatizer.lemmatize(word, pos='n')   # 'n' is the DEFAULT
```

`pos` tells WordNet **what part of speech to treat the word as.** There are four values:

| `pos` | Part of speech | Example |
|---|---|---|
| `'n'` | **noun** (default) | `dogs → dog` |
| `'v'` | **verb** | `going → go` |
| `'a'` | **adjective** | `better → good` |
| `'r'` | **adverb** | `fairly → fairly` |

Watch the same word under all four:

```python
for tag in ['n','v','a','r']:
    print(tag, lemmatizer.lemmatize("going", pos=tag))
```

```
n  going      ← "going" as a noun (as in "the goings-on") is already a lemma
v  go         ← ✅ correct, "going" is a verb here
a  going
r  going
```

> **The lesson:** `going` *as a noun* really is its own lemma. WordNet is not wrong — you
> asked the wrong question. The default `pos='n'` is why beginners conclude
> "lemmatization doesn't work".

### The same list from note 04, both ways

```python
words = ["eating","eats","eaten","writing","writes",
         "programming","programs","history","finally","finalized"]

print([lemmatizer.lemmatize(w)            for w in words])  # pos='n' default
print([lemmatizer.lemmatize(w, pos='v')   for w in words])  # as verbs
```

| Word | `pos='n'` (default) | `pos='v'` | Porter (note 04) |
|---|---|---|---|
| eating | eating ❌ | **eat** ✅ | eat |
| eats | eats ❌ | **eat** ✅ | eat |
| eaten | eaten ❌ | **eat** ✅ | eaten ❌ |
| writing | writing ❌ | **write** ✅ | write |
| writes | writes ❌ | **write** ✅ | write |
| programming | programming ❌ | **program** ✅ | program |
| programs | **program** ✅ | program ✅ | program |
| history | **history** ✅ | history ✅ | **histori** ❌ |
| finally | finally | finally | final |
| finalized | finalized | **finalize** ✅ | final |

**Read the `eaten` row.** Porter left it as `eaten`; lemmatization with `pos='v'` correctly
returns `eat`. Irregular verbs are exactly where the dictionary wins.

**Read the `history` row.** No mangling. That single column is the reason lemmatization
exists.

### More wins

```python
lemmatizer.lemmatize("goes",  pos='v')   # 'go'    (Porter: 'goe')
lemmatizer.lemmatize("fairly", pos='v')  # 'fairly'(Porter: 'fairli')
lemmatizer.lemmatize("sportingly")       # 'sportingly'
lemmatizer.lemmatize("better", pos='a')  # 'good'  ← no stemmer can ever do this
```

`better → good` requires knowing English. A rule cannot get there.

---

## 4. When `pos='n'` is the right answer

Do not blindly switch everything to `'v'`. **Nouns are the correct default when your text
is full of names and places:**

```python
lemmatizer.lemmatize("Krish")      # 'Krish'
lemmatizer.lemmatize("India")      # 'India'
lemmatizer.lemmatize("Taj Mahal")  # 'Taj Mahal'
```

People, companies, cities, monuments — all nouns, all correctly untouched. If you forced
`pos='v'` over a corpus of names you would introduce noise.

### The proper solution: tag first, then lemmatize

The real fix is to **run POS tagging (note 07) and feed each word its own tag.** Here is
the production-quality version you should keep:

```python
import nltk
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer

nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng')

lemmatizer = WordNetLemmatizer()

def nltk_pos_to_wordnet(nltk_tag):
    """Map Penn Treebank tags (note 07) to the 4 tags WordNet understands."""
    if nltk_tag.startswith('J'): return wordnet.ADJ    # 'a'
    if nltk_tag.startswith('V'): return wordnet.VERB   # 'v'
    if nltk_tag.startswith('N'): return wordnet.NOUN   # 'n'
    if nltk_tag.startswith('R'): return wordnet.ADV    # 'r'
    return wordnet.NOUN                                # sensible fallback

def smart_lemmatize(sentence):
    tagged = nltk.pos_tag(nltk.word_tokenize(sentence))
    return [lemmatizer.lemmatize(w, nltk_pos_to_wordnet(t)) for w, t in tagged]

smart_lemmatize("The striped bats are hanging on their feet and eating best")
# ['The','striped','bat','be','hang','on','their','foot','and','eat','best']
```

Look at `are → be`, `feet → foot`, `hanging → hang`. **No stemmer on earth produces that.**

---

## 5. The cost: speed

> **Which is slower, lemmatization or stemming? Lemmatization — always.**

Why: every call consults the WordNet corpus reader, which means a dictionary lookup (and
on first use, loading the corpus from disk). Stemming is arithmetic on a string.

```python
import time
from nltk.stem import SnowballStemmer

text = words * 2000          # 20,000 words

t = time.time(); [SnowballStemmer('english').stem(w) for w in text]
print("stem:", round(time.time()-t, 3), "s")

t = time.time(); [lemmatizer.lemmatize(w, pos='v') for w in text]
print("lemm:", round(time.time()-t, 3), "s")
```

Typical result: lemmatization is **several times slower**, and the gap grows with corpus
size. On the 5,572-row spam dataset in note 17 you will *feel* it — stemming finishes
instantly, lemmatization takes noticeably longer.

---

## 6. Choosing between them — the final table

| | **Stemming** | **Lemmatization** |
|---|---|---|
| Output | word stem, maybe fake | lemma, always a real word |
| Needs POS tag? | No | **Yes, for good results** |
| Speed | Fast ⚡ | Slow 🐢 |
| Handles irregulars (`eaten`,`better`,`feet`) | No | Yes |
| Typical use | spam/ham, sentiment, topic classification | **chatbots, Q&A, summarization, search, translation** |

```
  Is the output read by a MACHINE (a classifier counting columns)?
      └──▶ STEMMING.  Speed matters, ugly tokens don't.

  Is the output read by a HUMAN, or looked up in a dictionary/KB?
      └──▶ LEMMATIZATION.  Correctness matters, the extra seconds don't.
```

Both projects in notes 17 and 18 show it both ways so you can compare accuracy yourself.

---

## 7. Self-check

1. `lemmatizer.lemmatize("running")` returns `running`. Is the library broken? What is the fix?
2. Why does lemmatization handle `eaten` correctly when Porter does not?
3. You are building a customer-support chatbot. Stemming or lemmatization? Why?
4. What is `lemmatizer.lemmatize("better", pos='a')`, and why can no stemmer produce it?

<details>
<summary>Answers</summary>

1. Not broken — the default is `pos='n'`, and *"a running"* is a valid noun. Pass
   `pos='v'` (or tag properly with `smart_lemmatize`) to get `run`.
2. Because it looks `eaten` up in WordNet, which stores the irregular verb form and maps it
   to the lemma `eat`. Porter has only suffix rules and `eaten`'s root is not reachable by
   stripping characters.
3. **Lemmatization** — the bot's understanding is matched against real words/intents, and
   any text it echoes must be readable. The slower speed is irrelevant at one message at a
   time.
4. `'good'`. It requires knowing that *better* is the comparative of *good* — a lexical
   fact stored in a dictionary, not derivable by deleting characters.

</details>

---

**Next:** [06 — Stopwords & the Cleaning Pipeline](06-Stopwords-and-Cleaning-Pipeline.md) —
assembling tokenize + stopwords + stemming into the one function you will reuse everywhere.
