# 04 — Logistic Regression

> Source: `Machine_Learning_-_Classifiers_-_Logistic_Regression.pptx`

---

## 1. What is Logistic Regression?

### Why linear regression fails at yes/no questions

Suppose you predict loan repayment (1 = repays, 0 = defaults) using linear regression on salary. You get a straight line — and immediately hit two absurdities:

- For a very high salary the line predicts **1.4**. What is a 140% probability?
- For a very low salary it predicts **−0.3**. A negative probability?

A straight line runs to ±infinity, but a yes/no answer must live between 0 and 1. **Logistic regression fixes this by bending the line into an S-shape that can never escape 0 and 1.**

### The definition from the slides

- Logistic Regression is a **statistical machine learning model used to CLASSIFY data.**
- It uses **predictive analysis based on the concept of probability.**
- It finds the **linear relationship between the target and one or more predictors** based on existing data.

> **Trap alert:** despite the name "regression", **Logistic Regression is a CLASSIFICATION algorithm.** This is the single most asked trick question in the syllabus. *(The name is historical — the linear part inside it is genuine regression, but the output is a class.)*

### The target variable
The target / dependent variable is a **decision**:
- **YES / NO**, or **TRUE / FALSE**, or **0 / 1**

### Examples from the slides
1. **Loan eligibility** — are applicants eligible for a loan (Yes/No)? Based on **Age, Income, Credit history, Current EMI**.
2. **Spam detection** — is the incoming mail spam (Yes/No)? Based on **Subject, Sender mail-id, Body of mail, Mail server**.

### The sample data used in the slides

| Age | Salary | Loan Repaid |
|---|---|---|
| 75 | 75000 | 1 |
| 66 | 91000 | 1 |
| 73 | 80000 | 1 |
| 27 | 80000 | 0 |
| 59 | 67000 | 1 |
| 90 | 48000 | 1 |
| 72 | 73000 | 1 |
| 45 | 73000 | 0 |
| 50 | 55000 | 0 |
| 58 | 57000 | 0 |
| 100 | 87000 | 1 |

- **Independent variables:** Age and Salary
- **Dependent variable:** zero or one (will repay / will not repay)

We want a **binary classifier** `f(age, salary)` that outputs **Y = 0 (will not repay)** or **Y = 1 (will repay)**.

---

## 2. Logistic Regression as a Classifier

> **Key point:** instead of giving binary values Y=0 or Y=1 directly, the classifier **predicts the PROBABILITY of belonging to class 1.**

This is genuinely useful. "This applicant will default" is a blunt statement; **"this applicant has a 73% chance of defaulting"** lets a bank set its own risk appetite.

### Step 1 — the logit (the straight-line part)

For **k independent variables**, the quantity

```
z = a0 + a1·x1 + a2·x2 + … + ak·xk
```

is called the **logit** (also written **W·X**, the dot product of the weight and feature vectors). This is an ordinary linear combination — it can be any number from −∞ to +∞.

### Step 2 — the sigmoid (the squashing part)

```
        1
p = ─────────────          where z = the logit
    1 + e^(−z)
```

### Watch the sigmoid work — actual numbers

| z (logit) | e^(−z) | p = 1/(1+e^(−z)) | Meaning |
|---|---|---|---|
| **−4** | 54.60 | **0.018** | Almost certainly class 0 |
| **−2** | 7.39 | **0.119** | Probably class 0 |
| **0** | 1.00 | **0.500** | Completely undecided |
| **+2** | 0.135 | **0.881** | Probably class 1 |
| **+4** | 0.018 | **0.982** | Almost certainly class 1 |

Plotted, these points trace the S-curve:

```
p
1.0 |                        ● ● ●───────
    |                    ●
0.5 |- - - - - - - - - ● - - - - - - - -
    |              ●
0.0 |───── ● ● ●
    └──────────────────────────────────► z
        −4    −2    0    +2    +4
```

The slides state this as: **if the logit moves towards +infinity the probability moves close to 1, and if the logit moves towards −infinity the probability comes down to zero.**

**The key property:** the sigmoid squashes *any* real number into **(0, 1)** — never reaching either end, which is exactly what a probability needs.

### Worked end-to-end prediction

Say training produced:
```
z = −4 + 0.05 × Age + 0.00004 × Salary
```
For an applicant aged **60** earning **₹80,000**:
```
z = −4 + 0.05(60) + 0.00004(80000)
  = −4 + 3 + 3.2
  = 2.2

p = 1 / (1 + e^(−2.2)) = 1 / (1 + 0.1108) = 0.900
```
**→ 90% probability of repaying. Since 0.90 > 0.5, predict class 1 (will repay).**

### Learning P(Y|X) directly
- Let **X** be the data instance and **Y** the class label → logistic regression **learns P(Y|X) directly.**
- Let **W = (W1, W2, … Wn)** and **X = (X1, X2, …, Xn)**; **W·X** is the **dot product**.

> Because it models P(Y|X) directly, **Logistic Regression is a DISCRIMINATIVE model** — it learns *where the border is*, not what each class looks like (see note 08).

---

## 3. Decision Boundary

The **decision boundary** is the line (or surface) separating the predicted classes. It is exactly the place where **z = 0**, because that is where **p = 0.5** — the point of maximum indecision.

Using the loan example:

| Region | Condition | Probability | Predicted class |
|---|---|---|---|
| **Above the line** | `a0 + a1·age + a2·salary ≥ 0` | **p > 0.5** | **Y = 1** |
| **Below the line** | `a0 + a1·age + a2·salary ≤ 0` | **p < 0.5** | **Y = 0** |

```
Salary
   │   ○   ○  ○      ○ = will repay (Y=1)
   │  ○  ○ ╱ ○
   │ ○   ╱  ○        ← the decision boundary (z = 0, p = 0.5)
   │ ● ╱ ●   ●
   │ ╱ ●  ●  ●       ● = will not repay (Y=0)
   └────────────────► Age
```

### Choosing the cut-off — and why you would move it

The slides show three options: **cut-off = 0.5** (default), **> 0.5**, and **< 0.5**. This is not a technicality — it is a business decision:

| Cut-off | Effect | When you would want it |
|---|---|---|
| **Raise to 0.8** | Predicts "positive" **rarely**, only when very sure → fewer false alarms, more misses | Approving expensive loans — a wrong yes is costly |
| **0.5** | Neutral default | No strong preference |
| **Lower to 0.2** | Predicts "positive" **readily** → catches nearly everything, many false alarms | Cancer screening — a missed case is far worse than an extra test |

> **The trade-off never disappears:** moving the cut-off trades **False Positives against False Negatives**. You choose which mistake you would rather make. This is precisely what the **ROC curve** in note 09 visualises — performance across every possible cut-off.

---

## 4. Cost Function

For the classifier function `hθ(x)` (the sigmoid output), the cost function is the **log-loss / cross-entropy**:

```
Cost(hθ(x), y) =  −log(hθ(x))       if y = 1
                  −log(1 − hθ(x))   if y = 0
```

Combined over m training examples:

```
J(θ) = −(1/m) Σ [ y·log(hθ(x)) + (1−y)·log(1 − hθ(x)) ]
```

### Why this shape — see the penalty in numbers

Take a case where the **true label is 1**:

| Model predicted | Cost = −log(p) | Verdict |
|---|---|---|
| 0.99 | **0.01** | Confident and right → almost no penalty |
| 0.70 | **0.36** | Right but unsure → small penalty |
| 0.50 | **0.69** | No opinion → moderate penalty |
| 0.10 | **2.30** | Wrong → heavy penalty |
| 0.01 | **4.61** | Confidently wrong → brutal penalty |

**The lesson the loss teaches the model: being wrong is bad, but being *confidently* wrong is catastrophic.** As p → 0 while the truth is 1, the cost heads to infinity. This is why a well-trained logistic model is cautious about extreme probabilities unless the evidence is overwhelming.

**Why not plain squared error?** With the sigmoid inside, squared error produces a **non-convex** cost surface — a landscape full of valleys where gradient descent gets stuck in a local minimum and never reaches the best answer. The log-loss form is **convex**: one single valley, so gradient descent always slides to the true global minimum.

---

## 5. Multiclass Classification

Logistic regression is naturally binary, but real problems often have more classes.

**Examples given in the slides:**
- **News classification:** politics, movies, entertainment, sports
- **Weather:** Sunny, Cloudy, Rain, Snow

### One-vs-Rest (OvR / One-vs-All) — worked

Train **one classifier per class**, each answering a yes/no question. For the 4 news categories:

```
Classifier 1:  politics      vs everything else  → 0.10
Classifier 2:  movies        vs everything else  → 0.15
Classifier 3:  entertainment vs everything else  → 0.20
Classifier 4:  sports        vs everything else  → 0.85  ← highest
```
**Predict: sports.** With k classes you train **k classifiers**.

### One-vs-One (OvO)
Train a classifier for **every pair** of classes and take a **majority vote**. With k classes that is **k(k−1)/2** classifiers — for 4 classes, 6 of them.

### Softmax (Multinomial logistic regression)
Generalises the sigmoid so that all k probabilities are produced together and **sum to exactly 1** — e.g. `[0.10, 0.15, 0.20, 0.55]`. One model instead of many.

---

## 6. Python Example (Census Income dataset)

```python
from sklearn.linear_model import LogisticRegression

log_reg = LogisticRegression(random_state=0).fit(X_train, y_train)
print(log_reg.predict(X_test))
# [' <=50K' ' <=50K' ' <=50K' ... ' <=50K' ' <=50K' ' <=50K']

print("Accuracy of Logistic Regression = ", log_reg.score(X_test, y_test))
# Accuracy of Logistic Regression = 0.7863852359376726
```

Useful extras:
```python
log_reg.predict_proba(X_test)   # the probabilities themselves, not just the labels
log_reg.coef_                   # which features push towards >50K, and how hard
```

> **Benchmark to remember:** Logistic Regression ≈ **0.786** on the Census Income dataset (Naive Bayes 0.785, Linear SVM 0.787, Bagging 0.852, Random Forest 0.851, AdaBoost 0.864).

---

## 7. Quick Summary

| Question | Answer |
|---|---|
| Regression or classification? | **Classification** |
| What does it output? | The **probability** of belonging to class 1 |
| What squashes the output? | The **sigmoid / logistic function** |
| What is the linear part called? | The **logit** |
| Default decision threshold? | **0.5** |
| Cost function? | **Log-loss / cross-entropy** (convex) |
| Generative or discriminative? | **Discriminative** — learns P(Y\|X) directly |
| Parametric or non-parametric? | **Parametric** (a fixed set of coefficients) |

---

# MCQ Practice — Logistic Regression

**Q1.** Logistic Regression is fundamentally a:
- A) Regression algorithm
- B) Classification algorithm
- C) Clustering algorithm
- D) Dimensionality reduction technique

**Q2.** The dependent variable in logistic regression is:
- A) Continuous
- B) A decision such as Yes/No, True/False, 0/1
- C) Always multi-valued
- D) Unlabelled

**Q3.** Instead of directly giving 0 or 1, the logistic classifier predicts:
- A) The mean of the features
- B) The probability of belonging to class 1
- C) The distance to the boundary only
- D) The variance

**Q4.** The expression `a0 + a1·x1 + a2·x2 + ... + ak·xk` is called the:
- A) Sigmoid
- B) Logit
- C) Residual
- D) Kernel

**Q5.** The function used to convert the logit into a probability is:
- A) ReLU
- B) Sigmoid
- C) Softplus
- D) Tanh only

**Q6.** As the logit moves towards +infinity, the predicted probability:
- A) Goes to 0
- B) Goes close to 1
- C) Stays at 0.5
- D) Becomes negative

**Q7.** As the logit moves towards −infinity, the predicted probability:
- A) Comes down to zero
- B) Goes to 1
- C) Becomes undefined
- D) Goes to infinity

**Q8.** When the logit equals 0, the predicted probability is:
- A) 0
- B) 1
- C) 0.5
- D) −1

**Q9.** The output range of the sigmoid function is:
- A) (−∞, ∞)
- B) [−1, 1]
- C) (0, 1)
- D) [0, ∞)

**Q10.** In the loan example, a point is classified as Y = 1 when:
- A) a0 + a1·age + a2·salary ≤ 0
- B) a0 + a1·age + a2·salary ≥ 0, i.e. p > 0.5
- C) p < 0.5
- D) The salary is highest

**Q11.** The default cut-off value for the decision boundary is:
- A) 0
- B) 0.5
- C) 1
- D) It depends on the number of features

**Q12.** Increasing the cut-off above 0.5 will generally:
- A) Predict class 1 more often
- B) Predict class 1 less often
- C) Have no effect
- D) Make the model non-linear

**Q13.** Logistic regression learns which quantity directly?
- A) P(X|Y)
- B) P(Y)
- C) P(Y|X)
- D) P(X)

**Q14.** Because it learns P(Y|X) directly, logistic regression is a:
- A) Generative model
- B) Discriminative model
- C) Clustering model
- D) Non-parametric model

**Q15.** The cost function used in logistic regression is:
- A) Mean squared error
- B) Log-loss / cross-entropy
- C) Hinge loss
- D) Gini impurity

**Q16.** Squared error is not used with the sigmoid because it makes the cost surface:
- A) Convex
- B) Non-convex with local minima
- C) Linear
- D) Discrete

**Q17.** W·X in logistic regression denotes:
- A) Element-wise product
- B) The dot product of weights and features
- C) Matrix inverse
- D) The covariance

**Q18.** Which is an example of multiclass classification given in the slides?
- A) Spam / not spam
- B) Loan repaid / not repaid
- C) Weather: Sunny, Cloudy, Rain, Snow
- D) Pass / fail

**Q19.** In the One-vs-Rest strategy for k classes, the number of binary classifiers trained is:
- A) 1
- B) k
- C) k(k−1)/2
- D) 2k

**Q20.** In the One-vs-One strategy for k classes, the number of classifiers is:
- A) k
- B) k(k−1)/2
- C) k²
- D) 1

**Q21.** In the loan dataset used in the slides, the independent variables are:
- A) Age and Loan Repaid
- B) Age and Salary
- C) Salary and Loan Repaid
- D) Only Age

**Q22.** The accuracy of Logistic Regression on the Census Income dataset in the slides was approximately:
- A) 0.58
- B) 0.68
- C) 0.786
- D) 0.86

**Q23.** Which sklearn import is correct for logistic regression?
- A) `from sklearn.linear_model import LogisticRegression`
- B) `from sklearn.svm import LogisticRegression`
- C) `from sklearn.tree import LogisticRegression`
- D) `from sklearn.naive_bayes import LogisticRegression`

**Q24.** Logistic regression is best described as:
- A) Non-parametric
- B) Parametric with a fixed set of coefficients
- C) Instance-based
- D) Rule-based

**Q25.** Which of these is NOT a stated example of logistic regression use?
- A) Loan eligibility prediction
- B) Spam mail detection
- C) News category classification
- D) Predicting exact house prices in rupees

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | It classifies, despite the name. |
| 2 | **B** | Yes/No, True/False, 0/1. |
| 3 | **B** | Probability of class 1. |
| 4 | **B** | The linear combination is the logit. |
| 5 | **B** | Sigmoid / logistic function. |
| 6 | **B** | Probability → 1. |
| 7 | **A** | Probability → 0. |
| 8 | **C** | 1/(1+e⁰) = 0.5. |
| 9 | **C** | Strictly between 0 and 1. |
| 10 | **B** | Above the boundary → p > 0.5 → Y=1. |
| 11 | **B** | 0.5 is the default cut-off. |
| 12 | **B** | Harder to cross → fewer positives. |
| 13 | **C** | Direct P(Y\|X). |
| 14 | **B** | Discriminative models the boundary. |
| 15 | **B** | Log-loss / cross-entropy. |
| 16 | **B** | Non-convex → local minima. |
| 17 | **B** | Dot product. |
| 18 | **C** | Four weather classes. |
| 19 | **B** | One classifier per class. |
| 20 | **B** | One per pair of classes. |
| 21 | **B** | Age and Salary; repaid is the target. |
| 22 | **C** | 0.7863852359376726. |
| 23 | **A** | It lives in `linear_model`. |
| 24 | **B** | Fixed number of coefficients. |
| 25 | **D** | A continuous price is regression, not logistic regression. |
