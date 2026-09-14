# EDA GUIDE — PROJECT 1
# NovaFit Wellness: Understanding Member Churn

> **How to read this guide.**
> Sections 1–6 are context. Sections 7–18 are the twelve working phases — do them in order.
> Sections A1–A8 are *reference chapters* (observation framework, visualisation choice,
> data-quality method, outliers, correlation, target-oriented EDA, EDA→ML, leakage).
> The phases link into the reference chapters; read a chapter the first time a phase sends you there.
> Section 19+ covers the final report, the rubric, and how to submit.
>
> **This guide never tells you what is wrong with your dataset, and never gives you solution code.**
> If you catch yourself wanting to ask *"what should I do next?"* — the answer is in here.

---

## TABLE OF CONTENTS

| § | Section |
|---|---------|
| 1 | Project Overview |
| 2 | Learning Objectives |
| 3 | Business Understanding |
| 4 | Data Dictionary |
| 5 | Environment Setup |
| 6 | Project Workflow |
| 7 | **Phase 1** — Problem Understanding |
| 8 | **Phase 2** — Load the Data & First Contact |
| 9 | **Phase 3** — Structural Understanding |
| 10 | **Phase 4** — Data Quality I: Missingness |
| 11 | **Phase 5** — Data Quality II: Duplicates, Validity, Consistency |
| 12 | **Phase 6** — Univariate Analysis: Numerical |
| 13 | **Phase 7** — Univariate Analysis: Categorical |
| 14 | **Phase 8** — Target Analysis |
| 15 | **Phase 9** — Bivariate Analysis: Feature vs Target |
| 16 | **Phase 10** — Relationships Between Features |
| 17 | **Phase 11** — EDA → ML Decisions & Leakage Screen |
| 18 | **Phase 12** — The EDA Report |
| A1 | Reference: The EDA Mindset |
| A2 | Reference: The Observation Framework |
| A3 | Reference: Choosing a Visualisation |
| A4 | Reference: Data Quality Investigation |
| A5 | Reference: Outlier Thinking |
| A6 | Reference: Correlation |
| A7 | Reference: Target-Oriented EDA |
| A8 | Reference: EDA → Machine Learning |
| A9 | Reference: Data Leakage |
| 19 | Final EDA Report Specification |
| 20 | Self-Check Before Submitting |
| 21 | Submission Instructions |
| 22 | Evaluation Rubric |
| 23 | Questions You Should Be Able To Answer |

---

# 1. PROJECT OVERVIEW

| Field | Value |
| ----- | ----- |
| **Title** | NovaFit Wellness — Member Churn EDA |
| **Difficulty** | Beginner (Project 1 of 5) |
| **Estimated time** | 8–14 hours across several sessions |
| **Dataset** | `data/data.csv` |
| **Size** | 3,034 rows × 21 columns |
| **Domain** | Fitness / subscription retention |
| **ML objective** | Binary classification — predict member churn |
| **Target variable** | `churned` (1 = member cancelled, 0 = member still active) |
| **Unit of observation** | One gym member |
| **What one row represents** | The profile and activity summary of a single member, as recorded in the membership system at the reporting snapshot date |

### Business context

NovaFit Wellness operates gyms in six mid-sized US cities. Members pay a monthly
fee under contracts of varying length. Revenue is entirely subscription-based, so
the business lives or dies by **retention**: acquiring a new member costs roughly
six times as much as keeping an existing one.

The retention team currently reacts — they find out a member has gone when the
payment stops. They want to become proactive: to know *in advance* who is at
risk, and to understand *what makes people leave* so they can act on it.

Before any of that, somebody has to actually look at the data. That is you.

### Business problem

> "Which members are likely to cancel, and what is driving it?"

### Expected final outcome

You will produce:

1. A notebook containing your full exploratory analysis.
2. A written EDA report (§ 19) covering data quality, distributions,
   relationships, risks, and recommendations.
3. A defensible **data-cleaning plan** and **feature shortlist** that a
   modelling team could act on.

You will **not** train a model in this project. Resist the urge. A model built
before the data is understood is a confident answer to an unexamined question.

### A word on what "finished" means

You are not finished when you have made a lot of plots. You are finished when
you can hand your report to a stranger and they can answer: *what is in this
data, what is wrong with it, what predicts the target, and what should we watch
out for when modelling?*

---

# 2. LEARNING OBJECTIVES

By completing this project you should be able to:

**Dataset understanding**
- Approach a completely unfamiliar dataset with a repeatable opening routine
- Establish what one row means and verify that claim against the data
- Separate variables into numerical / categorical / identifier / temporal / target
- Recognise when a stored data type does not match a variable's true nature

**Data quality**
- Quantify and *locate* missing values rather than just counting them
- Reason about *why* values might be missing, and whether that is informative
- Distinguish genuine duplicates from legitimately repeated rows
- Detect values that are impossible rather than merely unusual
- Spot inconsistent categorical labels and placeholder/sentinel values

**Distributions**
- Describe a numerical variable's centre, spread, shape, and tails
- Recognise skew and understand why it matters downstream
- Read a categorical variable's cardinality and rare-category structure

**Relationships**
- Investigate how a feature relates to a target, for both variable types
- Compute and, more importantly, *interpret* correlation
- Recognise redundancy between features
- Understand that "no relationship" is a finding, not a failure

**Judgement**
- Separate observation from interpretation from action
- Connect every finding to a concrete modelling consequence
- Recognise a feature that could leak the answer
- Write insight that a non-technical stakeholder can act on

**Habits**
- Never delete data because it is inconvenient
- Never trust a summary statistic you have not visualised
- Never clean before you investigate

---

# 3. BUSINESS UNDERSTANDING

Read this section **before you open the CSV.** This is not ceremony. An analyst
who opens the data first ends up describing whatever the columns happen to
contain; an analyst who thinks first goes looking for specific things and
notices when they are missing.

### The business model, in one paragraph

A member signs up through some channel, picks a membership tier, commits to a
contract of some length, and pays monthly. They then use the gym — or don't.
Usage, satisfaction, payment behaviour and convenience all plausibly affect
whether they stay. NovaFit wants to intervene *before* the cancellation, which
means the useful signals are the ones visible *while the member is still active*.

### Questions to answer before you touch the data

Write your answers down. You will check them against reality later, and being
wrong is informative.

1. **What does one row represent?** Is it a member, a membership, a month, or a
   transaction? Could the same human appear twice?
2. **What exactly is the business trying to predict, and over what horizon?**
   "Will churn" is not a well-posed target until you can say *by when*.
3. **What would plausibly cause a member to cancel?** List 8–10 mechanisms in
   plain English before you look at any column names.
4. **Which of those mechanisms could this data possibly capture?**
5. **Which variables do you expect to matter most?** Commit to a prediction now.
6. **Which variables do you expect to be useless?** Commit to that too.
7. **What could be recorded only *after* a member cancels?** Such a variable
   would be useless — worse than useless — for prediction.
8. **What errors would you expect in data typed by front-desk staff?**
9. **What would make you distrust this dataset entirely?**

### The intuition behind asking these first

Three reasons, and they compound:

**You cannot recognise an anomaly without an expectation.** A value of 200 in a
column means nothing until you know the column is an age. Domain expectations are
what turn numbers into findings. If you form your expectations *from* the data,
you will find the data perfectly normal — including its errors.

**Prediction before observation makes you a better analyst.** If you write down
"I expect visit frequency to matter most" and it doesn't, you have learned
something real about this business. If you never commit, every result feels
equally unsurprising and you learn nothing.

**Question 7 is the one that separates amateurs from professionals.** Every
dataset assembled after the fact is at risk of containing information that did
not exist at prediction time. A model trained on it looks spectacular in testing
and is worthless in production. Hold that question in your mind for the whole
project. See § A9.

> ### STOP & THINK
> Suppose you find a variable that predicts churn almost perfectly — say, it
> gets 97% of cases right on its own.
>
> - Is that good news or bad news?
> - What is the *first* thing you should check, before celebrating?
> - What question would you ask the person who built this table?
> - How is "an excellent predictor" different from "a variable that already
>   knows the answer"?
>
> Do not read ahead for the answer. Write your reasoning in your notebook now;
> you will revisit it in Phase 11.

---

# 4. DATA DICTIONARY

This tells you what the columns **mean**. It deliberately tells you nothing
about their quality, distribution, or relationship to the target — that is your
job to find out.

Treat these descriptions the way you would treat documentation written by a busy
colleague a year ago: broadly accurate, possibly stale, and worth verifying.

| # | Column | Description | Stored as | Business meaning |
|---|--------|-------------|-----------|------------------|
| 1 | `member_id` | Membership account identifier issued at signup | text | Key for joining to other NovaFit systems |
| 2 | `signup_date` | Date the membership began | text | When the relationship started |
| 3 | `age` | Member's age in years at signup | number | Demographic segment |
| 4 | `gender` | Gender as entered on the signup form | text | Demographic segment; free-entry field in older versions of the form |
| 5 | `city` | City of the home branch | text | Location / market |
| 6 | `country` | Country of the home branch | text | Market |
| 7 | `membership_type` | Tier purchased: Basic, Plus, or Premium | text | Product level and included benefits |
| 8 | `contract_length_months` | Committed contract length in months | number | Commitment; shorter contracts are easier to exit |
| 9 | `monthly_fee` | Amount billed each month | text | Revenue per member per month |
| 10 | `signup_channel` | Where the membership was sold | text | Acquisition source |
| 11 | `tenure_months` | Months between signup and the reporting snapshot | number | How long the relationship has lasted |
| 12 | `avg_weekly_visits` | Average gym check-ins per week over the membership | number | Core engagement measure |
| 13 | `group_classes_attended` | Total group class attendances | number | Engagement with classes |
| 14 | `personal_training_sessions` | Total personal-training sessions purchased | number | Premium service usage; paid separately |
| 15 | `distance_km_to_gym` | Straight-line distance from home address to branch | number | Convenience |
| 16 | `has_mobile_app` | Whether the member has the NovaFit app installed | text | Digital engagement |
| 17 | `satisfaction_score` | Most recent satisfaction rating, 1–10, from the periodic member survey | number | Self-reported happiness |
| 18 | `late_payments_12m` | Count of late payments recorded in the last 12 months | number | Payment reliability / financial friction |
| 19 | `referred_friends` | Number of friends the member referred | number | Advocacy and social ties to the gym |
| 20 | `exit_survey_completed` | Flag from the member-feedback platform indicating a survey response was received from this member | number | Feedback engagement |
| 21 | `churned` | **TARGET.** 1 if the membership was cancelled, 0 if still active at the snapshot | number | What we want to predict |

### How to use a data dictionary properly

Read each row and ask three questions:

1. **Does the stored type match the meaning?** A date stored as text is still a
   date. A number stored as text is not usable as a number. A category stored as
   a number invites nonsense arithmetic.
2. **What values would be impossible here?** Decide the legal range *before*
   you look. An age cannot be 200. A count cannot be negative. A distance cannot
   be zero if the member lives somewhere.
3. **When does this value become known?** At signup? Continuously? Only after
   the member leaves? Write the answer next to every column. This single habit
   prevents most leakage disasters. (§ A9)

> Column 21 is your target. Columns 1–20 are candidates. "Candidate" does not
> mean "usable" — part of your job is deciding which ones a model should never see.

---

# 5. ENVIRONMENT SETUP

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install pandas numpy matplotlib seaborn jupyter
jupyter notebook
```

Then create `notebooks/eda.ipynb` and begin.

### Why each library is here

| Library | Role | Why you need it in EDA |
| ------- | ---- | ---------------------- |
| **pandas** | Tabular data handling | Loading, inspecting, grouping, aggregating, and summarising. This is where 80% of your EDA happens. |
| **numpy** | Numerical operations | Underlies pandas; useful for array maths, and for representing missing values |
| **matplotlib** | Plotting foundation | Full control over figures; everything else is built on it |
| **seaborn** | Statistical plotting | Concise syntax for the plots EDA needs most — distributions, categorical comparisons, relationships |
| **jupyter** | Notebook environment | Lets analysis and narrative live together; essential for iterative exploration |
| *scikit-learn* | ML toolkit | **Not required for Project 1.** You are not modelling yet. It appears from Project 3 onward. |

### Notebook practices worth building now

- **Restart-and-run-all must work.** If your notebook only works when cells are
  run in a lucky order, your analysis is not reproducible.
- **Never overwrite your raw dataframe.** Load once into `df`. Create explicitly
  named copies for cleaned versions. You will want to compare against the
  original constantly.
- **Markdown cells are part of the deliverable.** After every analysis block,
  write what you saw in words. A notebook of code with no prose is a transcript,
  not an analysis.
- **Set display options early** so pandas stops truncating columns on you.

---

# 6. PROJECT WORKFLOW

```text
Phase 1  → Problem Understanding            (no data yet)
Phase 2  → Load the Data & First Contact
Phase 3  → Structural Understanding
Phase 4  → Data Quality I: Missingness
Phase 5  → Data Quality II: Duplicates, Validity, Consistency
Phase 6  → Univariate Analysis: Numerical
Phase 7  → Univariate Analysis: Categorical
Phase 8  → Target Analysis
Phase 9  → Bivariate Analysis: Feature vs Target
Phase 10 → Relationships Between Features
Phase 11 → EDA → ML Decisions & Leakage Screen
Phase 12 → The EDA Report
```

### Why this order

The sequence is not arbitrary. Each phase makes the next one trustworthy:

- **Structure before quality.** You cannot assess whether a value is missing
  until you know how missingness is encoded in that column.
- **Quality before distributions.** A histogram that includes impossible values
  describes a fiction. Every summary statistic you compute before the quality
  pass may be wrong.
- **Univariate before bivariate.** You cannot interpret a relationship between
  two variables you do not individually understand.
- **Target last among the univariates.** Once you know the target's shape, every
  subsequent analysis can be framed against it.
- **Feature-vs-target before feature-vs-feature.** Relevance first, then
  redundancy. Knowing two features are correlated only matters once you know
  whether either one predicts anything.
- **Decisions last.** Cleaning choices made in Phase 4 with Phase 10 knowledge
  are better choices. This is why you *investigate* early and *decide* late.

### You are allowed to loop

Real EDA is iterative. Phase 9 will send you back to Phase 5 when a
feature-target plot reveals a data problem you missed. That is the process
working, not failing. The linear order is a scaffold for your first pass —
revisit freely, but do not *skip* forward.

### Time budget (rough)

| Phases | Share of effort |
| ------ | --------------- |
| 1–3 (understand) | 15% |
| 4–5 (quality) | 25% |
| 6–8 (univariate) | 20% |
| 9–10 (relationships) | 25% |
| 11–12 (decisions & writing) | 15% |

If you are spending 70% of your time making plots, you are doing the wrong project.

---
---

# 7. PHASE 1 — PROBLEM UNDERSTANDING

**Do this phase with the CSV closed.**

### Objective
Arrive at the data with a written set of expectations, hypotheses, and
definitions, so that you are testing beliefs rather than passively describing
columns.

### Why this matters
EDA without a hypothesis degenerates into a checklist. Checklists produce
notebooks full of plots and reports empty of insight. The single biggest quality
difference between a junior and senior analyst's EDA is that the senior one
arrived with questions.

### Intuition
Imagine two people walking into a warehouse. One has no idea what is stored
there and wanders, noting shelves. The other has been told "we think someone is
stealing inventory" and immediately checks the door logs, the count sheets, and
the gaps on the shelves. Same warehouse, same eyes — completely different
outcome. A hypothesis is a searchlight.

### Questions to ask
1. Restate the business problem in one sentence, without jargon.
2. What decision will be made with this analysis? By whom?
3. What does one row represent — and how will you *verify* that from the data?
4. What is the prediction horizon, and does this dataset let you respect it?
5. List 8–10 plausible mechanisms of churn, in plain English.
6. For each mechanism, name the column(s) that might capture it.
7. Which mechanisms are *not* captured at all? (Absence is a finding.)
8. Rank your top 5 expected predictors, most important first.
9. Name 3 variables you expect to be useless, and say why.
10. For every one of the 20 features, write **when its value becomes known**.

### What to investigate
Only § 3 and § 4 of this guide, plus your own knowledge of how gyms work. You
are allowed to know things about the world — that is domain knowledge, and it is
an analytical asset, not cheating.

### Possible techniques
- A written hypothesis table: `mechanism | expected column | expected direction`
- A "known-at" audit: `column | known at signup / updated continuously / known only after exit`
- A quick sketch of the data-generating process: who types what, when, into which system

### What to look for
Gaps between what the business *wants* to predict and what the data can
*possibly* support. Columns whose "known-at" answer is uncomfortable. Mechanisms
you consider obvious that have no column at all.

### Interpretation guide
- **A mechanism with no column** → a limitation to state in your report, and a
  data-collection recommendation.
- **A column with no mechanism** → either you don't understand the business yet,
  or the column is noise. Find out which.
- **A column known only after the outcome** → a leakage suspect. Flag it now;
  confirm in Phase 11.

### Common mistakes
- Skipping this phase because it feels like it isn't "real work." It is the
  phase with the highest return per minute in the entire project.
- Writing vague hypotheses ("engagement matters") instead of directional ones
  ("members visiting less than once a week churn at a much higher rate").
- Refusing to commit to predictions to avoid being wrong. Being wrong on paper
  is how you calibrate.

### Hints
> **Hint 1 — Conceptual:** Think about the last time you cancelled a
> subscription. What actually happened in the weeks before?
>
> **Hint 2 — Directional:** Churn mechanisms usually fall into buckets: value not
> realised, friction, life change, money, competition, and relationship. Try to
> name at least one candidate column per bucket.
>
> **Hint 3 — Technical:** Build a table with columns
> `mechanism | proxy column | expected direction | confidence | known-at`.
> You will paste this straight into your final report and check it against your
> Phase 9 results.

### ML connection
This phase produces your **feature shortlist prior** and your **leakage
watchlist**. Both are used in Phase 11. A hypothesis written now is also your
defence against fooling yourself later: if you only form a theory *after* seeing
a pattern, you have no way to tell insight from noise.

### Deliverable
A markdown cell (or `reports/hypotheses.md`) containing:
- the problem in one sentence
- your unit-of-observation claim and how you will verify it
- the mechanism → column hypothesis table
- your top-5 predicted predictors and 3 predicted duds
- your known-at audit for all 20 features
- your written answer to the § 3 STOP & THINK

---

# 8. PHASE 2 — LOAD THE DATA & FIRST CONTACT

### Objective
Get the file into pandas without silently corrupting it, and form a first
impression of what you are holding.

### Why this matters
Loading looks trivial and is not. A CSV is just text; pandas *guesses* the type
of every column. Those guesses are usually right, occasionally wrong, and always
worth checking. A column silently read as text will quietly break every
numerical analysis you do for the next six hours.

### Intuition
Think of loading as unpacking a delivery. You check the box is the right box,
nothing is obviously broken, and the count matches the invoice — *before* you
start assembling. Analysts who skip this step spend the afternoon debugging a
problem that was visible in the first thirty seconds.

### Questions to ask
1. Did every row load? Does the row count match what you were told (§ 1)?
2. Did every column load, with sensible names?
3. What type did pandas infer for each column, and do you agree with all 21?
4. Do the first rows look like *data*, or like a stray header/footer?
5. Is there an index column that is really just a row number?
6. What does a random sample of rows look like — not just the first five?

### What to investigate
- Shape, column names, and dtypes
- The head, the tail, **and a random sample** (the first rows of a file are
  often unrepresentative — sorted data hides its variety at the top)
- Memory footprint, as a habit for when datasets get large

### Possible techniques
- Reading the raw file's first couple of lines as *text* before letting pandas
  near it — you see exactly what the delimiter, quoting, and header look like
- Pandas' shape, column listing, dtype listing, head/tail/sample
- A combined structural summary that shows non-null counts and types together

### What to look for
Any column whose inferred type does not match its meaning in the data dictionary.
Ask specifically: are all the columns the dictionary calls "number" actually
stored as numbers? If one is not, *why not*? A numeric column read as text means
the column contains at least one value that isn't a number — find out what.

### Interpretation guide
- **Numeric-looking column stored as text** → there is non-numeric content in it.
  Could be a currency symbol, a thousands separator, a unit, a stray word, or a
  placeholder for missing. Each implies a different fix. Look at actual values
  before deciding.
- **Date stored as text** → normal and expected; pandas does not parse dates
  unless told. You will need it as a real date for any time-based analysis.
- **Category stored as a number** → dangerous in a subtle way. The computer will
  happily average it.

### Common mistakes
- Looking only at `head()`. Sorted files lie at the top.
- Assuming the dtype summary is the truth rather than a guess.
- Immediately "fixing" a bad type without first looking at *which* values caused
  it. The offending values are evidence.
- Forcing a type conversion with errors coerced to missing — this silently
  destroys the very evidence you needed to see.

### Hints
> **Hint 1 — Conceptual:** Does pandas' opinion about each column agree with the
> data dictionary's?
>
> **Hint 2 — Directional:** Find every column the dictionary calls numeric but
> pandas calls `object`. For each, look at a handful of its actual raw values.
>
> **Hint 3 — Technical:** For a text column that should be numeric, attempting a
> numeric conversion in a mode that *flags* rather than discards failures will
> show you exactly which values are the problem. Inspect those values before
> writing any cleaning code.

### ML connection
Types determine everything downstream: what can be scaled, what must be encoded,
what can be compared. A misread type at load time propagates into every
preprocessing decision you make.

### Deliverable
- Recorded shape and a dtype audit table: `column | dictionary says | pandas says | agree?`
- A note on every disagreement, including the raw values that caused it
- Your dataframe loaded, unmodified, in a variable you will not overwrite

---

# 9. PHASE 3 — STRUCTURAL UNDERSTANDING

### Objective
Classify every column by its analytical role, and verify your unit-of-observation
claim from Phase 1.

### Why this matters
Almost every EDA technique is type-specific. Histograms are for numerical
variables; frequency tables are for categorical ones. If you do not classify
first, you will apply the wrong tool and misread the result. Worse, some columns
*look* numerical and are not — the computer cannot tell you this, only your
understanding of meaning can.

### Intuition
Numbers can play three different roles. Some numbers measure — height, income,
distance. Some numbers label — a member ID, a postcode, a tier code. Some numbers
count — visits, referrals. Only measurements and counts support arithmetic. A
mean member ID is a meaningless number that a computer will compute for you
without complaint. Your job is to know the difference.

### Questions to ask
1. Which columns are **identifiers** (unique keys, not features)?
2. Which are genuinely **numerical** (continuous measures or counts)?
3. Which are **categorical**? Of those, which are ordered and which are not?
4. Which are **temporal**?
5. Which is the **target**?
6. Are there numeric-looking columns that are really categorical?
7. Does any column have only one distinct value?
8. Does any column have a distinct value for nearly every row?
9. **Is `member_id` actually unique?** How would you check, and what does it mean
   if it isn't?

### What to investigate
- Number of distinct values per column (cardinality)
- Cardinality relative to row count — the ratio tells you a lot about a column's role
- Uniqueness of the presumed key
- Whether any column's cardinality is 1

### Possible techniques
- Per-column distinct-value counts, and the ratio of distinct values to rows
- Distinct-value listings for low-cardinality columns
- Uniqueness / duplication checks on the identifier column
- Building explicit Python lists of column names per role — you will reuse them
  in every later phase

### What to look for
- **Cardinality = 1:** a column that never varies. Ask what it can contribute to
  distinguishing one member from another.
- **Cardinality = number of rows:** an identifier, or something close to one.
- **Low cardinality but numeric dtype:** likely categorical or ordinal in nature.
- **Identifier appearing more than once:** the row is not what you assumed, or
  the table has a problem. Either way it changes your whole analysis.

### Interpretation guide
- **A constant column** carries zero information for prediction. It might still
  tell you something about *scope* — for example, that this extract covers only
  one market, which limits how far conclusions generalise. Report it as a scope
  note, then drop it.
- **A repeated identifier** has two very different explanations: the table
  contains genuine duplicate records, or one row is not one member and your
  Phase 1 assumption was wrong. Investigating which one is Phase 5's job — but
  notice it here.
- **An ordered categorical** (a tier, a contract length) should be recognised as
  ordered. Order is information, and encoding choices in Phase 11 depend on it.

> ### STOP & THINK
> `contract_length_months` holds whole numbers. You could treat it as a
> numerical variable, or as an ordered categorical one.
>
> - What does treating it as numerical assume about the *spacing* between values?
> - Is the difference between a 1-month and a 6-month contract "the same size" as
>   the difference between 12 and 24 months, in business terms?
> - Which treatment would let you see a non-linear pattern, and which would hide it?
> - Could you legitimately analyse it both ways?
>
> There is no single right answer here. Decide, and be able to defend it.

### Common mistakes
- Classifying by dtype instead of by meaning. `dtype` is an implementation
  detail; *role* is an analytical judgement.
- Treating an ID column as a feature. It will look predictive if IDs were issued
  in a meaningful order, and that "signal" will not generalise.
- Forgetting the target is special and sweeping it into the numerical pile.
- Assuming uniqueness of the key without checking.

### Hints
> **Hint 1 — Conceptual:** Ask of every column: does it make sense to compute an
> average of this?
>
> **Hint 2 — Directional:** Count the distinct values in each column and sort the
> results. Both ends of that sorted list are interesting.
>
> **Hint 3 — Technical:** Build four named lists — `numeric_cols`,
> `categorical_cols`, `id_cols`, `date_cols` — plus the target, by hand, based on
> meaning rather than dtype. Every later phase should iterate over these lists.

### ML connection
This classification *is* your preprocessing plan in embryo: numerical features
get scaled or transformed, categoricals get encoded, identifiers get dropped,
temporal features get engineered into durations or cycles, constants get removed.

### Deliverable
A column-role table: `column | role | cardinality | notes`, plus your verified
(or corrected) statement of what one row represents.

---

# 10. PHASE 4 — DATA QUALITY I: MISSINGNESS

📖 Read **§ A4 (Data Quality Investigation)** before starting this phase.

### Objective
Find where data is absent, quantify it, and — the part everyone skips —
investigate *why* it is absent and whether the absence itself carries information.

### Why this matters
Every model needs a decision about missing values. Made carelessly, that decision
either throws away rows (losing information and potentially biasing the sample)
or fills in numbers that were never observed (inventing information). Made well,
it can even *add* a feature. The difference between the two is entirely down to
whether you investigated the mechanism.

### Intuition
Consider a satisfaction survey. If responses are missing because the survey
server randomly dropped some, the absences tell you nothing — fill them in and
move on. But if responses are missing because unhappy members stopped answering
surveys, then "missing" is not an absence of information; it *is* information.
Replacing those gaps with the average satisfaction score would erase the
strongest signal in the column and actively mislead the model.

You cannot tell these two worlds apart by counting nulls. You tell them apart by
comparing the rows that are missing against the rows that are not.

### Questions to ask
1. Which columns contain missing values, and how much, in both count and percent?
2. Are missing values concentrated in particular rows, or scattered?
3. Do several columns tend to go missing *together*?
4. **Does missingness relate to the target?** Compare the target rate for rows
   where a column is missing vs where it is present.
5. Does missingness relate to other features — one city, one channel, one tier?
6. Is missing *actually* encoded as null, or does this dataset use placeholders?
7. For each gap: is this MCAR, MAR, or MNAR? (§ A4)
8. What is the business explanation for each pattern you find?

### What to investigate
- Null counts and percentages per column
- Count of missing values *per row* — does any row have many?
- Co-occurrence of missingness across columns
- The target rate, split by whether a given column is missing
- Feature distributions, split by whether a given column is missing
- Non-null placeholder values masquerading as data (see § A4 on sentinels)

### Possible techniques
- Per-column null counts and proportions
- A missingness *indicator* frame (true/false per cell) — you can then correlate,
  group, and aggregate it like any other data. This is the single most useful
  trick in missing-value analysis.
- A heatmap or matrix plot of missingness across rows to reveal block patterns
- Group comparisons: target rate grouped by a missingness indicator
- Distribution comparisons between the missing and non-missing subgroups

### What to look for
- Columns where the missing subgroup's target rate differs *substantially* from
  the non-missing subgroup's. This is the headline finding of the phase.
- Columns that are always missing together (suggesting a shared source system)
- Missingness concentrated in one category of another variable
- Suspicious values that are "present" but mean absent: `-1`, `999`, `0` where
  zero is impossible, empty strings, whitespace-only strings, `"N/A"`, `"unknown"`

### Interpretation guide
- **Roughly equal target rates, missing vs present** → consistent with MCAR;
  simple imputation is defensible.
- **Markedly different target rates** → the missingness is informative. Imputing
  it away destroys signal. The standard response is to *keep* the information:
  add an explicit indicator flag alongside whatever imputation you choose.
- **Missingness concentrated in a segment** → likely a process or system
  difference. Find the business explanation; it often reveals how the data was
  assembled.
- **A whitespace or empty-string category** → this is missingness wearing a
  disguise. It will not appear in null counts and will silently become its own
  category during encoding.

> ### STOP & THINK
> You find that a column is missing far more often for members who churned than
> for members who stayed.
>
> - Give **two** completely different business explanations for this.
> - Under one of them, the missingness is a legitimate early-warning signal.
>   Under the other, it is leakage — the gap exists *because* they left.
> - What would you need to know about the data-collection process to tell them apart?
> - How does your conclusion change what you recommend doing with the column?
>
> This is the most important question in Phase 4. Write a real answer.

### Common mistakes
- Reporting only percentages and moving on. The count is the least interesting
  fact about a missing value.
- Dropping rows with any missing value by reflex. Check how many rows you would
  lose and whether the survivors are a biased sample.
- Filling numerical gaps with the mean because it is the default. The mean is a
  terrible choice for a skewed variable (§ A5), and a worse one for informative
  missingness.
- Imputing **before** splitting data for modelling — statistics computed across
  the full dataset leak test information into training. (Noted here so the habit
  forms early; it matters from Project 3 on.)
- Assuming nulls are the only form of missing. Search for sentinels.

### Hints
> **Hint 1 — Conceptual:** A missing value is an event. Events have causes.
>
> **Hint 2 — Directional:** For each column with gaps, split the dataset into two
> groups — missing and not missing — and compare the churn rate between them.
>
> **Hint 3 — Technical:** Create a boolean frame of `isna()` values. Then for any
> column, group the target by that column's missingness indicator and compare the
> means. Also: check the minimum of every numeric column, and inspect the
> distinct values of every categorical one, to catch sentinels that nulls miss.

### ML connection
Drives your imputation strategy (simple vs grouped vs model-based), whether to
add missing-indicator features, whether to drop a column entirely, and whether
your sample is biased. Informative missingness that you preserve as a flag is one
of the cheapest genuine feature-engineering wins available.

### Deliverable
A missingness table: `column | n missing | % | pattern | target rate missing vs present | hypothesised mechanism | proposed action`.
Plus a short note listing any sentinel/placeholder values you found.

---

# 11. PHASE 5 — DATA QUALITY II: DUPLICATES, VALIDITY, CONSISTENCY

📖 Read **§ A4** and **§ A5** before starting this phase.

### Objective
Establish whether each row is a legitimate, unique, and *possible* observation,
and whether categorical labels mean what they appear to mean.

### Why this matters
These defects are quiet. Missing values announce themselves; a duplicated row, an
impossible age, or the same category spelled four different ways all look like
perfectly ordinary data. They corrupt every statistic you compute without ever
throwing an error. This is the phase where careful analysts earn their reputation.

### Intuition
If the same member is recorded twice, they get counted twice in every average,
every proportion, every correlation — and if a model later sees the same person
in both training and test data, it will appear to have learned something it has
merely memorised.

If `Male`, `male`, `M` and ` Male` are four separate categories, then one real
group has been shattered into four small ones. Every one of them looks
statistically weak, and the real pattern — whatever it is — becomes invisible.

If an age is recorded as 200, every mean age you compute is wrong, and it will
never be wrong enough to be obvious.

### Questions to ask

**Duplicates**
1. Are there fully identical rows? How many?
2. Are there rows that repeat the identifier but differ elsewhere?
3. Are there rows that describe the same real person under *different*
   identifiers? How would you even detect that?
4. Given what one row represents (Phase 3), *should* repetition be possible here?
5. If you removed duplicates, which copy would you keep, and why?

**Validity**
6. For each numerical column, what is the legal range in the real world?
7. Does any value fall outside that range? Are any values impossible rather than
   just extreme?
8. Are there negative values in columns where negativity is meaningless?
9. Do the dates make sense — no future dates, no impossible ones?
10. Are related columns mutually consistent? (Does tenure agree with signup date?
    Does the fee agree with the tier? Can someone have attended classes with zero
    visits?)

**Consistency**
11. For each categorical column, list every distinct value. Do any pairs mean the
    same thing?
12. Are there differences of case, whitespace, spelling, or abbreviation?
13. Are there categories so rare they are effectively noise?
14. Is there a blank or whitespace-only category?

### What to investigate
- Duplicate detection on the full row and on the identifier alone
- Duplicate detection on a *business key* — the combination of columns that
  should uniquely identify a member even if the ID differs
- Min/max/range of every numerical column against your pre-declared legal ranges
- Full distinct-value listings for every categorical column, with counts
- Cross-column consistency checks between logically related columns

### Possible techniques
- Row-level and subset-level duplicate flags; inspecting the duplicated rows
  themselves rather than just counting them
- Sorting each numeric column and examining both extremes
- Value-count listings for every categorical column
- Normalising a *copy* of a label column (case, whitespace) and comparing the
  distinct-count before and after — the drop tells you how much inconsistency
  existed
- Boolean consistency rules between column pairs, counting violations

### What to look for
- Exact duplicates, and near-duplicates that differ in only one or two fields
- Values at the extremes of each numeric column that are not merely large but
  *impossible* — the distinction is everything (§ A5)
- Negative values in count columns
- Category lists that are longer than the business would expect
- Labels differing only in case or surrounding whitespace
- Any category with a very small number of members

### Interpretation guide
- **Exact duplicates** are usually an extraction or ETL artefact — the same
  record pulled twice. Usually safe to remove, but confirm that the unit of
  observation forbids genuine repetition first.
- **Repeated identifier, different values** is a different problem entirely:
  either a genuine update history, or a data-entry collision. Do not deduplicate
  these blindly; investigate which copy is correct.
- **Same person, different identifier** is the subtlest case — someone who
  cancelled and rejoined, or was re-registered by mistake. Detecting it requires
  a business key. Whether to merge, keep, or flag these depends on what the
  business means by "a member".
- **Impossible values** — you must decide whether the true value is *unknown*
  (convert to missing, handle in Phase 4) or *recoverable* (a clear typo with an
  obvious correction). Never silently overwrite; document every change.
- **Inconsistent labels** should be standardised — but standardise *deliberately*.
  Two labels that look similar are not always the same thing.
- **Rare categories** need a decision: keep, group into "Other", or treat
  specially. All three are defensible; which you choose depends on how the
  category behaves against the target (Phase 9).

> ### STOP & THINK
> You find a small number of rows where a count-type column holds a negative value.
>
> - A count cannot be negative. So what is that value *doing* there?
> - What is the most common reason a system stores an out-of-range number in a
>   column that cannot legally hold it?
> - If you treat those values as real numbers, what happens to that column's mean?
> - If you convert them to missing, what have you gained — and what have you lost?
> - Is there a third option that keeps the information?

> ### STOP & THINK
> Before you remove *any* duplicate row: what if two different members genuinely
> share identical values across every recorded column?
>
> - With 20 columns and 3,000 members, how plausible is that?
> - Would your answer change if the dataset had only 4 columns?
> - Does the presence of a high-cardinality identifier change the calculation?
> - What does this tell you about deduplicating on *all* columns vs on a key?

### Common mistakes
- Dropping duplicates immediately without looking at them. The duplicated rows
  are evidence about how the dataset was built.
- Treating impossible values as outliers and winsorising them. An impossible
  value is a *wrong* value, not an extreme one; they need different responses.
- Standardising categorical labels by lowercasing everything without first
  reading the distinct values — you may merge two things that are genuinely
  different.
- Forgetting that trailing whitespace is invisible. `"F"` and `"F "` are
  different strings and look identical in every printout.
- Checking only the maximum of a numeric column and not the minimum.
- Fixing problems in the raw file instead of in reproducible code.

### Hints
> **Hint 1 — Conceptual:** For every column, ask: "what is the most absurd value
> this could legally hold?" Then go and check whether anything beats it.
>
> **Hint 2 — Directional:** Print the complete distinct-value list of every
> categorical column, and the min/max of every numeric column. Do this before you
> form any opinion.
>
> **Hint 3 — Technical:** For consistency, compare the number of distinct values
> before and after stripping whitespace and normalising case on a copy of the
> column — the difference quantifies the problem. For duplicates, check
> `duplicated()` on the whole row, on the ID alone, and on a business-key subset
> of columns; the three counts tell three different stories.

### ML connection
Duplicates inflate apparent sample size and can leak identical records across a
train/test split, producing a flattering and false performance estimate.
Inconsistent labels explode into meaningless one-hot columns and fragment real
signal. Impossible values distort every scaling operation and every
distance-based model. This phase protects everything you do afterwards.

### Deliverable
A data-quality issues log: `issue | column(s) | rows affected | evidence | severity | proposed action | rationale`.
Plus your documented cleaning plan — written down, but **not necessarily executed
yet**. You will have better information after Phase 9.

---

# 12. PHASE 6 — UNIVARIATE ANALYSIS: NUMERICAL

📖 Read **§ A3 (Choosing a Visualisation)** and **§ A5 (Outlier Thinking)**.

### Objective
Understand each numerical variable on its own terms: its centre, spread, shape,
and tails — and whether its distribution poses problems for modelling.

### Why this matters
You cannot interpret a relationship between two variables you do not individually
understand. A correlation of 0.3 means one thing between two symmetric variables
and something quite different when one of them is dominated by a long tail.
Distribution shape also drives concrete preprocessing decisions: what to
transform, what to scale, which summary statistic to trust.

### Intuition
Consider gym visits. Most members go somewhere between zero and four times a
week. A handful of extremely dedicated people go daily. The average will sit
somewhere that describes almost nobody — pulled upward by the dedicated few,
above the typical member. The median, meanwhile, describes the middle person
honestly. Whenever the mean and the median disagree, the *gap between them* is
telling you about the shape of the tail.

This is also why the mean is a poor imputation choice for a skewed column: you
would be filling gaps with a value that is not typical of anyone.

### Questions to ask
For every numerical column:
1. What is the centre — and do the mean and median agree?
2. How spread out is it? Is the spread large relative to the centre?
3. What shape is the distribution: symmetric, right-skewed, left-skewed,
   bimodal, uniform?
4. Are there extreme values? How extreme, and how many?
5. Is there a pile-up at a particular value — especially at zero?
6. Are the values continuous, or discrete counts?
7. Does the range make business sense?
8. Would this variable benefit from a transformation? Why?
9. Does the distribution suggest more than one population is mixed together?

### What to investigate
- Descriptive statistics for all numerical columns at once, then column by column
- Extended percentiles — not just the quartiles, but 1st, 5th, 95th, 99th. The
  tails are where the interesting behaviour lives, and the default quartiles hide them.
- Skewness, as a number and as a picture
- The proportion of zeros in each count column
- The actual shape, visually. **Always plot. Never trust summary statistics alone.**

### Possible techniques
- A full descriptive-statistics summary as a first pass
- Custom percentile tables for the tails
- Histograms, to see shape and multimodality
- KDE or density plots, for smooth shape
- Box plots, to see quartiles and flagged extremes compactly
- Violin plots, when you want shape *and* quartiles together
- Comparing a variable before and after a log-style transformation, to see
  whether the transformation actually helps

> **A warning that earns its place here.** Four datasets can share the same mean,
> the same variance, and the same correlation while looking completely different
> when plotted. Summary statistics compress, and compression loses information.
> Plot every numerical variable at least once. No exceptions.

### What to look for
- **Long right tails** — common in counts, spending, distance, and durations
- **Mean ≫ median** — a signature of right skew
- **Zero-inflation** — a large spike at zero with a spread of values above it.
  This often means two populations are mixed: those who never do the thing, and
  those who do it some amount.
- **Bimodality** — two humps suggests two distinct groups sharing a column
- **Values pinned at a round number** — a cap, a default, or a sentinel
- **Suspiciously tidy values** — clustering at multiples of 5 or 10 suggests
  self-reporting or rounding
- **Discreteness where you expected continuity**, or vice versa

### Interpretation guide
- **Strong right skew** → consider a log-style transformation for models that
  assume roughly symmetric inputs; note that tree-based models are indifferent.
  Also means the median is your honest summary.
- **Zero-inflation** → consider engineering a binary "did this at all" feature
  alongside the amount. The decision to *start* is often a different behaviour
  from how much you do.
- **Bimodality** → look for a categorical variable that separates the two humps.
  If you find one, you have discovered a real segment in the business.
- **Huge spread relative to centre** → scaling will matter for
  distance-based and gradient-based models.
- **Extreme values** → do not act yet. Go to § A5 and run the classification
  questions first.

> ### STOP & THINK
> A numerical column has a small number of values far above everything else.
>
> Before you touch them:
> - What could these values legitimately represent in a gym business?
> - Is there a *physical* limit that would make some of them impossible?
> - Would a member who visits twice a day, every day, be an error — or NovaFit's
>   most valuable customer?
> - Which of these extreme values could be real, and which could not? What
>   distinguishes the two groups?
> - What evidence would justify removing any of them?
> - If you removed them, what would you be unable to say about your data
>   afterwards?
>
> Notice that "outlier" is not a single category. Work out how many *kinds* of
> extreme value are sitting in this column.

### Common mistakes
- Reporting the mean for a skewed variable as though it describes a typical case
- Never plotting, and trusting the summary table
- Using the default describe output and never looking at the 1st/99th percentiles
- Treating every flagged point as an error to be removed
- Applying a log transformation to a column containing zeros without handling
  the zeros, and getting infinities
- Forgetting that a count variable's distribution is shaped by how the count was
  defined and over what window

### Hints
> **Hint 1 — Conceptual:** Do all the numerical variables have similar shapes?
> Which one is least like the others?
>
> **Hint 2 — Directional:** Compare the mean against the median for every numeric
> column, and rank the columns by the size of the gap. Then plot the top few.
>
> **Hint 3 — Technical:** Build a summary table with one row per numeric column
> holding: mean, median, std, min, 1%, 25%, 75%, 95%, 99%, max, skew, % zeros,
> and count of nulls. Sort by skew. That single table will direct the rest of
> this phase — and it belongs in your report.

### ML connection
Determines transformation needs, scaling requirements, choice of imputation
statistic, outlier handling policy, and feature-engineering opportunities
(binary flags from zero-inflation, binning of long tails). Also warns you which
models are appropriate: linear and distance-based methods care about scale and
shape; tree-based methods largely do not.

### Deliverable
- The numerical summary table described in Hint 3
- At least one plot per numerical variable
- 2–4 sentences per variable in Observation-Framework form (§ A2)
- A list of extreme values found, **classified** by § A5 — with no removals yet

---

# 13. PHASE 7 — UNIVARIATE ANALYSIS: CATEGORICAL

📖 Read **§ A3**.

### Objective
Understand the composition, balance, and cardinality of each categorical variable.

### Why this matters
Categorical variables must be converted to numbers before most models can use
them, and *how* you convert depends entirely on the structure you find here:
how many levels, how balanced, whether ordered, whether some levels are so rare
that any pattern you see in them is noise.

### Intuition
A category with three members is a category you cannot learn anything reliable
about. If two of those three churned, the churn rate is 67% — a number that looks
dramatic and means nothing at all. Small groups produce unstable, extreme-looking
statistics, and they are one of the most common ways an analyst fools themselves.
Knowing the group *sizes* is what protects you from over-reading the group *rates*
in Phase 9.

### Questions to ask
1. How many distinct levels does each categorical variable have?
2. How is frequency distributed across levels — balanced or dominated by one?
3. Which levels are rare? How rare is too rare?
4. Is the variable ordered or unordered?
5. Do the levels cover the space sensibly, or is something obviously absent?
6. After the Phase 5 consistency work, does the level count change?
7. Does any level actually represent "missing" or "unknown"?
8. For an apparently boolean column, is it truly two-valued?

### What to investigate
- Frequency counts and proportions for each categorical column
- Cardinality per column
- The rarest levels in each column and their absolute counts
- Whether any level is below a usable sample threshold

### Possible techniques
- Value counts, in both absolute and proportional form
- Bar charts of category frequencies — sorted by frequency, not alphabetically,
  unless the variable is ordered
- Horizontal bars when labels are long
- Cumulative share, to see how many levels account for most of the data

> **On pie charts:** humans compare angles badly and lengths well. A bar chart is
> almost always the better choice. Reserve pies for the rare case of showing
> two or three parts of an obvious whole, in a presentation, to a non-technical
> audience.

### What to look for
- Very high cardinality relative to row count (approaching an identifier)
- Cardinality of one (no information)
- One level dominating the entire column
- Levels with very small counts
- Levels that look like variants of each other (send you back to Phase 5)
- Levels that represent absence: blanks, whitespace, `"unknown"`, `"N/A"`

### Interpretation guide
- **Low cardinality, balanced** → straightforward; one-hot encoding is simple
  and safe.
- **Low cardinality, dominated by one level** → the minority levels may have too
  little data to be reliable; check their absolute counts before trusting any
  rate computed on them.
- **Ordered categorical** → ordinal encoding preserves the order, which one-hot
  discards. But only use ordinal encoding when the order is real and the spacing
  is roughly meaningful.
- **Rare levels** → your options are keep, group into "Other", or merge into a
  neighbouring level. Do not decide now — decide in Phase 9, once you can see
  whether the rare level behaves distinctively against the target.
- **A level meaning "unknown"** → this is missingness. Route it back to Phase 4's
  analysis rather than encoding it as a real category by accident.

### Common mistakes
- Reading proportions without the underlying counts. 50% of a category is
  dramatic at n=400 and meaningless at n=4.
- Grouping rare categories before checking whether they behave distinctively
- One-hot encoding a high-cardinality column without thinking about the width of
  the result
- Sorting bars alphabetically when frequency order would communicate better
- Treating an ordered variable as unordered and losing the ordering information

### Hints
> **Hint 1 — Conceptual:** Which categorical variable would you be least
> comfortable drawing conclusions about, and why?
>
> **Hint 2 — Directional:** For every categorical column, list the levels with
> their counts *and* percentages, sorted ascending. The top of that list — the
> rarest levels — is what matters here.
>
> **Hint 3 — Technical:** Decide on a minimum-count threshold for a level you
> would trust (a common rule of thumb is at least 30–50 observations, though it
> depends on the effect size you hope to detect). Flag every level that falls
> below it. Keep that flag list; you will need it in Phase 9 to avoid
> over-interpreting small groups.

### ML connection
Determines encoding strategy (one-hot / ordinal / target / grouping), feature
dimensionality after encoding, whether rare-level grouping is needed, and where
you should be sceptical of group-level statistics later.

### Deliverable
A categorical summary table: `column | n levels | top level | top level % | rarest level | rarest count | ordered? | notes`,
plus a frequency plot per categorical variable and your flagged list of
low-count levels.

---

# 14. PHASE 8 — TARGET ANALYSIS

📖 Read **§ A7 (Target-Oriented EDA)**.

### Objective
Understand the target variable thoroughly before relating anything to it.

### Why this matters
The target's distribution determines your evaluation strategy, your baseline,
your sampling considerations, and how you should read every group comparison in
Phase 9. Analysts who skip straight to feature-vs-target plots have no reference
point against which to judge what they see.

### Intuition
Suppose 30% of members churn. A group with a 35% churn rate is slightly worse
than typical. But if you did not know the overall rate was 30%, you might read
35% as alarming — or as fine. Every group rate is only meaningful *relative to
the base rate*. Establishing that base rate is the entire point of this phase.

The base rate also sets the bar for any future model: predicting "nobody churns"
would already be right 70% of the time. Any model must beat that, and accuracy
alone will not tell you whether it does.

### Questions to ask
1. What is the overall churn rate? (This is your **base rate** — memorise it.)
2. How imbalanced is the target? Is that imbalance a problem at this level?
3. How many observations are in the minority class, in absolute terms?
4. Is the target definition unambiguous? What exactly counts as churned?
5. Is there any hint of a time dimension in how churn was determined?
6. Is the target complete — any missing values in it?
7. Does the target rate vary with signup date or tenure?

### What to investigate
- The target's value counts, absolute and proportional
- The absolute size of the minority class
- Target completeness
- The target rate across time (by signup period) and across tenure

### Possible techniques
- Value counts and proportions on the target
- A simple bar chart of class balance
- Target rate aggregated by a time grouping derived from the signup date
- Target rate aggregated by tenure bands

### What to look for
- The base rate, as a number you will reference constantly from here on
- Whether the minority class has enough absolute observations to support analysis
- Any drift in the target rate across time
- The relationship between tenure and churn — think carefully about what tenure
  means for someone who has already left versus someone still active

### Interpretation guide
- **Mild imbalance (roughly 70/30 or better)** → manageable. Standard methods
  work; you still must not use accuracy as your headline metric.
- **Severe imbalance (95/5 or worse)** → demands specific handling: appropriate
  metrics, possibly resampling or class weighting.
- **Target rate varying over time** → the population is not stationary. This
  affects how you would split data for validation: a random split may be
  optimistic compared to a time-based one.
- **Any missingness in the target** → those rows cannot be used for supervised
  training. Investigate why they are missing before discarding them.

> ### STOP & THINK
> Think carefully about `tenure_months` in relation to the target.
>
> - For a member who churned, what period does their tenure actually measure?
> - For a member who is still active, what does it measure?
> - Are those two things the same quantity?
> - If short tenure is associated with churn, is that because new members are
>   more likely to leave — or because leaving is what *stops* your tenure from
>   growing?
> - Is this a legitimate predictor, a partially circular one, or something in
>   between?
>
> This is a genuinely subtle question and professionals disagree about cases like
> it. Form a view, write down your reasoning, and revisit it in Phase 11.

### Common mistakes
- Not establishing the base rate, then misreading every group comparison afterwards
- Planning to use accuracy as the evaluation metric on imbalanced data
- Assuming class imbalance always requires resampling. Often it does not; try
  the straightforward approach with an appropriate metric first.
- Ignoring the time dimension entirely
- Failing to notice that the target's definition may embed a time window

### ML connection
Sets your baseline, your metric choice (precision/recall/F1/ROC-AUC/PR-AUC over
raw accuracy), whether class weighting or resampling is warranted, and how
validation should be structured. Also gives you the reference point for every
finding in Phase 9.

### Deliverable
- The base rate, stated explicitly
- Class counts in absolute and proportional form
- Target rate across time and across tenure bands, with commentary
- A short note on evaluation-metric implications
- Your written answer to the STOP & THINK above

---

# 15. PHASE 9 — BIVARIATE ANALYSIS: FEATURE vs TARGET

📖 Read **§ A7** and **§ A3**. This is the most important phase in the project.

### Objective
Determine, for every candidate feature, whether and how it relates to churn.

### Why this matters
This is where EDA stops being description and becomes analysis. Everything
before this phase was preparation; everything after is consolidation. The output
of this phase is the substantive content of your report — and the feature
shortlist a modelling team would actually use.

### Intuition
The question is always the same, regardless of feature type: **does knowing this
feature change my expectation of the target?** If members who visit rarely churn
at a much higher rate than members who visit often, then visits carry
information. If the churn rate is identical across every level of a feature, that
feature — on its own — tells you nothing.

The mechanics differ by type, but the question never does:
- **Categorical feature** → compare the target rate *across levels*.
- **Numerical feature** → compare the feature's *distribution* across target
  classes, or bin the feature and compare target rates across bins.

### Questions to ask
For every feature:
1. Does the target rate differ across this feature's levels or ranges?
2. How large is the difference, in absolute percentage points?
3. Is the direction consistent with your Phase 1 hypothesis?
4. Is the relationship monotonic, or does it change direction?
5. How many observations sit in each group being compared?
6. Could the difference plausibly be noise?
7. Is there a sensible business mechanism for this relationship?
8. Is the relationship suspiciously strong? (§ A9)

### What to investigate

**Categorical → target**
- Target rate per level, *always* alongside the count per level
- The spread between the highest and lowest level rates
- How each level compares to the overall base rate

**Numerical → target**
- Distribution of the feature split by target class, overlaid or side by side
- Summary statistics of the feature per target class
- Target rate across binned ranges of the feature — quantile bins are usually
  more informative than equal-width bins on skewed data
- Whether the relationship is monotonic across bins

**Temporal → target**
- Target rate by signup period
- Whether any relationship is stable over time or drifting

### Possible techniques
- Grouped aggregation of the target mean by category, with counts attached
- Bar charts of target rate by level, with a horizontal reference line at the
  base rate — this single design choice makes your charts far easier to read
- Box or violin plots of a numerical feature split by target class
- Overlaid density plots per class
- Quantile binning followed by target-rate aggregation
- Stacked or grouped bars for categorical relationships
- A sorted summary table ranking all features by the strength of their
  association with the target

### What to look for
- Large spreads in target rate across levels
- Monotonic trends across binned numerical features — these are the most
  trustworthy and most explainable relationships
- Non-monotonic or U-shaped patterns — real, interesting, and invisible to a
  plain correlation coefficient
- Features where the target rate is essentially flat — a genuine finding worth
  reporting
- Extreme rates in tiny groups — almost always noise (Phase 7 gave you the
  count flags for exactly this)
- Any feature that separates the classes almost perfectly — treat with deep
  suspicion (§ A9)

### Interpretation guide
- **Large, monotonic, mechanistically sensible** → a strong candidate feature.
  Your best findings look like this.
- **Large but non-monotonic** → real and useful, but linear models will struggle
  to use it as-is. Note it as a binning or tree-model opportunity.
- **Small difference on a large group** → possibly real but weak; may still add
  value in combination with others.
- **Large difference on a tiny group** → likely noise. Report the count next to
  the rate and let the reader see the fragility.
- **No relationship** → report it. "We checked and it doesn't matter" is a
  genuine result that saves the modelling team time and prevents someone else
  from re-running your work.
- **Near-perfect separation** → stop. This is more likely leakage than insight.
  Go to § A9 before you get excited.

> ### STOP & THINK
> You find a feature where one group churns at nearly three times the rate of
> another.
>
> - Does this feature *cause* churn, or merely *accompany* it?
> - Could a third variable be driving both?
> - Could the causation run backwards — does churning cause the feature value?
> - Does the answer change what you would recommend the business *do*?
> - Does the answer change whether the feature is useful for *prediction*?
>
> Note carefully: prediction and explanation are different goals with different
> requirements. A feature can be excellent for one and useless for the other.

> ### STOP & THINK
> You find a binary feature that is almost perfectly aligned with the target —
> knowing it would let you classify nearly every member correctly.
>
> - Go back to your Phase 1 known-at audit for that feature.
> - When, in the member's lifecycle, does this value get set?
> - If you deployed a model using it, what value would this feature hold for a
>   currently-active member you are trying to score?
> - Would the model work in production? Would it look like it worked in testing?
> - What is the general rule you should extract from this?
>
> This is the single most valuable lesson available in this dataset. Take your
> time with it.

### Common mistakes
- Reporting group rates without group sizes — the most common serious error in
  beginner EDA
- Computing a correlation coefficient for a categorical variable
- Relying only on linear correlation for numerical features and thereby missing
  every non-linear relationship
- Concluding causation from association
- Using equal-width bins on a skewed variable, producing bins containing almost
  no data
- Getting excited about a strong predictor without asking where it came from
- Only investigating the features you expected to matter, and never checking
  the ones you dismissed

### Hints
> **Hint 1 — Conceptual:** For each feature ask: "if I knew only this, how much
> would my guess about churn improve?"
>
> **Hint 2 — Directional:** For categoricals, group the target by the feature and
> take the mean. For numericals, bin into quartiles or deciles and do the same
> thing. The pattern across bins is what you are reading.
>
> **Hint 3 — Technical:** Build one ranked summary table across *all* features:
> `feature | type | target rate range (min → max) | spread in pp | smallest group n | monotonic? | hypothesis confirmed?`.
> Sort by spread. This table is the backbone of your report, and building it
> forces you to analyse every feature rather than only the interesting ones.

### ML connection
Directly produces your feature shortlist, identifies binning and interaction
opportunities, reveals non-linearity (which informs model choice), flags leakage
candidates, and gives you the domain narrative that makes a model explainable to
stakeholders.

### Deliverable
- The ranked feature-vs-target table from Hint 3, covering **every** feature
- A plot for each of your top 6–8 features
- Observation-Framework notes (§ A2) for each meaningful relationship
- An explicit comparison against your Phase 1 predictions: what you got right,
  what surprised you
- Your leakage watchlist, updated

---

# 16. PHASE 10 — RELATIONSHIPS BETWEEN FEATURES

📖 Read **§ A6 (Correlation)**.

### Objective
Understand how features relate to *each other*: redundancy, confounding, and the
first hints of interaction.

### Why this matters
Two features carrying the same information do not carry twice the information.
Redundancy inflates dimensionality, destabilises linear model coefficients, and
makes feature-importance rankings unreliable and hard to explain. Relationships
between features also expose confounding — the reason a feature *appeared*
important in Phase 9 may be that it is standing in for something else.

### Intuition
Suppose gym visits and class attendance move together almost perfectly: people
who come often attend more classes, obviously. Include both in a linear model and
it cannot tell which one is responsible for the effect. It may split the credit
arbitrarily, or assign one a large positive coefficient and the other a large
negative one. The model's predictions might be fine; its explanation will be
nonsense. Since one of your goals is telling the business *why* people churn,
that matters.

### Questions to ask
1. Which pairs of numerical features are strongly correlated?
2. Are any pairs so correlated as to be effectively the same variable?
3. Is any numerical feature deterministically derivable from a categorical one?
4. Do any pairs show a clear relationship that linear correlation *misses*?
5. Do extreme values distort any of your correlation estimates?
6. Does any feature-target relationship from Phase 9 weaken once you control for
   another feature?
7. Are there hints that two features *combine* to affect the target?

### What to investigate
- A correlation matrix over numerical features — computed with **both** a linear
  and a rank-based method (§ A6)
- **Any pair where the two methods disagree substantially** — this is the most
  informative thing in the whole phase
- Scatter plots for the strongest pairs, to see the actual shape
- Relationships between categorical and numerical features (group summaries)
- Relationships between pairs of categorical features (cross-tabulations)
- Target rate within combinations of two features, as an interaction probe

### Possible techniques
- Correlation matrices with a diverging colour scale, masked to the lower triangle
- Rank-based correlation alongside linear correlation, and a table of the
  differences between them
- Pair plots on a manageable subset of features
- Grouped means / box plots of a numerical feature by a categorical one
- Cross-tabulations, with proportions normalised by row or column
- Two-way target-rate tables, ideally as a heatmap

### What to look for
- Correlation magnitudes above roughly 0.8 — near-redundancy
- Perfect or near-perfect association between a numeric column and a categorical
  one, meaning one is simply a recoding of the other
- **Large gaps between linear and rank-based correlation for the same pair.**
  This signals either a non-linear-but-monotonic relationship, or that a handful
  of extreme values is distorting the linear estimate. Both are important, and
  neither is visible from the linear coefficient alone.
- Curved, stepped, or fan-shaped patterns in scatter plots
- Target-rate patterns in a two-way table that are not simply the sum of the two
  one-way effects — that is an interaction

### Interpretation guide
- **Very high correlation between two features** → they are largely redundant.
  Options: drop one (keep the more interpretable or more complete one), combine
  them, or keep both if you are using a model that tolerates it. Document the choice.
- **A numeric feature perfectly determined by a categorical one** → it adds no
  independent information. Keep whichever is more useful and note the redundancy.
- **Linear correlation low, rank correlation high** → there *is* a strong
  relationship; it is just not a straight line, or extreme values are dragging
  the linear estimate down. Never conclude "no relationship" from a low linear
  correlation alone. Look at the scatter plot and find out which explanation applies.
- **A Phase 9 relationship that weakens when you control for another feature** →
  the original association was partly or wholly confounded. This is a significant
  finding and belongs prominently in your report.
- **Interaction visible in a two-way table** → a feature-engineering opportunity,
  and a hint that tree-based models may outperform purely linear ones.

> ### STOP & THINK
> You compute a linear correlation between two features and get a weak value,
> around 0.3. You then compute a rank-based correlation on the same pair and get
> something far higher, above 0.9.
>
> - What are the two main explanations for this gap?
> - How would a scatter plot let you distinguish between them?
> - If a small number of extreme points were responsible, roughly how few points
>   would it take to do this to a dataset of 3,000 rows?
> - Which of the two coefficients better describes the relationship between these
>   two variables?
> - What would have happened if you had only computed the linear one and moved on?
>
> This scenario is not hypothetical. Go and look for it.

### Common mistakes
- Computing only linear correlation and declaring the analysis done
- Reading a correlation matrix without plotting any of the pairs
- Dropping one of a correlated pair automatically, without considering which is
  more interpretable, more complete, or more actionable for the business
- Treating correlation as causation, again
- Computing correlations that include an identifier column
- Ignoring categorical-categorical and categorical-numerical relationships
  because correlation does not apply to them

### Hints
> **Hint 1 — Conceptual:** Are any two of your features really telling you the
> same thing in different units?
>
> **Hint 2 — Directional:** Compute the correlation matrix twice, with a linear
> and a rank-based method. Then look at where they *disagree*, not just where
> they are large.
>
> **Hint 3 — Technical:** Unstack the correlation matrix into a long
> `feature_a | feature_b | pearson | spearman | difference` table, drop the
> self-pairs, and sort by absolute difference. Scatter-plot the top few rows.
> Separately, sort by absolute correlation to find your redundant pairs.

### ML connection
Drives feature selection and dimensionality reduction, warns of unstable
coefficients and unreliable importance scores in linear models, reveals
interaction features worth engineering, and identifies confounders that change
how you explain your results to stakeholders.

### Deliverable
- Correlation matrices (both methods) with commentary
- A ranked list of redundant pairs and your proposed resolution for each
- The linear-vs-rank disagreement table, with scatter plots of the top pairs
  and an explanation of what caused each gap
- At least one investigated interaction, with a two-way target-rate table
- A note on any Phase 9 finding that now looks confounded

---

# 17. PHASE 11 — EDA → ML DECISIONS & LEAKAGE SCREEN

📖 Read **§ A8 (EDA → Machine Learning)** and **§ A9 (Data Leakage)**.

### Objective
Convert every finding into an explicit, justified modelling decision — and screen
the whole feature set for leakage before anything reaches a model.

### Why this matters
EDA that ends in observations has not paid for itself. The value of this work is
realised only when it changes what happens next. This phase is where "I noticed
X" becomes "therefore we will do Y, and here is how we will verify it was right."

### Intuition
Think of yourself as handing over to a modelling team who will never see your
notebook. What do they need? Not your plots. They need: which columns to drop and
why, what to do about each missing-value pattern, which features to transform,
what to encode and how, which features are dangerous, and what to watch out for
in validation. Every item needs a reason, because when one of your decisions
turns out to be wrong, the reason is what lets them find and fix it.

### Questions to ask

**Leakage screen — for every feature, without exception**
1. When does this value become known, relative to the moment of prediction?
2. Could this value have been *caused by* the outcome rather than preceding it?
3. Is it suspiciously predictive relative to its plausible business mechanism?
4. If you were scoring a currently-active member tomorrow, would this value even
   exist for them?
5. Does this feature encode any post-outcome process — a cancellation workflow,
   an exit process, a final billing event?

**Cleaning decisions**
6. Which quality issues from Phase 5 will you fix, and exactly how?
7. Which rows, if any, will you remove — and how many does that cost you?
8. Which values become missing rather than being corrected?
9. Which corrections are you confident enough to make, and on what evidence?

**Preprocessing decisions**
10. Imputation strategy per column, with justification
11. Which features need transformation, and which models actually care
12. Encoding strategy per categorical feature
13. Scaling requirements, conditional on model family
14. Outlier policy per column — keep, cap, flag, or remove, with reasoning

**Feature decisions**
15. Which features to keep, drop, or engineer
16. Which engineered features do your findings specifically suggest?
17. Which redundancies will you resolve, and how?

**Validation concerns**
18. Does the time dimension require a time-based split rather than a random one?
19. Do duplicates threaten the independence of train and test sets?
20. What metric suits this target's balance?

### What to investigate
Re-examine your leakage watchlist from Phases 1, 9, and 10 with everything you
now know. Then walk the full column list once, top to bottom, and make an
explicit keep/drop/engineer call on every single one. No column gets skipped
because it seemed unremarkable.

### Possible techniques
- A decision register: one row per column, with the decision and its justification
- A leakage audit table: `feature | known at prediction time? | caused by outcome? | suspiciously strong? | verdict`
- A written reasoning chain for each major decision (see below)
- A ranked risk register for the modelling team

### The reasoning chain

Every decision in your report should be traceable through this structure:

```text
EDA finding
      ↓
Interpretation  (what explains it?)
      ↓
Potential ML problem  (what breaks if we ignore it?)
      ↓
Possible decision  (what will we do?)
      ↓
Validation required  (how will we know it was right?)
```

Worked example of the *form* — the content here is illustrative, not a finding
from your dataset:

```text
Finding:        Feature Z has a long right tail; mean far exceeds median.
Interpretation: A small group behaves very differently from the majority.
ML problem:     Linear models will be dominated by the tail; scaling distorted.
Decision:       Evaluate a log-style transform; treat tail as a distinct segment.
Validation:     Compare model performance with and without the transform; confirm
                the tail group is genuine rather than a data-quality artefact.
```

### What to look for
- Any feature whose predictive power exceeds what its business mechanism could
  plausibly explain
- Any feature that could not be computed for a member you are trying to score today
- Decisions you are making out of habit rather than evidence
- Columns you have not thought about at all

### Interpretation guide
- **Leaky feature** → exclude from modelling. But *keep it in your analysis* and
  report it: it often describes a real business process and is genuinely useful
  for understanding churn retrospectively. Excluded ≠ uninteresting.
- **Partially circular feature** (one whose value is influenced by the outcome
  but not determined by it) → the hardest case. Options: exclude it, redefine it
  relative to a fixed reference point, or restrict the analysis window. Explain
  your choice; a reviewer may disagree and should be able to see your reasoning.
- **A decision you cannot justify** → you have not finished investigating. Go back.

### Common mistakes
- Dropping a leaky feature silently, so nobody learns why
- Keeping a leaky feature because it "improves performance" — this is the classic
  and catastrophic error
- Making preprocessing decisions that contradict your own findings (imputing a
  skewed column's mean after documenting that it is skewed)
- Deciding on transformations without noting which model families care
- Recommending a random train/test split without considering the time structure
- Leaving columns unexamined because they seemed boring

### Hints
> **Hint 1 — Conceptual:** If this model ran tomorrow morning on active members,
> would every feature you plan to use actually have a value?
>
> **Hint 2 — Directional:** Sort your features by strength of association with the
> target. Examine the top of that list with maximum suspicion. Then, separately,
> re-read your Phase 1 known-at audit and check every "known only after exit" entry.
>
> **Hint 3 — Technical:** Build a decision register with one row per column:
> `column | role | issues found | decision (keep/drop/engineer) | preprocessing | leakage verdict | justification`.
> All 21 columns must appear. If a cell is empty, you have unfinished work.

### ML connection
This phase *is* the ML connection. It is the entire deliverable of EDA for a
modelling project.

### Deliverable
- The complete 21-row decision register
- The leakage audit table, with a verdict on every feature
- At least four fully written reasoning chains for your most important decisions
- A prioritised risk register for the modelling team

---

# 18. PHASE 12 — THE EDA REPORT

### Objective
Communicate everything you found to someone who was not there.

### Why this matters
Unread analysis has zero value. The ability to turn exploration into a clear,
decision-useful document is what makes an analyst employable; it is also the
skill most often left untrained, because it is the least fun part.

### Intuition
Two audiences will read your report. A business stakeholder wants to know what
is driving churn and what to do about it — they will read your executive summary
and nothing else. An engineer wants to know what to build and what to avoid —
they will read your decision register. Neither wants a tour of your notebook.
Write for them, not for yourself.

### Questions to ask
1. If a reader read only your first paragraph, what must they know?
2. Can you state your top 5 findings in one sentence each?
3. Is every claim supported by stated evidence?
4. Have you separated what you *observed* from what you *believe* it means?
5. Have you stated your uncertainties and limitations honestly?
6. Could a stranger reproduce your conclusions from your notebook?

### What to investigate
Your own work, critically. Reread your notebook as though a colleague wrote it
and you are reviewing it — looking for unsupported claims, missed checks, and
conclusions that outrun the evidence.

### Possible techniques
- Write the executive summary **last** but place it **first**
- One finding per section, with evidence directly beneath it
- Include the plot that *shows* the finding, not every plot you happened to make
- Quantify everything: "churn is 22 percentage points higher in group A (n=380)
  than group B (n=1,240)" beats "group A churns more"
- Always pair a rate with its sample size
- Keep a separate limitations section; hiding weaknesses damages credibility
  more than the weaknesses do

### What to look for in your own draft
- Claims with no numbers attached
- Numbers with no sample size attached
- Interpretation smuggled into observation
- Findings that are technically true and practically useless
- Recommendations that do not follow from anything you showed
- Plots included as decoration

### Common mistakes
- Structuring the report around your *process* ("first I loaded the data...")
  instead of around your *findings*
- Including every plot
- Burying the most important finding in the middle
- Omitting limitations
- Forgetting the non-technical reader entirely
- Writing "further analysis is needed" without saying what analysis, or why

### Hints
> **Hint 1 — Conceptual:** What would you say if you had 60 seconds with the CEO?
>
> **Hint 2 — Directional:** Write the five headline findings first, as five plain
> sentences. Build the report around them.
>
> **Hint 3 — Technical:** Follow the specification in § 19 exactly. It is the
> structure you will be evaluated against.

### ML connection
Your report is the interface between analysis and engineering. Its quality
determines whether any of your work survives contact with the rest of the team.

### Deliverable
`reports/EDA_REPORT.md`, complete per § 19.

---
---

# REFERENCE CHAPTERS

These chapters are the reusable theory behind the phases. Read each one the
first time a phase points you to it. Come back to them whenever you are stuck —
this is the material you would otherwise have to ask for.

---

# A1. REFERENCE: THE EDA MINDSET

### What EDA actually is

Exploratory Data Analysis is the process of building an accurate mental model of
a dataset before committing to any conclusion about it. It is not a plotting
exercise, and it is not a fixed checklist. It is structured curiosity with a
paper trail.

### The four questions

Every EDA step, without exception, should be answering one of these:

1. **What is in this data?** — structure, types, scale, meaning
2. **Can I trust it?** — quality, validity, consistency, completeness
3. **What patterns exist?** — distributions, relationships, segments
4. **What does this mean for the decision I am supporting?** — ML and business consequences

If you cannot say which of the four your current cell is serving, stop and think
before running it.

### The core discipline

> **Investigate before you act.**

Every irreversible operation — dropping rows, filling values, removing outliers,
merging categories — should be preceded by an investigation that justifies it and
followed by documentation that explains it. Analysts get into trouble by cleaning
first and thinking second.

### The habit that separates levels

Beginners ask: *"which pandas command should I run?"*

Practitioners ask: *"what do I need to understand, why does it matter, how can I
investigate it, and what will the answer change?"*

The commands are the easy part and always have been. They are searchable. The
questions are the skill.

### On being wrong

You will form hypotheses that the data contradicts. That is the system working.
An analyst whose every prediction is confirmed is either in a very simple domain
or is not looking hard enough. Write predictions down precisely so that being
wrong is informative rather than forgettable.

---

# A2. REFERENCE: THE OBSERVATION FRAMEWORK

Use this for every meaningful finding. It is the single highest-leverage habit in
this entire guide.

```text
Observation:     What do I literally see? (numbers, no interpretation)
Interpretation:  What could explain this? (hypotheses, possibly several)
Evidence:        What in the data supports my interpretation?
ML Impact:       Why does this matter for modelling?
Action:          What will I do, investigate further, or deliberately leave alone?
```

### Why these must stay separate

**Observation ≠ Interpretation ≠ Action.** Collapsing them is the most common
analytical error there is, and it is invisible from the inside.

| Statement | What it really is | Problem |
| --------- | ----------------- | ------- |
| "Column X has 312 missing values (10.3%)" | Observation | Fine — factual, checkable |
| "Column X is missing because members stopped responding" | Interpretation | Presented as fact; it is a hypothesis |
| "I filled column X with the median" | Action | Taken before the interpretation was tested |

Once an interpretation is written as though it were an observation, nobody — not
your reviewer, not you in two weeks — can tell which parts of your analysis are
established and which are guesses. The whole document becomes untrustworthy.

### A worked example of the *form*

The content below is illustrative. It is not a finding from your dataset.

```text
Observation:
  Feature Q has a median of 2.1 and a mean of 3.4. The 99th percentile is 14.
  Twelve rows exceed 18.

Interpretation:
  Three possibilities: (a) a genuine minority of very high-usage members,
  (b) a data-entry or unit error in those twelve rows, (c) a different
  measurement definition applied to a subset.

Evidence:
  The twelve extreme rows do not share a city, tier, or signup channel. Their
  values are not round numbers. Other engagement columns for those rows are
  ordinary, which is hard to reconcile with (a).

ML Impact:
  These twelve rows are enough to distort scaling and to suppress this column's
  linear correlation with related features.

Action:
  Do not remove. Flag them, quantify their effect on correlation by recomputing
  without them, and carry the question into the feature-relationship phase.
```

Notice that the Action is *investigate further*. That is a legitimate and often
correct action. "Do nothing yet" is a decision, as long as it is a deliberate one.

### Where to record these

In markdown cells directly beneath the analysis that produced them. Findings
written later from memory lose the detail that made them useful.

---

# A3. REFERENCE: CHOOSING A VISUALISATION

### The wrong mental model

> "For a numerical variable, use a histogram."

This produces analysts who make correct plots that answer no question.

### The right mental model

> **Start with the question. Then choose the plot that answers it.**

A plot is an instrument for answering a specific question about the data. Before
you write any plotting code, finish this sentence: *"I am making this plot to
find out whether ______."* If you cannot finish it, you do not need the plot.

### Question → candidate tools

| Your question | Candidate tools | What each reveals |
| ------------- | --------------- | ----------------- |
| How is one numerical variable distributed? | histogram, KDE, box, violin | histogram: shape & multimodality; KDE: smooth shape; box: quartiles & flagged extremes; violin: shape + quartiles |
| How frequent is each category? | bar chart, sorted bar | relative sizes; sorting adds rank information |
| Does a numerical variable differ across groups? | grouped box, violin, overlaid KDE, faceted histogram | box: compare centres/spread; KDE: compare full shapes; facets: preserve each group's detail |
| Does the target rate differ across categories? | bar of group means with a base-rate reference line | size and direction of effect, against a reference |
| How do two numerical variables relate? | scatter, hexbin, 2-D density | shape, curvature, clusters; hexbin/density when points overlap heavily |
| How do many numerical variables relate? | correlation heatmap, pair plot | heatmap: overview of strength; pair plot: actual shapes |
| How do two categoricals relate? | cross-tab heatmap, grouped/stacked bar | joint distribution and conditional rates |
| Does something change over time? | line chart, rate-over-period bar | trend, seasonality, drift |
| Where are values missing? | missingness matrix/heatmap | block structure and co-occurrence |

### When each tool misleads

| Tool | Fails when | Consequence |
| ---- | ---------- | ----------- |
| Histogram | Bin count chosen badly | Invents or hides modes. Always try several bin counts. |
| Box plot | Distribution is bimodal | Completely hides the two humps — a box plot cannot show multimodality |
| KDE | Data is bounded or discrete | Smooths mass past impossible values (below zero, above a cap) |
| Bar of means | Group sizes differ hugely | A dramatic bar over n=4 looks identical to one over n=4,000 |
| Scatter | Thousands of overlapping points | Overplotting hides density; use transparency or hexbin |
| Correlation heatmap | Relationships are non-linear | Shows near-zero for a strong curved relationship |
| Pie chart | More than ~3 slices | Humans compare angles badly |
| Any plot | Axis truncated or scaled misleadingly | Exaggerates or erases real differences |

### Universal rules

1. **Label the axes.** Always. Including units.
2. **Give it a title that states the question or the finding.**
3. **Show sample size** whenever you show a group statistic.
4. **Add a reference line** when comparing against a base rate — it turns a
   chart people have to squint at into one they read instantly.
5. **Sort bars by value** unless the categories have a natural order.
6. **Do not truncate a bar chart's axis** away from zero.
7. **One plot, one message.** If it takes a paragraph to explain, split it.
8. **If a table communicates better, use the table.** Not every finding is a picture.

### The self-check

After making any plot, ask: *"What did I just learn, in one sentence?"*
No sentence → delete the plot or change the question.

---

# A4. REFERENCE: DATA QUALITY INVESTIGATION

### The five dimensions

| Dimension | Question | Typical defects |
| --------- | -------- | --------------- |
| **Completeness** | Is anything absent? | nulls, sentinels, empty strings, whitespace |
| **Uniqueness** | Is each observation recorded once? | exact duplicates, key collisions, re-registrations |
| **Validity** | Is each value possible? | out-of-range values, negative counts, impossible dates |
| **Consistency** | Do values agree with each other and themselves? | label variants, contradictory related columns |
| **Accuracy** | Do values match reality? | usually unverifiable without an external source — state this as a limitation |

### Missingness mechanisms

Understanding *why* data is missing determines what you may legitimately do
about it. There are three classic mechanisms:

**MCAR — Missing Completely At Random.** The probability of being missing is
unrelated to anything, observed or unobserved. A sensor dropped packets at
random. *Consequence:* the observed data is still a representative sample. Simple
imputation or even row deletion is defensible.

**MAR — Missing At Random.** The probability of being missing depends on *other
observed variables*, but not on the missing value itself. Older members skip the
digital survey more often, regardless of how satisfied they are. *Consequence:*
imputation should condition on those other variables — a group-wise or
model-based imputation, not a global mean.

**MNAR — Missing Not At Random.** The probability of being missing depends on the
missing value itself. Unhappy members decline to report their satisfaction.
*Consequence:* the missingness itself carries information. Imputation alone
destroys signal. Preserve it with an explicit indicator, and be honest that the
observed values are a biased sample of the true ones.

**How to tell them apart.** You cannot prove MNAR from the data alone — that is
its defining difficulty. But you can gather strong evidence: compare the target
rate and the feature distributions between the missing and non-missing subgroups.
If they differ systematically, MCAR is out. Whether you are in MAR or MNAR then
depends on domain reasoning about the collection process. Say which you believe
and why.

### Sentinel values — missingness in disguise

Systems that cannot store a null often store a magic number instead. Common
disguises:

- `-1` in a column that cannot be negative
- `999`, `9999`, `-999` in a numeric column
- `0` where zero is impossible for that quantity
- `""`, `" "`, `"-"`, `"N/A"`, `"NA"`, `"unknown"`, `"none"`, `"null"` in text columns
- A default date like `1900-01-01` or `1970-01-01`

These will not appear in a null count. They will appear in the minimum, the
maximum, or the distinct-value list — which is why you must check those for every
column. A sentinel left untreated is worse than a null: it is silently averaged
into your statistics as though it were real.

### Duplicate taxonomy

| Type | Definition | Usual cause | Usual treatment |
| ---- | ---------- | ----------- | --------------- |
| Exact duplicate | Every column identical | ETL / extraction artefact | Remove, after confirming repetition is impossible for this unit of observation |
| Key duplicate | Same ID, different values | Update history, or entry collision | Investigate; choose a copy deliberately or reshape the data |
| Entity duplicate | Same real entity, different ID | Re-registration, merger, typo in ID | Detect with a business key; merging is a business decision |
| Legitimate repetition | Identical rows that are genuinely distinct events | The unit of observation is an event, not an entity | Keep — removing them destroys data |

The last row is why you must establish your unit of observation (Phase 3) before
deduplicating anything.

### Validity checking method

1. **Before looking**, write the legal range or legal value set for every column.
2. Check the minimum and maximum of every numerical column against it.
3. List the complete distinct-value set of every low-cardinality column.
4. Write cross-column consistency rules and count the violations.
5. Classify each violation: **impossible** (wrong) vs **implausible** (surprising
   but possible). These get different treatments — see § A5.

### Categorical consistency checklist

- Case differences: `Male` / `male` / `MALE`
- Leading or trailing whitespace: `"F"` vs `"F "` — invisible in every printout
- Abbreviations vs full forms: `M` vs `Male`
- Synonyms: `Website` vs `Online` vs `Web`
- Spelling variants and typos
- Empty or whitespace-only values pretending to be a category
- Levels with too few observations to support any conclusion

A quick way to quantify the problem: count distinct values, then count distinct
values again on a copy with whitespace stripped and case normalised. The
difference is the scale of the inconsistency.

---

# A5. REFERENCE: OUTLIER THINKING

### The governing principle

> **Never remove an outlier simply because it is an outlier.**

An outlier is a *statistical* description — a point far from the others. It is
not a verdict about correctness. Some of the most valuable observations in a
business dataset are outliers: the biggest customer, the fraud case, the viral
week. Deleting them because a formula flagged them is deleting the interesting part.

### The five-way classification

Every extreme value you find belongs to one of these. Your job is to work out
which, using evidence.

| # | Type | Description | Evidence that points here | Typical treatment |
| - | ---- | ----------- | ------------------------- | ----------------- |
| 1 | **Data-entry error** | A human typed it wrong | Impossible value; digit patterns (extra zero, transposition); other columns for that row are normal | Correct if confident, else set to missing |
| 2 | **Measurement / system error** | The system recorded it wrong | Sentinels; values at a system limit; clustering at a suspicious constant | Set to missing; investigate the source |
| 3 | **Legitimate rare observation** | Genuinely unusual, genuinely real | Value is possible; other columns are consistent with it; a plausible story exists | **Keep.** Possibly flag or cap for specific models |
| 4 | **Important business case** | Rare, real, and disproportionately valuable | The business recognises this segment | Keep, and possibly analyse separately |
| 5 | **Distribution characteristic** | Not an anomaly at all — just the tail of a skewed variable | The whole column is skewed; many "outliers" form a smooth tail | Keep. Consider transforming the variable, not deleting the points |

Note how often the answer is *keep*. Types 1 and 2 are errors; types 3, 4 and 5
are data. A method that flags all five identically is telling you where to look,
not what to do.

### Detection methods and their intuitions

**IQR rule.** Flags points more than 1.5× the interquartile range beyond the
quartiles. *Intuition:* measure the spread of the middle half, then flag points
far outside it. *Strength:* uses quartiles, so the extremes do not affect the
thresholds. *Weakness:* on a strongly right-skewed variable it flags a large part
of a perfectly normal tail.

**Z-score.** Flags points more than k standard deviations from the mean.
*Intuition:* how many typical-sized steps from the centre is this?
*Strength:* simple, interpretable. *Weakness:* the mean and standard deviation
are themselves distorted by the outliers you are hunting — a severe extreme value
inflates the standard deviation and thereby hides itself. Only sensible on
roughly symmetric data.

**Percentile / quantile.** Treat everything beyond, say, the 1st and 99th
percentiles as extreme. *Intuition:* define "rare" by frequency alone.
*Strength:* distribution-agnostic, easy to explain. *Weakness:* always flags
exactly that share of the data, whether or not anything unusual exists.

**Visual inspection.** Box plots, histograms, scatter plots. *Strength:* the only
method that shows you *structure* — whether the extremes are a smooth tail, a
detached cluster, or a handful of isolated points. That distinction is what
determines the treatment, and no coefficient reports it. **Always do this.**

**Domain knowledge.** Is this value possible in the real world? *Strength:* the
only method that can distinguish "impossible" from "extreme". No statistical
method can tell you a human cannot be 200 years old. This is why Phase 1 asked
you to declare legal ranges in advance.

### The right order

1. **Detect** with a method (or several — they disagree, and the disagreement is informative).
2. **Look** at the actual rows. Read them. All the columns, not just the flagged one.
3. **Classify** using the five-way table.
4. **Decide** per class, not per column.
5. **Document** every decision and its rationale.
6. **Quantify the impact** — how do your key statistics change with and without
   these points? If nothing changes, the debate was unimportant. If everything
   changes, that fact belongs in your report.

### Treatment options beyond deletion

- **Keep as-is** — the default, and the right answer more often than beginners expect
- **Flag** — add a boolean feature marking the row as extreme; keeps the
  information while letting a model treat it specially
- **Cap / winsorise** — pull extremes to a percentile threshold; keeps the row
  and its rank, reduces its leverage
- **Transform** — a log-style transform compresses a long tail so the extremes
  stop dominating, without discarding anything
- **Set to missing** — the honest choice when a value is clearly wrong but the
  true value is unrecoverable; then handle it with your imputation strategy
- **Analyse separately** — if the extremes form a real segment, they may deserve
  their own model or their own section in the report
- **Remove** — the last resort, for confirmed errors, always documented with a count

### Impact on other analyses

Extreme values do not stay in their own column. They inflate the mean and
standard deviation, dominate any scaling you apply, distort linear correlation
(often severely — a handful of points out of thousands is enough), pull
regression lines, and dominate distance-based models. This is precisely why
Phase 10 asks you to compare linear and rank-based correlation: the gap between
them is a direct measurement of how much your extremes are interfering.

---

# A6. REFERENCE: CORRELATION

### The intuition

Correlation measures whether two variables move together, and how consistently.

- **Positive:** when one goes up, the other tends to go up.
- **Negative:** when one goes up, the other tends to go down.
- **Near zero:** no consistent *linear* relationship — note the qualifier.

The *magnitude* (0 to 1) is the consistency of the pattern, not its steepness. A
correlation of 0.9 says the relationship is very consistent. It says nothing
about whether the effect is large or business-relevant.

### Rough magnitude conventions

| |r| | Conventional reading |
| --- | -------------------- |
| 0.0 – 0.1 | Negligible |
| 0.1 – 0.3 | Weak |
| 0.3 – 0.5 | Moderate |
| 0.5 – 0.7 | Strong |
| 0.7 – 0.9 | Very strong |
| 0.9 – 1.0 | Near-redundant |

These are conventions, not laws, and they vary by field. In noisy human-behaviour
data, 0.3 can be a genuinely useful signal.

### Pearson vs Spearman

**Pearson** measures *linear* association — how close the points lie to a
straight line. It uses the actual values, so it is sensitive to extreme values
and assumes a roughly linear relationship.

**Spearman** measures *monotonic* association — whether one variable consistently
increases as the other does, regardless of the shape of the curve. It works on
ranks, so it is robust to extreme values and detects curved-but-consistent
relationships.

**Always compute both.** The comparison is more informative than either number
alone:

| Pattern | What it means |
| ------- | ------------- |
| Both high | Strong, roughly linear relationship |
| Both near zero | Probably no monotonic relationship (could still be U-shaped — plot it) |
| **Pearson low, Spearman high** | A strong relationship that is either non-linear-but-monotonic, or being masked by a few extreme values. **Investigate — this is where discoveries hide.** |
| Pearson high, Spearman lower | The linear estimate may be driven by a small number of influential points |

The third row is the one to watch for. A low Pearson value is the single most
common reason analysts wrongly conclude "these variables are unrelated" and move
on. A handful of extreme points among thousands of rows is enough to produce it.

### Correlation ≠ causation

Three alternative explanations for any observed association:

1. **Reverse causation** — B causes A, not A causes B.
2. **Confounding** — C causes both A and B; the A–B link is an artefact.
3. **Coincidence** — with enough variable pairs, some will correlate by chance.

Additionally, association can be created or destroyed by how you slice the data:
a relationship present in every subgroup can reverse when the groups are pooled.
Whenever an aggregate relationship surprises you, check whether it holds within
the relevant subgroups.

### Multicollinearity

When features are strongly correlated with each other:

- Linear model coefficients become unstable — small data changes swing them
  wildly, and signs can flip
- Feature-importance rankings become arbitrary between the correlated members
- Explanations to stakeholders become unreliable
- Predictive *accuracy* is often barely affected — this is why it is easy to miss

Tree-based models are much less troubled by it, though importance scores are
still split arbitrarily between correlated features.

**Detection:** correlation matrix as a first pass; variance inflation factors for
a more rigorous treatment (introduced in a later project).

**Resolution:** drop one (keep the more interpretable, more complete, or more
actionable one), combine them into a single engineered feature, or keep both and
accept the interpretability cost. All are defensible; document which and why.

### What correlation cannot do

- Handle categorical variables — use group comparisons instead
- Detect non-monotonic relationships such as U-shapes (both coefficients can be
  near zero while the relationship is strong and obvious in a plot)
- Tell you about relationships that only exist within subgroups
- Establish causal direction
- Replace looking at a scatter plot

> **The rule:** never report a correlation you have not plotted.

---

# A7. REFERENCE: TARGET-ORIENTED EDA

### The shift

Generic EDA asks: *"what does this variable look like?"*
Target-oriented EDA asks: **"how does this variable relate to what I am trying to
predict?"**

Both matter — you need the first to interpret the second — but only the second
produces a feature shortlist. The transition from the first mindset to the second
is essentially what this project is training.

### The universal question

For every feature: **does knowing this change my expectation of the target?**

If the churn rate is 30% overall, but 55% among members with property X and 12%
among those without, then X carries information. If it is 30% in both groups, X —
on its own — does not.

### Numerical → target (binary)

Two complementary directions, and you should do both:

**Direction 1: split the feature by the target.** Compare the feature's
distribution for churners versus non-churners. Tools: side-by-side box plots,
overlaid density plots, per-class summary statistics. *Reveals:* whether the two
groups are drawn from visibly different distributions, and how much they overlap.
Overlap is the honest picture of how separable the classes are.

**Direction 2: bin the feature and compare target rates.** Cut the feature into
quantile bins and compute the churn rate in each. *Reveals:* the shape of the
relationship — monotonic, flat, U-shaped, or stepped — which the first direction
cannot show you. Use quantile bins rather than equal-width bins on skewed data,
so that every bin holds a usable number of observations.

Direction 2 is under-used by beginners and is usually the more informative of the two.

### Categorical → target (binary)

Compute the target rate per level — and **always** report the count per level
beside it. Compare each level against the overall base rate. Look at the spread
between the highest and lowest level.

The trap is small groups. A level with 8 members can show a churn rate of 0% or
75% purely by chance, and it will look like your most dramatic finding. Sort your
results by group size as well as by rate, and distrust anything computed on a
handful of rows.

### Time → target

- Target rate by signup period: is the relationship stable, or drifting?
- Target rate by tenure band: how does risk evolve over a membership's life?
- Is there seasonality in signups, and does cohort quality vary with it?

Temporal structure matters for two reasons beyond the findings themselves: drift
means a random train/test split will flatter your model, and time is the
dimension along which leakage usually enters.

### Feature → feature → target (interaction)

An interaction exists when the effect of one feature *depends on the level of
another*. For example, distance might matter enormously for casual members and
not at all for committed ones. Neither feature alone shows this.

**How to look:** build a two-way table of target rate across combinations of two
features, ideally as a heatmap, with counts shown. If the pattern across one
feature's levels *changes shape* depending on the other feature's level, you have
an interaction.

**Why it matters:** linear models cannot represent interactions unless you
engineer them explicitly. Tree-based models capture them automatically. Finding
one is therefore both a feature-engineering opportunity and an argument about
model choice.

### The ranking table

The consolidated output of target-oriented EDA is a single table covering every
feature:

```text
feature | type | association strength | direction | monotonic? | smallest group n | mechanism plausible? | leakage risk
```

Sorted by strength, this is your feature shortlist, your report backbone, and
your handover document. Build it.

---

# A8. REFERENCE: EDA → MACHINE LEARNING

The point of every finding is the decision it changes. This chapter is the
lookup table from one to the other.

| EDA finding | ML consequence | Typical decision |
| ----------- | -------------- | ---------------- |
| Missing values, MCAR | Rows or values unusable as-is | Simple imputation (median for skewed, mean for symmetric) |
| Missing values, MAR | Global imputation introduces bias | Group-wise or model-based imputation |
| Missing values, MNAR | Imputation destroys signal | Impute **and** add a missing-indicator feature |
| Missing target | Row cannot supervise training | Exclude from training; investigate why first |
| Exact duplicates | Inflated sample; train/test contamination | Remove before splitting |
| Entity duplicates | Same person in train and test | Group-aware splitting, or merge |
| Impossible values | Corrupt statistics and scaling | Set to missing or correct; document |
| Sentinel values | Silently averaged as real numbers | Convert to missing before any numeric work |
| Inconsistent labels | Fragmented one-hot columns; diluted signal | Standardise deliberately, after inspection |
| High cardinality | One-hot explosion; sparse features | Grouping, frequency/target encoding, or embeddings |
| Rare categories | Unstable estimates; unseen levels at inference | Group into "Other"; ensure the encoder handles unseen levels |
| Strong skew | Distorts linear/distance-based models; mean is misleading | Log-style transform (for models that care); use median statistics |
| Zero-inflation | One column mixes two behaviours | Engineer a binary "any?" flag plus the amount |
| Bimodality | A hidden segment | Find the splitting variable; consider segment features or separate models |
| Wide scale differences | Distance and gradient methods dominated by large-scale features | Standardise or normalise — inside a pipeline, fitted on training data only |
| Extreme values (genuine) | High leverage on linear models | Robust models, capping, transformation, or a flag feature |
| Extreme values (errors) | Corrupt everything | Correct or set to missing |
| Class imbalance | Accuracy becomes meaningless | Use precision/recall/F1/PR-AUC; consider class weights or resampling |
| High feature-feature correlation | Unstable coefficients; unreliable importances | Drop, combine, or accept with documentation |
| Non-linear feature-target relationship | Linear models underfit it | Binning, splines, polynomial terms, or a tree-based model |
| Interaction effects | Linear models miss them | Engineer interaction features, or use trees |
| Target rate drifting over time | Random split is optimistic | Time-based split; monitor drift in production |
| Feature known only post-outcome | Leakage | Exclude from the feature set; keep for retrospective analysis |
| Feature with no target relationship | Adds noise and dimensions | Candidate for removal; verify it is not a useful interaction partner first |
| Identifier column | Fake signal that will not generalise | Drop |
| Constant column | Zero information | Drop; note the scope limitation it implies |

### The preprocessing-order rule

Worth internalising now, even though you are not modelling yet:

> Split first. Then fit every transformation on the training data only, and apply
> it to the validation and test data.

Imputation values, scaling parameters, encoding maps, and binning edges are all
*learned* from data. Learning them from the full dataset lets information from
your test set influence your training — a subtle, extremely common form of
leakage that makes your evaluation optimistic. Pipelines exist to make this
correct by construction.

Your EDA is exempt: you explore the whole dataset, because you are trying to
understand it, not to estimate performance. The rule applies to the *modelling
pipeline* you recommend, and it is worth stating explicitly in your report.

---

# A9. REFERENCE: DATA LEAKAGE

### The definition

**Leakage is information in your training data that would not be available at the
moment of prediction in the real world.**

### Why it is the most dangerous error in applied ML

Every other mistake announces itself. A bad model performs badly, and you go and
fix it. Leakage produces a model that performs *brilliantly* in every test you
run and then fails completely in production — and because the offline metrics
looked so good, nobody suspects the data. Teams have shipped leaking models,
celebrated them, and discovered the problem months later.

Outstanding performance should therefore increase your suspicion, not your
confidence. That is a genuinely unnatural reflex, and it has to be trained
deliberately.

### Types

**1. Target leakage.** A feature contains information derived from, or caused by,
the outcome. The classic shape: a value that only gets populated as part of the
process that *follows* the outcome. Ask: *would this field have a value for
someone who has not yet had the outcome?*

**2. Temporal leakage.** A feature's value is measured after the prediction point.
Anything aggregated over a window that extends past the moment you would be
making the prediction qualifies, even if the feature is innocent in principle.

**3. Train-test contamination.** The same entity appears in both training and
test sets — through duplicates, entity duplicates, or repeated measurements of
one subject. The model memorises rather than generalises, and the test set cannot
detect it.

**4. Preprocessing leakage.** Transformations fitted on the full dataset before
splitting. Discussed in § A8.

**5. Proxy leakage.** The subtlest. No single feature is post-outcome, but a
combination or a derived value encodes the answer — an internal account status
code, a flag set by a downstream workflow, an ID range that happens to correlate
with a cohort.

### How EDA detects it

1. **The known-at audit.** For every feature, record when its value becomes
   known relative to the prediction moment. This is the primary defence, and it
   is why Phase 1 asks for it before you have even opened the file.
2. **Suspicion of strength.** Any feature that separates the classes far better
   than its business mechanism could plausibly explain.
3. **Mechanism testing.** For each strong predictor, state the causal story out
   loud. If you cannot tell a plausible one that runs *forwards in time*, be
   suspicious.
4. **Availability testing.** Ask: for a member I want to score tomorrow, does
   this field have a meaningful value today?
5. **Process archaeology.** Ask whoever built the table which system each column
   comes from and what triggers it to be written. Most leakage is discovered by a
   conversation, not a computation.

### The decision test

For every feature, answer all four:

```text
1. Is this value known BEFORE the outcome occurs?
2. Is this value UNAFFECTED by the outcome?
3. Would this value EXIST for a currently-active member?
4. Can I tell a forward-in-time causal story for why it predicts the target?
```

Four yeses → usable. Any no → investigate, and probably exclude.

### The grey zone

Not every case is clear-cut. Some features are *partially* influenced by the
outcome — legitimate signal entangled with circularity. Consider a duration-type
feature that stops accumulating when someone leaves: it is not purely
post-outcome, but its value is shaped by the outcome having occurred.

Reasonable practitioners handle these differently:
- Exclude it, accepting the loss of a real signal
- Redefine it relative to a fixed reference point, so it means the same thing for
  everyone regardless of outcome
- Restrict the analysis to a fixed observation window, so every member is
  measured over a comparable period

There is no universally correct answer. What is *not* acceptable is failing to
notice. Identify the grey-zone features, state the ambiguity plainly, choose an
approach, and explain your reasoning so a reviewer can disagree productively.

### A closing warning

An excluded leaky feature is not a worthless one. It usually describes something
real about how the business operates, and it can be genuinely valuable for
retrospective analysis. Report it, explain it, and exclude it from the *model*.
Deleting it quietly means the next analyst rediscovers it and repeats the mistake.

---
---

# 19. FINAL EDA REPORT SPECIFICATION

Write `reports/EDA_REPORT.md` with the following 17 sections. For each, this
specification tells you what to write, what makes an answer strong, and what to
avoid. It does **not** tell you what you will find.

Target length: 1,500–3,000 words plus tables and selected figures.

---

**1. Problem Statement**
*Write:* The business problem and the ML framing in a few sentences. Target
variable, unit of observation, prediction task.
*Strong:* Precise about *when* the prediction would be made and what decision it
supports.
*Avoid:* Restating the brief verbatim.

**2. Business Context**
*Write:* Why retention matters here, what decision your analysis informs, who
acts on it.
*Strong:* Connects analysis to a concrete action someone could take on Monday.
*Avoid:* Generic filler about the fitness industry.

**3. Dataset Overview**
*Write:* Shape, time span covered, column roles, what one row represents and how
you verified it.
*Strong:* States limitations of scope — what population this data does and does
not represent.
*Avoid:* Pasting the raw dtype listing.

**4. Data Quality Assessment**
*Write:* Your issues log — every defect found, with counts, severity, and evidence.
*Strong:* Organised by severity, with the impact of each issue on analysis stated.
*Avoid:* Listing issues without quantifying them; mixing findings with fixes.

**5. Univariate Analysis — Numerical**
*Write:* Distribution summary per variable: centre, spread, shape, tails.
*Strong:* Groups variables by shared behaviour rather than marching through them
one by one; states the modelling implication of each shape.
*Avoid:* One paragraph per variable that just reads the summary table aloud.

**6. Univariate Analysis — Categorical**
*Write:* Composition, cardinality, balance, rare levels per variable.
*Strong:* Flags levels too small to support conclusions, with their counts.
*Avoid:* Percentages without counts.

**7. Multivariate / Feature Relationships**
*Write:* Correlation findings, redundancy, confounding, interactions.
*Strong:* Explains *why* two features are related, not just that they are;
includes both correlation methods and explains any disagreement.
*Avoid:* A heatmap with no commentary.

**8. Target Analysis**
*Write:* Base rate, class balance, target behaviour over time and tenure.
*Strong:* Draws out the evaluation-metric consequences explicitly.
*Avoid:* A single sentence stating the churn rate.

**9. Important Relationships (Feature → Target)**
*Write:* Your ranked feature-vs-target table plus narrative on the top findings.
*Strong:* Every claim carries an effect size *and* a sample size; includes the
features that turned out **not** to matter.
*Avoid:* Only reporting the exciting ones. Negative results are results.

**10. Outlier Analysis**
*Write:* Extremes found, how you classified them (§ A5), what you decided, and why.
*Strong:* Shows the impact of the extremes on key statistics, with and without.
*Avoid:* "Removed outliers using IQR" as a complete account.

**11. Missing Data Analysis**
*Write:* Patterns, hypothesised mechanisms, evidence, and your proposed handling.
*Strong:* Evidence-backed reasoning about mechanism, not just percentages.
*Avoid:* A null-count table with no interpretation.

**12. Key Findings**
*Write:* Your 5–8 most important findings, one paragraph each, most important first.
*Strong:* Each is a specific, quantified, decision-relevant statement that a
stakeholder could act on.
*Avoid:* Vague findings ("engagement is important"); burying the biggest one.

**13. Data Cleaning Decisions**
*Write:* Every cleaning action, with rows affected and the justification.
*Strong:* Reproducible — a reader could re-execute your plan exactly.
*Avoid:* Undocumented changes; cleaning presented without reasoning.

**14. Feature Engineering Ideas**
*Write:* Proposed features, each tied to the specific finding that motivated it.
*Strong:* Each proposal names the finding it comes from and the mechanism it captures.
*Avoid:* A generic list of transformations unconnected to your analysis.

**15. Potential ML Risks**
*Write:* Leakage findings, imbalance, drift, duplicate contamination, small
groups, redundancy.
*Strong:* Ranked by severity, each with a concrete mitigation.
*Avoid:* Omitting leakage, or mentioning it without naming the feature and the
reasoning.

**16. Modelling Recommendations**
*Write:* Feature shortlist, preprocessing pipeline, model families worth trying,
evaluation metric, validation strategy.
*Strong:* Every recommendation traces back to a stated finding.
*Avoid:* Recommendations that contradict your own analysis; naming an algorithm
with no justification.

**17. Conclusion**
*Write:* What you now know, what you still do not, and what you would do next.
*Strong:* Honest about limitations; specific about next steps and what data you
would want.
*Avoid:* "Further analysis is needed" with no specifics.

### Report writing standards

- Every rate has a sample size next to it
- Every claim has evidence, or is explicitly labelled a hypothesis
- Observation, interpretation, and action are visibly separated (§ A2)
- Figures are captioned and referenced from the text
- Only include a figure that carries a finding
- A non-technical reader can follow sections 1, 2, 12, and 17

---

# 20. SELF-CHECK BEFORE SUBMITTING

Tick every box honestly. Untick anything you are unsure about and go back.

**Understanding**
- [ ] I can state what one row represents, and I verified it from the data
- [ ] I know the base rate of the target by heart
- [ ] I made written predictions in Phase 1 and compared them against my results
- [ ] I have a "known-at" answer for all 20 features

**Data quality**
- [ ] I checked min and max of every numerical column against a pre-declared legal range
- [ ] I listed the complete distinct values of every categorical column
- [ ] I checked for duplicates three ways: full row, identifier, business key
- [ ] I searched for sentinel values, not just nulls
- [ ] I compared missing vs non-missing subgroups against the target
- [ ] I checked at least two cross-column consistency rules

**Analysis**
- [ ] Every numerical variable has been plotted at least once
- [ ] I looked at percentiles beyond the default quartiles
- [ ] Every feature has been checked against the target — including the boring ones
- [ ] I computed both linear and rank-based correlation and investigated the gaps
- [ ] I investigated at least one interaction
- [ ] Every group rate I report has its group size beside it

**Judgement**
- [ ] I classified extreme values rather than deleting them
- [ ] I completed the leakage decision test for every feature
- [ ] I can justify every cleaning decision with evidence
- [ ] Every column appears in my decision register
- [ ] I reported findings that contradicted my expectations
- [ ] I reported at least one feature that does *not* predict the target

**Communication**
- [ ] Restart-and-run-all works in my notebook
- [ ] My notebook has prose, not just code
- [ ] My report has all 17 sections
- [ ] Someone who has not seen the data could act on my report
- [ ] I answered every STOP & THINK in writing

---

# 21. SUBMISSION INSTRUCTIONS

When you are done, submit by telling your mentor:

```text
Project 1 complete. Here is my work:
- notebooks/eda.ipynb
- reports/EDA_REPORT.md
```

Then, in your own words and **without** re-reading your notebook:

1. State your three most important findings.
2. State the single most dangerous thing about this dataset for a modelling team.
3. State one thing you expected to find and did not.
4. State one decision you are genuinely unsure about, and the argument on both sides.

You will be evaluated against § 22, and you will receive:

- **What I Did Well**
- **Mistakes**
- **Conceptual Weaknesses**
- **EDA Habits To Improve**
- **Concepts To Revise**
- **Skills Demonstrated**
- **Readiness For Next Project**

Project 2 is released once Project 1 is reviewed. It introduces substantially
messier data and shifts the emphasis toward cleaning judgement under uncertainty.

### If you get stuck

1. Re-read the relevant phase and its reference chapter.
2. Use Hint 1, then 2, then 3 — in that order, with real attempts in between.
3. Only then ask. When you ask, ask a *specific* question: "I found X, I think it
   means Y, but Z doesn't fit — what am I missing?" is a good question. "What
   should I do next?" is answered by this guide.

---

# 22. EVALUATION RUBRIC

| Skill | Weight | What earns a high score |
| ----- | -----: | ----------------------- |
| Business Understanding | /10 | Frames analysis around the decision; connects findings to actions |
| Dataset Understanding | /10 | Correct roles, verified unit of observation, understands what data can and cannot support |
| Data Quality Investigation | /10 | Systematic across all five dimensions; finds subtle defects; investigates before fixing |
| Univariate Analysis | /10 | Describes shape and tails, not just centre; plots everything; notes modelling implications |
| Bivariate Analysis | /10 | Covers every feature; reports effect sizes with sample sizes; includes null results |
| Multivariate Analysis | /10 | Finds redundancy and confounding; investigates interactions; both correlation methods |
| Visualisation | /10 | Question-driven, labelled, honest, uncluttered; no decorative plots |
| Statistical Reasoning | /10 | Distrusts small samples; understands skew, base rates, and the limits of correlation |
| Insight Quality | /10 | Findings are specific, quantified, non-obvious, and decision-relevant |
| ML Connection | /10 | Every finding traced to a decision; leakage identified and reasoned about |
| Code Quality | /10 | Reproducible, readable, no mutation of the raw frame, sensible structure |
| Communication | /10 | Report is clear, ordered by importance, honest about limitations |

**Total: /120**

| Band | Meaning |
| ---- | ------- |
| 100–120 | Professional standard. Ready for Project 3 concepts. |
| 80–99 | Strong. Ready for Project 2. |
| 60–79 | Solid foundation with gaps. Ready for Project 2 with targeted revision. |
| 40–59 | Key habits missing. Revisit specific phases before continuing. |
| < 40 | Rework Project 1 with the self-check in § 20 open beside you. |

### Automatic deductions

Regardless of everything else:

- **Removing data without documented justification** — the cardinal sin
- **Reporting a group rate without its group size**
- **Concluding "no relationship" from a linear correlation alone**
- **Shipping a leaky feature in the recommended shortlist**
- **A notebook that does not run top to bottom**

---

# 23. QUESTIONS YOU SHOULD BE ABLE TO ANSWER

When Project 1 is complete, you should be able to answer all of these from your
own work, without looking anything up. If any of them stump you, the relevant
phase is unfinished.

**About the data**
1. What does one row represent, and how do you know?
2. How many members are in this dataset? (Careful — this is not the row count.)
3. Which columns cannot be used as features at all, and why?
4. What is the base rate of churn?
5. What time period does this data cover?

**About quality**
6. Which column has the most serious data-quality problem, and what is it?
7. Which missing-value pattern is informative, and what evidence supports that?
8. How many rows would you remove, and what would that cost you?
9. Which categorical column required the most cleaning, and why?
10. Which numerical column contains values that are impossible rather than merely extreme?

**About relationships**
11. What are the three strongest predictors of churn, and by how much?
12. Which feature that you expected to matter does not?
13. Which two features are largely redundant, and how did you detect it?
14. Where did linear and rank-based correlation disagree, and why?
15. Which feature-target relationship is non-linear, and what does that imply for model choice?

**About ML**
16. Which feature must never reach the model, and what is your reasoning?
17. Which features would you engineer, and from which findings?
18. What evaluation metric would you use, and why not accuracy?
19. Should the train/test split be random or time-based? Defend it.
20. What is the single biggest risk to a model built on this data?

**About judgement**
21. Which decision in your analysis are you least confident about?
22. What would you want to know that this dataset cannot tell you?
23. If the business could collect one additional column, what should it be?

---

> **A final word.**
>
> The goal of this project is not a clean dataset or a folder of plots. It is to
> replace *"which command do I run?"* with *"what do I need to understand, why
> does it matter, how do I investigate it, and what does the answer change?"*
>
> That question generalises to every dataset you will ever see. The commands do not.
>
> Take your time. Write things down. Plot before you conclude. Investigate before
> you clean. And be suspicious of anything that looks too good.
>
> Good luck.
