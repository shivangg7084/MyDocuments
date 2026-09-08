# 11 — Full Syllabus Mock Test (60 MCQs)

> Mixed questions drawn from **all** the documents. Try to do this closed-book in **45 minutes**, then check the answer key at the bottom.

---

## Section A — Introduction & Types of ML (Q1–Q8)

**Q1.** In machine learning, the computer takes ______ as input and produces ______ as output.
- A) Program + Output → Data
- B) Data + Program → Output
- C) Data + Output → Program
- D) Program only → Data

**Q2.** Tom Mitchell's definition involves which three elements?
- A) Data, Model, Loss
- B) Task T, Experience E, Performance measure P
- C) Bias, Variance, Noise
- D) Train, Validation, Test

**Q3.** Predicting tomorrow's temperature in °C is:
- A) Classification
- B) Regression
- C) Clustering
- D) Reinforcement learning

**Q4.** Unsupervised learning is important because:
- A) Getting labels is often difficult and expensive
- B) It is faster
- C) It never overfits
- D) It needs no computation

**Q5.** In reinforcement learning, the next input depends on:
- A) Nothing
- B) The output of the previous input
- C) The number of features
- D) The learning rate

**Q6.** "Humans are unable to explain their expertise" is illustrated by:
- A) Navigating on Mars
- B) Speech recognition
- C) Network routing
- D) Credit scoring

**Q7.** Clustering is an example of:
- A) Supervised learning
- B) Regression
- C) Reinforcement learning
- D) Unsupervised learning

**Q8.** Which type of learning uses rewards and penalties?
- A) Supervised
- B) Unsupervised
- C) Reinforcement
- D) Semi-supervised

---

## Section B — Data Preprocessing & EDA (Q9–Q18)

**Q9.** Which technique is called "data imputation"?
- A) Deleting rows with missing values
- B) Scaling features
- C) Replacing missing values with mean/median/mode
- D) One-hot encoding

**Q10.** A point with a Z-score of 4.2 is most likely:
- A) A typical point
- B) An outlier
- C) The mean
- D) A missing value

**Q11.** IQR equals:
- A) Q3 − Q1 (75th − 25th percentile)
- B) Q1 − Q3
- C) Max − Min
- D) Mean − Median

**Q12.** Standardization produces data with:
- A) Range [0,1]
- B) Only positive values
- C) Mean 1, standard deviation 0
- D) Mean 0, standard deviation 1

**Q13.** One-hot encoding is preferred over label encoding because label encoding:
- A) Is too slow
- B) May imply a false order/hierarchy among categories
- C) Cannot handle strings
- D) Adds too many columns

**Q14.** Which plot is used to display quartiles and outliers?
- A) Histogram
- B) Box plot
- C) Heat map
- D) Line chart

**Q15.** A correlogram/heat map displays:
- A) The correlation matrix between variables
- B) The distribution of one feature
- C) The confusion matrix
- D) The ROC curve

**Q16.** Which is NOT a listed reason for missing data?
- A) Not recorded during creation
- B) Optional entry
- C) Data corruption
- D) Feature scaling

**Q17.** Deleting rows with missing data is a "fail-safe" method when:
- A) The dataset is small
- B) The dataset is large enough
- C) All rows have missing values
- D) The features are categorical

**Q18.** For a categorical column with missing values, you should:
- A) Fill with the column mean
- B) Fill with the standard deviation
- C) Fill with the mode or create a "missing" category
- D) Fill with the IQR

---

## Section C — Supervised Learning (Q19–Q30)

**Q19.** Supervised learning learns a mapping:
- A) X → X
- B) X → Y from labelled data
- C) Y → X
- D) With no data

**Q20.** Which is NOT an assumption of linear regression?
- A) Linearity
- B) Homoscedasticity
- C) Strong multicollinearity
- D) Normally distributed residuals

**Q21.** Polynomial regression is implemented in sklearn by adding:
- A) StandardScaler
- B) PCA
- C) LabelEncoder
- D) PolynomialFeatures(degree=n)

**Q22.** KNN is a "lazy learner" because at fit time it:
- A) Learns coefficients
- B) Only stores the training data
- C) Builds a tree
- D) Computes eigenvectors

**Q23.** KNN classification aggregates neighbours by:
- A) Averaging
- B) Majority vote
- C) Summation
- D) Multiplication

**Q24.** Ridge regression uses which penalty?
- A) L2 (sum of squared coefficients)
- B) L1 (sum of absolute coefficients)
- C) L0
- D) No penalty

**Q25.** Which regularization performs automatic feature selection?
- A) Ridge
- B) Lasso
- C) Both equally
- D) Neither

**Q26.** When λ = 0, a regularized regression becomes:
- A) A constant model
- B) A decision tree
- C) Plain linear regression
- D) Undefined

**Q27.** Multicollinearity causes:
- A) Stable coefficients
- B) Unstable, hard-to-interpret coefficients
- C) Missing values
- D) Class imbalance

**Q28.** In SVR, points inside the ε-tube contribute:
- A) Zero loss
- B) Maximum loss
- C) Negative loss
- D) Half loss

**Q29.** Which model does NOT require feature scaling?
- A) SVM with RBF
- B) KNN
- C) Decision Tree
- D) PCA

**Q30.** The main drawback of a decision tree is:
- A) It cannot handle numeric features
- B) It is not interpretable
- C) It requires scaling
- D) It tends to overfit if grown too deep

---

## Section D — Classifiers (Q31–Q42)

**Q31.** Logistic regression outputs:
- A) A continuous unbounded value
- B) The probability of belonging to class 1
- C) A cluster id
- D) A distance

**Q32.** The linear part `a0 + a1x1 + … + akxk` in logistic regression is the:
- A) Logit
- B) Sigmoid
- C) Kernel
- D) Margin

**Q33.** The default logistic regression cut-off is:
- A) 0
- B) 0.5
- C) 1
- D) 0.75

**Q34.** In Naive Bayes, "naive" refers to:
- A) Simple maths
- B) A small dataset
- C) The assumption that features are conditionally independent
- D) Random initialization

**Q35.** In Bayes' theorem, P(X|C) is the:
- A) Prior
- B) Likelihood
- C) Posterior
- D) Evidence

**Q36.** The Zero Probability problem in Naive Bayes is fixed by:
- A) Increasing the learning rate
- B) Laplace (add-one) smoothing
- C) Scaling the features
- D) Increasing the tree depth

**Q37.** Gaussian Naive Bayes assumes continuous features follow a:
- A) Uniform distribution
- B) Binomial distribution
- C) Poisson distribution
- D) Gaussian distribution

**Q38.** SVM was introduced in and became famous for:
- A) 1992, handwritten digit recognition
- B) 1986, speech recognition
- C) 2000, image captioning
- D) 1975, chess

**Q39.** The margin of a linear classifier is:
- A) The number of support vectors
- B) The width the boundary could be increased by before hitting a data point
- C) The training error
- D) The number of features

**Q40.** `K(a,b) = (a·b + 1)^d` is a:
- A) Linear kernel
- B) RBF kernel
- C) Polynomial kernel
- D) Sigmoid kernel

**Q41.** The kernel trick allows us to:
- A) Explicitly build the high-dimensional feature space
- B) Compute high-dimensional dot products without transforming the data
- C) Delete support vectors
- D) Skip training

**Q42.** In the Census example, Linear SVM (0.787) beat Polynomial SVM (0.583), showing that:
- A) Kernels are useless
- B) A more complex kernel is not automatically better
- C) SVMs cannot classify
- D) Polynomial kernels are always broken

---

## Section E — Ensembles (Q43–Q50)

**Q43.** The ensemble hypothesis is that:
- A) One strong model beats many
- B) More features are better
- C) A group of weak learners forms a strong learner
- D) Deep trees are best

**Q44.** Bagging samples data:
- A) Without replacement
- B) With replacement
- C) In sorted order
- D) By class

**Q45.** Bagging primarily reduces ______, boosting primarily reduces ______:
- A) bias; variance
- B) noise; bias
- C) variance; noise
- D) variance; bias

**Q46.** Random Forest chooses the best split at each node from:
- A) All features
- B) A random subset of F features
- C) The first feature only
- D) The target

**Q47.** In Random Forest, generalization error depends on:
- A) Tree depth only
- B) The strength of individual trees and the correlation between them
- C) The number of classes
- D) The learning rate

**Q48.** In boosting, misclassified samples get their weight:
- A) Increased
- B) Decreased
- C) Zeroed
- D) Unchanged

**Q49.** AdaBoost's final prediction is a:
- A) Simple majority vote
- B) Weighted vote of weak classifiers
- C) Single tree's output
- D) Average of features

**Q50.** In stacking, higher tiers of classifiers:
- A) Can correct lower tiers
- B) Are discarded
- C) Must be identical
- D) Only preprocess data

---

## Section F — Design, Evaluation & Dimensionality Reduction (Q51–Q60)

**Q51.** High bias corresponds to ______ and high variance corresponds to ______:
- A) overfitting; underfitting
- B) both underfitting
- C) underfitting; overfitting
- D) both overfitting

**Q52.** Naive Bayes is a ______ model; SVM is a ______ model:
- A) discriminative; generative
- B) generative; discriminative
- C) both generative
- D) both discriminative

**Q53.** Which model is parametric?
- A) kNN
- B) Decision Tree
- C) Linear regression
- D) SVM

**Q54.** According to the slides, undersampling for class imbalance:
- A) Is the best technique
- B) Is not effective and can even hurt performance
- C) Always increases accuracy
- D) Is the same as SMOTE

**Q55.** SMOTE is a technique for:
- A) Undersampling the majority class
- B) Cross validation
- C) Feature scaling
- D) Synthetic oversampling of the minority class

**Q56.** A model that performs badly on BOTH train and test data is:
- A) Overfitting
- B) Underfitting
- C) Well-fitted
- D) Regularized

**Q57.** Precision = ______ and Recall = ______:
- A) TP/(TP+FP); TP/(TP+FN)
- B) TP/(TP+FN); TP/(TP+FP)
- C) TN/(TN+FP); TP/(TP+FN)
- D) (TP+TN)/Total; TP/(TP+FP)

**Q58.** A ROC curve plots ______ while a P-R curve plots ______:
- A) Precision vs Recall; TPR vs FPR
- B) TPR vs FPR; Precision vs Recall
- C) Accuracy vs Threshold; TPR vs FPR
- D) TPR vs Recall; FPR vs Precision

**Q59.** PCA finds principal components using eigenvectors and eigenvalues of the:
- A) Confusion matrix
- B) Covariance matrix
- C) Correlation coefficient alone
- D) Distance matrix

**Q60.** PCA maximizes ______, whereas ICA maximizes ______:
- A) independence; variance
- B) accuracy; recall
- C) variance; independence
- D) recall; precision

---

## Answer Key — with explanations

Every answer carries the reason and the note to revisit, so a wrong answer teaches you something.

### Section A — Introduction & Types of ML

| Q | Ans | Why | Revise |
|---|---|---|---|
| 1 | **C** | ML flips it: you feed Data + Output and get the Program (model) back. | note 01 |
| 2 | **B** | Mitchell: Task T, Experience E, Performance measure P. | note 01 |
| 3 | **B** | Temperature is a continuous number → regression. | note 01 |
| 4 | **A** | Stated in the slides — labelling data is costly, unlabelled data is plentiful. | note 01 |
| 5 | **B** | RL is sequential: your action changes the situation you face next. | note 01 |
| 6 | **B** | You understand speech effortlessly but cannot write down the rules. | note 01 |
| 7 | **D** | Clustering needs no labels. | note 01 |
| 8 | **C** | Reward/penalty is the defining signal of reinforcement learning. | note 01 |

### Section B — Data Preprocessing & EDA

| Q | Ans | Why | Revise |
|---|---|---|---|
| 9 | **C** | Imputation = replacing missing values with a statistic (mean/median/mode). | note 02 |
| 10 | **B** | The |Z| > 3 rule flags it as an outlier. | note 02 |
| 11 | **A** | IQR = Q3 − Q1 = 75th − 25th percentile. | note 02 |
| 12 | **D** | Standardization → standard Gaussian: mean 0, std 1. | note 02 |
| 13 | **B** | Numbering categories implies Pune(2) > Delhi(0), a ranking that does not exist. | note 02 |
| 14 | **B** | The box spans Q1–Q3 and dots beyond the whiskers are outliers. | note 02 |
| 15 | **A** | A heat map of df.corr() is the correlation matrix. | note 02 |
| 16 | **D** | Scaling is a preprocessing step, not a reason data goes missing. | note 02 |
| 17 | **B** | Deleting rows is fail-safe only when you can afford to lose them. | note 02 |
| 18 | **C** | There is no mean of "Delhi" — use the mode or a new category. | note 02 |

### Section C — Supervised Learning

| Q | Ans | Why | Revise |
|---|---|---|---|
| 19 | **B** | Supervised learning maps inputs to outputs using labelled data. | note 03 |
| 20 | **C** | Linear regression assumes NO strong multicollinearity. | note 03 |
| 21 | **D** | make_pipeline(PolynomialFeatures(degree=2), LinearRegression()). | note 03 |
| 22 | **B** | Lazy learner: fit() stores data, all work happens at prediction time. | note 03 |
| 23 | **B** | Classification votes; regression averages. | note 03 |
| 24 | **A** | Ridge = L2 = sum of squared coefficients. | note 03 |
| 25 | **B** | Only Lasso drives coefficients to exactly zero. | note 03 |
| 26 | **C** | No penalty term left, so it is ordinary least squares. | note 03 |
| 27 | **B** | The model cannot split credit between duplicate features. | note 03 |
| 28 | **A** | Epsilon-insensitive loss: inside the tube costs nothing. | note 03 |
| 29 | **C** | Trees only ask "above the threshold?", which rescaling does not change. | note 03 |
| 30 | **D** | Unrestricted depth means memorising the training set. | note 03 |

### Section D — Classifiers

| Q | Ans | Why | Revise |
|---|---|---|---|
| 31 | **B** | It outputs a probability, then applies a cut-off. | note 04 |
| 32 | **A** | The linear combination before the sigmoid is the logit. | note 04 |
| 33 | **B** | p > 0.5 → class 1 is the default rule. | note 04 |
| 34 | **C** | "Naive" = features assumed conditionally independent. | note 05 |
| 35 | **B** | P(X|C) is the likelihood; P(C|X) is the posterior. | note 05 |
| 36 | **B** | Add-one smoothing stops any probability being exactly zero. | note 05 |
| 37 | **D** | Gaussian NB assumes a normal distribution per feature per class. | note 05 |
| 38 | **A** | 1992, and it made its name on handwritten digit recognition. | note 06 |
| 39 | **B** | The exact definition: width before the boundary hits a data point. | note 06 |
| 40 | **C** | Degree-d polynomial kernel. | note 06 |
| 41 | **B** | That is precisely the kernel trick. | note 06 |
| 42 | **B** | Linear scored 0.787, degree-4 polynomial only 0.583. | note 06 |

### Section E — Ensembles

| Q | Ans | Why | Revise |
|---|---|---|---|
| 43 | **C** | A group of weak learners together forms a strong learner. | note 07 |
| 44 | **B** | Bootstrap = sampling with replacement. | note 07 |
| 45 | **D** | Bagging averages away variance; boosting attacks bias. | note 07 |
| 46 | **B** | Restricting features per split decorrelates the trees. | note 07 |
| 47 | **B** | You want strong trees that are uncorrelated with each other. | note 07 |
| 48 | **A** | Raising their weight forces the next learner to focus on them. | note 07 |
| 49 | **B** | More accurate weak classifiers get a louder vote (higher α). | note 07 |
| 50 | **A** | Higher tiers learn to correct the lower tiers. | note 07 |

### Section F — Design, Evaluation & Dimensionality Reduction

| Q | Ans | Why | Revise |
|---|---|---|---|
| 51 | **C** | Bias = too simple = underfit; variance = too sensitive = overfit. | note 08 |
| 52 | **B** | Naive Bayes is the only generative model in this syllabus. | note 08 |
| 53 | **C** | Linear regression keeps a fixed number of coefficients forever. | note 08 |
| 54 | **B** | Stated in the slides — you throw away most of your genuine data. | note 08 |
| 55 | **D** | SMOTE interpolates new minority points instead of copying old ones. | note 08 |
| 56 | **B** | Bad on train AND test = too simple = underfitting. | note 09 |
| 57 | **A** | Precision divides by what you PREDICTED; recall by what was REAL. | note 09 |
| 58 | **B** | ROC = TPR vs FPR; P-R = precision vs recall. | note 09 |
| 59 | **B** | Eigenvectors and eigenvalues come from the covariance matrix. | note 09 |
| 60 | **C** | PCA compresses by variance; ICA un-mixes by independence. | note 10 |

### Answer letters only (for quick marking)

| Q | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Ans** | C | B | B | A | B | B | D | C | C | B |

| Q | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Ans** | A | D | B | B | A | D | B | C | B | C |

| Q | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Ans** | D | B | B | A | B | C | B | A | C | D |

| Q | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Ans** | B | A | B | C | B | B | D | A | B | C |

| Q | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Ans** | B | B | C | B | D | B | B | A | B | A |

| Q | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Ans** | C | B | C | B | D | B | A | B | B | C |

### Where to revise, by score

Count your wrong answers per section — that tells you exactly which note to reopen.

| Section | Questions | If you lost marks here, reread |
|---|---|---|
| A — Introduction & types | 1–8 | note 01 |
| B — Preprocessing & EDA | 9–18 | note 02 |
| C — Supervised algorithms | 19–30 | note 03 |
| D — Classifiers | 31–42 | notes 04, 05, 06 |
| E — Ensembles | 43–50 | note 07 |
| F — Design & evaluation | 51–60 | notes 08, 09, 10 |

### Scoring guide
| Score | Verdict |
|---|---|
| 54–60 | Excellent — you are exam ready |
| 45–53 | Good — revise the topics you missed |
| 35–44 | Fair — re-read notes 07, 08 and 09 carefully |
| < 35 | Go back through notes 01–10 topic by topic |

---

## Last-Minute Formula & Fact Sheet

**Metrics**
- Accuracy = (TP+TN)/(TP+TN+FP+FN)
- Precision = TP/(TP+FP) · Recall/TPR = TP/(TP+FN) · FPR = FP/(FP+TN)
- F1 = 2·P·R/(P+R) · Specificity = TN/(TN+FP)
- IQR = Q3 − Q1; outliers beyond Q1−1.5·IQR and Q3+1.5·IQR; |Z| > 3

**Pairs to never confuse**
| | |
|---|---|
| Bias → **underfitting** | Variance → **overfitting** |
| Bagging → **parallel, with replacement, reduces variance** | Boosting → **sequential, without replacement, reduces bias** |
| Generative → **P(X\|Y), P(Y)**, Naive Bayes | Discriminative → **P(Y\|X)**, SVM/DT/kNN/NN |
| Parametric → **fixed params**, LinReg/NB | Non-parametric → **growing params**, kNN/DT/SVM |
| Ridge (L2) → **shrinks, never zero** | Lasso (L1) → **can zero out → feature selection** |
| PCA → **variance** | ICA → **independence** |
| ROC → **TPR vs FPR**, insensitive to class skew | P-R → **Precision vs Recall**, good for many negatives |
| Label encoding → **implies false order** | One-hot → **binary columns, no order** |
| Feature Selection → **keeps originals** | Feature Extraction → **new derived (PCA/ICA)** |

**Census Income accuracy ranking:** AdaBoost 0.864 > Bagging 0.852 > Random Forest 0.851 > Linear SVM 0.787 > Logistic Regression 0.786 > Naive Bayes 0.785 > Polynomial SVM 0.583
