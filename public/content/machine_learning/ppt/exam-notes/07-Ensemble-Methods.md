# 07 — Ensemble Methods (Bagging, Random Forest, Boosting, AdaBoost)

> Source: `Machine_Learning_-_Classifiers_-_Ensemble_methods.pptx`

---

## 1. What is Ensemble Learning?

> **Definition:** Ensemble learning is a machine learning **paradigm where multiple models are trained to solve the problem more accurately than a single complex model**.

**The core hypothesis (memorise this line):**
> **"A group of WEAK learners together form a STRONG learner."**

- They **combine their outputs** to get better accuracy.
- **Ensemble learning follows DIVIDE AND CONQUER.**

**Weak learner** = a model only slightly better than random guessing (e.g. a decision stump — a one-level tree).

---

## 2. Homogeneous vs Heterogeneous Ensembles

| Type | Base learners | Description |
|---|---|---|
| **Homogeneous ensemble** | **A single base learning algorithm** trained with **different subsets of data/features** | e.g. Random Forest (all decision trees) |
| **Heterogeneous ensemble** | **Different types of base learning algorithms** trained with different subsets of data/features | e.g. combining a tree + SVM + kNN |

---

## 3. The Three Types of Ensemble Classifiers

| Method | How it works |
|---|---|
| **Bagging (bootstrap aggregating)** | Train several models using **bootstrapped datasets**; the **majority classification is selected** |
| **Boosting** | Use several **weak classifiers to create a strong classifier**; **resample previously misclassified points** |
| **Stacking (stacked generalization)** | Train **multiple tiers of classifiers**; **higher tiers can correct lower tiers** |

> **The one-line difference:** Bagging trains models **in parallel on random subsets** and **votes**; Boosting trains models **sequentially**, each one **focusing on the previous one's mistakes**; Stacking trains models **in layers**, where a meta-model learns from the base models' outputs.

---

## 4. Bagging (Bootstrap Aggregating)

### Definition
> **Bagging creates several subsets of data from the training sample chosen randomly WITH REPLACEMENT.**

- Each collection of subset data is used to train a model → we get an **ensemble of different models**.
- The **average of all the predictions** from different models is used, which is **more robust than a single decision tree classifier**.
- **Bagging works because it REDUCES VARIANCE by voting/averaging.**

> **Key exam fact: Bagging reduces VARIANCE. Boosting reduces BIAS.**

**"With replacement"** means the same record can be picked more than once in a subset — that's what makes the subsets genuinely different from one another.

### Candidate weak learners for bagging
**Decision tree, decision stump, regression tree, linear regression, SVMs.**

### Bagging — The 5 Steps
Suppose there are **N observations and M features** in the training dataset.

1. A **sample** from the training dataset is taken **randomly with replacement**.
2. A **subset of M features** is **selected randomly**, and whichever feature gives the **best split** is used to split the node **iteratively**.
3. The tree is **grown to the largest** (no pruning).
4. Repeat steps 1 to 3 **n times**.
5. The **prediction is given based on the aggregation of predictions from the n trees**.

### Bagging — Pros and Cons

**Pros**
- **Reduces over-fitting** of the model.
- Handles **higher dimensionality data** very well.
- **Maintains accuracy for missing data.**
- Can help a lot if **data is noisy**.

**Cons**
- As the final prediction is based on the **mean predictions from subset trees**, **predictions may not be precise**.

### Python example

```python
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier

base_cls = DecisionTreeClassifier()
num_trees = 500
seed = 8
model = BaggingClassifier(base_estimator=base_cls,
                          n_estimators=num_trees,
                          random_state=seed)
model.fit(X_train, y_train)
print("Accuracy of Bagging algorithm = ", model.score(X_test, y_test))
# Accuracy of Bagging algorithm = 0.852469886175268
```

---

## 5. Random Forest

### Definition
> **The Random Forest is a BAGGING method which uses decision trees / decision stumps as base learners** — i.e. random forests are a **combination of tree predictors**.

Key properties:
- **Each tree depends on the values of a random vector sampled independently.**
- **The generalization error depends on (a) the STRENGTH of the individual trees and (b) the CORRELATION between them.**
- **Using a random selection of features yields results robust with respect to noise.**

> **Intuition:** you want trees that are individually **strong** but **uncorrelated** with each other. Random feature selection is what breaks the correlation — if every tree saw all features, they'd all pick the same dominant feature and look identical.

### Random Forest — Algorithm

Given a training set **S**:

```
For i = 1 to k do:
    Build subset Si by SAMPLING WITH REPLACEMENT from S
    Learn tree Ti from Si
    At each node:
        Choose the best split from a RANDOM SUBSET of F features
    Each tree grows to the largest extent, and NO PRUNING
Make predictions according to the MAJORITY VOTE of the set of k trees.
```

### Advantages
- **One of the best machine learning algorithms** and most preferred in data science challenges.
- **Runs efficiently on large databases**; can **handle thousands of input variables without variable deletion**.
- **Does not overfit by design.**
- The **generalization error depends on the strength of the individual trees and the correlation between them.**

### Python example
```python
from sklearn.ensemble import RandomForestClassifier
RF = RandomForestClassifier(n_estimators=100)
RF.fit(X_train, y_train)
print("Accuracy of Random Forrest algorithm = ", RF.score(X_test, y_test))
# Accuracy of Random Forrest algorithm = 0.8511437727925738
```

**Default parameters shown:** `bootstrap=True`, `criterion='gini'`, `max_depth=None`, `max_features='auto'`, `min_samples_leaf=1`, `min_samples_split=2`, `n_estimators=100`, `oob_score=False`.

> **Bagging vs Random Forest:** Random Forest = Bagging + **random feature subset at every split**. Plain bagging with trees considers all features at each split; Random Forest deliberately restricts them to decorrelate the trees.

---

## 6. Boosting

### Definition
> **Boosting is a collection of predictors. Learners are learned SEQUENTIALLY, with early learners fitting simple models to the data and then analysing the data for errors. Consecutive learners are fit and at every step the goal is to improve the accuracy from the prior learner.**

- **The misclassified input's weight is INCREASED**, so that the next hypothesis is **more likely to classify it correctly**.
- This process **converts weak learners into a better-performing model**.

### Boosting — The 4 Steps (from the slides)
1. Draw a random subset of training samples **s1 WITHOUT replacement** from the training set S to train a weak learner **P1**.
2. Draw a second random training subset **s2 without replacement**, and **add 50 percent of the samples that were previously misclassified**, to train a weak learner **P2**.
3. Find the training samples **s3** in the training set on which **P1 and P2 disagree**, to train a third weak learner **P3**.
4. **Combine all the weak learners via MAJORITY VOTING.**

> Note the contrast with bagging: **boosting samples WITHOUT replacement**, bagging samples **WITH replacement**.

### Boosting — Pros and Cons

**Pros**
- **Supports different loss functions.**
- **Works well with interactions.**

**Cons**
- **Prone to over-fitting.**
- **Requires careful tuning of different hyper-parameters.**

---

## 7. AdaBoost (Adaptive Boosting)

> **Definition:** AdaBoost is an algorithm for constructing a **"strong" classifier as a LINEAR COMBINATION of "simple"/"weak" classifiers.**

- The **final classification is based on a WEIGHTED VOTE of the weak classifiers.**

### How it works (the standard cycle)
1. Start with **equal weights** on all training samples.
2. Train a weak classifier (typically a **decision stump**).
3. Compute its error; give the classifier an **importance weight α** — the lower its error, the higher its α.
4. **Increase the weights of the misclassified samples** and decrease the weights of the correctly classified ones, then **re-normalise**.
5. Repeat for the next weak classifier, which now concentrates on the hard examples.
6. **Final prediction = sign of the weighted sum of all weak classifiers' outputs.**

### Python example
```python
from sklearn.ensemble import AdaBoostClassifier
Adboost = AdaBoostClassifier(n_estimators=100, random_state=0)
Adboost.fit(X_train, y_train)
# AdaBoostClassifier(algorithm='SAMME.R', base_estimator=None,
#                    learning_rate=1.0, n_estimators=100, random_state=0)
print("Accuracy of AdaBoost algorithm = ", Adboost.score(X_test, y_test))
# Accuracy of AdaBoost algorithm = 0.8635208310310531
```

---

## 8. Bagging vs Boosting — The Comparison Table

| Aspect | **Bagging** | **Boosting** |
|---|---|---|
| Model training | **Parallel / independent** | **Sequential / dependent** |
| Sampling | Random **with replacement** (bootstrap) | **Without replacement**; adds previously misclassified samples |
| Sample weights | All equal | **Misclassified samples get higher weight** |
| Combination | **Majority vote / average** (equal weight) | **Weighted vote** |
| Mainly reduces | **Variance** | **Bias** |
| Overfitting | **Reduces overfitting** | **Prone to overfitting** |
| Example | Random Forest | AdaBoost |

---

## 9. Accuracy Scoreboard (Census Income dataset)

Very handy for "which algorithm performed best?" MCQs:

| Algorithm | Accuracy |
|---|---|
| Polynomial SVM (degree 4) | 0.5833 |
| Naive Bayes (Gaussian) | 0.7851 |
| Logistic Regression | 0.7864 |
| Linear SVM | 0.7866 |
| Random Forest | 0.8511 |
| Bagging | 0.8525 |
| **AdaBoost** | **0.8635 ← best** |

---

# MCQ Practice — Ensemble Methods

**Q1.** The core hypothesis behind ensemble learning is that:
- A) A single complex model always wins
- B) A group of weak learners together form a strong learner
- C) More data is always better
- D) Deep models are needed

**Q2.** Ensemble learning follows which strategy?
- A) Greedy search
- B) Divide and conquer
- C) Dynamic programming
- D) Backtracking

**Q3.** An ensemble that uses a single base learning algorithm trained on different subsets is called:
- A) Heterogeneous
- B) Homogeneous
- C) Stacked
- D) Sequential

**Q4.** An ensemble that uses different types of base algorithms is called:
- A) Homogeneous
- B) Heterogeneous
- C) Bagged
- D) Boosted

**Q5.** Which of these is NOT one of the three types of ensemble classifiers listed?
- A) Bagging
- B) Boosting
- C) Stacking
- D) Clustering

**Q6.** Bagging stands for:
- A) Batch aggregating
- B) Bootstrap aggregating
- C) Bayesian aggregating
- D) Balanced aggregating

**Q7.** In bagging, subsets are chosen:
- A) Randomly without replacement
- B) Randomly with replacement
- C) In sorted order
- D) By class label

**Q8.** Bagging primarily works by:
- A) Reducing bias
- B) Reducing variance by voting/averaging
- C) Increasing variance
- D) Removing features

**Q9.** Which is NOT listed as a candidate weak learner for bagging?
- A) Decision tree
- B) Decision stump
- C) Linear regression
- D) K-means

**Q10.** In the bagging steps, each tree is:
- A) Pruned aggressively
- B) Grown to the largest
- C) Limited to depth 1
- D) Grown only if accuracy improves

**Q11.** Which is a stated CON of bagging?
- A) It always overfits
- B) Predictions may not be precise since they are based on mean predictions
- C) It cannot handle noise
- D) It cannot handle high dimensionality

**Q12.** Which is a stated PRO of bagging?
- A) It maintains accuracy for missing data
- B) It reduces the number of features
- C) It guarantees 100% accuracy
- D) It requires no data

**Q13.** Random Forest is a special case of:
- A) Boosting
- B) Bagging
- C) Stacking
- D) Clustering

**Q14.** The base learners in a Random Forest are:
- A) SVMs
- B) Decision trees / decision stumps
- C) Neural networks
- D) Naive Bayes models

**Q15.** In Random Forest, the generalization error depends on:
- A) Only the number of trees
- B) The strength of individual trees and the correlation between them
- C) Only the depth of trees
- D) The number of classes

**Q16.** At each node in Random Forest, the best split is chosen from:
- A) All features
- B) A random subset of F features
- C) Only the first feature
- D) The target variable

**Q17.** In Random Forest, trees are:
- A) Pruned heavily
- B) Grown to the largest extent with no pruning
- C) Limited to two levels
- D) Grown only until the first split

**Q18.** Random Forest makes its final prediction by:
- A) Weighted vote by tree accuracy
- B) Majority vote of the k trees
- C) Taking the first tree's answer
- D) Averaging the features

**Q19.** Which statement about Random Forest is claimed in the slides?
- A) It overfits easily
- B) It does not overfit by design
- C) It requires variable deletion
- D) It only works on small datasets

**Q20.** In boosting, learners are trained:
- A) In parallel
- B) Sequentially
- C) Randomly and independently
- D) All at the same time

**Q21.** In boosting, the weight of a misclassified input is:
- A) Decreased
- B) Increased
- C) Set to zero
- D) Unchanged

**Q22.** In the boosting steps described, the subsets are drawn:
- A) With replacement
- B) Without replacement
- C) In sorted order
- D) Only once

**Q23.** In boosting step 2, what fraction of previously misclassified samples is added?
- A) 25 percent
- B) 50 percent
- C) 75 percent
- D) 100 percent

**Q24.** In boosting step 3, the third weak learner P3 is trained on samples where:
- A) P1 and P2 agree
- B) P1 and P2 disagree
- C) All learners are correct
- D) The data is missing

**Q25.** A stated CON of boosting is:
- A) It cannot use different loss functions
- B) It is prone to over-fitting and needs careful hyper-parameter tuning
- C) It only works on images
- D) It reduces variance too much

**Q26.** AdaBoost constructs a strong classifier as:
- A) A product of weak classifiers
- B) A linear combination of simple/weak classifiers
- C) A single deep tree
- D) A clustering of weak classifiers

**Q27.** The final classification in AdaBoost is based on:
- A) A simple unweighted majority vote
- B) A weighted vote of the weak classifiers
- C) The last classifier only
- D) The first classifier only

**Q28.** Which method mainly reduces BIAS?
- A) Bagging
- B) Boosting
- C) Both equally
- D) Neither

**Q29.** In the Census Income comparison, which algorithm achieved the highest accuracy?
- A) Logistic Regression
- B) Random Forest
- C) Bagging
- D) AdaBoost

**Q30.** In stacking, higher tiers of classifiers:
- A) Are ignored
- B) Can correct lower tiers
- C) Must be identical to lower tiers
- D) Only vote

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | The stated hypothesis. |
| 2 | **B** | "Ensemble learning follows Divide and Conquer." |
| 3 | **B** | Homogeneous = one base algorithm. |
| 4 | **B** | Heterogeneous = different algorithms. |
| 5 | **D** | Clustering is unsupervised, not an ensemble type. |
| 6 | **B** | Bootstrap aggregating. |
| 7 | **B** | With replacement (bootstrap). |
| 8 | **B** | Reduces variance via voting/averaging. |
| 9 | **D** | K-means is not listed (and is unsupervised). |
| 10 | **B** | "The tree is grown to the largest." |
| 11 | **B** | Mean-based predictions may lack precision. |
| 12 | **A** | Explicitly listed as a pro. |
| 13 | **B** | "Random forest is a bagging method." |
| 14 | **B** | Trees / stumps. |
| 15 | **B** | Strength + correlation. |
| 16 | **B** | Random subset of F features. |
| 17 | **B** | Largest extent, no pruning. |
| 18 | **B** | Majority vote. |
| 19 | **B** | Stated as an advantage in the slides. |
| 20 | **B** | Sequential learning. |
| 21 | **B** | Increased, so the next learner focuses on it. |
| 22 | **B** | Boosting steps say "without replacement". |
| 23 | **B** | 50 percent. |
| 24 | **B** | Where P1 and P2 disagree. |
| 25 | **B** | Both cons listed. |
| 26 | **B** | Linear combination of weak classifiers. |
| 27 | **B** | Weighted vote. |
| 28 | **B** | Boosting targets bias; bagging targets variance. |
| 29 | **D** | AdaBoost 0.8635. |
| 30 | **B** | Higher tiers correct lower tiers. |
