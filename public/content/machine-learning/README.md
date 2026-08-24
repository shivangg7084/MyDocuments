# Data Science / ML / DL / NLP / MLOps / Data Engineering — Interview Prep

A curated set of **300 interview questions (50 per category)** to prepare for Data Science, Machine Learning, Deep Learning, NLP, MLOps, and Data Engineering roles at product-based companies.

## Table of Contents
1. [Data Science](#1-data-science)
2. [Machine Learning](#2-machine-learning)
3. [Deep Learning](#3-deep-learning)
4. [NLP](#4-nlp)
5. [MLOps](#5-mlops)
6. [Data Engineering](#6-data-engineering)

---

## 1. Data Science


---

# 1. Central Limit Theorem (CLT)

## What is the Central Limit Theorem?

The **Central Limit Theorem** says:

> If we repeatedly take sufficiently large random samples from a population, the distribution of the **sample mean** will become approximately normally distributed, regardless of the original population's distribution, provided certain conditions are satisfied.

This is one of the most important ideas in statistics because it allows us to use **normal-distribution-based methods** even when the original data is not normally distributed.

---

## Simple intuition

Suppose the population contains people's incomes:

```text
Population:
₹10k, ₹12k, ₹15k, ₹18k, ₹20k, ₹25k, ₹100k, ...
```

Income is usually **right-skewed**, not normally distributed.

Now:

1. Randomly select 30 people.
2. Calculate their average income.
3. Repeat this thousands of times.
4. Plot all those sample averages.

You will generally get something resembling:

```text
             *
           *   *
         *       *
       *           *
     *               *
----*-----------------*----
             μ
```

The **individual incomes are not normally distributed**, but the **sample means approximately are**.

---

## Mathematical statement

Suppose:

```text
X₁, X₂, ..., Xₙ
```

are independent observations from a population with:

```text
Mean = μ
Variance = σ²
```

The sample mean is:

[
\bar X = \frac{X_1+X_2+\cdots+X_n}{n}
]

As (n) becomes sufficiently large:

[
\bar X \approx N\left(\mu,\frac{\sigma^2}{n}\right)
]

Therefore:

[
E[\bar X] = \mu
]

and

[
Var(\bar X)=\frac{\sigma^2}{n}
]

The standard deviation of the sampling distribution is:

[
SE(\bar X)=\frac{\sigma}{\sqrt n}
]

This is called the **Standard Error**.

---

## Why does CLT matter in practice?

Because it allows us to:

* construct confidence intervals
* perform hypothesis tests
* estimate population parameters
* perform A/B testing
* estimate average treatment effects
* conduct statistical inference
* make conclusions about populations using samples

---

## Example: A/B testing

Suppose an e-commerce website wants to know whether a new checkout page increases average order value.

You collect:

```text
Control group → 10,000 users
Treatment group → 10,000 users
```

You calculate the average order value of each group.

Even if individual purchases are highly skewed:

```text
₹100
₹150
₹200
₹500
₹10,000
₹50,000
...
```

the distribution of the **sample mean** can still be approximately normal for sufficiently large samples.

This allows us to calculate:

```text
Difference in means
Confidence interval
p-value
Statistical significance
```

---

## Important distinction

CLT does **not** say:

> The original data becomes normally distributed.

It says:

> The distribution of a statistic, particularly the sample mean, becomes approximately normal as sample size increases.

This distinction is extremely important in interviews.

---

## Conditions / assumptions

The classical CLT requires conditions such as:

### 1. Random sampling

The sample should reasonably represent the population.

### 2. Independence

Observations should be independent, or dependence should be appropriately handled.

### 3. Finite variance

The underlying distribution should generally have finite variance for the standard CLT formulation.

### 4. Sufficient sample size

There is no universal number.

A common rule of thumb is:

```text
n ≥ 30
```

but this is **not a law**.

If the population is extremely skewed or heavy-tailed, you may need a much larger sample.

---

## CLT vs Law of Large Numbers

| CLT                                           | Law of Large Numbers                        |
| --------------------------------------------- | ------------------------------------------- |
| Describes distribution of sample statistics   | Describes convergence of sample averages    |
| Says sample mean becomes approximately normal | Says sample mean approaches population mean |
| Useful for inference                          | Useful for consistency                      |
| Gives approximate distribution                | Gives limiting behavior                     |

---

## Interview answer

> The Central Limit Theorem states that for sufficiently large random samples, the sampling distribution of the sample mean approaches a normal distribution, regardless of the population's original distribution, assuming appropriate conditions such as independence and finite variance. This matters because it allows us to perform statistical inference, construct confidence intervals, and conduct hypothesis tests using approximate normality.

---

# 2. Type I and Type II Errors

Whenever we perform hypothesis testing, we make a decision about a population based on sample evidence.

We define:

```text
H₀ = Null hypothesis
H₁ = Alternative hypothesis
```

There are four possible combinations.

| Reality  | Decision        | Result        |
| -------- | --------------- | ------------- |
| H₀ true  | Don't reject H₀ | Correct       |
| H₀ true  | Reject H₀       | Type I error  |
| H₀ false | Don't reject H₀ | Type II error |
| H₀ false | Reject H₀       | Correct       |

---

# Type I Error

A **Type I error** occurs when:

> We reject the null hypothesis even though it is actually true.

In simple language:

> **False positive.**

---

## Example

Suppose:

```text
H₀: New drug has no effect.
H₁: New drug has an effect.
```

Reality:

```text
Drug actually has no effect.
```

But our statistical test says:

```text
Reject H₀
```

We incorrectly conclude that the drug works.

That's a **Type I error**.

---

## Significance level α

The probability of Type I error is represented by:

[
\alpha
]

Common values:

```text
α = 0.05
α = 0.01
α = 0.10
```

If:

[
\alpha=0.05
]

we accept a 5% significance level for the Type I error under the test's assumptions.

---

# Type II Error

A **Type II error** occurs when:

> We fail to reject the null hypothesis even though it is false.

In simple language:

> **False negative.**

---

## Example

Reality:

```text
Drug actually works.
```

Our test says:

```text
Don't reject H₀.
```

We incorrectly conclude that there isn't enough evidence that the drug works.

That's a **Type II error**.

The probability is represented by:

[
\beta
]

---

# Statistical Power

Power is:

[
Power=1-\beta
]

It represents the probability of detecting an effect when a real effect exists.

For example:

```text
β = 0.20
```

Then:

[
Power=1-0.20=0.80
]

So the test has **80% power**.

---

## How do we increase power?

Generally:

### Increase sample size

[
n\uparrow \Rightarrow SE\downarrow \Rightarrow Power\uparrow
]

### Increase effect size

A larger real effect is easier to detect.

### Reduce noise / variability

Less variability makes effects easier to detect.

### Increase α

Using:

```text
α = 0.05 → α = 0.10
```

can increase power, but also increases the probability of Type I error.

---

## Medical example

Imagine a cancer screening test.

```text
Reality:
Cancer present
Cancer absent
```

Test result:

```text
Positive
Negative
```

### Type I error

Person doesn't have cancer but test says:

```text
Positive
```

False positive.

### Type II error

Person has cancer but test says:

```text
Negative
```

False negative.

---

## Important interview distinction

```text
Type I  → False Positive → α
Type II → False Negative → β
Power   → 1 - β
```

---

# 3. What is a p-value?

The p-value is one of the **most misunderstood concepts in statistics**.

## Definition

A p-value is:

> The probability, assuming the null hypothesis is true, of obtaining a test statistic at least as extreme as the one observed.

Mathematically:

[
p=P(\text{data at least as extreme as observed}\mid H_0)
]

---

## Example

Suppose:

```text
H₀: New model has the same average accuracy as old model.
H₁: New model has different accuracy.
```

We perform a statistical test and get:

```text
p = 0.02
```

If:

```text
α = 0.05
```

then:

```text
0.02 < 0.05
```

Therefore:

```text
Reject H₀
```

We have statistically significant evidence against the null hypothesis.

---

# What p-value does NOT mean

### Wrong interpretation #1

> "There is a 2% probability that H₀ is true."

❌ Wrong.

The p-value assumes (H_0) is true.

It does **not** calculate:

[
P(H_0|data)
]

---

### Wrong interpretation #2

> "p = 0.02 means there is a 98% probability that H₁ is true."

❌ Wrong.

---

### Wrong interpretation #3

> "A small p-value means the effect is large."

❌ Wrong.

A tiny effect can have a very small p-value if the sample size is huge.

---

## Statistical significance vs practical significance

Suppose:

```text
Old model accuracy = 90.00%
New model accuracy = 90.01%
```

With millions of observations:

```text
p < 0.001
```

The difference may be statistically significant.

But practically:

```text
Improvement = 0.01 percentage points
```

Maybe the improvement isn't useful enough to justify deployment costs.

Therefore always distinguish:

```text
Statistical significance
        vs
Practical significance
```

---

# p-value and α

Usually:

```text
p < α
```

→ Reject (H_0)

```text
p ≥ α
```

→ Fail to reject (H_0)

Notice the phrase:

> **Fail to reject**

rather than:

> Accept H₀

Because a non-significant result doesn't prove the null hypothesis is true.

---

# Example

Suppose:

```text
H₀: Average delivery time = 30 minutes
H₁: Average delivery time ≠ 30 minutes
```

Result:

```text
p = 0.03
α = 0.05
```

Therefore:

```text
0.03 < 0.05
```

Reject (H_0).

We have evidence that the average delivery time differs from 30 minutes.

---

# 4. Correlation vs Causation

## Correlation

Correlation measures the degree to which two variables move together.

For Pearson correlation:

[
-1\le r\le1
]

where:

```text
r = +1 → Perfect positive correlation
r =  0 → No linear correlation
r = -1 → Perfect negative correlation
```

---

## Example

Suppose:

```text
Temperature ↑
Ice cream sales ↑
```

There is positive correlation.

But does eating ice cream cause higher temperature?

Obviously:

```text
No.
```

A third variable exists:

```text
Temperature
     ↓
 ┌───┴────┐
 ↓        ↓
Ice cream  Cold drinks
sales
```

Temperature is a **confounding variable**.

---

# Causation

Causation means:

> Changing X actually produces a change in Y.

Example:

```text
Smoking → increases risk of lung cancer
```

Here we have evidence of a causal relationship.

---

# The classic correlation ≠ causation example

Suppose data shows:

```text
Number of firefighters ↑
        ↓
Fire damage ↑
```

They are positively correlated.

Does that mean:

> Firefighters cause more damage?

No.

The actual relationship is:

```text
Fire severity
   ↓       ↓
Firefighters  Damage
```

A larger fire requires more firefighters and also causes more damage.

---

# Confounding variable

A confounder is a variable that affects both variables being studied.

Example:

```text
Ice cream sales
      ↑
      |
Temperature
      |
      ↓
Drowning incidents
```

Temperature affects both.

---

# Correlation coefficient

Pearson correlation:

[
r=\frac{Cov(X,Y)}{\sigma_X\sigma_Y}
]

Important:

> Correlation measures association, not necessarily causation.

---

# How can we establish causality?

Common approaches include:

### Randomized controlled experiments

Randomly assign subjects to:

```text
Control
Treatment
```

Randomization helps break systematic differences between groups.

### A/B testing

Very common in Data Science.

```text
Users
 ↓
Random assignment
 ↙      ↘
A        B
 ↓        ↓
Metric A  Metric B
```

### Causal inference

Methods include:

* randomized experiments
* instrumental variables
* difference-in-differences
* regression discontinuity
* propensity scores
* causal graphs / DAGs

---

# 5. Population vs Sample Variance

Variance measures how spread out observations are around the mean.

---

# Population variance

If you have the **entire population**:

[
\sigma^2=\frac{\sum_{i=1}^{N}(x_i-\mu)^2}{N}
]

where:

```text
N = population size
μ = population mean
```

---

# Sample variance

If you only have a sample:

[
s^2=\frac{\sum_{i=1}^{n}(x_i-\bar{x})^2}{n-1}
]

where:

```text
n = sample size
x̄ = sample mean
```

Notice:

```text
Population → N
Sample     → n - 1
```

---

# Why n - 1?

This is called **Bessel's correction**.

When estimating population variance using a sample, the sample mean is already estimated from the same observations.

This causes the naive estimator:

[
\frac{\sum(x_i-\bar{x})^2}{n}
]

to systematically underestimate the population variance.

Using:

[
n-1
]

corrects this bias.

---

# Degrees of freedom

Why (n-1)?

Suppose:

```text
n = 3
```

and sample mean is fixed.

If we know:

```text
x₁
x₂
```

then (x_3) is constrained because:

[
x_1+x_2+x_3=3\bar{x}
]

Therefore only:

```text
2
```

values can vary freely.

Hence:

[
df=n-1
]

---

# Example

Data:

```text
2, 4, 6
```

Mean:

[
\bar{x}=4
]

Squared deviations:

```text
(2-4)² = 4
(4-4)² = 0
(6-4)² = 4
```

Sum:

[
8
]

### Population variance

[
\frac{8}{3}=2.667
]

### Sample variance

[
\frac{8}{2}=4
]

---

# Interview trick

If the question says:

> "Calculate variance of these 5 values, and these 5 values represent the entire population."

Use:

[
N
]

If it says:

> "These 5 values are a sample from a larger population."

Use:

[
n-1
]

---

# 6. Bayes' Theorem

Bayes' theorem allows us to update our belief about an event after receiving new evidence.

---

# Formula

[
P(A|B)=\frac{P(B|A)P(A)}{P(B)}
]

Where:

```text
P(A|B) = Posterior
P(B|A) = Likelihood
P(A)   = Prior
P(B)   = Evidence
```

---

# Intuition

Think:

```text
Prior belief
     ↓
New evidence
     ↓
Updated belief
```

---

# Medical example

Suppose a disease affects:

```text
1% of population
```

Therefore:

[
P(D)=0.01
]

Suppose a test has:

```text
Sensitivity = 99%
Specificity = 95%
```

Therefore:

[
P(+|D)=0.99
]

And:

[
P(+|\neg D)=0.05
]

because:

```text
False positive rate = 1 - specificity
                    = 1 - 0.95
                    = 0.05
```

---

## We want:

[
P(D|+)
]

Using Bayes:

[
P(D|+)=
\frac{P(+|D)P(D)}
{P(+)}
]

Calculate:

[
P(+)=P(+|D)P(D)+P(+|\neg D)P(\neg D)
]

[
=(0.99)(0.01)+(0.05)(0.99)
]

[
=0.0099+0.0495
]

[
=0.0594
]

Therefore:

[
P(D|+)=\frac{0.0099}{0.0594}
]

[
\approx0.1667
]

So:

[
\boxed{P(D|+)\approx16.67%}
]

---

# Why is this surprising?

The test is:

```text
99% sensitive
95% specific
```

Yet after a positive result, the probability of actually having the disease is only around:

```text
16.7%
```

Why?

Because the disease is rare.

There are many more healthy people than sick people.

---

# Frequency interpretation

Imagine:

```text
10,000 people
```

Disease prevalence:

```text
1%
```

So:

```text
100 sick
9,900 healthy
```

Among the sick:

```text
99% test positive
→ 99 positive
```

Among healthy:

```text
5% false positive
→ 495 positive
```

Total positive:

```text
99 + 495 = 594
```

Actually sick among positives:

```text
99
```

Therefore:

[
\frac{99}{594}=16.67%
]

This is often easier to understand than the equation.

---

# Applications of Bayes

Bayesian reasoning appears in:

* spam detection
* medical diagnosis
* fraud detection
* recommendation systems
* machine learning
* NLP
* search engines
* classification
* probabilistic inference

---

# 7. Confidence Interval vs Prediction Interval

These two are often confused.

---

# Confidence Interval

A confidence interval estimates a **population parameter**.

Example:

> What is the average salary of software engineers?

Suppose:

```text
Sample mean = ₹10 LPA
95% CI = [₹9.5 LPA, ₹10.5 LPA]
```

The interval estimates the **population mean**.

---

# Prediction Interval

A prediction interval predicts the value of a **future individual observation**.

Example:

> What salary might the next software engineer have?

Suppose:

```text
95% Prediction Interval:
₹5 LPA – ₹15 LPA
```

This is much wider because individual observations have additional variability.

---

# Why is prediction interval wider?

Confidence interval uncertainty:

```text
Uncertainty in estimating population mean
```

Prediction interval uncertainty:

```text
Uncertainty in estimating population mean
+
Individual-level randomness
```

Therefore:

[
PI > CI
]

in width, generally.

---

# Regression example

Suppose:

```text
X = years of experience
Y = salary
```

At:

```text
X = 5 years
```

We might estimate:

```text
Mean salary = ₹12 LPA
```

Confidence interval:

```text
₹11.5 – ₹12.5 LPA
```

This estimates the **average salary of all people with 5 years of experience** under the model.

Prediction interval:

```text
₹8 – ₹16 LPA
```

This predicts the salary of **one particular future person**.

---

# Key difference

| Confidence Interval                 | Prediction Interval                    |
| ----------------------------------- | -------------------------------------- |
| Estimates population mean/parameter | Predicts individual future observation |
| Narrower                            | Wider                                  |
| Parameter uncertainty               | Parameter + individual variability     |
| Used for inference                  | Used for prediction                    |

---

# Important misconception about 95% CI

A frequentist 95% confidence interval does **not technically mean**:

> "There is a 95% probability that this particular interval contains the population mean."

The population parameter is treated as fixed.

The correct interpretation is:

> If we repeatedly generated samples and constructed intervals using the same procedure, approximately 95% of those intervals would contain the true parameter.

---

# 8. Law of Large Numbers

The Law of Large Numbers says:

> As the number of independent observations increases, the sample average tends to get closer to the true population mean.

---

# Example: Coin flipping

Fair coin:

[
P(H)=0.5
]

If we flip it:

```text
10 times
```

we might get:

```text
7 heads
```

Proportion:

```text
70%
```

If we flip:

```text
10,000 times
```

the proportion of heads will generally get much closer to:

```text
50%
```

---

# Mathematical intuition

Sample mean:

[
\bar X_n=\frac{1}{n}\sum_{i=1}^{n}X_i
]

As:

[
n\rightarrow\infty
]

we expect:

[
\bar X_n\rightarrow\mu
]

under the conditions of the relevant version of the LLN.

---

# Weak vs Strong Law

### Weak Law of Large Numbers

Says convergence occurs **in probability**.

### Strong Law of Large Numbers

Says convergence occurs **almost surely**.

For most Data Science applications, understanding the basic concept is more important than memorizing the measure-theoretic definitions.

---

# CLT vs LLN

This is a very common interview question.

### LLN

Answers:

> What happens to the sample mean as sample size becomes very large?

Answer:

```text
It approaches the population mean.
```

### CLT

Answers:

> What does the distribution of sample means look like for sufficiently large samples?

Answer:

```text
Approximately normal.
```

---

# Casino example

Suppose a casino game has expected profit:

```text
₹10 per game
```

Over:

```text
10 games
```

the average profit might be:

```text
₹3
```

or:

```text
₹18
```

But over:

```text
1,000,000 games
```

the average profit will tend toward:

```text
₹10
```

This is the Law of Large Numbers.

---

# Important misconception

LLN does **not** mean:

> Every small sequence will balance itself.

For example, after getting:

```text
10 heads in a row
```

the probability of heads on the next fair coin toss is still:

```text
50%
```

The coin doesn't "owe" you tails.

This is the **gambler's fallacy**.

---

# 9. Skewness and Kurtosis

These describe aspects of a distribution beyond its mean and variance.

---

# Skewness

Skewness measures the **asymmetry** of a distribution.

---

## Positive skew / right skew

The distribution has a long right tail.

```text
      *
     ***
    ****
   *****
  ******
       ********
-------------------->
```

Typical examples:

* income
* wealth
* house prices
* transaction values

Usually:

[
Mean > Median
]

---

## Negative skew / left skew

Long tail toward the left.

```text
              *
             ***
            ****
       ******
   ******
-------------------->
```

Often:

[
Mean < Median
]

---

## Symmetric distribution

For a perfectly symmetric distribution:

[
Skewness=0
]

For example, the normal distribution.

---

# Why skewness matters in Data Science

Suppose:

```text
Salary:
₹20k
₹25k
₹30k
₹35k
₹40k
₹10 lakh
```

The ₹10 lakh value pulls the mean upward.

Therefore:

```text
Mean → heavily affected
Median → much more robust
```

For heavily skewed variables, Data Scientists may consider:

```text
Median
Log transformation
Robust statistics
Quantile transformation
```

---

# Kurtosis

Kurtosis describes the behavior of the tails and, in common interpretations, the tendency toward extreme observations.

The fourth standardized central moment is:

[
\frac{E[(X-\mu)^4]}{\sigma^4}
]

---

# Types of kurtosis

### Mesokurtic

Normal distribution.

Kurtosis:

[
3
]

when using the standard Pearson definition.

### Leptokurtic

Higher kurtosis than normal.

Often associated with heavier tails and more extreme observations.

### Platykurtic

Lower kurtosis than normal.

Often associated with lighter tails.

---

# Excess kurtosis

Many statistical libraries report **excess kurtosis**:

[
Excess\ Kurtosis=Kurtosis-3
]

Therefore normal distribution:

[
Excess\ Kurtosis=0
]

---

# Why kurtosis matters

Suppose you're building a financial risk model.

A variable may have:

```text
Mean = 0
Standard deviation = 1
```

but still have many more extreme observations than a normal distribution.

Kurtosis can help indicate this tail behavior.

This matters in:

* finance
* anomaly detection
* risk management
* quality control
* statistical modeling

---

# Important misconception

Don't simply memorize:

```text
Kurtosis = peakedness
```

That's an oversimplification.

A better modern interpretation is:

> Kurtosis is particularly informative about tail heaviness and the frequency of extreme observations relative to a normal distribution.

---

# 10. Parametric vs Non-Parametric Tests

This is a major Data Science interview topic.

---

# Parametric tests

Parametric tests make assumptions about the underlying population distribution or its parameters.

Common examples:

```text
t-test
ANOVA
Pearson correlation test
Z-test
```

For example, a t-test typically relies on assumptions related to:

* independence
* appropriate measurement scale
* approximate normality of the relevant quantity, especially for small samples
* equal variance in the classical pooled two-sample t-test

---

# Non-parametric tests

Non-parametric tests make fewer distributional assumptions.

Examples:

```text
Mann-Whitney U
Wilcoxon signed-rank
Kruskal-Wallis
Spearman rank correlation
Chi-square tests
```

Important:

> Non-parametric does NOT mean "no assumptions."

They still have assumptions.

---

# Parametric vs Non-parametric

| Feature                  | Parametric                       | Non-parametric                      |
| ------------------------ | -------------------------------- | ----------------------------------- |
| Distribution assumptions | More                             | Fewer                               |
| Often works with means   | Yes                              | Often ranks/medians                 |
| Data requirements        | Often stronger                   | Often more flexible                 |
| Statistical power        | Often higher if assumptions hold | Can be better when assumptions fail |
| Outlier sensitivity      | Often higher                     | Often lower                         |
| Examples                 | t-test, ANOVA                    | Mann-Whitney, Kruskal-Wallis        |

---

# Example: Comparing two groups

Suppose you want to compare salaries between:

```text
Group A → Engineers
Group B → Analysts
```

---

## Scenario 1: Approximately normal data

Suppose:

```text
Salary distribution ≈ normal
Observations independent
```

A two-sample t-test could be appropriate.

Hypotheses:

[
H_0:\mu_A=\mu_B
]

[
H_1:\mu_A\neq\mu_B
]

---

## Scenario 2: Strongly skewed data

Suppose salaries contain extreme values:

```text
₹4L
₹5L
₹6L
₹7L
₹8L
₹50L
₹2Cr
```

A t-test may still be usable under some conditions, particularly with sufficiently large samples, but if distributional assumptions are problematic and the scientific question is about distributional location/ranks, a non-parametric alternative such as Mann-Whitney may be considered.

---

# Mann-Whitney U Test

Used for comparing two independent groups using ranks.

Example:

```text
Group A:
10, 20, 30

Group B:
40, 50, 60
```

Instead of directly comparing means, we rank all observations.

The test evaluates whether one group's observations tend to be systematically larger than the other's.

---

# Important misconception about Mann-Whitney

It is commonly described as a:

> "Non-parametric test for comparing medians."

That's not universally accurate.

The Mann-Whitney test is fundamentally a **rank-based test** about stochastic ordering/distributional differences. Under additional assumptions, it can be interpreted as a test of a location/median shift.

This distinction is useful in advanced interviews.

---

# Wilcoxon Signed-Rank Test

Used for **paired/dependent observations**.

Example:

You measure employees' productivity:

```text
Before training
After training
```

Data:

```text
Employee 1 → 60 → 70
Employee 2 → 55 → 65
Employee 3 → 80 → 82
...
```

Because the observations are paired:

```text
Before ↔ After
```

A Wilcoxon signed-rank test may be appropriate when the paired differences don't satisfy assumptions for a paired t-test.

---

# Paired t-test vs Wilcoxon Signed-Rank

| Paired t-test                                                     | Wilcoxon signed-rank             |
| ----------------------------------------------------------------- | -------------------------------- |
| Parametric                                                        | Non-parametric                   |
| Works with mean differences                                       | Rank-based                       |
| Assumes approximately normal paired differences for small samples | Fewer distributional assumptions |
| Sensitive to extreme values                                       | Generally more robust            |

---

# Kruskal-Wallis Test

Suppose you have **three or more independent groups**.

Example:

```text
Method A
Method B
Method C
```

You want to determine whether their outcomes differ.

Parametric alternative:

```text
One-way ANOVA
```

Non-parametric alternative:

```text
Kruskal-Wallis
```

---

# ANOVA

ANOVA stands for:

> Analysis of Variance

It compares means across multiple groups.

Example:

```text
Model A accuracy
Model B accuracy
Model C accuracy
```

Hypothesis:

[
H_0:\mu_A=\mu_B=\mu_C
]

Alternative:

> At least one population mean differs.

---

# Why not simply perform multiple t-tests?

Suppose you have:

```text
A vs B
A vs C
B vs C
```

Each test has a chance of Type I error.

Performing many tests increases the probability of getting at least one false positive.

ANOVA provides an overall test before follow-up comparisons.

---

# Chi-Square Test

Chi-square tests are commonly used with **categorical data**.

Example:

You want to determine whether:

```text
Gender
```

and:

```text
Product preference
```

are associated.

Create a contingency table:

|         | Product A | Product B |
| ------- | --------: | --------: |
| Group 1 |        50 |        30 |
| Group 2 |        20 |        40 |

The chi-square test evaluates whether the observed counts differ from what we'd expect under independence.

---

# Pearson vs Spearman Correlation

### Pearson

Measures:

> Linear association.

Sensitive to outliers.

### Spearman

Measures:

> Monotonic association using ranks.

More robust to certain forms of non-normality and outliers.

Example:

```text
X ↑
Y ↑
```

Even if the relationship is curved but consistently increasing:

```text
     *
   *
  *
 *
*
----------------
```

Spearman can detect the monotonic relationship even when Pearson's linear correlation is not as strong.

---

# How do you choose a statistical test?

Don't memorize only:

```text
Problem → Test
```

Instead ask these questions.

---

## Step 1 — What type of variable?

```text
Numerical?
Categorical?
Ordinal?
```

---

## Step 2 — How many groups?

```text
1
2
3+
```

---

## Step 3 — Independent or paired?

Independent:

```text
Group A people ≠ Group B people
```

Paired:

```text
Same people before/after
```

---

## Step 4 — What is the question?

Are you comparing:

```text
Means?
Distributions?
Proportions?
Association?
Correlation?
```

---

## Step 5 — Are assumptions reasonable?

Check things such as:

```text
Independence
Normality
Equal variances
Sample size
Outliers
Measurement scale
```

---

# Statistical Test Cheat Sheet

| Problem                                   | Common choice                 |
| ----------------------------------------- | ----------------------------- |
| One population mean                       | One-sample t-test             |
| Two independent means                     | Independent two-sample t-test |
| Two paired means                          | Paired t-test                 |
| 3+ independent means                      | ANOVA                         |
| 3+ repeated/related means                 | Repeated-measures ANOVA       |
| Two independent groups, rank-based        | Mann-Whitney U                |
| Two paired groups, rank-based             | Wilcoxon signed-rank          |
| 3+ independent groups, rank-based         | Kruskal-Wallis                |
| Association between categorical variables | Chi-square                    |
| Linear correlation                        | Pearson                       |
| Monotonic/rank correlation                | Spearman                      |

---

# Putting Everything Together

These 10 concepts are connected.

A typical Data Science workflow could look like:

```text
Raw Population
      ↓
Take Sample
      ↓
Sample Statistics
      ↓
CLT / Sampling Distribution
      ↓
Confidence Interval
      ↓
Hypothesis Test
      ↓
p-value
      ↓
Type I / Type II Error
      ↓
Statistical Decision
      ↓
Business Decision
```

For example, an A/B test:

```text
                 Website Users
                       │
               Random assignment
                 ┌─────┴─────┐
                 ↓           ↓
             Control      Treatment
                 │           │
                 ↓           ↓
             Conversion   Conversion
                 │           │
                 └─────┬─────┘
                       ↓
                Difference
                       ↓
                Hypothesis test
                       ↓
                    p-value
                       ↓
             Confidence interval
                       ↓
          Statistical significance
                       ↓
           Practical significance
                       ↓
              Business decision
```

---

# 🔥 Interview-Level Connections

## Connection 1

### Why does sample size matter?

Larger (n):

[
SE=\frac{\sigma}{\sqrt n}
]

Therefore:

[
n\uparrow
\Rightarrow SE\downarrow
]

Smaller standard error means estimates become more precise.

---

## Connection 2

### What happens to Type II error when sample size increases?

Generally:

[
n\uparrow
\Rightarrow Power\uparrow
\Rightarrow \beta\downarrow
]

assuming other factors remain comparable.

---

## Connection 3

### What happens to confidence intervals with larger samples?

Because:

[
SE\propto\frac{1}{\sqrt n}
]

larger samples generally produce narrower confidence intervals.

---

## Connection 4

### Why can a tiny effect have a tiny p-value?

Because:

[
Test\ statistic \approx
\frac{Effect}{Standard\ Error}
]

and:

[
SE\downarrow
]

as sample size increases.

Therefore even a small effect can become statistically significant with a sufficiently large sample.

---

# 🧠 Common Interview Traps

### Trap 1

**"CLT says data becomes normal."**

❌ Wrong.

The **sampling distribution of the statistic**, commonly the sample mean, becomes approximately normal.

---

### Trap 2

**"p-value is the probability that the null hypothesis is true."**

❌ Wrong.

It is:

[
P(Data\ as\ extreme\ as\ observed|H_0)
]

---

### Trap 3

**"p > 0.05 proves there is no effect."**

❌ Wrong.

It means there isn't sufficient evidence to reject (H_0) at that significance level.

---

### Trap 4

**"Correlation means causation."**

❌ Wrong.

Correlation only establishes association.

---

### Trap 5

**"Non-parametric means no assumptions."**

❌ Wrong.

Non-parametric tests generally make fewer or different assumptions, not zero assumptions.

---

### Trap 6

**"95% CI means there is a 95% chance the true mean is inside this interval."**

❌ Not in the classical frequentist interpretation.

The 95% refers to the long-run coverage of the procedure.

---

### Trap 7

**"Mann-Whitney always tests medians."**

❌ Oversimplification.

It is fundamentally a rank-based test of distributional differences/stochastic ordering; a median interpretation needs additional assumptions.

---

# 📝 Practice Questions

## Beginner

### Q1

A population has:

```text
Mean = 100
Standard deviation = 20
```

A random sample of:

```text
n = 100
```

is taken.

What is the standard error of the sample mean?

---

### Q2

A hypothesis test gives:

```text
p = 0.03
α = 0.05
```

What decision should you make?

---

### Q3

Identify the error:

> A disease test says a healthy person has the disease.

---

### Q4

What happens to standard error when sample size increases?

---

### Q5

Which is generally wider?

```text
95% CI
95% Prediction Interval
```

---

# Intermediate

### Q6

Why is sample variance divided by:

[
n-1
]

instead of (n)?

---

### Q7

A dataset has:

```text
Mean = ₹80,000
Median = ₹40,000
```

What can this suggest about the distribution?

---

### Q8

A company's conversion rate changes from:

```text
10.0% → 10.1%
```

and:

```text
p < 0.001
```

Is the improvement necessarily practically important?

Explain.

---

### Q9

You have:

```text
Before training
After training
```

for the same 100 employees.

Should you treat the groups as independent?

Why or why not?

---

### Q10

A variable has a very long right tail.

Which transformation might you consider?

```text
Log transformation
```

Why?

---

# Advanced Interview Questions

### Q11

Why can the CLT hold even if the original population is highly skewed?

---

### Q12

What happens to the confidence interval when sample size increases from 100 to 10,000?

---

### Q13

Explain why increasing α can increase statistical power.

---

### Q14

Why does a rare disease produce many false positives even when a diagnostic test has high specificity?

---

### Q15

Explain the difference between:

[
P(A|B)
]

and:

[
P(B|A)
]

Why is confusing them dangerous?

---

### Q16

A correlation coefficient is:

[
r=0
]

Does that mean X and Y are completely unrelated?

---

### Q17

Can a statistically significant result have no practical significance?

---

### Q18

Can a non-significant result still have a practically important effect?

---

### Q19

Why does multiple hypothesis testing increase the risk of false positives?

---

### Q20

You have three independent groups with highly skewed numerical data. Which tests might you consider, and what assumptions would you investigate before deciding?

---

# 🚀 Final Revision Sheet

Memorize this section before an interview.

```text
CLT
→ Sampling distribution of mean becomes approximately normal
→ Large sample
→ Enables statistical inference

LLN
→ Sample mean approaches population mean
→ More observations → better convergence

Type I
→ False Positive
→ Reject true H₀
→ Probability = α

Type II
→ False Negative
→ Fail to reject false H₀
→ Probability = β

Power
→ 1 - β

p-value
→ P(data at least as extreme | H₀ true)
→ NOT probability that H₀ is true

Correlation
→ Association
→ NOT causation

Population variance
→ Divide by N

Sample variance
→ Divide by n - 1
→ Bessel's correction

Bayes
→ Prior + Evidence → Posterior

P(A|B)
→ Probability of A given B

Confidence Interval
→ Estimates population parameter

Prediction Interval
→ Predicts individual future observation
→ Wider than CI

Skewness
→ Asymmetry

Positive skew
→ Long right tail
→ Often mean > median

Negative skew
→ Long left tail
→ Often mean < median

Kurtosis
→ Tail/extreme-value behavior

Parametric
→ Stronger distributional assumptions
→ t-test, ANOVA, Pearson

Non-parametric
→ Fewer/different distributional assumptions
→ Mann-Whitney, Wilcoxon, Kruskal-Wallis, Spearman
```

---

# 🎯 What You Should Be Able to Do After This

For **Data Science interviews**, don't stop at definitions. You should be able to take a business problem and reason:

```text
What is my population?
        ↓
What is my sample?
        ↓
What statistic am I estimating?
        ↓
What assumptions do I have?
        ↓
What is the sampling distribution?
        ↓
Do I need CLT?
        ↓
What confidence interval should I use?
        ↓
What hypothesis am I testing?
        ↓
What test is appropriate?
        ↓
What does the p-value tell me?
        ↓
What Type I / Type II errors are possible?
        ↓
Is the result statistically significant?
        ↓
Is it practically significant?
        ↓
What business decision should I make?
```

That reasoning chain is **much more valuable in a Data Science interview than memorizing 20 isolated statistical definitions**.
---

### Hypothesis Testing & A/B Testing
11. Walk me through how you would design an A/B test for a new feature.
12. What is statistical power, and how do you calculate the required sample size?
13. What is the multiple comparisons problem and how do you address it?
14. Explain the difference between a one-tailed and two-tailed test.
15. How do you handle novelty effects and seasonality in A/B tests?
16. What is peeking in A/B testing, and why is it problematic?
17. How would you A/B test a feature that affects only a small percentage of users?
18. What is Simpson's Paradox? Give an example.
19. How do you choose the right metric (guardrail vs. success metric) for an experiment?
20. What is a chi-square test used for, and when would you apply it?

### EDA & Feature Engineering
21. How do you handle missing data? Compare different imputation strategies.
22. How do you detect and treat outliers in a dataset?
23. Explain the difference between normalization and standardization.
24. What is multicollinearity, and how do you detect and fix it?
25. How would you encode a high-cardinality categorical variable?
26. What is the curse of dimensionality?
27. Explain PCA and when you would use it for feature reduction.
28. How do you handle imbalanced datasets?
29. What techniques would you use to engineer features from a timestamp column?
30. How do you decide which features to drop before modeling?

### SQL & Business Case Studies
31. Write a SQL query to find the second-highest salary in a table.
32. Explain the difference between `RANK()`, `DENSE_RANK()`, and `ROW_NUMBER()`.
33. How would you find duplicate rows in a table using SQL?
34. Write a query to calculate a 7-day rolling average using window functions.
35. Explain the difference between `INNER JOIN`, `LEFT JOIN`, and `FULL OUTER JOIN` with examples.
36. Design a metric to measure the success of a ride-sharing app's matching algorithm.
37. How would you measure whether a new recommendation system is actually improving user engagement?
38. A product's daily active users dropped 20% overnight — how would you investigate?
39. How would you estimate the market size for a new product feature?
40. How do you decide between precision and recall trade-offs in a fraud detection business context?

### Model Evaluation & General DS
41. Explain the bias-variance tradeoff.
42. What is cross-validation, and why is k-fold preferred over a single train/test split?
43. How do you evaluate a regression model beyond R²?
44. Explain ROC-AUC vs. Precision-Recall AUC, and when to prefer one over the other.
45. What is data leakage, and how do you prevent it?
46. How would you explain a complex model's predictions to a non-technical stakeholder?
47. What is survivorship bias, and how might it affect a dataset?
48. Describe a time-series forecasting problem you'd approach differently from a standard regression problem.
49. How do you validate a model when data has temporal dependencies?
50. Walk through your end-to-end approach for a new open-ended data science case study.

---

## 2. Machine Learning

### Fundamentals
1. What is the difference between supervised, unsupervised, and reinforcement learning?
2. Explain the bias-variance tradeoff and how it relates to model complexity.
3. What is overfitting and underfitting? How do you detect and address each?
4. Explain the difference between generative and discriminative models.
5. What is regularization? Compare L1 vs. L2 regularization.
6. What is the difference between parametric and non-parametric models?
7. Explain gradient descent and its variants (batch, stochastic, mini-batch).
8. What is the difference between a loss function and a cost function?
9. What are hyperparameters, and how do they differ from model parameters?
10. Explain the No Free Lunch theorem in machine learning.

### Supervised Learning
11. Explain how linear regression works and its underlying assumptions.
12. How does logistic regression differ from linear regression?
13. Explain how a decision tree splits nodes (Gini impurity vs. entropy/information gain).
14. What is the difference between bagging and boosting?
15. Explain how Random Forest reduces variance compared to a single decision tree.
16. Explain how Gradient Boosting (e.g., XGBoost, LightGBM) works.
17. What is the kernel trick in SVMs, and why is it useful?
18. How does k-Nearest Neighbors work, and what are its limitations?
19. Explain Naive Bayes and why the "naive" independence assumption still works well in practice.
20. How do you handle multi-class classification with algorithms designed for binary classification?

### Unsupervised Learning
21. Explain how k-means clustering works and how you choose the value of k.
22. What is the difference between k-means and hierarchical clustering?
23. Explain DBSCAN and when it's preferred over k-means.
24. What is the elbow method, and what are its limitations?
25. Explain Principal Component Analysis (PCA) mathematically.
26. What is the difference between PCA and t-SNE/UMAP for dimensionality reduction?
27. Explain anomaly detection techniques for unsupervised data.
28. What are autoencoders, and how are they used for dimensionality reduction?
29. Explain Gaussian Mixture Models and how they differ from k-means.
30. What is association rule mining (e.g., Apriori algorithm)?

### Model Evaluation & Tuning
31. Explain precision, recall, F1-score, and when each matters most.
32. What is a confusion matrix, and how do you interpret it for multi-class problems?
33. Explain grid search vs. random search vs. Bayesian optimization for hyperparameter tuning.
34. What is early stopping, and how does it prevent overfitting?
35. How do you choose the right evaluation metric for a highly imbalanced classification problem?
36. Explain cross-validation strategies for time-series data.
37. What is the difference between micro-averaging and macro-averaging in multi-class metrics?
38. How do you interpret feature importance in tree-based models?
39. What is SHAP, and how does it help explain model predictions?
40. How do you detect and handle concept drift in a deployed model?

### Optimization & Ensembles
41. Explain how stacking differs from bagging and boosting.
42. What is the exploding/vanishing gradient problem, and how does it relate to optimization?
43. Explain momentum and Adam optimizer intuitively.
44. What is the difference between convex and non-convex optimization problems?
45. How does regularization affect the bias-variance tradeoff?
46. Explain how XGBoost handles missing values internally.
47. What is feature selection, and compare filter, wrapper, and embedded methods.
48. How would you handle a dataset with millions of features but few samples?
49. Explain the difference between online learning and batch learning.
50. How would you design a recommendation system from scratch (collaborative vs. content-based filtering)?

---

## 3. Deep Learning

### Neural Network Basics
1. Explain the architecture of a feedforward neural network.
2. What is backpropagation, and how does it work mathematically?
3. Explain the role of activation functions and compare ReLU, sigmoid, and tanh.
4. What is the vanishing gradient problem, and how do modern architectures address it?
5. What is the exploding gradient problem, and how is it mitigated (e.g., gradient clipping)?
6. Explain weight initialization strategies (Xavier/Glorot, He initialization).
7. What is the difference between a perceptron and a multi-layer perceptron?
8. Explain the universal approximation theorem.
9. What is the difference between epoch, batch, and iteration?
10. Why do we use non-linear activation functions instead of linear ones?

### CNNs
11. Explain how a convolution operation works on an image.
12. What is the purpose of pooling layers (max pooling vs. average pooling)?
13. Explain the concept of receptive field in CNNs.
14. What is padding, and why is it used ("same" vs. "valid")?
15. Explain the architecture of ResNet and the purpose of skip/residual connections.
16. What is batch normalization, and why does it help training?
17. Explain transfer learning and when you'd use it for a CNN-based task.
18. What is the difference between a 1x1 convolution and a standard convolution?
19. Explain data augmentation techniques used for image data.
20. What is the difference between object detection, semantic segmentation, and instance segmentation?

### RNNs, LSTMs & Sequence Models
21. Explain how a vanilla RNN works and its limitations.
22. How does an LSTM solve the vanishing gradient problem of vanilla RNNs?
23. Explain the role of gates (forget, input, output) in an LSTM cell.
24. What is the difference between LSTM and GRU?
25. Explain bidirectional RNNs and when they're useful.
26. What is teacher forcing in sequence-to-sequence training?
27. Explain the encoder-decoder architecture for sequence-to-sequence tasks.
28. What is the difference between many-to-one, one-to-many, and many-to-many RNN architectures?
29. Why are RNNs difficult to parallelize compared to Transformers?
30. What is truncated backpropagation through time?

### Optimization & Regularization
31. Explain dropout and why it helps prevent overfitting.
32. Compare SGD, RMSProp, and Adam optimizers.
33. What is learning rate scheduling, and name a few common strategies.
34. Explain the concept of a loss landscape and why deep networks can have many local minima.
35. What is label smoothing, and why is it used?
36. Explain the difference between L2 regularization and weight decay in Adam.
37. What is gradient checkpointing, and why is it useful for large models?
38. Explain mixed-precision training and its benefits.
39. What is the difference between layer normalization and batch normalization?
40. How do you diagnose whether a deep learning model is overfitting vs. underfitting from loss curves?

### Transformers & Advanced Topics
41. Explain the self-attention mechanism in Transformers.
42. What is multi-head attention, and why use multiple heads?
43. Explain positional encoding and why Transformers need it.
44. What is the difference between the Transformer encoder and decoder?
45. Explain the concept of masked self-attention in decoder-only models.
46. What are Generative Adversarial Networks (GANs), and how does the generator-discriminator game work?
47. What is mode collapse in GANs, and how can it be mitigated?
48. Explain Variational Autoencoders (VAEs) and how they differ from standard autoencoders.
49. What is knowledge distillation, and why is it used to compress models?
50. Explain the difference between fine-tuning and training a model from scratch, and when each is appropriate.

---

## 4. NLP

### Text Preprocessing & Classical NLP
1. Explain the typical text preprocessing pipeline (tokenization, stemming, lemmatization).
2. What is the difference between stemming and lemmatization?
3. Explain Bag-of-Words and its limitations.
4. What is TF-IDF, and how is it calculated?
5. Explain n-grams and their use in language modeling.
6. What is Part-of-Speech (POS) tagging, and how is it typically performed?
7. Explain Named Entity Recognition (NER) and common approaches to it.
8. What is the difference between rule-based and statistical NLP approaches?
9. How do you handle out-of-vocabulary words in classical NLP pipelines?
10. What is stop-word removal, and when might it hurt model performance?

### Word Embeddings & Representations
11. Explain Word2Vec and the difference between CBOW and Skip-gram.
12. What is GloVe, and how does it differ from Word2Vec?
13. Explain the concept of word embeddings and why they capture semantic meaning.
14. What are the limitations of static word embeddings?
15. Explain how contextual embeddings (e.g., ELMo) differ from static embeddings.
16. What is subword tokenization (BPE, WordPiece, SentencePiece), and why is it used?
17. Explain cosine similarity and its use in comparing word/sentence embeddings.
18. What is FastText, and how does it handle out-of-vocabulary words?
19. How do you evaluate the quality of word embeddings?
20. Explain the analogy task (e.g., king - man + woman = queen) and what it reveals about embeddings.

### Sequence Models for NLP
21. Explain how LSTMs were used for text classification before Transformers.
22. What is the seq2seq architecture, and how is it used in machine translation?
23. Explain attention mechanisms in the context of sequence-to-sequence translation.
24. What is beam search, and how does it differ from greedy decoding?
25. Explain perplexity as an evaluation metric for language models.
26. What is the difference between a language model and a masked language model?
27. Explain CRF (Conditional Random Fields) and its use in sequence labeling tasks.
28. What challenges arise when applying RNNs to very long documents?
29. Explain how hierarchical attention networks work for document classification.
30. What is the difference between extractive and abstractive summarization?

### Transformers & LLMs
31. Explain the BERT architecture and its pre-training objectives (MLM, NSP).
32. How does GPT differ architecturally from BERT?
33. Explain the difference between encoder-only, decoder-only, and encoder-decoder Transformer models.
34. What is fine-tuning vs. prompt engineering vs. few-shot learning in the context of LLMs?
35. Explain how Retrieval-Augmented Generation (RAG) works.
36. What is the difference between zero-shot, one-shot, and few-shot learning?
37. Explain what hallucination means in LLMs and strategies to mitigate it.
38. What is instruction tuning, and how does it differ from standard fine-tuning?
39. Explain RLHF (Reinforcement Learning from Human Feedback) at a high level.
40. What is the context window in a Transformer, and what challenges arise from long context lengths?

### Applications & Evaluation
41. How would you build a sentiment analysis system from scratch?
42. Explain BLEU and ROUGE scores, and when each is used.
43. How would you evaluate a chatbot's response quality?
44. What is topic modeling, and explain how LDA works.
45. How would you design a semantic search system using embeddings?
46. Explain how you would detect and mitigate bias in an NLP model.
47. What is coreference resolution, and why is it challenging?
48. How would you build a spam/toxicity classifier for user-generated content?
49. Explain the differences between rule-based, statistical, and neural machine translation.
50. How would you design an intent classification + slot-filling system for a chatbot?

---

## 5. MLOps

### Model Deployment
1. What is the difference between batch inference and real-time (online) inference?
2. Explain the typical architecture of a model-serving system.
3. What is model versioning, and why is it critical in production ML systems?
4. Explain the difference between shadow deployment and canary deployment.
5. What is A/B testing in the context of model deployment, and how is it different from traditional A/B testing?
6. How would you roll back a model that is underperforming in production?
7. What is a feature store, and why is it used in ML systems?
8. Explain online feature serving vs. offline feature computation.
9. What is model packaging, and what tools are commonly used (e.g., ONNX, TorchScript)?
10. How do you decide between deploying a model as a REST API vs. embedding it directly into an application?

### CI/CD for ML
11. What is CI/CD, and how does it differ for ML systems compared to traditional software?
12. Explain what "continuous training" (CT) means in an MLOps pipeline.
13. What tools have you used for building ML pipelines (e.g., Airflow, Kubeflow, MLflow)?
14. How would you set up automated testing for a machine learning pipeline?
15. What is data validation, and how do you automate it in a pipeline (e.g., Great Expectations)?
16. Explain how you would structure a CI/CD pipeline for retraining a fraud detection model weekly.
17. What is the difference between a training pipeline and an inference pipeline?
18. How do you manage secrets and credentials securely in an ML deployment pipeline?
19. What is Infrastructure as Code (IaC), and how does it apply to ML infrastructure (e.g., Terraform)?
20. Explain blue-green deployment and how it applies to model rollouts.

### Monitoring & Observability
21. What is model drift, and how do you detect it in production?
22. Explain the difference between data drift and concept drift.
23. What metrics would you monitor for a deployed classification model in production?
24. How would you set up alerting for a model whose prediction distribution shifts significantly?
25. What is the difference between monitoring model performance and monitoring system/infra performance?
26. How would you monitor for data quality issues in real-time feature pipelines?
27. Explain how you would build a dashboard to track model performance over time.
28. What is shadow mode testing, and why is it useful before full deployment?
29. How do you detect label/ground-truth delay issues in production monitoring?
30. What tools have you used for ML observability (e.g., Evidently AI, WhyLabs, Prometheus, Grafana)?

### Versioning, Reproducibility & Experiment Tracking
31. What is experiment tracking, and what tools have you used (e.g., MLflow, Weights & Biases)?
32. How do you ensure reproducibility of an ML experiment?
33. What is DVC (Data Version Control), and how does it differ from Git for versioning datasets?
34. How would you track lineage from raw data to a deployed model?
35. Explain model registry and its role in the ML lifecycle.
36. How do you version control large model artifacts efficiently?
37. What is the difference between model reproducibility and result reproducibility?
38. How would you manage multiple model versions serving different customer segments simultaneously?
39. What metadata would you log for every training run, and why?
40. How do you handle environment/dependency drift between training and serving environments?

### Containerization, Orchestration & Serving Infrastructure
41. Explain the role of Docker in ML deployment workflows.
42. What is Kubernetes, and why is it commonly used for scaling ML services?
43. Explain the difference between horizontal and vertical scaling for a model-serving system.
44. What is model serving latency, and how would you optimize it (e.g., batching, quantization)?
45. Explain model quantization and its trade-offs.
46. What is the difference between TensorFlow Serving, TorchServe, and a custom Flask/FastAPI service?
47. How would you design a system to serve multiple models with different resource requirements?
48. Explain autoscaling strategies for ML inference workloads with variable traffic.
49. What is a sidecar pattern, and how might it apply to ML model monitoring?
50. How would you design an end-to-end MLOps pipeline for a recommendation system used by millions of users?

---

## 6. Data Engineering

### Databases & SQL
1. Explain the difference between OLTP and OLAP systems.
2. What is database normalization, and explain 1NF, 2NF, and 3NF.
3. When would you choose denormalization over normalization?
4. Explain the difference between a clustered and non-clustered index.
5. What is a composite key vs. a foreign key vs. a primary key?
6. Explain ACID properties in the context of relational databases.
7. What is the difference between a star schema and a snowflake schema?
8. Write a SQL query to find employees who earn more than their managers.
9. Explain the difference between `UNION` and `UNION ALL`.
10. What is a materialized view, and how does it differ from a regular view?

### Data Warehousing & Modeling
11. Explain the difference between a data warehouse, a data lake, and a data lakehouse.
12. What is a fact table vs. a dimension table?
13. Explain slowly changing dimensions (SCD) and the difference between Type 1, 2, and 3.
14. What is data partitioning, and why does it improve query performance?
15. Explain bucketing vs. partitioning in a data warehouse context.
16. What is the difference between schema-on-write and schema-on-read?
17. How would you design a data model for an e-commerce order and inventory system?
18. What is a surrogate key, and why is it preferred over a natural key in dimensional modeling?
19. Explain the concept of data marts and how they relate to a central data warehouse.
20. What is columnar storage, and why is it beneficial for analytical workloads?

### ETL/ELT & Pipelines
21. Explain the difference between ETL and ELT, and when you'd choose one over the other.
22. What is idempotency in the context of data pipelines, and why does it matter?
23. How would you design a pipeline to handle late-arriving data?
24. What is a Directed Acyclic Graph (DAG), and how does it relate to tools like Airflow?
25. Explain incremental data loading vs. full data loading.
26. How would you handle schema evolution in a pipeline ingesting data from multiple sources?
27. What is change data capture (CDC), and how is it implemented?
28. How would you design a pipeline to deduplicate records arriving from multiple upstream systems?
29. What is backfilling in data pipelines, and how would you safely backfill a year of historical data?
30. How would you design a retry and failure-handling strategy for a critical daily ETL job?

### Big Data & Distributed Systems
31. Explain how Apache Spark distributes computation across a cluster.
32. What is the difference between RDDs, DataFrames, and Datasets in Spark?
33. Explain the concept of data shuffling in Spark and why it's expensive.
34. What is the difference between MapReduce and Spark's in-memory computation model?
35. Explain the CAP theorem and its implications for distributed databases.
36. What is the difference between a data lake built on HDFS vs. cloud object storage (S3/GCS/ADLS)?
37. Explain how Kafka works and the role of topics, partitions, and consumer groups.
38. What is the difference between stream processing and batch processing?
39. Explain exactly-once, at-least-once, and at-most-once processing semantics in streaming systems.
40. How would you design a real-time analytics pipeline for clickstream data (e.g., using Kafka + Spark Streaming/Flink)?

### Cloud, Storage & System Design
41. Explain the difference between row-based and columnar file formats (e.g., CSV vs. Parquet vs. ORC).
42. What is data compression, and how does it affect query performance vs. storage cost trade-offs?
43. How would you design a data pipeline architecture for a company ingesting data from 100+ sources daily?
44. Explain the differences between AWS Redshift, Google BigQuery, and Snowflake at a high level.
45. What is data governance, and why is it important in large organizations?
46. How would you ensure data quality across a multi-stage pipeline?
47. Explain the concept of data lineage and why it matters for debugging and compliance.
48. How would you design a system to handle GDPR/data deletion requests across multiple data stores?
49. What is the difference between a data lakehouse architecture (e.g., Delta Lake, Iceberg) and a traditional data warehouse?
50. How would you design the end-to-end data infrastructure for a ride-sharing company from ingestion to analytics dashboards?

---

## How to Use This Guide
- Treat each category as a checklist — aim to explain answers out loud, not just recognize them.
- Pair theory questions with hands-on practice (SQL on a real DB, building a small pipeline, training a model end-to-end).
- For system design–style questions (marked with "design"/"how would you build"), practice structuring answers: requirements → approach → trade-offs → scaling.
- Revisit weak areas a few days before interviews rather than cramming everything the night before.

Good luck with your preparation! 🚀
