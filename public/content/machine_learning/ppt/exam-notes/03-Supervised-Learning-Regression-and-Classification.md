# 03 — Supervised Learning: Regression & Classification

> Source: `Supervised_Learning.pdf`

---

## 1. What is Supervised Learning?

> **Definition:** Supervised learning is a type of machine learning where the model learns a **mapping function `f: X → Y`** from a **labelled** training dataset — a dataset in which every input (X) is paired with a known, correct output (Y). Once trained, the model uses this learned mapping to predict the output for new, unseen inputs.

**Analogy:** It's like learning with an answer key. You practise on questions whose answers you already know, then you sit the real exam.

### 1.1 Key components (very MCQ-friendly)

| Component | Also called | Meaning |
|---|---|---|
| **Features** | Independent variables (X) | The input variables used to make a prediction |
| **Target / Label** | Dependent variable (Y) | The known output the model tries to predict |
| **Training data** | — | The labelled (X, Y) pairs used to fit the model's parameters |
| **Loss / Cost function** | — | Measures how far predictions are from actual values; the model is trained to **minimise** it |
| **Generalization** | — | The ability to perform well on **new, unseen data**, not just the training data |

### 1.2 Two broad types

- **Regression** — the target variable is **continuous / numeric**.
  *e.g.* house price, temperature, salary.
- **Classification** — the target variable is **categorical / discrete**.
  *e.g.* spam vs not-spam, disease vs no disease.

---

## 2. Dimensionality Reduction (introduction level)

> **Definition:** Reducing the number of input features (dimensions) in a dataset while trying to preserve as much useful/important information as possible.

### Why do we need it? (five reasons)
1. **Curse of dimensionality** — as features grow, data becomes **sparse** and models need **exponentially more data** to generalise well.
2. Removes **redundant / highly correlated** features that add noise rather than information.
3. **Speeds up training** and reduces memory/storage requirements.
4. Helps **reduce overfitting** by simplifying the model.
5. Makes it possible to **visualise** high-dimensional data in 2D or 3D.

### Two broad approaches (know the difference!)

| | **Feature Selection** | **Feature Extraction** |
|---|---|---|
| What it does | **Chooses a subset of the original features** | **Transforms** originals into a new, smaller set of derived features |
| Features transformed? | **No** — kept as they are | **Yes** — new derived features |
| Examples | Dropping low-importance or highly-correlated features | **PCA**, **ICA** |

*(PCA and ICA are covered in detail in note 10.)*

---

## 3. Train / Cross-Validation / Test Split

Before training, the dataset is split so we can **fairly train, tune and evaluate** the model.

| Set | Purpose |
|---|---|
| **Training set** | Used to actually **fit / learn the model's parameters** (coefficients, tree splits) |
| **Validation / CV set** | Used to **tune hyperparameters and select between models**, without touching the test set |
| **Test set** | A **completely held-out** portion used **only once, at the very end**, to get an **unbiased estimate** of real-world performance |

### k-fold Cross-Validation
The training data is split into **k parts**; the model is trained on **(k−1) parts** and validated on the **remaining part**; this is **repeated k times**, rotating the validation fold.

### Typical split ratios
- **70% Train / 15% Validation / 15% Test**, or
- **80% Train / 20% Test**, with CV done *inside* the training portion.

> **Golden rule:** The test set is touched **once**. If you tune on the test set, your accuracy estimate is no longer unbiased.

---

# PART A — SUPERVISED REGRESSION

## 4. Linear Regression

Models the relationship between one or more independent variables (X) and a **continuous** dependent variable (Y) by fitting a **straight line**:

```
Y = b0 + b1·X1 + b2·X2 + ... + bn·Xn
```
- `b0` = intercept, `b1…bn` = coefficients (slopes).

### Key assumptions (5 — frequently asked)
1. **Linearity** between X and Y
2. **Independence of errors**
3. **Constant variance of errors** (homoscedasticity)
4. **Normally distributed residuals**
5. **No strong multicollinearity** among predictors

```python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

X = np.array([[1],[2],[3],[4],[5]])   # feature
y = np.array([2, 4, 6, 8, 10])        # target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)        # learn slope & intercept
predictions = model.predict(X_test)
print("Coefficient:", model.coef_)
print("Intercept:", model.intercept_)
```

---

## 5. Polynomial Regression

An **extension of linear regression** used when the relationship between X and Y is **curved** rather than a straight line.

```
Y = b0 + b1·X + b2·X² + b3·X³ + ...
```

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline

poly_model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
poly_model.fit(X, y)
predictions = poly_model.predict(X)
```

> **Minute code change (noted in the slides):** The only real change from plain Linear Regression is wrapping the model with **`PolynomialFeatures(degree=n)`** in a pipeline — `fit()`, `predict()` and the overall workflow stay exactly the same.

> **Conceptual point:** Polynomial regression is *still a linear model* — it is linear in the **coefficients**, just not in X.

---

## 6. KNN Regression

> **Idea:** Find the **K closest data points (neighbours)** to a new input and predict the output as the **average (or weighted average)** of their target values.

### How it works — 4 steps
1. **Choose K** (the number of neighbours).
2. **Calculate the distance** between the new point and all training points (commonly **Euclidean distance**).
3. **Select the K nearest** neighbours.
4. **Compute the prediction:**
   - **Simple average** of the neighbours' target values, or
   - **Weighted average**, where closer neighbours have greater influence.

### The code workflow (5 steps)
- **Step 1:** split data into training and test sets
- **Step 2:** create the KNN regressor — `n_neighbors=3` means the prediction is based on the average of the **3 nearest** neighbours' target values
- **Step 3:** fit the model — **KNN is a "lazy learner"**: `fit()` just **stores the training data**; **no weights/coefficients are learned** at this stage
- **Step 4:** predict — for each test point the model (a) computes distance (default Euclidean) to **every** training point, (b) picks the 3 closest, (c) returns the **average** of their y values
- **Step 5 (optional):** evaluate with a regression metric

```python
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_squared_error

knn_reg = KNeighborsRegressor(n_neighbors=3)
knn_reg.fit(X_train, y_train)
predictions = knn_reg.predict(X_test)
print("MSE:", mean_squared_error(y_test, predictions))
```

> **Remember:** "**Lazy learner**" = does no real work at training time; all the computation happens at prediction time.

---

## 7. Multicollinearity

> **Definition:** Multicollinearity occurs when **two or more independent variables** in a regression model are **highly correlated with each other**.

**Effects:**
- Makes it difficult for the model to **isolate the individual effect** of each predictor on the target.
- Causes the estimated **coefficients to become unstable and hard to interpret** — small changes in the data can cause **large swings in coefficient values**.

---

## 8. Regularized Regression

> **Definition:** Regularization adds a **penalty term** to the linear regression loss function to discourage the model from assigning **very large weights** to any feature.

**Result:** It **reduces overfitting** and helps handle **multicollinearity**, at the cost of **introducing a small amount of bias**.

### 8.1 Ridge Regression (L2 regularization)
- Penalty = **λ × (sum of squared coefficients)**
- **Shrinks coefficients towards zero but NEVER exactly to zero**
- So **all features are retained**, just with reduced influence
- Useful when **many features are relevant but correlated**

### 8.2 Lasso Regression (L1 regularization)
- Penalty = **λ × (sum of absolute values of coefficients)**
- **Can shrink some coefficients exactly to zero**
- Therefore performs **automatic feature selection**

### 8.3 The λ (lambda) hyperparameter
- λ controls the **strength of the penalty**.
- **λ = 0** → reduces to **plain linear regression**.
- **Very large λ** → forces coefficients **close to (or exactly) zero**.

| | Ridge (L2) | Lasso (L1) |
|---|---|---|
| Penalty | Sum of **squared** coefficients | Sum of **absolute** coefficients |
| Coefficients → exactly 0? | **No** | **Yes** |
| Feature selection? | No | **Yes (automatic)** |

---

## 9. Support Vector Regression (SVR)

> SVR is the **regression version of the SVM** algorithm.

- Instead of minimising the error for **every single point**, SVR fits a function such that **most data points fall within a margin (epsilon, ε)** around the predicted line/curve.
- Points **inside the ε-tube contribute ZERO loss** — this is called the **epsilon-insensitive loss**.
- Only points **outside the tube** (the **support vectors**) influence the final model.
- SVR can use **kernels (linear, polynomial, RBF)** to model non-linear relationships.

---

# PART B — SUPERVISED CLASSIFICATION

## 10. KNN Classifier

> Predicts the class label of a new point by looking at the **k closest points** in the training data and assigning the **majority class** among them (a **vote**), instead of averaging numeric values.

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

knn_clf = KNeighborsClassifier(n_neighbors=3)
knn_clf.fit(X_train, y_train)
predictions = knn_clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, predictions))
```

### KNN Regression vs KNN Classifier (table straight from the slides)

Both use the **exact same core idea** — find the k nearest points using a distance metric (usually **Euclidean**). The difference is entirely in **what is done with those neighbours** and **what type of output** is produced.

| Aspect | **KNN Regression** | **KNN Classifier** |
|---|---|---|
| Target variable | Continuous / numeric | Categorical / discrete class |
| Aggregation of neighbours | **Average** (or weighted average) of neighbours' target values | **Majority vote** among neighbours' class labels |
| Output | A predicted number (e.g. 5.7) | A predicted class label (e.g. 'spam') |
| sklearn class | `KNeighborsRegressor` | `KNeighborsClassifier` |
| Evaluation metric | MSE, RMSE, R² | Accuracy, Precision, Recall, F1-score |

---

## 11. Decision Trees

> **Definition:** A decision tree **splits the dataset repeatedly based on feature values**, forming a **tree of if-else decision rules**, until it reaches **'leaf' nodes** that give the final prediction.

- At each split, the algorithm **chooses the feature and threshold that best separates the classes**.

### Why / when do we use them?
- **Easy to interpret and visualise**
- Handle **both numeric and categorical** features
- Require **little data preprocessing** — notably **no feature scaling needed**

### Main drawback
- A strong **tendency to overfit if grown too deep**.
- Fixes: limit with **`max_depth`**, or combine into **ensembles like Random Forests**.

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# max_depth limits how deep the tree can grow, to reduce overfitting
tree_clf = DecisionTreeClassifier(max_depth=3, criterion="gini", random_state=42)
tree_clf.fit(X_train, y_train)
predictions = tree_clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, predictions))
# shows which feature the tree relied on most
print("Feature importances:", tree_clf.feature_importances_)
```

---

## 12. One-Page Cheat Sheet

| Algorithm | Task | Core idea | Key parameter |
|---|---|---|---|
| Linear Regression | Regression | Fit a straight line | — |
| Polynomial Regression | Regression | Fit a curve via X, X², X³ | `degree` |
| Ridge | Regression | L2 penalty, shrinks coefficients | `λ` (alpha) |
| Lasso | Regression | L1 penalty, zeroes coefficients | `λ` (alpha) |
| KNN Regressor | Regression | Average of k neighbours | `n_neighbors` |
| SVR | Regression | ε-tube, epsilon-insensitive loss | `epsilon`, `kernel` |
| KNN Classifier | Classification | Majority vote of k neighbours | `n_neighbors` |
| Decision Tree | Classification/Regression | If-else splits | `max_depth`, `criterion` |

---

# MCQ Practice — Supervised Learning

**Q1.** Supervised learning learns a mapping function of the form:
- A) f: Y → X
- B) f: X → Y
- C) f: X → X
- D) No mapping is learnt

**Q2.** In supervised learning, the input variables are called:
- A) Labels
- B) Targets
- C) Features / independent variables
- D) Residuals

**Q3.** The function that measures how far predictions are from actual values is the:
- A) Activation function
- B) Loss / cost function
- C) Kernel function
- D) Sigmoid function

**Q4.** The ability of a model to perform well on new, unseen data is called:
- A) Memorization
- B) Generalization
- C) Regularization
- D) Optimization

**Q5.** Which is a regression problem?
- A) Spam vs not-spam
- B) Disease vs no disease
- C) Predicting salary
- D) Predicting digit 0–9

**Q6.** Feature Selection differs from Feature Extraction because Feature Selection:
- A) Transforms features into new derived features
- B) Chooses a subset of the original features without transforming them
- C) Always uses PCA
- D) Increases dimensionality

**Q7.** PCA and ICA are examples of:
- A) Feature Selection
- B) Feature Extraction
- C) Classification
- D) Regularization

**Q8.** The test set should be used:
- A) For tuning hyperparameters
- B) Repeatedly during training
- C) Only once, at the very end, for an unbiased estimate
- D) To fit model parameters

**Q9.** In k-fold cross-validation, the model is trained on:
- A) 1 fold and validated on k−1
- B) k−1 folds and validated on the remaining fold
- C) All k folds
- D) A random half

**Q10.** Which is NOT an assumption of linear regression?
- A) Linearity between X and Y
- B) Homoscedasticity (constant error variance)
- C) Strong multicollinearity among predictors
- D) Normally distributed residuals

**Q11.** Polynomial regression is used when:
- A) The target is categorical
- B) The relationship between X and Y is curved
- C) There is no data
- D) All features are binary

**Q12.** In sklearn, polynomial regression is achieved by wrapping LinearRegression with:
- A) StandardScaler
- B) PolynomialFeatures(degree=n)
- C) LabelEncoder
- D) PCA

**Q13.** KNN is called a "lazy learner" because:
- A) It is slow to predict
- B) `fit()` just stores the training data; no weights are learned
- C) It ignores distant points
- D) It always underfits

**Q14.** The default distance metric used by KNN is:
- A) Manhattan
- B) Cosine
- C) Euclidean
- D) Hamming

**Q15.** KNN **Regression** produces its prediction by:
- A) Majority vote of neighbours
- B) Average of neighbours' target values
- C) Fitting a line
- D) Splitting on features

**Q16.** KNN **Classifier** produces its prediction by:
- A) Average of neighbours' targets
- B) Majority vote among neighbours' class labels
- C) Minimising squared error
- D) Computing eigenvectors

**Q17.** Multicollinearity means:
- A) The target has many classes
- B) Two or more independent variables are highly correlated with each other
- C) The dataset is large
- D) Errors are correlated with time

**Q18.** A consequence of multicollinearity is:
- A) Coefficients become unstable and hard to interpret
- B) The model always underfits
- C) Accuracy becomes 100%
- D) The target becomes categorical

**Q19.** Ridge regression uses a penalty equal to λ ×:
- A) Sum of absolute coefficients
- B) Sum of squared coefficients
- C) Number of features
- D) Sum of residuals

**Q20.** Lasso regression is preferred when you want:
- A) All features retained
- B) Automatic feature selection (some coefficients exactly zero)
- C) A polynomial fit
- D) A larger λ always

**Q21.** Which regularization can shrink coefficients to *exactly* zero?
- A) Ridge (L2)
- B) Lasso (L1)
- C) Both
- D) Neither

**Q22.** If λ = 0 in a regularized regression, the model becomes:
- A) A constant predictor
- B) Plain linear regression
- C) A decision tree
- D) Undefined

**Q23.** Regularization reduces overfitting at the cost of:
- A) Introducing a small amount of bias
- B) Removing all data
- C) Increasing variance
- D) Making the model non-linear

**Q24.** In SVR, points that fall inside the ε-tube contribute:
- A) The largest loss
- B) Zero loss
- C) Negative loss
- D) Half the loss

**Q25.** The loss function used by SVR is called:
- A) Hinge loss
- B) Epsilon-insensitive loss
- C) Cross-entropy loss
- D) Gini loss

**Q26.** Which points influence the final SVR model?
- A) All points equally
- B) Only points inside the tube
- C) Only points outside the tube (support vectors)
- D) Only the mean point

**Q27.** A decision tree reaches its final prediction at:
- A) The root node
- B) Internal nodes
- C) Leaf nodes
- D) The branches

**Q28.** Which preprocessing step is NOT required for decision trees?
- A) Handling missing values
- B) Feature scaling
- C) Encoding for some implementations
- D) Splitting into train/test

**Q29.** The main drawback of decision trees is:
- A) They cannot handle numeric data
- B) They tend to overfit if grown too deep
- C) They need feature scaling
- D) They are impossible to visualise

**Q30.** `tree_clf.feature_importances_` tells you:
- A) The tree's depth
- B) Which feature the tree relied on most
- C) The accuracy
- D) The number of leaves

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Inputs map to outputs. |
| 2 | **C** | Features = independent variables. |
| 3 | **B** | Loss/cost function; minimised during training. |
| 4 | **B** | Definition of generalization. |
| 5 | **C** | Salary is continuous. |
| 6 | **B** | Selection keeps originals; extraction transforms. |
| 7 | **B** | Both produce new derived features. |
| 8 | **C** | Only once, for an unbiased estimate. |
| 9 | **B** | Train on k−1, validate on 1, repeat k times. |
| 10 | **C** | Linear regression assumes **no** strong multicollinearity. |
| 11 | **B** | Curved relationships. |
| 12 | **B** | `make_pipeline(PolynomialFeatures(degree=2), LinearRegression())`. |
| 13 | **B** | No learning at fit time. |
| 14 | **C** | Euclidean is the default. |
| 15 | **B** | Average → a number. |
| 16 | **B** | Vote → a class. |
| 17 | **B** | Correlation *among predictors*. |
| 18 | **A** | Unstable, hard-to-interpret coefficients. |
| 19 | **B** | L2 = squared coefficients. |
| 20 | **B** | L1 zeroes coefficients. |
| 21 | **B** | Only Lasso. |
| 22 | **B** | No penalty → ordinary least squares. |
| 23 | **A** | Classic bias-for-variance trade. |
| 24 | **B** | ε-insensitive: zero loss inside the tube. |
| 25 | **B** | Epsilon-insensitive loss. |
| 26 | **C** | Only the support vectors. |
| 27 | **C** | Leaves give the prediction. |
| 28 | **B** | Trees need no feature scaling. |
| 29 | **B** | Overfitting when too deep. |
| 30 | **B** | Relative reliance on each feature. |
