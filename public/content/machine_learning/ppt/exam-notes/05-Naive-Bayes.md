# 05 — Naive Bayes Classifier

> Source: `Machine_Learning_-_Classifiers_-_Naive_Bayes.pptx`

---

## 1. What is Naive Bayes?

- Naive Bayes is a **simple but powerful algorithm which uses probability**, i.e. **Bayes' Theorem**.
- The name has **two parts: "Naive" and "Bayes"**.

| Part | Meaning |
|---|---|
| **"Naive"** | It **assumes that the presence of a feature in a class is unrelated to any other feature** — i.e. all features are **conditionally independent**. This assumption is naive (unrealistic), hence the name. |
| **"Bayes"** | It applies **Bayes' theorem for conditional probability**. |

---

## 2. Bayes' Theorem

```
              P(X | C) · P(C)
P(C | X) = ───────────────────
                  P(X)
```

| Term | Name | Meaning |
|---|---|---|
| **P(C \| X)** | **Posterior** probability | Probability of class C **given** the evidence X — what we want |
| **P(X \| C)** | **Likelihood** | Probability of seeing the evidence X if the class were C |
| **P(C)** | **Prior** probability | Probability of class C before seeing any evidence |
| **P(X)** | **Evidence / marginal** | Probability of the evidence overall |

### The Naive assumption applied
For features x₁, x₂, …, xₙ, the naive independence assumption lets us write:

```
P(x1, x2, ..., xn | C) = P(x1|C) · P(x2|C) · ... · P(xn|C)
```

That is: **just multiply the individual conditional probabilities**. This turns an impossible-to-estimate joint probability into a handful of easy counts.

### The MAP rule
Since **P(X) is the same for every class**, we can ignore the denominator and simply pick the class with the largest numerator:

```
Predicted class = argmax over C of  [ P(x1|C)·P(x2|C)·…·P(xn|C) · P(C) ]
```

This is the **MAP rule** (**Maximum A Posteriori**).

---

## 3. Worked Example — The "Play Tennis" Dataset

### Training phase
Count frequencies from the training data and build **look-up tables** of:
- **P(feature value | class)** for every feature, and
- the **prior P(class)**.

### Test / prediction phase
Given a new data point:

```
x' = (Outlook = Sunny, Temperature = Cool, Humidity = High, Wind = Strong)
```

The NB algorithm **refers to the look-up tables** and applies the **MAP rule**:

```
P(Yes | x') ∝ [P(Sunny|Yes)·P(Cool|Yes)·P(High|Yes)·P(Strong|Yes)] · P(Play=Yes) = 0.0053
P(No  | x') ∝ [P(Sunny|No) ·P(Cool|No) ·P(High|No) ·P(Strong|No) ] · P(Play=No)  = 0.0206
```

**Since P(Yes|x') < P(No|x'), the label predicted for x' is "No".**

> **Memorise these numbers — they appear directly in the slides: 0.0053 (Yes) vs 0.0206 (No) → predict "No".**

### Second example — Mammals vs Non-mammals
For an instance A, the slides compute `P(A|M)·P(M)` and `P(A|N)·P(N)`.
**Since P(A|M)·P(M) > P(A|N)·P(N), it is predicted as Mammals.**

> The pattern is always the same: **compute likelihood × prior for each class, pick the bigger one.**

---

## 4. Gaussian Naive Bayes

**Problem:** the counting approach works for *categorical* features. What about *continuous* features like age or salary?

**Solution — Gaussian Naive Bayes:**
- **Continuous values associated with each feature are assumed to be distributed according to a Gaussian (Normal) distribution.**
- The **likelihood of the features is assumed to be Gaussian**, so the conditional probability is given by the normal density:

```
                     1                (x − μc)²
P(x | c) = ───────────────────  · exp( − ───────── )
            √(2π·σc²)                     2σc²
```

where **μc** and **σc**  are the mean and standard deviation of that feature within class c.

**Other variants worth knowing:** *Multinomial NB* (word counts, text classification) and *Bernoulli NB* (binary features).

---

## 5. Applications

- **Digits classification**
- **Spam filtering**
- **Weather prediction**
- **Stock market prediction**

---

## 6. Pros and Cons

### Pros
- NB is a **fast and accurate** method for prediction.
- It has **very low computation cost**.
- It can **efficiently work on both small and large datasets**.
- It is **robust to noise points and outliers**.

### Cons
- **NB assumes features are independent of each other. In practice this is almost impossible.**
- **If there is no training tuple of a particular class (or feature value), it causes a zero posterior probability**, and the model is unable to make predictions. This is known as the **Zero Probability / Zero Frequency Problem**.

> **Fix for the Zero Probability problem:** **Laplace smoothing** (add-one smoothing) — add 1 to every count so no probability is ever exactly zero. In sklearn's `GaussianNB` the analogous parameter is **`var_smoothing=1e-09`**.

---

## 7. Python Example (Census Income dataset)

```python
from sklearn.naive_bayes import GaussianNB

NB = GaussianNB()
NB.fit(X_train, y_train)
# GaussianNB(priors=None, var_smoothing=1e-09)

print(NB.predict(X_test))
# [' <=50K' ' <=50K' ' >50K' ... ' <=50K' ' <=50K' ' >50K']

print("Naive Bayes Accuracy = ", NB.score(X_test, y_test))
# Naive Bayes Accuracy = 0.7850591225549785
```

---

## 8. Extra facts that connect to other topics

| Property | Naive Bayes |
|---|---|
| Generative or discriminative? | **Generative** — it models P(X\|Y) and P(Y), then uses Bayes' rule |
| Parametric or non-parametric? | **Parametric** |
| Sensitive to class imbalance? | **Less prone** to class imbalance (unlike Decision Trees, which are sensitive) |

---

# MCQ Practice — Naive Bayes

**Q1.** Naive Bayes is based on:
- A) Gradient descent
- B) Bayes' theorem of conditional probability
- C) Information gain
- D) Distance metrics

**Q2.** The word "Naive" in Naive Bayes refers to the assumption that:
- A) The data is normally distributed
- B) The presence of a feature in a class is unrelated to any other feature
- C) All classes are equally likely
- D) There is no noise

**Q3.** In Bayes' theorem, P(C|X) is called the:
- A) Prior
- B) Likelihood
- C) Posterior
- D) Evidence

**Q4.** In Bayes' theorem, P(C) is called the:
- A) Posterior
- B) Prior
- C) Likelihood
- D) Marginal

**Q5.** P(X|C) is called the:
- A) Prior
- B) Likelihood
- C) Posterior
- D) Odds

**Q6.** Under the naive assumption, P(x1, x2, x3 | C) equals:
- A) P(x1|C) + P(x2|C) + P(x3|C)
- B) P(x1|C) · P(x2|C) · P(x3|C)
- C) max of the three
- D) P(C|x1)·P(C|x2)·P(C|x3)

**Q7.** The rule used to select the predicted class in Naive Bayes is:
- A) MLE rule
- B) MAP (Maximum A Posteriori) rule
- C) Nearest neighbour rule
- D) Gini rule

**Q8.** Why can we ignore P(X) in the denominator when classifying?
- A) It is always 1
- B) It is the same for all classes, so it doesn't change which class is largest
- C) It is always 0
- D) It is unknown and assumed to be 0.5

**Q9.** In the tennis example with P(Yes|x') = 0.0053 and P(No|x') = 0.0206, the prediction is:
- A) Yes
- B) No
- C) Undecided
- D) Both equally likely

**Q10.** In the mammals example, the prediction is "Mammals" because:
- A) P(A|M)P(M) > P(A|N)P(N)
- B) P(A|M)P(M) < P(A|N)P(N)
- C) There are more mammals in the dataset
- D) The distance was smaller

**Q11.** In the training phase, Naive Bayes builds:
- A) A decision boundary
- B) Look-up tables of conditional probabilities
- C) A distance matrix
- D) Eigenvectors

**Q12.** Gaussian Naive Bayes assumes that continuous features:
- A) Are uniformly distributed
- B) Follow a Gaussian (Normal) distribution
- C) Are binary
- D) Are independent of the class

**Q13.** Which Naive Bayes variant is best suited for continuous numeric features?
- A) Multinomial NB
- B) Bernoulli NB
- C) Gaussian NB
- D) Categorical NB

**Q14.** Which is NOT a listed advantage of Naive Bayes?
- A) Fast prediction
- B) Very low computation cost
- C) Robust to noise and outliers
- D) It captures feature interactions perfectly

**Q15.** The main theoretical weakness of Naive Bayes is:
- A) It is very slow
- B) The independence assumption is almost never true in practice
- C) It cannot handle large datasets
- D) It requires feature scaling

**Q16.** The Zero Probability / Zero Frequency problem occurs when:
- A) The dataset is too large
- B) There is no training tuple for a particular class or feature value
- C) All probabilities are equal
- D) The features are scaled

**Q17.** A standard fix for the Zero Probability problem is:
- A) Laplace (add-one) smoothing
- B) Removing the feature always
- C) Increasing the learning rate
- D) Using a deeper tree

**Q18.** In `GaussianNB(priors=None, var_smoothing=1e-09)`, `var_smoothing` helps to:
- A) Scale the features
- B) Avoid zero/unstable variances in probability estimates
- C) Select features
- D) Reduce the number of classes

**Q19.** Naive Bayes is classified as which kind of model?
- A) Discriminative
- B) Generative
- C) Instance-based
- D) Ensemble

**Q20.** Compared to Decision Trees, Naive Bayes is:
- A) More sensitive to class imbalance
- B) Less prone to class imbalance
- C) Equally sensitive
- D) Unaffected by any data property

**Q21.** Which of these is NOT listed as an application of Naive Bayes?
- A) Spam filtering
- B) Digits classification
- C) Weather prediction
- D) Image segmentation

**Q22.** The correct sklearn import for Gaussian Naive Bayes is:
- A) `from sklearn.naive_bayes import GaussianNB`
- B) `from sklearn.linear_model import GaussianNB`
- C) `from sklearn.bayes import GaussianNB`
- D) `from sklearn.ensemble import GaussianNB`

**Q23.** The Naive Bayes accuracy on the Census Income dataset in the slides was about:
- A) 0.58
- B) 0.785
- C) 0.85
- D) 0.95

**Q24.** Naive Bayes works well on:
- A) Only small datasets
- B) Only large datasets
- C) Both small and large datasets
- D) Only image data

**Q25.** In the prediction phase, Naive Bayes computes for each class the quantity:
- A) Distance to the class centroid
- B) Product of the conditional probabilities × the class prior
- C) Sum of the feature values
- D) The Gini impurity

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Bayes' theorem for conditional probability. |
| 2 | **B** | Conditional independence of features. |
| 3 | **C** | Posterior = P(class \| evidence). |
| 4 | **B** | Prior = belief before evidence. |
| 5 | **B** | Likelihood = P(evidence \| class). |
| 6 | **B** | Independence → multiply. |
| 7 | **B** | MAP rule. |
| 8 | **B** | Constant across classes. |
| 9 | **B** | 0.0053 < 0.0206 → "No". |
| 10 | **A** | Larger likelihood × prior wins. |
| 11 | **B** | Frequency look-up tables. |
| 12 | **B** | Gaussian likelihood assumption. |
| 13 | **C** | Gaussian NB. |
| 14 | **D** | It explicitly ignores feature interactions. |
| 15 | **B** | Independence is almost impossible in practice. |
| 16 | **B** | Missing tuple → zero posterior. |
| 17 | **A** | Laplace smoothing. |
| 18 | **B** | Prevents zero/degenerate variance. |
| 19 | **B** | Models P(X\|Y) and P(Y). |
| 20 | **B** | Slides say NB is less prone to class imbalance. |
| 21 | **D** | Not in the listed applications. |
| 22 | **A** | `sklearn.naive_bayes`. |
| 23 | **B** | 0.7850591225549785. |
| 24 | **C** | Works efficiently on both. |
| 25 | **B** | Likelihood product × prior. |
