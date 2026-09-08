# 03 — Supervised Learning: Regression & Classification

> Source: `Supervised_Learning.pdf`

---

## 1. What is Supervised Learning?

> **Definition:** Supervised learning is a type of machine learning where the model learns a **mapping function `f: X → Y`** from a **labelled** training dataset — a dataset in which every input (X) is paired with a known, correct output (Y). Once trained, the model uses this learned mapping to predict the output for new, unseen inputs.

**Analogy:** learning with an answer key. You practise on questions whose answers you already know, check yourself, correct your method — then sit the real exam on questions you have never seen.

**Why "supervised"?** Because during training there is effectively a supervisor standing behind the model saying *"wrong, the answer was 75"* after every guess. In unsupervised learning nobody is standing there.

### 1.1 Key components (very MCQ-friendly)

Using a house-price dataset to make each one concrete:

| Component | Also called | Meaning | In the house example |
|---|---|---|---|
| **Features** | Independent variables (X) | The inputs used to predict | Area, bedrooms, age of building |
| **Target / Label** | Dependent variable (Y) | The known output being predicted | Price |
| **Training data** | — | The labelled (X, Y) pairs used to fit the model | 1,000 past sales with known prices |
| **Loss / Cost function** | — | Measures how far predictions are from actual values; training **minimises** it | "Predicted ₹70L, actual ₹75L → off by ₹5L" |
| **Generalization** | — | Performing well on **new, unseen** data | Correctly pricing a house sold tomorrow |

> **Independent vs dependent, plainly:** the target *depends on* the features. Price depends on area; area does not depend on price. That is the whole reason for the naming.

### 1.2 Two broad types

- **Regression** — the target is **continuous / numeric**. *House price, temperature, salary.*
- **Classification** — the target is **categorical / discrete**. *Spam vs not-spam, disease vs no disease.*

**The test:** ask *"can the answer be 73.4?"* If yes → regression. If the only allowed answers are a fixed set of labels → classification.

---

## 2. Dimensionality Reduction (introduction level)

> **Definition:** Reducing the number of input features (dimensions) while trying to preserve as much useful information as possible.

**Analogy:** summarising a 300-page book into 10 pages. You lose some detail, but if you summarise well, the important content survives — and it is far quicker to work with.

### Why do we need it? (five reasons)
1. **Curse of dimensionality** — as features grow, data becomes **sparse** and models need **exponentially more data** to generalise. *(Explained fully in note 10.)*
2. Removes **redundant / highly correlated** features that add noise rather than information. *(Height in cm and height in inches are one fact stored twice.)*
3. **Speeds up training** and cuts memory/storage.
4. Helps **reduce overfitting** by simplifying the model.
5. Makes it possible to **visualise** high-dimensional data in 2D or 3D — you cannot draw 50 dimensions, but you can draw the best 2.

### Two broad approaches (know the difference!)

| | **Feature Selection** | **Feature Extraction** |
|---|---|---|
| What it does | **Chooses a subset of the original features** | **Transforms** originals into new derived features |
| Features transformed? | **No** — kept as they are | **Yes** — new combinations |
| Result is readable? | Yes — "we kept age and salary" | Not really — "we kept 0.6×age + 0.8×salary" |
| Examples | Dropping low-importance or highly-correlated columns | **PCA**, **ICA** |

**Analogy:** *selection* is packing 3 of your 10 shirts. *Extraction* is blending all 10 into 3 brand-new garments that somehow capture the essence of your wardrobe.

---

## 3. Train / Cross-Validation / Test Split

Before training, the dataset is split so we can **fairly train, tune and evaluate**.

| Set | Purpose | Exam analogy |
|---|---|---|
| **Training set** | Fit the model's parameters (coefficients, tree splits) | The textbook you study from |
| **Validation / CV set** | **Tune hyperparameters and choose between models**, without touching the test set | Mock tests you use to fix your weak areas |
| **Test set** | **Completely held out**, used **only once at the very end** for an unbiased estimate | The real exam |

### Why three sets and not two?

Suppose you try 50 different models and pick whichever scores best on the test set. You have now **used the test set to make a decision** — so its score is no longer an honest estimate of unseen performance. You have effectively leaked the exam paper into your study. The validation set exists to absorb that contamination, keeping the test set pristine.

> **Golden rule: the test set is touched exactly once.** The moment you tune against it, your final number becomes a lie.

### k-fold Cross-Validation
The training data is split into **k parts**; the model is trained on **(k−1) parts** and validated on the **remaining part**; this is **repeated k times**, rotating the validation fold, and the scores are averaged.

*5-fold example — each row is one round, ▣ = validate, □ = train:*
```
Round 1:  ▣ □ □ □ □   → score 82%
Round 2:  □ ▣ □ □ □   → score 79%
Round 3:  □ □ ▣ □ □   → score 84%
Round 4:  □ □ □ ▣ □   → score 81%
Round 5:  □ □ □ □ ▣   → score 79%
                         average = 81%
```

**Why bother?** A single split can be lucky or unlucky. Averaging over 5 rotations gives a far more trustworthy estimate — and **every data point gets used for both training and validation**, which matters when data is scarce.

### Typical split ratios
- **70% Train / 15% Validation / 15% Test**, or
- **80% Train / 20% Test**, with CV done *inside* the training portion.

---

# PART A — SUPERVISED REGRESSION

## 4. Linear Regression

Fits a **straight line** through the data:

```
Y = b0 + b1·X1 + b2·X2 + ... + bn·Xn
```
- `b0` = **intercept** — the predicted value when all features are 0
- `b1…bn` = **coefficients / slopes** — how much Y moves per one-unit rise in that feature

### Reading a fitted model

Suppose training gives you:
```
Price (lakh) = 5 + 0.05 × Area(sqft) + 3 × Bedrooms
```
This says in plain English: **every extra square foot adds ₹0.05 lakh, and every extra bedroom adds ₹3 lakh.** For a 1500 sq ft, 3-bedroom house:

```
Price = 5 + 0.05(1500) + 3(3) = 5 + 75 + 9 = ₹89 lakh
```

That readability is linear regression's greatest strength — you can explain it to someone who has never heard of ML.

### How does it choose the line?
By making the **total squared error as small as possible**. For each point, measure the vertical gap between the actual value and the line, square it (so positive and negative gaps cannot cancel out), and add them all up. The best line is the one with the smallest total.

### Key assumptions (5 — frequently asked)
1. **Linearity** between X and Y — the true relationship really is a line
2. **Independence of errors** — one row's error tells you nothing about the next row's
3. **Constant variance of errors** (homoscedasticity) — the spread of errors is the same for cheap and expensive houses
4. **Normally distributed residuals** — the errors form a bell curve around zero
5. **No strong multicollinearity** among predictors — the inputs are not duplicates of each other

```python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

X = np.array([[1],[2],[3],[4],[5]])   # feature
y = np.array([2, 4, 6, 8, 10])        # target — exactly y = 2x
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)        # learn slope & intercept
print("Coefficient:", model.coef_)      # ≈ 2.0  (the slope it discovered)
print("Intercept:", model.intercept_)   # ≈ 0.0
```

---

## 5. Polynomial Regression

An **extension of linear regression** for when the relationship is **curved** rather than straight.

```
Y = b0 + b1·X + b2·X² + b3·X³ + ...
```

**When you need it:** plot your data. If it bends — sales rising then plateauing, speed vs fuel efficiency — a straight line will underfit badly no matter how you tune it.

### The trick that makes it work
You don't invent a new algorithm. You **manufacture extra columns** and hand them to ordinary linear regression:

| X | → becomes → | X | X² |
|---|---|---|---|
| 2 | | 2 | 4 |
| 3 | | 3 | 9 |
| 4 | | 4 | 16 |

The model is still *linear in its coefficients* — it just now has a curved shape in terms of X.

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import make_pipeline

poly_model = make_pipeline(PolynomialFeatures(degree=2), LinearRegression())
poly_model.fit(X, y)          # y = [1, 4, 9, 16, 25] — a perfect X² curve
predictions = poly_model.predict(X)
```

> **Minute code change (noted in the slides):** the only real change from plain Linear Regression is wrapping the model with **`PolynomialFeatures(degree=n)`** in a pipeline — `fit()`, `predict()` and the workflow stay exactly the same.

> **Danger:** raising the degree too far makes the curve wiggle through every training point exactly — textbook **overfitting**. Degree 2 or 3 is usually plenty; degree 15 will fit your training data perfectly and predict garbage.

---

## 6. KNN Regression

> **Idea:** find the **K closest data points (neighbours)** to a new input and predict the **average (or weighted average)** of their target values.

**Analogy:** you want to price your flat. You don't build a mathematical theory of real estate — you look at the **3 most similar flats** in your building and take their average price. That is KNN.

### How it works — 4 steps
1. **Choose K** (the number of neighbours).
2. **Calculate the distance** between the new point and all training points (commonly **Euclidean distance**).
3. **Select the K nearest** neighbours.
4. **Compute the prediction:**
   - **Simple average** of the neighbours' target values, or
   - **Weighted average**, where closer neighbours have greater influence.

### Fully worked example

Training data — flat size vs price:

| Size (sqft) | Price (lakh) |
|---|---|
| 1000 | 50 |
| 1100 | 55 |
| 1200 | 62 |
| 2000 | 95 |
| 2100 | 99 |

**Predict the price of a 1150 sqft flat with K = 3.**

*Step 1 — distances:*

| Size | \|1150 − size\| |
|---|---|
| 1000 | 150 |
| 1100 | **50** ← nearest |
| 1200 | **50** ← nearest |
| 2000 | 850 |
| 2100 | 950 |

*Step 2 — the 3 nearest are 1100 (50), 1200 (50), 1000 (150).*

*Step 3 — average their prices:*
```
(55 + 62 + 50) / 3 = 55.67
```
**Predicted price ≈ ₹55.67 lakh.** Sensible — it sits between the 1100 and 1200 sqft flats.

### The code workflow (5 steps)
- **Step 1:** split into training and test sets
- **Step 2:** create the regressor — `n_neighbors=3` means the prediction is the average of the **3 nearest** neighbours' targets
- **Step 3:** fit — **KNN is a "lazy learner"**: `fit()` just **stores the training data**; **no weights/coefficients are learned**
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

> **"Lazy learner"** = does no real work at training time; **all** the computation happens at prediction time. Training is instant, prediction is slow — the exact opposite of most algorithms.

### Choosing K
- **K too small (K=1):** the prediction copies a single neighbour, so one noisy point misleads you → **high variance / overfitting**
- **K too large (K=N):** you average nearly the whole dataset, so every prediction is roughly the overall mean → **high bias / underfitting**
- **Distance matters, so scale your features first** — otherwise salary in rupees drowns out age in years (see note 02)

---

## 7. Multicollinearity

> **Definition:** Multicollinearity occurs when **two or more independent variables are highly correlated with each other.**

**Concrete example:** you predict salary from `years_of_experience` and `months_of_experience`. These two columns say the *identical* thing. The model must split the credit between them, and there are infinitely many ways to do it:

```
Salary = 5 × years + 0 × months      ✓ fits
Salary = 0 × years + 0.42 × months   ✓ fits equally well
Salary = 50 × years − 3.75 × months  ✓ also fits!
```

That third one claims **more months of experience reduces your salary** — nonsense, yet mathematically valid.

**Effects (as stated in the slides):**
- Makes it difficult for the model to **isolate the individual effect** of each predictor.
- Causes the estimated **coefficients to become unstable and hard to interpret** — small changes in the data cause **large swings in coefficient values**.

> **Important nuance:** multicollinearity mainly damages **interpretability**, not necessarily prediction accuracy. If you only need good predictions, it may not hurt much. If you need to explain *which factor matters*, it is fatal.

**How to spot it:** a correlation heat map (note 02) — look for pairs near +1 or −1.

---

## 8. Regularized Regression

> **Definition:** Regularization adds a **penalty term** to the loss function to discourage the model from assigning **very large weights** to any feature.

**Why large weights are a warning sign:** a coefficient of 50,000 means a tiny change in that feature swings the prediction enormously. That is a model contorting itself to pass through every training point — overfitting.

**The mechanic:** normally training minimises just the error. Regularization changes the objective to:

```
minimise:   (prediction error)  +  λ × (penalty on the size of the weights)
```

The model must now **earn** every large coefficient by reducing error enough to justify the penalty. It **reduces overfitting** and helps handle **multicollinearity**, at the cost of **introducing a small amount of bias.**

### 8.1 Ridge Regression (L2 regularization)
- Penalty = **λ × (sum of squared coefficients)**
- **Shrinks coefficients towards zero but NEVER exactly to zero**
- **All features are retained**, just with reduced influence
- Useful when **many features are relevant but correlated**

### 8.2 Lasso Regression (L1 regularization)
- Penalty = **λ × (sum of absolute values of coefficients)**
- **Can shrink some coefficients exactly to zero**
- Therefore performs **automatic feature selection**

### Seeing the difference

Start with 4 features and these fitted coefficients, then apply each penalty:

| Feature | Plain regression | After **Ridge** | After **Lasso** |
|---|---|---|---|
| Area | 40.0 | 22.0 | 25.0 |
| Bedrooms | 15.0 | 9.0 | 8.0 |
| Distance to metro | 0.8 | 0.4 | **0.0 ← dropped** |
| Owner's lucky number | 2.1 | 0.9 | **0.0 ← dropped** |

**Ridge shrank everything; Lasso deleted the useless features entirely.** That is the whole difference, and it is the most-asked comparison in this topic.

### 8.3 The λ (lambda) hyperparameter
- λ controls the **strength of the penalty**
- **λ = 0** → no penalty at all → **plain linear regression**
- **λ very large** → coefficients forced **close to (or exactly) zero** → the model underfits, predicting nearly a flat line

| | Ridge (L2) | Lasso (L1) |
|---|---|---|
| Penalty | Sum of **squared** coefficients | Sum of **absolute** coefficients |
| Coefficients → exactly 0? | **No** | **Yes** |
| Feature selection? | No | **Yes (automatic)** |
| Use when | All features matter somewhat | You suspect many features are useless |

---

## 9. Support Vector Regression (SVR)

> SVR is the **regression version of the SVM** algorithm.

**The change in philosophy:** ordinary linear regression tries to reduce the error of **every single point**, so one distant outlier tugs the whole line towards itself. SVR instead says: *"get most points within an acceptable margin, and stop fussing."*

- SVR fits a function such that **most data points fall within a margin (epsilon, ε)** around the predicted line — picture a **tube** or **road** drawn around the line.
- Points **inside the ε-tube contribute ZERO loss** — this is the **epsilon-insensitive loss**. Close enough is genuinely good enough.
- Only points **outside the tube** — the **support vectors** — influence the final model.
- SVR can use **kernels (linear, polynomial, RBF)** to model non-linear relationships.

```
       ╱ ← upper edge of tube
     ╱  ·   ·      ← points inside: cost NOTHING
   ╱ ·   ·  ·
 ╱   ·  ·          ← the fitted line
        ╱  ·
      ╱ ← lower edge
   ·                ← point outside: this one pulls on the model
```

**Practical benefit:** because most points cost nothing, SVR is **far more robust to small noise** than ordinary least squares.

---

# PART B — SUPERVISED CLASSIFICATION

## 10. KNN Classifier

> Predicts the class of a new point by looking at the **k closest points** and assigning the **majority class** among them (a **vote**), instead of averaging numbers.

**Analogy:** judge a person by the company they keep. Ask the 5 nearest people what class they belong to; whichever answer appears most often wins.

### Worked example

Predict whether a new customer buys, with **K = 5**. The five nearest customers are:

```
Bought,  Bought,  Not-bought,  Bought,  Not-bought
```
Tally: **Bought = 3, Not-bought = 2 → predict BOUGHT.**

> **Tip:** choose an **odd K for two-class problems** so a vote can never tie 2–2.

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

knn_clf = KNeighborsClassifier(n_neighbors=3)
knn_clf.fit(X_train, y_train)
predictions = knn_clf.predict(X_test)
print("Accuracy:", accuracy_score(y_test, predictions))
```

### KNN Regression vs KNN Classifier (table straight from the slides)

Both use the **exact same core idea** — find the k nearest points using a distance metric (usually **Euclidean**). The difference is entirely in **what is done with those neighbours**:

| Aspect | **KNN Regression** | **KNN Classifier** |
|---|---|---|
| Target variable | Continuous / numeric | Categorical / discrete class |
| Aggregation of neighbours | **Average** (or weighted average) of targets | **Majority vote** among class labels |
| Output | A number (e.g. 5.7) | A label (e.g. 'spam') |
| sklearn class | `KNeighborsRegressor` | `KNeighborsClassifier` |
| Evaluation metric | MSE, RMSE, R² | Accuracy, Precision, Recall, F1-score |

> **One algorithm, two endings: average the neighbours → regression; vote among them → classification.**

---

## 11. Decision Trees

> **Definition:** A decision tree **splits the dataset repeatedly based on feature values**, forming a **tree of if-else decision rules**, until it reaches **leaf nodes** that give the final prediction.

**Analogy:** the game "20 Questions", or a doctor's diagnosis flow: *Fever? → yes. Cough? → no. Rash? → yes. → likely measles.* Each question narrows the possibilities.

### A tree you can read

```
                    Is Age > 30 ?
                    /          \
                 No            Yes
                 /               \
        Predict: NO BUY      Salary > 60000 ?
                              /          \
                            No           Yes
                            /              \
                   Predict: NO BUY     Predict: BUY
```

To classify a 45-year-old earning ₹80,000: Age > 30 → **yes**, Salary > 60000 → **yes** → **BUY**. Three seconds, no mathematics, and you can explain the decision to a customer.

### How does it choose each split?
At each node the algorithm **chooses the feature and threshold that best separates the classes** — it tries every candidate split and keeps whichever produces the **purest** child groups.

**"Purity" made concrete.** A group of 10 with 5 BUY and 5 NO-BUY is maximally impure (a coin flip). A group of 10 that is all BUY is perfectly pure. **Gini impurity** measures this:

```
Gini = 1 − (proportion of class A)² − (proportion of class B)²

50/50 split →  1 − 0.5² − 0.5²  = 0.50   ← worst possible
90/10 split →  1 − 0.9² − 0.1²  = 0.18   ← much better
100/0 split →  1 − 1²   − 0²    = 0.00   ← perfect, this becomes a leaf
```

The tree greedily picks the split that drives Gini down the most, then repeats on each child.

### Why / when do we use them?
- **Easy to interpret and visualise** — you can literally draw the decision
- Handle **both numeric and categorical** features
- Require **little data preprocessing** — notably **no feature scaling needed**, because a tree only asks "is this value above the threshold?", and that answer does not change if you rescale

### Main drawback
- A strong **tendency to overfit if grown too deep.** Left unchecked, a tree keeps splitting until each leaf holds a single training example — memorising the data instead of learning from it.
- Fixes: limit with **`max_depth`**, or combine many trees into **ensembles like Random Forests** (note 07).

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

*Reading the output:* `feature_importances_` of `[0.7, 0.3]` means the first feature drove 70% of the useful splitting — a free, built-in ranking of which inputs actually matter.

---

## 12. One-Page Cheat Sheet

| Algorithm | Task | Core idea in one line | Key parameter |
|---|---|---|---|
| Linear Regression | Regression | Best straight line | — |
| Polynomial Regression | Regression | Add X², X³ columns, then fit a line | `degree` |
| Ridge | Regression | Line + penalty; shrinks weights | `λ` (alpha) |
| Lasso | Regression | Line + penalty; zeroes weak weights | `λ` (alpha) |
| KNN Regressor | Regression | Average of the k nearest neighbours | `n_neighbors` |
| SVR | Regression | Tolerance tube; ignore points inside | `epsilon`, `kernel` |
| KNN Classifier | Classification | Majority vote of the k nearest | `n_neighbors` |
| Decision Tree | Both | Learned if-else flowchart | `max_depth`, `criterion` |

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
