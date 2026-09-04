# Hierarchical Clustering — Complete Notes

> **Topic:** Hierarchical Clustering  
> **Perspective:** Theory + Geometric Intuition + Dendrogram + Agglomerative/Divisive Clustering + Distance + Threshold + Silhouette Validation + Python Implementation  
> **Source basis:** Provided handwritten Hierarchical Clustering PDFs and the supplied implementation notebook.

---

# 1. What is Hierarchical Clustering?

**Hierarchical Clustering** is an unsupervised machine learning technique used to group similar data points into clusters.

Unlike K-Means, hierarchical clustering builds a **hierarchy of clusters**.

The key visual representation of this hierarchy is called a:

> **Dendrogram**

The supplied handwritten notes show a dataset being progressively grouped into larger clusters and then use a dendrogram to decide how many clusters should be selected. The notes also explicitly compare hierarchical clustering with K-Means. fileciteturn3file0L2-L3

---

# 2. Why Is It Called "Hierarchical"?

Because the algorithm creates a hierarchy:

```text
Individual Points
       ↓
Small Clusters
       ↓
Larger Clusters
       ↓
One Large Cluster
```

For example, suppose we have:

```text
P1  P2  P3  P4  P5  P6
```

Initially:

```text
{P1} {P2} {P3} {P4} {P5} {P6}
```

Then:

```text
{P1,P2} {P3} {P4,P5} {P6}
```

Then:

```text
{P1,P2,P3} {P4,P5,P6}
```

Finally:

```text
{P1,P2,P3,P4,P5,P6}
```

This nested structure is the hierarchy.

---

# 3. Key Difference from K-Means

One of the important points in the supplied handwritten notes is that hierarchical clustering does **not require centroids in the way K-Means does**.

The notes contrast:

```text
K-Means
→ Centroids
→ Elbow Method
→ Number of clusters

Hierarchical Clustering
→ Dendrogram
→ Threshold / Cut
→ Number of clusters
```

This comparison appears on the second page of the combined handwritten notes. fileciteturn3file0L3-L3

---

# 4. Main Types of Hierarchical Clustering

There are two major approaches:

```text
Hierarchical Clustering
        │
        ├── Agglomerative
        │
        └── Divisive
```

The supplied notes explicitly list both **Agglomerative** and **Divisive** approaches. fileciteturn3file1L2-L3

---

# 5. Agglomerative Hierarchical Clustering

Agglomerative clustering is a **bottom-up** approach.

It starts with every observation as an individual cluster.

```text
Start:

P1   P2   P3   P4   P5   P6
│    │    │    │    │    │
C1   C2   C3   C4   C5   C6
```

Then the closest clusters are repeatedly merged.

```text
P1 + P2 → C12
P4 + P5 → C45
```

Then:

```text
C12 + P3 → C123
C45 + P6 → C456
```

Eventually:

```text
C123 + C456
       ↓
    One cluster
```

The supplied handwritten notes describe the steps as:

1. Initially consider every point as a separate cluster.
2. Find the nearest point/cluster and create a new cluster.
3. Continue until a single cluster is obtained. fileciteturn3file0L2-L3

---

# 6. Why Is Agglomerative Called Bottom-Up?

Because we begin with the smallest possible clusters:

```text
One point = one cluster
```

and gradually move upward:

```text
Points
 ↓
Pairs
 ↓
Small clusters
 ↓
Large clusters
 ↓
One cluster
```

Hence:

> **Agglomerative = Bottom-Up**

---

# 7. Divisive Hierarchical Clustering

Divisive clustering works in the opposite direction.

It is a **top-down** approach.

Start with all observations in one cluster:

```text
{P1,P2,P3,P4,P5,P6}
```

Then split:

```text
{P1,P2,P3}     {P4,P5,P6}
```

Then split again:

```text
{P1,P2} {P3}     {P4,P5} {P6}
```

Eventually:

```text
{P1} {P2} {P3} {P4} {P5} {P6}
```

Therefore:

> **Divisive = Top-Down**

---

# 8. Agglomerative vs Divisive

| Feature | Agglomerative | Divisive |
|---|---|---|
| Direction | Bottom-up | Top-down |
| Starting point | Every point is its own cluster | All points are one cluster |
| Operation | Merge | Split |
| Common practical usage | Very common | Less commonly used |
| Final state | One cluster | Individual clusters |

For the implementation supplied with the notes, **AgglomerativeClustering** is used.

---

# 9. The Main Idea Behind Agglomerative Clustering

The most important question is:

> **Which two clusters should be merged?**

To answer this, we need:

1. A distance measure
2. A linkage method

---

# 10. Distance Between Data Points

For numerical data, Euclidean distance is commonly used.

For two points:

\[
P=(x_1,y_1)
\]

and

\[
Q=(x_2,y_2)
\]

Euclidean distance is:

\[
\boxed{
d(P,Q)=
\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}
}
\]

Small distance:

```text
→ More similar
```

Large distance:

```text
→ Less similar
```

---

# 11. Why Distance Is Important

Suppose we have:

```text
P1 •
   |
   | small distance
   |
P2 •
```

P1 and P2 are close.

Therefore, they are candidates for being grouped together.

But:

```text
P1 •



                 P2 •
```

have a larger distance and are less likely to be merged early.

---

# 12. Feature Scaling

Distance-based clustering can be affected by feature scale.

Suppose:

```text
Age       → 20–60
Salary    → 20,000–2,00,000
```

Salary has a much larger numerical scale.

Therefore, Euclidean distances can be dominated by salary.

A common preprocessing step is:

```text
Raw Data
   ↓
StandardScaler
   ↓
Hierarchical Clustering
```

The supplied implementation uses `StandardScaler` before PCA and hierarchical clustering. fileciteturn3file1L2-L3

---

# 13. Linkage

When we have clusters containing multiple observations, the question becomes:

> How should we calculate the distance between two clusters?

This is handled by a **linkage criterion**.

Common linkage methods include:

- Single linkage
- Complete linkage
- Average linkage
- Ward linkage

The supplied implementation specifically uses:

```python
linkage='ward'
```

---

# 14. Single Linkage

Single linkage defines the distance between two clusters using the **closest pair of observations** between them.

Conceptually:

```text
Cluster A       Cluster B

A1 •             • B1
       ↘
        ↘ closest pair
         ↘
```

So:

\[
D(A,B)=
\min_{a\in A,b\in B}d(a,b)
\]

### Intuition

> If any two points from the two clusters are very close, the clusters may be considered close.

Single linkage can create elongated or chain-like clusters.

---

# 15. Complete Linkage

Complete linkage uses the **farthest pair** between two clusters.

\[
D(A,B)=
\max_{a\in A,b\in B}d(a,b)
\]

Intuition:

> Two clusters are considered close only when even their farthest points are not too far apart.

This tends to favor more compact clusters than single linkage.

---

# 16. Average Linkage

Average linkage calculates the average distance across pairs of observations between the two clusters.

\[
D(A,B)=
\frac{1}{|A||B|}
\sum_{a\in A}
\sum_{b\in B}
d(a,b)
\]

Intuition:

> Consider the overall average separation between the two clusters.

---

# 17. Ward Linkage

The supplied implementation uses:

```python
linkage='ward'
```

Ward linkage chooses merges based on the increase in **within-cluster variance / sum of squared deviations** resulting from a merge.

Intuitively:

> Merge the pair of clusters that causes the smallest increase in within-cluster variation.

This tends to favor compact, relatively spherical clusters.

For Ward linkage with Euclidean distance, the objective is closely related to minimizing within-cluster sum of squares.

---

# 18. Why Linkage Matters

Different linkage methods can produce different hierarchical structures.

For the same dataset:

```text
Single linkage
       ↓
One dendrogram

Complete linkage
       ↓
Different dendrogram

Ward linkage
       ↓
Potentially different dendrogram
```

Therefore, linkage is a modeling choice.

---

# 19. Step-by-Step Agglomerative Algorithm

Suppose we have:

```text
P1 P2 P3 P4 P5
```

### Step 1 — Initialize

Every point is a separate cluster:

```text
{P1} {P2} {P3} {P4} {P5}
```

---

### Step 2 — Calculate Distances

Calculate the relevant distances between clusters.

Initially, clusters contain one point each, so this is simply point-to-point distance.

---

### Step 3 — Find the Closest Pair

Suppose:

```text
P1 and P2
```

are closest.

Merge:

```text
{P1,P2}
```

Now:

```text
{P1,P2} {P3} {P4} {P5}
```

---

### Step 4 — Recalculate Cluster Distances

Now the cluster:

```text
{P1,P2}
```

contains two points.

Its distance to other clusters depends on the selected linkage method.

---

### Step 5 — Merge Again

Suppose:

```text
{P4} and {P5}
```

are closest.

Then:

```text
{P1,P2} {P3} {P4,P5}
```

---

### Step 6 — Continue

Continue merging until:

```text
{P1,P2,P3,P4,P5}
```

becomes one cluster.

---

# 20. Dendrogram

A **dendrogram** is a tree-like diagram that represents the sequence of merges in hierarchical clustering.

Example:

```text
Distance
  ↑
  │          ┌───────────────┐
  │      ┌───┤               │
  │      │   └───────┐       │
  │  ┌───┤           │       │
  │  │   │           │       │
  │  │   │           │       │
  └──┴───┴───────────┴───────→ Points
    P1  P2  P3       P4  P5
```

The vertical height at which two groups merge represents their linkage distance.

---

# 21. How to Read a Dendrogram

This is one of the most important concepts.

Look at the **height** of each merge.

```text
Low height
    ↓
Points/clusters are relatively close

High height
    ↓
Points/clusters are relatively far apart
```

Therefore:

> The higher the merge occurs, the greater the distance at which those groups were joined.

---

# 22. Dendrogram and Number of Clusters

A major advantage of the dendrogram is that we can choose the number of clusters by **cutting the dendrogram at a chosen distance threshold**.

Imagine:

```text
Distance
   ↑

   5 ────────────────
          │
   4 ────────────────
          │
   3 ────────
          │
   2 ──────
          │
   1 ──────
```

Draw a horizontal line at a selected threshold.

The number of vertical branches intersected by that line corresponds to the number of clusters.

---

# 23. Threshold Intuition

The handwritten notes explicitly emphasize:

> **Select the longest vertical line such that no horizontal line passes through it.**

They also label the threshold in terms of **Euclidean distance** and show that the selected threshold can determine a value such as:

```text
K = 2
```

or:

```text
K = 4
```

depending on where the dendrogram is cut. fileciteturn3file0L2-L3

The underlying intuition is:

```text
Choose a large vertical gap
        ↓
Place a horizontal cut
        ↓
Count resulting branches
        ↓
Number of clusters
```

---

# 24. Example of Choosing K from a Dendrogram

Suppose the dendrogram visually suggests:

```text
           ┌───────────────┐
       ┌───┤               │
       │   │               │
   ┌───┤   │               │
   │   │   │               │
───┴───┴───┴────────────────── threshold
   │       │
   C1      C2
```

If the horizontal threshold intersects two main vertical branches:

\[
\boxed{K=2}
\]

If it intersects four branches:

\[
\boxed{K=4}
\]

---

# 25. Dendrogram Does Not Mean K Is Fixed at the Beginning

This is an important conceptual difference from K-Means.

### K-Means

You generally specify:

```python
K = 4
```

before fitting the model.

### Hierarchical Clustering

You can:

```text
Build hierarchy
       ↓
Inspect dendrogram
       ↓
Choose a cut
       ↓
Obtain desired number of clusters
```

In practice, the implementation can still be configured with a chosen `n_clusters`, but the dendrogram provides a visual way to inspect the hierarchy before selecting the cut.

---

# 26. Why the Dendrogram Is Useful

The dendrogram gives us more information than simply:

```text
Cluster 1
Cluster 2
Cluster 3
```

It shows:

- Which observations merged first
- Which groups were close
- Which groups were far apart
- The sequence of merges
- Possible natural grouping levels
- Candidate numbers of clusters

---

# 27. Understanding the Supplied Diagram

The first page of the supplied handwritten notes shows:

```text
Original data points
        ↓
Hierarchical clustering
        ↓
Nested groups
        ↓
Dendrogram
        ↓
Threshold
        ↓
Number of clusters
```

The diagram also contrasts this with a K-Means-style grouping where `K=3` is specified and centroids are used. The handwritten note explicitly says **"No centroids"** for hierarchical clustering. fileciteturn3file0L2-L3

---

# 28. Hierarchical Clustering vs K-Means

The supplied notes emphasize **scalability and flexibility** as major comparison dimensions. fileciteturn3file0L3-L3

## 28.1 Dataset Size

### K-Means

Generally suitable for:

```text
Large datasets
```

because it is comparatively computationally efficient.

### Hierarchical Clustering

Generally more expensive as the number of observations increases because hierarchical methods often require substantial pairwise distance information.

Therefore:

```text
Huge dataset
    ↓
K-Means is often preferred

Small / moderate dataset
    ↓
Hierarchical clustering can be attractive
```

This is a practical rule of thumb rather than an absolute law.

---

# 29. Centroids

K-Means is centroid-based.

```text
Cluster
   ↓
Centroid
```

Hierarchical clustering does not fundamentally require cluster centroids.

Instead, it works through:

```text
Distance
+
Linkage
+
Merging/Splitting
```

This is why the handwritten notes mark **"No centroids"** for hierarchical clustering. fileciteturn3file0L2-L3

---

# 30. Type of Data

The handwritten notes contrast:

```text
K-Means → Numerical data

Hierarchical Clustering → Variety of data
```

The important practical qualification is that the exact distance representation must be appropriate for the data.

For standard numerical hierarchical clustering:

```text
Numerical features
       ↓
Distance matrix
       ↓
Hierarchical algorithm
```

For categorical, mixed, text, or other data types, an appropriate similarity/distance representation is required.

---

# 31. K-Means vs Hierarchical — Summary

| Feature | K-Means | Hierarchical |
|---|---|---|
| Basic idea | Partition data into K clusters | Build hierarchy of clusters |
| Centroids | Yes | Not fundamental |
| Need K beforehand | Usually yes | Can inspect dendrogram first |
| Main visualization | Cluster scatter plot | Dendrogram |
| Typical scalability | Better for large datasets | More expensive for large datasets |
| Main parameter | Number of clusters | Linkage + distance / cut |
| Output | Flat clusters | Hierarchical structure |
| Common use | Large-scale segmentation | Exploratory cluster analysis |

---

# 32. Practical Implementation — Iris Dataset

The supplied notebook uses the **Iris dataset**.

The workflow is:

```text
Iris Dataset
     ↓
Pandas DataFrame
     ↓
StandardScaler
     ↓
PCA → 2 dimensions
     ↓
Dendrogram
     ↓
Agglomerative Clustering
     ↓
Cluster Labels
     ↓
Silhouette Score
```

The notebook imports the Iris dataset and creates a DataFrame using the four Iris feature names. fileciteturn3file1L2-L3

---

# 33. Load Iris Dataset

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn import datasets

iris = datasets.load_iris()
```

The dataset contains four numerical features for each observation.

---

# 34. Create DataFrame

```python
iris_data = pd.DataFrame(iris.data)

iris_data.columns = iris.feature_names
```

Now:

```python
iris_data
```

contains the feature data.

---

# 35. Standardization

The notebook uses:

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
```

Then:

```python
X_scaled = scaler.fit_transform(iris_data)
```

This standardizes the feature space.

---

# 36. Why PCA Is Used in the Supplied Notebook

The notebook applies PCA:

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)

pca_scaled = pca.fit_transform(X_scaled)
```

This converts the four-dimensional Iris feature space into two dimensions.

```text
4 original features
        ↓
       PCA
        ↓
      PC1, PC2
```

This makes visualization easier.

> **Important:** PCA is not required for hierarchical clustering itself. It is used in this notebook primarily to reduce the Iris data to two dimensions for visualization and subsequent demonstration.

---

# 37. Visualize PCA Data

The notebook plots:

```python
plt.scatter(
    pca_scaled[:, 0],
    pca_scaled[:, 1],
    c=iris.target
)
```

This visualizes the observations in the two-dimensional PCA space.

The target is used to color the points for visualization.

It is not used to fit the unsupervised clustering model.

---

# 38. Constructing the Dendrogram

The notebook imports:

```python
import scipy.cluster.hierarchy as sc
```

Then:

```python
plt.figure(figsize=(20, 7))

plt.title("Dendograms")

sc.dendrogram(
    sc.linkage(
        pca_scaled,
        method='ward'
    )
)

plt.title('Dendogram')
plt.xlabel('Sample Index')
plt.ylabel('Eucledian Distance')
```

The important operation is:

```python
sc.linkage(pca_scaled, method='ward')
```

This computes the hierarchical linkage structure.

Then:

```python
sc.dendrogram(...)
```

visualizes it.

---

# 39. Why `method='ward'`?

The supplied implementation chooses:

```python
method='ward'
```

Ward linkage attempts to merge clusters while minimizing the increase in within-cluster variation.

The resulting dendrogram's vertical axis represents the linkage/dissimilarity level at which merges occur.

---

# 40. AgglomerativeClustering Implementation

The supplied notebook uses:

```python
from sklearn.cluster import AgglomerativeClustering

cluster = AgglomerativeClustering(
    n_clusters=2,
    affinity='euclidean',
    linkage='ward'
)
```

Then:

```python
cluster.fit(pca_scaled)
```

and:

```python
cluster.labels_
```

returns the assigned cluster labels.

---

# 41. Current scikit-learn Syntax Note

Depending on the scikit-learn version, `affinity` has been replaced by `metric` in `AgglomerativeClustering`.

A current-style equivalent is:

```python
cluster = AgglomerativeClustering(
    n_clusters=2,
    metric='euclidean',
    linkage='ward'
)
```

For Ward linkage, Euclidean distance is required.

The supplied notebook uses the older:

```python
affinity='euclidean'
```

syntax. The conceptual meaning remains the same.

---

# 42. Plot the Cluster Labels

The notebook uses:

```python
plt.scatter(
    pca_scaled[:, 0],
    pca_scaled[:, 1],
    c=cluster.labels_
)
```

This colors the observations according to their predicted cluster.

So the complete visualization is:

```text
PCA-transformed data
        ↓
Agglomerative clustering
        ↓
Cluster labels
        ↓
Scatter plot
```

---

# 43. Silhouette Score Validation

The supplied notebook then imports:

```python
from sklearn.metrics import silhouette_score
```

and evaluates multiple cluster counts.

The notebook uses:

```python
silhouette_coefficients = []

for k in range(2, 11):
    agglo = AgglomerativeClustering(
        n_clusters=k,
        affinity='euclidean',
        linkage='ward'
    )

    agglo.fit(X_scaled)

    score = silhouette_score(
        X_scaled,
        agglo.labels_
    )

    silhouette_coefficients.append(score)
```

Then it plots the scores against the number of clusters.

This connects hierarchical clustering with the Silhouette Score concept from the previous topic.

---

# 44. Why Does the Silhouette Loop Start at K = 2?

The supplied notebook comments:

```python
# Notice you start at 2 clusters for silhouette coefficient
```

A silhouette score requires at least two clusters because it compares:

```text
Own cluster
     vs
Nearest other cluster
```

With only one cluster, there is no "other cluster" against which to compare.

Therefore:

```text
K = 1 → not suitable for standard silhouette evaluation

K ≥ 2 → meaningful silhouette calculation
```

---

# 45. Important Detail in the Notebook

Notice the difference:

### Dendrogram

The notebook constructs it using:

```python
pca_scaled
```

### Silhouette evaluation

The notebook evaluates the clustering using:

```python
X_scaled
```

This means the notebook is using PCA-reduced data for visualization/dendrogram construction and the standardized original feature space for silhouette evaluation.

This is an important implementation detail to understand rather than accidentally assuming every stage uses exactly the same matrix.

---

# 46. Silhouette Score vs Dendrogram

These solve different problems.

### Dendrogram

Helps answer:

> **At what hierarchy/cut should I obtain clusters?**

### Silhouette Score

Helps answer:

> **How well-separated and cohesive are the resulting clusters?**

A useful workflow is:

```text
Dendrogram
    ↓
Candidate K
    ↓
Agglomerative Clustering
    ↓
Silhouette Score
    ↓
Validate candidate clustering
```

---

# 47. Example: Complete Workflow

Suppose the dendrogram suggests:

```text
K = 2
```

We train:

```python
model = AgglomerativeClustering(
    n_clusters=2,
    metric='euclidean',
    linkage='ward'
)

labels = model.fit_predict(X_scaled)
```

Then:

```python
score = silhouette_score(
    X_scaled,
    labels
)

print(score)
```

If the result is strong and the clusters make sense, K=2 is a reasonable candidate.

---

# 48. Testing Multiple Numbers of Clusters

A better practical approach is to test several values:

```python
scores = []

for k in range(2, 11):

    model = AgglomerativeClustering(
        n_clusters=k,
        metric='euclidean',
        linkage='ward'
    )

    labels = model.fit_predict(X_scaled)

    score = silhouette_score(
        X_scaled,
        labels
    )

    scores.append(score)
```

Then plot:

```python
plt.plot(
    range(2, 11),
    scores,
    marker='o'
)

plt.xlabel("Number of Clusters")
plt.ylabel("Silhouette Score")
plt.title("Silhouette Score for Hierarchical Clustering")
plt.show()
```

---

# 49. Complete Modern Implementation

```python
import pandas as pd
import matplotlib.pyplot as plt

from sklearn import datasets
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score

# Load Iris dataset
iris = datasets.load_iris()

X = pd.DataFrame(
    iris.data,
    columns=iris.feature_names
)

# Standardize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# PCA for visualization
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# Dendrogram
from scipy.cluster.hierarchy import dendrogram, linkage

Z = linkage(
    X_scaled,
    method="ward"
)

plt.figure(figsize=(20, 7))
dendrogram(Z)
plt.xlabel("Sample Index")
plt.ylabel("Distance")
plt.title("Hierarchical Clustering Dendrogram")
plt.show()

# Agglomerative clustering
model = AgglomerativeClustering(
    n_clusters=2,
    metric="euclidean",
    linkage="ward"
)

labels = model.fit_predict(X_scaled)

# Visualize clusters in PCA space
plt.scatter(
    X_pca[:, 0],
    X_pca[:, 1],
    c=labels
)

plt.xlabel("PC1")
plt.ylabel("PC2")
plt.title("Agglomerative Clustering")
plt.show()

# Silhouette score
score = silhouette_score(
    X_scaled,
    labels
)

print("Silhouette Score:", score)
```

---

# 50. Important Implementation Insight: Dendrogram Input

For a mathematically consistent clustering workflow, the dendrogram and final clustering should normally be based on the same feature representation unless there is a specific reason otherwise.

For example:

```python
Z = linkage(X_scaled, method="ward")
```

and:

```python
model.fit_predict(X_scaled)
```

means both stages use the standardized original feature space.

If PCA is deliberately being used as the clustering representation:

```python
Z = linkage(X_pca, method="ward")
```

and:

```python
model.fit_predict(X_pca)
```

then both stages use the PCA representation.

The supplied notebook deliberately uses PCA for the dendrogram but `X_scaled` for the silhouette loop, so keep that distinction in mind when studying the notebook.

---

# 51. Hierarchical Clustering with Different Linkages

Example:

```python
model = AgglomerativeClustering(
    n_clusters=3,
    metric="euclidean",
    linkage="single"
)
```

Complete:

```python
model = AgglomerativeClustering(
    n_clusters=3,
    metric="euclidean",
    linkage="complete"
)
```

Average:

```python
model = AgglomerativeClustering(
    n_clusters=3,
    metric="euclidean",
    linkage="average"
)
```

Ward:

```python
model = AgglomerativeClustering(
    n_clusters=3,
    metric="euclidean",
    linkage="ward"
)
```

Different linkages can produce different clustering structures.

---

# 52. When Should You Use Hierarchical Clustering?

Hierarchical clustering is particularly attractive when:

- Dataset size is small or moderate
- You want to explore cluster structure
- You want a hierarchy rather than only one flat partition
- A dendrogram is useful for interpretation
- You don't want to rely solely on a centroid-based approach
- You want to inspect multiple possible cluster granularities

---

# 53. When Might K-Means Be Better?

K-Means is often preferable when:

- Dataset is very large
- You need a relatively scalable clustering method
- Clusters are reasonably compact
- A centroid-based representation makes sense
- You want a straightforward production workflow

Again, these are practical tendencies, not absolute rules.

---

# 54. Advantages of Hierarchical Clustering

### 1. Provides a hierarchy

You don't get only one grouping.

You can inspect:

```text
2 clusters
3 clusters
4 clusters
...
```

from the same hierarchical structure.

### 2. Dendrogram is highly interpretable

It visually shows how observations/clusters are related through the merging process.

### 3. No centroid requirement

Unlike K-Means, it does not fundamentally rely on calculating cluster centroids.

### 4. Useful for exploratory analysis

It can reveal natural grouping structure.

---

# 55. Limitations

### 1. Computational cost

Hierarchical clustering can become expensive for large datasets.

### 2. Sensitive to linkage choice

Different linkage methods can produce different results.

### 3. Sensitive to distance representation

The distance metric should be appropriate for the data.

### 4. Early decisions can affect later hierarchy

In agglomerative clustering, once a merge is made, the hierarchy generally does not undo that merge.

### 5. Scaling can matter

For numerical distance-based clustering, features with very different scales can distort distances.

---

# 56. Important Concept: Irreversible Merges

Suppose:

```text
P1 + P2
```

are merged early.

Later, we discover that perhaps they would have fit better elsewhere.

Standard agglomerative clustering does not normally undo that earlier merge.

Therefore:

```text
Merge decision
      ↓
Part of hierarchy
      ↓
Future merges build on it
```

This is one reason linkage choice matters.

---

# 57. Dendrogram Vocabulary

| Term | Meaning |
|---|---|
| Leaf | Individual observation |
| Branch | Hierarchical connection |
| Merge | Combining clusters |
| Height | Distance/dissimilarity at merge |
| Cut/Threshold | Horizontal level used to select clusters |
| Cluster | Group formed after cutting hierarchy |

---

# 58. Common Mistakes

## Mistake 1 — Thinking hierarchical clustering requires K at the start

The hierarchy itself can be constructed first and the desired number of clusters can be selected by cutting the dendrogram.

---

## Mistake 2 — Thinking hierarchical clustering uses centroids

Not fundamentally.

It uses distances and linkage criteria.

---

## Mistake 3 — Thinking every linkage works the same way

No.

Single, complete, average, and Ward linkage define cluster distance differently.

---

## Mistake 4 — Forgetting scaling

If numerical features have very different ranges, distance calculations can become distorted.

---

## Mistake 5 — Treating PCA as mandatory

PCA is not required for hierarchical clustering.

It may be used for:

- Visualization
- Dimensionality reduction
- Noise/redundancy reduction

The supplied notebook uses PCA to visualize the Iris data.

---

## Mistake 6 — Assuming dendrogram height is always simply Euclidean point-to-point distance

The interpretation depends on the linkage method.

For Ward linkage, the merge criterion is related to the increase in within-cluster variance rather than simply the raw distance between two individual observations.

---

# 59. Interview Questions

### Q1. What is hierarchical clustering?

Hierarchical clustering is an unsupervised clustering technique that builds a hierarchy of nested clusters through repeated merging or splitting.

### Q2. What are the two types?

- Agglomerative
- Divisive

### Q3. What is agglomerative clustering?

A bottom-up approach that starts with each observation as its own cluster and repeatedly merges clusters.

### Q4. What is divisive clustering?

A top-down approach that starts with all observations in one cluster and repeatedly splits clusters.

### Q5. What is a dendrogram?

A tree-like visualization showing the hierarchy and sequence of cluster merges.

### Q6. How do you choose the number of clusters from a dendrogram?

Choose a horizontal threshold/cut and count the resulting branches/clusters. A large vertical gap can be a useful place to consider a cut.

### Q7. What is linkage?

A rule for determining the distance between two clusters.

### Q8. Name common linkage methods.

- Single
- Complete
- Average
- Ward

### Q9. What is Ward linkage?

Ward linkage selects merges that produce the smallest increase in within-cluster variation.

### Q10. Does hierarchical clustering use centroids?

Not fundamentally. It works using distances and linkage criteria.

### Q11. Why can K-Means be better for huge datasets?

K-Means is generally more scalable and computationally efficient than traditional hierarchical methods.

### Q12. Can Silhouette Score be used with hierarchical clustering?

Yes. Once cluster labels are produced, Silhouette Score can be calculated to assess cluster cohesion and separation.

---

# 60. 30-Second Interview Explanation

> **Hierarchical clustering is an unsupervised learning technique that creates a hierarchy of clusters. In agglomerative clustering, we start with every data point as an individual cluster and repeatedly merge the closest clusters based on a chosen distance and linkage criterion. The resulting hierarchy is visualized using a dendrogram. We can choose the number of clusters by cutting the dendrogram at an appropriate threshold, often looking for a large vertical gap. Common linkage methods include single, complete, average, and Ward. Unlike K-Means, hierarchical clustering does not fundamentally depend on centroids.**

---

# 61. K-Means vs Hierarchical — Interview Answer

> **K-Means is a centroid-based partitioning algorithm where we generally specify K and iteratively optimize cluster assignments around centroids. Hierarchical clustering instead builds a hierarchy of nested clusters using distances and linkage criteria. K-Means is usually more scalable for very large datasets, while hierarchical clustering is especially useful for exploratory analysis because its dendrogram shows the cluster structure at multiple levels.**

---

# 62. Complete Mental Model

```text
                 HIERARCHICAL CLUSTERING
                           │
                ┌──────────┴──────────┐
                │                     │
          Agglomerative             Divisive
                │                     │
           Bottom-Up               Top-Down
                │                     │
       Start with individual     Start with one
           clusters                cluster
                │                     │
             Merge                   Split
                │                     │
                └──────────┬──────────┘
                           │
                           ▼
                    Hierarchical Tree
                           │
                           ▼
                       Dendrogram
                           │
                           ▼
                    Choose Threshold
                           │
                           ▼
                    Number of Clusters
                           │
                           ▼
                   Validate with
                  Silhouette Score
```

---

# 63. Full Agglomerative Workflow

```text
                 DATA
                  │
                  ▼
          Data Preprocessing
                  │
                  ▼
           Feature Scaling
                  │
                  ▼
          Choose Distance
                  │
                  ▼
          Choose Linkage
                  │
                  ▼
       Each Point = Cluster
                  │
                  ▼
        Find Closest Clusters
                  │
                  ▼
             Merge Them
                  │
                  ▼
        Recalculate Distances
                  │
                  ▼
             Merge Again
                  │
                  ▼
             Continue
                  │
                  ▼
           One Large Cluster
                  │
                  ▼
              Dendrogram
                  │
                  ▼
          Choose Threshold
                  │
                  ▼
           Final Clusters
                  │
                  ▼
        Silhouette Validation
```

---

# 64. Quick Revision Sheet

```text
HIERARCHICAL CLUSTERING
│
├── Unsupervised learning
│
├── Two approaches
│   ├── Agglomerative → Bottom-Up
│   └── Divisive → Top-Down
│
├── Agglomerative
│   ├── Start: each point is a cluster
│   ├── Find closest clusters
│   ├── Merge
│   └── Repeat until one cluster
│
├── Distance
│   └── Euclidean is common for numerical data
│
├── Linkage
│   ├── Single
│   ├── Complete
│   ├── Average
│   └── Ward
│
├── Dendrogram
│   ├── Shows merge hierarchy
│   ├── Height = linkage/dissimilarity level
│   └── Horizontal cut → clusters
│
├── Unlike K-Means
│   ├── No fundamental centroid requirement
│   └── Doesn't require a flat K-based process from the beginning
│
└── Validation
    └── Silhouette Score
```

---

# 65. Final Takeaway

> **Hierarchical clustering builds a hierarchy of nested groups rather than directly producing only one flat clustering. In the common agglomerative approach, every point starts as its own cluster and the closest clusters are repeatedly merged according to a distance metric and linkage method. The resulting hierarchy is represented by a dendrogram, from which a threshold can be selected to obtain the desired number of clusters.**

The supplied handwritten notes emphasize exactly this progression: **Agglomerative/Divisive → start with separate clusters → repeatedly merge → dendrogram → choose a threshold → obtain the number of clusters**, and then compare hierarchical clustering with K-Means in terms of scalability, centroids, and data characteristics. fileciteturn3file0L2-L3

The supplied implementation demonstrates the same concepts using the Iris dataset, standardization, PCA for visualization, SciPy's `linkage(..., method='ward')` and `dendrogram`, `AgglomerativeClustering`, and Silhouette Score evaluation across different cluster counts. fileciteturn3file1L2-L3
