# 01 — Introduction to Machine Learning

> Source: `Machine_Learning_-_Introduction.pdf`

---

## 1. What is Machine Learning?

### Start with a problem you cannot solve by normal programming

Imagine your boss asks you to write a program that detects spam email. You start writing rules:

```python
if "FREE MONEY" in subject:        return SPAM
if "lottery winner" in body:       return SPAM
if sender not in contacts:         return SPAM   # oops, this blocks your new client
```

Within a week the spammers write **"FR€€ M0N€Y"** and your first rule is dead. You add another rule. They change again. You will lose this race forever, because **there is no finite list of rules that describes spam.**

Machine learning takes the opposite approach:

> **Don't write the rules. Show the computer 50,000 emails that are already marked spam / not-spam, and let it work out the rules itself.**

That is the whole idea. Everything else in this course is detail.

### The three definitions from the slides

1. **Making predictions or decisions from data.**
2. **"Build a model that is a good and useful approximation to the data."**
   Note the words *approximation* and *useful*. A model is never a perfect copy of reality — a map of your city is not the city, but it still gets you home.
3. **Tom Mitchell's formal definition (very important for MCQs):**

> "A computer program is said to learn from **experience E** with respect to some class of **tasks T** and **performance measure P**, if its performance at tasks in T, as measured by P, improves with experience E."

### E, T and P worked out on three examples

The trick is to read the sentence backwards: *what job (T), from what past data (E), scored how (P)?*

| Example | **T** (Task) | **E** (Experience) | **P** (Performance) |
|---|---|---|---|
| **Spam filter** | Classify email as spam / not-spam | 50,000 past emails already labelled | % of emails classified correctly |
| **Chess program** | Play a game of chess | Thousands of games played against itself | % of games won |
| **Handwriting reader** | Recognise a digit 0–9 in an image | 60,000 labelled images of digits | % of digits read correctly |

**Common MCQ trap:** given "a program plays checkers, learns from games played against itself, and is measured by games won", people mix up E and T. **T is the job. E is the data. P is the scorecard.**

---

## 2. Traditional Programming vs Machine Learning

This is one of the most commonly asked MCQ points, so understand it rather than memorising it.

**Traditional Programming**
```
Data    ─┐
         ├──► Computer ──► Output
Program ─┘
```
You supply the **data + the program (the rules)**, and the computer gives you the **output**.

**Machine Learning**
```
Data   ─┐
        ├──► Computer ──► Program
Output ─┘
```
You supply the **data + the expected output (the answers)**, and the computer gives you back the **program (the model / the rules)**.

### Made concrete

Say you want to convert Celsius to Fahrenheit.

**Traditional way** — you already know the rule, so you write it:
```python
def convert(c):
    return c * 1.8 + 32       # you supplied the rule
print(convert(100))           # → 212 (the output)
```

**ML way** — you don't know the rule, but you have examples:
```
Input (C):    0    10    20    30    100
Output (F):  32    50    68    86    212
```
You hand the machine both columns, and it discovers `f = 1.8c + 32` **by itself**. That discovered formula is the **program** — the output of the process.

> **One-line takeaway:** In traditional programming the *program is the input*; in ML the *program is the output*.

---

## 3. Related Terms (the ML "family")

These fields overlap heavily and share techniques — different communities arrived at similar ideas and gave them different names:

- Machine Learning
- Data Mining
- Knowledge Discovery
- Artificial Intelligence
- Statistical Learning
- Pattern Recognition
- Computational Learning

*(Rough distinction if you need one: **AI** is the broad goal of making machines act intelligently, **ML** is one way of getting there — learning from data, and **statistics** is the mathematical foundation underneath.)*

---

## 4. When Should We Use Machine Learning?

ML is not always the right tool. If you need to calculate GST at 18%, just write `price * 0.18` — do **not** train a model. ML earns its place in exactly these four situations:

**1. Human expertise does not exist.**
*Example: navigating on Mars.* No human has ever driven on Mars, so there is no expert whose rules you could copy. The rover must learn.

**2. Humans are unable to explain their expertise.**
*Example: speech recognition.* You understand spoken English effortlessly, but try writing down the exact rules that separate the sound "b" from "p". You cannot — the knowledge is real but not expressible. Same for recognising a friend's face in a crowd.

**3. The solution changes over time.**
*Example: routing on a computer network.* The best route right now depends on traffic that changes every second. A rule hard-coded last year is worthless today. Same for stock prediction and product recommendation.

**4. Data is cheap and abundant; knowledge is expensive and scarce.**
A hospital may hold a million scans but employ only three radiologists. The data is plentiful; the expertise is the bottleneck.

---

## 5. Applications of Machine Learning

| Domain | Examples from the slides | What that actually looks like |
|---|---|---|
| **Science** | Astronomy, neuroscience, medical imaging, bio-informatics | Spotting a tumour in an MRI scan |
| **Environment** | Energy, climate, weather, resources | Forecasting tomorrow's rainfall |
| **Retail** | Intelligent stock control, demographic store placement | Predicting how much milk a store will sell on Friday |
| **Manufacturing** | Intelligent control, automation | Detecting a defective part on the conveyor |
| **Security / Monitoring** | Intelligent smoke alarms, fraud detection | Flagging a card swiped in two cities an hour apart |
| **Marketing** | Promotions, targeting | Deciding who receives the discount coupon |
| **Management** | Scheduling, timetabling | Assigning shifts so nobody works 3 nights running |
| **Finance** | Credit scoring, risk analysis | Deciding whether to approve a loan |
| **Web data** | Information retrieval, information extraction | Ranking search results |

---

## 6. Types of Machine Learning

### 6.1 Supervised Learning

> **Predict an output `y` when given an input `x`.** The training data is **labelled** — every input already comes with its correct answer.

**Analogy:** studying with a solved question bank. Every practice question has the answer printed below it, so you can check yourself and correct your method.

**A tiny labelled dataset:**

| Area (sq ft) | Bedrooms | **Price (lakh)** ← the label |
|---|---|---|
| 1000 | 2 | 50 |
| 1500 | 3 | 75 |
| 2000 | 3 | 95 |

The model learns the relationship, so when you show it a new house (1200 sq ft, 2 bedrooms) it predicts roughly 60 lakh.

Two sub-types, decided **purely by the type of `y`**:

- **Classification** — `y` is **categorical** (discrete classes).
  *Examples:* spam / not-spam, disease / no disease, digit 0–9, dog / cat / horse.
- **Regression** — `y` is **continuous** (a number).
  *Examples:* house price, temperature, salary, tomorrow's sales.

> **Exam trick:** "Is this classification or regression?" is **always** answered by looking at the **target variable**, never at the input features or the algorithm.

**Watch out for the disguise:** predicting a rating of 1–5 stars *looks* numeric, but if the only allowed answers are the five fixed labels, it is classification. Predicting "how many minutes until the bus arrives" is regression, even though the inputs are categorical.

### 6.2 Unsupervised Learning

> **Create an internal representation of the input** — there are **no labels**, only inputs.

**Analogy:** you are handed a shoebox of 500 unlabelled family photos and told "organise these". Nobody tells you the right answer. You would naturally make piles — beach photos, wedding photos, childhood photos. That is **clustering**.

*Examples:* **clustering**, **dimensionality reduction**.

**A tiny unlabelled dataset** — same houses, but the price column is simply gone:

| Area | Bedrooms |
|---|---|
| 1000 | 2 |
| 1050 | 2 |
| 3000 | 5 |

There is nothing to predict. But the algorithm can still notice that rows 1 and 2 belong together and row 3 is a different kind of house.

> **Why it matters (stated explicitly in the slides):** Unsupervised learning is important because **getting labels is often difficult and expensive.** Collecting a million photos is easy; paying humans to label each one is not.

### 6.3 Reinforcement Learning

> A sub-area of machine learning where an **agent learns by interacting with its environment**.

**Analogy:** learning to ride a bicycle. Nobody hands you a labelled dataset of correct handlebar angles. You wobble, you fall (**penalty**), you stay upright for three seconds (**reward**), and you gradually adjust.

Key points from the slides:
- The agent receives **rewards** for performing correctly and **penalties** for performing incorrectly.
- The agent learns **without intervention from a human**, by **maximising its reward and minimising its penalty**.
- Learning happens by **making decisions sequentially** — the output depends on the **state of the current input**, and **the next input depends on the output of the previous input.**

**That last point is the heart of it.** In supervised learning, classifying email #7 has no effect on email #8. In reinforcement learning, the move you make now *changes the board you face next*. Decisions are chained, not independent.

*Examples:* AI games, Chess, a robot in a maze.

---

## 7. Quick Comparison Table (memorise this)

| Aspect | Supervised | Unsupervised | Reinforcement |
|---|---|---|---|
| **Data** | Labelled (X, Y) | Unlabelled (X only) | No dataset — an environment |
| **Goal** | Predict y from x | Find structure / representation | Maximise cumulative reward |
| **Feedback** | Correct answer given | None | Reward / penalty signal |
| **Decisions** | Independent | Independent | **Sequential** |
| **Analogy** | Solved question bank | Sorting unlabelled photos | Learning to ride a bicycle |
| **Examples** | Classification, Regression | Clustering, Dimensionality reduction | Chess, robot in a maze |

---

## 8. Famous Quotes (occasionally asked as "who said it")

- "A breakthrough in machine learning would be worth ten Microsofts." — **Bill Gates**
- "Machine learning is the next Internet." — **Tony Tether, Director, DARPA**
- "Machine learning is today's discontinuity." — **Jerry Yang, ex-CEO, Yahoo**

---

# MCQ Practice — Introduction to Machine Learning

**Q1.** According to Tom Mitchell's definition, a program learns from experience E with respect to tasks T and performance measure P if:
- A) E improves as T increases
- B) Its performance at tasks in T, measured by P, improves with experience E
- C) P is independent of E
- D) T is fixed and E is constant

**Q2.** In Machine Learning (as opposed to traditional programming), the *output* of the computer is:
- A) The data
- B) The output values
- C) The program (model)
- D) The performance measure

**Q3.** In traditional programming, the inputs to the computer are:
- A) Data and Output
- B) Data and Program
- C) Program and Output
- D) Only Data

**Q4.** Predicting the *price of a house* is an example of:
- A) Classification
- B) Regression
- C) Clustering
- D) Reinforcement learning

**Q5.** Predicting whether an email is *spam or not spam* is an example of:
- A) Regression
- B) Clustering
- C) Classification
- D) Dimensionality reduction

**Q6.** What decides whether a supervised problem is classification or regression?
- A) The number of input features
- B) The size of the dataset
- C) The type of the target/output variable
- D) The learning algorithm used

**Q7.** Which of the following is an unsupervised learning task?
- A) Spam detection
- B) Clustering customers into groups
- C) Predicting salary
- D) Credit scoring

**Q8.** Why is unsupervised learning considered important?
- A) It is always more accurate
- B) Getting labels is often difficult and expensive
- C) It requires no data
- D) It always runs faster

**Q9.** In reinforcement learning, the agent learns by:
- A) Being given correct labels for every input
- B) Interacting with its environment and receiving rewards/penalties
- C) Clustering the input data
- D) Reducing dimensionality

**Q10.** Which statement about reinforcement learning is TRUE?
- A) The next input is independent of the previous output
- B) It requires a fully labelled dataset
- C) The next input depends on the output of the previous input
- D) It cannot be used for games

**Q11.** "Navigating on Mars" is given as an example of which condition for using ML?
- A) Humans cannot explain their expertise
- B) Human expertise does not exist
- C) Solution changes in time
- D) Data is cheap and abundant

**Q12.** "Speech recognition" is given as an example of which condition for using ML?
- A) Human expertise does not exist
- B) Humans are unable to explain their expertise
- C) Solution changes in time
- D) Knowledge is cheap

**Q13.** "Routing on a computer network" illustrates:
- A) Human expertise does not exist
- B) Humans cannot explain their expertise
- C) The solution changes in time
- D) Labels are expensive

**Q14.** Which of these is NOT listed as a type of machine learning in the slides?
- A) Supervised learning
- B) Unsupervised learning
- C) Reinforcement learning
- D) Prescriptive learning

**Q15.** Fraud detection falls under which application area listed in the slides?
- A) Retail
- B) Security / Monitoring
- C) Finance only
- D) Web data

**Q16.** Dimensionality reduction is a form of:
- A) Supervised learning
- B) Unsupervised learning
- C) Reinforcement learning
- D) Semi-supervised only

**Q17.** In reinforcement learning, the agent's objective is to:
- A) Minimise reward and maximise penalty
- B) Maximise reward and minimise penalty
- C) Minimise both reward and penalty
- D) Ignore reward entirely

**Q18.** Which of the following pairs is correctly matched?
- A) Classification → continuous target
- B) Regression → categorical target
- C) Clustering → labelled data
- D) Classification → categorical target

**Q19.** "A breakthrough in machine learning would be worth ten Microsofts" was said by:
- A) Jerry Yang
- B) Tony Tether
- C) Bill Gates
- D) Tom Mitchell

**Q20.** Which is NOT listed as a term related to Machine Learning?
- A) Pattern Recognition
- B) Knowledge Discovery
- C) Statistical Learning
- D) Deterministic Compilation

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Exact wording of Mitchell's definition. |
| 2 | **C** | In ML you feed Data + Output and get the Program back. |
| 3 | **B** | Traditional: Data + Program → Output. |
| 4 | **B** | Price is a continuous number → regression. |
| 5 | **C** | Spam / not-spam is categorical → classification. |
| 6 | **C** | Categorical y → classification; continuous y → regression. |
| 7 | **B** | Clustering needs no labels. |
| 8 | **B** | Stated directly in the slides. |
| 9 | **B** | Agent + environment + reward/penalty. |
| 10 | **C** | RL is sequential decision-making. |
| 11 | **B** | No human has navigated Mars → no expertise exists. |
| 12 | **B** | We do it effortlessly but cannot write the rules. |
| 13 | **C** | Network conditions keep changing. |
| 14 | **D** | Only supervised, unsupervised and reinforcement are listed. |
| 15 | **B** | Slides list "Security (intelligent smoke alarms, fraud detection)". |
| 16 | **B** | Listed alongside clustering under unsupervised. |
| 17 | **B** | Maximise reward, minimise penalty. |
| 18 | **D** | Classification = categorical target. |
| 19 | **C** | Bill Gates. |
| 20 | **D** | Not in the list. |
