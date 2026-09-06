# Machine Learning — Exam Study Pack (MCQ Preparation)

Complete, simplified notes for every concept in the source documents in [`../`](../), each followed by practice MCQs with answers.

---

## Study Order

| # | File | Source document | Topics |
|---|---|---|---|
| 01 | [Introduction to Machine Learning](01-Introduction-to-Machine-Learning.md) | `Machine_Learning_-_Introduction.pdf` | What is ML, Mitchell's definition, traditional programming vs ML, when to use ML, applications, supervised / unsupervised / reinforcement learning |
| 02 | [EDA & Data Preprocessing](02-EDA-and-Data-Preprocessing.md) | `..._Exploratory_Data_Analysis_-_Data_Preprocessing.pdf` | Preprocessing techniques, missing data, outliers (box plot, scatter, Z-score, IQR), scaling / normalization / standardization, label & one-hot encoding, EDA plots |
| 03 | [Supervised Learning: Regression & Classification](03-Supervised-Learning-Regression-and-Classification.md) | `Supervised_Learning.pdf` | Key components, train/CV/test split, linear & polynomial regression, KNN regression, multicollinearity, Ridge & Lasso, SVR, KNN classifier, decision trees |
| 04 | [Logistic Regression](04-Logistic-Regression.md) | `..._Logistic_Regression.pptx` | Sigmoid, logit, decision boundary, cut-off, cost function, multiclass classification |
| 05 | [Naive Bayes](05-Naive-Bayes.md) | `..._Naive_Bayes.pptx` | Bayes theorem, naive assumption, MAP rule, worked examples, Gaussian NB, zero-probability problem, pros & cons |
| 06 | [Support Vector Machines](06-Support-Vector-Machines.md) | `..._SVM.pptx` | Margin, maximum margin, support vectors, soft margin & C, kernels, kernel trick, multiclass SVM |
| 07 | [Ensemble Methods](07-Ensemble-Methods.md) | `..._Ensemble_methods.pptx` | Ensemble learning, bagging, random forest, boosting, AdaBoost, stacking, bagging vs boosting |
| 08 | [Classifier Design](08-Classifier-Design-Bias-Variance-and-Class-Imbalance.md) | `..._Classifiers_Design.pptx` | Bias & variance, the tradeoff, generative vs discriminative, parametric vs non-parametric, class imbalance & SMOTE |
| 09 | [Classifier Evaluation & Metrics](09-Classifier-Evaluation-and-Metrics.md) | `..._Classifiers_Evaluation.pptx` | Under/over-fitting, train-validation-test, sampling, cross validation, confusion matrix, precision/recall/F1, ROC, P-R curve |
| 10 | [Dimensionality Reduction: PCA & ICA](10-Dimensionality-Reduction-PCA-and-ICA.md) | `..._Dimension_Reduction_Ramya.pptx` | Curse of dimensionality, PCA (eigenvectors, eigenvalues, covariance matrix), ICA, whitening, applications |
| 11 | [Full Syllabus Mock Test](11-Full-Syllabus-Mock-Test.md) | — | **60 mixed MCQs** + last-minute formula & fact sheet |

---

## How to use this pack

1. **Read notes 01 → 10 in order.** Each one explains the concept in plain language first, then gives the exact wording from the slides (that wording is what MCQ options are usually built from).
2. **Do the MCQs at the end of each note immediately** while the topic is fresh. Check against the answer key — every answer has a one-line justification.
3. **Sit the mock test in note 11 closed-book**, timed at 45 minutes.
4. **The night before the exam**, read only the tables — especially the "Pairs to never confuse" table at the end of note 11.

**Total practice questions: 292** (20 + 25 + 30 + 25 + 25 + 25 + 30 + 30 + 32 + 30 + 60).

---

## The 12 facts most likely to appear in an MCQ

1. **ML flips traditional programming:** Data + Output → **Program**.
2. **Bias → underfitting; Variance → overfitting.** Too few parameters = large bias; too many = large variance.
3. **Logistic Regression is a CLASSIFICATION algorithm** that outputs a probability via the **sigmoid**; the linear part is the **logit**; default cut-off **0.5**.
4. **Naive Bayes = generative + parametric**, assumes **conditional independence**, uses the **MAP rule**, suffers the **Zero-Probability problem** (fix: Laplace smoothing).
5. **SVM:** introduced **1992**, famous for **handwritten digit recognition**, maximises the **margin**, handles non-linearity with the **kernel trick**; **discriminative + non-parametric**.
6. **Bagging** = parallel, sampling **with replacement**, reduces **variance**. **Boosting** = sequential, **without replacement**, increases weights of misclassified points, reduces **bias**.
7. **Random Forest = bagging + random feature subset at each split**; generalization error depends on **tree strength and correlation between trees**.
8. **AdaBoost** = strong classifier as a **linear combination** of weak ones, final answer by **weighted vote**; best accuracy (0.864) on the Census dataset.
9. **Precision = TP/(TP+FP), Recall = TP/(TP+FN), FPR = FP/(FP+TN).**
10. **ROC = TPR vs FPR** (insensitive to class distribution); **P-R = Precision vs Recall** (good when there are lots of negatives).
11. **PCA must be run on scaled data**; it uses **eigenvectors (direction) and eigenvalues (importance)** of the **covariance matrix**; it maximises **variance**. **ICA maximises independence** and performs **whitening**.
12. **Class imbalance:** learners are biased toward the **majority class**; **undersampling can hurt**, **random oversampling helps dramatically**; **SMOTE** creates synthetic minority samples. **Decision Trees are sensitive; Naive Bayes is less prone.**
