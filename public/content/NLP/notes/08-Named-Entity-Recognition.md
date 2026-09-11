---
title: "08 — Named Entity Recognition (NER)"
description: Pulling people, organisations, places, dates and money out of raw text with ne_chunk — plus how to turn the tree into a usable list.
---

# 08 — Named Entity Recognition (NER)

---

## 1. What NER adds over POS tagging

POS tagging tells you a word's **grammatical** role. NER tells you what it **is in the
world**.

```
   "The Eiffel Tower was built from 1887 to 1889 by French engineer Gustave Eiffel"

   POS tagging says:     Eiffel/NNP  Tower/NNP  1887/CD  Gustave/NNP  Eiffel/NNP
                         ↳ "these are proper nouns and a number"   (grammar)

   NER says:             Eiffel Tower  → ORGANIZATION / FACILITY
                         1887, 1889    → DATE
                         French        → GPE  (geo-political entity)
                         Gustave Eiffel→ PERSON            (meaning)
```

**POS = what kind of word. NER = what kind of thing.**

### Standard entity types

| Type | Meaning | Example |
|---|---|---|
| **PERSON** | People | *Gustave Eiffel, Krish* |
| **ORGANIZATION** | Companies, institutions | *Google, WHO* |
| **GPE** | Geo-political entity — country, state, city | *India, French, Delhi* |
| **LOCATION** | Non-GPE places | *Mount Everest, the Nile* |
| **FACILITY** | Buildings, airports, monuments | *Eiffel Tower* |
| **DATE / TIME** | Temporal expressions | *1887, last Tuesday* |
| **MONEY** | Monetary values | *$1 million, Rs 500* |
| **PERCENT** | Percentages | *25%* |

### Why it is useful

- **Resume parsing** — pull out names, companies, universities.
- **News analytics** — which companies are mentioned in today's articles?
- **Anonymisation** — remove all PERSON entities before sharing a dataset.
- **Search & knowledge graphs** — link "Apple" the company to a database entry, not the fruit.
- **Finance** — extract MONEY and DATE from contracts automatically.

---

## 2. The three-step recipe

NER in NLTK is always exactly these three calls, **in this order**:

```
  raw sentence
      │  ① word_tokenize      → list of words
      │  ② pos_tag            → list of (word, POS) tuples
      │  ③ ne_chunk           → a TREE with entity labels
      ▼
  entities
```

Step ③ **requires** step ② — `ne_chunk` takes *tagged tokens*, not plain words. That is
because grammatical role is strong evidence for entity-hood (only NNPs can be PERSONs).

```python
import nltk
nltk.download('maxent_ne_chunker')
nltk.download('maxent_ne_chunker_tab')   # newer NLTK name
nltk.download('words')                   # the English word list it checks against
nltk.download('averaged_perceptron_tagger')
nltk.download('punkt')

sentence = """The Eiffel Tower was built from 1887 to 1889 by French engineer
Gustave Eiffel, whose company specialized in building metal frameworks and structures."""

words        = nltk.word_tokenize(sentence)   # ①
tag_elements = nltk.pos_tag(words)            # ②
tree         = nltk.ne_chunk(tag_elements)    # ③
print(tree)
```

```
(S
  The/DT
  (ORGANIZATION Eiffel/NNP Tower/NNP)
  was/VBD built/VBN from/IN 1887/CD to/TO 1889/CD by/IN
  (GPE French/JJ)
  engineer/NN
  (PERSON Gustave/NNP Eiffel/NNP)
  ,/, whose/WP$ company/NN specialized/VBD in/IN building/VBG
  metal/NN frameworks/NNS and/CC structures/NNS ./.)
```

### Reading that output

It is a **tree**, not a flat list:

```
                            S  (the whole sentence)
      ┌──────────┬──────────┴────────┬──────────────┬────────┐
   The/DT   (ORGANIZATION)      was/VBD ...      (GPE)    (PERSON)
             ┌────┴────┐                           │      ┌───┴────┐
          Eiffel/NNP Tower/NNP                 French/JJ Gustave Eiffel
```

- Plain `word/TAG` leaves = **not** an entity.
- Bracketed subtrees = **an entity**, with its type as the label.
- Multi-word entities are grouped: `Gustave` + `Eiffel` is **one** PERSON, not two.

**That grouping is the "chunking" in `ne_chunk`** — chunking means assembling adjacent
tokens into a single unit.

### Drawing it

```python
tree.draw()     # opens a Tkinter window — desktop Python only, NOT in Colab
```

In Jupyter/Colab, render inline instead:

```python
from IPython.display import display
display(tree)             # renders as SVG in a notebook
```

---

## 3. ⚠️ NER is statistical — it makes mistakes

In the output above, **`Eiffel Tower` was labelled ORGANIZATION**, but it is a monument
(FACILITY). And `French` was labelled GPE while tagged `JJ` (adjective).

`maxent_ne_chunker` is a **maximum-entropy classifier** trained on news text. It is
guessing from context, and news text mentions "Eiffel" as a company (Gustave Eiffel's firm)
often enough to bias it. Expect roughly:

- **Very reliable:** PERSON, ORGANIZATION, GPE in news-like prose.
- **Shakier:** anything in informal text, tweets, product reviews, or non-Western names.

> For production NER, **spaCy** (`en_core_web_sm`) is materially better and faster:
> ```python
> import spacy
> nlp = spacy.load("en_core_web_sm")
> for ent in nlp(sentence).ents:
>     print(ent.text, ent.label_)
> ```
> NLTK's version is here because it makes the *mechanism* (tag → chunk → tree) visible.

---

## 4. Turning the tree into something usable

A tree is fine for printing; you almost always want a list. Two patterns:

### (a) Extract entities with their labels

```python
def extract_entities(text):
    entities = []
    for sent in nltk.sent_tokenize(text):
        tree = nltk.ne_chunk(nltk.pos_tag(nltk.word_tokenize(sent)))
        for node in tree:
            if hasattr(node, 'label'):                  # it's a subtree → an entity
                name = ' '.join(word for word, tag in node.leaves())
                entities.append((name, node.label()))
    return entities

extract_entities(sentence)
# [('Eiffel Tower', 'ORGANIZATION'), ('French', 'GPE'), ('Gustave Eiffel', 'PERSON')]
```

**`hasattr(node, 'label')` is the idiom.** Entity subtrees have a `.label()`; plain
`(word, tag)` tuples do not. That one check separates the two cases.

### (b) IOB format — the standard for ML pipelines

```python
from nltk.chunk import tree2conlltags

tree2conlltags(tree)[:8]
```
```
[('The','DT','O'),
 ('Eiffel','NNP','B-ORGANIZATION'),   ← B = Beginning of an entity
 ('Tower','NNP','I-ORGANIZATION'),    ← I = Inside the same entity
 ('was','VBD','O'),                   ← O = Outside any entity
 ('built','VBN','O'), ...]
```

**IOB** (Inside–Outside–Beginning) flattens the tree into one tag per token, which is the
format every sequence-labelling model (CRF, BiLSTM, BERT-for-NER) expects. The `B-`/`I-`
distinction is what lets you tell "two adjacent PERSONs" apart from "one two-word PERSON".

---

## 5. A practical example

```python
text = """Apple Inc. was founded by Steve Jobs in Cupertino in 1976.
The company reported revenue of $394 billion in 2022."""

for name, label in extract_entities(text):
    print(f"{label:15} {name}")
```

```
PERSON          Apple
ORGANIZATION    Steve Jobs
GPE             Cupertino
```

Two things to notice:

1. It found the entities but **mislabelled `Apple` as PERSON** and `Steve Jobs` as
   ORGANIZATION — a classic maxent confusion when a company is named like a person.
2. **`$394 billion` and `1976` were missed entirely.** NLTK's chunker does not extract
   MONEY or DATE well. For those, a regex is genuinely better:

```python
import re
re.findall(r'\$\s?[\d,.]+\s?(?:billion|million|thousand)?', text)  # ['$394 billion']
re.findall(r'\b(?:19|20)\d{2}\b', text)                            # ['1976', '2022']
```

> **The real-world lesson:** production NER is usually a **hybrid** — a statistical model
> for PERSON/ORG/GPE, plus regexes for the highly-structured types (money, dates, phone
> numbers, emails, invoice IDs).

---

## 6. Where NER fits

Unlike notes 03–07, NER is **not** part of the standard cleaning pipeline. You do not run
it before bag of words. It is used when the entities themselves are your output:

```
   Classification pipeline  :  clean → vectorize → model        (NER not involved)
   Information extraction   :  tokenize → POS → NER → entities  (this note)
```

But it can *feed* a classification pipeline as engineered features: *"how many ORGANIZATION
mentions does this news article contain?"* is a perfectly good numeric feature.

---

## 7. Self-check

1. What must you do to a sentence before calling `ne_chunk`, and why?
2. Why does `ne_chunk` return a tree instead of a list of tuples?
3. What does `hasattr(node, 'label')` distinguish?
4. In IOB tagging, what is the difference between `B-PERSON` and `I-PERSON`?

<details>
<summary>Answers</summary>

1. `word_tokenize` **then** `pos_tag`. `ne_chunk` consumes `(word, POS)` tuples — the
   grammatical tags are evidence the entity classifier relies on.
2. Because entities can span **multiple tokens** (`Gustave Eiffel`). A tree groups those
   tokens under one labelled node; a flat list of tuples cannot express the grouping.
3. Entity subtrees (which have `.label()`) from ordinary non-entity `(word, tag)` tuples
   (which do not).
4. `B-` marks the **first** token of an entity, `I-` marks continuation tokens. Without the
   distinction, `"Steve Jobs Tim Cook"` would be one four-word PERSON instead of two.

</details>

---

**Next:** [09 — One-Hot Encoding](09-One-Hot-Encoding.md) — pre-processing is done; now the
real problem begins: turning clean text into numbers.
