# 09 — Classifier Evaluation: Fitting, Sampling, Cross-Validation & Metrics

> Source: `Machine_Learning_-_Classifiers_-_Classifiers_Evaluation.pptx`

**Topics covered:** Under-fitting & over-fitting · Training/Validation/Test sets · Data sampling · Cross Validation · Confusion Matrix · ROC · P-R Curve

---

## 1. Training Error vs Generalization Error

| Term | Definition |
|---|---|
| **Training Error** | The **error between the actual and predicted values of the TRAINING data** |
| **Generalization Error** | An error which tells **how well the model will do on FUTURE data** |

> A low training error means nothing on its own. What matters is the generalization error.

---

## 2. Under-fitting and Over-fitting

### Under-fitting
> A model is **under-fitting when it CANNOT CAPTURE THE UNDERLYING TREND of the data.**

- The **model is too simple**
- **Performs badly with BOTH train and test data**

### Over-fitting
> A model is **over-fitting when the model also considers the NOISE and inaccurate data entries of the training dataset.**

- The **model is biased towards the train data**
- **Performs badly with TEST data** (but well on train data)

### The quick diagnostic table

| | Train performance | Test performance | Diagnosis |
|---|---|---|---|
| **Under-fitting** | **Bad** | **Bad** | Too simple → high bias |
| **Good fit** | Good | Good | Just right |
| **Over-fitting** | **Very good** | **Bad** | Too complex → high variance |

*(Connects directly to note 08: under-fitting = high bias, over-fitting = high variance.)*

---

## 3. Training, Validation and Test Sets

The slides ask: *"What is the approach to build a proper model?"* — split the data into three parts.

| Set | Purpose |
|---|---|
| **Train** | **To train the model** |
| **Test** | **To test the model** |
| **Validation** | **To choose the best model** — i.e. the best possible ML algorithm with the best hyper-parameters for the data |

---

## 4. Data Sampling

Rules stated in the slides:
- The dataset needs to be **split into Train, Validation and Test sets**.
- **Records in each set should be in random order.**

### Common types of sampling

**1. Random sampling**
- We have only **one labelled dataset**.
- The dataset is split into three portions (Train / Test / Validation).
- **Records for each set are selected randomly.**

**2. Random resampling**
- **Same as random sampling**, but…
- **We can artificially INCREASE the training set size using random resampling.**

**3. Stratified sampling**
- In some cases, when randomly selecting sets, we may want to ensure that **CLASS PROPORTIONS ARE MAINTAINED in each selected set.**
- Method: **first stratify instances by class, then randomly select instances from each class proportionally.**

> **Why stratified sampling matters:** with imbalanced data, a purely random split might put almost all minority-class examples into the training set and hardly any into the test set, making evaluation meaningless.

---

## 5. Cross Validation

> **Definition:** Cross-validation is a **RESAMPLING TECHNIQUE used to evaluate machine learning models on a LIMITED data sample.**

- We **train the model using a subset of the dataset** and then **evaluate using the complementary subset**, which is called the **cross validation set / CV set**.

### Commonly used CV techniques
- **K-fold cross-validation**
- **N-fold cross-validation (Leave-One-Out)**

**K-fold:** split the data into k folds; train on k−1 folds, validate on the remaining one; repeat k times so each fold serves as the validation set once; average the results.

**Leave-One-Out (LOOCV):** the extreme case where **k = N** (the number of instances) — each single instance is held out in turn. Very thorough but very expensive.

### Worked example from the slides
> Suppose we have **100 instances**, and we want to estimate accuracy with cross validation. Adding up the correct predictions across all folds gives **73 correct out of 100**:
>
> **Accuracy = 73/100 = 73%**

---

## 6. Accuracy — and Why It Isn't Enough

> **Accuracy is the primary evaluation measure for classification.**

```
                  Number of correct predictions        TP + TN
Accuracy = ────────────────────────────────────  =  ───────────────────
                  Total number of predictions        TP + TN + FP + FN
```

### But accuracy may NOT be useful in cases like:
- **Large class skew** (class imbalance)
- **Different misclassification costs**

*(Example: with 99% negatives, always predicting "negative" gives 99% accuracy while being useless. And in cancer screening, a false negative is far more costly than a false positive — accuracy treats them the same.)*

### Other efficient measures available
- **Precision**
- **Recall**
- **Confusion Matrix**
- **ROC AUC**
- **P-R curve**

---

## 7. Confusion Matrix

A table comparing **actual** classes with **predicted** classes.

|  | **Predicted: Positive** | **Predicted: Negative** |
|---|---|---|
| **Actual: Positive** | **TP** (True Positive) | **FN** (False Negative) — *Type II error* |
| **Actual: Negative** | **FP** (False Positive) — *Type I error* | **TN** (True Negative) |

| Term | Meaning in plain English |
|---|---|
| **TP** | Predicted positive, and it really was positive ✔ |
| **TN** | Predicted negative, and it really was negative ✔ |
| **FP** | Predicted positive, but it was actually negative ✘ (**false alarm**, Type I error) |
| **FN** | Predicted negative, but it was actually positive ✘ (**miss**, Type II error) |

### The metrics derived from it

| Metric | Formula | Plain-English question it answers |
|---|---|---|
| **Accuracy** | (TP + TN) / (TP + TN + FP + FN) | Overall, how often is the model right? |
| **Precision** | **TP / (TP + FP)** | Of everything I **predicted positive**, how much really was? |
| **Recall / Sensitivity / TP-rate** | **TP / (TP + FN)** | Of all the **actual positives**, how many did I catch? |
| **Specificity / TN-rate** | TN / (TN + FP) | Of all the actual negatives, how many did I correctly reject? |
| **FP-rate** | **FP / (FP + TN)** = 1 − Specificity | How often do I raise a false alarm? |
| **F1-score** | 2 × (Precision × Recall) / (Precision + Recall) | The **harmonic mean** — one number balancing both |

### Precision vs Recall — how to remember
- **Precision** = "**P**redicted positives" in the denominator → measures how **trustworthy** a positive prediction is.
- **Recall** = "**R**eal positives" in the denominator → measures how **complete** the positive detection is.
- They **trade off**: lowering the threshold catches more positives (**recall ↑**) but produces more false alarms (**precision ↓**).

### Worked mini-example
Suppose out of 100 emails, 40 are spam. The model flags 30 emails as spam, of which 25 really are spam.

- TP = 25, FP = 5, FN = 40 − 25 = 15, TN = 60 − 5 = 55
- Accuracy = (25 + 55)/100 = **80%**
- Precision = 25/30 = **0.833**
- Recall = 25/40 = **0.625**
- F1 = 2(0.833 × 0.625)/(0.833 + 0.625) = **0.714**

---

## 8. ROC Curve

> **Definition:** A **Receiver Operating Characteristic (ROC) curve plots the TP-rate vs. the FP-rate**, as a **threshold on the confidence of an instance being positive is VARIED.**

- The **area under the ROC curve is called ROC-AUC**.

**How to read it:**
- **X-axis = FP-rate**, **Y-axis = TP-rate**
- The **top-left corner** (TPR = 1, FPR = 0) is the perfect classifier
- The **diagonal line** represents random guessing → **AUC = 0.5**
- **AUC = 1.0** is a perfect classifier; **AUC < 0.5** is worse than random

---

## 9. Precision-Recall (P-R) Curve

> **Definition:** A **precision/recall curve plots PRECISION vs. RECALL (TP-rate)**, as a **threshold on the confidence of an instance being positive is varied.**

- **X-axis = Recall**, **Y-axis = Precision**

---

## 10. Advantages of ROC and P-R Curves (memorise this list)

**ROC:**
- **ROC is INSENSITIVE to changes in class distribution.**
- **ROC can identify OPTIMAL CLASSIFICATION THRESHOLDS for tasks with differential misclassification costs.**

**P-R:**
- **P-R shows the fraction of predictions that are false positives.**
- **P-R is well-suited for tasks with LOTS OF NEGATIVE INSTANCES.**

**Both:**
- **Both allow predictive performance to be assessed at VARIOUS LEVELS OF CONFIDENCE.**

| | **ROC curve** | **P-R curve** |
|---|---|---|
| Axes | TP-rate vs FP-rate | Precision vs Recall |
| Class distribution | **Insensitive** to changes | Sensitive — reflects the skew |
| Best for | Balanced data; choosing thresholds under differential costs | **Highly imbalanced data (lots of negatives)** |
| Area metric | **ROC-AUC** | AUC-PR / Average Precision |

---

## 11. Full Evaluation Workflow Summary

```
Full labelled dataset
        │
        ├─► Train set        → fit model parameters
        ├─► Validation set   → choose algorithm + hyper-parameters (or use k-fold CV)
        └─► Test set         → final unbiased evaluation (used ONCE)
                                 │
                                 └─► Confusion matrix → Accuracy, Precision,
                                     Recall, F1, ROC-AUC, P-R curve
```

---

# MCQ Practice — Classifier Evaluation

**Q1.** Training error is the error between:
- A) Actual and predicted values of test data
- B) Actual and predicted values of training data
- C) Two different models
- D) Bias and variance

**Q2.** Generalization error tells us:
- A) How well the model fits the training data
- B) How well the model will do on future data
- C) The number of parameters
- D) The class distribution

**Q3.** A model that cannot capture the underlying trend of the data is:
- A) Over-fitting
- B) Under-fitting
- C) Well-fitted
- D) Regularized

**Q4.** An under-fitting model performs:
- A) Well on train, badly on test
- B) Badly on both train and test data
- C) Well on both
- D) Badly on train, well on test

**Q5.** An over-fitting model:
- A) Is too simple
- B) Also considers the noise and inaccurate entries of the train set
- C) Performs badly on train data
- D) Has high bias

**Q6.** An over-fitting model is biased towards:
- A) Test data
- B) Train data
- C) Validation data
- D) Future data

**Q7.** The validation set is used to:
- A) Train the model parameters
- B) Choose the best model / hyper-parameters
- C) Give the final unbiased score
- D) Clean the data

**Q8.** Records in each split should be in:
- A) Sorted order by target
- B) Random order
- C) Order of collection
- D) Alphabetical order

**Q9.** Which sampling technique maintains class proportions in each set?
- A) Random sampling
- B) Random resampling
- C) Stratified sampling
- D) Active sampling

**Q10.** In stratified sampling, we first:
- A) Randomly shuffle everything
- B) Stratify instances by class, then select proportionally from each class
- C) Remove the minority class
- D) Duplicate the majority class

**Q11.** Random resampling can be used to:
- A) Reduce the number of features
- B) Artificially increase the training set size
- C) Guarantee balance
- D) Remove outliers

**Q12.** Cross-validation is best described as:
- A) A feature selection method
- B) A resampling technique to evaluate models on a limited data sample
- C) A regularization method
- D) A clustering technique

**Q13.** Leave-One-Out cross-validation is also called:
- A) K-fold with k=2
- B) N-fold cross-validation
- C) Stratified sampling
- D) Bootstrapping

**Q14.** In the slides' CV example with 100 instances and 73 correct predictions, the accuracy is:
- A) 73%
- B) 27%
- C) 7.3%
- D) 100%

**Q15.** Accuracy may NOT be a useful measure when there is:
- A) Balanced data
- B) Large class skew or different misclassification costs
- C) Only two classes
- D) A large dataset

**Q16.** A False Positive means:
- A) Predicted negative, actually positive
- B) Predicted positive, actually negative
- C) Predicted positive, actually positive
- D) Predicted negative, actually negative

**Q17.** A False Negative means:
- A) Predicted negative, actually positive
- B) Predicted positive, actually negative
- C) Predicted negative, actually negative
- D) Predicted positive, actually positive

**Q18.** Precision is calculated as:
- A) TP / (TP + FN)
- B) TP / (TP + FP)
- C) TN / (TN + FP)
- D) (TP + TN) / Total

**Q19.** Recall (TP-rate) is calculated as:
- A) TP / (TP + FP)
- B) TP / (TP + FN)
- C) FP / (FP + TN)
- D) TN / (TN + FN)

**Q20.** The FP-rate is calculated as:
- A) FP / (FP + TN)
- B) FP / (FP + TP)
- C) FN / (FN + TP)
- D) TN / (TN + FP)

**Q21.** The F1-score is the:
- A) Arithmetic mean of precision and recall
- B) Harmonic mean of precision and recall
- C) Geometric mean of TP and TN
- D) Difference between precision and recall

**Q22.** Given TP=25, FP=5, FN=15, TN=55, the precision is:
- A) 0.625
- B) 0.833
- C) 0.800
- D) 0.714

**Q23.** With the same numbers, the recall is:
- A) 0.625
- B) 0.833
- C) 0.800
- D) 0.500

**Q24.** A ROC curve plots:
- A) Precision vs Recall
- B) TP-rate vs FP-rate
- C) Accuracy vs Threshold
- D) Bias vs Variance

**Q25.** The area under the ROC curve is called:
- A) F1-score
- B) ROC-AUC
- C) Recall
- D) Log-loss

**Q26.** A ROC-AUC value of 0.5 indicates:
- A) A perfect classifier
- B) Performance equivalent to random guessing
- C) A classifier worse than random
- D) An overfitted classifier

**Q27.** A P-R curve plots:
- A) TP-rate vs FP-rate
- B) Precision vs Recall
- C) Accuracy vs Recall
- D) Precision vs FP-rate

**Q28.** Which is a stated advantage of the ROC curve?
- A) It is sensitive to class distribution
- B) It is insensitive to changes in class distribution
- C) It requires balanced data
- D) It shows only accuracy

**Q29.** ROC curves can identify optimal classification thresholds for tasks with:
- A) Equal misclassification costs
- B) Differential misclassification costs
- C) No labels
- D) Continuous targets

**Q30.** The P-R curve is well-suited for tasks with:
- A) Lots of positive instances
- B) Lots of negative instances
- C) No negative instances
- D) Only balanced classes

**Q31.** Both ROC and P-R curves allow performance to be assessed at:
- A) One fixed threshold only
- B) Various levels of confidence
- C) Training time only
- D) Zero cost

**Q32.** Both curves are generated by varying:
- A) The number of features
- B) The threshold on the confidence of an instance being positive
- C) The learning rate
- D) The number of folds

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Training error uses training data. |
| 2 | **B** | Generalization = performance on future data. |
| 3 | **B** | Under-fitting misses the trend. |
| 4 | **B** | Bad on both. |
| 5 | **B** | It learns the noise too. |
| 6 | **B** | Biased towards train data. |
| 7 | **B** | Model/hyper-parameter selection. |
| 8 | **B** | Random order. |
| 9 | **C** | Stratified sampling preserves proportions. |
| 10 | **B** | Stratify, then sample proportionally. |
| 11 | **B** | Artificially increases training set size. |
| 12 | **B** | Definition from the slides. |
| 13 | **B** | N-fold = Leave-One-Out. |
| 14 | **A** | 73/100 = 73%. |
| 15 | **B** | Both cases listed. |
| 16 | **B** | False alarm. |
| 17 | **A** | A miss. |
| 18 | **B** | TP over predicted positives. |
| 19 | **B** | TP over actual positives. |
| 20 | **A** | FP over actual negatives. |
| 21 | **B** | Harmonic mean. |
| 22 | **B** | 25/(25+5) = 0.833. |
| 23 | **A** | 25/(25+15) = 0.625. |
| 24 | **B** | TP-rate vs FP-rate. |
| 25 | **B** | ROC-AUC. |
| 26 | **B** | Diagonal = random guessing. |
| 27 | **B** | Precision vs Recall. |
| 28 | **B** | Insensitive to class distribution. |
| 29 | **B** | Differential misclassification costs. |
| 30 | **B** | Lots of negative instances. |
| 31 | **B** | Various levels of confidence. |
| 32 | **B** | The confidence threshold is varied. |
