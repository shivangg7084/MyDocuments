# 09 — Classifier Evaluation: Fitting, Sampling, Cross-Validation & Metrics

> Source: `Machine_Learning_-_Classifiers_-_Classifiers_Evaluation.pptx`

**Topics covered:** Under-fitting & over-fitting · Training/Validation/Test sets · Data sampling · Cross Validation · Confusion Matrix · ROC · P-R Curve

---

## 1. Training Error vs Generalization Error

| Term | Definition |
|---|---|
| **Training Error** | The **error between the actual and predicted values of the TRAINING data** |
| **Generalization Error** | An error which tells **how well the model will do on FUTURE data** |

**Why the distinction is everything:** a model that memorises your training data scores a perfect training error and is worthless. It is the difference between a student who memorised last year's answer key and one who understood the subject — you only find out which you have when the new paper arrives.

> **A low training error means nothing on its own.**

---

## 2. Under-fitting and Over-fitting

### Under-fitting
> A model is **under-fitting when it CANNOT CAPTURE THE UNDERLYING TREND of the data.**

- The **model is too simple**
- **Performs badly with BOTH train and test data**

### Over-fitting
> A model is **over-fitting when the model also considers the NOISE and inaccurate data entries of the train dataset.**

- The **model is biased towards the train data**
- **Performs badly with TEST data**

### Seeing all three at once

```
UNDERFIT (too simple)      GOOD FIT                 OVERFIT (too complex)
   ·  ·                       ·  ·                      ·  ·
 ─────────  ·               ╱‾‾‾╲  ·                  ╱╲ ╱╲  ·
·   ·   · ·                ╱  ·  ╲· ·                ╱  V  ╲╱╲·
                          ·        ╲                ·        ╲
a straight line through    follows the real trend,   passes through EVERY
curved data — wrong        ignores the wobble        point, including noise
everywhere
```

The overfit curve is **perfect on the data you have** and useless on the data you don't.

### The quick diagnostic table

| | Train performance | Test performance | Diagnosis | Cause |
|---|---|---|---|---|
| **Under-fitting** | **Bad** | **Bad** | Too simple | **High bias** |
| **Good fit** | Good | Good | Just right | Balanced |
| **Over-fitting** | **Very good** | **Bad** | Too complex | **High variance** |

*(Connects straight to note 08: under-fitting = high bias, over-fitting = high variance.)*

> **The single most useful diagnostic in ML:** *a large gap between training score and test score means overfitting; both scores being low means underfitting.*

---

## 3. Training, Validation and Test Sets

The slides ask: *"What is the approach to build a proper model?"* — split the data into three parts.

| Set | Purpose | Analogy |
|---|---|---|
| **Train** | **To train the model** | The textbook |
| **Validation** | **To choose the best model** — the best ML algorithm with the best hyper-parameters for the data | Mock tests |
| **Test** | **To test the model** | The final exam |

**Why validation must be separate from test:** if you try 50 models and pick the one that scores best on the test set, you have used the test set to *make a decision* — and its score is no longer an honest prediction of future performance. You optimised against it, so it became part of training. The validation set absorbs that contamination and keeps the test set clean.

---

## 4. Data Sampling

Rules from the slides:
- The dataset needs to be **split into Train, Validation and Test sets.**
- **Records in each set should be in random order.**

> **Why random order matters — a real disaster:** many datasets arrive sorted by the target (all `<=50K` rows first, then all `>50K`). Split that without shuffling and your training set contains **only one class** while your test set contains **only the other.** The model never sees a positive example, and every test prediction is wrong. Always shuffle.

### The three types of sampling

**1. Random sampling**
- We have only **one labelled dataset**
- It is split into three portions (Train / Test / Validation)
- **Records for each set are selected randomly**

**2. Random resampling**
- **Same as random sampling**, but
- **We can artificially INCREASE the training set size using random resampling** — by drawing repeatedly (with replacement) you generate a larger training set from limited data. *(This is the same bootstrap idea that powers bagging in note 07.)*

**3. Stratified sampling**
- Sometimes we must ensure **CLASS PROPORTIONS ARE MAINTAINED in each selected set**
- Method: **first stratify instances by class, then randomly select instances from each class proportionally**

### Why stratified sampling matters — with numbers

Dataset: **1000 rows, 950 negative, 50 positive (5%).** Take a 20% test set:

| | Positives in train | Positives in test | Problem |
|---|---|---|---|
| **Plain random** | Could be 47 | Could be **3** | Test score based on 3 examples is meaningless — and a bad shuffle could leave **0** |
| **Stratified** | Exactly 40 (5%) | Exactly 10 (5%) | Both sets mirror reality |

**Stratification guarantees each split is a faithful miniature of the whole dataset.** With imbalanced data it is not optional.

---

## 5. Cross Validation

> **Definition:** Cross-validation is a **RESAMPLING TECHNIQUE used to evaluate machine learning models on a LIMITED data sample.**

- We **train using a subset of the dataset** and **evaluate using the complementary subset**, called the **cross validation set / CV set.**

### The problem it solves

With one fixed 80/20 split you get **one** score — and that score depends heavily on *which* 20% you happened to hold out. A lucky split flatters your model; an unlucky one condemns it. Cross-validation removes this luck by rotating the held-out part and averaging.

### Commonly used CV techniques
- **K-fold cross-validation**
- **N-fold cross-validation (Leave-one-out)**

**K-fold:** split into k folds; train on k−1, validate on the one left out; repeat k times so each fold is the validation set exactly once; average the scores.

```
Round 1:  ▣ □ □ □ □   → 82%
Round 2:  □ ▣ □ □ □   → 79%
Round 3:  □ □ ▣ □ □   → 84%      ▣ = validate
Round 4:  □ □ □ ▣ □   → 81%      □ = train
Round 5:  □ □ □ □ ▣   → 79%
                    average = 81%   ← a far more trustworthy number
```

**Leave-One-Out (LOOCV):** the extreme case, **k = N** (the number of instances). Each single row is held out in turn. Maximum use of the data, but you train N separate models — with 10,000 rows that is 10,000 trainings. Reserved for very small datasets.

### Worked example from the slides

> Suppose we have **100 instances** and we want to estimate accuracy with cross validation. Summing the correct predictions across all folds gives **73 correct out of 100**:
>
> **Accuracy = 73/100 = 73%**

**What that means:** every one of the 100 instances was predicted exactly once, by a model that had **never seen it** during training. So all 100 predictions are honest out-of-sample predictions — that is why CV squeezes a reliable estimate out of a small dataset.

---

## 6. Accuracy — and Why It Isn't Enough

> **Accuracy is the primary evaluation measure for classification.**

```
                  Number of correct predictions        TP + TN
Accuracy = ────────────────────────────────────  =  ───────────────────
                  Total number of predictions        TP + TN + FP + FN
```

### Accuracy may NOT be useful in cases like:

**1. Large class skew.** With 99% negatives, a model that always says "negative" scores 99% and detects nothing. *(See the fraud example in note 08.)*

**2. Different misclassification costs.** Accuracy treats every mistake as equally bad, which is often absurd:

| Mistake | In cancer screening | In spam filtering |
|---|---|---|
| **False Positive** | An extra test, some anxiety — **recoverable** | A real email lost in the spam folder — **bad** |
| **False Negative** | A missed cancer — **potentially fatal** | One spam in your inbox — **trivial** |

Note that the two columns are **opposite**: in medicine false negatives are the disaster, in spam filtering false positives are. A single accuracy number cannot express either preference.

### Other efficient measures available
- **Precision**
- **Recall**
- **Confusion Matrix**
- **ROC AUC**
- **P-R curve**

---

## 7. Confusion Matrix

A table comparing **actual** classes with **predicted** classes — the source from which every other metric is derived.

|  | **Predicted: Positive** | **Predicted: Negative** |
|---|---|---|
| **Actual: Positive** | **TP** (True Positive) | **FN** (False Negative) — *Type II error* |
| **Actual: Negative** | **FP** (False Positive) — *Type I error* | **TN** (True Negative) |

> **How to decode the names, so you never have to memorise them:** the **second word is what the model PREDICTED**; the **first word says whether it was RIGHT.** So "False Positive" = predicted Positive, and that was False (wrong).

| Term | Plain English | Everyday name |
|---|---|---|
| **TP** | Predicted positive, really was positive ✔ | Correct catch |
| **TN** | Predicted negative, really was negative ✔ | Correct pass |
| **FP** | Predicted positive, actually negative ✘ | **False alarm** (Type I) |
| **FN** | Predicted negative, actually positive ✘ | **Miss** (Type II) |

*(Fire alarm analogy: **FP** = the alarm shrieks while you make toast. **FN** = the house is burning and the alarm stays silent.)*

### The metrics derived from it

| Metric | Formula | The question it answers |
|---|---|---|
| **Accuracy** | (TP + TN) / (TP + TN + FP + FN) | Overall, how often is the model right? |
| **Precision** | **TP / (TP + FP)** | Of everything I **predicted positive**, how much really was? |
| **Recall / Sensitivity / TP-rate** | **TP / (TP + FN)** | Of all the **actual positives**, how many did I catch? |
| **Specificity / TN-rate** | TN / (TN + FP) | Of all actual negatives, how many did I correctly reject? |
| **FP-rate** | **FP / (FP + TN)** = 1 − Specificity | How often do I raise a false alarm? |
| **F1-score** | 2 × (P × R) / (P + R) | One number balancing precision and recall |

### Precision vs Recall — never confuse these again

- **Precision** — the denominator is what you **Predicted**. *"When I raise the alarm, am I right?"* → measures **trustworthiness**.
- **Recall** — the denominator is what was **Real**. *"Of everything I should have caught, how much did I?"* → measures **completeness**.

**They trade off directly.** Lower your threshold and you flag more cases: you catch more real positives (**recall ↑**) but also raise more false alarms (**precision ↓**).

The two extremes make it obvious:
- Flag **everything** as positive → **recall = 100%**, precision terrible
- Flag only the **single most certain** case → **precision = 100%**, recall terrible

**F1 is the harmonic mean**, not the ordinary average, specifically so that this cheating fails: precision 1.0 with recall 0.01 gives an ordinary average of 0.505 but an **F1 of just 0.02.** The harmonic mean punishes imbalance — you must be good at *both*.

### Fully worked example

Out of 100 emails, **40 are genuinely spam.** The model flags **30** as spam, and **25** of those are correct.

*Step 1 — fill the matrix:*
```
TP = 25                     (flagged spam, was spam)
FP = 30 − 25 = 5            (flagged spam, wasn't)
FN = 40 − 25 = 15           (real spam it missed)
TN = 60 − 5  = 55           (correctly left alone)
```

| | Predicted Spam | Predicted Not-Spam | |
|---|---|---|---|
| **Actually Spam** | TP = **25** | FN = **15** | 40 |
| **Actually Not-Spam** | FP = **5** | TN = **55** | 60 |
| | 30 | 70 | 100 |

*Step 2 — compute:*
```
Accuracy  = (25 + 55) / 100        = 0.80   → 80% right overall
Precision = 25 / (25 + 5)  = 25/30 = 0.833  → when it says spam, right 83% of the time
Recall    = 25 / (25 + 15) = 25/40 = 0.625  → but it only caught 62.5% of the spam
F1        = 2(0.833 × 0.625)/(0.833 + 0.625) = 0.714
FP-rate   = 5 / (5 + 55)   = 5/60  = 0.083
```

*Step 3 — interpret:* 80% accuracy sounds respectable, but **recall of 0.625 means 15 spam emails still landed in the inbox.** Precision (0.833) is much healthier than recall (0.625), which tells you the model is **too cautious** — it only flags when very sure. **The fix: lower the threshold**, accepting more false alarms to catch more spam.

**This is the whole point of the metric family: one number told you "80%, fine"; four numbers told you exactly what was wrong and what to do about it.**

---

## 8. ROC Curve

> **Definition:** A **Receiver Operating Characteristic (ROC) curve plots the TP-rate vs. the FP-rate** as a **threshold on the confidence of an instance being positive is VARIED.**

- The **area under the ROC curve is called ROC-AUC.**

### Why a curve rather than a point

Every metric so far assumed one fixed threshold (usually 0.5). But the threshold is **yours to choose** (note 04). Reporting one threshold's score describes one arbitrary setting, not the model. The ROC curve **sweeps every possible threshold** and plots the result — judging the model itself, not one configuration of it.

### Building one by hand

Sweep the threshold and record the two rates at each stop:

| Threshold | TP-rate (recall) | FP-rate | Comment |
|---|---|---|---|
| 0.9 | 0.30 | 0.02 | Very strict: few catches, almost no false alarms |
| 0.7 | 0.60 | 0.10 | |
| 0.5 | 0.80 | 0.25 | The default |
| 0.3 | 0.95 | 0.55 | Catching nearly everything, lots of false alarms |
| 0.1 | 1.00 | 0.90 | Flagging almost everything |

Plot those five points and you have the ROC curve.

```
TPR
 1.0 |          ╭─────────●  ← perfect corner (TPR=1, FPR=0)
     |      ╭──╯
     |    ╭╯          ·
 0.5 |  ╭╯       ·          ← the diagonal = random guessing
     | ╭╯   ·
     |╭ ·
 0.0 ●──────────────────► FPR
    0.0                1.0
```

**How to read it:**
- **X = FP-rate, Y = TP-rate**
- **Top-left corner** (TPR 1, FPR 0) = the perfect classifier
- The **diagonal** = random guessing → **AUC = 0.5**
- **AUC = 1.0** = perfect; **AUC < 0.5** = worse than random *(and amusingly, a model reliably worse than random becomes useful the moment you flip its predictions)*

**What AUC actually means:** the probability that the model ranks a randomly chosen **positive** example above a randomly chosen **negative** one. AUC of 0.85 = it gets that ordering right 85% of the time.

| AUC | Verdict |
|---|---|
| 0.9 – 1.0 | Excellent |
| 0.8 – 0.9 | Good |
| 0.7 – 0.8 | Fair |
| 0.5 | No better than a coin toss |

---

## 9. Precision-Recall (P-R) Curve

> **Definition:** A **precision/recall curve plots PRECISION vs. RECALL (TP-rate)** as a **threshold on the confidence of an instance being positive is varied.**

- **X-axis = Recall**, **Y-axis = Precision**
- It typically slopes **downward** — pushing recall up drags precision down, exactly as the trade-off predicts

### When P-R beats ROC

With **1,000,000 negatives and 100 positives**, suppose your model produces 1,000 false positives.

- **FP-rate** = 1,000 / 1,000,000 = **0.001** — invisible on an ROC curve, which still looks superb
- **Precision** = 100 / (100 + 1,000) = **0.09** — the P-R curve screams that **91% of your alarms are false**

The enormous negative class swamps the FP-rate and hides the problem; precision does not have a huge denominator to hide behind. **This is exactly why the slides say P-R is well-suited to tasks with lots of negative instances.**

---

## 10. Advantages of ROC and P-R Curves (memorise this list)

**ROC:**
- **ROC is INSENSITIVE to changes in class distribution.** *(Both its axes are ratios computed within a single row of the confusion matrix, so changing the class balance does not move the curve — useful for comparing models across differently balanced datasets.)*
- **ROC can identify OPTIMAL CLASSIFICATION THRESHOLDS for tasks with differential misclassification costs.** *(Knowing a miss costs 10× a false alarm, you can pick the exact point on the curve that minimises total cost.)*

**P-R:**
- **P-R shows the fraction of predictions that are false positives.**
- **P-R is well-suited for tasks with LOTS OF NEGATIVE INSTANCES.**

**Both:**
- **Both allow predictive performance to be assessed at VARIOUS LEVELS OF CONFIDENCE.**

| | **ROC curve** | **P-R curve** |
|---|---|---|
| Axes | TP-rate vs FP-rate | Precision vs Recall |
| Class distribution | **Insensitive** | Sensitive — reflects the skew |
| Best for | Balanced data; choosing thresholds under differential costs | **Highly imbalanced data (lots of negatives)** |
| Area metric | **ROC-AUC** | AUC-PR / Average Precision |
| Perfect model sits at | Top-**left** | Top-**right** |

---

## 11. Full Evaluation Workflow Summary

```
Full labelled dataset
        │  (shuffle! stratify if imbalanced)
        ├─► Train set        → fit model parameters
        ├─► Validation set   → choose algorithm + hyper-parameters (or k-fold CV)
        └─► Test set         → final unbiased evaluation (used ONCE)
                                 │
                                 └─► Confusion matrix → Accuracy, Precision,
                                     Recall, F1, ROC-AUC, P-R curve
```

**Which metric should I report?**

| Situation | Use |
|---|---|
| Balanced classes, equal costs | **Accuracy** |
| Imbalanced classes | **Precision, Recall, F1, P-R curve** |
| False alarms are expensive | **Precision** |
| Misses are expensive | **Recall** |
| Comparing models across thresholds | **ROC-AUC** |
| Huge number of negatives | **P-R curve** |

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
