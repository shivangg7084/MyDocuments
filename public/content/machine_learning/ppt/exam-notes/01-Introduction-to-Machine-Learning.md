# 01 — Introduction to Machine Learning

> Source: `Machine_Learning_-_Introduction.pdf`

---

## 1. What is Machine Learning?

**Simple idea:** Instead of a human writing every rule, we let the computer *find the rules itself* by looking at data.

Three ways the slides define it:

1. **Making predictions or decisions from data.**
2. **"Build a model that is a good and useful approximation to the data."** — the model is never a perfect copy of reality; it is a useful approximation.
3. **Tom Mitchell's formal definition (very important for MCQs):**

> "A computer program is said to learn from **experience E** with respect to some class of **tasks T** and **performance measure P**, if its performance at tasks in T, as measured by P, improves with experience E."

**How to remember E, T, P** — take spam filtering:

| Symbol | Meaning | Spam-filter example |
|---|---|---|
| **T** (Task) | What you want done | Classify email as spam / not spam |
| **E** (Experience) | The data it learns from | Thousands of labelled past emails |
| **P** (Performance) | How you score it | Accuracy / % correctly classified |

---

## 2. Traditional Programming vs Machine Learning

This is one of the most commonly asked MCQ points.

**Traditional Programming**
```
Data    ─┐
         ├──► Computer ──► Output
Program ─┘
```
You give the computer the **data + the program (rules)**, and it produces the **output**.

**Machine Learning**
```
Data   ─┐
        ├──► Computer ──► Program
Output ─┘
```
You give the computer the **data + the expected output (answers)**, and it produces the **program (the model / the rules)**.

> **One-line takeaway:** In traditional programming the *program* is the input; in ML the *program is the output*.

---

## 3. Related Terms (the ML "family")

These fields overlap heavily and share techniques:

- Machine Learning
- Data Mining
- Knowledge Discovery
- Artificial Intelligence
- Statistical Learning
- Pattern Recognition
- Computational Learning

---

## 4. When Should We Use Machine Learning?

ML is worth using in exactly these four situations:

1. **Human expertise does not exist.**
   *Example:* navigating on Mars — nobody has done it before, so no expert rules exist.
2. **Humans are unable to explain their expertise.**
   *Example:* speech recognition — you understand speech instantly but cannot write down the rules for it.
3. **The solution changes over time.**
   *Example:* routing on a computer network — traffic conditions change constantly, so fixed rules go stale.
4. **Data is cheap and abundant; knowledge is expensive and scarce.**
   You have mountains of data but few experts to interpret it.

---

## 5. Applications of Machine Learning

| Domain | Examples from the slides |
|---|---|
| **Science** | Astronomy, neuroscience, medical imaging, bio-informatics |
| **Environment** | Energy, climate, weather, resources |
| **Retail** | Intelligent stock control, demographic store placement |
| **Manufacturing** | Intelligent control, automation |
| **Security / Monitoring** | Intelligent smoke alarms, fraud detection |
| **Marketing** | Promotions, targeting |
| **Management** | Scheduling, timetabling |
| **Finance** | Credit scoring, risk analysis |
| **Web data** | Information retrieval, information extraction |

---

## 6. Types of Machine Learning

### 6.1 Supervised Learning
**Predict an output `y` when given an input `x`.** The training data is **labelled** — every input already comes with its correct answer.

Two sub-types, decided *purely by the type of `y`*:

- **Classification** — if `y` is **categorical** (discrete classes).
  *Examples:* spam / not-spam, disease / no disease, digit 0–9.
- **Regression** — if `y` is **continuous** (a number).
  *Examples:* house price, temperature, salary.

> **Exam trick:** The question "is this classification or regression?" is *always* answered by looking at the **target variable**, never at the input features.

### 6.2 Unsupervised Learning
**Create an internal representation of the input** — there are **no labels**, only inputs.

*Examples:* **clustering**, **dimensionality reduction**.

> **Why it matters (stated explicitly in the slides):** Unsupervised learning is important in machine learning because **getting labels is often difficult and expensive**.

### 6.3 Reinforcement Learning
A sub-area of machine learning where an **agent learns by interacting with its environment**.

Key points:

- The agent receives **rewards** for performing correctly and **penalties** for performing incorrectly.
- The agent learns **without human intervention**, by **maximising reward and minimising penalty**.
- Learning happens by **making decisions sequentially** — the output depends on the **state of the current input**, and **the next input depends on the output of the previous input**.

*Examples:* AI games, Chess, a robot in a maze.

---

## 7. Quick Comparison Table (memorise this)

| Aspect | Supervised | Unsupervised | Reinforcement |
|---|---|---|---|
| **Data** | Labelled (X, Y) | Unlabelled (X only) | No dataset — an environment |
| **Goal** | Predict y from x | Find structure / representation | Maximise cumulative reward |
| **Feedback** | Correct answer given | None | Reward / penalty signal |
| **Decisions** | Independent | Independent | Sequential |
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
