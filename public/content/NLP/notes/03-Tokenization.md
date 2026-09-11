---
title: "03 — Tokenization"
description: Paragraph → sentences → words. All five NLTK tokenizers compared on the same input, with the exact output differences spelled out.
---

# 03 — Tokenization

---

## 1. The definition

> **Tokenization is the process of converting a paragraph or a sentence into tokens.**

A **token** is whatever unit you chose to split into. There are two useful choices:

```
   PARAGRAPH (corpus)
   "My name is Krish. I am also a YouTuber."
            │
            │  sentence tokenization  →  tokens are SENTENCES
            ▼
   ["My name is Krish.",  "I am also a YouTuber."]
            │
            │  word tokenization      →  tokens are WORDS
            ▼
   ["My","name","is","Krish",".","I","am","also","a","YouTuber","."]
```

So the exam-safe answer is:

> Tokenization converts a paragraph or a sentence into tokens. If a paragraph is split into
> sentences, **each sentence is a token**. If it is split into words, **each word is a
> token**.

### Why we bother

Because **every downstream step operates on words, not on paragraphs.** You cannot stem a
paragraph. You cannot check a paragraph against a stopword list. You cannot assign a vector
to a paragraph directly. Tokenization is the step that gives you units small enough to
clean, and it is therefore always step one.

---

## 2. Setup

```python
!pip install nltk
```

```python
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')   # NLTK ≥ 3.8.2 renamed the package; download both
```

Our test corpus for the whole note — deliberately containing `.`, `!`, `,`, `\n` and an
apostrophe, because those are exactly what separates the tokenizers:

```python
corpus = """Hello Welcome, to Krish Naik's NLP tutorials.
Please do watch the entire course! to become expert in NLP."""
print(corpus)
```

---

## 3. Sentence tokenization — `sent_tokenize`

```python
from nltk.tokenize import sent_tokenize

documents = sent_tokenize(corpus)
for sentence in documents:
    print(sentence)
```

```
Hello Welcome, to Krish Naik's NLP tutorials.
Please do watch the entire course!
to become expert in NLP.
```

**Three** sentences, not two — it split on `!` as well as on `.`.

### What is actually happening

`sent_tokenize` uses the **Punkt sentence tokenizer**, an *unsupervised* model that was
trained on real text to recognise sentence boundaries. It is not a naive `text.split(".")`,
and the difference matters:

```python
tricky = "Dr. Rao paid Rs. 5.5 lakh to Mr. Sharma. He was happy."
print(sent_tokenize(tricky))
# ['Dr. Rao paid Rs. 5.5 lakh to Mr. Sharma.', 'He was happy.']

print(tricky.split("."))   # the naive approach, for contrast
# ['Dr', ' Rao paid Rs', ' 5', '5 lakh to Mr', ' Sharma', ' He was happy', '']
```

Punkt knows `Dr.`, `Rs.` and `5.5` are not sentence ends. **This is why you use the library
rather than `.split()`.**

It also supports other languages:

```python
sent_tokenize(text, language='german')
```

Useful checks:

```python
type(documents)   # list  — so sentences are just a Python list of strings
len(documents)    # 3
```

---

## 4. Word tokenization — `word_tokenize`

```python
from nltk.tokenize import word_tokenize

word_tokenize(corpus)
```

```
['Hello', 'Welcome', ',', 'to', 'Krish', 'Naik', "'s", 'NLP', 'tutorials', '.',
 'Please', 'do', 'watch', 'the', 'entire', 'course', '!', 'to', 'become',
 'expert', 'in', 'NLP', '.']
```

Observe:

- `,` `.` `!` each became **their own token**. Punctuation is a token, not noise to be
  silently dropped — you remove it later, on purpose, with a regex.
- `Naik's` split into `Naik` + `'s`.

### Words inside sentences — the pattern you will actually use

Rarely do you tokenize the whole paragraph at once. The real pattern is **nested**:

```python
for sentence in documents:
    print(word_tokenize(sentence))
```

```
['Hello', 'Welcome', ',', 'to', 'Krish', 'Naik', "'s", 'NLP', 'tutorials', '.']
['Please', 'do', 'watch', 'the', 'entire', 'course', '!']
['to', 'become', 'expert', 'in', 'NLP', '.']
```

**Memorise this loop.** Notes 06, 07 and 08 are all variations on it:

```python
for i in range(len(sentences)):
    words = word_tokenize(sentences[i])      # sentence → words
    words = [do_something(w) for w in words] # clean each word
    sentences[i] = ' '.join(words)           # words → sentence again
```

---

## 5. The other three tokenizers — and exactly how they differ

NLTK ships several word tokenizers. They differ on **punctuation and apostrophes only**,
but those differences change your vocabulary, so know them.

```python
from nltk.tokenize import wordpunct_tokenize, TreebankWordTokenizer

print(word_tokenize(corpus))
print(wordpunct_tokenize(corpus))
print(TreebankWordTokenizer().tokenize(corpus))
```

### Comparison on the same input

| Tokenizer | `Naik's` becomes | Punctuation | Final `.` of the text |
|---|---|---|---|
| `word_tokenize` | `Naik` + `'s` | separate tokens | separate token |
| `wordpunct_tokenize` | `Naik` + `'` + `s` | **every** punctuation mark split, always | separate token |
| `TreebankWordTokenizer` | `Naik` + `'s` | separate | **attached to the previous word** (`NLP.`) |

### Read that last row again

`TreebankWordTokenizer` keeps the **final** full stop of the text glued to the last word:

```python
TreebankWordTokenizer().tokenize("Hello world. Bye now.")
# ['Hello', 'world.', 'Bye', 'now.']
#                ↑ the '.' stayed attached
```

Its rule is "treat full stops as sentence-internal unless the sentence is finished", which
is inherited from the Penn Treebank conventions. It is occasionally handy, but **for normal
work use `word_tokenize` and `sent_tokenize`.**

### Why `wordpunct_tokenize` is sometimes what you want

Because it splits `'` from `s`, it guarantees **no token contains punctuation at all**.
When your next step is "keep only alphabetic tokens", that's convenient:

```python
words = [w for w in wordpunct_tokenize(corpus) if w.isalpha()]
# ['Hello','Welcome','to','Krish','Naik','s','NLP','tutorials', ...]
```

---

## 6. The gensim shortcut — `simple_preprocess`

You will meet this in note 15 and the Word2Vec project. It does **three jobs in one call**:
tokenize + lowercase + drop tokens that are too short or too long.

```python
from gensim.utils import simple_preprocess

simple_preprocess("Hello Welcome, to Krish Naik's NLP tutorials in 2024!!")
# ['hello', 'welcome', 'to', 'krish', 'naik', 'nlp', 'tutorials', 'in']
```

Note what vanished without you asking: **punctuation, the digits `2024`, and all
capitalisation.** That is either exactly what you want (Word2Vec training) or a silent bug
(if the numbers mattered). Know which situation you are in.

---

## 7. Which one do I use?

```
Need sentences from a paragraph? ────────────────▶ sent_tokenize
Need words, general purpose? ────────────────────▶ word_tokenize
Need words with zero punctuation attached? ──────▶ wordpunct_tokenize
Training Word2Vec / want lowercase+clean fast? ──▶ gensim simple_preprocess
Need Penn-Treebank-exact behaviour? ─────────────▶ TreebankWordTokenizer
```

---

## 8. Self-check

1. `sent_tokenize` on `"Wow!! Amazing. Really?"` returns how many sentences?
2. Why is `word_tokenize("don't")` two tokens, and what are they?
3. Your vocabulary contains both `dog` and `dog.` — which tokenizer choice caused this, and
   how do you fix it?

<details>
<summary>Answers</summary>

1. **3** — Punkt splits on `!`, `.` and `?` (the doubled `!!` counts once).
2. `['do', "n't"]` — Punkt/Treebank rules split contractions into their grammatical parts
   so that negation stays visible as its own token.
3. `TreebankWordTokenizer` (final-full-stop-attached), or splitting on whitespace yourself.
   Fix by using `word_tokenize`, or by stripping non-alphabetic characters with
   `re.sub('[^a-zA-Z]', ' ', text)` before tokenizing — which is what the projects do.

</details>

---

**Next:** [04 — Stemming](04-Stemming.md) — now that you have words, shrink them to their
root form.
