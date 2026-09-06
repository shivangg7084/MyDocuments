# 10 — Dimensionality Reduction: Curse of Dimensionality, PCA & ICA

> Source: `Machine_Learning_-_Dimension_Reduction_Ramya.pptx`

---

## 1. The Curse of Dimensionality

> **Definition:** The curse of dimensionality refers to the **phenomena that occur when working on HIGH-DIMENSIONAL data that do not occur in low-dimensional spaces** — specifically the issue of **data SPARSITY** and **"CLOSENESS" of data**.

### Why sparsity happens
> **Sparsity of data occurs when moving to higher dimensions: the volume of the space represented GROWS SO QUICKLY that the data CANNOT KEEP UP, and thus becomes sparse.**

- **The sparsity issue is a major one for anyone whose goal has some statistical significance.**
- As the data space moves **from one dimension → two dimensions → three dimensions, the given data fills LESS AND LESS of the data space.**

### Simple illustration
Imagine 100 data points:
- On a **line** split into 10 bins → about **10 points per bin**. Dense.
- On a **10 × 10 grid** (100 cells) → about **1 point per cell**. Thin.
- In a **10 × 10 × 10 cube** (1000 cells) → **most cells are empty**. Sparse.

**Consequences:**
- Distance-based methods (kNN, k-means, SVM with RBF) break down because **every point becomes roughly equally far from every other point** — the "closeness" problem.
- You need **exponentially more data** to maintain the same density and statistical significance.
- Models overfit more easily.

**The cure:** dimensionality reduction — **PCA** and **ICA**.

---

## 2. Principal Component Analysis (PCA)

### Definition
- **PCA is the most basic yet important feature transform in feature extraction and dimensionality reduction research.**
- **PCA reduces the dimensionality of a dataset consisting of many variables correlated with each other (heavily or lightly), while RETAINING THE VARIATION PRESENT IN THE DATASET UP TO THE MAXIMUM EXTENT.**
- **The dataset on which PCA is to be used MUST BE SCALED.**

> **Why scaling is mandatory:** PCA maximises variance. A feature measured in rupees (range 0–100000) would swamp a feature measured in years (range 0–100) purely because of its units, not its importance. Scaling puts all features on a level footing.

### What PCA gives us
- **It helps us to remove redundancy, improve computational efficiency, and make data easier to visualise and analyse.**

### How PCA works (memorise this sequence)
> **PCA uses LINEAR ALGEBRA to transform data into new features called PRINCIPAL COMPONENTS. It finds these by calculating EIGENVECTORS (directions) and EIGENVALUES (importance) from the COVARIANCE MATRIX. PCA selects the top components with the HIGHEST EIGENVALUES and PROJECTS the data onto them to simplify the dataset.**

**Step-by-step:**
1. **Scale/standardise** the data
2. Compute the **covariance matrix**
3. Compute its **eigenvectors** and **eigenvalues**
4. **Sort** the eigenvectors by descending eigenvalue
5. **Select the top k** eigenvectors (the principal components)
6. **Project** the original data onto these k components

| Concept | Role in PCA |
|---|---|
| **Eigenvector** | The **direction** of a principal component |
| **Eigenvalue** | The **importance** (amount of variance explained) of that direction |
| **Covariance matrix** | The input from which both are computed |

**Key properties:**
- **PC1** captures the **maximum possible variance**; **PC2** captures the maximum of the remaining variance, and so on.
- **Principal components are ORTHOGONAL (uncorrelated) to each other.**

### The four key terms defined in the slides

| Term | Definition |
|---|---|
| **Dimensionality** | The **number of random variables / the number of features** in a dataset |
| **Correlation** | Shows **how strongly two variables are related** to each other; its value ranges from **−1 to +1** |
| **Orthogonal** | **Uncorrelated to each other**, i.e. the **correlation between any pair of variables is 0** |
| **Covariance Matrix** | A matrix consisting of the **covariances between the pairs of variables** |

---

## 3. Independent Component Analysis (ICA)

### Definition
> **ICA is a machine learning technique to SEPARATE INDEPENDENT SOURCES FROM A MIXED SIGNAL.**

### PCA vs ICA — the one line that gets asked
> **PCA focuses on MAXIMIZING THE VARIANCE of the data points, whereas ICA focuses on INDEPENDENCE — i.e. independent components.**

- **ICA also performs WHITENING.**

*(Whitening = transforming the data so the features are uncorrelated and have unit variance — a standard preprocessing step before extracting independent components.)*

### The classic intuition — the "cocktail party problem"
Several people are speaking at once in a room, and several microphones each record a **mixture** of all the voices. ICA takes those mixed recordings and **recovers the individual voices** — the independent sources.

### Comparison table

| Aspect | **PCA** | **ICA** |
|---|---|---|
| Goal | **Maximize variance** | **Maximize independence** |
| Components are | **Orthogonal / uncorrelated** | **Statistically independent** |
| Typical use | Dimensionality reduction, compression, visualisation | **Blind source separation** from mixed signals |
| Performs whitening? | Implicitly (uncorrelates) | **Yes, explicitly stated** |
| Ordering of components | Ordered by eigenvalue (importance) | No inherent order |

> **Note:** *Uncorrelated* is a weaker condition than *independent*. Independence implies uncorrelatedness, but not the other way round — which is exactly why ICA can do things PCA cannot.

---

## 4. Applications

### PCA Applications
- **Image compression**
- **Digits classification**

### ICA Applications
- **Optical imaging of neurons**
- **Face recognition**
- **Predicting stock market prices**
- **Mobile phone communications**
- **Removing artifacts, such as eye blinks, from EEG data**
- **Studies of the resting state network of the brain**

---

## 5. Where this fits with note 03

From the Supervised Learning notes, dimensionality reduction has **two broad approaches**:
- **Feature Selection** — pick a subset of the *original* features
- **Feature Extraction** — transform into *new derived* features → **PCA and ICA live here**

And the reasons for reducing dimensions: beat the **curse of dimensionality**, remove **redundant/correlated features**, **speed up training**, **reduce overfitting**, and enable **2D/3D visualisation**.

---

## 6. Quick Python reference

```python
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA, FastICA

X_scaled = StandardScaler().fit_transform(X)   # PCA REQUIRES scaled data

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
print(pca.explained_variance_ratio_)   # how much variance each PC keeps

ica = FastICA(n_components=2)
X_ica = ica.fit_transform(X_scaled)
```

---

# MCQ Practice — Dimensionality Reduction

**Q1.** The curse of dimensionality specifically refers to the issue of:
- A) Too few features
- B) Data sparsity and "closeness" of data in high dimensions
- C) Missing labels
- D) Class imbalance

**Q2.** As we move to higher dimensions, the volume of the space:
- A) Shrinks, so data becomes dense
- B) Grows so quickly that data cannot keep up and becomes sparse
- C) Stays constant
- D) Becomes negative

**Q3.** As data moves from 1D → 2D → 3D, the given data:
- A) Fills more and more of the space
- B) Fills less and less of the space
- C) Fills exactly the same fraction
- D) Disappears

**Q4.** The sparsity issue is a major problem for anyone whose goal has:
- A) Fast computation
- B) Some statistical significance
- C) Small memory usage
- D) Categorical features

**Q5.** PCA stands for:
- A) Partial Correlation Analysis
- B) Principal Component Analysis
- C) Primary Cluster Algorithm
- D) Predictive Class Assignment

**Q6.** PCA reduces dimensionality while:
- A) Removing all variation
- B) Retaining the variation present in the dataset to the maximum extent
- C) Maximizing the number of features
- D) Preserving the class labels

**Q7.** Before applying PCA, the dataset must be:
- A) Sorted
- B) Scaled
- C) One-hot encoded
- D) Duplicated

**Q8.** Why must data be scaled before PCA?
- A) To make it categorical
- B) Because features with larger numeric ranges would otherwise dominate the variance
- C) To reduce the number of rows
- D) Scaling is optional and has no effect

**Q9.** PCA computes eigenvectors and eigenvalues from the:
- A) Correlation coefficient only
- B) Covariance matrix
- C) Confusion matrix
- D) Distance matrix

**Q10.** In PCA, eigenvectors represent:
- A) The importance of each component
- B) The directions of the principal components
- C) The class labels
- D) The residuals

**Q11.** In PCA, eigenvalues represent:
- A) The directions
- B) The importance (variance explained) of each component
- C) The number of features
- D) The correlation sign

**Q12.** PCA selects the components with the:
- A) Lowest eigenvalues
- B) Highest eigenvalues
- C) Zero eigenvalues
- D) Negative eigenvalues

**Q13.** The first principal component captures:
- A) The least variance
- B) The maximum possible variance
- C) The class labels
- D) Only noise

**Q14.** Principal components are:
- A) Highly correlated with each other
- B) Orthogonal (uncorrelated) to each other
- C) Identical to the original features
- D) Always categorical

**Q15.** "Dimensionality" is defined as:
- A) The number of rows in a dataset
- B) The number of random variables / features in a dataset
- C) The number of classes
- D) The number of models

**Q16.** The value of a correlation ranges from:
- A) 0 to 1
- B) −1 to +1
- C) −∞ to +∞
- D) 0 to 100

**Q17.** "Orthogonal" means the correlation between any pair of variables is:
- A) 1
- B) −1
- C) 0
- D) 0.5

**Q18.** The covariance matrix consists of:
- A) The class labels
- B) The covariances between the pairs of variables
- C) The eigenvalues only
- D) The predictions

**Q19.** PCA helps us to:
- A) Remove redundancy, improve computational efficiency and make data easier to visualise
- B) Increase the number of features
- C) Add noise to the data
- D) Label the data

**Q20.** ICA stands for:
- A) Internal Cluster Analysis
- B) Independent Component Analysis
- C) Iterative Correlation Algorithm
- D) Integrated Classification Approach

**Q21.** ICA is a technique to:
- A) Classify labelled data
- B) Separate independent sources from a mixed signal
- C) Reduce class imbalance
- D) Tune hyper-parameters

**Q22.** PCA focuses on ______ whereas ICA focuses on ______:
- A) independence; variance
- B) maximizing the variance; independence
- C) accuracy; recall
- D) bias; variance

**Q23.** Which technique also performs whitening?
- A) PCA
- B) ICA
- C) Neither
- D) Only LDA

**Q24.** Which is a listed application of PCA?
- A) Image compression
- B) Removing eye blinks from EEG data
- C) Mobile phone communications
- D) Face recognition

**Q25.** Which is NOT a listed application of ICA?
- A) Optical imaging of neurons
- B) Face recognition
- C) Predicting stock market prices
- D) Digits classification

**Q26.** Removing artifacts such as eye blinks from EEG data is an application of:
- A) PCA
- B) ICA
- C) SVM
- D) AdaBoost

**Q27.** PCA and ICA belong to which category of dimensionality reduction?
- A) Feature Selection
- B) Feature Extraction
- C) Regularization
- D) Sampling

**Q28.** Which statement is TRUE?
- A) Uncorrelated always implies independent
- B) Independent implies uncorrelated, but not the reverse
- C) The two terms are identical
- D) Neither is related to the other

**Q29.** In sklearn, `pca.explained_variance_ratio_` tells you:
- A) The accuracy of the model
- B) How much variance each principal component retains
- C) The number of classes
- D) The eigenvectors

**Q30.** The main reason dimensionality reduction reduces overfitting is that it:
- A) Adds more parameters
- B) Simplifies the model by removing redundant/noisy features
- C) Increases the sample size
- D) Balances the classes

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Sparsity and closeness of data. |
| 2 | **B** | Volume grows faster than the data. |
| 3 | **B** | Data fills less and less of the space. |
| 4 | **B** | Statistical significance suffers. |
| 5 | **B** | Principal Component Analysis. |
| 6 | **B** | Retain maximum variation. |
| 7 | **B** | "The dataset must be scaled." |
| 8 | **B** | Variance is unit-dependent. |
| 9 | **B** | From the covariance matrix. |
| 10 | **B** | Eigenvectors = directions. |
| 11 | **B** | Eigenvalues = importance. |
| 12 | **B** | Top components by eigenvalue. |
| 13 | **B** | PC1 = maximum variance. |
| 14 | **B** | Orthogonal = uncorrelated. |
| 15 | **B** | Number of random variables/features. |
| 16 | **B** | −1 to +1. |
| 17 | **C** | Correlation 0. |
| 18 | **B** | Pairwise covariances. |
| 19 | **A** | Exactly as stated in the slides. |
| 20 | **B** | Independent Component Analysis. |
| 21 | **B** | Blind source separation. |
| 22 | **B** | Variance vs independence. |
| 23 | **B** | "ICA also performs whitening." |
| 24 | **A** | PCA: image compression, digits classification. |
| 25 | **D** | Digits classification is listed under PCA. |
| 26 | **B** | Listed ICA application. |
| 27 | **B** | They transform into derived features. |
| 28 | **B** | Independence is the stronger condition. |
| 29 | **B** | Variance retained per component. |
| 30 | **B** | Fewer, cleaner features → simpler model. |
