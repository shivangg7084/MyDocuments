# Machine Learning — Exam Study Pack (MCQ Preparation)

Plain-language notes for every concept in the source documents in [`../`](../), each followed by practice MCQs with answers.

**Start here.** This page is not just a list of files — read it top to bottom and you will already understand what the whole subject is about and how the pieces fit together. The individual notes then fill in the detail.

---

## Part 1 — The Whole Subject in One Story

### What is machine learning, really?

In normal programming, **you** write the rules. To detect spam you would sit down and write: *if the subject contains "FREE MONEY", mark it spam.* Then spammers write "FR€€ M0NEY" and your rule dies. You can never write enough rules.

Machine learning flips this around. **You show the computer thousands of emails that are already labelled spam or not-spam, and the computer works out the rules itself.**

That is the single most important idea in the entire course, and it is why the slides show these two boxes:

```
Traditional programming:   Data + Program  →  Output
Machine learning:          Data + Output   →  Program
```

Read that twice. In traditional programming the *program is something you give*. In machine learning the *program is something you get back*. The "program" that comes back is called the **model**.

### The three families of learning

Everything in this course sits inside one of three families, and they differ by **what information you have**:

| Family | What you have | What the computer does | Everyday analogy |
|---|---|---|---|
| **Supervised** | Questions **and** their correct answers | Learns the answer pattern, then answers new questions | Studying with a solved question bank |
| **Unsupervised** | Only questions, **no answers** | Finds natural groupings and structure on its own | Sorting a pile of unlabelled photos into piles that "look similar" |
| **Reinforcement** | No dataset at all — an environment that rewards or punishes | Learns by trial and error, one decision at a time | Learning to ride a bicycle by falling off it |

**Almost this entire syllabus is supervised learning.** Notes 03–09 are all supervised. Note 10 (PCA/ICA) is unsupervised. Reinforcement learning appears only briefly in note 01.

### The one distinction the exam keeps testing

Inside supervised learning there are exactly two problem types, and **which one you have depends only on the thing you are trying to predict** (the target):

- Target is a **number** → **Regression**. *House price, temperature, salary.*
- Target is a **category** → **Classification**. *Spam/not-spam, disease/no-disease, dog/cat.*

Nothing else decides this. Not the inputs, not the algorithm, not the data size. Only the target.

### The pipeline — the order in which everything happens

Every real ML project runs through these six stages, and **the notes are numbered to follow this exact order**:

```
 1. Get raw data              ─────────────────────► messy, has gaps, wrong scales
        │
 2. CLEAN IT  (note 02)       ─────────────────────► fill missing values, handle outliers,
        │                                            scale numbers, encode text as numbers
 3. SPLIT IT  (notes 03, 09)  ─────────────────────► Train / Validation / Test
        │
 4. TRAIN A MODEL (notes 03-07) ───────────────────► Linear Reg, Logistic Reg, Naive Bayes,
        │                                            KNN, Decision Tree, SVM, Random Forest…
 5. CHECK IT   (notes 08, 09) ─────────────────────► Is it underfitting or overfitting?
        │                                            Accuracy, Precision, Recall, ROC
 6. IMPROVE IT (notes 07, 08, 10) ─────────────────► Ensembles, regularization, fix class
                                                     imbalance, reduce dimensions
```

**Why cleaning comes before everything:** the slides say data preprocessing takes the *major chunk* of the effort in a real project. A brilliant algorithm on filthy data loses to a simple algorithm on clean data, every time.

---

## Part 2 — Every Topic, Explained Simply

Each block below gives you: **the question it answers**, **the idea in everyday terms**, and **the one line to carry into the exam**.

---

### 01 · Introduction to Machine Learning
[→ open the note](01-Introduction-to-Machine-Learning.md) · *from `Machine_Learning_-_Introduction.pdf`*

**The question it answers:** What is this subject, and when should anyone use it?

**The idea:** ML is worth using in four situations, and they are all about *rules being impossible to write by hand*. Either nobody knows the rules (**navigating on Mars** — no human has done it), or people know them but cannot explain them (**speech recognition** — you understand speech instantly but cannot write down how), or the rules keep changing (**network routing** — traffic shifts every minute), or you are drowning in data but short of experts.

The formal definition you must be able to recognise is Tom Mitchell's: a program learns from **Experience E** at **Task T** measured by **Performance P**. For a spam filter: E = the labelled old emails, T = classify spam, P = accuracy.

**Carry this in:** *Data + Output → Program.* And classification vs regression is decided by the target alone.

---

### 02 · EDA and Data Preprocessing
[→ open the note](02-EDA-and-Data-Preprocessing.md) · *from the Exploratory Data Analysis PDF*

**The question it answers:** Raw data is a mess. How do I make it usable?

**The idea:** Four kinds of mess, four fixes.

1. **Gaps (missing values).** A blank, a `NaN`, or a special symbol — in the Census dataset it is a `?`. Either delete those rows (safe only if you have plenty of data), or fill them in with the mean/median/mode, which is called **imputation**. Careful: an imputed value is a guess, and guesses add bias.

2. **Freaks (outliers).** One person aged 200. Spot them with a **box plot**, a **scatter plot**, a **Z-score** (beyond ±3 is suspicious), or the **IQR rule** (outside Q1−1.5×IQR to Q3+1.5×IQR). Then think before you delete: a typo should be removed, but a genuinely 20-year-old millionaire is real data and should be kept.

3. **Mismatched scales.** Salary runs 20,000–90,000 and age runs 17–90. Any algorithm that measures distance will think salary is a thousand times more important, purely because of the units. Fix it by **scaling** (squash into 0–1) or **standardizing** (recentre to mean 0, spread 1).

4. **Words where numbers are needed.** Models cannot read "Private" or "State-gov". **Label encoding** turns them into 0, 1, 2 — but that quietly tells the model that 2 is *bigger* than 1, which is nonsense for job types. **One-hot encoding** fixes this by making a separate yes/no column per category.

**Carry this in:** Label encoding invents a fake order; one-hot does not. Standardization gives mean 0 and standard deviation 1. IQR = Q3 − Q1.

---

### 03 · Supervised Learning — Regression and Classification
[→ open the note](03-Supervised-Learning-Regression-and-Classification.md) · *from `Supervised_Learning.pdf`*

**The question it answers:** Given labelled data, what are the actual algorithms?

**The idea:** This is the biggest note because it covers the whole toolbox.

- **Linear regression** draws the best straight line through the points. Simple, fast, interpretable.
- **Polynomial regression** is the same thing when the trend is curved — you just feed in X, X², X³ as extra columns. In code, literally one wrapper changes.
- **KNN** is the laziest algorithm alive: it memorises the training data and, when asked about a new point, looks at its k nearest neighbours and copies them. **Average** their values → KNN regression. Take a **majority vote** → KNN classification. Same algorithm, two endings.
- **Decision trees** are a flowchart of if-else questions learned from the data. Wonderfully readable — you can print the tree and show it to your boss. Their weakness: grow them too deep and they memorise the training set instead of learning from it.
- **Ridge and Lasso** are linear regression with a leash. When a model assigns wildly large weights to features, it is usually overfitting. Adding a penalty for large weights reins it in. **Ridge (L2)** shrinks the weights but never to exactly zero; **Lasso (L1)** can drive weights to exactly zero, which means it deletes useless features for you.
- **SVR** fits a line with a tolerance tube around it. Points inside the tube are "close enough" and cost nothing; only the points outside pull on the model.

Also here: **multicollinearity** — when two input features say almost the same thing (height in cm and height in inches), the model cannot tell which one deserves the credit, so its coefficients swing wildly and become meaningless.

And the **train / validation / test split**, which is the single most important discipline in ML: train on one part, tune your choices on a second part, and touch the third part **exactly once, at the very end**. The moment you tune against the test set, your final score becomes a lie.

**Carry this in:** KNN is a lazy learner (fit just stores data). Ridge shrinks, Lasso zeroes. Trees need no feature scaling.

---

### 04 · Logistic Regression
[→ open the note](04-Logistic-Regression.md) · *from the Logistic Regression deck*

**The question it answers:** How do I predict a yes/no answer?

**The idea:** Start with a straight line, like linear regression. The problem is a line runs off to ±infinity, and "will this customer repay the loan?" needs an answer between 0 and 1. So you push the line's output through the **sigmoid**, an S-shaped squashing function that turns any number into a probability.

Big number in → probability near **1**. Big negative number in → probability near **0**. Zero in → exactly **0.5**.

The straight-line part before the squashing is called the **logit**. The final answer comes from a **cut-off**, normally 0.5: above it, class 1; below it, class 0. You can move that cut-off, and moving it is a real decision — raise it and you make fewer positive predictions but you are surer about each one.

**Carry this in:** Despite the name, **logistic regression is a classification algorithm**. This is the single most common trick question in the whole syllabus.

---

### 05 · Naive Bayes
[→ open the note](05-Naive-Bayes.md) · *from the Naive Bayes deck*

**The question it answers:** Can I classify things using nothing but counting and probability?

**The idea:** Yes. For each class, ask "how likely is this evidence if the answer were *this* class?", multiply by how common that class is in general, and pick whichever class scores higher. That is **Bayes' theorem**, and picking the highest scorer is the **MAP rule**.

The word **"naive"** is an admission of a shortcut. Properly, you would need to know how all the features interact — impossible to estimate. So Naive Bayes simply *assumes every feature is independent of every other one* and multiplies their individual probabilities. In the tennis example, it assumes that being Sunny tells you nothing about whether it is Humid. That is plainly false, and yet the algorithm works remarkably well anyway.

Its famous failure: if some feature value never appeared with some class in training, its probability is 0, and multiplying by zero wipes out the entire calculation. That is the **Zero Probability problem**, and the standard cure is **Laplace smoothing** — add 1 to every count so nothing is ever exactly zero.

**Carry this in:** Naive = features assumed independent. Zero-probability problem = a never-seen combination kills the prediction.

---

### 06 · Support Vector Machines
[→ open the note](06-Support-Vector-Machines.md) · *from the SVM deck*

**The question it answers:** Of the infinitely many lines that separate two classes, which one is best?

**The idea:** The one that leaves the **widest empty corridor** between the classes. That corridor is the **margin**, and SVM's whole purpose is to make it as wide as possible. A wide corridor means a new, slightly unusual point is still unlikely to land on the wrong side — which is exactly what good generalization means.

Only the handful of points sitting right on the edge of the corridor matter. They are the **support vectors**. Delete any other training point and the boundary does not move at all.

Then the clever part. Real data often cannot be split by any straight line. The fix is to imagine lifting the data into a much higher-dimensional space where it *can* be split flatly, and then draw the line there — back in the original space that line looks like a curve. Doing this literally would be impossibly expensive, so SVM uses the **kernel trick**: it computes what the answer *would* be in that high-dimensional space **without ever actually going there**.

**Carry this in:** Margin = how far the boundary can widen before touching a point. Support vectors are the only points that matter. Kernel trick = high-dimensional results without high-dimensional work.

---

### 07 · Ensemble Methods
[→ open the note](07-Ensemble-Methods.md) · *from the Ensemble Methods deck*

**The question it answers:** Instead of perfecting one model, can I combine many mediocre ones?

**The idea:** Yes, and it usually wins. The governing hypothesis is that **a group of weak learners together forms a strong learner** — the ML version of asking a large audience instead of one expert.

There are two main ways to run the committee, and the exam lives on the difference:

- **Bagging** — train many models **at the same time**, each on a different random sample of the data (drawn **with replacement**), then let them **vote**. Because each model sees different data, their individual mistakes are different and cancel out in the vote. **Bagging reduces variance.** **Random Forest** is bagging with decision trees, plus one extra twist: each split may only consider a random subset of features, which stops all the trees from looking identical.

- **Boosting** — train models **one after another**, where each new model concentrates on the examples the previous ones got wrong (their weights are increased). It is a relay race rather than a committee. **Boosting reduces bias.** **AdaBoost** is the classic version, combining weak classifiers into a **weighted vote**.

A third form, **stacking**, layers models so higher tiers learn to correct the lower ones.

**Carry this in:** Bagging = parallel, with replacement, cuts **variance**. Boosting = sequential, reweights mistakes, cuts **bias**.

---

### 08 · Classifier Design — Bias, Variance and Class Imbalance
[→ open the note](08-Classifier-Design-Bias-Variance-and-Class-Imbalance.md) · *from the Classifiers Design deck*

**The question it answers:** Why do models fail, and what kinds of model exist?

**The idea:** Every model failure is one of two opposite diseases.

- **High bias** — the model is **too simple** to see the real pattern. It is wrong on the training data *and* wrong on new data. This is **underfitting**.
- **High variance** — the model is **too sensitive** and has memorised the noise in the training data. It is perfect on training data and useless on new data. This is **overfitting**.

Squeeze one and the other grows, which is why it is called the **bias–variance tradeoff**. Too few parameters → large bias. Too many parameters → large variance. The skill is finding the middle.

The note also sorts every algorithm along two axes:
- **Generative vs discriminative:** a generative model (Naive Bayes) learns what each class actually *looks like*, so it could even generate fake examples. A discriminative model (SVM, trees, KNN, neural nets) only learns *where the border is* — cheaper, usually more accurate, but it cannot invent new data.
- **Parametric vs non-parametric:** a parametric model (linear regression, Naive Bayes) has a **fixed** number of parameters no matter how much data you feed it. A non-parametric model (KNN, trees, SVM) **grows** with the data.

Finally, **class imbalance**: if 99% of transactions are legitimate, a lazy model that shouts "legitimate!" every single time scores 99% accuracy and catches zero fraud. The slides' verdict is specific and worth memorising — **undersampling is not effective and can even hurt, while random oversampling helps dramatically**. **SMOTE** is the smart version, manufacturing new synthetic minority examples rather than just photocopying old ones.

**Carry this in:** Bias → underfitting. Variance → overfitting. Naive Bayes is the generative one; nearly everything else here is discriminative.

---

### 09 · Classifier Evaluation and Metrics
[→ open the note](09-Classifier-Evaluation-and-Metrics.md) · *from the Classifiers Evaluation deck*

**The question it answers:** How do I know whether my model is actually any good?

**The idea:** Accuracy alone lies to you. It fails badly with **class skew** and when **different mistakes cost different amounts** — a missed cancer diagnosis is not equivalent to a false alarm.

So you build a **confusion matrix**, which sorts every prediction into four boxes: correctly caught positives (TP), correctly rejected negatives (TN), false alarms (FP), and misses (FN). From those four numbers everything else follows:

- **Precision** — of everything I *flagged*, how much was real? *(Am I crying wolf?)*
- **Recall** — of everything that *was real*, how much did I catch? *(Am I missing things?)*

These two fight each other. Lower your threshold and you catch more real cases (recall up) but raise more false alarms (precision down). **F1** is the single number that balances them.

Since the threshold is adjustable, the honest way to judge a model is to plot its performance across *all* thresholds. That gives you the **ROC curve** (true-positive rate against false-positive rate, summarised by **AUC**) and the **P-R curve** (precision against recall). The slides' distinction: **ROC is insensitive to class distribution**, while **P-R is better when there are lots of negative instances**.

Also here: **cross-validation**, the technique for evaluating a model honestly when you have limited data — split into k folds, train on k−1, test on the one left out, rotate, average.

**Carry this in:** Precision = TP/(TP+FP). Recall = TP/(TP+FN). ROC plots TPR vs FPR; P-R plots precision vs recall.

---

### 10 · Dimensionality Reduction — PCA and ICA
[→ open the note](10-Dimensionality-Reduction-PCA-and-ICA.md) · *from the Dimension Reduction deck*

**The question it answers:** What goes wrong with hundreds of features, and how do I cut them down?

**The idea:** Something genuinely strange happens in high dimensions, called the **curse of dimensionality**. Put 100 points on a line split into 10 bins and each bin holds about 10 points — comfortably dense. Spread the same 100 points over a 10×10 grid and each cell holds about 1. Over a 10×10×10 cube, most cells are simply **empty**. The space grows far faster than your data can fill it, so the data becomes **sparse**, everything ends up roughly equidistant from everything else, and distance-based algorithms stop meaning anything.

**PCA** is the standard cure. It looks for the directions in which the data varies most, calls the strongest ones **principal components**, and throws the rest away. Mathematically it takes the **covariance matrix**, extracts its **eigenvectors** (the directions) and **eigenvalues** (how important each direction is), keeps the top few, and projects the data onto them. Because it works on variance, and variance depends on units, **the data must be scaled before PCA** — otherwise whichever feature happens to be measured in large numbers automatically wins.

**ICA** answers a different question. Picture a party where several people talk at once and several microphones each record a jumble of all the voices. ICA separates the mixture back into the individual voices. **PCA maximises variance; ICA maximises independence.**

**Carry this in:** PCA = variance, must scale first, uses eigenvectors/eigenvalues of the covariance matrix. ICA = independence, separates mixed sources, performs whitening.

---

### 11 · Full Syllabus Mock Test
[→ open the note](11-Full-Syllabus-Mock-Test.md)

60 mixed questions across every topic, plus a last-minute formula and fact sheet. Sit it closed-book in 45 minutes.

---

## Part 3 — Jargon Buster

Exam questions are often just definitions dressed up. These are the words that trip people:

| Term | In plain English |
|---|---|
| **Model** | The rules the computer learned — the thing that makes predictions |
| **Feature** | An input column (also: independent variable, predictor, X) |
| **Target / Label** | The answer column you are predicting (also: dependent variable, Y) |
| **Training** | Adjusting the model until its predictions match the known answers |
| **Loss / Cost function** | The score of how wrong the model currently is; training minimises it |
| **Hyperparameter** | A setting *you* choose before training (k in KNN, max_depth in a tree, λ in Ridge) — not learned from data |
| **Parameter** | A value the model *learns* by itself (the coefficients of a line) |
| **Generalization** | Doing well on data the model has never seen — the entire point |
| **Overfitting** | Memorising the training data, including its noise |
| **Underfitting** | Being too simple to capture the real pattern |
| **Bias** | Error from wrong assumptions — a model too rigid to learn the truth |
| **Variance** | Error from over-sensitivity — the model changes wildly with small data changes |
| **Weak learner** | A model barely better than guessing (e.g. a one-split decision stump) |
| **Bootstrap** | A random sample drawn **with replacement** — the same row can appear twice |
| **Imputation** | Filling in missing values with a sensible substitute |
| **Sparsity** | Data spread so thinly across a huge space that most of it is empty |
| **Whitening** | Rescaling data so features are uncorrelated with equal spread |
| **Lazy learner** | Learns nothing at training time and does all the work at prediction time (KNN) |

---

## Part 4 — Concepts Students Mix Up (learn these as pairs)

| These two look similar… | …but here is the actual difference |
|---|---|
| **Classification vs Regression** | Target is a **category** vs target is a **number**. Nothing else matters. |
| **Bias vs Variance** | Too **simple** (underfit, bad everywhere) vs too **sensitive** (overfit, great on train only). |
| **Bagging vs Boosting** | **Parallel** voters, sampled **with** replacement, cuts **variance** — vs **sequential** learners that reweight past mistakes, cutting **bias**. |
| **Ridge vs Lasso** | L2, shrinks weights but **never to zero** — vs L1, which **can zero them out** and so selects features. |
| **Precision vs Recall** | "Of what I **flagged**, how much was real?" vs "Of what **was real**, how much did I catch?" |
| **Generative vs Discriminative** | Learns what each class **looks like** (can generate data) vs learns only **where the border is**. |
| **Parametric vs Non-parametric** | **Fixed** number of parameters vs a number that **grows with the data**. |
| **PCA vs ICA** | Maximise **variance** (compress) vs maximise **independence** (separate mixed sources). |
| **Label vs One-hot encoding** | Numbers that accidentally imply an **order** vs separate 0/1 columns with **no order**. |
| **Feature Selection vs Extraction** | **Keep** a subset of the original columns vs **build new** derived columns (PCA/ICA). |
| **Validation vs Test set** | Used **repeatedly** to choose the model vs used **once** for the final honest score. |
| **Scaling vs Standardization** | Squash into a range like 0–1 vs recentre to **mean 0, std 1**. |
| **ROC vs P-R curve** | TPR vs FPR, ignores class balance — vs precision vs recall, better with **many negatives**. |
| **SVM vs SVR** | Widest **corridor between classes** vs a **tolerance tube** around a fitted line. |

---

## Part 5 — Which Algorithm Is Which?

One table to place every algorithm in the syllabus:

| Algorithm | Solves | Generative / Discriminative | Parametric / Non-parametric | Remember it by |
|---|---|---|---|---|
| **Linear Regression** | Regression | — | Parametric | Best straight line |
| **Polynomial Regression** | Regression | — | Parametric | Curved line via X², X³ |
| **Ridge / Lasso** | Regression | — | Parametric | Linear regression on a leash |
| **Logistic Regression** | **Classification** | Discriminative | Parametric | Line + sigmoid = probability |
| **Naive Bayes** | Classification | **Generative** | Parametric | Counting + Bayes + independence |
| **KNN** | Both | Discriminative | Non-parametric | Copy your neighbours |
| **Decision Tree** | Both | Discriminative | Non-parametric | Learned flowchart |
| **SVM / SVR** | Both | Discriminative | Non-parametric | Widest corridor / tolerance tube |
| **Random Forest** | Both | Discriminative | Non-parametric | Bagging + random features |
| **AdaBoost** | Classification | Discriminative | — | Weighted vote of weak learners |
| **PCA / ICA** | **Unsupervised** | — | — | Compress / un-mix |

---

## Part 6 — How to Use This Pack

1. **Read this page first.** It gives you the map, so no individual note arrives out of nowhere.
2. **Read notes 01 → 10 in order.** Each explains the concept in plain language first, then gives the exact wording from the slides. That exact wording matters: MCQ options are usually built word-for-word from it.
3. **Do each note's MCQs immediately**, while the topic is fresh. Every answer has a one-line justification, so a wrong answer teaches you something instead of just being wrong.
4. **Sit the mock test (note 11) closed-book**, timed at 45 minutes.
5. **The night before:** read only Parts 3, 4 and 5 of this page, plus the "Pairs to never confuse" table at the end of note 11.

**Total practice questions: 292** (20 + 25 + 30 + 25 + 25 + 25 + 30 + 30 + 32 + 30 + 60).

---

## Part 7 — The 12 Facts Most Likely to Appear in an MCQ

1. **ML flips traditional programming:** Data + Output → **Program**.
2. **Bias → underfitting; Variance → overfitting.** Too few parameters = large bias; too many = large variance.
3. **Logistic Regression is a CLASSIFICATION algorithm** that outputs a probability via the **sigmoid**; the linear part is the **logit**; default cut-off **0.5**.
4. **Naive Bayes = generative + parametric**, assumes **conditional independence**, uses the **MAP rule**, suffers the **Zero-Probability problem** (fix: Laplace smoothing).
5. **SVM:** introduced **1992**, famous for **handwritten digit recognition**, maximises the **margin**, handles non-linearity with the **kernel trick**; **discriminative + non-parametric**.
6. **Bagging** = parallel, sampling **with replacement**, reduces **variance**. **Boosting** = sequential, **without replacement**, increases weights of misclassified points, reduces **bias**.
7. **Random Forest = bagging + random feature subset at each split**; generalization error depends on **tree strength and correlation between trees**.
8. **AdaBoost** = strong classifier as a **linear combination** of weak ones, final answer by **weighted vote**; best accuracy (0.864) on the Census dataset.
9. **Precision = TP/(TP+FP), Recall = TP/(TP+FN), FPR = FP/(FP+TN).**
10. **ROC = TPR vs FPR** (insensitive to class distribution); **P-R = Precision vs Recall** (good when there are lots of negatives).
11. **PCA must be run on scaled data**; it uses **eigenvectors (direction) and eigenvalues (importance)** of the **covariance matrix**; it maximises **variance**. **ICA maximises independence** and performs **whitening**.
12. **Class imbalance:** learners are biased toward the **majority class**; **undersampling can hurt**, **random oversampling helps dramatically**; **SMOTE** creates synthetic minority samples. **Decision Trees are sensitive; Naive Bayes is less prone.**

---

## Appendix — File Index

| # | File | Source document |
|---|---|---|
| 01 | [Introduction to Machine Learning](01-Introduction-to-Machine-Learning.md) | `Machine_Learning_-_Introduction.pdf` |
| 02 | [EDA & Data Preprocessing](02-EDA-and-Data-Preprocessing.md) | `..._Exploratory_Data_Analysis_-_Data_Preprocessing.pdf` |
| 03 | [Supervised Learning: Regression & Classification](03-Supervised-Learning-Regression-and-Classification.md) | `Supervised_Learning.pdf` |
| 04 | [Logistic Regression](04-Logistic-Regression.md) | `..._Logistic_Regression.pptx` |
| 05 | [Naive Bayes](05-Naive-Bayes.md) | `..._Naive_Bayes.pptx` |
| 06 | [Support Vector Machines](06-Support-Vector-Machines.md) | `..._SVM.pptx` |
| 07 | [Ensemble Methods](07-Ensemble-Methods.md) | `..._Ensemble_methods.pptx` |
| 08 | [Classifier Design](08-Classifier-Design-Bias-Variance-and-Class-Imbalance.md) | `..._Classifiers_Design.pptx` |
| 09 | [Classifier Evaluation & Metrics](09-Classifier-Evaluation-and-Metrics.md) | `..._Classifiers_Evaluation.pptx` |
| 10 | [Dimensionality Reduction: PCA & ICA](10-Dimensionality-Reduction-PCA-and-ICA.md) | `..._Dimension_Reduction_Ramya.pptx` |
| 11 | [Full Syllabus Mock Test](11-Full-Syllabus-Mock-Test.md) | — |
