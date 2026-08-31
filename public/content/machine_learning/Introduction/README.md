---
title: Introduction to Machine Learning
description: AI vs ML vs DL vs DS, the three types of ML, the equation of a line and hyperplane, and instance-based vs model-based learning — explained simply, with runnable Python.
---

# Introduction to Machine Learning

The four handwritten decks in this folder cover the foundations everything else
builds on. This README explains each one in plain language, with a worked example
and code you can actually run.

| Deck | Topic | What it answers |
| ---- | ----- | --------------- |
| [1 — AI vs ML vs DL vs DS](<1-AIVMLVSDLVSDS.pdf>) | The landscape | How do these four words relate? |
| [2 — Types of ML techniques](<2-Typesof+ML+technqiues.pdf>) | Supervised / Unsupervised / Reinforcement | Which kind of problem am I solving? |
| [2.3 — Equation of a straight line, Hyperplane](<2.3-+Equation+Of+a+straight+Line,Hyperplane.pdf>) | The math | What is a model actually *storing*? |
| [Instance based vs model based learning](<instance+based+vs+model+absed+learning.pdf>) | Two learning styles | Does the model memorize or generalize? |

---

## 1. AI vs ML vs DL vs DS

These are not four competing things. Three of them are **nested circles**, and the
fourth cuts across all of them.

```text
┌──────────── Artificial Intelligence ────────────┐
│  Any app that performs its task without         │
│  human intervention                             │
│                                                 │
│      ┌──────── Machine Learning ────────┐       │
│      │  Statistical tools that learn     │      │
│      │  patterns from data               │      │
│      │                                   │      │
│      │     ┌──── Deep Learning ────┐     │      │
│      │     │  Multi-layered neural  │    │      │
│      │     │  networks that mimic   │    │      │
│      │     │  the human brain       │    │      │
│      │     └────────────────────────┘    │      │
│      └───────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
        Data Science overlaps all of the above
```

- **Artificial Intelligence (AI)** — the goal. Build an application that can
  perform its own task *without any human intervention*.
  Examples: a Netflix recommendation system (you watch action movies → it
  recommends action movies), a self-driving car.
- **Machine Learning (ML)** — a way to reach that goal. Instead of writing the
  rules by hand, you show the computer examples and it **finds the rules itself**.
- **Deep Learning (DL)** — ML using multi-layered neural networks, designed to
  *mimic the human brain*. It is a subset of ML, which is a subset of AI.
- **Data Science (DS)** — the practice that surrounds all of these. It provides
  the statistical tools to **analyze, visualize, predict and forecast** data.

> **The one-line version:** AI is the goal, ML is the approach, DL is a powerful
> kind of ML, and DS is the discipline that uses all three plus statistics.

---

## 2. The three types of machine learning

```text
                  Machine Learning Techniques
                             │
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
   Supervised ML       Unsupervised ML     Reinforcement Learning
   (data + answers)    (data, no answers)  (trial, error, reward)
```

### Supervised learning — you have the answers

You give the model **input features** *and* the **correct output**, and it learns
the mapping between them.

The vocabulary matters here:

- **Independent features** — the inputs you already know (size of house, number of rooms).
- **Dependent feature** — the output you want to predict (price). Also called the *target*.

Which supervised algorithm you need depends entirely on **what the dependent
feature looks like**:

| Dependent feature is… | Problem type | Example |
| --------------------- | ------------ | ------- |
| **Continuous** (any number) | **Regression** | House price: 450K, 500K, … |
| **Categorical** (fixed set of labels) | **Classification** | Pass / Fail |

#### Regression — predicting a number

The dataset from the notes: size and number of rooms predict a continuous price.

```python
import pandas as pd
from sklearn.linear_model import LinearRegression

# Independent features -> dependent feature (the thing we predict)
# price_k was built with the rule  price = 0.05*size + 25*rooms,
# so we can check whether the model rediscovers it.
houses = pd.DataFrame({
    "size_sqft": [5000, 6000, 3500, 4200, 7500, 2800, 5200, 3900],
    "n_rooms":   [5,    4,    3,    5,    7,    2,    3,    4   ],
    "price_k":   [375,  400,  250,  335,  550,  190,  335,  295 ],  # continuous -> Regression
})

X = houses[["size_sqft", "n_rooms"]]
y = houses["price_k"]

model = LinearRegression().fit(X, y)

new_house = pd.DataFrame({"size_sqft": [5500], "n_rooms": [5]})
print("Predicted price:", round(model.predict(new_house)[0], 1), "thousand")
print("Learned weights:", model.coef_.round(4), "intercept:", round(model.intercept_, 2))
```

```text
Predicted price: 400.0 thousand
Learned weights: [ 0.05 25.  ] intercept: -0.0
```

Look closely at that second line — **the model rediscovered the exact rule that
generated the data** (`0.05` per sqft, `25` per room). That is all "learning"
means here: finding the numbers that best explain the examples.

#### Classification — predicting a label

Same idea, but the answer column is a category. From the notes: study hours and
play hours predict Pass or Fail.

```python
from sklearn.linear_model import LogisticRegression

students = pd.DataFrame({
    "study_hours": [7, 2, 8, 1, 6, 3, 9, 2, 5, 4],
    "play_hours":  [3, 6, 2, 8, 3, 7, 1, 7, 4, 6],
    "result":      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],   # categorical -> Classification
})

Xs = students[["study_hours", "play_hours"]]
ys = students["result"]

clf = LogisticRegression().fit(Xs, ys)

new_student = pd.DataFrame({"study_hours": [6], "play_hours": [2]})
pred = clf.predict(new_student)[0]
prob = clf.predict_proba(new_student)[0][1]
print("Prediction:", "PASS" if pred == 1 else "FAIL", f"(confidence {prob:.0%})")
```

```text
Prediction: PASS (confidence 97%)
```

Two labels (Pass/Fail) is **binary classification**. More than two — Pass / Fail /
May Be — is **multiclass classification**.

### Unsupervised learning — no answers, find the structure

Here there is **no output column at all**. You hand over the data and ask the
algorithm to find natural groups.

The e-commerce example from the notes: segment customers by salary and spending
score, then email each cluster a different discount.

```python
from sklearn.cluster import KMeans

customers = pd.DataFrame({
    "salary":         [20000, 45000, 25000, 52000, 22000, 48000, 80000, 85000],
    "spending_score": [9,     2,     8,     3,     9,     2,     5,     6    ],
})

# No answer column at all -- the algorithm finds the groups itself.
kmeans = KMeans(n_clusters=3, n_init=10, random_state=42).fit(customers)
customers["segment"] = kmeans.labels_
print(customers.to_string(index=False))
```

```text
 salary  spending_score  segment
  20000               9        0
  45000               2        2
  25000               8        0
  52000               3        2
  22000               9        0
  48000               2        2
  80000               5        1
  85000               6        1
```

Three clean segments emerge: **low salary but high spenders** (0), **mid salary,
low spenders** (2), and **high earners** (1). Nobody labelled these — the
algorithm found them. Now marketing can target each group differently.

### Reinforcement learning — learn by trial and reward

No fixed dataset at all. An **agent** acts in an environment, gets a **reward** or
**penalty**, and adjusts to maximise long-term reward. This is how game-playing
and robotics models are trained.

### Algorithm cheat sheet

| Supervised | Unsupervised |
| ---------- | ------------ |
| Linear Regression | K-Means |
| Ridge & Lasso | Hierarchical Mean |
| ElasticNet | DBSCAN clustering |
| Logistic Regression *(classification)* | |
| Decision Tree | |
| Random Forest | |
| AdaBoost | |
| XGBoost | |

Decision Tree, Random Forest, AdaBoost and XGBoost do **both** classification and
regression.

---

## 3. From `y = mx + c` to the hyperplane

This is the single most reused piece of math in ML. It is just the school
straight-line equation, rewritten so it works in any number of dimensions.

**Step 1 — the school form.** `m` is the slope, `c` is the intercept:

```text
y = mx + c          also written   y = β₀ + β₁x
```

**Step 2 — the general form.** Rearranging `ax + by + c = 0`:

```text
by = -ax - c   →   y = (-a/b)x + (-c/b)
                        └─m─┘    └─c─┘
```

Same line, different clothes.

**Step 3 — rename to weights.** Call the coefficients `w` and the constant `b`:

```text
2D:  w₁x₁ + w₂x₂ + b = 0
3D:  w₁x₁ + w₂x₂ + w₃x₃ + b = 0          (a plane)
nD:  w₁x₁ + w₂x₂ + … + wₙxₙ + b = 0      (a hyperplane)

All of them collapse to:     wᵀx + b = 0
```

`w` and `x` are just column vectors, and `wᵀx` is their dot product. **A model
"learning" is a model finding good values for `w` and `b`.**

**Step 4 — two facts worth memorising.**

- If the plane **passes through the origin**, the intercept is 0, so `wᵀx = 0`.
- **`w` is always perpendicular to the plane** (`w ⊥ Π`). That is why
  `w · x = ‖w‖‖x‖cos θ = 0` when `x` lies along the plane — `cos 90° = 0`.

### Seeing it in real code

The classifier trained earlier already *is* a `wᵀx + b = 0` boundary. Let's pull
the numbers out and confirm every claim above:

```python
import numpy as np

# A 2D boundary learned by logistic regression IS w1*x1 + w2*x2 + b = 0
w = clf.coef_[0]
b = clf.intercept_[0]
print(f"w = {w.round(4)}   b = {b:.4f}")
print(f"Boundary: ({w[0]:.3f})*study + ({w[1]:.3f})*play + ({b:.3f}) = 0")

# Rewrite as the school form y = mx + c  (here: play = m*study + c)
m = -w[0] / w[1]
c = -b / w[1]
print(f"Same line as y = mx + c  ->  play = {m:.3f}*study + {c:.3f}")

# w is perpendicular to the boundary: take two points ON the line, the
# direction between them dotted with w must be 0.
p1 = np.array([2.0, m * 2.0 + c])
p2 = np.array([8.0, m * 8.0 + c])
direction = p2 - p1
print("w . (direction along line) =", round(float(np.dot(w, direction)), 10), "-> w is perpendicular")

# Signed distance of a point from the hyperplane
point = np.array([6.0, 2.0])
distance = (np.dot(w, point) + b) / np.linalg.norm(w)
print(f"Signed distance of {point} from boundary: {distance:.3f}")
```

```text
w = [ 0.7197 -0.8813]   b = 1.0586
Boundary: (0.720)*study + (-0.881)*play + (1.059) = 0
Same line as y = mx + c  ->  play = 0.817*study + 1.201
w . (direction along line) = 0.0 -> w is perpendicular
Signed distance of [6. 2.] from boundary: 3.177
```

Three things just got proved rather than asserted:

1. The learned boundary really is `w₁x₁ + w₂x₂ + b = 0`.
2. It converts straight back into `y = mx + c`.
3. `w · (direction along the line) = 0.0` exactly — **`w` is perpendicular to its
   own boundary**, as the notes claim.

The **sign** of `wᵀx + b` tells you which side a point is on (that is the
prediction), and its **magnitude** tells you how far from the boundary it is (that
is the confidence).

---

## 4. Instance-based vs model-based learning

Both start from data and end at a prediction, but they differ in *when* the work
happens. The notes frame it as **memorizing vs generalizing**:

```text
Instance Based                    Model Based
──────────────                    ───────────
DATA                              DATA
  ↓                                 ↓
 O/P        (compare directly)     Pattern
                                    ↓
                                 Generalization
                                    ↓
                              Generalized Model
```

- **Instance-based = memorizing.** Keep every training row. When a new point
  arrives, look at the *nearest stored examples* and copy their answer. **KNN
  (K-Nearest Neighbour)** is the classic. There is no model to store; the training
  data *is* the model.
- **Model-based = generalizing.** Find the underlying pattern once, store it as a
  **decision boundary** (`wᵀx + b`), then throw the training data away.

The full comparison from the deck:

| Conventional (model-based) ML | Instance-based learning |
| ----------------------------- | ----------------------- |
| Prepare the data for training | Prepare the data for training — *no difference here* |
| Train the model to estimate parameters, i.e. discover patterns | **Do not train.** Pattern discovery is postponed until a query arrives |
| Store the model in a suitable form | There is no model to store |
| Generalize into rules *before* any scoring instance is seen | Generalize for each scoring instance individually, as it is seen |
| Predict for unseen instances using the model | Predict using the training data directly |
| Can throw away the training data after training | Training data must be kept — every query uses part or all of it |
| Requires a known model form | May not have an explicit model form |
| Storing the model needs **less** storage | Storing the training data needs **more** storage |
| Scoring a new instance is generally **fast** | Scoring a new instance may be **slow** |

### Seeing the trade-off for real

Same data, same prediction — completely different costs:

```python
import pickle
import time
from sklearn.neighbors import KNeighborsClassifier

# Model-based: learns w and b, then the training data can be thrown away.
model_based = LogisticRegression().fit(Xs, ys)

# Instance-based: stores the training rows and compares at prediction time.
instance_based = KNeighborsClassifier(n_neighbors=3).fit(Xs, ys)

test = pd.DataFrame({"study_hours": [6], "play_hours": [2]})
print("Model-based    predicts:", model_based.predict(test)[0])
print("Instance-based predicts:", instance_based.predict(test)[0])

print("\nWhat each one actually stores:")
print("  Logistic Regression ->", len(pickle.dumps(model_based)), "bytes",
      f"(just w={model_based.coef_[0].round(3)} and b={model_based.intercept_[0]:.3f})")
print("  KNN                 ->", len(pickle.dumps(instance_based)), "bytes",
      f"(a copy of all {len(Xs)} training rows)")

# Prediction cost: KNN must measure distance to every stored row.
for name, m_ in [("Logistic Regression", model_based), ("KNN", instance_based)]:
    start = time.perf_counter()
    for _ in range(1000):
        m_.predict(test)
    print(f"  {name:20} 1000 predictions in {time.perf_counter() - start:.3f}s")
```

```text
Model-based    predicts: 1
Instance-based predicts: 1

What each one actually stores:
  Logistic Regression -> 845 bytes (just w=[ 0.72  -0.881] and b=1.059)
  KNN                 -> 1817 bytes (a copy of all 10 training rows)
  Logistic Regression  1000 predictions in 0.508s
  KNN                  1000 predictions in 1.261s
```

Both give the same answer, but:

- The model-based one compressed 10 rows into **two numbers and a bias**. Its size
  never grows, no matter how much data you train on.
- The instance-based one is **already larger with only 10 rows**, and it grows
  linearly forever — and it was **~2.5× slower** to predict (2.5–3× across repeated
  runs), because every single prediction re-measures distance to every stored row.

Scale that to a million rows and the gap becomes the whole ball game. That is the
real reason "memorizing" loses: not accuracy, but **storage and latency**.

---

## Running the code

Every block above was run exactly as written; the `text` blocks are the real
output. To reproduce:

```bash
python3 -m venv mlenv
source mlenv/bin/activate          # Windows: mlenv\Scripts\activate
pip install numpy pandas scikit-learn
```

The blocks build on each other in order (section 3 uses `clf` from section 2, and
section 4 uses `Xs`/`ys`), so run them top to bottom in one file or notebook.

> Your exact numbers may differ slightly in the last decimal places or in the
> timing line — that depends on your BLAS/library versions and machine speed. The
> weights, predictions and the perpendicularity check are deterministic.

---

## Quick revision

| Term | Plain meaning |
| ---- | ------------- |
| **AI** | App that does its task without human intervention |
| **ML** | Learns the rules from data instead of being told them |
| **DL** | ML with multi-layered neural networks, mimicking the brain |
| **DS** | Stats tools to analyze, visualize, predict, forecast |
| **Independent feature** | An input column |
| **Dependent feature** | The output column you predict |
| **Regression** | Supervised, output is **continuous** |
| **Classification** | Supervised, output is **categorical** |
| **Clustering** | Unsupervised, find groups with no labels |
| **`wᵀx + b = 0`** | One equation for a line, plane or hyperplane |
| **`w`** | The learned weights — always **perpendicular** to the boundary |
| **`b`** | The bias/intercept; drop it and the plane passes through the origin |
| **Instance-based** | Memorizes the data (KNN) — big, slow to predict |
| **Model-based** | Generalizes to a boundary — small, fast to predict |
