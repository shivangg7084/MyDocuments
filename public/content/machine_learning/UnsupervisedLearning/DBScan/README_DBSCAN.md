# DBSCAN Clustering — Complete Notes

> **Topic:** DBSCAN (Density-Based Spatial Clustering of Applications with Noise)  
> **Perspective:** Theory + intuition + `eps` + `min_samples` + core/border/noise points + density reachability + non-linear clusters + implementation + comparison with K-Means/Hierarchical Clustering + Silhouette validation  
> **Source basis:** Provided DBSCAN handwritten PDF and supplied DBSCAN implementation notebooks.

---

# 1. What is DBSCAN?

**DBSCAN** stands for:

> **Density-Based Spatial Clustering of Applications with Noise**

It is an **unsupervised clustering algorithm** that forms clusters by looking for regions of sufficiently high point density.

Unlike K-Means, DBSCAN does not fundamentally try to represent every cluster using a centroid.

Its central idea is:

```text
Dense region → Cluster
Sparse region → Separation
Very isolated points → Noise / Outliers
```

The supplied handwritten notes explicitly classify DBSCAN as a method useful for **non-linear clustering** and illustrate core points, border points, and outliers. fileciteturn4file0L2-L2

---

# 2. Why Do We Need DBSCAN?

Consider a dataset whose clusters are not approximately circular.

For example:

```text
        █████
      ████████
     ███

                 ███████
               █████████
```

K-Means is based on distances to centroids and often works best when clusters have relatively compact, centroid-friendly shapes.

DBSCAN instead asks:

> **Where are the dense regions of observations?**

This allows it to discover clusters with much more complicated shapes.

The handwritten notes show examples where DBSCAN can identify **non-linearly separable clusters**, including a curved / crescent-like structure that traditional centroid-based clustering can struggle to represent. fileciteturn4file0L2-L2

---

# 3. Core Idea of DBSCAN

DBSCAN has two especially important parameters:

```text
eps
min_samples
```

Think of them as:

### `eps`

> **How large is my neighborhood?**

### `min_samples`

> **How many observations are required in that neighborhood for the region to be considered dense?**

Together:

```text
eps + min_samples
        ↓
Density definition
        ↓
Core / Border / Noise classification
        ↓
Clusters
```

---

# 4. The `eps` Parameter

`eps` is the radius used to define a point's neighborhood.

Imagine a point `P`:

```text
             •
        •         •
      •      P      •
        •         •
             •
```

Draw a circle around P with radius:

\[
\boxed{\varepsilon}
\]

All points inside that neighborhood are considered when determining local density.

The handwritten notes explicitly illustrate a circular neighborhood around a point and label the radius as `ε`. fileciteturn4file0L2-L2

---

# 5. The `min_samples` Parameter

`min_samples` specifies the minimum number of samples required in the `eps` neighborhood for a point to qualify as a **core point**.

The supplied notes use:

```text
minPts = 4
```

as the running example. fileciteturn4file0L2-L2

A practical terminology note:

> Scikit-learn uses the parameter name `min_samples`, while many DBSCAN explanations use `MinPts` or `minPts`.

They refer to the same core idea.

---

# 6. Core Point

A **core point** lies in a sufficiently dense region.

Conceptually:

```text
Number of points in eps-neighborhood
                ≥ min_samples
```

Then the point is a:

\[
\boxed{\text{Core Point}}
\]

The supplied handwritten notes show a red core-point example with `minPts = 4`, where the neighborhood contains at least the required number of observations. fileciteturn4file0L2-L2

---

# 7. Border Point

A **border point** is not dense enough to be a core point itself, but it lies within the `eps` neighborhood of a core point.

Conceptually:

```text
Point P
  ↓
Does P have enough neighbors?
  ↓
No
  ↓
Is P reachable from a core point?
  ↓
Yes
  ↓
Border Point
```

The supplied notes illustrate a yellow border point whose local neighborhood contains fewer than `minPts`, while it can still belong to a nearby dense cluster. fileciteturn4file0L2-L2

---

# 8. Noise / Outlier Point

A point is treated as **noise** when it is not sufficiently dense and is not density-reachable from a core point.

Conceptually:

```text
Not a core point
        +
Not a border point
        ↓
Noise / Outlier
```

The handwritten notes explicitly show a blue outlier/noise point outside the dense groups. fileciteturn4file0L2-L2

---

# 9. The Three DBSCAN Point Types

| Point Type | Condition | Intuition |
|---|---|---|
| Core | Enough neighbors inside `eps` | Dense region |
| Border | Not core, but near a core point | Edge of a dense region |
| Noise | Neither core nor border | Isolated / insufficiently connected |

Memory trick:

```text
CORE
→ Dense enough

BORDER
→ Not dense enough itself,
  but attached to a core region

NOISE
→ Not attached to any dense region
```

---

# 10. Visual Intuition

Imagine:

```text
                    N
                    •
                   ( )
                 noise

        B •
          \
      • • • •
     • • C • •
      • • • •
```

Here:

- `C` is a core point
- `B` may be a border point
- `N` may be noise

The exact classification depends on `eps` and `min_samples`.

---

# 11. How DBSCAN Builds a Cluster

A simplified conceptual workflow is:

```text
Choose an unvisited point
        ↓
Find its eps-neighborhood
        ↓
Count neighboring samples
        ↓
Enough samples?
   ┌────┴────┐
  Yes        No
   ↓          ↓
Core point   May be
   ↓         border/noise
Expand cluster
   ↓
Visit density-connected points
   ↓
Continue expansion
   ↓
Finish cluster
```

The important idea is that a cluster grows through **dense connectivity**, not through a centroid.

---

# 12. Density-Based Intuition

Imagine points distributed like this:

```text
Cluster A                  Cluster B

••••••                    •••••
••••••                    •••••
••••••                    •••••


             x

          Noise
```

DBSCAN sees:

```text
High density        High density
    ↓                    ↓
Cluster A            Cluster B

Low-density gap
    ↓
Separates them

Isolated x
    ↓
Noise
```

This is the fundamental DBSCAN idea.

---

# 13. Density Reachability

DBSCAN uses the idea that points can be connected through sufficiently dense neighborhoods.

Suppose:

```text
P1 → P2 → P3 → P4
```

and each step remains inside a suitable dense neighborhood.

Then the cluster can expand along this chain.

This is why DBSCAN can follow:

```text
Curves
Arcs
Irregular shapes
Long connected regions
```

rather than only compact balls around centroids.

---

# 14. Why DBSCAN Can Find Non-Linear Clusters

Suppose the actual structure is:

```text
       • • • •
     •
    •
   •
   •
    •
     •
       • • • •
```

A centroid-based algorithm may struggle because the cluster is not approximately circular.

DBSCAN asks:

> Are these points connected through dense neighborhoods?

If yes, it can assign the entire curved structure to one cluster.

The supplied PDF explicitly shows non-linear clustering examples and contrasts DBSCAN with more traditional clustering approaches. fileciteturn4file0L2-L2

---

# 15. A Simple Numerical Example

Suppose:

```text
min_samples = 4
```

and a point has four samples in its neighborhood according to the chosen counting convention.

Then it can satisfy the core-point density requirement.

If another point has only:

```text
2 neighboring samples
```

it does not qualify as a core point.

If that second point is nevertheless within `eps` of a core point, it can be a border point.

If it is not connected to any core point:

```text
→ Noise
```

---

# 16. Important Counting Convention

When discussing DBSCAN manually, be careful about whether the point itself is included in the neighborhood count.

In common DBSCAN formulations and in scikit-learn's `min_samples` definition, the point itself is included in the count.

Therefore, if:

```text
min_samples = 4
```

a point can satisfy the core condition when its `eps` neighborhood contains at least 4 samples **including itself**.

This is an important implementation detail when solving examples by hand.

---

# 17. `eps` Too Small

Suppose:

```text
eps ↓
```

The neighborhood becomes tiny.

Then many points may fail to find enough neighbors.

Possible result:

```text
Many noise points
Few core points
Clusters may fragment
```

Visual idea:

```text
Small radius
     ↓
Very few neighbors
     ↓
Low estimated density
```

---

# 18. `eps` Too Large

Now suppose:

```text
eps ↑
```

The neighborhood becomes very large.

Points from different natural groups may become connected.

Possible result:

```text
Separate clusters merge
Noise decreases
Cluster boundaries become less meaningful
```

Therefore:

```text
eps too small → fragmentation / too much noise

eps too large → excessive merging
```

---

# 19. `min_samples` Too Small

If `min_samples` is very small:

```text
Few points required for density
        ↓
Many points become core points
        ↓
Clusters can grow aggressively
        ↓
Separate structures may become connected
```

---

# 20. `min_samples` Too Large

If `min_samples` is very large:

```text
Many neighbors required
        ↓
Few points qualify as core points
        ↓
More observations may become noise
        ↓
Clusters may disappear or fragment
```

---

# 21. Relationship Between `eps` and `min_samples`

These parameters should not be interpreted independently.

```text
eps
 ↓
Neighborhood size

min_samples
 ↓
Required density
```

Together they define what DBSCAN considers a dense region.

For example:

```text
Large eps + small min_samples
→ permissive density definition

Small eps + large min_samples
→ strict density definition
```

---

# 22. How to Choose `eps`

Choosing `eps` is one of the most important practical decisions.

A common technique is the **k-distance graph** / nearest-neighbor distance approach.

Conceptually:

```text
For each point
   ↓
Find distance to its kth nearest neighbor
   ↓
Sort these distances
   ↓
Plot them
   ↓
Look for a noticeable elbow/knee
   ↓
Candidate eps
```

For example, if:

```text
min_samples = 5
```

you may inspect the distance to the 5th nearest neighbor and look for a meaningful change in slope.

---

# 23. Why a k-Distance Graph Helps

Suppose sorted neighbor distances look like:

```text
0.10
0.11
0.12
0.13
0.14
0.15
0.16
0.18
0.22
0.35
0.60
0.90
```

The sharp rise may indicate a transition from:

```text
Dense cluster points
        ↓
Sparse/noise points
```

The knee can provide a useful starting estimate for `eps`.

It is a heuristic, not a guarantee.

---

# 24. Standard DBSCAN Workflow

```text
Raw Data
   ↓
Clean / preprocess
   ↓
Scale features if appropriate
   ↓
Choose distance metric
   ↓
Choose min_samples
   ↓
Estimate eps
   ↓
Run DBSCAN
   ↓
Core / Border / Noise
   ↓
Cluster labels
   ↓
Visualize
   ↓
Validate
```

---

# 25. Feature Scaling Is Important

DBSCAN uses distances.

Suppose:

```text
Age     → 18–70
Income  → 20,000–500,000
```

Income can dominate the distance calculation.

Therefore, for many numerical datasets:

```python
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

Then:

```python
DBSCAN(...)
```

can operate on a more balanced feature space.

The exact preprocessing should depend on the data and distance metric.

---

# 26. Python — Basic DBSCAN

Scikit-learn provides:

```python
from sklearn.cluster import DBSCAN
```

A basic model is:

```python
dbscan = DBSCAN(
    eps=0.5,
    min_samples=5
)

labels = dbscan.fit_predict(X_scaled)
```

The output:

```python
labels
```

contains the cluster assignment for each observation.

---

# 27. Meaning of DBSCAN Labels

A very important implementation detail:

```text
-1
```

usually represents:

> **Noise / outlier**

while:

```text
0, 1, 2, 3, ...
```

represent actual clusters.

Example:

```python
labels = [0, 0, 0, 1, 1, -1, 2, 2]
```

means:

```text
Cluster 0 → observations 1–3
Cluster 1 → observations 4–5
Noise     → observation 6
Cluster 2 → observations 7–8
```

---

# 28. Visualizing DBSCAN Results

For two-dimensional data:

```python
import matplotlib.pyplot as plt

plt.scatter(
    X_scaled[:, 0],
    X_scaled[:, 1],
    c=labels
)

plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.title("DBSCAN Clustering")
plt.show()
```

For high-dimensional data, PCA or another dimensionality-reduction technique can be used for visualization.

---

# 29. DBSCAN with PCA for Visualization

Suppose:

```text
Original dataset
      ↓
Many features
```

We can use PCA only for visualization:

```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)

X_pca = pca.fit_transform(X_scaled)
```

Then:

```python
plt.scatter(
    X_pca[:, 0],
    X_pca[:, 1],
    c=labels
)
```

Important:

> PCA is not required by DBSCAN. It is often used to visualize high-dimensional clustering results.

---

# 30. Evaluating DBSCAN with Silhouette Score

Silhouette Score can be used to evaluate clustering structure.

```python
from sklearn.metrics import silhouette_score

score = silhouette_score(
    X_scaled,
    labels
)

print(score)
```

However, there is an important caveat:

> **Noise points labeled `-1` should be handled thoughtfully when using internal clustering metrics.**

If the objective is to evaluate only the formed clusters, one common approach is to exclude noise observations from the metric calculation.

Example:

```python
mask = labels != -1

score = silhouette_score(
    X_scaled[mask],
    labels[mask]
)

print(score)
```

But this changes the interpretation: the score now evaluates the non-noise observations only.

---

# 31. Why Silhouette Score Is Different for DBSCAN

For K-Means:

```text
Almost every point belongs to one of K clusters.
```

For DBSCAN:

```text
Some points may intentionally be labeled noise.
```

Therefore, you need to think about:

```text
Clusters
+
Noise
```

when choosing an evaluation strategy.

A high silhouette score among non-noise points does not tell you whether DBSCAN labeled an excessive number of observations as noise.

So also inspect:

```text
Number of clusters
+
Noise proportion
+
Cluster sizes
+
Visual structure
+
Domain usefulness
```

---

# 32. DBSCAN vs K-Means

| Feature | K-Means | DBSCAN |
|---|---|---|
| Basic idea | Centroid-based | Density-based |
| Need K? | Yes, generally | No |
| Centroids | Yes | No |
| Handles noise | Poorly by design | Yes |
| Non-linear shapes | Limited | Strong advantage |
| Outlier detection | Not a primary feature | Built-in noise labeling |
| Cluster shape | Often compact/spherical | Can be arbitrary |
| Large datasets | Generally scalable | Can be efficient, but depends on implementation/data |
| Main parameters | `n_clusters` | `eps`, `min_samples` |

---

# 33. DBSCAN vs Hierarchical Clustering

| Feature | Hierarchical | DBSCAN |
|---|---|---|
| Main idea | Build hierarchy | Find dense regions |
| Dendrogram | Yes | No |
| Centroids | Not fundamental | No |
| Noise detection | Not inherent | Yes |
| Non-linear shapes | Can handle depending on linkage | Strong advantage |
| Main choices | Linkage + distance + cut | `eps` + `min_samples` |
| Output | Hierarchy / clusters | Clusters + noise |

---

# 34. When DBSCAN Is Especially Useful

DBSCAN is attractive when:

- You expect irregular cluster shapes
- Outliers/noise are important
- You do not know the number of clusters beforehand
- Dense regions are meaningful
- Cluster boundaries are better described by connectivity than centroids

Examples:

### Geographic data

```text
GPS locations
     ↓
Dense regions
     ↓
Places / zones
```

### Fraud/anomaly exploration

```text
Dense normal behavior
+
isolated observations
```

### Image or spatial data

```text
Pixels / coordinates
      ↓
Spatially dense regions
```

### Customer behavior

```text
Dense behavioral groups
+
unusual customers
```

---

# 35. A Major Limitation — Varying Density

Standard DBSCAN can struggle when different clusters have very different densities.

Imagine:

```text
Cluster A → extremely dense

Cluster B → moderately dense
```

A single global `eps` and `min_samples` may not describe both perfectly.

You may end up with:

```text
Cluster A → okay

Cluster B → fragmented or merged
```

This is an important limitation.

---

# 36. Another Limitation — High Dimensions

Distance-based density estimation can become difficult in high-dimensional spaces because distances can become less informative.

Therefore:

```text
Very high-dimensional data
        ↓
Distance quality can degrade
        ↓
DBSCAN parameter selection becomes harder
```

Dimensionality reduction or a suitable representation may sometimes help, but it should be chosen carefully.

---

# 37. DBSCAN Is Not Just "K-Means Without K"

This is an important conceptual distinction.

K-Means asks:

> Which centroid is this point closest to?

DBSCAN asks:

> Is this point part of a sufficiently dense connected region?

Therefore:

```text
K-Means
→ Centroid geometry

DBSCAN
→ Density geometry
```

---

# 38. DBSCAN Does Not Need the Number of Clusters

K-Means generally requires:

```python
n_clusters=3
```

DBSCAN instead uses:

```python
eps=...
min_samples=...
```

The number of clusters emerges from the density structure.

Example:

```text
Input:
eps
min_samples

Output:
Cluster 0
Cluster 1
Cluster 2
Noise
```

You don't explicitly say:

```text
K = 3
```

before running the algorithm.

---

# 39. DBSCAN Step-by-Step Example

Suppose:

```text
min_samples = 4
```

and:

```text
eps = 1.0
```

We inspect point P.

### Step 1

Draw radius:

```text
        •
     •  P  •
        •
```

### Step 2

Count samples in the neighborhood.

Suppose:

```text
5 samples
```

### Step 3

Since:

\[
5\geq4
\]

P is a:

```text
Core Point
```

### Step 4

Expand the cluster through other density-connected points.

### Step 5

If a neighboring point does not itself satisfy the density requirement but is reachable from P:

```text
Border Point
```

### Step 6

A distant isolated point:

```text
Noise
```

---

# 40. Understanding the Supplied Handwritten Diagram

The provided DBSCAN PDF uses:

```text
minPts = 4
ε = ...
```

and visually marks:

```text
Red   → Core point
Yellow → Border point
Blue  → Outlier / noise
```

It also shows overlapping neighborhood circles and illustrates how dense connected observations form a cluster. fileciteturn4file0L2-L2

This diagram is especially useful because it shows that DBSCAN does not require a cluster to be a simple circle around a centroid.

---

# 41. Important Practical Parameter Strategy

A reasonable starting workflow is:

```text
1. Scale features when appropriate
        ↓
2. Choose a candidate min_samples
        ↓
3. Create k-distance graph
        ↓
4. Estimate eps
        ↓
5. Run DBSCAN
        ↓
6. Inspect number of clusters
        ↓
7. Inspect noise percentage
        ↓
8. Inspect cluster sizes
        ↓
9. Calculate suitable validation metrics
        ↓
10. Check domain meaning
```

---

# 42. Choosing `min_samples`

There is no universally optimal value.

It depends on:

- Dataset size
- Dimensionality
- Expected density
- Noise level
- Business/domain context

A practical heuristic is to use a value related to dimensionality as a starting point, then validate experimentally.

Do not treat any heuristic as a guaranteed optimal setting.

---

# 43. Hyperparameter Search

You can systematically try combinations:

```python
eps_values = [0.2, 0.3, 0.4, 0.5]
min_samples_values = [3, 5, 7, 10]
```

For each combination:

```text
Fit DBSCAN
    ↓
Count clusters
    ↓
Calculate noise proportion
    ↓
Calculate suitable clustering metrics
    ↓
Inspect results
```

This is usually more reliable than choosing parameters from one formula alone.

---

# 44. Example Parameter Comparison

Suppose:

| `eps` | `min_samples` | Clusters | Noise % | Silhouette* |
|---:|---:|---:|---:|---:|
| 0.20 | 5 | 6 | 31% | 0.41 |
| 0.30 | 5 | 4 | 15% | 0.57 |
| 0.40 | 5 | 3 | 8% | 0.63 |
| 0.70 | 5 | 1 | 1% | — |

A reasonable candidate might be:

```text
eps = 0.40
min_samples = 5
```

because it balances:

```text
Useful number of clusters
+
Low noise
+
Strong separation
```

But the final choice should depend on the actual application.

`Silhouette*` should be interpreted with care if noise is present.

---

# 45. Common Mistakes

## Mistake 1 — Thinking `eps` means "number of clusters"

Wrong.

```text
eps → neighborhood radius
```

---

## Mistake 2 — Thinking `min_samples` means minimum cluster size

Not exactly.

It defines the local density requirement for identifying core points.

A final DBSCAN cluster can contain many more observations than `min_samples`.

---

## Mistake 3 — Thinking every point must belong to a cluster

No.

DBSCAN explicitly allows:

```text
Noise = -1
```

---

## Mistake 4 — Forgetting scaling

Because DBSCAN relies on distances, feature scale can strongly influence results.

---

## Mistake 5 — Choosing `eps` randomly

Parameter selection should be informed by the distance structure, such as a k-distance graph, followed by empirical validation.

---

## Mistake 6 — Assuming highest silhouette always wins

For DBSCAN, also consider:

```text
Noise percentage
Cluster count
Cluster sizes
Density structure
Business meaning
```

---

## Mistake 7 — Thinking DBSCAN works equally well for every density

A single global density threshold can struggle when clusters have very different densities.

---

# 46. Interview Questions

## Q1. What does DBSCAN stand for?

**Density-Based Spatial Clustering of Applications with Noise.**

---

## Q2. Is DBSCAN supervised or unsupervised?

Unsupervised.

---

## Q3. What are the main parameters?

```text
eps
min_samples
```

---

## Q4. What is `eps`?

The radius defining the neighborhood around a point.

---

## Q5. What is `min_samples`?

The minimum number of samples in the `eps` neighborhood required for a point to satisfy the core-point density condition.

---

## Q6. What is a core point?

A point with enough samples in its `eps` neighborhood to satisfy `min_samples`.

---

## Q7. What is a border point?

A non-core point that lies within the `eps` neighborhood of a core point.

---

## Q8. What is a noise point?

A point that is neither a core point nor density-connected to a core point.

---

## Q9. Does DBSCAN require K?

No.

The number of clusters emerges from the density structure.

---

## Q10. Does DBSCAN use centroids?

No.

It is density-based rather than centroid-based.

---

## Q11. Why is DBSCAN good for non-linear clusters?

Because clusters are formed through density connectivity rather than distance to a centroid, allowing irregular shapes.

---

## Q12. Can DBSCAN identify outliers?

Yes. Points that are not part of any sufficiently dense region can be labeled as noise (`-1` in scikit-learn).

---

## Q13. What happens if `eps` is too small?

Many points may become noise and clusters may fragment.

---

## Q14. What happens if `eps` is too large?

Distinct clusters may merge.

---

## Q15. What happens if `min_samples` is too high?

Fewer points qualify as core points, potentially producing excessive noise or fragmented clusters.

---

## Q16. What is a major limitation of DBSCAN?

It can struggle with clusters having significantly different densities and can become difficult to tune in high-dimensional spaces.

---

# 47. 30-Second Interview Explanation

> **DBSCAN is a density-based unsupervised clustering algorithm that groups points based on local density rather than centroids. It mainly uses two parameters: `eps`, which defines the neighborhood radius, and `min_samples`, which defines the minimum density required for a point to be considered a core point. DBSCAN classifies observations as core, border, or noise. Starting from core points, it expands clusters through density-connected observations. Its major advantage is that it can discover non-linear cluster shapes and identify noise, while it does not require the number of clusters in advance. Its main limitations are sensitivity to `eps` and `min_samples`, difficulty with varying-density clusters, and challenges in high-dimensional spaces.**

---

# 48. DBSCAN vs All Three Clustering Algorithms

| Property | K-Means | Hierarchical | DBSCAN |
|---|---|---|---|
| Type | Unsupervised | Unsupervised | Unsupervised |
| Main principle | Centroid | Hierarchy + distance | Density |
| Need K | Yes | Can infer via dendrogram cut | No |
| Centroid | Yes | No fundamental requirement | No |
| Dendrogram | No | Yes | No |
| Noise detection | No | Not inherent | Yes |
| Non-linear shapes | Limited | Possible | Strong |
| Main parameters | `n_clusters` | Linkage + distance/cut | `eps`, `min_samples` |
| Scalability | Generally strong | Often weaker | Data/implementation dependent |
| Best intuition | Center | Tree | Density |

---

# 49. Connection with Silhouette Score

You have now learned:

```text
K-Means
     ↓
Centroid-based clustering

Hierarchical
     ↓
Hierarchy + dendrogram

DBSCAN
     ↓
Density-based clustering

Silhouette Score
     ↓
Clustering validation
```

Silhouette Score can be used as one of the internal evaluation tools after obtaining cluster labels.

However:

> For DBSCAN, don't ignore the meaning of the noise label `-1`.

A model with an extremely high silhouette among a tiny subset of non-noise observations may not be useful if it classifies most of the dataset as noise.

---

# 50. Complete Mental Model

```text
                    DBSCAN
                      │
             Density-based method
                      │
          ┌───────────┴───────────┐
          │                       │
         eps                 min_samples
          │                       │
 Neighborhood radius       Required local density
          │                       │
          └───────────┬───────────┘
                      ▼
                Point classification
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
        CORE        BORDER       NOISE
          │           │           │
          │           │           └── -1
          │           │
          └─────┬─────┘
                ▼
       Density-connected region
                │
                ▼
             CLUSTER
```

---

# 51. Final Takeaway

> **DBSCAN finds clusters by identifying dense regions and connecting observations through density. Its two key parameters are `eps`, which defines the neighborhood radius, and `min_samples`, which defines the local density required for a core point. Points can be classified as core, border, or noise. Because DBSCAN follows density connectivity instead of centroids, it can discover irregular and non-linear cluster shapes and naturally identify isolated observations as noise.**

The supplied handwritten PDF emphasizes exactly these ideas: `minPts = 4`, an `ε`-neighborhood, **core/border/outlier** point types, and examples of DBSCAN identifying **non-linearly separable clusters**. fileciteturn4file0L2-L2
