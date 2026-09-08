# 07 — Ensemble Methods (Bagging, Random Forest, Boosting, AdaBoost)

> Source: `Machine_Learning_-_Classifiers_-_Ensemble_methods.pptx`

---

## 1. What is Ensemble Learning?

> **Definition:** Ensemble learning is a machine learning **paradigm where multiple models are trained to solve the problem more accurately than a single complex model.**

**The core hypothesis (memorise this line):**
> **"A group of WEAK learners together form a STRONG learner."**

- They **combine their outputs** to get better accuracy.
- **Ensemble learning follows DIVIDE AND CONQUER.**

### Why does combining weak models beat one strong model?

**Analogy — "Who Wants to Be a Millionaire":** the single expert friend is right about 65% of the time. The studio audience — hundreds of people, none of them experts — is right about 91% of the time. **Individually mediocre, collectively excellent.**

**The mechanism:** suppose you have 3 independent classifiers, each **70% accurate**, and you take a majority vote. The ensemble is wrong only if at least 2 of them are wrong simultaneously:

```
All 3 wrong:        0.3 × 0.3 × 0.3           = 0.027
Exactly 2 wrong:    3 × (0.3 × 0.3 × 0.7)     = 0.189
                                       total  = 0.216

Ensemble accuracy = 1 − 0.216 = 78.4%   (up from 70%)
```

**70% → 78.4% just by voting.** With 100 such classifiers it climbs past 99%.

> **The critical condition:** the models must make **different** mistakes. If all three are wrong on the same questions, voting achieves nothing. **Everything in ensemble design is about forcing the models to be different from each other.**

**Weak learner** = a model only slightly better than random guessing — e.g. a **decision stump**, a tree with a single split.

---

## 2. Homogeneous vs Heterogeneous Ensembles

| Type | Base learners | Example |
|---|---|---|
| **Homogeneous ensemble** | **A single base learning algorithm** trained with **different subsets of data/features** | Random Forest — 100 decision trees |
| **Heterogeneous ensemble** | **Different types of base learning algorithms** trained with different subsets | A tree + an SVM + a kNN voting together |

*Memory hook: **homo** = same kind, **hetero** = mixed kinds.*

---

## 3. The Three Types of Ensemble Classifiers

| Method | How it works |
|---|---|
| **Bagging (bootstrap aggregating)** | Train several models using **bootstrapped datasets**; the **majority classification is selected** |
| **Boosting** | Use several **weak classifiers to create a strong classifier**; **resample previously misclassified points** |
| **Stacking (stacked generalization)** | Train **multiple tiers of classifiers**; **higher tiers can correct lower tiers** |

### The difference in one picture

```
BAGGING — a committee voting at once (parallel)
   data ──┬──► model A ──┐
          ├──► model B ──┼──► majority vote ──► answer
          └──► model C ──┘

BOOSTING — a relay race (sequential)
   data ──► model A ──► its mistakes ──► model B ──► its mistakes ──► model C
                                                      weighted vote ──► answer

STACKING — layered (a manager over workers)
   data ──┬──► model A ──┐
          ├──► model B ──┼──► meta-model learns whom to trust ──► answer
          └──► model C ──┘
```

---

## 4. Bagging (Bootstrap Aggregating)

### Definition
> **Bagging creates several subsets of data from the training sample chosen randomly WITH REPLACEMENT.**

- Each subset trains a model → an **ensemble of different models**.
- The **average of all the predictions** is used, which is **more robust than a single decision tree classifier.**
- **Bagging works as it REDUCES VARIANCE by voting/averaging.**

> **Key exam fact: Bagging reduces VARIANCE. Boosting reduces BIAS.**

### "With replacement" — see what it means

Original training set: **[A, B, C, D, E]**. Draw 5 items, replacing each after drawing:

```
Bootstrap sample 1:  [A, B, B, D, E]   ← B twice, C missing
Bootstrap sample 2:  [A, A, C, C, E]   ← A and C twice, B and D missing
Bootstrap sample 3:  [B, C, D, D, E]   ← D twice, A missing
```

**Each sample is a slightly different version of reality**, so each model trained on it learns something slightly different — and that difference is exactly what makes voting work. *(On average each bootstrap sample contains about **63%** of the unique original rows; the rest are duplicates.)*

### Why averaging reduces variance

A single deep decision tree is **high variance** — retrain it on slightly different data and you get a noticeably different tree. But each tree's random errors point in different directions, so when you average 500 of them **the errors largely cancel while the real signal reinforces.** The wisdom-of-crowds effect, applied to models.

### Candidate weak learners for bagging
**Decision tree, decision stump, regression tree, linear regression, SVMs.**

### Bagging — The 5 Steps
Suppose there are **N observations and M features** in the training dataset.

1. A **sample** from the training dataset is taken **randomly with replacement.**
2. A **subset of M features** is **selected randomly**, and whichever feature gives the **best split** is used to split the node **iteratively.**
3. The tree is **grown to the largest** (no pruning).
4. Repeat steps 1 to 3 **n times.**
5. The **prediction is given based on the aggregation of predictions from the n trees.**

> **Why grow trees to full depth?** Normally that would overfit badly. But here overfitting is *desirable* in the individual trees — each one is high-variance and low-bias, and the averaging step removes the variance. You deliberately build unstable models and then stabilise them by voting.

### Worked vote

A new email goes to 5 bagged models:
```
Model 1: SPAM     Model 2: SPAM     Model 3: NOT SPAM
Model 4: SPAM     Model 5: NOT SPAM

Tally: SPAM = 3, NOT SPAM = 2  →  final answer: SPAM
```
For **regression** you would average the numbers instead: predictions of 50, 55, 52, 61, 57 → **55**.

### Bagging — Pros and Cons

**Pros**
- **Reduces over-fitting** of the model
- Handles **higher dimensionality data** very well
- **Maintains accuracy for missing data**
- Can help a lot if **data is noisy** — noise affects each sample differently and averages out

**Cons**
- As the final prediction is based on the **mean predictions from subset trees, predictions may not be precise.** *(Averaging smooths away extremes, so bagging rarely predicts very high or very low values — and you lose the single readable tree, gaining a black box of 500.)*

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

**Note the jump:** a single logistic regression scored 0.786 on this dataset; 500 bagged trees score **0.852**.

---

## 5. Random Forest

### Definition
> **The Random Forest is a BAGGING method which uses decision trees / decision stumps as base learners** — random forests are a **combination of tree predictors.**

Key properties:
- **Each tree depends on the values of a random vector sampled independently.**
- **The generalization error depends on the STRENGTH of the individual trees and the CORRELATION between them.**
- **Using a random selection of features yields results robust with respect to noise.**

### The one extra idea beyond bagging

Plain bagging gives each tree a different **sample of rows**. Random Forest also gives each split a different **subset of columns**.

**Why that second randomisation matters.** Suppose `salary` is by far the strongest predictor. In plain bagging, *every* tree picks salary as its first split, so all 500 trees look nearly identical — and **averaging 500 identical trees gains you nothing.** By forcing each split to consider only a random handful of features, some trees never see salary at first and must discover other patterns. The trees become genuinely different, and *then* the averaging pays off.

> **This is the meaning of "strength and correlation":** you want each tree **strong** (individually accurate) but **uncorrelated** (making different mistakes). The two pull against each other — restricting features weakens each tree slightly but decorrelates them a lot, and that trade is worth making.

### Random Forest — Algorithm

```
Given a training set S
For i = 1 to k do:
    Build subset Si by SAMPLING WITH REPLACEMENT from S
    Learn tree Ti from Si
    At each node:
        Choose best split from a RANDOM SUBSET of F features
    Each tree grows to the largest extent, and NO PRUNING
Make predictions according to the MAJORITY VOTE of the set of k trees.
```

### Advantages
- **One of the best machine learning algorithms** and most preferred in data science challenges
- **Runs efficiently on large databases**; can **handle thousands of input variables without variable deletion** — it effectively does its own feature selection
- **Does not overfit by design** — adding more trees never makes it worse, it only stabilises the average
- The **generalization error depends on the strength of the individual trees and the correlation between them**

### Python example
```python
from sklearn.ensemble import RandomForestClassifier
RF = RandomForestClassifier(n_estimators=100)
RF.fit(X_train, y_train)
print("Accuracy of Random Forrest algorithm = ", RF.score(X_test, y_test))
# Accuracy of Random Forrest algorithm = 0.8511437727925738
```

**Default parameters shown:** `bootstrap=True`, `criterion='gini'`, `max_depth=None`, `max_features='auto'`, `min_samples_leaf=1`, `min_samples_split=2`, `n_estimators=100`, `oob_score=False`.

> **Bagging vs Random Forest in one line:** **Random Forest = Bagging + a random feature subset at every split.**

---

## 6. Boosting

### Definition
> **Boosting is a collection of predictors. Learners are learned SEQUENTIALLY, with early learners fitting simple models to the data and then analysing data for errors. Consecutive learners are fit and at every step the goal is to improve the accuracy from the prior learner.**

- **The misclassified input's weight is INCREASED**, so the next hypothesis is **more likely to classify it correctly.**
- This **converts weak learners into a better-performing model.**

### The idea in everyday terms

**Analogy — how a good student revises.** After a mock test you do not re-read the whole syllabus equally. You spend your time on **the questions you got wrong.** The next mock, you focus on whatever is still wrong. Each round targets the remaining weakness.

That is boosting. Model 1 makes mistakes → those examples get **heavier weights** → model 2 is forced to pay attention to them → and so on.

```
Round 1:  ●  ●  ●  ●  ●  ●        all examples weighted equally
          ✓  ✓  ✗  ✓  ✗  ✓        model 1 gets two wrong

Round 2:  ●  ●  ⬤  ●  ⬤  ●        those two are now HEAVY
          ✓  ✗  ✓  ✓  ✓  ✓        model 2 fixes them (but breaks another)

Round 3:  ●  ⬤  ●  ●  ●  ●        the new mistake becomes heavy
                                    …and so on
```

### Why this reduces bias

Each new learner is explicitly told *"here is what the committee still cannot do — fix it."* The ensemble keeps adding capability exactly where it is lacking, so it can build a very accurate model out of stumps that individually barely beat guessing. Bagging cannot do this — its models never learn from each other.

### Boosting — The 4 Steps (from the slides)
1. Draw a random subset of training samples **s1 WITHOUT replacement** from the training set S to train a weak learner **P1.**
2. Draw a second random training subset **s2 without replacement**, and **add 50 percent of the samples that were previously misclassified**, to train a weak learner **P2.**
3. Find the training samples **s3** on which **P1 and P2 disagree**, to train a third weak learner **P3.**
4. **Combine all the weak learners via MAJORITY VOTING.**

> Note the contrast: **boosting samples WITHOUT replacement**, bagging samples **WITH replacement**.

> **Step 3 is clever:** the examples where P1 and P2 *disagree* are precisely the hard, ambiguous ones sitting near the boundary. P3 is trained as the tie-breaker specialist.

### Boosting — Pros and Cons

**Pros**
- **Supports different loss functions**
- **Works well with interactions**

**Cons**
- **Prone to over-fitting** — chase the hard examples too long and the model starts memorising noise. *(If a point is mislabelled, boosting keeps raising its weight and eventually contorts the model around a wrong answer.)*
- **Requires careful tuning of different hyper-parameters** — learning rate, number of estimators, tree depth

---

## 7. AdaBoost (Adaptive Boosting)

> **Definition:** AdaBoost is an algorithm for constructing a **"strong" classifier as a LINEAR COMBINATION of "simple"/"weak" classifiers.**

- The **final classification is based on a WEIGHTED VOTE of the weak classifiers.**

### The cycle
1. Start with **equal weights** on all training samples
2. Train a weak classifier (typically a **decision stump**)
3. Compute its error and give it an importance weight **α** — **lower error → higher α**
4. **Increase the weights of misclassified samples**, decrease the rest, then re-normalise
5. Repeat; the next classifier concentrates on the hard examples
6. **Final prediction = sign of the weighted sum of all weak classifiers' outputs**

### Why the vote is *weighted*

In bagging every model gets one equal vote. In AdaBoost, a stump that was 80% accurate gets a **louder** vote than one that was 55% accurate:

```
Stump 1 (α = 1.2) says SPAM       →  +1.2
Stump 2 (α = 0.4) says NOT SPAM   →  −0.4
Stump 3 (α = 0.9) says SPAM       →  +0.9
                          total    =  +1.7  →  positive  →  SPAM
```

Two stumps say spam with high confidence, one disagrees weakly — spam wins. **The committee listens more to the members who have proved reliable.**

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

**The best score in the entire slide deck** — 100 decision stumps, each barely better than a coin flip, combined into the strongest model tested.

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
| Handles noisy data | **Well** — noise averages out | **Poorly** — it chases noisy points |
| Can run in parallel? | **Yes** | **No** — each model needs the previous one |
| Example | Random Forest | AdaBoost |

**The one-line summary:** bagging builds **many independent models and averages away their variance**; boosting builds **a chain of models that each fix the last one's bias**.

---

## 9. Accuracy Scoreboard (Census Income dataset)

| Algorithm | Accuracy | |
|---|---|---|
| Polynomial SVM (degree 4) | 0.5833 | wrong kernel — worse than guessing the majority class |
| Naive Bayes (Gaussian) | 0.7851 | |
| Logistic Regression | 0.7864 | single models cluster around 0.78 |
| Linear SVM | 0.7866 | |
| Random Forest | 0.8511 | **ensembles jump ~7 points** |
| Bagging | 0.8525 | |
| **AdaBoost** | **0.8635** | **← best** |

**The lesson:** switching between single algorithms bought ~0.2%. Switching to an **ensemble** bought **7%**. This is why ensembles dominate data-science competitions.

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
