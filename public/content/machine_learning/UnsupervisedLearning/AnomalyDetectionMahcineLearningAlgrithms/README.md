# Anomaly Detection — Complete Notes

> **Topic:** Anomaly / Outlier Detection using Unsupervised Machine Learning
> **Perspective:** Theory + Geometric Intuition + Mathematical Intuition + Scikit-learn Implementation
> **Source basis:** Handwritten notes `1.0-Anomaly+Detection+Isolation+Forest.pdf`, `3.0-Local+Outlier+Factor+Anamoly+Detection.pdf`, and the notebooks `Isolation+Anamoly+Detection.ipynb`, `DBSCAN+Implementation+(1).ipynb`.

---

# 1. What is Anomaly Detection?

**Anomaly Detection** is the task of finding data points that **do not follow the pattern of the majority of the data**. Such points are called:

```text
Anomalies  =  Outliers  =  Novelties  =  Abnormal points
```

The handwritten notes define it simply as:

> Anomaly Detection → **To detect outliers**

Consider a dataset of `Height` vs `Weight`:

```text
Weight
  ^
  |            (x)      <- far away from everyone else
  |        (x)          <- far away from everyone else
  |
  |   x x x x
  |  x  x   x           <- the dense "normal" region
  |   x   x
  +-------------------> Height
```

Most points sit inside one dense cloud. The two circled points sit far away from that cloud. Those are the **outliers**.

---

## 1.1 A Tabular Example (from the notes)

The notes use a small IPL-style table:

| Match | Runs |
| ----: | ---: |
|     1 |   15 |
|     2 |   10 |
|     3 |   12 |
|     4 |  100 |

Matches 1–3 all fall in the 10–15 range. Match 4 with **100 runs** breaks the pattern completely — it is an anomaly for this batter's usual scoring behaviour.

A rule such as `runs > 36` would flag it. But hand-written thresholds do not scale to 50 features, so we use algorithms that learn the notion of "normal" from the data itself.

---

## 1.2 Why Does Anomaly Detection Matter?

The notes highlight that outliers **play an important role**. In practice this matters in two opposite ways:

**Case A — The anomaly is the signal (we want to find it):**

* Credit card fraud detection
* Network intrusion / cyber-attack detection
* Manufacturing defect detection
* Healthcare: abnormal patient vitals or readings
* Sensor / IoT failure detection

**Case B — The anomaly is noise (we want to remove it):**

* Outliers distort the **mean**, **variance**, and **standard deviation**
* Distance-based models (KNN, K-Means, SVM) get pulled toward outliers
* Linear Regression coefficients get skewed because squared error punishes far points heavily
* Scalers such as `StandardScaler` and `MinMaxScaler` get their statistics corrupted

So anomaly detection is used both as a **final product** (fraud alerts) and as a **preprocessing step** (data cleaning).

---

## 1.3 Types of Outliers

The Local Outlier Factor notes explicitly split outliers into two categories:

```text
1. Global Outlier
2. Local Outlier
```

**Global Outlier** — a point that is far away from **every** cluster in the dataset. Easy to detect: it is extreme in the global sense.

**Local Outlier** — a point that is *not* globally extreme, but is abnormal **relative to its own neighbourhood**. It may sit between two clusters, or on the sparse edge of a dense cluster.

```text
  ^
  |                          x x x x
  |                        x x x x x        <- Cluster B (sparse, spread out)
  |                          x x x
  |                    (x)                  <- LOCAL outlier: close to B in
  |                                            absolute distance, but far
  |             (x)                            relative to B's own density
  |     x x x x
  |    x x x x x                            <- Cluster A (very dense)
  |     x x x x
  +----------------------------------->
```

This distinction is the entire reason Local Outlier Factor exists — algorithms that use one global threshold detect global outliers but **miss local outliers**.

---

## 1.4 Why Unsupervised?

In a supervised setting we would need a labelled column `is_fraud = 0/1`. In reality:

* Anomalies are **rare** (often < 1% of rows) → severe class imbalance
* Anomalies are **not labelled** — nobody has marked them
* New types of anomalies appear that were never seen before

So we use **unsupervised** algorithms that model "what normal looks like" and flag anything that does not fit.

The three algorithms covered in this folder:

| # | Algorithm                  | Core Idea                                            |
| - | -------------------------- | ---------------------------------------------------- |
| 1 | **Isolation Forest**       | Outliers are **easy to isolate** with random splits   |
| 2 | **DBSCAN**                 | Outliers belong to **no dense region** (noise points) |
| 3 | **Local Outlier Factor**   | Outliers have **lower local density** than neighbours |

---

# 2. Isolation Forest

## 2.1 Core Intuition

Isolation Forest is built from **Decision Trees**, but with a twist. Instead of asking:

> "How do I group similar points together?"

it asks:

> "How **quickly** can I separate this single point from everything else?"

The key insight from the notes:

```text
Isolation Forest  →  [ Decision Trees ]  →  Many Trees  →  Isolation Trees
```

**Anomalies are few and different.** Because they sit in sparse regions, a few random splits are enough to fence them off alone. Normal points sit in dense regions, so it takes many splits to cut one away from its crowded neighbours.

```text
f2
 ^                x x (x)   <- outlier region: one cut isolates it
 |     |     |
 |  x  |  x  |
 |    x|     |
 |  x  |  x  |              <- dense region: needs many cuts
 |     |  x x|
 +---------------> f1
```

So:

* **Outlier** → isolated near the **top** of the tree → **short path length**
* **Normal point** → isolated deep down → **long path length**

The notes show exactly this: the outlier ends up **isolated as a leaf node** very early in the tree.

---

## 2.2 How an Isolation Tree Is Built

Given a dataset with features `f1, f2, f3, f4`:

```text
Step 1: Randomly select a feature                  -> say f2
Step 2: Randomly select a split value between
        min(f2) and max(f2)                        -> say f2 = 3.7
Step 3: Split the data into left / right
Step 4: Repeat recursively on each side until
          - the node has a single point, OR
          - the height limit is reached
Step 5: Record the depth h(x) at which each
        point became isolated
Step 6: Repeat Steps 1-5 for n_estimators trees
        (default = 100) -> the "Forest"
```

Note there is **no target variable** and **no information gain / Gini calculation** — the splits are purely random. This is what makes Isolation Forest extremely fast, with linear time complexity and low memory.

Every tree gives a different path length for the same point, so we average `h(x)` over all trees. That average is `E[h(x)]`.

---

## 2.3 The Anomaly Score (Mathematical Formula)

The boxed formula from the handwritten notes:

```text
                    - E[h(x)] / c(m)
        s(x, m) = 2
```

Where:

| Symbol    | Meaning                                                          |
| --------- | ---------------------------------------------------------------- |
| `x`       | The data point being scored                                      |
| `m`       | Number of data points (sub-sample size used to build each tree)   |
| `h(x)`    | Path length / search depth of `x` in one isolation tree           |
| `E[h(x)]` | **Average search depth** for `x` across all the isolation trees   |
| `c(m)`    | **Average depth** of an unsuccessful search in a tree of `m` points — the normalising constant |

`c(m)` comes from the average path length of an unsuccessful search in a Binary Search Tree:

```text
c(m) = 2 * H(m - 1) - (2 * (m - 1) / m)

where H(i) = ln(i) + 0.5772156649   (Euler-Mascheroni constant)
```

### Reading the score

The notes give the two limiting cases:

```text
E[h(x)] << c(m)   =>   s(x, m) ~= 1     =>   Anomaly score high   =>   OUTLIER
E[h(x)] >> c(m)   =>   s(x, m) ~= 0.5   =>   NORMAL data point
```

Summarised:

| Condition                | Score `s(x, m)` | Interpretation                         |
| ------------------------ | --------------- | -------------------------------------- |
| Path much shorter than average | close to **1**  | Strong anomaly                   |
| Path close to average          | around **0.5**  | Normal point                     |
| Path much longer than average  | close to **0**  | Very deep inside a dense cluster |

**Threshold used in the notes: `s(x, m) >= 0.5` leans toward anomaly**, with scores approaching 1 being confident outliers.

> Note on scikit-learn: `clf.score_samples(X)` returns the **negative** of this score, and `clf.decision_function(X)` returns `score_samples` shifted so that **negative values = outliers** and positive values = inliers. The sign convention is flipped compared to the formula above, but the ordering is identical.

---

## 2.4 Implementation (from `Isolation+Anamoly+Detection.ipynb`)

### Step 1 — Load the data

```python
import pandas as pd

df = pd.read_csv('healthcare.csv')
df.head()
```

```text
          0         1
0  1.616671  1.944522
1  1.256461  1.609444
2 -2.343919  4.392961
3  1.195393  2.794485
4 -3.329586  5.303160
```

A two-column, purely numerical dataset — easy to visualise in 2D.

If you do not have `healthcare.csv`, you can reproduce an equivalent dataset:

```python
import numpy as np
import pandas as pd
from sklearn.datasets import make_blobs

rng = np.random.RandomState(42)

X, _ = make_blobs(n_samples=200, centers=2, cluster_std=1.0, random_state=42)
outliers = rng.uniform(low=-10, high=10, size=(50, 2))     # injected anomalies

df = pd.DataFrame(np.vstack([X, outliers]))
print(df.shape)          # (250, 2)
```

### Step 2 — Visualise the raw data

```python
import matplotlib.pyplot as plt

plt.scatter(df.iloc[:, 0], df.iloc[:, 1])
plt.xlabel("Feature 0")
plt.ylabel("Feature 1")
plt.title("Raw data")
plt.show()
```

You will see a dense core with scattered points around it. Those scattered points are what the algorithm must find.

### Step 3 — Fit the Isolation Forest

```python
from sklearn.ensemble import IsolationForest

clf = IsolationForest(contamination=0.2)
clf.fit(df)

predictions = clf.predict(df)
```

### Step 4 — Read the predictions

```python
predictions
```

```text
array([ 1,  1,  1,  1, -1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,
        1,  1,  1, -1,  1,  1,  1, -1,  1,  1,  1,  1,  1, ...])
```

**Output convention — this is the single most important thing to remember:**

```text
 1  ->  Inlier   (normal point)
-1  ->  Outlier  (anomaly)
```

### Step 5 — Extract the anomaly indices

```python
import numpy as np

index = np.where(predictions < 0)
index
```

```text
(array([  4,  20,  24,  45,  48,  49,  53,  55,  61,  62,  63,  67,  72,
         74,  78,  83,  85,  87,  92,  97, 108, 114, 119, 126, 130, 132,
        133, 141, 151, 160, 166, 167, 177, 179, 182, 187, 190, 197, 199,
        204, 209, 212, 214, 217, 220, 221, 227, 242, 247, 248]),)
```

50 anomalies were flagged out of 250 rows — exactly the 20% requested through `contamination=0.2`.

### Step 6 — Plot the detected anomalies

```python
x = df.values

index = np.where(predictions < 0)

plt.scatter(df.iloc[:, 0], df.iloc[:, 1])                 # all points
plt.scatter(x[index, 0], x[index, 1], edgecolors="r")     # highlight anomalies
plt.title("Isolation Forest — detected anomalies outlined in red")
plt.show()
```

The highlighted points are the ones sitting away from the dense core.

### Step 7 — Inspect the continuous scores

```python
scores = clf.decision_function(df)     # negative = more anomalous
raw    = clf.score_samples(df)         # the -s(x, m) value from the formula

result = pd.DataFrame({
    "feature_0": df.iloc[:, 0],
    "feature_1": df.iloc[:, 1],
    "score":     scores,
    "label":     predictions
})

print(result.sort_values("score").head(10))    # the 10 most anomalous rows
```

Sorting by score is more useful than the hard `-1 / 1` label, because it lets you take "the top 20 most suspicious transactions" instead of committing to a fixed contamination rate.

---

## 2.5 Important Parameters

```python
IsolationForest(
    n_estimators=100,      # number of isolation trees in the forest
    max_samples='auto',    # sub-sample size m per tree ('auto' = min(256, n_samples))
    contamination='auto',  # expected proportion of outliers -> sets the threshold
    max_features=1.0,      # fraction of features considered per split
    bootstrap=False,       # sample with replacement
    random_state=42,       # REQUIRED for reproducible results (splits are random)
    n_jobs=-1              # parallelism
)
```

| Parameter       | Effect                                                                              |
| --------------- | ----------------------------------------------------------------------------------- |
| `contamination` | The **only** parameter that changes how many points get labelled `-1`. Set it from domain knowledge (e.g. 0.01 if fraud is ~1%). It does not change the scores, only the cut-off. |
| `n_estimators`  | More trees = more stable `E[h(x)]`. 100 is usually plenty.                            |
| `max_samples`   | Small sub-samples are a feature, not a bug — they reduce *swamping* and *masking*.     |
| `random_state`  | Without it, you get different anomalies on every run.                                 |

### A note on the warning seen in the notebook

```text
UserWarning: X does not have valid feature names, but IsolationForest was fitted with feature names
```

This appears when you `fit` on a **DataFrame** (which carries column names) but `predict` on a NumPy array, or when the column names are integers. It is harmless. To silence it, be consistent:

```python
clf.fit(df)
predictions = clf.predict(df)          # DataFrame in both calls -> no warning
```

---

## 2.6 Strengths and Weaknesses

**Strengths**

* Very fast — linear time, low memory, scales to large and high-dimensional data
* No distance or density computation required
* No need to scale features (splits are per-feature and random)
* Works well when anomalies are **few and different**

**Weaknesses**

* Struggles with **local** outliers — it is a global method
* Random splits are axis-parallel, so diagonally-shaped clusters are handled poorly
* `contamination` must be guessed if you have no domain knowledge
* Results vary run to run unless `random_state` is fixed

---

# 3. DBSCAN for Anomaly Detection

## 3.1 Why DBSCAN Appears in This Folder

**DBSCAN (Density-Based Spatial Clustering of Applications with Noise)** is primarily a clustering algorithm, but the "N" in its name — **Noise** — is what makes it an anomaly detector.

DBSCAN assigns every point to a cluster **except** the ones that fall in no dense region. Those get the label:

```text
label = -1   ->   Noise   ->   Anomaly
```

Unlike K-Means, DBSCAN is **not forced to assign every point to a cluster**. That refusal is exactly the anomaly signal.

---

## 3.2 The Three Point Types

DBSCAN needs two hyperparameters:

* **`eps`** — the radius of the neighbourhood around a point
* **`min_samples`** — the minimum number of points required inside that radius to call the region "dense"

Given these, every point is classified as:

| Type              | Definition                                                                 |
| ----------------- | -------------------------------------------------------------------------- |
| **Core point**    | Has at least `min_samples` points within distance `eps`                     |
| **Border point**  | Has fewer than `min_samples` neighbours, but lies within `eps` of a core point |
| **Noise point**   | Neither core nor border — belongs to nothing → **this is the anomaly**       |

```text
        . . . .
      . C C C C .          C = core point (dense neighbourhood)
      . C C C C .          B = border point (edge of the cluster)
        B C C B
          . .                        (x)   <- N = noise point = ANOMALY
```

---

## 3.3 Implementation (from `DBSCAN+Implementation+(1).ipynb`)

### Step 1 — Create a non-convex dataset

```python
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons
from sklearn.datasets import make_circles
import matplotlib.pyplot as plt
%matplotlib inline

X, y = make_circles(n_samples=750, factor=0.3, noise=0.1)
```

`make_circles` produces one small circle nested inside a large circle. This shape is deliberately chosen: **K-Means cannot solve it**, because K-Means draws straight boundaries around centroids, and the inner circle has no separable centroid from the outer ring.

### Step 2 — Visualise

```python
plt.scatter(X[:, 0], X[:, 1])
plt.title("make_circles — two concentric rings")
plt.show()
```

### Step 3 — Fit DBSCAN

```python
from sklearn.cluster import DBSCAN

dbcan = DBSCAN(eps=0.1)
dbcan.fit_predict(X)
```

```text
array([ 0,  0,  0,  1,  1,  1,  0,  2,  3,  1,  4,  3,  4,  0,  0,  0,  0,
       -1,  0,  0, -1,  3,  0,  0,  2,  4,  5,  0,  0, -1,  2,  0,  4,  3,
        2,  2,  0,  5,  0,  0,  2,  2,  0,  0,  4,  0, ...])
```

### Step 4 — Read the labels

```python
dbcan.labels_
```

Same array. Two things to notice:

```text
 0, 1, 2, 3, 4, 5, 6, 7, 8   ->  cluster IDs
-1                           ->  NOISE  ->  ANOMALY
```

Count them:

```python
import numpy as np

labels = dbcan.labels_

n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise    = list(labels).count(-1)

print("Estimated clusters:", n_clusters)
print("Noise points (anomalies):", n_noise)

anomaly_index = np.where(labels == -1)[0]
print("Anomaly indices:", anomaly_index[:20])
```

### Step 5 — Plot the clustering result

```python
plt.scatter(X[:, 0], X[:, 1], c=dbcan.labels_)
plt.title("DBSCAN result (eps=0.1)")
plt.show()
```

### Step 6 — Compare with the ground truth

```python
plt.scatter(X[:, 0], X[:, 1], c=y)
plt.title("True labels")
plt.show()
```

---

## 3.4 What This Run Demonstrates

The ground truth has **2** circles, but `eps=0.1` produced **9** clusters plus noise. The result is **over-fragmented** — the rings were broken into pieces because the radius was too small to bridge the gaps along each ring.

This is the central lesson: **DBSCAN is extremely sensitive to `eps`**.

```text
eps too SMALL  ->  every sparse region becomes noise
                ->  clusters fragment into many pieces
                ->  too many false anomalies

eps too LARGE  ->  separate clusters merge into one blob
                ->  almost nothing is labelled noise
                ->  real anomalies get missed
```

### Fixing the run

```python
dbscan = DBSCAN(eps=0.2, min_samples=5)
labels = dbscan.fit_predict(X)

print("Clusters:", len(set(labels)) - (1 if -1 in labels else 0))
print("Noise:",    list(labels).count(-1))

plt.scatter(X[:, 0], X[:, 1], c=labels)
plt.title("DBSCAN result (eps=0.2)")
plt.show()
```

With a larger `eps`, the two rings are recovered as **2** clusters and only the genuinely stray points get `-1`.

---

## 3.5 Choosing `eps` Properly — the k-distance Elbow

Do not guess. Plot the sorted distance to each point's k-th nearest neighbour and look for the elbow:

```python
from sklearn.neighbors import NearestNeighbors
import numpy as np
import matplotlib.pyplot as plt

k = 5                                        # commonly min_samples

neigh = NearestNeighbors(n_neighbors=k)
neigh.fit(X)

distances, indices = neigh.kneighbors(X)
k_distances = np.sort(distances[:, k - 1])   # distance to the k-th neighbour

plt.plot(k_distances)
plt.xlabel("Points sorted by distance")
plt.ylabel(f"Distance to {k}-th nearest neighbour")
plt.title("k-distance plot — pick eps at the elbow")
plt.show()
```

The y-value at the sharp bend is a good `eps`. Rule of thumb for `min_samples`: start at `2 * n_features`.

**Always scale your features before DBSCAN** — it is a distance-based algorithm, so a feature measured in thousands will dominate one measured in decimals:

```python
from sklearn.preprocessing import StandardScaler

X_scaled = StandardScaler().fit_transform(X)
labels = DBSCAN(eps=0.2, min_samples=5).fit_predict(X_scaled)
```

---

## 3.6 Strengths and Weaknesses

**Strengths**

* Finds **arbitrarily shaped** clusters (rings, moons, spirals) — the `make_circles` example is exactly this
* The number of clusters does **not** need to be specified in advance
* Anomaly detection is built in via the `-1` label
* Robust to outliers by construction — they never distort a centroid

**Weaknesses**

* Very sensitive to `eps` and `min_samples` — the notebook's 9 clusters prove it
* Fails when clusters have **varying densities**, since one global `eps` cannot fit both a dense and a sparse cluster
* Degrades in high dimensions (the curse of dimensionality makes all distances look similar)
* Requires feature scaling

---

# 4. Local Outlier Factor (LOF)

## 4.1 The Problem LOF Solves

Isolation Forest and DBSCAN both apply one **global** standard of "normal". LOF asks a different question:

> Is this point in a **sparser** region than the points around it?

The handwritten notes lay out the pipeline:

```text
    k Nearest Neighbour
            |
            v
      Local Density
            |
            v
        LOF Score
```

The notes use `k = 5` as the example neighbourhood size.

Because the comparison is made **against a point's own neighbours** rather than against the whole dataset, LOF catches **local outliers** — the exact case where a global method fails:

```text
Cluster A: extremely dense
Cluster B: loose and spread out

A point 2 units from Cluster A  ->  ANOMALY  (A's normal spacing is 0.1)
A point 2 units from Cluster B  ->  NORMAL   (B's normal spacing is 3.0)
```

A single global distance threshold cannot express both statements at once. LOF can, because its threshold is a **ratio**, not a distance.

---

## 4.2 The Four Definitions

LOF is built in four layers. Take a point `A` and a neighbourhood size `k`.

### Step 1 — k-distance

```text
k-distance(A) = the distance from A to its k-th nearest neighbour
```

`N_k(A)` is the set of those k neighbours.

### Step 2 — Reachability Distance

```text
reach-dist_k(A, B) = max( k-distance(B), actual_distance(A, B) )
```

This deliberately "flattens" distances inside a dense cluster. If `B` is in a dense region, its `k-distance(B)` is tiny, so nearby points all get charged the same floor value. This is a **smoothing** trick that stops the score from swinging wildly for points inside the same cluster.

Note the asymmetry: `reach-dist(A, B)` is not the same as `reach-dist(B, A)`.

### Step 3 — Local Reachability Density (lrd)

```text
                              1
lrd_k(A) = ----------------------------------------------
            ( sum over B in N_k(A) of reach-dist_k(A, B) )
            -----------------------------------------------
                          |N_k(A)|
```

In words: **lrd is the inverse of the average reachability distance to A's neighbours.**

```text
Small average distance  ->  HIGH lrd  ->  A sits in a dense region
Large average distance  ->  LOW  lrd  ->  A sits in a sparse region
```

### Step 4 — The LOF Score

```text
              sum over B in N_k(A) of ( lrd_k(B) / lrd_k(A) )
LOF_k(A) = ----------------------------------------------------
                              |N_k(A)|
```

This is the **average ratio of the neighbours' density to A's own density**.

---

## 4.3 Interpreting the LOF Score

| LOF value        | Meaning                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `LOF ~= 1`       | A is as dense as its neighbours → **normal point**                   |
| `LOF < 1`        | A is **denser** than its neighbours → deep inside a cluster, normal  |
| `LOF > 1`        | A is **sparser** than its neighbours → suspicious                    |
| `LOF >> 1` (2, 3, ...) | Strongly sparser than its neighbourhood → **OUTLIER**          |

The score being a **ratio centred on 1** is precisely what makes it local: a value of 2 means "twice as sparse as my own neighbours", regardless of whether those neighbours are packed at 0.01 units apart or 100 units apart.

---

## 4.4 Implementation

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.neighbors import LocalOutlierFactor

rng = np.random.RandomState(42)

# A dense cluster, a sparse cluster, and a few scattered anomalies
dense   = rng.randn(100, 2) * 0.3 + np.array([2, 2])
sparse  = rng.randn(100, 2) * 1.5 + np.array([8, 8])
noise   = rng.uniform(low=-2, high=12, size=(20, 2))

X = np.vstack([dense, sparse, noise])

lof = LocalOutlierFactor(n_neighbors=5, contamination=0.1)
y_pred = lof.fit_predict(X)
```

### Reading the output

```python
print(y_pred[:20])
```

```text
[ 1  1  1  1  1  1  1 -1  1  1  1  1  1  1  1  1  1  1  1  1]
```

Same convention as Isolation Forest:

```text
 1  ->  Inlier   (normal)
-1  ->  Outlier  (anomaly)
```

### Getting the actual LOF scores

```python
# negative_outlier_factor_ is the NEGATIVE of the LOF score
lof_scores = -lof.negative_outlier_factor_

print("LOF score range:", lof_scores.min().round(3), "to", lof_scores.max().round(3))

anomaly_index = np.where(y_pred == -1)[0]
print("Number of anomalies:", len(anomaly_index))

# The 10 most anomalous points
top10 = np.argsort(lof_scores)[-10:][::-1]
for i in top10:
    print(f"index {i:4d}   point {X[i].round(2)}   LOF = {lof_scores[i]:.3f}")
```

Scikit-learn stores the **negated** score in `negative_outlier_factor_` so that, as with every other estimator, *more negative = more anomalous*. Flip the sign to recover the textbook LOF value where **greater than 1 = outlier**.

### Visualising with score magnitude

```python
plt.scatter(X[:, 0], X[:, 1], c='lightblue', label='data')

# radius proportional to the LOF score
radius = (lof_scores.max() - lof_scores) / (lof_scores.max() - lof_scores.min())
plt.scatter(X[:, 0], X[:, 1], s=1000 * (1 - radius), edgecolors='r',
            facecolors='none', label='LOF magnitude')

plt.scatter(X[anomaly_index, 0], X[anomaly_index, 1],
            c='red', marker='x', s=60, label='flagged anomaly')

plt.legend()
plt.title("Local Outlier Factor — bubble size = anomaly strength")
plt.show()
```

The circle around each point grows with its LOF score, so anomalies appear as large rings.

---

## 4.5 Important Parameters

```python
LocalOutlierFactor(
    n_neighbors=20,        # k -> the neighbourhood size (the notes use k = 5)
    contamination='auto',  # proportion expected to be outliers
    metric='minkowski',    # distance metric
    p=2,                   # p=2 -> Euclidean
    novelty=False,         # see below
    n_jobs=-1
)
```

**Choosing `k` (`n_neighbors`)**

```text
k too SMALL  ->  score is noisy; a single close neighbour makes a point look normal
k too LARGE  ->  the "local" neighbourhood becomes global; local outliers are missed
```

A practical starting point is `k = 20`, and `k` should be at least as large as the minimum number of points you would call a legitimate cluster.

**The `novelty` parameter — a common trap**

```python
# novelty=False (default): OUTLIER detection on the training data itself
lof = LocalOutlierFactor(n_neighbors=20)
y_pred = lof.fit_predict(X)          # fit_predict only; .predict() is NOT available

# novelty=True: NOVELTY detection - score NEW, unseen data
lof = LocalOutlierFactor(n_neighbors=20, novelty=True)
lof.fit(X_train)                      # train on data assumed to be clean
y_pred = lof.predict(X_test)          # now .predict() works
```

With `novelty=False`, calling `.predict()` raises an error. LOF in its default mode is a **transductive** method: it scores only the data it was fitted on.

---

## 4.6 Strengths and Weaknesses

**Strengths**

* The only one of the three that reliably catches **local** outliers
* Produces an interpretable score anchored at 1
* No assumption about the distribution of the data
* Handles clusters of **different densities**, which is precisely where DBSCAN fails

**Weaknesses**

* Computationally expensive — needs neighbour searches, roughly `O(n^2)` in the naive case
* Sensitive to the choice of `k`
* **Requires feature scaling** (it is distance-based)
* Degrades in very high dimensions
* Scores are not comparable across different datasets

---

# 5. Comparing the Three Algorithms

| Aspect               | Isolation Forest         | DBSCAN                       | Local Outlier Factor      |
| -------------------- | ------------------------ | ---------------------------- | ------------------------- |
| **Core principle**   | Ease of isolation        | Density-connected regions    | Local density ratio       |
| **Detects**          | Global outliers          | Global outliers / noise      | **Local + global**        |
| **Output label**     | `1` / `-1`               | cluster id / `-1`            | `1` / `-1`                |
| **Score attribute**  | `decision_function()`    | none (labels only)           | `negative_outlier_factor_`|
| **Key parameters**   | `contamination`, `n_estimators` | `eps`, `min_samples`  | `n_neighbors`, `contamination` |
| **Scaling needed**   | No                       | **Yes**                      | **Yes**                   |
| **Speed**            | Very fast (linear)       | Moderate                     | Slow (~quadratic)         |
| **High dimensions**  | Good                     | Poor                         | Poor                      |
| **Varying densities**| Handles reasonably       | **Fails**                    | **Handles well**          |
| **Also clusters?**   | No                       | **Yes**                      | No                        |
| **Needs `k`/`eps`?** | No                       | Yes                          | Yes                       |

### Which one should you use?

```text
Large dataset, many features, need speed
    -> Isolation Forest

Clusters of odd shapes; want clustering AND outliers in one pass
    -> DBSCAN

Clusters of different densities; need to catch local anomalies
    -> Local Outlier Factor

Not sure
    -> Run all three and take the intersection (high precision)
       or the union (high recall)
```

---

# 6. Running All Three Together

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import make_blobs

# ---------- data ----------
rng = np.random.RandomState(42)
X_norm, _ = make_blobs(n_samples=300, centers=2, cluster_std=0.8, random_state=42)
X_out     = rng.uniform(low=-12, high=12, size=(30, 2))
X         = np.vstack([X_norm, X_out])

X_scaled = StandardScaler().fit_transform(X)

# ---------- three detectors ----------
iso_pred  = IsolationForest(contamination=0.1, random_state=42).fit_predict(X_scaled)
lof_pred  = LocalOutlierFactor(n_neighbors=20, contamination=0.1).fit_predict(X_scaled)

db_labels = DBSCAN(eps=0.3, min_samples=5).fit_predict(X_scaled)
db_pred   = np.where(db_labels == -1, -1, 1)          # noise -> -1, else 1

# ---------- compare ----------
compare = pd.DataFrame({
    "isolation_forest": iso_pred,
    "dbscan":           db_pred,
    "lof":              lof_pred
})
compare["votes"] = (compare == -1).sum(axis=1)        # 0..3

print(compare["votes"].value_counts().sort_index())

consensus = compare.index[compare["votes"] >= 2]      # flagged by 2 of 3
print("Consensus anomalies:", len(consensus))

# ---------- visualise ----------
fig, axes = plt.subplots(1, 3, figsize=(16, 5))
for ax, (name, pred) in zip(axes, [("Isolation Forest", iso_pred),
                                   ("DBSCAN",           db_pred),
                                   ("LOF",              lof_pred)]):
    ax.scatter(X[:, 0], X[:, 1], c=(pred == -1), cmap='coolwarm', s=20)
    ax.set_title(f"{name} — {(pred == -1).sum()} anomalies")

plt.tight_layout()
plt.show()
```

Combining detectors is standard practice: agreement across methods that use different definitions of "abnormal" is far stronger evidence than any single score.

---

# 7. Practical Checklist

1. **Plot the data first.** In 2D or 3D, your eyes are a better anomaly detector than any algorithm.
2. **Scale features** before DBSCAN and LOF. Isolation Forest does not need it.
3. **Set `random_state`** on Isolation Forest, or the flagged set changes on every run.
4. **Do not treat `contamination` as a discovery.** It is an assumption you supply, and it only moves the threshold — 250 rows with `contamination=0.2` will always give you exactly 50 anomalies.
5. **Prefer scores over labels.** Rank by `decision_function()` or `negative_outlier_factor_` and investigate the top N. That is far more useful operationally than a binary flag.
6. **Choose `eps` from a k-distance plot**, not by guessing. The notebook's `eps=0.1` producing 9 clusters instead of 2 is the cautionary example.
7. **Verify before deleting.** An outlier may be a data-entry error (drop it) or the single most valuable record in the dataset (a fraud case). Look at the rows before acting.
8. **Fit on training data only.** When anomaly detection is a preprocessing step in a pipeline, fitting on the full dataset leaks test information into training.

---

# 8. Quick Reference

```python
# ---- Isolation Forest ----
from sklearn.ensemble import IsolationForest
clf   = IsolationForest(contamination=0.2, random_state=42)
pred  = clf.fit_predict(X)                    #  1 = normal, -1 = anomaly
score = clf.decision_function(X)              # negative = anomalous

# ---- DBSCAN ----
from sklearn.cluster import DBSCAN
labels = DBSCAN(eps=0.2, min_samples=5).fit_predict(X)
anomalies = labels == -1                      # -1 = noise = anomaly

# ---- Local Outlier Factor ----
from sklearn.neighbors import LocalOutlierFactor
lof    = LocalOutlierFactor(n_neighbors=20, contamination=0.1)
pred   = lof.fit_predict(X)                   #  1 = normal, -1 = anomaly
scores = -lof.negative_outlier_factor_        # > 1 = outlier

# ---- Get anomaly indices (all three) ----
import numpy as np
index = np.where(pred < 0)[0]
```

---

# 9. Files in This Folder

| File                                                | Contents                                                       |
| --------------------------------------------------- | -------------------------------------------------------------- |
| `1.0-Anomaly+Detection+Isolation+Forest.pdf`         | Handwritten notes: outlier intuition, isolation trees, anomaly score formula |
| `3.0-Local+Outlier+Factor+Anamoly+Detection.pdf`     | Handwritten notes: local vs global outliers, kNN → local density → LOF score |
| `Isolation+Anamoly+Detection.ipynb`                  | Isolation Forest on `healthcare.csv` with anomaly visualisation |
| `DBSCAN+Implementation+(1).ipynb`                    | DBSCAN on `make_circles`, showing the `-1` noise label and `eps` sensitivity |

---

# 10. Summary

* **Anomaly detection** finds points that break the pattern of the majority — used both to *find* the signal (fraud, intrusion, defects) and to *remove* noise before modelling.
* Outliers come in two kinds: **global** (far from everything) and **local** (abnormal only relative to their own neighbourhood).
* **Isolation Forest** isolates points with random splits; anomalies need fewer splits, so their average path length `E[h(x)]` is short and the score `s(x, m) = 2^(-E[h(x)]/c(m))` approaches **1**.
* **DBSCAN** groups dense regions and refuses to assign the rest, labelling them `-1`. Its quality lives and dies by `eps`.
* **Local Outlier Factor** compares a point's local reachability density with that of its k neighbours. `LOF ≈ 1` is normal; `LOF >> 1` is an outlier.
* All three return `-1` for anomalies (DBSCAN via its noise label), so `np.where(pred < 0)` retrieves the anomaly indices in every case.
* No single algorithm is universally best — combining them and ranking by score is stronger than trusting any one binary label.
