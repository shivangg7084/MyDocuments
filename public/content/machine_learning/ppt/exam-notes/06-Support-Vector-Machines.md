# 06 — Support Vector Machines (SVM)

> Source: `Machine_Learning_-_Classifiers_-_SVM.pptx`

---

## 1. What is an SVM?

- **Support Vector Machines (SVM) is a popular SUPERVISED learning model.**
- SVM was **first introduced in 1992**.
- SVM is **inspired by statistical learning theory**.
- SVM **gained popularity because of its success in handwritten digit recognition**.

> Those four facts are pure MCQ material — memorise the year **1992** and **handwritten digit recognition**.

---

## 2. The Core Idea — Margin and Maximum Margin

Suppose two classes can be separated by a straight line. There are **infinitely many lines** that separate them. Which one is best? SVM answers: **the one that stays as far away from both classes as possible.**

### Margin
> **Definition:** The **margin** of a linear classifier is **the width that the boundary could be increased by before hitting a data point.**

Think of the decision boundary as a road: the margin is how wide you can make that road before it touches the nearest houses on either side.

### Maximum Margin Classifier
> **Definition:** The **maximum margin linear classifier** is the linear classifier with the **maximum margin**. This is the **simplest kind of SVM**, called a **Linear SVM**.

### Support Vectors
The data points that **lie exactly on the edge of the margin** and "hold up" the boundary are the **support vectors**.

**Crucial property:** Only the support vectors determine the boundary. **If you delete any other training point, the boundary does not change.** This is why SVMs are memory-efficient at prediction time.

**Why maximise the margin?** A wider margin means the boundary is less likely to be crossed by a slightly different, unseen data point → **better generalization**.

---

## 3. Hard Margin vs Soft Margin

- **Hard margin:** demands that every point be correctly classified and outside the margin. Only works if the data is **perfectly linearly separable** and it is very sensitive to outliers.
- **Soft margin:** allows some points to violate the margin, controlled by the parameter **C**.

| Value of C | Behaviour |
|---|---|
| **Large C** | Few violations allowed → **narrow margin**, tries hard to classify every training point → risk of **overfitting** |
| **Small C** | More violations tolerated → **wider margin**, more generalisation → risk of **underfitting** |

*(In sklearn, `SVC(C=1.0)` is the default.)*

---

## 4. Non-Linear Data and the Kernel Trick

**Problem:** Real data is often **not linearly separable** — no straight line can split it.

**Solution:** Map the data into a **higher-dimensional space**, where it *does* become linearly separable, then find the linear boundary there. Back in the original space, that boundary looks curved.

### Kernel Functions
> **Definition from the slides:** The **kernel defines the similarity or a distance measure between new data and the support vectors.**

- The **dot product** is the similarity measure used for a **linear SVM / linear kernel**, because the distance is a **linear combination of the inputs**.
- **`K(a, b) = (a · b + 1)^d`** is an example of an SVM kernel function (the **polynomial kernel**).
- Beyond polynomials there are other **very high-dimensional basis functions** that can be made practical by finding the right kernel function — **this is called the KERNEL TRICK.**

### The Kernel Trick, in one sentence
> Compute the **dot product in the high-dimensional space without ever actually transforming the data into that space** — you just evaluate the kernel function on the original inputs. This makes even infinite-dimensional feature spaces computationally practical.

### Common kernels

| Kernel | Formula / description | When to use |
|---|---|---|
| **Linear** | `K(a,b) = a · b` | Data is linearly separable; many features |
| **Polynomial** | `K(a,b) = (a · b + 1)^d` | Curved boundaries; `d` = degree |
| **Radial-Basis (RBF / Gaussian)** | `K(a,b) = exp(−γ‖a−b‖²)` | General-purpose default for non-linear data |
| **Sigmoidal** | `K(a,b) = tanh(κ·a·b + c)` | Neural-network-like behaviour |

*(The slides explicitly list the polynomial example, the Radial-Basis-style kernel, and the sigmoidal function.)*

---

## 5. Multiclass Classification with SVM

SVM is inherently a **binary** classifier. For more than two classes:

- **One-vs-Rest (OvR / one-vs-all):** one SVM per class, that class vs all others → **k classifiers**.
- **One-vs-One (OvO):** one SVM per pair of classes → **k(k−1)/2 classifiers**, decided by majority vote.

*(In sklearn, `SVC(decision_function_shape='ovr')` is the default setting shown in the slides.)*

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

> **Important observation:** On this dataset the **Linear SVM (0.787) massively outperformed the degree-4 Polynomial SVM (0.583)**. A more complex kernel is **not** automatically better — the wrong kernel can badly overfit or distort the boundary.

### Default `SVC` parameters visible in the slide output
`C=1.0`, `cache_size=200`, `class_weight=None`, `coef0=0.0`, `decision_function_shape='ovr'`, `degree=3`, `kernel='linear'` (as set), `max_iter=-1`, `probability=False`, `shrinking=True`, `tol=0.001`.

---

## 7. SVM vs SVR (link to note 03)

| | **SVM (classifier)** | **SVR (regressor)** |
|---|---|---|
| Target | Categorical class | Continuous number |
| Goal | **Maximise the margin** between classes | Fit a function so most points lie **inside an ε-tube** |
| Loss | Hinge loss | **Epsilon-insensitive loss** (zero loss inside the tube) |
| sklearn | `SVC` | `SVR` |

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
