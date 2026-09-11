---
description: Natural Language Processing for Machine Learning — full course notes, from tokenization to Word2Vec, with runnable notebooks and two end-to-end projects.
---

# Natural Language Processing

Everything in this folder builds one skill: **turning human text into numbers a machine
learning model can learn from.** That is the whole subject in one sentence.

- **[notes/](notes/)** — 18 numbered explainers. Start at [`00-README-NLP-Index.md`](notes/00-README-NLP-Index.md).
- **[notebooks/](notebooks/)** — 5 runnable Jupyter notebooks matching the notes.
- `transcript.txt`, `finalNLP.pdf` — the original source material these notes were written from.

## Quick start

```bash
pip install nltk scikit-learn gensim pandas numpy beautifulsoup4 lxml tqdm
python -c "import nltk; [nltk.download(p) for p in ['punkt','punkt_tab','stopwords','wordnet','omw-1.4','averaged_perceptron_tagger','averaged_perceptron_tagger_eng','maxent_ne_chunker','maxent_ne_chunker_tab','words']]"
```
