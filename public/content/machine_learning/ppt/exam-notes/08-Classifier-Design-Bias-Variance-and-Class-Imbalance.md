# 08 — Classifier Design: Bias, Variance, Model Types & Class Imbalance

> Source: `Machine_Learning_-_Classifiers_-_Classifiers_Design.pptx`

**Topics covered:** Bias and Variance · Bias–Variance Tradeoff · Generative vs Discriminative Models · Parametric vs Non-parametric Models · Class Imbalance

---

## 1. Bias and Variance

Every way a model can fail comes down to one of two opposite diseases. Learn them as a pair.

### Bias

> **Definition:** When an algorithm has **limited flexibility to learn the true value from the dataset**, the model is **biased.**

- **Bias is an error from erroneous ASSUMPTIONS in the learning algorithm.**
- **High bias** can cause an algorithm to **miss the relevant relations between features and target outputs — i.e. UNDERFITTING.**

**In plain terms:** the model is **too simple** and has decided in advance what the answer must look like. Force a straight line through data that is clearly curved and it will be wrong no matter how much data you supply — the assumption itself was wrong.

### Variance

> **Definition:** Variance refers to **an algorithm's sensitivity to specific sets of the training set.**

- **Variance is an error from sensitivity to SMALL FLUCTUATIONS in the training set.**
- **High variance** can cause an algorithm to **model the random NOISE in the training data rather than the intended outputs — i.e. OVERFITTING.**

**In plain terms:** the model is **too sensitive**. It takes every accident in your training data seriously — including the noise — and so it changes wildly if you retrain it on a slightly different sample.

### Two ways to picture it

**The dartboard.** *High bias:* every dart lands tightly grouped, but in the wrong corner — consistent and consistently wrong. *High variance:* darts scattered all around the board — they average near the bullseye, but no individual throw is reliable.

**The student.**

| | The student who… | Result |
|---|---|---|
| **High bias** | Skims one chapter and answers everything with one vague rule | Fails the practice papers **and** the exam |
| **High variance** | Memorises the answer key word-for-word without understanding | Perfect on practice papers, lost when the question is reworded |
| **Just right** | Understands the underlying method | Does well on both |

### The diagnostic table

| | Bias | Variance |
|---|---|---|
| Error caused by | **Wrong assumptions** | **Sensitivity to fluctuations / noise** |
| Too much gives | **Underfitting** | **Overfitting** |
| Model is | **Too simple** | **Too complex** |
| **Training error** | **High** | **Low** |
| **Test error** | **High** | **High** |
| Fix by | More complexity, more features, boosting | Simpler model, more data, regularization, bagging |

> **How to diagnose in practice — compare the two errors.**
> - Train error **high**, test error **high** → **high bias** (underfitting)
> - Train error **low**, test error **high** → **high variance** (overfitting)
> - Both low → you are done

---

## 2. Bias–Variance Tradeoff

> **Definition:** A good model should **not have high bias and/or high variance.** Balancing them is the **Bias–Variance Tradeoff.**

The two governing statements from the slides:

- **Models with TOO FEW parameters are inaccurate because of a LARGE BIAS** (not enough flexibility).
- **Models with TOO MANY parameters are inaccurate because of a LARGE VARIANCE** (too much sensitivity to the sample).

```
Total Error = Bias² + Variance + Irreducible Error
```

*(The **irreducible error** is noise inherent in the data. No model can remove it — if two identical houses sold for different prices, no algorithm can explain the difference.)*

### See it with polynomial degree

Fit the same data with polynomials of rising degree:

| Degree | What the curve does | Train error | Test error | Diagnosis |
|---|---|---|---|---|
| **1** (straight line) | Too rigid; misses the curve | **High (25)** | **High (27)** | **High bias — underfit** |
| **3** | Follows the real trend | Low (8) | **Low (9)** | **Just right** |
| **15** | Wiggles through every point | **Almost 0 (0.1)** | **High (40)** | **High variance — overfit** |

Notice degree 15 has the **best possible training score and the worst test score.** That is the signature of overfitting, and it is why training accuracy alone must never be trusted.

```
error
  │╲                                    ╱
  │ ╲        Total error            ╱
  │  ╲___                       ╱
  │      ╲___             ___╱   ← Variance (rises with complexity)
  │          ╲______ ___╱
  │      Bias ╲_____╱             ← Bias (falls with complexity)
  └────────────┬────────────────► model complexity
          sweet spot
```

**Why it is a *tradeoff*:** push complexity down and bias grows; push it up and variance grows. You cannot eliminate both, so you find the minimum of their sum.

**Reducing bias:** more complex model, more features, less regularization, **boosting**.
**Reducing variance:** simpler model, **more training data**, regularization, **bagging**.

---

## 3. Generative vs Discriminative Models

### The distinction in one image

Imagine separating photos of cats and dogs.

- A **generative** model studies each animal until it could **draw a cat from memory.** To classify, it asks: *"which of my mental pictures does this photo resemble more?"*
- A **discriminative** model never learns what a cat looks like. It only learns the **dividing rule**: *"pointy ears and whiskers → cat."* It could not draw either animal, but it separates them very well — often better, because it spent all its effort on the border rather than the whole picture.

### Generative Model

> A **Generative Model explicitly models the ACTUAL DISTRIBUTION of each class.**

Steps:
1. Assume some functional form for **P(X|Y)** and **P(Y)**
2. **Estimate the parameters of P(X|Y), P(Y) directly** from training data
3. **Use Bayes' rule to calculate P(Y|X = x)**

Properties:
- **INDIRECT computation of P(Y|X) through Bayes' rule**
- **But it CAN generate a sample of the data** — hence "generative"

**Example: Naive Bayes classifier.** *(This is literally what note 05 does: it learns P(Sunny|Yes), P(Cool|Yes)… — a full description of what a "Yes" day looks like. Given those tables you could invent a plausible new Yes-day.)*

### Discriminative Model

> A **Discriminative Model models the DECISION BOUNDARY between the classes.**

Steps:
1. Assume some functional form for **P(Y|X)**
2. **Estimate the parameters of P(Y|X) directly** from training data

Properties:
- **DIRECTLY learns P(Y|X)**
- **But it CANNOT sample data, because P(X) is not available**

**Examples: SVM, Decision Trees, k-NN, Boosting, Neural Networks** (and Logistic Regression).

*(SVM is the purest case — it does not even model probability. It only finds the widest corridor between the classes, which is nothing but a border.)*

### Comparison table

| Aspect | **Generative** | **Discriminative** |
|---|---|---|
| What it models | The **actual distribution of each class** | The **decision boundary** |
| Learns | P(X\|Y) and P(Y) | **P(Y\|X) directly** |
| P(Y\|X) obtained | **Indirectly, via Bayes' rule** | **Directly** |
| Can generate new data? | **Yes** | **No** — P(X) is unavailable |
| Effort spent on | Describing each class fully | Only the border between classes |
| Examples | **Naive Bayes** | **SVM, Decision Trees, k-NN, Boosting, Neural Networks** |

> **Memory hook:** *generative* models can **generate** data. If a model could not possibly invent a new fake example, it is discriminative.

---

## 4. Parametric vs Non-parametric Models

### Parametric Model

> A learning model that **summarizes data with a set of parameters of FIXED SIZE (independent of the number of training examples)** is called a **parametric model.**

- **"No matter how much data you throw at a parametric model, it won't change its mind about how many parameters it needs."**
- Has a **fixed number of parameters**
- Makes some **strong assumptions** about the data

**Examples: Linear regression, Naive Bayes** (also Logistic Regression).

*Made concrete:* fit `y = b0 + b1x` to **100 rows** and you store **2 numbers.** Fit it to **10 million rows** and you *still* store **2 numbers.** Once trained, the original data can be thrown away entirely.

### Non-Parametric Model

> **Nonparametric methods are good when you have a LOT OF DATA and NO PRIOR KNOWLEDGE, and when you don't want to worry too much about choosing just the right features.**

- **Flexible number of parameters**
- The **number of parameters often GROWS with more data**
- Makes **fewer assumptions** about the data

**Examples: kNN, Decision Trees, SVM.**

*Made concrete:* **kNN stores every single training row** — 10 million rows means 10 million stored points, and it needs all of them at prediction time. A decision tree grown on more data simply grows more branches.

> **Important clarification:** "non-parametric" does **NOT** mean "has no parameters." It means the **number** of parameters is not fixed in advance — it is decided by the data.

### Comparison table

| Aspect | **Parametric** | **Non-parametric** |
|---|---|---|
| Number of parameters | **Fixed**, independent of data size | **Flexible**, grows with data |
| Assumptions about data | **Strong** | **Fewer** |
| Needs a lot of data? | No — works with little | **Yes, benefits from lots** |
| Prior knowledge needed? | Yes — you must pick the right form | **No** |
| Memory after training | Small and constant | Grows with the dataset |
| Prediction speed | Fast | Slower |
| Risk | Underfitting if the assumed form is wrong | Overfitting; heavy memory |
| Examples | **Linear regression, Naive Bayes** | **kNN, Decision Trees, SVM** |

---

## 5. Class Imbalance

### The problem

> The assumption that datasets are **balanced** — as many **positive examples of the concept as negative ones** — **is not always true in real-world data.**

- **Standard learners are often BIASED TOWARDS THE MAJORITY CLASS.**
- Examples from the **overwhelming class are well-classified**, whereas examples from the **minority class tend to be MISCLASSIFIED.**

### Why this is worse than it sounds

Take fraud detection: **99.8% legitimate, 0.2% fraud.** Consider the laziest possible model:

```python
def predict(transaction):
    return "legitimate"      # always, no matter what
```

**Accuracy: 99.8%.** It looks like a triumph and it catches **zero fraud** — the only thing anyone actually wanted.

The confusion matrix exposes it instantly:

| | Predicted Fraud | Predicted Legit |
|---|---|---|
| **Actual Fraud** | **0** | **200** ← every fraud missed |
| **Actual Legit** | 0 | 99,800 |

**Accuracy 99.8%, Recall 0%.** This is exactly why note 09 insists that **accuracy is a bad metric under class skew** — use **precision, recall and the P-R curve** instead.

**Why models drift this way:** training minimises total error. With 99.8% of the data in one class, ignoring the minority *is* the mathematically optimal strategy. The algorithm is not broken — it is answering the question you accidentally asked.

**Algorithm sensitivity (memorise):**
- **Decision Trees are SENSITIVE to class imbalance.**
- **Naive Bayes (NB) is LESS PRONE to class imbalance.**

*(A tree splits to maximise purity, and a node that is already 99.8% pure looks perfect, so it never splits further to find the rare class. Naive Bayes estimates each class's likelihoods separately, so the minority class still gets its own honest probability model.)*

### Handling Class Imbalance

**A. At the DATA level — Re-Sampling**
- **Oversampling** (Random or Directed) — duplicate/create more minority examples
- **Undersampling** (Random or Directed) — remove majority examples
- **Active Sampling**

```
BEFORE:   ●●●●●●●●●●●●●●●●●●●●  ○○        (20 majority, 2 minority)

Oversample:   ●●●●●●●●●●●●●●●●●●●●  ○○○○○○○○○○○○○○○○○○○○
              ↑ majority untouched, minority multiplied up

Undersample:  ●●  ○○
              ↑ majority thrown away — note how much data you just lost
```

**B. At the ALGORITHMIC level**
- **Adjusting the costs** — tell the algorithm a missed fraud costs 100× a false alarm, so ignoring the minority is no longer optimal
- **Adjusting the decision threshold** — instead of 0.5, flag anything above 0.2 as fraud (exactly the cut-off idea from note 04)

### Two crucial findings stated in the slides
- **Undersampling (random and directed) is NOT effective and can even HURT performance.**
  *(Obvious once you see the picture above — you delete 90% of your genuine data, so the model now has almost nothing to learn from.)*
- **Random oversampling helps quite dramatically at all complexity levels.**

### SMOTE

> **SMOTE = Synthetic Minority Oversampling Technique** — it **creates NEW synthetic minority examples** by interpolating between existing minority points, rather than merely duplicating them.

**How it works:** take a minority point, find one of its nearest minority neighbours, and place a brand-new artificial point somewhere on the line between them.

```
Plain oversampling:   ○ ○         →   ○○○○ ○○○○     (the same 2 points, copied)
SMOTE:                ○ ○         →   ○ ⊙ ⊙ ○       (⊙ = new points in between)
```

**Why that is better:** duplicating a point tells the model nothing new and encourages it to memorise that exact location. SMOTE fills in the *region* where minority examples live, so the model learns a genuine area rather than a few repeated dots.

---

## 6. Master Classification Table

| Algorithm | Generative / Discriminative | Parametric / Non-parametric |
|---|---|---|
| **Naive Bayes** | **Generative** | **Parametric** |
| **Linear Regression** | — | **Parametric** |
| **Logistic Regression** | Discriminative | Parametric |
| **SVM** | **Discriminative** | **Non-parametric** |
| **Decision Trees** | **Discriminative** | **Non-parametric** |
| **k-NN** | **Discriminative** | **Non-parametric** |
| **Boosting** | **Discriminative** | — |
| **Neural Networks** | **Discriminative** | — |

> **The shortcut for the exam: Naive Bayes is the odd one out — it is the only GENERATIVE model in this syllabus.**

---

# MCQ Practice — Classifier Design

**Q1.** Bias is an error arising from:
- A) Sensitivity to small fluctuations in the training set
- B) Erroneous assumptions in the learning algorithm
- C) Too much training data
- D) Missing values

**Q2.** Variance is an error arising from:
- A) Erroneous assumptions
- B) Sensitivity to small fluctuations in the training set
- C) Wrong labels
- D) Too few features

**Q3.** High bias leads to:
- A) Overfitting
- B) Underfitting
- C) Perfect fit
- D) Data leakage

**Q4.** High variance leads to:
- A) Underfitting
- B) Overfitting
- C) High bias
- D) Fewer parameters

**Q5.** High variance causes an algorithm to:
- A) Miss relevant relations
- B) Model the random noise in the training data
- C) Ignore the training data
- D) Reduce the feature count

**Q6.** Models with too FEW parameters are inaccurate because of:
- A) Large variance
- B) Large bias
- C) Too much flexibility
- D) Noise

**Q7.** Models with too MANY parameters are inaccurate because of:
- A) Large bias
- B) Large variance
- C) No flexibility
- D) Missing data

**Q8.** The Bias–Variance Tradeoff states that a good model should:
- A) Have high bias only
- B) Have high variance only
- C) Not have high bias and/or high variance
- D) Have zero error always

**Q9.** A generative model explicitly models:
- A) The decision boundary
- B) The actual distribution of each class
- C) Only P(Y|X)
- D) The loss function

**Q10.** A generative model estimates the parameters of:
- A) P(Y|X)
- B) P(X|Y) and P(Y)
- C) P(X) only
- D) The margin

**Q11.** A generative model computes P(Y|X):
- A) Directly
- B) Indirectly through Bayes' rule
- C) Not at all
- D) Using gradient descent only

**Q12.** Which is the example given for a generative model?
- A) SVM
- B) Naive Bayes classifier
- C) Decision tree
- D) k-NN

**Q13.** A discriminative model models:
- A) The distribution of each class
- B) The decision boundary between the classes
- C) The prior probability only
- D) The covariance matrix

**Q14.** Why can a discriminative model NOT sample data?
- A) Because P(Y) is unknown
- B) Because P(X) is not available
- C) Because it has too many parameters
- D) Because it uses Bayes' rule

**Q15.** Which of these is NOT listed as a discriminative model?
- A) SVM
- B) Decision Trees
- C) Naive Bayes
- D) Neural Networks

**Q16.** A parametric model is one that:
- A) Has a flexible number of parameters
- B) Summarizes data with a set of parameters of fixed size
- C) Grows with more data
- D) Has zero parameters

**Q17.** Which is an example of a parametric model?
- A) kNN
- B) Decision Tree
- C) Linear regression
- D) SVM

**Q18.** In a non-parametric model, the number of parameters:
- A) Is fixed forever
- B) Often grows with more data
- C) Is always zero
- D) Equals the number of classes

**Q19.** Non-parametric methods are good when:
- A) You have little data and strong prior knowledge
- B) You have a lot of data and no prior knowledge
- C) The target is always binary
- D) All features are categorical

**Q20.** Which of these is a non-parametric model?
- A) Linear regression
- B) Naive Bayes
- C) kNN
- D) None of the above

**Q21.** Parametric models generally make:
- A) Fewer assumptions about the data
- B) Strong assumptions about the data
- C) No assumptions
- D) Only distributional assumptions about the target

**Q22.** Class imbalance means:
- A) Features have different scales
- B) The number of positive and negative examples is very unequal
- C) The dataset has missing values
- D) There are too many features

**Q23.** With imbalanced data, standard learners are typically biased towards:
- A) The minority class
- B) The majority class
- C) Neither class
- D) The most recent class

**Q24.** Which algorithm is described as SENSITIVE to class imbalance?
- A) Naive Bayes
- B) Decision Trees
- C) k-Means
- D) PCA

**Q25.** Which algorithm is described as LESS PRONE to class imbalance?
- A) Decision Trees
- B) Naive Bayes
- C) Random Forest
- D) AdaBoost

**Q26.** Handling class imbalance at the DATA level is done via:
- A) Adjusting the costs
- B) Re-sampling (oversampling / undersampling / active sampling)
- C) Changing the loss function
- D) Adjusting the learning rate

**Q27.** Which are the two algorithmic-level techniques listed?
- A) Oversampling and undersampling
- B) Adjusting the costs and adjusting the decision threshold
- C) Feature selection and extraction
- D) Bagging and boosting

**Q28.** According to the slides, undersampling:
- A) Always improves performance
- B) Is not effective and can even hurt performance
- C) Is the best method available
- D) Is identical to SMOTE

**Q29.** According to the slides, random oversampling:
- A) Is ineffective
- B) Helps quite dramatically at all complexity levels
- C) Only works for small datasets
- D) Increases bias drastically

**Q30.** SMOTE stands for:
- A) Statistical Minority Oversampling Technique
- B) Synthetic Minority Oversampling Technique
- C) Sampled Majority Optimal Training Estimator
- D) Sequential Model Optimization Technique

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Bias = erroneous assumptions. |
| 2 | **B** | Variance = sensitivity to fluctuations. |
| 3 | **B** | Misses relevant relations → underfit. |
| 4 | **B** | Fits noise → overfit. |
| 5 | **B** | Models random noise. |
| 6 | **B** | Not enough flexibility → large bias. |
| 7 | **B** | Too sensitive to the sample → large variance. |
| 8 | **C** | Neither should be high. |
| 9 | **B** | Actual distribution of each class. |
| 10 | **B** | P(X\|Y) and P(Y). |
| 11 | **B** | Indirect, via Bayes' rule. |
| 12 | **B** | Naive Bayes. |
| 13 | **B** | The decision boundary. |
| 14 | **B** | P(X) is not available. |
| 15 | **C** | Naive Bayes is generative. |
| 16 | **B** | Fixed-size parameter set. |
| 17 | **C** | Linear regression and Naive Bayes are listed. |
| 18 | **B** | Grows with data. |
| 19 | **B** | Lots of data, no prior knowledge. |
| 20 | **C** | kNN, Decision Trees, SVM are non-parametric. |
| 21 | **B** | Strong assumptions. |
| 22 | **B** | Unequal class proportions. |
| 23 | **B** | The majority class. |
| 24 | **B** | Decision Trees. |
| 25 | **B** | Naive Bayes. |
| 26 | **B** | Data-level = re-sampling. |
| 27 | **B** | Costs and decision threshold. |
| 28 | **B** | Not effective; can hurt performance. |
| 29 | **B** | Helps dramatically at all complexity. |
| 30 | **B** | Synthetic Minority Oversampling Technique. |
