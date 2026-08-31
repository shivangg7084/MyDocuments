# Loan Approval Prediction — EDA & Data Analysis

> Exploratory Data Analysis, Data Cleaning, Transformation, Statistical Analysis and
> Visualization on 4,269 loan applications for **ABC Bank**.
>
> **Deliverables:** [`Loan_Approval_EDA.ipynb`](Loan_Approval_EDA.ipynb) · `README.md`
> **Scope:** Data understanding → cleaning → transformation → statistics → visualization →
> ML readiness. **No model is trained. No `scikit-learn` is used.**

---

## 1. Project Overview

ABC Bank wants to build an AI/ML system that evaluates loan applications against financial and
applicant parameters before granting a loan. This project is the step that comes **before** any
model: it establishes whether the available data is understood and trustworthy enough to model
at all.

The dataset holds one row per loan application, with applicant attributes captured at
application time (income, requested amount, loan term, credit bureau score, four categories of
asset value, education, employment type, dependents) and the bank's recorded decision.

This notebook delivers:

- a documented, validated, analysis-ready dataset with **zero rows lost**;
- a full evidence trail — every cleaning decision recorded with its evidence, reasoning and risk;
- an evidence-based account of what actually drives the recorded approval decisions;
- an ML-readiness assessment, including leakage, imbalance and fairness considerations.

**Model training is intentionally out of scope.**

---

## 2. Business Problem

Lending decisions are high-impact and asymmetric. A wrongly rejected creditworthy applicant
loses access to capital and the bank loses revenue; a wrongly approved applicant may default. At
portfolio scale both errors are material, and because the decision affects people's financial
lives it also falls under fair-lending scrutiny.

The bank's goal is a system that makes application assessment **faster, more consistent and more
auditable**. Before that is possible we must answer: what data is available, is it reliable, what
patterns exist in past decisions, and is the dataset suitable for modelling?

An eventual model could rank applications by similarity to previously approved ones and flag
borderline cases for review. It **should not replace human decision-making** — a model trained on
historical decisions learns the historical policy, including any bias in it, has no access to
information gathered outside the file, and cannot be accountable for an adverse decision.

---

## 3. Project Objective

1. Understand the dataset and document every feature.
2. Identify numerical and categorical features, and the target — from evidence, not assumption.
3. Assess data quality and establish a measurable baseline.
4. Handle missing values per column, with justification.
5. Investigate duplicates under three distinct definitions.
6. Detect invalid values against domain plausibility rules.
7. Clean categorical variables before encoding.
8. Encode categoricals appropriately for their measurement scale.
9. Detect and investigate outliers using multiple methods; treat only where justified.
10. Analyse distributions, skewness and robust statistics.
11. Engineer meaningful features; demonstrate binning and scaling.
12. Perform univariate, bivariate and multivariate EDA.
13. Produce all nine required visualization types, each answering a stated question.
14. Answer the business questions from computed results.
15. Assess ML readiness, leakage, imbalance and fairness.

---

## 4. Why EDA Is Necessary

Raw data cannot simply be passed into an ML model, because a model inherits every defect in its
input **silently** — it will not warn you.

| Issue | What happens if ignored |
|---|---|
| **Missing values** | Many algorithms fail outright; those that do not may treat NaN as a category or drop rows non-randomly, biasing the result invisibly. |
| **Duplicates** | Records are double-counted in every statistic, and the same row can land in both train and test, producing an optimistic score that is pure artefact. |
| **Invalid values** | Impossible values (a negative asset value) distort means, correlations and model coefficients while looking like ordinary numbers. |
| **Outliers** | Extremes dominate means, standard deviations and distance calculations — but deleting them blindly destroys the legitimate high-value segment. |
| **Categorical data** | `' Graduate'` and `'Graduate'` encode as two separate categories; one real category is split in half and every group statistic on it is wrong. |
| **Distributions** | Skew determines which summary statistic is honest and which algorithms need transformation. |
| **Target imbalance** | Determines how a model must be evaluated; accuracy alone can be meaningless. |
| **Data leakage** | Post-outcome information produces a model that validates brilliantly and fails immediately in production. |

In this project, EDA was not a formality. It found whitespace contamination in 12 of 13 column
names and in **every value** of all three text columns, 28 impossible asset values, and — most
importantly — that the recorded decision is driven almost entirely by **one** variable, in a
**threshold** pattern that a correlation coefficient alone would have described incorrectly.

---

## 5. Dataset

**File:** `Loan Application Accept or Reject.csv` · **4,269 rows × 13 columns** · one row per
application.

No data dictionary ships with the file, so every column meaning was **inferred from the column
name and observed values** and is labelled as inferred in the notebook.

| Column | Type | Meaning (inferred) | Role |
|---|---|---|---|
| `loan_id` | int | Sequential application reference, 1…4269 | Identifier |
| `no_of_dependents` | int | Financial dependents, observed 0–5 | Feature |
| `education` | category | `Graduate` / `Not Graduate` | Feature |
| `self_employed` | category | `Yes` / `No` | Feature |
| `income_annum` | int | Annual income; observed 200,000 – 9,900,000 | Feature |
| `loan_amount` | int | Amount requested; observed 300,000 – 39,500,000 | Feature |
| `loan_term` | int | Loan term; observed as even integers 2–20 (**unit undocumented**) | Feature |
| `cibil_score` | int | Credit bureau score; observed 300–900, matching the published CIBIL scale | Feature |
| `residential_assets_value` | int | Residential property value | Feature |
| `commercial_assets_value` | int | Commercial property value | Feature |
| `luxury_assets_value` | int | Luxury asset value | Feature |
| `bank_asset_value` | int | Bank / financial asset value | Feature |
| `loan_status` | category | `Approved` / `Rejected` | **Target** |

**Honest caveats.** The currency is not documented (magnitudes and the 300–900 CIBIL range are
consistent with an Indian context). `loan_term`'s unit is not documented; values 2–20 are
consistent with years, so it is analysed as an *ordered magnitude* only.

**A finding about the dataset itself.** `income_annum` (skew −0.013) and `cibil_score`
(skew −0.009) are near-**uniform** across their full ranges, and the categorical variables are
near-perfectly balanced. Real income distributions are strongly right-skewed and real credit
scores cluster in the higher bands. This is strong evidence the dataset is **synthetically
generated**. The methodology in this project transfers to real data; the population statistics
do not, and no number here should be quoted as a real-world fact about lending.

---

## 6. Analytical Philosophy

Every transformation passes through the same six gates:

```
        DETECT   ->  Measure the issue. Do not assume it exists.
    INVESTIGATE  ->  Look at the actual rows. Ask what could produce this.
         DECIDE  ->  Choose a treatment, and name the alternative rejected.
      TRANSFORM  ->  Apply it to a copy, never to the raw data.
       VALIDATE  ->  Re-measure. Confirm the issue is gone and nothing else broke.
       DOCUMENT  ->  Record problem, evidence, decision, reason, impact.
```

> **Data cleaning is not about removing everything unusual.
> It is about distinguishing data problems from legitimate variation.**

Preprocessing decisions here are **evidence-based**, never habitual. The notebook answers seven
questions for every important transformation: *what, why, how, what evidence, what assumptions,
what risks, how validated.*

The goal is **not** "make the dataset perfect", but: *make it reliable, interpretable,
analytically useful and suitable for future ML work, while preserving valid information.*

---

## 7. Project Workflow

```
Raw Data
   -> Business Understanding
   -> Data Profiling
   -> Data Quality Assessment
   -> Cleaning
   -> Transformation
   -> Statistics
   -> EDA
   -> Visualization
   -> Storytelling
   -> ML Readiness
```

**Dataframes, and why each exists** — the raw data is never modified, so every before/after
comparison in the notebook is computed rather than remembered:

| Dataframe | Purpose |
|---|---|
| `df_raw` | The file exactly as loaded. **Never modified.** The audit reference. |
| `df` | Pre-cleaning working copy, retained for before/after comparison. |
| `df_clean` | Cleaned and validated. The trusted basis for everything downstream. |
| `df_eda` | `df_clean` + engineered features + bins. Used for exploration. |
| `df_encoded` | Numeric-only representation prepared for future ML. |
| `df_scaled` | Min-max and z-score versions (technique demonstration). |

---

## 8. Why Each Step Exists

| Step | Why? | Typical risk |
|---|---|---|
| Missing values | Incomplete analysis; many algorithms fail | Bias from non-random row deletion |
| Duplicates | Prevent double counting and train/test contamination | Removing valid repeat applications |
| Invalid values | Improve data validity | Acting on an unverified interpretation |
| Type validation | Correct dtypes make correct operations possible | Silent corruption from forced conversion |
| Categorical cleaning | One real category must not split into several | Merging genuinely distinct categories |
| Encoding | Represent categories numerically | Artificial ordering; dummy variable trap |
| Outlier analysis | Identify unusual observations | **Removing legitimate cases** |
| Feature engineering | Ratios encode relationships raw columns cannot | Meaningless features; multicollinearity |
| Binning | Improve interpretability; reveal thresholds | Information loss at bin edges |
| Scaling | Handle differing feature magnitudes | Unnecessary for tree models; leakage if fitted before the split |
| Leakage assessment | Prevent models that fail in production | Removing a legitimate predictor by mistake |

---

## 9. Data Cleaning Decisions

Six defects were detected. **All were resolved without losing a single row or column.**

### 9.1 Whitespace contamination — 12 of 13 column names, and all categorical values

- **Problem:** every column except `loan_id` carried a leading space; so did **every value** in
  all three text columns (4,269 of 4,269 in each).
- **Evidence:** `repr(df.columns)` exposed what plain printing hides. `df["education"]` raises
  `KeyError`.
- **Decision:** standardise names to `snake_case`; strip whitespace from values. **No word was
  changed and no category merged.**
- **Reason:** invisible whitespace is an unreviewable bug class. Because the defect was present on
  *every* row, no category had been split, so stripping is a pure formatting fix.
- **Impact:** all references work; counts verified unchanged.

### 9.2 Missing values — 11 cells, 7 columns, 9 rows (0.02% of cells)

- **Evidence:** the target and `cibil_score` are complete. Eight rows have one missing value; one
  row has three, all in asset columns.
- **Decision:** per-column imputation by an explicit rule — **median** where |skew| ≥ 0.5 or IQR
  outliers are present, **mean** where the column is symmetric, **mode** for categorical.
- **Reason:** the median is robust to the right-skewed asset tails; blanket mean imputation would
  inject values above the bulk of the data. The rule produced *different answers for different
  columns because the columns differ* — mean for `income_annum`, `loan_amount` and
  `luxury_assets_value`; median for `residential_`, `commercial_` and `bank_asset_value`.
- **Impact:** all 4,269 rows retained; every mean and standard deviation shifted by < 0.1%.
- **Risk:** imputation slightly reduces variance. Immaterial at 11 cells; not at scale.

### 9.3 Duplicates — none

All three definitions were tested: **0** exact duplicate rows, **0** repeated `loan_id`, and
**0** duplicates even when ignoring the ID. `drop_duplicates()` was applied anyway as a
defensive no-op, so a future re-run on refreshed data is already guarded.

### 9.4 Invalid values — 28 rows with `residential_assets_value = -100000`

- **Evidence:** an asset cannot be negative. All 28 hold the **identical** value — the signature
  of a sentinel code or a systematic sign error, not random corruption. The column already uses
  `0` for "owns none" (45 rows).
- **Decision:** treat as invalid → `NaN` → **median-impute**.
- **Reason:** recoding to `0`, or taking the absolute value, would each **assert a meaning we
  cannot confirm**; deleting the rows would discard 12 valid fields each. Imputation commits to
  no unverified interpretation.
- **Risk:** if the sentinel means "owns no residential property", assets are overstated for 0.66%
  of rows. **Escalated to the data owner as an open question.**

### 9.5 Zeros — retained

712 applicants with 0 dependents, 107 with no commercial property, 45 with no residential
property, 8 with no bank assets. **Zero is a legitimate value for each.** Treating zero as
missing converts a fact about a real applicant into a gap and then fills it with someone else's
number.

### 9.6 Extreme values — 94 flagged, all retained

See §10.

---

## 10. Outlier Strategy

> **Outliers are not automatically removed.**

A flagged value can be a data-entry error, a system error, a legitimate rare observation, or an
important business case. In lending data the last two dominate: income and asset distributions
are right-skewed **by nature**, so the IQR rule flags that natural shape as anomalous — but the
shape is the reality.

**Four detection methods, because no single one is authoritative:**

| Method | What it contributes |
|---|---|
| **A. IQR rule** | Statistical, distribution-free, reproducible |
| **B. Boxplots** | Shows where flagged points sit relative to the bulk |
| **C. Distribution shape** | Distinguishes a *continuous* tail from a *detached* cluster |
| **D. Domain knowledge** | Is this value possible for a real applicant? |

**What was found:** 94 flagged values (0.24% of numeric cells) in three columns —
`residential_assets_value` (52, 1.22%), `commercial_assets_value` (37, 0.87%),
`bank_asset_value` (5, 0.12%). Six features — including income, loan amount and credit score —
had **zero** flags.

**Every flag was in the upper tail; not one in the lower.** That asymmetry is the signature of
right-skew, not of corruption (which produces errors in both directions).

**Decision: retain all 94, unchanged.** The tails are continuous with no gap; every value is
domain-plausible; and the extreme records are **internally coherent** — high assets alongside
correspondingly high incomes, which is what an error would *not* look like. Deleting them would
remove the wealthiest applicants, the segment carrying the largest loans. That would not clean
the data; it would **censor** it.

**Winsorization was demonstrated and deliberately not applied.** It works — it reduces standard
deviation and skew without losing rows — but after capping, "maximum asset value" would be the
99th percentile rather than the maximum, making any statement about the bank's wealthiest
applicants false. Retaining extremes creates an obligation to use **robust statistics** (median,
IQR) where the tail matters, which the notebook demonstrates: corrupting a single value moves the
mean and standard deviation while leaving the median and IQR **completely unmoved**.

> **The key distinction:** a `cibil_score` of 900 is extreme but *valid by definition* (it is the
> scale's maximum). A `residential_assets_value` of −100,000 is extreme **and impossible**. The
> first is an outlier; the second is an invalid value. They get completely different treatment.

---

## 11. Missing Value Strategy

**Why the mechanism matters.** *MCAR* (unrelated to anything) makes imputation comparatively
safe; *MAR* (depends on other observed columns) is workable; *MNAR* (depends on the missing value
itself) means the *fact* of being missing carries information that naive imputation destroys.

**Why blind row-deletion is dangerous.** `dropna()` looks harmless but deletes rows
**non-randomly** whenever missingness is not MCAR. If low-income applicants were likelier to skip
the income field, dropping those rows quietly shifts the analysed population upmarket — and the
bias is invisible because the evidence for it was deleted.

| Strategy | When it is appropriate |
|---|---|
| **Mean** | Numeric and approximately symmetric — mean ≈ median, and the mean uses all the data |
| **Median** | Numeric and skewed, or with strong outliers — robust, will not inject an inflated value |
| **Mode** | Categorical — the only defined "average" for a nominal variable |
| **Deletion** | High missingness with no defensible fill, or a row unusable without the field |
| **`"Unknown"` category** | When missingness itself carries business meaning |
| **Missingness indicator** | When the *fact* of being missing is informative and has enough support |

**Applied here:** the skewness-driven rule above (§9.2).

**Deliberately declined: missingness indicators.** An indicator built from 1–2 positive cases in
4,269 rows is a near-constant column — no statistical support, extra width, and a ready-made
overfitting hook. Creating one would be applying a technique because it exists rather than
because the evidence calls for it. The technique is demonstrated separately on a labelled
synthetic frame where 25% missingness makes it warranted.

---

## 12. EDA Strategy

**Univariate** — what does each variable look like alone? Centre, spread, shape, concentration.
Histogram + KDE + boxplot for numerics; count plots for categoricals.

**Bivariate** — how does each feature relate to the target? Distribution comparison with
**effect sizes** (Cohen's *d*) for numerics; approval **rates** with 95% confidence intervals for
categoricals. Rates rather than counts, because comparing counts across unequal groups misleads.

**Multivariate** — **does the bivariate finding survive controlling for a confounder?** This step
is not optional, and in this project it changed a conclusion: loan term appeared to matter on its
own, but a cibil × term heatmap showed the effect exists **only** below the credit threshold. It
is an interaction, not an independent effect — and bivariate analysis alone would have reported
it wrongly.

---

## 13. Visualization Strategy

All nine required chart types appear, each answering a stated question. Every important chart is
followed by **Observation → Interpretation → Limitation**.

| Chart | Where | Question it answers | Why this chart |
|---|---|---|---|
| **Basic plot (line)** | §34.1 | How does approval rate change across the credit-score range? | Connects consecutive ordered points; reveals a *step*, not a slope |
| **Bar plot** | §21, §31, §32 | How do counts and approval rates compare across categories? | Position on a common scale is the most accurately-read encoding |
| **Histogram** | §22, §31 | What shape does each numerical variable have? | Reveals modality, gaps and skew that summaries compress away |
| **Box plot** | §22, §31, §32 | How do distributions compare between approved and rejected? | Median, quartiles, spread and flagged points in one glance |
| **Area plot** | §34.2 | How does application volume and outcome mix shift across ordered credit bins? | Shows total *and* composition; 100%-stacked removes volume as a confounder |
| **Scatter plot** | §33 | How do two financial variables relate, and does the outcome separate? | A near-vertical colour boundary is the visual definition of a threshold rule |
| **Hexbin** | §34.3 | Where is the joint density actually concentrated? | Solves overplotting: 4,269 overlapping points hide density entirely |
| **Pie chart** | §21 | What share of applications is approved? | Part-to-whole with **two** categories — the one case where a pie works |
| **Heatmap** | §33, §34.4 | Which variables move together? How does approval vary across a grid? | Makes 225 correlation numbers readable; exposes the cibil × term interaction |

**Honest caveats, stated in the charts themselves rather than buried.** The dataset has **no time
or date variable**. The line plot therefore uses `cibil_score` — a genuinely continuous ordered
variable — rather than fabricating a time axis, and the area plot's title states explicitly that
it is **not** a time series.

**Standards applied throughout:** explicit figure size, meaningful title, labelled axes, legend
where needed, and a consistent colour encoding (green = approved, red = rejected) so the reader
learns it once. No chart exists to increase the chart count.

---

## 14. Statistical Analysis

| Statistic | What it tells us | Robust to extremes? |
|---|---|---|
| **Mean** | Arithmetic centre | No — every value enters at full magnitude |
| **Median** | The *typical* case | **Yes** — depends only on rank |
| **Mode** | Most frequent value; the only centre for nominal data | n/a |
| **Variance / Std Dev** | Spread around the mean | No — squares deviations, so extremes dominate |
| **IQR** | Spread of the middle half | **Yes** — tails are outside it by construction |
| **Correlation** | Strength of **linear** association | No |
| **Skewness** | Asymmetry; which summary statistic is honest | n/a |
| **Cohen's *d*** | Group difference in standard-deviation units | Comparable across units |

Descriptive statistics are computed **two ways** — Python's `statistics` module and Pandas — and
cross-checked, which also surfaces the sample (`n−1`) vs population (`n`) distinction explicitly.

**Significance testing without scipy.** The permitted libraries exclude `scipy`, so **permutation
tests** are implemented from first principles in NumPy: shuffle the group labels to break any
real association, recompute the statistic, repeat 10,000 times, and see how often chance alone
matches what was observed. This assumes **no normality and no equal variance** — arguably more
defensible here than a t-test, not less. A manual chi-square statistic with a permutation null
handles the categorical features.

**Two cautions applied throughout:**

1. **Correlation is not causation.** Every finding is stated associatively: *appears associated
   with*, *shows a pattern*, *may be predictive*.
2. **A low correlation does not mean no relationship.** The relationship may be non-linear,
   categorical or threshold-based. In this dataset `cibil_score` correlates with the target at
   r ≈ 0.77 — which **understates** it, because the true relationship is a near-perfect step
   function. The linear summary describes the wrong *shape*, not merely the wrong magnitude.

---

## 15. Data Leakage

**Target leakage** — a feature containing information unavailable at prediction time. Dangerous
because it is invisible in validation: the model scores brilliantly, is deployed, and fails.

**Assessment result: no leakage found.** No post-approval variable exists in this dataset — there
is no disbursed amount, no repayment history, no default flag, no post-decision date.

Two features were examined closely:

- **`cibil_score`** — its near-deterministic association is the *statistical fingerprint* of
  leakage, but a credit bureau score is compiled from **past** history and pulled **at application
  time**. **Not leakage.** See the caveat below.
- **`loan_term`** — could plausibly be negotiated during underwriting rather than fixed at
  application. **Cannot be resolved from the data**; flagged for confirmation with the bank.

**`loan_id`** was tested for **ordering leakage** — is the file sorted by outcome? Correlation
with the target ≈ 0 and approval rate is flat across all five quintiles of the file. No ordering
leakage; excluded from modelling as an identifier, retained for traceability.

### The `cibil_score` caveat — not leakage, but the most important modelling risk

If ABC Bank applies a score threshold as **policy**, a model trained on this data learns *the
policy*, not creditworthiness. It will reproduce the existing rule with high accuracy, add no
new information, and inherit any error in that rule. A model that agrees with the current process
99% of the time is not validating it — it is **copying** it.

### Preprocessing leakage — the correct order

```python
# WRONG - the median and scaler statistics see the test rows
df["income"] = df["income"].fillna(df["income"].median())
X_train, X_test = train_test_split(df)

# CORRECT - split first, learn parameters on train only, apply to both
X_train, X_test = train_test_split(df, test_size=0.2, stratify=y, random_state=42)
income_median = X_train["income"].median()          # learned from TRAIN ONLY
X_train["income"] = X_train["income"].fillna(income_median)
X_test["income"]  = X_test["income"].fillna(income_median)
```

This applies to **every learned parameter**: imputation values, scaling statistics, outlier
thresholds, `qcut` bin edges, and encoder category lists. (Domain-based `cut` edges such as the
published CIBIL bands are *not* learned from the data, so they are exempt.)

**Why this notebook is nonetheless correct:** for *exploratory* analysis, using the full dataset
is required — the goal is to describe the data we have. The obligation this creates is that every
parameter computed here must be **recomputed on the training split** in the modelling notebook.
They are documented here as *strategy*, not carried over as *values*.

---

## 16. Key Findings

All figures computed from the dataset; none typed by hand.

### Target

- **2,656 approved (62.22%)**, **1,613 rejected (37.78%)** — ratio **1.65 : 1**, mildly imbalanced.
- A model must beat the **62.22% majority-class baseline** — and, more demandingly, the
  single-rule baseline in the next section.

### `cibil_score` dominates — and the relationship is a threshold, not a gradient

| | Approved | Rejected |
|---|---:|---:|
| Mean CIBIL | **703.5** | **429.5** |

- Gap of **274.0 points**; **Cohen's *d* = 2.49** (very large); permutation p at the test floor —
  in 10,000 label shuffles, chance **never once** produced a gap this large.
- Correlation with the target **r = 0.7705** — the only feature above 0.2.

**Approval rate by published CIBIL band:**

| Band | Applications | Approval rate |
|---|---:|---:|
| Poor (300–549) | 1,785 | **10.36%** |
| Fair (550–649) | 683 | **99.71%** |
| Good (650–749) | 745 | **99.33%** |
| Excellent (750–900) | 1,056 | **99.43%** |

At or below CIBIL 550: **10.56%** approval (n = 1,789). Above 550: **99.48%** (n = 2,480). Below
the threshold a score of 540 is worth no more than 320; above it, 880 is worth no more than 560.

### Loan term matters — but only below the threshold

Loan term initially appeared associated with approval. A cibil × term heatmap showed the effect
exists **only** in the sub-550 band:

- Above 550: approval near 100% at **every** term.
- At or below 550: near **zero** at terms ≥ 6; roughly **48–57%** at terms of 2 and 4.

This is an **interaction**, not an independent effect — a conclusion bivariate analysis alone
would have got wrong.

### Financial capacity shows **no** detected association

| Feature | Approved (median) | Rejected (median) | Cohen's *d* |
|---|---:|---:|---:|
| `income_annum` | 5,000,000 | 5,100,000 | negligible |
| `loan_amount` | 14,600,000 | 14,500,000 | negligible |
| all four asset columns | ≈ equal | ≈ equal | negligible |

Approval rate is **flat across all four income quartiles and all four loan-amount quartiles**.
For a lending dataset this is a genuinely surprising negative result.

### Education and self-employment show no association

| Category | Approval rate |
|---|---:|
| Graduate | 62.47% |
| Not Graduate | 61.96% |
| Self-employed: No | 62.20% |
| Self-employed: Yes | 62.23% |

Confidence intervals overlap the overall rate in every case. These are the two most
fairness-sensitive variables in the file — a positive finding, reported explicitly.

### The decision structure in the data

```
IF cibil_score > ~550           ->  approve
ELSE IF loan_term is very short ->  consider (roughly half approved)
ELSE                            ->  reject
```

### A pocket that nothing explains

**354 applications (8.29%)** sit below CIBIL 550 with a short term. Approval there is
**52.54%** — near a coin flip — and **no recorded variable distinguishes the approved from the
rejected**. Their median income, loan amount and assets are effectively identical. This is a
hard ceiling for any model, not a modelling challenge.

### Multicollinearity

`income_annum` ↔ `loan_amount` at **r = 0.927**; `income_annum` ↔ `luxury_assets_value` at
≈ 0.93; `total_assets` is collinear with its four components **by construction**. A future linear
model must use the total **or** the parts, never both.

---

## 17. Business Insights

**1. Approval appears to be governed by a single credit-score threshold.** Roughly 62% of
applications are approved, and the recorded decision is separated almost completely by
`cibil_score` at about 550. ABC Bank should confirm whether this is codified policy. If it is,
a model would document an existing rule rather than discover a pattern — which changes what the
project is for. If it is not, an unintended de-facto cutoff is operating.

**2. Affordability appears to carry no weight.** Applicants with identical incomes, identical
loan requests and identical asset profiles received opposite decisions based almost entirely on
their score. That may be intentional; it warrants confirmation.

**3. Short terms open a second path for weaker credit.** Below the threshold, applications with a
very short term are approved roughly half the time while longer terms are almost never approved.
This is commercially coherent — a short term limits exposure to a higher-risk borrower.

**4. A governance gap exists in ~8% of the book.** In the sub-550 short-term segment, approval is
near 50/50 with no recorded variable explaining the outcome. Decision consistency there **cannot
currently be audited**.

**5. The two fairness-sensitive variables show no influence.** Education and self-employment are
not associated with the recorded outcome — reassuring, though not a substitute for a formal
fairness audit.

**6. The bank is measuring decisions, not risk.** The dataset records what was *decided*, never
whether the loan was *repaid*. Without repayment outcomes, no model can move from replicating
decisions to assessing credit risk.

---

## 18. Data Quality Findings

| Metric | Before cleaning | After cleaning |
|---|---:|---:|
| Rows | 4,269 | **4,269** |
| Columns | 13 | **13** |
| Missing values (cells) | 11 | **0** |
| Columns with missing data | 7 | **0** |
| Rows with any missing data | 9 | **0** |
| Duplicate rows | 0 | **0** |
| Invalid negative values | 28 | **0** |
| Malformed column names | 12 | **0** |
| Numerical features | 9 | 9 |
| Categorical features | 2 | 2 |

**Every defect was resolved without losing a single row or column.**

- **Missing values** — 11 cells (0.02%), imputed per column by the skewness rule; means and
  standard deviations moved by < 0.1%.
- **Duplicates** — none, under all three definitions. A genuinely positive finding, reported with
  its evidence rather than passed over.
- **Invalid values** — 28 impossible asset values resolved; the *meaning* of `-100000` remains an
  open question escalated to the data owner.
- **Category issues** — whitespace stripped from every value in all three text columns; no case
  inconsistency, spelling variant or synonym pair existed. Counts verified unchanged.
- **Outliers** — 94 flagged, **all retained** after four-method investigation.
- **Distribution shape** — near-uniform income and CIBIL distributions indicate synthetic data.
  Reported as a **limitation**, not treated as a defect to fix.

**Final audit: 15 of 15 checks pass**, including confirmation that `df_raw` is unmodified — so
every before/after number above is a genuine comparison.

---

## 19. Decision Log

The notebook's Section 43 records **20 decisions** with problem, evidence, decision, reason and
impact/risk. The most consequential:

| Problem | Evidence | Decision | Reason | Impact / Risk |
|---|---|---|---|---|
| Whitespace in 12 column names + all categorical values | `repr()` output; `KeyError` on lookup | Standardise formatting only | Invisible whitespace is an unreviewable bug class; renaming words would break the link to the source | All references work; counts verified unchanged |
| 11 missing cells, 7 columns | 0.02% of cells; target complete | Median if skewed/outliers, else mean; mode for categorical | Median robust to the asset tails; blanket mean imputation injects inflated values | All rows kept; stats shift < 0.1%. **Risk:** slight variance reduction |
| Missingness indicators | 1–2 positive cases per column | **Not created** | Near-constant column — no support, and an overfitting hook | Avoided noise; demonstrated separately |
| 28 × `residential_assets_value = -100000` | All identical; column already uses 0 for "none" | Invalid → NaN → median-impute | Recoding to 0 or abs() would assert an unverified meaning | 28 rows kept. **Risk:** assets overstated for 0.66% if sentinel means "none". **Escalated** |
| Zeros in dependents / asset columns | 712 / 107 / 45 / 8 rows | **Retain** | Zero is a legitimate value — no dependents, owns no commercial property | Preserved facts about real applicants |
| 94 IQR-flagged asset values | Continuous tails; domain-plausible; records internally coherent | **Retain unchanged** | Legitimate rare observations. Deleting them would censor the wealthiest applicants | Real variation preserved; robust statistics used |
| Winsorization | Reduces SD and skew; alters ~1% of values | **Demonstrated, not applied** | Values are real; capping would make "maximum asset value" false | `df_clean` unmodified |
| Moderate right-skew (0.56–0.98) | Skewness table | **No transformation** | No feature exceeds \|skew\| > 1; log(rupees) is uninterpretable | Original scales kept; `log1p`/`sqrt` demonstrated separately |
| Encoding | 2 binary nominal features + binary target | One-hot, `drop_first=True`, into a separate frame; `Approved = 1` | Avoids the dummy variable trap; keeps `df_clean` readable; mean(target) = approval rate | Lossless and reversible (verified) |
| `loan_id` | Unique sequential; r ≈ 0; flat across quintiles | Retain in data, **exclude from modelling** | No predictive content, no ordering leakage — but essential for tracing flagged records | Traceability kept; noise feature avoided |
| Binning | Threshold invisible in a correlation | Domain CIBIL bands + quantile bands | External edges cannot be accused of being fitted to this data | **Revealed the central finding**; continuous columns retained |
| Target imbalance 62/38 | Ratio 1.65 : 1 | **Do not rebalance** | Rebalancing in EDA would distort every reported approval rate | True distribution preserved |
| `cibil_score`'s extreme power | r ≈ 0.77; near-perfect separation | Retain — **not leakage** — but flag policy-replication risk | A bureau score is a genuine pre-decision input | Escalated as the key modelling caveat |
| Near-uniform income/CIBIL | Skew ≈ 0 across full range | **Report as a limitation; change nothing** | Evidence of synthetic data — a constraint on interpretation, not a defect | Methodology transfers; population statistics do not |

---

## 20. Limitations

**Dataset**

1. **The data appears synthetic** — near-uniform income and CIBIL distributions, near-perfectly
   balanced categoricals. **Methodology transfers; population statistics do not.** No number here
   is a real-world fact about lending.
2. **4,269 rows** is adequate overall but thin for the smallest cross-tabulated segments.
3. **No temporal dimension** — no dates, so no trend analysis, seasonality, time-based validation
   or drift monitoring.
4. **No repayment outcomes** — the target is the bank's *decision*, not whether the loan was
   repaid. The most consequential gap in the file.
5. **Undocumented semantics** — every column meaning inferred; `loan_term`'s unit unknown.
6. **Missing determinants** — ~8% of applications sit where no recorded variable explains the
   outcome.

**Sampling and bias**

7. **Selection bias** — only submitted applications are observed; anyone discouraged from
   applying is absent. The file describes the bank's funnel, not its market.
8. **Outcome bias** — we never observe what would have happened to rejected applicants had they
   been approved, so no rejection can be assessed as correct or incorrect.
9. **Historical bias** — recorded decisions reflect the policy in force, including any bias in it.

**Analytical**

10. **EDA cannot establish causality.** Every association reported is exactly that.
11. **Correlation ≠ causation** — and low correlation ≠ no relationship.
12. **Statistical significance ≠ practical importance** — hence effect sizes throughout.
13. **Imputation reduces variance** — immaterial at 11 cells, but the direction is known.
14. **The −100,000 treatment rests on an unverified assumption** that the values are
    non-informative.

**Scope**

15. **No model trained, validated or performance-measured.**
16. **No production testing.**
17. **No formal fairness audit** — the required protected attributes are not in this dataset.
18. **Single-analyst analysis** — decisions are documented so they can be challenged, but have not
    been independently reviewed.

---

## 21. Responsible AI Considerations

Loan approval is a **high-impact, regulated** decision. A technical analysis that ignores this is
incomplete.

**What this dataset contains.** No direct protected attributes — no gender, age, race, religion,
caste, marital status or postcode. The data cannot encode direct discrimination on those
characteristics.

**Proxy variables — the subtler risk.** Removing protected attributes does not remove bias. A
*proxy* is a permitted variable correlated with a protected one:

- **`education`** — correlates with socioeconomic background and, in some contexts, with caste,
  religion or region.
- **`self_employed`** — self-employment rates differ substantially across communities and genders.

**The empirical finding is reassuring:** approval rates differ by ~0.5 percentage points across
both, with overlapping confidence intervals and no association detected by permutation testing.

**`cibil_score` deserves its own note.** Credit scores are widely regarded as objective, but they
are built from **credit history**, and access to credit is itself unevenly distributed. A thin
file produces a low score, reflecting *exclusion from the credit system* rather than
unreliability. A score threshold can therefore transmit historical inequality while appearing
neutral. This dataset cannot settle the question.

**Five obligations for a deployed lending model:**

1. **Fairness** — measure outcome disparities across protected groups (data this file lacks).
2. **Transparency** — applicants are entitled to know an automated system was involved.
3. **Explainability** — an adverse decision requires a specific, actionable reason, not a model
   score. A legal requirement in many jurisdictions, and a strong argument for interpretable
   models here.
4. **Human oversight** — a reviewer with override authority on adverse and borderline decisions.
   Most important in the sub-550 short-term segment, where the bank is **already** exercising
   judgement the model cannot reproduce.
5. **Monitoring** — populations and economic conditions drift; a model fair at launch can become
   unfair without any code changing.

**What is deliberately not claimed.** This project is **not** a fairness audit, and no claim is
made that a model built on this data would be fair. A formal assessment requires protected
attributes, market context, appropriate metrics (demographic parity, equalised odds and
calibration are **mathematically incompatible**, so choosing among them is a policy judgement),
and jurisdiction-specific legal guidance. Saying "no protected attributes are present, therefore
the model is fair" would be a false assurance.

---

## 22. Future ML Pipeline

```
                          RAW DATA
                             |
                  VALIDATION  (schema, ranges, domain rules)
                             |
                      CLEANING  (missing, invalid, categories)
                             |
              *** TRAIN / TEST SPLIT ***  (stratified on the target)
                             |          <- EVERYTHING BELOW FITS ON TRAIN ONLY
                 FEATURE ENGINEERING  (ratios, totals, bins)
                             |
                       ENCODING  (one-hot; categories fitted on train)
                             |
              SCALING (if required)  (skip for tree models)
                             |
                   MODEL TRAINING  (start interpretable)
                             |
              CROSS-VALIDATION  (stratified k-fold, within train)
                             |
                HYPERPARAMETER TUNING  (nested CV; never touch test)
                             |
                     EVALUATION  (per-class P/R/F1 + confusion matrix,
                             |     benchmarked vs the cibil>550 rule)
                   EXPLAINABILITY  (feature importance, per-decision reasons)
                             |
              FAIRNESS ASSESSMENT  (requires protected attributes)
                             |
                      DEPLOYMENT  (human oversight on adverse decisions)
                             |
                      MONITORING  (data drift, performance, fairness)
```

**The three steps most often skipped:**

- **The split position** — immediately after cleaning, before any parameter-learning step.
- **The right baseline** — not the 62% majority class, but the **single rule**
  `cibil_score > 550`. A model that fails to beat it has added nothing.
- **Monitoring** — a model is not finished at deployment.

**Recommended next steps:** establish the single-rule baseline first; split before preprocessing;
start with an interpretable model (a shallow tree would likely recover the threshold rule
directly, making the policy visible); handle multicollinearity; evaluate with per-class metrics;
**test the sub-threshold segment separately**, because aggregate metrics will hide poor
performance in the one segment where a model could add value.

---

## 23. Project Structure

```
Loan-Approval-Prediction/
│
├── data/
│   └── Loan Application Accept or Reject.csv
│
├── notebook/
│   └── Loan_Approval_EDA.ipynb
│
├── README.md
│
└── images/
```

**As delivered in this repository**, both files sit alongside the CSV in the project root:

```
capastone-1/
├── Loan Application Accept or Reject.csv
├── Loan_Approval_EDA.ipynb          # 214 cells (114 markdown, 100 code)
└── README.md
```

The notebook loads the CSV from the working directory. If you adopt the `data/` and `notebook/`
layout above, update `CSV_PATH` in the *Load Dataset* cell to `"../data/Loan Application Accept
or Reject.csv"`. All charts render inline, so no `images/` directory is required.

---

## 24. Technologies Used

- **Python 3**
- **NumPy** — numerical computation; the permutation tests are implemented with it directly
- **Pandas** — data manipulation, grouping, cross-tabulation
- **Matplotlib** — plotting
- **Seaborn** — statistical visualization
- **`statistics`** (standard library) — descriptive statistics, cross-checked against Pandas
- **Jupyter Notebook**

**Deliberately not used:** `scikit-learn` and every other ML library (out of scope), and `scipy`
(not among the permitted libraries — hence the from-scratch permutation tests).

### Running it

```bash
pip install numpy pandas matplotlib seaborn notebook
jupyter notebook Loan_Approval_EDA.ipynb
```

The notebook runs top to bottom under **Kernel → Restart & Run All**, with no undefined
variables and no external dependencies beyond the CSV.

---

## 25. Reusable EDA Methodology

1. **Understand the business problem** — before opening the file.
2. **Understand the dataset** — and preserve an unmodified raw copy.
3. **Profile the data** — types, cardinality, roles; print column names with `repr()`.
4. **Assess quality** — establish a measurable baseline *before* changing anything.
5. **Detect issues** — missing, duplicate, invalid, inconsistent, extreme.
6. **Investigate** — look at the actual rows; ask what process could produce this.
7. **Decide** — choose a treatment and name the alternative you rejected.
8. **Clean** — repair in place; delete only what is demonstrably unusable.
9. **Transform** — encode, engineer, bin, scale — into **separate** dataframes.
10. **Validate** — re-measure after every transformation; never assume it worked.
11. **Explore** — univariate → bivariate → multivariate, checking for confounding.
12. **Visualize** — every chart answers a stated question.
13. **Interpret** — observation, interpretation, **limitation**.
14. **Communicate** — a narrative, not a gallery of charts.
15. **Prepare for ML** — leakage, imbalance, baselines, preprocessing strategy, fairness.

> **Never skip step 6.** *Investigate* is the step that separates data cleaning from data
> destruction.

---

## 26. Future Projects

The methodology is domain-independent and transfers directly to:

- **Customer churn** — imbalanced binary target; threshold effects in tenure and usage
- **Fraud detection** — severe imbalance; outliers are the **signal**, making the "never delete
  without investigating" rule critical
- **Sales prediction** — seasonality and trend, where a genuine time axis exists
- **Employee analytics** — high fairness sensitivity; proxy-variable analysis applies directly
- **Healthcare analytics** — high-impact decisions; explainability and human oversight are
  non-negotiable
- **Marketing analytics** — segmentation and response rates; binning and rate comparison
- **Financial risk analysis** — the closest analogue; the same leakage and policy-replication
  traps apply

The recurring lessons transfer with it: **investigate before transforming**; a **threshold** can
hide behind a mediocre correlation; a **bivariate finding may not survive** controlling for a
confounder; and always ask whether your target measures an **outcome** or merely a **past
decision**.

---

## Decision-Making Philosophy

> **Good Data Science is not about applying the maximum number of techniques. It is about
> applying the right technique for the right reason, validating its impact, and communicating the
> decision.**

Several techniques in this project were **deliberately not applied** — missingness indicators,
winsorization, log transformation, class rebalancing, category merging. In each case the
technique was demonstrated, the evidence was examined, and the evidence did not support applying
it.

Those decisions are as much a part of the work as the transformations that were performed, and
they are documented with the same rigour.
