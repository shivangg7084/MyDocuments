# 10 — Dimensionality Reduction: Curse of Dimensionality, PCA & ICA

> Source: `Machine_Learning_-_Dimension_Reduction_Ramya.pptx`

---

## 1. The Curse of Dimensionality

> **Definition:** The curse of dimensionality refers to the **phenomena that occur when working on HIGH-DIMENSIONAL data that do not occur in low-dimensional spaces** — specifically the issue of **data SPARSITY** and **"CLOSENESS" of data.**

### Why sparsity happens

> **Sparsity of data occurs when moving to higher dimensions: the volume of the space represented GROWS SO QUICKLY that the data CANNOT KEEP UP, and thus becomes sparse.**

- **The sparsity issue is a major one for anyone whose goal has some statistical significance.**
- As the data space moves **from one dimension → two dimensions → three dimensions, the given data fills LESS AND LESS of the data space.**

### See it with actual numbers

Take **100 data points** and divide each dimension into 10 bins:

| Dimensions | Number of cells | Points per cell | What it feels like |
|---|---|---|---|
| **1-D** (a line) | 10 | **10 points** | Comfortably dense — every bin has data |
| **2-D** (a grid) | 10 × 10 = **100** | **1 point** | Getting thin |
| **3-D** (a cube) | 10 × 10 × 10 = **1,000** | **0.1 points** | **90% of cells are empty** |
| **10-D** | 10¹⁰ = **10 billion** | **0.00000001** | Essentially all empty space |

**The data did not shrink — the space exploded.** To keep 10 points per cell in 10 dimensions you would need **100 billion** data points.

### The two consequences

**1. Sparsity → no statistical significance.** If a region contains 0 or 1 examples, you cannot learn anything reliable about it. The model is guessing nearly everywhere.

**2. "Closeness" breaks down.** This is the subtler and more damaging one. In high dimensions, **the distance to your nearest neighbour and the distance to your farthest neighbour become almost the same.** Everything is roughly equally far from everything else.

That is catastrophic for any algorithm built on distance — **kNN, k-means, SVM with RBF** — because "nearest neighbour" stops carrying meaning. *(Intuition: two points must be close in **every one** of 500 dimensions to be genuinely close. Differ noticeably in even a few and the total distance blows up, so all pairs end up looking similarly far apart.)*

**Also:** more dimensions mean more parameters, so models overfit more easily.

**The cure:** dimensionality reduction — **PCA** and **ICA**.

---

## 2. Principal Component Analysis (PCA)

### Definition
- **PCA is the most basic yet important feature transform in feature extraction and dimensionality reduction research.**
- **PCA reduces the dimensionality of a dataset consisting of many variables correlated with each other (heavily or lightly), while RETAINING THE VARIATION PRESENT IN THE DATASET UP TO THE MAXIMUM EXTENT.**
- **The dataset on which PCA is to be used MUST BE SCALED.**

### The idea before the mathematics

**Analogy — photographing a teapot.** A teapot is 3-D, but a photograph is 2-D. Photograph it from directly above and you see a meaningless circle — spout, handle and shape all lost. Photograph it from the side and you instantly recognise a teapot. **Same object, same reduction from 3-D to 2-D, but one viewpoint preserved the information and the other destroyed it.**

**PCA finds the best viewpoint automatically.** "Best" means the direction along which the data is **most spread out**, because spread is where the information lives — a direction in which all points look identical tells you nothing.

### Seeing it on real-ish data

Suppose height and weight are strongly correlated:

```
weight
   │              ·  ·
   │           · · ·        PC1 ↗ the long axis of the cloud
   │        · ·· ·          (most of the spread lives here)
   │     · ·· ·
   │  · · ·        PC2 ↖ perpendicular, very little spread
   └──────────────► height
```

The cloud is essentially a **line with some thickness**. PC1 runs along the cloud, PC2 across it. If PC1 holds 95% of the variation, you can **describe each person with one number instead of two** and lose almost nothing. That is the entire method.

### Why scaling is mandatory

PCA maximises **variance**, and variance depends on units.

| Feature | Range | Variance |
|---|---|---|
| Age (years) | 20–70 | ~200 |
| Salary (₹) | 20,000–200,000 | ~2,000,000,000 |

Unscaled, salary's variance is ten million times larger, so **PC1 would point almost exactly along salary** — not because salary matters more, but because rupees are smaller units than years. Measure salary in lakhs instead and you get a completely different answer. **Scaling puts every feature on equal footing so the result reflects structure, not units.**

### How PCA works (memorise this sequence)

> **PCA uses LINEAR ALGEBRA to transform data into new features called PRINCIPAL COMPONENTS. It finds these by calculating EIGENVECTORS (directions) and EIGENVALUES (importance) from the COVARIANCE MATRIX. PCA selects the top components with the HIGHEST EIGENVALUES and PROJECTS the data onto them to simplify the dataset.**

**Step-by-step:**
1. **Scale / standardise** the data
2. Compute the **covariance matrix** (which features move together)
3. Compute its **eigenvectors** and **eigenvalues**
4. **Sort** eigenvectors by descending eigenvalue
5. **Select the top k** — these are your principal components
6. **Project** the data onto them

| Concept | Role in PCA | Plain meaning |
|---|---|---|
| **Eigenvector** | The **direction** of a component | Which way does this axis point? |
| **Eigenvalue** | The **importance** of that direction | How much variance lies along it? |
| **Covariance matrix** | The input to the whole process | Which features move together? |

### A worked mini-example

Say the eigenvalues for a 4-feature dataset come out as:

```
PC1: 2.8      PC2: 0.9      PC3: 0.2      PC4: 0.1        (total = 4.0)
```

Convert to percentage of variance explained:

| Component | Eigenvalue | Variance explained | Cumulative |
|---|---|---|---|
| **PC1** | 2.8 | **70%** | 70% |
| **PC2** | 0.9 | **22.5%** | **92.5%** |
| PC3 | 0.2 | 5% | 97.5% |
| PC4 | 0.1 | 2.5% | 100% |

**Decision: keep PC1 and PC2.** You dropped half your features and kept **92.5% of the information.** That is the trade PCA offers, stated numerically. *(A common rule of thumb is to keep enough components to reach 95% cumulative variance.)*

**Key properties:**
- **PC1 captures the maximum possible variance**; PC2 the maximum of what remains, and so on
- **Principal components are ORTHOGONAL (uncorrelated) to each other** — each carries genuinely new information, with no overlap

> **The catch: interpretability is gone.** PC1 is not "age" — it is something like `0.6×age + 0.5×salary − 0.3×hours`. Compression bought with meaning.

### The four key terms defined in the slides

| Term | Definition | In plain terms |
|---|---|---|
| **Dimensionality** | The **number of random variables / features** in a dataset | How many columns |
| **Correlation** | How **strongly two variables are related**; ranges **−1 to +1** | +1 = rise together, −1 = one rises as the other falls, 0 = unrelated |
| **Orthogonal** | **Uncorrelated**, i.e. **correlation between any pair is 0** | At right angles; no shared information |
| **Covariance Matrix** | A matrix of the **covariances between pairs of variables** | A grid showing which features move together |

---

## 3. Independent Component Analysis (ICA)

### Definition
> **ICA is a machine learning technique to SEPARATE INDEPENDENT SOURCES FROM A MIXED SIGNAL.**

### The cocktail party problem

Three people speak simultaneously in a room. Three microphones are placed around it. **Each microphone records a jumble of all three voices**, mixed in different proportions depending on where it sits:

```
Mic 1  =  0.7×Alice + 0.2×Bob + 0.1×Carol
Mic 2  =  0.1×Alice + 0.8×Bob + 0.1×Carol
Mic 3  =  0.2×Alice + 0.1×Bob + 0.7×Carol
```

You have the mixtures. You want the **three separate voices** — but you know neither the original voices nor the mixing proportions. **ICA recovers them anyway**, which is why it is called *blind* source separation.

**How it manages this:** it assumes the underlying sources are **statistically independent** — Alice's speech carries no information about Bob's. ICA searches for the un-mixing that makes the recovered signals as independent as possible.

### PCA vs ICA — the line that gets asked

> **PCA focuses on MAXIMIZING THE VARIANCE of the data points, whereas ICA focuses on INDEPENDENCE — i.e. independent components.**

- **ICA also performs WHITENING** — transforming the data so features are uncorrelated with unit variance, a standard preparatory step before extracting independent components.

### Comparison table

| Aspect | **PCA** | **ICA** |
|---|---|---|
| Goal | **Maximize variance** | **Maximize independence** |
| Components are | **Orthogonal / uncorrelated** | **Statistically independent** |
| Typical use | Dimensionality reduction, compression, visualisation | **Blind source separation** |
| Question it asks | "Where is the data most spread out?" | "What original signals were mixed together?" |
| Performs whitening? | Implicitly (it uncorrelates) | **Yes, explicitly stated** |
| Component ordering | Ordered by eigenvalue (importance) | No inherent order |
| Reduces dimensions? | **Yes, that is the point** | Not necessarily — usually same count, un-mixed |

> **Uncorrelated is weaker than independent.** Independence implies uncorrelatedness, but not the reverse — two variables can have zero linear correlation and still be completely determined by each other (e.g. y = x² over a symmetric range). PCA only removes *linear* relationships; ICA targets the stronger condition, which is why it can un-mix signals that PCA cannot.

---

## 4. Applications

### PCA Applications
- **Image compression** — a face image of 10,000 pixels can often be rebuilt recognisably from ~100 components, since neighbouring pixels are heavily correlated
- **Digits classification** — reduce handwritten-digit images to a few dozen components, then classify faster with little loss of accuracy

### ICA Applications
- **Optical imaging of neurons**
- **Face recognition**
- **Predicting stock market prices**
- **Mobile phone communications** — separating overlapping transmissions
- **Removing artifacts, such as eye blinks, from EEG data** — the textbook use: brain electrodes record brain activity *and* eye-blink muscle activity mixed together; ICA separates them so the blinks can be deleted
- **Studies of the resting state network of the brain**

> **Notice the pattern:** PCA appears where the goal is **compression**; ICA appears where the goal is **un-mixing** signals that got combined.

---

## 5. Where this fits with note 03

From the Supervised Learning notes, dimensionality reduction has **two broad approaches**:
- **Feature Selection** — pick a subset of the *original* features (still readable)
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
print(pca.explained_variance_ratio_)   # e.g. [0.70, 0.225] → 92.5% kept
print(pca.explained_variance_ratio_.cumsum())   # running total

# let PCA choose the count for you: keep 95% of the variance
pca95 = PCA(n_components=0.95).fit(X_scaled)
print("components needed:", pca95.n_components_)

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
