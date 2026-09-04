# Principal Component Analysis (PCA) — Complete Notes

> **Topic:** Principal Component Analysis (PCA) / Dimensionality Reduction  
> **Perspective:** Theory + Geometric Intuition + Mathematical Intuition + Scikit-learn Implementation  
> **Source basis:** Provided PCA transcripts, handwritten PCA PDF notes, and the supplied PCA implementation notebook.

---

## 1. What is PCA?

**Principal Component Analysis (PCA)** is a dimensionality-reduction technique used to transform a dataset with many original features into a smaller number of new features called **principal components**.

The central idea is:

> Find new directions (principal components) that capture as much of the data's variance as possible.

For example:

```text
Original dataset
F1, F2, F3, F4, F5, F6, F7, F8, F9, F10
                    ↓
                   PCA
                    ↓
             PC1, PC2, PC3
```

The number of dimensions has been reduced from 10 to 3, while attempting to retain as much useful variation/information as possible.

The provided notes describe PCA as both **dimensionality reduction** and **feature extraction**.

---

# 2. Why Do We Need Dimensionality Reduction?

The source material highlights three major reasons:

1. Prevent / reduce the **curse of dimensionality**
2. Improve model performance
3. Make high-dimensional data easier to visualize

---

## 2.1 Curse of Dimensionality

A **dimension** can be thought of as a feature.

Therefore:

```text
1 feature  → 1 dimension
2 features → 2 dimensions
100 features → 100 dimensions
500 features → 500 dimensions
```

Imagine a house-price dataset containing 500 features:

```text
House size
Number of bedrooms
Number of bathrooms
Lot size
Location information
...
500 features
```

You might build several models:

```text
M1 → 3 features
M2 → 6 features
M3 → 15 features
M4 → 50 features
M5 → 100 features
M6 → 500 features
```

Initially, adding useful features can improve predictive performance.

But after a point, additional features may be:

- Irrelevant
- Redundant
- Noisy
- Weakly informative
- Highly correlated with existing features

The model may start learning unnecessary patterns.

This can lead to:

```text
Useful features
      ↓
Performance improves

Too many / unnecessary features
      ↓
Overfitting + computational burden
      ↓
Performance may degrade
```

### Important clarification

The phrase **curse of dimensionality** is broader than simply "accuracy decreases when the number of features increases."

As dimensionality grows, the geometry of the feature space changes dramatically. Data becomes increasingly sparse, distance-based methods become more difficult to use effectively, and the amount of data needed to adequately represent the space can grow substantially.

The transcript mainly explains the idea through unnecessary features, overfitting, and increased mathematical computation.

---

# 3. Computational Cost of High Dimensions

Suppose a model has 100 features.

During training, the algorithm performs calculations involving those features.

Increasing the number of dimensions can therefore increase:

- Computation
- Memory usage
- Training time
- Complexity of the model

Dimensionality reduction can reduce the size of the input representation.

For example:

```text
100 features
     ↓
    PCA
     ↓
10 principal components
```

The downstream model can then work with 10 instead of 100 input dimensions.

> PCA does not guarantee that every model will become faster or more accurate. Its usefulness depends on the dataset, model, preprocessing, and the amount of information retained.

---

# 4. Visualization Problem

Humans can directly visualize:

```text
1D → easy
2D → easy
3D → possible
4D+ → cannot directly visualize
```

Suppose a dataset contains:

```text
100 features
```

A direct visualization of all 100 dimensions is impossible.

PCA can transform it into:

```text
100 dimensions
       ↓
      PCA
       ↓
2 or 3 principal components
       ↓
2D / 3D visualization
```

This makes it easier to inspect:

- Clusters
- Separation between classes
- Trends
- Outliers
- General structure

The goal is not merely to make a pretty plot; reducing dimensions can help us understand the underlying structure of the data.

---

# 5. Two Important Approaches to Dimensionality Reduction

The notes introduce two major ideas:

```text
Dimensionality Reduction
        │
        ├── Feature Selection
        │
        └── Feature Extraction
```

PCA belongs to the **feature extraction** side.

---

# 6. Feature Selection

### Definition

**Feature selection** means selecting a subset of the original features that are considered useful for the prediction task.

Suppose the original features are:

```text
F1
F2
F3
F4
F5
```

After feature selection:

```text
F1
F3
F5
```

The selected features are still the **original features**.

No new feature is mathematically created.

---

## Example: House Price

Suppose:

| Feature | Relationship with Price |
|---|---|
| House size | Strong |
| Number of bedrooms | Strong |
| Number of bathrooms | Strong |
| Fountain size | Weak |
| Random ID | None |

A feature-selection process may keep:

```text
House size
Bedrooms
Bathrooms
```

and remove:

```text
Fountain size
Random ID
```

---

# 7. Feature Selection Using Correlation

The transcript introduces covariance and Pearson correlation as ways to understand relationships between variables.

Suppose:

```text
X = input feature
Y = output
```

If X increases while Y tends to increase:

```text
X ↑ → Y ↑
```

we have a positive relationship.

If X increases while Y tends to decrease:

```text
X ↑ → Y ↓
```

we have a negative relationship.

If there is no clear relationship:

```text
X changes
      ↕
Y does not show a consistent pattern
```

---

# 8. Covariance

Covariance indicates the direction in which two variables vary together.

For sample data:

\[
\operatorname{Cov}(X,Y)
=
\frac{\sum_{i=1}^{n}(x_i-\bar{x})(y_i-\bar{y})}{n-1}
\]

where:

- \(x_i\) = ith value of X
- \(y_i\) = ith value of Y
- \(\bar{x}\) = mean of X
- \(\bar{y}\) = mean of Y
- \(n\) = number of observations

### Interpretation

```text
Covariance > 0
    ↓
Positive relationship

Covariance < 0
    ↓
Negative relationship

Covariance ≈ 0
    ↓
Little/no linear relationship
```

### Important limitation

Covariance depends on the scale of the variables.

For example:

```text
X = height in meters
X = height in centimeters
```

Changing the units changes covariance.

Therefore, covariance is not as convenient as correlation for comparing the strength of relationships across different variables.

---

# 9. Pearson Correlation

Pearson correlation standardizes covariance.

\[
r_{XY}
=
\frac{\operatorname{Cov}(X,Y)}
{\sigma_X\sigma_Y}
\]

where:

- \(\sigma_X\) = standard deviation of X
- \(\sigma_Y\) = standard deviation of Y

The value lies between:

\[
-1 \le r \le 1
\]

### Interpretation

| Correlation | Meaning |
|---:|---|
| Close to +1 | Strong positive linear relationship |
| Close to -1 | Strong negative linear relationship |
| Close to 0 | Weak/no linear relationship |

Example:

```text
r = +0.95 → strong positive linear relationship
r = -0.90 → strong negative linear relationship
r = +0.03 → very weak linear relationship
```

### Important

A correlation near zero means **little linear relationship**, not necessarily "no relationship of any kind."

A nonlinear relationship can exist even when Pearson correlation is near zero.

---

# 10. Feature Selection vs Feature Extraction

This distinction is extremely important.

| Feature Selection | Feature Extraction |
|---|---|
| Selects existing features | Creates new features |
| Original features remain unchanged | New transformed features are produced |
| May remove irrelevant/redundant features | Combines/transforms information from original features |
| Example: keep F1, F4, F7 | Example: create PC1, PC2 |
| PCA is not feature selection | PCA is a feature-extraction technique |

### Example

Original:

```text
X1 = House Size
X2 = Number of Rooms
```

Feature selection:

```text
Keep X1
Remove X2
```

Feature extraction:

```text
X1 + X2
   ↓
Transformation
   ↓
PC1
```

PC1 is a **new feature**, not simply one of the original columns.

---

# 11. Why Feature Selection May Not Be Enough

Suppose we have:

```text
X1 = House Size
X2 = Number of Rooms
```

Both may be useful for predicting house price.

If we want to reduce:

```text
2 dimensions → 1 dimension
```

feature selection forces us to choose either:

```text
X1
```

or

```text
X2
```

This can throw away useful information.

PCA takes a different approach:

```text
X1 + X2
   ↓
Transformation
   ↓
New feature: PC1
```

The goal is to retain as much variance as possible in the reduced representation.

---

# 12. PCA: Geometric Intuition

Consider two features:

```text
X = House Size
Y = Number of Rooms
```

Suppose the data looks approximately like:

```text
Y
│
│             •
│          •
│       •
│    •
│  •
│ •
└────────────────── X
```

There is a strong relationship between house size and number of rooms.

Instead of keeping both X and Y, suppose we want:

```text
2D → 1D
```

---

# 13. Naive Projection

One simple approach is to project every point onto the original X-axis.

Conceptually:

```text
Original:

       •
      /
     •
    /
   •
  /
──────────────── X
```

After projection:

```text
•   •     •      •
──────────────────── X
```

We successfully reduced the data from 2D to 1D.

But there is a problem.

Information related to the Y direction has been discarded.

---

# 14. Spread and Variance

The notes connect the **spread of the projected data** with variance.

Intuitively:

```text
More spread
    ↓
Higher variance

Less spread
    ↓
Lower variance
```

Variance measures how much observations vary around their mean.

For a population:

\[
\operatorname{Var}(X)
=
\frac{1}{n}\sum_{i=1}^{n}(x_i-\bar{x})^2
\]

For a sample:

\[
s^2
=
\frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2
\]

---

# 15. The Core Idea of PCA

Instead of projecting onto an arbitrary original axis, PCA searches for a **new direction** where the projected data has maximum variance.

Conceptually:

```text
              •
           •
        •
     •
  •
 /  ← New direction
────────────────
```

The new axis is selected so that the projected observations retain maximum spread/variance.

This new direction is called:

> **Principal Component 1 (PC1)**

---

# 16. Principal Components

Principal components are new axes/features obtained through a transformation of the original feature space.

For two original features:

```text
Original:
X1
X2

After PCA:
PC1
PC2
```

The components are ordered by the amount of variance they capture:

\[
\operatorname{Var}(PC1)
>
\operatorname{Var}(PC2)
\]

For three components:

\[
\operatorname{Var}(PC1)
>
\operatorname{Var}(PC2)
>
\operatorname{Var}(PC3)
\]

More generally:

```text
PC1 → maximum variance
PC2 → next maximum variance
PC3 → next maximum variance
...
```

---

# 17. PC1 and PC2 Are Orthogonal

PCA produces mutually orthogonal principal directions.

For two-dimensional data:

```text
             PC2
              ↑
              │
              │
              │
              └────────────→ PC1
```

PC1 captures the maximum possible variance.

PC2 captures the maximum remaining variance subject to being orthogonal to PC1.

---

# 18. Why PCA Is Better Than Simply Dropping a Feature

Suppose:

```text
X1 = House Size
X2 = Number of Rooms
```

Both contain useful information.

Simply keeping X1:

```text
X1 → retained
X2 → discarded
```

may lose useful information.

PCA instead constructs:

```text
PC1 = weighted combination of X1 and X2
```

Conceptually:

\[
PC1 = w_1X_1+w_2X_2
\]

where \(w_1,w_2\) are coefficients determined by PCA.

This allows information from both original variables to contribute to the reduced feature.

---

# 19. PCA Is a Transformation

PCA does not merely delete columns.

It transforms the original coordinate system.

For example:

```text
Original axes

X1 ─────────────→
     |
     |
     ↑ X2
```

After transformation:

```text
          PC2
           ↑
           │
           │
           └────────────→ PC1
```

The data is represented in a new coordinate system.

Then we can keep only the first few principal components.

---

# 20. Mathematical Intuition: Projection

The transcript introduces projection as a key part of PCA.

Let a point be represented by vector:

\[
p=
\begin{bmatrix}
x\\
y
\end{bmatrix}
\]

Let \(u\) be a **unit vector** representing a candidate principal direction.

The scalar projection of \(p\) onto \(u\) is:

\[
p\cdot u
\]

because:

\[
\|u\|=1
\]

More generally, the vector projection is:

\[
\operatorname{proj}_{u}(p)
=
\frac{p\cdot u}{u\cdot u}u
\]

For a unit vector:

\[
\operatorname{proj}_{u}(p)
=
(p\cdot u)u
\]

The scalar value \(p\cdot u\) represents the coordinate of the point along the candidate direction.

---

# 21. Why Projection Is Important

Suppose we project every data point onto a candidate direction:

```text
P1 → P1'
P2 → P2'
P3 → P3'
...
Pn → Pn'
```

Now the projected points are represented along one dimension.

We can calculate their variance.

PCA asks:

> Which direction produces the largest variance among the projected points?

Therefore:

```text
Candidate direction
       ↓
Project all points
       ↓
Calculate projected variance
       ↓
Compare directions
       ↓
Choose maximum
       ↓
PC1
```

---

# 22. PCA Cost / Objective Intuition

The mathematical objective can be expressed as:

\[
\boxed{\max_u \operatorname{Var}(Xu)}
\]

subject to:

\[
\|u\|=1
\]

In words:

> Find the unit direction \(u\) such that the variance of the projected data is maximum.

This is the central optimization idea behind PCA.

---

# 23. Why Eigenvectors and Eigenvalues Appear

The notes introduce **eigen decomposition of the covariance matrix** as the mathematical mechanism used to find the principal directions.

For a matrix \(A\):

\[
Av=\lambda v
\]

where:

- \(A\) = matrix
- \(v\) = eigenvector
- \(\lambda\) = eigenvalue

The eigenvector represents a special direction that does not change direction under the transformation represented by \(A\); its magnitude is scaled by the eigenvalue.

For PCA, the important matrix is the **covariance matrix**.

---

# 24. Important Clarification About Eigenvalues

The transcript informally describes the eigenvalue as the "magnitude of the eigenvector."

A more precise statement is:

> **For PCA, the eigenvalue associated with an eigenvector tells us how much variance is captured along that principal direction.**

Eigenvectors are normally normalized to unit length, so their magnitude is not what determines the principal component.

Therefore:

```text
Larger eigenvalue
      ↓
More variance captured
      ↓
More important principal direction
```

---

# 25. Covariance Matrix

Suppose we have two features:

```text
X
Y
```

The covariance matrix is:

\[
\Sigma=
\begin{bmatrix}
\operatorname{Var}(X) & \operatorname{Cov}(X,Y)\\
\operatorname{Cov}(Y,X) & \operatorname{Var}(Y)
\end{bmatrix}
\]

Since:

\[
\operatorname{Cov}(X,Y)
=
\operatorname{Cov}(Y,X)
\]

the covariance matrix is symmetric.

For three features:

```text
X, Y, Z
```

we get:

\[
\Sigma=
\begin{bmatrix}
Var(X) & Cov(X,Y) & Cov(X,Z)\\
Cov(Y,X) & Var(Y) & Cov(Y,Z)\\
Cov(Z,X) & Cov(Z,Y) & Var(Z)
\end{bmatrix}
\]

---

# 26. PCA Mathematical Pipeline

A simplified PCA pipeline is:

```text
Original Data
     ↓
Center / Standardize
     ↓
Compute Covariance Matrix
     ↓
Eigen Decomposition
     ↓
Eigenvalues + Eigenvectors
     ↓
Sort by Eigenvalues
     ↓
Select top eigenvectors
     ↓
Project data
     ↓
Principal Components
```

---

# 27. Step 1 — Standardize the Data

The implementation in the supplied notebook first uses `StandardScaler`.

Standardization gives approximately:

\[
\mu=0
\]

and

\[
\sigma=1
\]

for each feature.

The standardization formula is:

\[
z=\frac{x-\mu}{\sigma}
\]

This is especially important when features have very different scales.

Example:

```text
Age       → 20–70
Income    → 20,000–2,00,000
```

Without scaling, income can dominate variance simply because of its numerical scale.

---

# 28. Why Scaling Matters for PCA

PCA is variance-based.

Suppose:

```text
Feature A → values around 1–10
Feature B → values around 1,000–100,000
```

Feature B can have much larger numerical variance because of its scale.

PCA could then focus heavily on Feature B even if the underlying information content does not justify that dominance.

Therefore, a common PCA workflow is:

```text
Raw Data
   ↓
StandardScaler
   ↓
PCA
```

> **Important:** Scaling is a common and often appropriate preprocessing step, but whether it should be used depends on the meaning and scale of the features.

---

# 29. Step 2 — Compute Covariance Matrix

After preprocessing, PCA analyzes how the features vary together.

For two standardized features:

\[
\Sigma=
\begin{bmatrix}
Var(X) & Cov(X,Y)\\
Cov(Y,X) & Var(Y)
\end{bmatrix}
\]

This matrix contains the information required for the eigen decomposition.

---

# 30. Step 3 — Eigen Decomposition

We solve:

\[
\Sigma v=\lambda v
\]

to obtain:

```text
Eigenvectors
+
Eigenvalues
```

Each eigenvector gives a candidate principal direction.

Each corresponding eigenvalue tells us the variance captured along that direction.

---

# 31. Step 4 — Sort Eigenvalues

Suppose we obtain:

```text
Eigenvalue 1 = 5.2
Eigenvalue 2 = 1.7
Eigenvalue 3 = 0.4
```

Sort them from largest to smallest:

```text
5.2 → PC1
1.7 → PC2
0.4 → PC3
```

Therefore:

```text
PC1 → maximum variance
PC2 → second maximum
PC3 → third maximum
```

---

# 32. Step 5 — Select Principal Components

Suppose the original dataset contains:

```text
10 features
```

but we want:

```text
2 components
```

We select the two eigenvectors corresponding to the two largest eigenvalues.

```text
10 original dimensions
          ↓
      Eigenvectors
          ↓
Top 2 eigenvectors
          ↓
       PC1 + PC2
```

---

# 33. Step 6 — Project the Data

Once the principal directions have been selected, the original data is projected onto those directions.

Conceptually:

\[
Z=XW
\]

where:

- \(X\) = transformed/centered data
- \(W\) = matrix containing selected principal directions
- \(Z\) = PCA-transformed data

If:

```text
X → n × 10
W → 10 × 2
```

then:

```text
Z → n × 2
```

Thus:

```text
10 dimensions → 2 dimensions
```

---

# 34. Explained Variance

A very important PCA concept is **explained variance**.

Suppose the eigenvalues are:

```text
λ1 = 6
λ2 = 3
λ3 = 1
```

Total variance:

\[
6+3+1=10
\]

Explained variance ratio of PC1:

\[
\frac{6}{10}=0.60
\]

So:

```text
PC1 → 60%
PC2 → 30%
PC3 → 10%
```

If we retain PC1 and PC2:

\[
60\%+30\%=90\%
\]

So the two-dimensional representation retains 90% of the total variance.

---

# 35. Explained Variance Ratio

The general formula is:

\[
EVR_i=
\frac{\lambda_i}{\sum_j\lambda_j}
\]

The cumulative explained variance is:

\[
CEV_k=
\sum_{i=1}^{k}EVR_i
\]

This is extremely useful for deciding how many components to keep.

Example:

| Component | Explained Variance |
|---|---:|
| PC1 | 55% |
| PC2 | 25% |
| PC3 | 10% |
| PC4 | 5% |
| PC5 | 3% |
| PC6 | 2% |

Cumulative:

| Components | Cumulative Variance |
|---:|---:|
| 1 | 55% |
| 2 | 80% |
| 3 | 90% |
| 4 | 95% |
| 5 | 98% |
| 6 | 100% |

If we need approximately 95% variance, we could retain 4 components.

---

# 36. How Many Principal Components Should We Keep?

There is no universal number.

Possible approaches include:

### Method 1 — Desired explained variance

For example:

```text
Keep enough PCs to explain ≥ 95% variance
```

### Method 2 — Visualization

For visualization:

```text
2 PCs → 2D
3 PCs → 3D
```

### Method 3 — Downstream model performance

Try different numbers of components and evaluate the final model using a proper validation procedure.

---

# 37. PCA Example: House Dataset

Suppose:

```text
Original features:

House Size
Number of Rooms
Number of Bathrooms
Lot Size
Age of House
Distance from City Center
...
```

Suppose we have 20 features.

We want:

```text
20 → 2
```

PCA might produce:

```text
PC1
PC2
```

PC1 could contain strong contributions from several size-related variables.

PC2 could represent another direction of variation.

The exact interpretation depends on the fitted PCA loadings.

---

# 38. PCA Loadings

The coefficients of the principal components are often called **loadings**.

Suppose:

\[
PC1=0.60X_1+0.55X_2+0.20X_3-0.10X_4
\]

The coefficients tell us how strongly the original standardized features contribute to PC1.

Large absolute coefficients can indicate features that strongly influence that component.

This can help interpret PCA, although interpretation can be difficult when many features contribute simultaneously.

---

# 39. Important Difference: Original Features vs PCs

Suppose:

```text
Original:
Age
Income
Spending Score
```

After PCA:

```text
PC1
PC2
```

`PC1` does not mean:

```text
PC1 = Age
```

Instead:

```text
PC1 = weighted combination of original features
```

Therefore, principal components are transformed features.

---

# 40. PCA Does Not Automatically Preserve Every Important Business Signal

PCA maximizes **variance**, not necessarily predictive power.

This is an important practical point.

Suppose a feature has low variance but is extremely predictive of the target.

PCA might assign relatively little importance to that direction.

Therefore:

```text
Maximum variance
      ≠
Maximum predictive power
```

PCA is an unsupervised transformation, even when later used before a supervised model.

---

# 41. PCA and Supervised Learning

PCA can be used before a supervised model:

```text
Raw Features
     ↓
Scaling
     ↓
PCA
     ↓
PC1, PC2, ..., PCk
     ↓
ML Model
     ↓
Prediction
```

Example:

```text
100 features
     ↓
PCA
     ↓
20 PCs
     ↓
Logistic Regression
```

This can reduce dimensionality and potentially reduce computational cost.

However, the number of components should be chosen using an appropriate validation strategy.

---

# 42. PCA and Visualization

A very common use case is visualization.

Suppose the dataset has:

```text
30 features
```

We can transform it into:

```text
PC1
PC2
```

and create a scatter plot:

```text
PC2
 ↑
 │       • • •
 │      • • •
 │
 │
 │  × × ×
 │ × × ×
 └────────────────→ PC1
```

If labels are available, they can be used only for coloring/interpretation of the visualization.

The PCA transformation itself does not require those labels.

---

# 43. Breast Cancer Dataset — Practical Implementation

The supplied implementation uses the breast cancer dataset from scikit-learn.

The dataset contains measurements such as:

- Radius
- Texture
- Perimeter
- Area
- Smoothness
- Compactness
- Concavity
- Concave points
- Symmetry
- Fractal dimension
- Related measurements

The target contains two classes:

```text
Malignant
Benign
```

The implementation uses the feature data for PCA and later uses the target to color the visualization.

---

# 44. Import Libraries

```python
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
%matplotlib inline
```

The notebook imports:

- NumPy
- Pandas
- Matplotlib
- Seaborn

---

# 45. Load the Dataset

```python
from sklearn.datasets import load_breast_cancer

cancer_dataset = load_breast_cancer()
```

The dataset object contains items such as:

```python
cancer_dataset.keys()
```

and includes the feature data, target, target names, and feature names.

---

# 46. Create a DataFrame

```python
df = pd.DataFrame(
    cancer_dataset['data'],
    columns=cancer_dataset['feature_names']
)

df.head()
```

This creates a Pandas DataFrame containing the input features.

The target is not included in `df` in this code.

That is important because PCA is being applied to the feature matrix.

---

# 47. Standardization

The notebook uses `StandardScaler`:

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
```

Fit the scaler:

```python
scaler.fit(df)
```

Transform the data:

```python
scaled_data = scaler.transform(df)
```

After standardization, each feature is approximately:

```text
Mean = 0
Standard deviation = 1
```

---

# 48. Apply PCA

Import PCA:

```python
from sklearn.decomposition import PCA
```

Create a PCA object:

```python
pca = PCA(n_components=2)
```

This means:

> Transform the original feature space into 2 principal components.

Then:

```python
data_pca = pca.fit_transform(scaled_data)
```

The resulting `data_pca` contains two columns:

```text
PC1
PC2
```

---

# 49. Inspect the PCA Data

```python
data_pca
```

The shape will correspond to:

```text
number of samples × 2
```

For example:

```text
[[PC1_value, PC2_value],
 [PC1_value, PC2_value],
 ...]
```

Each row represents one original observation in the new PCA coordinate system.

---

# 50. Explained Variance in scikit-learn

The notebook checks:

```python
pca.explained_variance_
```

This returns the variance associated with each selected principal component.

For the **proportion** of variance explained, the more directly useful attribute is:

```python
pca.explained_variance_ratio_
```

Example:

```python
pca.explained_variance_ratio_
```

might conceptually return:

```text
[0.44, 0.19]
```

meaning:

```text
PC1 → 44%
PC2 → 19%
```

and together:

```text
63%
```

of the total variance is represented by these two components.

---

# 51. Plot the Two Principal Components

The supplied notebook uses:

```python
plt.figure(figsize=(8, 6))

plt.scatter(
    data_pca[:, 0],
    data_pca[:, 1],
    c=cancer_dataset['target'],
    cmap='plasma'
)

plt.xlabel('First principal component')
plt.ylabel('Second Principal Component')
```

Here:

```python
data_pca[:, 0]
```

represents PC1.

And:

```python
data_pca[:, 1]
```

represents PC2.

The target is used to color the points.

### Important

The target is used for visualization/coloring here. It is **not used to fit the PCA transformation**.

---

# 52. Choosing 3 Components

If you want three principal components:

```python
pca = PCA(n_components=3)

data_pca = pca.fit_transform(scaled_data)
```

Now:

```text
data_pca
```

contains:

```text
PC1
PC2
PC3
```

and:

```python
pca.explained_variance_ratio_
```

returns three explained-variance ratios.

Generally:

\[
EVR(PC1) > EVR(PC2) > EVR(PC3)
\]

assuming the standard PCA ordering.

---

# 53. Keeping All Components

If you don't specify `n_components`, scikit-learn can compute the full set of possible components for the data.

For example:

```python
pca = PCA()

data_pca = pca.fit_transform(scaled_data)
```

Then:

```python
pca.explained_variance_ratio_
```

provides the explained-variance ratio for each component.

You can inspect cumulative variance:

```python
import numpy as np

cumulative_variance = np.cumsum(
    pca.explained_variance_ratio_
)

cumulative_variance
```

This helps decide how many components are needed.

---

# 54. A Better Practical PCA Implementation

```python
import numpy as np
import pandas as pd

from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# Load dataset
cancer = load_breast_cancer()

X = pd.DataFrame(
    cancer.data,
    columns=cancer.feature_names
)

# Standardize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# Explained variance
print("Explained variance ratio:")
print(pca.explained_variance_ratio_)

print("Total explained variance:")
print(pca.explained_variance_ratio_.sum())
```

---

# 55. PCA Workflow in One Code Block

```python
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# 1. Load data
data = load_breast_cancer()

X = data.data
y = data.target

# 2. Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 3. Apply PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# 4. Inspect explained variance
print(pca.explained_variance_ratio_)

# 5. Inspect transformed data
print(X_pca.shape)
```

---

# 56. A Better Way to Select the Number of Components

Instead of guessing:

```python
n_components = 2
```

you can first fit PCA with all components:

```python
pca = PCA()
X_pca = pca.fit_transform(X_scaled)
```

Then:

```python
explained = pca.explained_variance_ratio_
```

Calculate cumulative explained variance:

```python
cumulative = np.cumsum(explained)
```

Then inspect:

```python
for i, value in enumerate(cumulative, start=1):
    print(i, value)
```

You can choose the smallest number of components that reaches your desired threshold.

For example:

```text
Target = 95%
```

---

# 57. PCA in a Pipeline

For production-style machine learning, a pipeline is often cleaner:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("pca", PCA(n_components=2))
])

X_pca = pipeline.fit_transform(X)
```

This ensures that scaling and PCA are applied consistently.

---

# 58. Avoiding Data Leakage

When PCA is used before a supervised model, don't fit PCA on the complete dataset before cross-validation.

Incorrect idea:

```text
Entire dataset
      ↓
Scaling + PCA
      ↓
Cross-validation
```

This can allow information from validation folds to influence the preprocessing.

Prefer:

```text
Training fold
    ↓
Fit scaler
    ↓
Fit PCA
    ↓
Transform training fold

Validation fold
    ↓
Use already-fitted scaler
    ↓
Use already-fitted PCA
    ↓
Transform validation fold
```

A `Pipeline` is useful for enforcing this correctly.

---

# 59. PCA vs Feature Selection

### Feature Selection

```text
F1 F2 F3 F4 F5
 ↓     ↓     ↓
Keep F1 F3 F5
```

Output:

```text
F1, F3, F5
```

They remain original features.

### PCA

```text
F1 F2 F3 F4 F5
       ↓
      PCA
       ↓
    PC1 PC2
```

Output:

```text
PC1, PC2
```

They are new transformed features.

---

# 60. PCA vs Selecting the Most Correlated Features

Correlation-based feature selection asks:

> Which original features have useful relationships with the target or with each other?

PCA asks:

> Which new directions capture the maximum variance in the feature space?

These are different objectives.

Feature selection:

```text
Choose existing variables
```

PCA:

```text
Create transformed variables
```

---

# 61. PCA vs LDA

A useful comparison:

| PCA | LDA |
|---|---|
| Unsupervised transformation | Supervised dimensionality-reduction method |
| Does not need class labels | Uses class labels |
| Maximizes variance | Focuses on class separation |
| Useful for visualization/compression | Useful when class discrimination is important |

The supplied material focuses on PCA; LDA is mentioned here only as an additional comparison.

---

# 62. PCA vs Autoencoder

Another useful comparison:

| PCA | Autoencoder |
|---|---|
| Linear transformation | Can learn nonlinear transformations |
| Classical statistical method | Neural-network approach |
| Easier to interpret mathematically | More flexible |
| Usually simpler to train | Can require more data/compute |
| Based on principal directions | Learns encoder/decoder representations |

Again, this is additional context beyond the supplied PCA transcript.

---

# 63. Advantages of PCA

### 1. Reduces dimensionality

```text
100 features → 20 PCs
```

### 2. Helps visualization

```text
High-dimensional → 2D/3D
```

### 3. Can reduce computational burden

Fewer input dimensions can make some downstream models cheaper to train.

### 4. Can reduce redundancy

Highly correlated features may be represented through fewer components.

### 5. Can help with noise reduction

Low-variance components can sometimes be discarded, although this should be validated for the specific problem.

---

# 64. Limitations of PCA

### 1. Principal components are less interpretable

Instead of:

```text
Age
Income
Experience
```

you may get:

```text
PC1
PC2
```

Each PC can contain contributions from many original features.

### 2. PCA is linear

Standard PCA captures linear structure.

### 3. Sensitive to scaling

Features with large scales can dominate if preprocessing is inappropriate.

### 4. Variance is not the same as predictive importance

A low-variance direction can still matter strongly for prediction.

### 5. Some information is intentionally discarded

If you keep only a subset of PCs, the discarded components contain some variance.

---

# 65. Common Mistakes

## Mistake 1 — Thinking PCA simply selects important original columns

Wrong:

```text
PCA → chooses F1 and F5
```

Correct:

```text
PCA → creates new transformed features
```

---

## Mistake 2 — Forgetting scaling

If feature scales differ significantly, PCA can be dominated by high-scale variables.

---

## Mistake 3 — Choosing components randomly

Don't automatically assume:

```text
n_components = 2
```

is always correct.

Use:

- Explained variance
- Cumulative explained variance
- Visualization needs
- Downstream model validation

---

## Mistake 4 — Thinking PC1 is the "most important original feature"

PC1 is a direction formed from multiple original features.

---

## Mistake 5 — Confusing explained variance with accuracy

If PCA retains 95% explained variance, it does **not** mean the final model has 95% accuracy.

They are completely different quantities.

---

## Mistake 6 — Using target labels to fit ordinary PCA

Standard PCA does not use `y`.

The transformation is learned from `X`.

Labels may later be used to interpret or visualize the transformed data.

---

# 66. Frequently Asked Questions

## Q1. Is PCA supervised or unsupervised?

PCA is generally considered an **unsupervised dimensionality-reduction technique** because the transformation is learned without using target labels.

---

## Q2. Is PCA feature selection?

No.

PCA is primarily **feature extraction**.

---

## Q3. Does PCA remove features?

It reduces the dimensionality of the representation.

The original features are transformed into principal components, and if only some components are retained, the remaining information is discarded from the reduced representation.

---

## Q4. Why does PC1 capture maximum variance?

Because PCA chooses the first principal direction specifically to maximize the variance of the projected data.

---

## Q5. Why is PC2 perpendicular to PC1?

Standard PCA constrains subsequent principal directions to be orthogonal to earlier ones.

PC2 therefore captures the maximum remaining variance subject to being orthogonal to PC1.

---

## Q6. What determines the importance/order of principal components?

The eigenvalues of the covariance matrix.

Larger eigenvalue:

```text
→ more variance captured
→ earlier principal component
```

---

## Q7. What is the relationship between eigenvalues and explained variance?

For covariance-based PCA:

```text
Eigenvalue
    ↓
Variance along that principal direction
```

The explained variance ratio is the eigenvalue divided by the sum of all eigenvalues.

---

## Q8. Why do we standardize before PCA?

To prevent variables with larger numerical scales from dominating the variance calculation.

---

## Q9. Can PCA be used for visualization?

Yes.

A common approach is:

```text
High-dimensional X
       ↓
      PCA
       ↓
     PC1, PC2
       ↓
      2D plot
```

---

## Q10. Can PCA improve model accuracy?

It can, but it is not guaranteed.

It may help by:

- Removing redundancy
- Reducing noise
- Reducing dimensionality
- Reducing computational burden

But it can also remove predictive information.

Always validate experimentally.

---

# 67. Interview Questions

### Beginner

1. What is PCA?
2. Why is PCA used?
3. What is dimensionality reduction?
4. What is the curse of dimensionality?
5. What is feature selection?
6. What is feature extraction?
7. Is PCA supervised or unsupervised?
8. Why is feature scaling important for PCA?

### Intermediate

9. What is a principal component?
10. Why does PC1 capture maximum variance?
11. Why are principal components orthogonal?
12. What is explained variance?
13. What is explained variance ratio?
14. How do you choose the number of components?
15. What is the covariance matrix?
16. Why are eigenvectors used in PCA?
17. What do eigenvalues represent in PCA?

### Advanced

18. Why is PCA based on eigen decomposition?
19. How is PCA related to covariance matrix diagonalization?
20. How is PCA related to SVD?
21. Can PCA be used with a supervised learning model?
22. How do you avoid data leakage when using PCA with cross-validation?
23. Why can PCA reduce predictive performance?
24. What is the difference between maximizing variance and maximizing predictive information?
25. How would you interpret PCA loadings?

---

# 68. Mathematical Summary

For centered data matrix \(X\):

### Covariance matrix

\[
\Sigma=\frac{1}{n-1}X^TX
\]

### Eigen decomposition

\[
\Sigma v_i=\lambda_i v_i
\]

### Ordering

\[
\lambda_1\geq\lambda_2\geq\cdots\geq\lambda_p
\]

### Principal directions

\[
v_1,v_2,\ldots,v_p
\]

### Reduced representation

If we retain the first \(k\) eigenvectors:

\[
W_k=[v_1,v_2,\ldots,v_k]
\]

then:

\[
Z=XW_k
\]

where \(Z\) contains the principal-component representation.

### Explained variance ratio

\[
EVR_i=
\frac{\lambda_i}
{\sum_{j=1}^{p}\lambda_j}
\]

### Cumulative explained variance

\[
CEV_k=
\sum_{i=1}^{k}EVR_i
\]

---

# 69. Complete Mental Model

```text
                  ORIGINAL DATA
                        │
                        ▼
              Many Original Features
                        │
                        ▼
               Feature Preprocessing
                        │
                        ▼
                 Standardization
                        │
                        ▼
                Covariance Matrix
                        │
                        ▼
              Eigen Decomposition
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
         Eigenvectors          Eigenvalues
              │                   │
              │                   └── Variance captured
              │
              └── Principal directions
                        │
                        ▼
              Sort by Eigenvalues
                        │
                        ▼
               Select Top K PCs
                        │
                        ▼
                  Projection
                        │
                        ▼
                PC1, PC2, ..., PCk
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
        Visualization         ML Model
```

---

# 70. PCA in One Example

Suppose:

```text
Original:
10 features
```

After standardization:

```text
10 standardized features
```

PCA finds:

```text
PC1 → 50%
PC2 → 25%
PC3 → 10%
PC4 → 5%
...
```

If we retain the first three:

```text
10 dimensions
     ↓
    PCA
     ↓
3 dimensions
```

Cumulative explained variance:

\[
50+25+10=85\%
\]

So the three-dimensional representation retains 85% of the total variance according to the PCA criterion.

---

# 71. Final Takeaway

The complete concept can be remembered as:

```text
High-dimensional data
        ↓
Curse of dimensionality
        ↓
Need dimensionality reduction
        ↓
Feature Selection OR Feature Extraction
                         ↓
                        PCA
                         ↓
               Transform feature space
                         ↓
               Find maximum-variance
                    directions
                         ↓
              Eigenvectors + Eigenvalues
                         ↓
              PC1 > PC2 > PC3 ...
                         ↓
             Select required components
                         ↓
                 Reduced dataset
```

### The most important sentence:

> **PCA transforms the original feature space into a new set of orthogonal principal components ordered by the amount of variance they capture, allowing us to represent high-dimensional data using fewer dimensions while retaining as much variance as possible.**

---

# 72. Quick Revision Sheet

```text
PCA
│
├── Principal Component Analysis
├── Dimensionality Reduction
├── Feature Extraction
│
├── Why?
│   ├── Curse of dimensionality
│   ├── Computational efficiency
│   └── Visualization
│
├── Preprocessing
│   └── Usually standardize features
│
├── Mathematics
│   ├── Covariance Matrix
│   ├── Eigenvectors
│   ├── Eigenvalues
│   └── Projection
│
├── Components
│   ├── PC1 → maximum variance
│   ├── PC2 → next maximum
│   └── PC3 → next maximum
│
├── Evaluation
│   └── Explained Variance Ratio
│
└── Implementation
    ├── StandardScaler
    ├── PCA(n_components=k)
    ├── fit_transform()
    └── explained_variance_ratio_
```

---

## Source Coverage

This README consolidates the provided:

- PCA introduction transcript
- Feature selection vs feature extraction transcript
- PCA geometric-intuition transcript
- PCA mathematical-intuition transcript
- Eigenvector/eigenvalue transcript
- PCA implementation transcript and notebook
- Handwritten PCA PDF notes

The handwritten PDF's first pages emphasize the three motivations for dimensionality reduction—curse of dimensionality, model-performance considerations, and visualization—and contrast feature selection with feature extraction. The later material develops geometric projection, maximum variance, principal components, covariance/eigen decomposition, and implementation concepts. The supplied implementation notebook demonstrates standardization followed by `PCA(n_components=2)` and inspection of explained variance.

