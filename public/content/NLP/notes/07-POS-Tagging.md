---
title: "07 — Parts of Speech (POS) Tagging"
description: The full Penn Treebank tag list, how nltk.pos_tag works, the list-vs-string mistake everyone makes, and why lemmatization depends on it.
---

# 07 — Parts of Speech (POS) Tagging

---

## 1. What it does

> **POS tagging labels every word in a sentence with its grammatical role** — noun, verb,
> adjective, adverb, and so on.

```
   "Taj Mahal is a beautiful monument"
      │    │    │  │     │        │
     NNP  NNP  VBZ DT    JJ       NN
   proper proper verb det adj    noun
```

Two reasons to care:

1. **Lemmatization needs it.** Note 05 showed that `lemmatize("going")` returns `going`
   with the default noun tag and `go` with the verb tag. POS tagging is what supplies the
   right tag automatically.
2. **It is a feature in its own right.** Counting adjectives is a decent proxy for
   opinionated text; extracting all nouns gives you the topics of a document.

---

## 2. The Penn Treebank tag set

NLTK uses the **Penn Treebank** tags — 36 of them. You do not memorise all 36. You memorise
**the first letter**, because that is what the WordNet mapping in note 05 keys on:

```
   N…  →  NOUN          V…  →  VERB
   J…  →  ADJECTIVE     R…  →  ADVERB
```

### The full list, for reference

| Tag | Meaning | Example |
|---|---|---|
| **CC** | Coordinating conjunction | *and, but, or* |
| **CD** | Cardinal digit | *3000, one* |
| **DT** | Determiner | *the, a, some* |
| **EX** | Existential *there* | *there is* |
| **FW** | Foreign word | *d'oeuvre* |
| **IN** | Preposition / subordinating conj. | *in, of, like, because* |
| **JJ** | **Adjective** | *big, beautiful* |
| **JJR** | Adjective, comparative | *bigger* |
| **JJS** | Adjective, superlative | *biggest* |
| **LS** | List marker | *1)* |
| **MD** | Modal | *could, will* |
| **NN** | **Noun, singular** | *desk, vision* |
| **NNS** | Noun, plural | *desks* |
| **NNP** | **Proper noun, singular** | *India, Taj, Krish* |
| **NNPS** | Proper noun, plural | *Americans, Indians* |
| **PDT** | Predeterminer | *all the kids* |
| **POS** | Possessive ending | *parent's* |
| **PRP** | **Personal pronoun** | *I, he, she* |
| **PRP$** | Possessive pronoun | *my, his, hers* |
| **RB** | **Adverb** | *very, silently* |
| **RBR** | Adverb, comparative | *better* |
| **RBS** | Adverb, superlative | *best* |
| **RP** | Particle | *give **up*** |
| **TO** | the word *to* | *to go* |
| **UH** | Interjection | *errrrrrrrm* |
| **VB** | **Verb, base form** | *take* |
| **VBD** | Verb, past tense | *took* |
| **VBG** | Verb, gerund/present participle | *taking* |
| **VBN** | Verb, past participle | *taken* |
| **VBP** | Verb, singular present, non-3rd person | *take* |
| **VBZ** | Verb, 3rd person singular present | *takes* |
| **WDT** | Wh-determiner | *which* |
| **WP** | Wh-pronoun | *who, what* |
| **WP$** | Possessive wh-pronoun | *whose* |
| **WRB** | Wh-adverb | *where, when* |

Look one up interactively instead of scrolling:

```python
nltk.help.upenn_tagset('NNP')
# NNP: noun, proper, singular
#     Motown Venneboerger Christos Tanzania ...
```

---

## 3. Basic use

```python
import nltk
nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng')   # newer NLTK name

words = nltk.word_tokenize("Taj Mahal is a beautiful monument")
nltk.pos_tag(words)
```

```
[('Taj', 'NNP'), ('Mahal', 'NNP'), ('is', 'VBZ'), ('a', 'DT'),
 ('beautiful', 'JJ'), ('monument', 'NN')]
```

`Taj` and `Mahal` → **NNP** (proper noun — a name/place/monument). `is` → **VBZ**.
`beautiful` → **JJ**. Correct on all six.

### What "averaged perceptron tagger" means

It is a **trained statistical model**, not a lookup table. It reads each word *together with
its neighbours* and predicts the most likely tag. That context-sensitivity is essential —
the same string gets different tags in different sentences:

```python
nltk.pos_tag(nltk.word_tokenize("I book a flight"))     # ('book','VBP')  → verb
nltk.pos_tag(nltk.word_tokenize("I read a book"))       # ('book','NN')   → noun
```

No dictionary could do that. `LookupError: averaged_perceptron_tagger not found` simply
means you skipped the download.

---

## 4. ⚠️ The mistake everyone makes

**`pos_tag` takes a LIST OF WORDS, not a string.**

```python
nltk.pos_tag("Taj Mahal is a beautiful monument")     # ❌ WRONG
```
```
[('T','NNP'), ('a','DT'), ('j','NN'), (' ','NNP'), ('M','NNP'), ...]
```

Python happily iterates a string **character by character**, so the tagger dutifully tags
every letter. No exception is raised — you just get nonsense.

```python
nltk.pos_tag("Taj Mahal is a beautiful monument".split())    # ✅ correct
nltk.pos_tag(nltk.word_tokenize("Taj Mahal is a beautiful monument"))  # ✅ better
```

> **The rule:** if `pos_tag` output has single characters in it, you passed a string.

---

## 5. Tagging a whole paragraph

```python
import nltk
from nltk.corpus import stopwords

paragraph = """I have three visions for India. In 3000 years of our history,
people from all over the world have come and invaded us."""

STOP = set(stopwords.words('english'))
sentences = nltk.sent_tokenize(paragraph)

for i in range(len(sentences)):
    words    = nltk.word_tokenize(sentences[i])
    words    = [w for w in words if w not in STOP]   # drop noise words
    pos_tags = nltk.pos_tag(words)
    print(pos_tags)
```

```
[('I','PRP'), ('three','CD'), ('visions','NNS'), ('India','NNP'), ('.','.')]
[('In','IN'), ('3000','CD'), ('years','NNS'), ('history','NN'), (',',','),
 ('people','NNS'), ('world','NN'), ('come','VBN'), ('invaded','VBD'), ('us','PRP'), ('.','.')]
```

### Note what is deliberately missing

**No stemming.** We removed stopwords but did *not* stem, because the tagger needs the
word's real surface form to judge its role. `invaded` is clearly VBD; `invad` (Porter's
output) is not a word and the tagger would guess.

> **Ordering rule: POS-tag BEFORE you stem, never after.**

---

## 6. The real payoff: accurate lemmatization

Combining note 05 and this note — the version worth keeping:

```python
import nltk
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

def wordnet_pos(treebank_tag):
    """Penn Treebank tag → the 4 tags WordNet accepts."""
    if treebank_tag.startswith('J'): return wordnet.ADJ
    if treebank_tag.startswith('V'): return wordnet.VERB
    if treebank_tag.startswith('N'): return wordnet.NOUN
    if treebank_tag.startswith('R'): return wordnet.ADV
    return wordnet.NOUN

def lemmatize_sentence(sentence):
    tagged = nltk.pos_tag(nltk.word_tokenize(sentence))
    return ' '.join(lemmatizer.lemmatize(w, wordnet_pos(t)) for w, t in tagged)

lemmatize_sentence("The striped bats are hanging on their feet and eating best")
# 'The striped bat be hang on their foot and eat best'
```

| Word | Tag | WordNet pos | Lemma |
|---|---|---|---|
| bats | NNS | n | **bat** |
| are | VBP | v | **be** |
| hanging | VBG | v | **hang** |
| feet | NNS | n | **foot** |
| eating | VBG | v | **eat** |

Every one of those is impossible for a stemmer. **This is what POS tagging buys you.**

---

## 7. Useful things you can do with tags

```python
tagged = nltk.pos_tag(nltk.word_tokenize(
    "The beautiful ancient Taj Mahal attracts millions of excited visitors"))

# All nouns → what the text is ABOUT
[w for w, t in tagged if t.startswith('N')]
# ['Taj', 'Mahal', 'millions', 'visitors']

# All adjectives → the OPINION content (a cheap sentiment feature)
[w for w, t in tagged if t.startswith('J')]
# ['beautiful', 'ancient', 'excited']

# Tag frequency distribution
from collections import Counter
Counter(t for _, t in tagged).most_common(3)
```

---

## 8. Self-check

1. `nltk.pos_tag("hello world")` returns tuples of single characters. Why?
2. Why must POS tagging happen before stemming?
3. Map these tags to WordNet: `VBZ`, `NNS`, `JJR`, `RB`.
4. What tag does `India` get, and how does it differ from `NN`?

<details>
<summary>Answers</summary>

1. A string is iterable **by character**, so the tagger receives `['h','e','l','l','o',...]`.
   Pass `word_tokenize(...)` or `.split()` instead.
2. Stemming destroys the surface form the tagger relies on (`invaded → invad`), so the tag
   becomes a guess. Tag first, then stem/lemmatize using the tag.
3. `VBZ → wordnet.VERB` ('v'), `NNS → wordnet.NOUN` ('n'), `JJR → wordnet.ADJ` ('a'),
   `RB → wordnet.ADV` ('r'). Only the **first letter** matters.
4. **NNP** — proper noun singular (a specific name/place). `NN` is a common noun
   (*monument*, *desk*). `NNPS` is the plural proper noun (*Indians*).

</details>

---

**Next:** [08 — Named Entity Recognition](08-Named-Entity-Recognition.md) — going one level
up: not just "this is a proper noun" but "this proper noun is a *person*".
