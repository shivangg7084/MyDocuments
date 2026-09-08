# 06 — Support Vector Machines (SVM)

> Source: `Machine_Learning_-_Classifiers_-_SVM.pptx`

---

## 1. What is an SVM?

- **Support Vector Machines (SVM) is a popular SUPERVISED learning model.**
- SVM was **first introduced in 1992.**
- SVM is **inspired by statistical learning theory.**
- SVM **gained popularity because of its success in handwritten digit recognition.**

> Those four facts are pure MCQ material — memorise **1992** and **handwritten digit recognition**.

---

## 2. The Core Idea — Margin and Maximum Margin

### The question SVM answers

Two classes sit on a page and a straight line can separate them. But **infinitely many lines** would do the job:

```
   ○ ○ ○        ╱  │  ╲        Which of these three lines
  ○ ○ ○        ╱   │   ╲       is the best separator?
 ─────────    ╱    │    ╲      All three are 100% correct
   ● ● ●     ╱     │     ╲     on the training data.
  ● ● ●
```

All are perfect on training data, so training accuracy cannot choose between them. SVM's answer: **pick the line that stays as far away from both classes as possible.**

**Why that is the right answer:** a line that skims past the nearest points is fragile — a slightly unusual new point falls on the wrong side. A line down the middle of a wide gap has room to be a little wrong and still be right. **That is generalization.**

### Margin

> **Definition:** The **margin** of a linear classifier is **the width that the boundary could be increased by before hitting a data point.**

**Analogy:** the decision boundary is a road running between two rows of houses. The margin is how wide you can build that road before it touches the nearest house on either side. SVM builds the widest possible road.

```
        ○   ○
   ○        ○  ← nearest ○ touches the upper edge
  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  upper margin edge
        ↕
  ───────────────────  the decision boundary
        ↕                (margin = the full width of this corridor)
  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  lower margin edge
   ●        ●  ← nearest ● touches the lower edge
       ●  ●
```

### Maximum Margin Classifier

> **Definition:** The **maximum margin linear classifier** is the linear classifier with the **maximum margin.** This is the **simplest kind of SVM**, called a **Linear SVM.**

### Support Vectors

The points **sitting exactly on the edge of the margin** are the **support vectors** — they "hold up" the boundary like tent poles.

**The remarkable property:** only these few points define the boundary. **Delete any other training point and the boundary does not move at all.**

Practical consequences:
- You could throw away 95% of your training data — the rows that are not support vectors — and get the *identical* model
- The trained model is **memory-efficient**: it only stores the support vectors
- It is **robust to distant points**: a far-away outlier on the correct side has zero influence, unlike linear regression where every point tugs the line

---

## 3. Hard Margin vs Soft Margin

**Hard margin** demands every point be correctly classified and outside the margin. Two problems: it only works if the data is **perfectly linearly separable**, and it is **extremely sensitive to outliers** — one mislabelled point can drag the boundary into an absurd position, or make a solution impossible.

**Soft margin** allows some points to violate the margin, controlled by the parameter **C**.

| Value of C | Behaviour | Risk |
|---|---|---|
| **Large C** | Few violations tolerated → **narrow margin**, tries hard to classify every training point | **Overfitting** |
| **Small C** | More violations tolerated → **wider margin**, more generalisation | **Underfitting** |

**Read C as "how much do I punish mistakes?"** High C = a strict teacher who accepts no error and ends up memorising. Low C = a relaxed teacher who tolerates a few errors and grasps the general rule. *(In sklearn, `SVC(C=1.0)` is the default.)*

---

## 4. Non-Linear Data and the Kernel Trick

### The problem

Real data is often **not linearly separable.** Picture one class forming a ring around the other:

```
      ○ ○ ○ ○
    ○  ● ● ●  ○        No straight line can ever
   ○  ● ● ● ●  ○       separate ● from ○ here.
    ○  ● ● ●  ○
      ○ ○ ○ ○
```

### The solution — lift it into higher dimensions

Add a new feature: **distance from the centre** (z = x² + y²). Now view the data from the side:

```
 z │        ○ ○ ○ ○ ○      ← outer ring: large z
   │  ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈  ← a FLAT line now separates them perfectly
   │     ● ● ● ●          ← inner blob: small z
   └──────────────────►
```

In this new 3D space a **flat plane** splits the classes. Project it back into the original 2D and that plane appears as a **circle**. You solved a curved problem with straight-line machinery.

### Kernel Functions

> **Definition from the slides:** the **kernel defines the similarity or a distance measure between new data and the support vectors.**

- The **dot product** is the similarity measure used for a **linear SVM / linear kernel**, because the distance is a **linear combination of the inputs.**
- **`K(a, b) = (a · b + 1)^d`** is an example of an SVM kernel function (the **polynomial kernel**).
- Beyond polynomials there are other **very high-dimensional basis functions that can be made practical by finding the right Kernel Function — this is called the KERNEL TRICK.**

### The kernel trick, and why it is genuinely clever

> **Compute the dot product in the high-dimensional space WITHOUT ever actually transforming the data into that space.**

*See it happen.* Take two 2-D points `a = (a1, a2)` and `b = (b1, b2)` with the polynomial kernel `K(a,b) = (a·b)²`:

**The slow way** — actually build the 3-D feature space:
```
transform a → (a1², √2·a1a2, a2²)
transform b → (b1², √2·b1b2, b2²)
then take the dot product of those two 3-D vectors
```

**The kernel way** — stay in 2-D:
```
K(a,b) = (a1b1 + a2b2)²
```
**Identical answer, a fraction of the work.** Here it saves a little; with an **RBF kernel**, the equivalent feature space is **infinite-dimensional** — impossible to build explicitly, yet the kernel computes the result in one line. That is why the trick matters.

### Common kernels

| Kernel | Formula | When to use |
|---|---|---|
| **Linear** | `K(a,b) = a · b` | Linearly separable data; many features (e.g. text) |
| **Polynomial** | `K(a,b) = (a · b + 1)^d` | Curved boundaries; `d` = degree |
| **Radial-Basis (RBF / Gaussian)** | `K(a,b) = exp(−γ‖a−b‖²)` | The general-purpose default for non-linear data |
| **Sigmoidal** | `K(a,b) = tanh(κ·a·b + c)` | Neural-network-like behaviour |

*(The slides explicitly list the polynomial example, the Radial-Basis-style kernel, and the sigmoidal function.)*

**RBF in plain terms:** it scores similarity by closeness — points near each other score near 1, distant points score near 0. It effectively lets each support vector cast a vote weighted by proximity, which is why it can carve out almost any boundary shape.

---

## 5. Multiclass Classification with SVM

SVM is inherently **binary**. For more than two classes:

- **One-vs-Rest (OvR):** one SVM per class, that class vs all others → **k classifiers.** For digits 0–9: "is it a 0 or not?", "is it a 1 or not?", … then take the most confident.
- **One-vs-One (OvO):** one SVM per pair → **k(k−1)/2 classifiers**, decided by majority vote. For 10 digits that is 45 classifiers — each small and fast, since each sees only two digits' worth of data.

*(In sklearn, `SVC(decision_function_shape='ovr')` is the default shown in the slides.)*

---

## 6. Python Example (Census Income dataset)

```python
from sklearn.svm import SVC

svm = SVC(kernel='linear')
svm.fit(X_train, y_train)
# SVC(C=1.0, cache_size=200, class_weight=None, coef0=0.0,
#     decision_function_shape='ovr', degree=3, gamma='auto_deprecated',
#     kernel='linear', max_iter=-1, probability=False, random_state=None,
#     shrinking=True, tol=0.001, verbose=False)

print("Accuracy of Linear SVM = ", svm.score(X_test, y_test))
# Accuracy of Linear SVM = 0.7866062548347884

svm_pol = SVC(kernel='poly', degree=4)
svm_pol.fit(X_train, y_train)
print("Accuracy of Polynomial SVM = ", svm_pol.score(X_test, y_test))
# Accuracy of Polynomial SVM = 0.5832688694883412
```

> **The important observation:** the **Linear SVM (0.787) massively outperformed the degree-4 Polynomial SVM (0.583)** — a 20-point collapse. A more complex kernel is **not** automatically better. A degree-4 polynomial can bend into wild shapes that fit training noise, and on this dataset the true boundary was close to linear anyway. **Match the kernel to the data, and always start with linear.**

### Default `SVC` parameters visible in the slide output
`C=1.0`, `cache_size=200`, `class_weight=None`, `coef0=0.0`, `decision_function_shape='ovr'`, `degree=3`, `max_iter=-1`, `probability=False`, `shrinking=True`, `tol=0.001`.

> **Practical note:** SVMs are **distance-based**, so you must **scale your features first** (note 02) — otherwise a large-numbered feature dominates the margin computation.

---

## 7. SVM vs SVR (link to note 03)

| | **SVM (classifier)** | **SVR (regressor)** |
|---|---|---|
| Target | Categorical class | Continuous number |
| Goal | **Maximise the margin** between classes | Fit a line so most points lie **inside an ε-tube** |
| Margin means | Empty corridor you want **as wide as possible** | Tolerance tube where errors are **forgiven** |
| Loss | Hinge loss | **Epsilon-insensitive loss** |
| sklearn | `SVC` | `SVR` |

> **Neat symmetry:** in SVM you want points to stay **outside** the margin; in SVR you want them **inside** the tube.

---

## 8. Summary Table

| Property | SVM |
|---|---|
| Learning type | **Supervised** |
| Introduced | **1992** |
| Inspired by | **Statistical learning theory** |
| Famous for | **Handwritten digit recognition** |
| Generative or discriminative? | **Discriminative** |
| Parametric or non-parametric? | **Non-parametric** |
| Key concept | **Maximum margin** |
| Handles non-linearity via | **Kernel trick** |
| Needs feature scaling? | **Yes** |

---

# MCQ Practice — Support Vector Machines

**Q1.** SVM is a:
- A) Unsupervised model
- B) Supervised model
- C) Reinforcement learning model
- D) Clustering model

**Q2.** SVM was first introduced in:
- A) 1982
- B) 1992
- C) 2002
- D) 1975

**Q3.** SVM is inspired by:
- A) Biology of neurons
- B) Statistical learning theory
- C) Genetic algorithms
- D) Fuzzy logic

**Q4.** SVM gained popularity because of its success in:
- A) Speech synthesis
- B) Handwritten digit recognition
- C) Machine translation
- D) Web search

**Q5.** The margin of a linear classifier is defined as:
- A) The distance between the two class means
- B) The width the boundary could be increased by before hitting a data point
- C) The number of misclassified points
- D) The variance of the data

**Q6.** The maximum margin linear classifier is also called:
- A) Naive Bayes
- B) Linear SVM
- C) Perceptron
- D) k-NN

**Q7.** The data points lying on the edge of the margin are called:
- A) Outliers
- B) Centroids
- C) Support vectors
- D) Leaf nodes

**Q8.** If a non-support-vector training point is deleted, the SVM decision boundary:
- A) Changes drastically
- B) Does not change
- C) Becomes undefined
- D) Rotates 90°

**Q9.** Maximising the margin generally leads to:
- A) Worse generalization
- B) Better generalization
- C) More support vectors always
- D) A non-linear boundary always

**Q10.** A kernel in SVM defines:
- A) The learning rate
- B) The similarity or distance measure between new data and the support vectors
- C) The number of classes
- D) The depth of the tree

**Q11.** The similarity measure used by a linear SVM is:
- A) Euclidean distance
- B) The dot product
- C) Cosine only
- D) Gini impurity

**Q12.** `K(a,b) = (a·b + 1)^d` is an example of a:
- A) Linear kernel
- B) Polynomial kernel
- C) RBF kernel
- D) Sigmoid kernel

**Q13.** Making very high-dimensional basis functions practical by finding the right kernel function is called:
- A) Feature scaling
- B) The kernel trick
- C) Bagging
- D) Gradient descent

**Q14.** The essence of the kernel trick is:
- A) Explicitly transforming data into high dimensions
- B) Computing high-dimensional dot products without explicitly transforming the data
- C) Deleting features
- D) Increasing the learning rate

**Q15.** Which of the following is NOT mentioned as an SVM kernel in the slides?
- A) Polynomial
- B) Radial-Basis-style
- C) Sigmoidal
- D) Logarithmic

**Q16.** Kernels are needed when:
- A) The data is linearly separable
- B) The data is NOT linearly separable
- C) The dataset is small
- D) The target is continuous

**Q17.** In `SVC`, a very LARGE value of C tends to produce:
- A) A wider margin and more misclassifications allowed
- B) A narrower margin and risk of overfitting
- C) No margin at all
- D) A linear kernel automatically

**Q18.** In the slides' Census Income example, the accuracy of the Linear SVM was approximately:
- A) 0.583
- B) 0.687
- C) 0.787
- D) 0.887

**Q19.** The accuracy of the degree-4 Polynomial SVM was approximately:
- A) 0.583
- B) 0.787
- C) 0.851
- D) 0.923

**Q20.** What does the comparison between the linear and polynomial SVM results demonstrate?
- A) Polynomial kernels are always better
- B) A more complex kernel is not automatically better
- C) Kernels have no effect
- D) SVMs cannot do classification

**Q21.** The default `decision_function_shape` shown in the SVC output is:
- A) 'ovo'
- B) 'ovr'
- C) 'auto'
- D) 'linear'

**Q22.** For a k-class problem, the One-vs-One strategy trains how many binary SVMs?
- A) k
- B) k(k−1)/2
- C) k²
- D) 2^k

**Q23.** SVM is best described as which type of model?
- A) Generative and parametric
- B) Discriminative and non-parametric
- C) Generative and non-parametric
- D) Discriminative and parametric

**Q24.** The regression counterpart of SVM is:
- A) SVR
- B) SVC
- C) Ridge
- D) Lasso

**Q25.** The correct sklearn import for the SVM classifier is:
- A) `from sklearn.svm import SVC`
- B) `from sklearn.linear_model import SVC`
- C) `from sklearn.tree import SVC`
- D) `from sklearn.ensemble import SVC`

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Supervised learning model. |
| 2 | **B** | 1992. |
| 3 | **B** | Statistical learning theory. |
| 4 | **B** | Handwritten digit recognition. |
| 5 | **B** | Exact definition from the slide. |
| 6 | **B** | The simplest SVM is the Linear SVM. |
| 7 | **C** | Support vectors define the boundary. |
| 8 | **B** | Only support vectors matter. |
| 9 | **B** | Wider margin → better generalization. |
| 10 | **B** | Kernel = similarity/distance measure. |
| 11 | **B** | Dot product = linear kernel. |
| 12 | **B** | Degree-d polynomial kernel. |
| 13 | **B** | The kernel trick. |
| 14 | **B** | Implicit high-dimensional computation. |
| 15 | **D** | Logarithmic is not listed. |
| 16 | **B** | Kernels handle non-linear data. |
| 17 | **B** | Large C = low tolerance = narrow margin. |
| 18 | **C** | 0.7866062548347884. |
| 19 | **A** | 0.5832688694883412. |
| 20 | **B** | The wrong kernel can hurt badly. |
| 21 | **B** | `decision_function_shape='ovr'`. |
| 22 | **B** | One classifier per pair. |
| 23 | **B** | Models the boundary; parameters grow with support vectors. |
| 24 | **A** | Support Vector Regression. |
| 25 | **A** | `sklearn.svm`. |
