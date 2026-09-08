# 05 — Naive Bayes Classifier

> Source: `Machine_Learning_-_Classifiers_-_Naive_Bayes.pptx`

---

## 1. What is Naive Bayes?

- Naive Bayes is a **simple but powerful algorithm which uses probability**, i.e. **Bayes' Theorem.**
- The name has **two parts: "Naive" and "Bayes".**

| Part | Meaning |
|---|---|
| **"Naive"** | It **assumes that the presence of a feature in a class is unrelated to any other feature** — i.e. all features are **conditionally independent**. This assumption is naive (unrealistic), hence the name. |
| **"Bayes"** | It applies **Bayes' theorem for conditional probability.** |

### The idea in everyday terms

You get an email containing the words *"free"*, *"winner"* and *"click"*. You ask two questions:

- **If this were spam**, how likely am I to see these words? → *Very likely.*
- **If this were a normal email**, how likely am I to see these words? → *Very unlikely.*

Spam wins, so you classify it as spam. **That is the entire algorithm.** Everything below is that intuition written formally.

---

## 2. Bayes' Theorem

```
              P(X | C) · P(C)
P(C | X) = ───────────────────
                  P(X)
```

| Term | Name | Meaning | Spam example |
|---|---|---|---|
| **P(C \| X)** | **Posterior** | Probability of class C **given** evidence X — what we want | P(spam given these words) |
| **P(X \| C)** | **Likelihood** | Probability of the evidence if the class were C | P(these words appear, in spam) |
| **P(C)** | **Prior** | Probability of class C before seeing evidence | 40% of all mail is spam |
| **P(X)** | **Evidence** | Probability of the evidence overall | P(these words in any email) |

**How to keep them straight:** the **prior** is what you believed *before* looking; the **posterior** is what you believe *after* looking. Bayes' theorem is the formal rule for updating a belief when evidence arrives.

### The Naive assumption applied

Properly, you would need P(all features together | class) — but with 20 features you would need astronomically many examples to estimate it. So Naive Bayes assumes independence and just multiplies:

```
P(x1, x2, ..., xn | C) = P(x1|C) · P(x2|C) · ... · P(xn|C)
```

An impossible joint probability becomes a handful of easy counts.

**Is the assumption true?** Almost never. In the weather data, "Sunny" and "Hot" clearly travel together. **And yet the algorithm works well anyway** — because for *classification* you only need the right class to score highest, not the probabilities themselves to be accurate.

### The MAP rule

**P(X) is the same for every class**, so it cannot change which class wins. Drop it and compare numerators:

```
Predicted class = argmax over C of  [ P(x1|C)·P(x2|C)·…·P(xn|C) · P(C) ]
```

This is the **MAP rule** (**Maximum A Posteriori**) — *"pick whichever class has the biggest likelihood × prior".*

---

## 3. Fully Worked Example — the "Play Tennis" Dataset

> The slides show this example as images. Below is the standard 14-row dataset those images use — reconstructed here so you can follow every arithmetic step. **The final numbers match the slides exactly (0.0053 vs 0.0206), which confirms it is the same data.**

### The training data (14 days)

| Day | Outlook | Temperature | Humidity | Wind | **Play** |
|---|---|---|---|---|---|
| 1 | Sunny | Hot | High | Weak | **No** |
| 2 | Sunny | Hot | High | Strong | **No** |
| 3 | Overcast | Hot | High | Weak | **Yes** |
| 4 | Rain | Mild | High | Weak | **Yes** |
| 5 | Rain | Cool | Normal | Weak | **Yes** |
| 6 | Rain | Cool | Normal | Strong | **No** |
| 7 | Overcast | Cool | Normal | Strong | **Yes** |
| 8 | Sunny | Mild | High | Weak | **No** |
| 9 | Sunny | Cool | Normal | Weak | **Yes** |
| 10 | Rain | Mild | Normal | Weak | **Yes** |
| 11 | Sunny | Mild | Normal | Strong | **Yes** |
| 12 | Overcast | Mild | High | Strong | **Yes** |
| 13 | Overcast | Hot | Normal | Weak | **Yes** |
| 14 | Rain | Mild | High | Strong | **No** |

**Counts: 9 Yes, 5 No, out of 14 days.**

### Training phase = counting and building look-up tables

Naive Bayes "training" is nothing but counting frequencies. There is no gradient descent, no iteration — one pass through the data and you are done. That is why it is so fast.

**Priors:**
```
P(Play = Yes) = 9/14 = 0.643
P(Play = No)  = 5/14 = 0.357
```

**Outlook** (count each value within each class):

| Outlook | Yes | No | P(·\|Yes) | P(·\|No) |
|---|---|---|---|---|
| Sunny | 2 | 3 | **2/9** | **3/5** |
| Overcast | 4 | 0 | 4/9 | 0/5 |
| Rain | 3 | 2 | 3/9 | 2/5 |

**Temperature:**

| Temperature | Yes | No | P(·\|Yes) | P(·\|No) |
|---|---|---|---|---|
| Hot | 2 | 2 | 2/9 | 2/5 |
| Mild | 4 | 2 | 4/9 | 2/5 |
| Cool | 3 | 1 | **3/9** | **1/5** |

**Humidity:**

| Humidity | Yes | No | P(·\|Yes) | P(·\|No) |
|---|---|---|---|---|
| High | 3 | 4 | **3/9** | **4/5** |
| Normal | 6 | 1 | 6/9 | 1/5 |

**Wind:**

| Wind | Yes | No | P(·\|Yes) | P(·\|No) |
|---|---|---|---|---|
| Weak | 6 | 2 | 6/9 | 2/5 |
| Strong | 3 | 3 | **3/9** | **3/5** |

### Test / prediction phase

Given the new day from the slides:

```
x' = (Outlook = Sunny, Temperature = Cool, Humidity = High, Wind = Strong)
```

The algorithm **refers to the look-up tables** and applies the **MAP rule**.

**Score for "Yes":**
```
P(Sunny|Yes) × P(Cool|Yes) × P(High|Yes) × P(Strong|Yes) × P(Yes)
  =  (2/9)  ×  (3/9)  ×  (3/9)  ×  (3/9)  ×  (9/14)
  =  0.2222 × 0.3333 × 0.3333 × 0.3333 × 0.6429
  =  0.0053
```

**Score for "No":**
```
P(Sunny|No) × P(Cool|No) × P(High|No) × P(Strong|No) × P(No)
  =  (3/5)  ×  (1/5)  ×  (4/5)  ×  (3/5)  ×  (5/14)
  =  0.6    × 0.2    × 0.8    × 0.6    × 0.3571
  =  0.0206
```

**Since P(Yes|x') = 0.0053 < P(No|x') = 0.0206, the label predicted for x' is "No".**

> **Memorise these two numbers — they appear directly in the slides: 0.0053 (Yes) vs 0.0206 (No) → predict "No".**

**Sanity check on the result:** Sunny days in this dataset are mostly No (3 of 5), High humidity leans No, Strong wind is a coin flip. The evidence stacks against playing — the arithmetic simply confirms what the data pattern suggests.

**If you want actual probabilities**, normalise so they sum to 1:
```
P(No | x')  = 0.0206 / (0.0206 + 0.0053) = 0.795  → about 80% confident
P(Yes | x') = 0.0053 / (0.0206 + 0.0053) = 0.205
```

### Second example — Mammals vs Non-mammals

The slides compute `P(A|M)·P(M)` and `P(A|N)·P(N)` for an animal with attributes such as *(gives birth = yes, can fly = no, lives in water = yes, has legs = no)*.

**Since P(A|M)·P(M) > P(A|N)·P(N), it is predicted as Mammals.**

> The pattern never changes: **compute likelihood × prior for each class, pick the bigger one.**

---

## 4. Gaussian Naive Bayes

**The problem:** counting works for *categorical* features (Sunny, Rain). But what about **age = 34.7** or **salary = ₹62,431**? You cannot count how many times exactly 34.7 appeared — probably once, or never.

**The solution:**
- **Continuous values associated with each feature are assumed to be distributed according to a Gaussian (Normal) distribution.**
- **The likelihood of the features is assumed to be Gaussian**, so the conditional probability comes from the normal density:

```
                     1                (x − μc)²
P(x | c) = ───────────────────  · exp( − ───────── )
            √(2π·σc²)                     2σc²
```

where **μc** and **σc** are the **mean and standard deviation of that feature within class c.**

**How this works in practice:** instead of counting, you compute two numbers per feature per class. For a loan dataset:

```
Among people who repaid:      mean age = 65,  std = 12
Among people who defaulted:   mean age = 42,  std = 10
```

A new applicant aged 68 lands near the centre of the "repaid" bell curve and out in the tail of the "defaulted" one — so the age feature votes strongly for "repaid". **The bell curve replaces the frequency count.**

**Other variants worth knowing:** *Multinomial NB* (word counts — the standard choice for text classification) and *Bernoulli NB* (binary present/absent features).

---

## 5. Applications

- **Digits classification**
- **Spam filtering** — the classic; nearly every early spam filter was Naive Bayes
- **Weather prediction**
- **Stock market prediction**

*Why it dominates text tasks:* documents have thousands of features (one per word), which cripples most algorithms. Naive Bayes just multiplies thousands of small probabilities and stays fast.

---

## 6. Pros and Cons

### Pros
- NB is a **fast and accurate** method for prediction — training is a single counting pass
- It has **very low computation cost**
- It can **efficiently work on both small and large datasets** — it needs surprisingly little data, since it estimates each feature separately
- It is **robust to noise points and outliers** — one weird row barely shifts a frequency count

### Cons
- **NB assumes features are independent of each other. In practice this is almost impossible.**
- **If there is no training tuple of a particular class, this causes a zero posterior probability, and the model is unable to make predictions.** This is the **Zero Probability / Zero Frequency Problem.**

### The Zero Probability problem, made concrete

In the tennis table, look at **Overcast + No**: the count is **0**. So `P(Overcast|No) = 0/5 = 0`.

Now classify *(Overcast, Hot, High, Strong)* for the "No" class:
```
0  ×  (2/5)  ×  (4/5)  ×  (3/5)  ×  (5/14)  =  0
```
**One single zero annihilates the entire product**, no matter how strongly the other three features argued for "No". A multiplication chain is only as strong as its weakest link.

**The fix — Laplace smoothing (add-one smoothing):** add 1 to every count so nothing is ever exactly zero.
```
Before:  P(Overcast|No) = 0/5     = 0
After:   P(Overcast|No) = (0+1)/(5+3) = 1/8 = 0.125
```
*(The denominator gains 3 because Outlook has 3 possible values.)* The probability is now tiny but non-zero — it weakens the case without destroying it.

In sklearn's `GaussianNB` the analogous parameter is **`var_smoothing=1e-09`**.

---

## 7. Python Example (Census Income dataset)

```python
from sklearn.naive_bayes import GaussianNB

NB = GaussianNB()
NB.fit(X_train, y_train)
# GaussianNB(priors=None, var_smoothing=1e-09)

print(NB.predict(X_test))
# [' <=50K' ' <=50K' ' >50K' ... ' <=50K' ' <=50K' ' >50K']

print("Naive Bayes Accuracy = ", NB.score(X_test, y_test))
# Naive Bayes Accuracy = 0.7850591225549785
```

---

## 8. Extra facts that connect to other topics

| Property | Naive Bayes |
|---|---|
| Generative or discriminative? | **Generative** — models P(X\|Y) and P(Y), then applies Bayes' rule |
| Parametric or non-parametric? | **Parametric** |
| Sensitive to class imbalance? | **Less prone** than Decision Trees, which are sensitive |
| Training speed | Extremely fast — one counting pass, no iteration |

---

# MCQ Practice — Naive Bayes

**Q1.** Naive Bayes is based on:
- A) Gradient descent
- B) Bayes' theorem of conditional probability
- C) Information gain
- D) Distance metrics

**Q2.** The word "Naive" in Naive Bayes refers to the assumption that:
- A) The data is normally distributed
- B) The presence of a feature in a class is unrelated to any other feature
- C) All classes are equally likely
- D) There is no noise

**Q3.** In Bayes' theorem, P(C|X) is called the:
- A) Prior
- B) Likelihood
- C) Posterior
- D) Evidence

**Q4.** In Bayes' theorem, P(C) is called the:
- A) Posterior
- B) Prior
- C) Likelihood
- D) Marginal

**Q5.** P(X|C) is called the:
- A) Prior
- B) Likelihood
- C) Posterior
- D) Odds

**Q6.** Under the naive assumption, P(x1, x2, x3 | C) equals:
- A) P(x1|C) + P(x2|C) + P(x3|C)
- B) P(x1|C) · P(x2|C) · P(x3|C)
- C) max of the three
- D) P(C|x1)·P(C|x2)·P(C|x3)

**Q7.** The rule used to select the predicted class in Naive Bayes is:
- A) MLE rule
- B) MAP (Maximum A Posteriori) rule
- C) Nearest neighbour rule
- D) Gini rule

**Q8.** Why can we ignore P(X) in the denominator when classifying?
- A) It is always 1
- B) It is the same for all classes, so it doesn't change which class is largest
- C) It is always 0
- D) It is unknown and assumed to be 0.5

**Q9.** In the tennis example with P(Yes|x') = 0.0053 and P(No|x') = 0.0206, the prediction is:
- A) Yes
- B) No
- C) Undecided
- D) Both equally likely

**Q10.** In the mammals example, the prediction is "Mammals" because:
- A) P(A|M)P(M) > P(A|N)P(N)
- B) P(A|M)P(M) < P(A|N)P(N)
- C) There are more mammals in the dataset
- D) The distance was smaller

**Q11.** In the training phase, Naive Bayes builds:
- A) A decision boundary
- B) Look-up tables of conditional probabilities
- C) A distance matrix
- D) Eigenvectors

**Q12.** Gaussian Naive Bayes assumes that continuous features:
- A) Are uniformly distributed
- B) Follow a Gaussian (Normal) distribution
- C) Are binary
- D) Are independent of the class

**Q13.** Which Naive Bayes variant is best suited for continuous numeric features?
- A) Multinomial NB
- B) Bernoulli NB
- C) Gaussian NB
- D) Categorical NB

**Q14.** Which is NOT a listed advantage of Naive Bayes?
- A) Fast prediction
- B) Very low computation cost
- C) Robust to noise and outliers
- D) It captures feature interactions perfectly

**Q15.** The main theoretical weakness of Naive Bayes is:
- A) It is very slow
- B) The independence assumption is almost never true in practice
- C) It cannot handle large datasets
- D) It requires feature scaling

**Q16.** The Zero Probability / Zero Frequency problem occurs when:
- A) The dataset is too large
- B) There is no training tuple for a particular class or feature value
- C) All probabilities are equal
- D) The features are scaled

**Q17.** A standard fix for the Zero Probability problem is:
- A) Laplace (add-one) smoothing
- B) Removing the feature always
- C) Increasing the learning rate
- D) Using a deeper tree

**Q18.** In `GaussianNB(priors=None, var_smoothing=1e-09)`, `var_smoothing` helps to:
- A) Scale the features
- B) Avoid zero/unstable variances in probability estimates
- C) Select features
- D) Reduce the number of classes

**Q19.** Naive Bayes is classified as which kind of model?
- A) Discriminative
- B) Generative
- C) Instance-based
- D) Ensemble

**Q20.** Compared to Decision Trees, Naive Bayes is:
- A) More sensitive to class imbalance
- B) Less prone to class imbalance
- C) Equally sensitive
- D) Unaffected by any data property

**Q21.** Which of these is NOT listed as an application of Naive Bayes?
- A) Spam filtering
- B) Digits classification
- C) Weather prediction
- D) Image segmentation

**Q22.** The correct sklearn import for Gaussian Naive Bayes is:
- A) `from sklearn.naive_bayes import GaussianNB`
- B) `from sklearn.linear_model import GaussianNB`
- C) `from sklearn.bayes import GaussianNB`
- D) `from sklearn.ensemble import GaussianNB`

**Q23.** The Naive Bayes accuracy on the Census Income dataset in the slides was about:
- A) 0.58
- B) 0.785
- C) 0.85
- D) 0.95

**Q24.** Naive Bayes works well on:
- A) Only small datasets
- B) Only large datasets
- C) Both small and large datasets
- D) Only image data

**Q25.** In the prediction phase, Naive Bayes computes for each class the quantity:
- A) Distance to the class centroid
- B) Product of the conditional probabilities × the class prior
- C) Sum of the feature values
- D) The Gini impurity

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Bayes' theorem for conditional probability. |
| 2 | **B** | Conditional independence of features. |
| 3 | **C** | Posterior = P(class \| evidence). |
| 4 | **B** | Prior = belief before evidence. |
| 5 | **B** | Likelihood = P(evidence \| class). |
| 6 | **B** | Independence → multiply. |
| 7 | **B** | MAP rule. |
| 8 | **B** | Constant across classes. |
| 9 | **B** | 0.0053 < 0.0206 → "No". |
| 10 | **A** | Larger likelihood × prior wins. |
| 11 | **B** | Frequency look-up tables. |
| 12 | **B** | Gaussian likelihood assumption. |
| 13 | **C** | Gaussian NB. |
| 14 | **D** | It explicitly ignores feature interactions. |
| 15 | **B** | Independence is almost impossible in practice. |
| 16 | **B** | Missing tuple → zero posterior. |
| 17 | **A** | Laplace smoothing. |
| 18 | **B** | Prevents zero/degenerate variance. |
| 19 | **B** | Models P(X\|Y) and P(Y). |
| 20 | **B** | Slides say NB is less prone to class imbalance. |
| 21 | **D** | Not in the listed applications. |
| 22 | **A** | `sklearn.naive_bayes`. |
| 23 | **B** | 0.7850591225549785. |
| 24 | **C** | Works efficiently on both. |
| 25 | **B** | Likelihood product × prior. |
