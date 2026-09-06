# 04 — Logistic Regression

> Source: `Machine_Learning_-_Classifiers_-_Logistic_Regression.pptx`

---

## 1. What is Logistic Regression?

- Logistic Regression is a **statistical machine learning model used to CLASSIFY data**.
- It uses **predictive analysis based on the concept of probability**.
- It finds the **linear relationship between the target and one or more predictors** based on existing data.

> **Trap alert:** Despite the name "regression", **Logistic Regression is a CLASSIFICATION algorithm**. This is one of the most asked MCQs.

### The target variable
The target / dependent variable in logistic regression is a **decision**:
- **YES / NO**, or
- **TRUE / FALSE**, or
- **0 / 1**

### Examples from the slides
1. **Loan eligibility** — Are applicants eligible for a loan (Yes/No)? Based on: **Age, Income, Credit history, Current EMI**.
2. **Spam detection** — Is the incoming mail spam (Yes/No)? Based on: **Subject, Sender mail-id, Body of mail, Mail server**.

### Sample data used in the slides

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

> **Key point:** Instead of giving binary values Y=0 or Y=1 directly, the classifier **predicts the PROBABILITY of belonging to class 1**.

### The logit
For **k independent variables**, the quantity

```
a0 + a1·x1 + a2·x2 + … + ak·xk
```

is called the **logit** (also written as **W·X**, the dot product of the weight vector and the feature vector).

### The sigmoid (logistic) function

```
        1
p = ─────────────
    1 + e^(−z)          where z = logit = W·X
```

The logistic classifier forms a **sigmoid function** with respect to the X variables:

| If the logit moves toward… | …the probability goes to |
|---|---|
| **+ infinity** | **close to 1** |
| **− infinity** | **down to zero** |
| **0** | **0.5** |

The sigmoid squashes any real number into the range **(0, 1)** — which is exactly what a probability needs.

### Learning P(Y|X) directly
- Let **X** be the data instance and **Y** the class label → logistic regression **learns P(Y|X) directly**.
- Let **W = (W1, W2, … Wn)** and **X = (X1, X2, …, Xn)**; **W·X** is the **dot product**.

> **Because it models P(Y|X) directly, Logistic Regression is a DISCRIMINATIVE model** (see note 08).

---

## 3. Decision Boundary

The **decision boundary** is the line (or surface) that separates the predicted classes.

Using the loan example:

| Region | Condition | Probability | Predicted class |
|---|---|---|---|
| **Above the line** | `a0 + a1·age + a2·salary ≥ 0` | **p > 0.5** | **Y = 1** |
| **Below the line** | `a0 + a1·age + a2·salary ≤ 0` | **p < 0.5** | **Y = 0** |

### Choosing the cut-off
The slides ask: *"How to decide on the decision boundary / cut-off value?"* Three options are shown:
- **Cut-off = 0.5** (the default)
- **Cut-off > 0.5** — stricter about predicting class 1 (fewer positives, higher precision)
- **Cut-off < 0.5** — more willing to predict class 1 (more positives, higher recall)

> **Practical meaning:** Moving the cut-off trades off **False Positives against False Negatives**. This is exactly what the **ROC curve** (note 09) visualises — it plots performance as the threshold is varied.

---

## 4. Cost Function

For the classifier function `hθ(x)` (the sigmoid output), the cost function used is the **log-loss / cross-entropy**:

```
Cost(hθ(x), y) =  −log(hθ(x))       if y = 1
                  −log(1 − hθ(x))   if y = 0
```

Combined over m training examples:

```
J(θ) = −(1/m) Σ [ y·log(hθ(x)) + (1−y)·log(1 − hθ(x)) ]
```

**Why not plain squared error?** Because with the sigmoid, squared error gives a **non-convex** cost surface with many local minima; the log-loss form is **convex**, so gradient descent reliably finds the global minimum.

**Intuition:** if the true label is 1 and the model predicts 0.99, `−log(0.99)` ≈ 0 (almost no penalty). If it predicts 0.01, `−log(0.01)` is huge — confident and wrong is punished heavily.

---

## 5. Multiclass Classification

Logistic regression is naturally binary, but it can be extended to more than two classes.

**Examples given:**
- **News classification:** politics, movies, entertainment, sports
- **Weather:** Sunny, Cloudy, Rain, Snow

**How to perform multiclass classification:**
- **One-vs-Rest (OvR / One-vs-All):** train **one classifier per class** — that class vs everything else. At prediction time, pick the class whose classifier gives the **highest probability**.
- **One-vs-One (OvO):** train a classifier for **every pair** of classes and take a **majority vote**.
- **Softmax / Multinomial logistic regression:** generalises the sigmoid to k classes so the probabilities sum to 1.

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

> **Benchmark to remember:** Logistic Regression ≈ **0.786** accuracy on the Census Income dataset (compare with Naive Bayes 0.785, Linear SVM 0.787, Bagging 0.852, Random Forest 0.851, AdaBoost 0.864).

---

## 7. Quick Summary

| Question | Answer |
|---|---|
| Is it regression or classification? | **Classification** |
| What does it output? | The **probability** of belonging to class 1 |
| What function squashes the output? | **Sigmoid / logistic function** |
| What is the linear part called? | The **logit** |
| Default decision threshold? | **0.5** |
| Cost function? | **Log-loss / cross-entropy** (convex) |
| Generative or discriminative? | **Discriminative** — learns P(Y\|X) directly |
| Parametric or non-parametric? | **Parametric** (fixed number of coefficients) |

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
