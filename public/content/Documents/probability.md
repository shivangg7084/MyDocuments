# Probability and Statistics for Machine Learning

The three slides you shared cover a large part of the probability and statistics foundation needed for Machine Learning and Data Science.

The topics can be understood as one connected story:

**Probability → Random Variables → Probability Distributions → Expected Value/Variance → Sampling → Central Limit Theorem → Statistical Inference → Hypothesis Testing → Statistical Tests → ANOVA**

I will explain them from the ground up, including formulas, intuition, examples, assumptions, common mistakes, and practice questions with solutions.

---

# PART I — PROBABILITY

## 1. Introduction to Probability

Probability is a mathematical way of measuring **uncertainty**.

For an event (A),

[
0 \le P(A) \le 1
]

where:

* (P(A)=0): event is impossible
* (P(A)=1): event is certain
* (0<P(A)<1): event has some uncertainty

For example, when tossing a fair coin:

[
P(\text{Heads})=\frac{1}{2}=0.5
]

This means that in a large number of tosses, approximately 50% will be heads.

### Probability does NOT mean certainty about an individual event

If

[
P(\text{rain tomorrow})=0.8
]

it does not mean it will rain for 80% of tomorrow.

It means that, under the probability model, the event has an 80% chance of occurring.

---

# 2. Probability Theory

Probability theory provides mathematical rules for reasoning about uncertain events.

Consider rolling a fair six-sided die.

Possible outcomes are:

[
1,2,3,4,5,6
]

Each outcome has probability:

[
P(X=i)=\frac16
]

for

[
i=1,2,\ldots,6
]

Suppose:

[
A={\text{even number}}
]

Then

[
A={2,4,6}
]

Therefore:

[
P(A)=\frac{3}{6}=\frac12
]

---

# 3. Random Experiment

A **random experiment** is a process whose exact outcome cannot be predicted with certainty.

Examples:

* Tossing a coin
* Rolling a die
* Drawing a card
* Measuring the height of a randomly selected person
* Selecting a customer randomly
* Observing whether a machine fails

The important point is:

> The experiment has an uncertain outcome, even though all possible outcomes may be known.

---

# 4. Sample Space

The **sample space** is the set of all possible outcomes of a random experiment.

It is usually represented by:

[
S
]

or

[
\Omega
]

### Example: Coin

For one coin toss:

[
S={H,T}
]

### Example: Die

[
S={1,2,3,4,5,6}
]

### Example: Two coin tosses

[
S={HH,HT,TH,TT}
]

Therefore:

[
|S|=4
]

---

# 5. Events

An **event** is a subset of the sample space.

For two coin tosses:

[
S={HH,HT,TH,TT}
]

Suppose event (A) means "at least one Head".

Then:

[
A={HH,HT,TH}
]

Therefore:

[
P(A)=\frac34
]

---

# 6. Types of Events

## 6.1 Simple Event

Contains one outcome.

Example:

[
A={3}
]

when rolling a die.

---

## 6.2 Compound Event

Contains multiple outcomes.

Example:

[
A={2,4,6}
]

---

## 6.3 Certain Event

An event that always occurs.

[
P(S)=1
]

---

## 6.4 Impossible Event

An event that cannot occur.

[
P(\emptyset)=0
]

---

## 6.5 Complementary Event

If (A) is an event, its complement is:

[
A^c
]

It means "A does not occur."

The fundamental relationship is:

[
P(A^c)=1-P(A)
]

### Example

Probability that a student passes:

[
P(Pass)=0.8
]

Therefore:

[
P(Fail)=1-0.8=0.2
]

---

# 7. Probability Axioms

The standard probability axioms are called the **Kolmogorov axioms**.

## Axiom 1: Non-negativity

For every event (A),

[
P(A)\ge0
]

Probability cannot be negative.

---

## Axiom 2: Total probability

The probability of the sample space is:

[
P(S)=1
]

Something in the sample space must happen.

---

## Axiom 3: Additivity

For mutually exclusive events (A) and (B):

[
P(A\cup B)=P(A)+P(B)
]

Mutually exclusive means they cannot happen simultaneously.

### Example

Roll a die.

Let:

[
A={1}
]

and

[
B={6}
]

They cannot happen together.

Therefore:

[
P(A\cup B)=\frac16+\frac16=\frac13
]

---

# 8. Addition Rule

For any two events:

[
P(A\cup B)
==========

P(A)+P(B)-P(A\cap B)
]

Why subtract the intersection?

Because it gets counted twice.

### Example

Suppose:

[
P(A)=0.6
]

[
P(B)=0.5
]

[
P(A\cap B)=0.2
]

Then:

[
P(A\cup B)=0.6+0.5-0.2
]

[
=0.9
]

---

# 9. Mutually Exclusive Events

Events are mutually exclusive if:

[
A\cap B=\emptyset
]

Therefore:

[
P(A\cap B)=0
]

and:

[
P(A\cup B)=P(A)+P(B)
]

Example:

Rolling a die:

* getting 2
* getting 5

cannot happen simultaneously.

---

# 10. Conditional Probability

This is one of the most important concepts in statistics and Machine Learning.

Conditional probability asks:

> What is the probability of (A), given that (B) has already happened?

Notation:

[
P(A|B)
]

Read as:

> Probability of A given B.

Formula:

[
\boxed{
P(A|B)=\frac{P(A\cap B)}{P(B)}
}
]

provided:

[
P(B)>0
]

---

## Example

Suppose a class contains:

|        | Passed | Failed | Total |
| ------ | -----: | -----: | ----: |
| Male   |     40 |     10 |    50 |
| Female |     30 |     20 |    50 |
| Total  |     70 |     30 |   100 |

Question:

What is probability that a randomly selected student passed, given that the student is male?

We want:

[
P(Passed|Male)
]

Among males:

[
50
]

passed males:

[
40
]

Therefore:

[
P(Passed|Male)=\frac{40}{50}=0.8
]

Notice that once we know the student is male, our relevant population changes from 100 students to 50 males.

That is the fundamental intuition behind conditional probability.

---

# 11. Multiplication Rule

From conditional probability:

[
P(A|B)=\frac{P(A\cap B)}{P(B)}
]

Therefore:

[
\boxed{
P(A\cap B)=P(A|B)P(B)
}
]

Similarly:

[
\boxed{
P(A\cap B)=P(B|A)P(A)
}
]

These are extremely important formulas.

---

# 12. Bayes' Theorem

Bayes' theorem is one of the most important probability concepts for Machine Learning.

It allows us to reverse conditional probabilities.

The formula is:

[
\boxed{
P(A|B)=
\frac{P(B|A)P(A)}
{P(B)}
}
]

Where:

* (P(A|B)) = posterior probability
* (P(B|A)) = likelihood
* (P(A)) = prior probability
* (P(B)) = evidence

---

# 13. Bayes' Theorem Example

Suppose:

* 1% of people have a disease.
* A test correctly identifies a sick person 99% of the time.
* The test incorrectly gives a positive result for a healthy person 5% of the time.

We want:

[
P(Disease|Positive)
]

Given:

[
P(D)=0.01
]

[
P(Positive|Disease)=0.99
]

[
P(Positive|Healthy)=0.05
]

Since:

[
P(Healthy)=0.99
]

First calculate:

[
P(Positive)
]

Using total probability:

[
P(Positive)
===========

P(Positive|Disease)P(Disease)
+
P(Positive|Healthy)P(Healthy)
]

Therefore:

[
=0.99(0.01)+0.05(0.99)
]

[
=0.0099+0.0495
]

[
=0.0594
]

Now:

[
P(Disease|Positive)
===================

\frac{0.99(0.01)}
{0.0594}
]

[
\approx0.1667
]

So:

[
\boxed{P(Disease|Positive)\approx16.67%}
]

This is a very important lesson.

Even though the test has 99% sensitivity, a positive result does **not** mean there is a 99% probability that the person has the disease.

The low base rate matters.

This is called the **base-rate effect**.

---

# 14. Independence

Two events (A) and (B) are independent if occurrence of one does not affect the probability of the other.

Mathematically:

[
\boxed{
P(A|B)=P(A)
}
]

and equivalently:

[
\boxed{
P(A\cap B)=P(A)P(B)
}
]

---

## Example

Toss a coin twice.

Event (A):

First toss is Head.

Event (B):

Second toss is Head.

The first toss does not influence the second toss.

Therefore:

[
P(A)=\frac12
]

[
P(B)=\frac12
]

and:

[
P(A\cap B)
==========

# \frac12\times\frac12

\frac14
]

---

# 15. Independence vs Mutually Exclusive

This distinction is frequently tested.

### Mutually exclusive

They cannot happen together:

[
P(A\cap B)=0
]

### Independent

One event does not affect the other:

[
P(A\cap B)=P(A)P(B)
]

Two events with positive probability cannot be both mutually exclusive and independent.

Why?

If mutually exclusive:

[
P(A\cap B)=0
]

If independent:

[
P(A\cap B)=P(A)P(B)
]

If both probabilities are positive:

[
P(A)P(B)>0
]

Contradiction.

---

# PART II — RANDOM VARIABLES

# 16. Random Variable

A random variable is a function that maps outcomes of a random experiment to numerical values.

It is usually represented by:

[
X
]

Example: Toss two coins.

Sample space:

[
S={HH,HT,TH,TT}
]

Let (X) = number of Heads.

Then:

| Outcome |  X |
| ------- | -: |
| HH      |  2 |
| HT      |  1 |
| TH      |  1 |
| TT      |  0 |

So (X) is a random variable.

---

# 17. Types of Random Variables

There are two major types.

## 17.1 Discrete Random Variable

Takes countable values.

Examples:

* Number of customers
* Number of defective products
* Number of heads
* Number of emails
* Number of goals

Example:

[
X\in{0,1,2,3,\ldots}
]

---

# 18. Continuous Random Variable

Can take infinitely many values within an interval.

Examples:

* Height
* Weight
* Temperature
* Time
* Blood pressure
* Salary

For example:

[
X\in[50,100]
]

There are infinitely many possible values.

---

# 19. Probability Mass Function

For a discrete random variable, the probability function is called the **PMF**.

[
P(X=x)
]

Properties:

[
P(X=x)\ge0
]

and:

[
\sum_xP(X=x)=1
]

### Example

Suppose:

| X | P(X) |
| - | ---: |
| 0 |  0.2 |
| 1 |  0.5 |
| 2 |  0.3 |

Check:

[
0.2+0.5+0.3=1
]

Therefore it is a valid PMF.

---

# 20. Probability Density Function

For a continuous random variable we use a **PDF**.

The PDF is:

[
f(x)
]

Important:

For a continuous variable:

[
P(X=x)=0
]

Instead, probabilities are calculated over intervals:

[
P(a<X<b)
========

\int_a^b f(x),dx
]

Also:

[
\int_{-\infty}^{\infty}f(x),dx=1
]

The area under the PDF represents probability.

---

# 21. Cumulative Distribution Function

The CDF is:

[
F(x)=P(X\le x)
]

For a continuous random variable:

[
F(x)=\int_{-\infty}^{x}f(t),dt
]

The CDF is always between 0 and 1.

[
0\le F(x)\le1
]

---

# PART III — EXPECTATION, VARIANCE AND STANDARD DEVIATION

# 22. Mean / Expected Value

The expected value represents the long-run average value of a random variable.

For a discrete random variable:

[
\boxed{
E[X]=\sum_x xP(X=x)
}
]

---

## Example

Suppose:

| X | P(X) |
| - | ---: |
| 1 |  0.2 |
| 2 |  0.5 |
| 3 |  0.3 |

Then:

[
E[X]
====

1(0.2)+2(0.5)+3(0.3)
]

[
=0.2+1+0.9
]

[
=2.1
]

So:

[
\boxed{E[X]=2.1}
]

---

# 23. Expected Value for a Continuous Variable

For continuous (X):

[
\boxed{
E[X]=\int_{-\infty}^{\infty}xf(x),dx
}
]

---

# 24. Variance

Variance measures how spread out values are around the mean.

[
\boxed{
Var(X)=E[(X-\mu)^2]
}
]

where:

[
\mu=E[X]
]

An extremely useful alternative formula is:

[
\boxed{
Var(X)=E[X^2]-(E[X])^2
}
]

---

# 25. Variance Example

Suppose:

| X | P(X) |
| - | ---: |
| 1 |  0.2 |
| 2 |  0.5 |
| 3 |  0.3 |

We already calculated:

[
E[X]=2.1
]

Calculate:

[
E[X^2]
]

[
=1^2(0.2)+2^2(0.5)+3^2(0.3)
]

[
=0.2+2+2.7
]

[
=4.9
]

Therefore:

[
Var(X)=4.9-(2.1)^2
]

[
=4.9-4.41
]

[
=0.49
]

---

# 26. Standard Deviation

Standard deviation is simply the square root of variance.

[
\boxed{
\sigma=\sqrt{Var(X)}
}
]

For the above example:

[
\sigma=\sqrt{0.49}=0.7
]

---

# 27. Why Variance Is Squared

Suppose deviations from the mean are:

[
-2,-1,0,1,2
]

If we simply calculate their average:

[
\frac{-2-1+0+1+2}{5}=0
]

This incorrectly suggests no variability.

Squaring eliminates negative signs:

[
4,1,0,1,4
]

Then we can measure spread.

---

# 28. Population vs Sample Variance

This distinction is extremely important.

For a population:

[
\boxed{
\sigma^2=
\frac{1}{N}
\sum_{i=1}^{N}(x_i-\mu)^2
}
]

For a sample:

[
\boxed{
s^2=
\frac{1}{n-1}
\sum_{i=1}^{n}(x_i-\bar{x})^2
}
]

Why (n-1)?

Because using (n) tends to underestimate the population variance when estimating it from a sample.

The (n-1) correction is called **Bessel's correction**.

---

# PART IV — BINOMIAL DISTRIBUTION

# 29. Binomial Distribution

The binomial distribution models the number of successes in a fixed number of independent trials.

It requires:

1. Fixed number of trials (n)
2. Each trial has two outcomes
3. Trials are independent
4. Probability of success (p) remains constant

Examples:

* Number of heads in 10 coin tosses
* Number of defective products in 100 inspected products
* Number of customers who click an advertisement
* Number of patients who respond to treatment

---

# 30. Binomial Formula

If:

[
X\sim Binomial(n,p)
]

then:

[
\boxed{
P(X=k)
======

{n\choose k}
p^k(1-p)^{n-k}
}
]

where:

[
{n\choose k}
============

\frac{n!}{k!(n-k)!}
]

---

# 31. Binomial Example

Suppose a fair coin is tossed 5 times.

What is probability of exactly 3 heads?

Here:

[
n=5
]

[
k=3
]

[
p=0.5
]

Therefore:

[
P(X=3)
======

{5\choose3}
(0.5)^3
(0.5)^2
]

[
=10(0.5)^5
]

[
=\frac{10}{32}
]

[
=0.3125
]

Therefore:

[
\boxed{P(X=3)=0.3125}
]

---

# 32. Mean and Variance of Binomial Distribution

If:

[
X\sim Binomial(n,p)
]

then:

[
\boxed{E[X]=np}
]

and:

[
\boxed{Var(X)=np(1-p)}
]

Standard deviation:

[
\boxed{
\sigma=\sqrt{np(1-p)}
}
]

---

# PART V — NORMAL DISTRIBUTION

# 33. Normal Distribution

The normal distribution is one of the most important distributions in statistics and Machine Learning.

It is also called the **Gaussian distribution**.

Notation:

[
X\sim N(\mu,\sigma^2)
]

where:

* (\mu) = mean
* (\sigma^2) = variance
* (\sigma) = standard deviation

---

# 34. Shape of Normal Distribution

The normal distribution has a bell-shaped curve.

Important properties:

1. Symmetric around the mean
2. Mean = median = mode
3. Total area = 1
4. Tails extend infinitely
5. Defined by (\mu) and (\sigma)

---

# 35. Empirical Rule

For a normal distribution:

Approximately:

[
68%
]

of observations lie within:

[
\mu\pm\sigma
]

Approximately:

[
95%
]

lie within:

[
\mu\pm2\sigma
]

Approximately:

[
99.7%
]

lie within:

[
\mu\pm3\sigma
]

This is called the **68-95-99.7 rule**.

---

# 36. Z-Score

The z-score tells us how many standard deviations an observation is from the mean.

[
\boxed{
z=\frac{x-\mu}{\sigma}
}
]

Example:

Mean salary:

[
\mu=50,000
]

Standard deviation:

[
\sigma=5,000
]

Person's salary:

[
x=60,000
]

Then:

[
z=\frac{60000-50000}{5000}
]

[
=2
]

So the salary is:

[
\boxed{2\text{ standard deviations above the mean}}
]

---

# 37. Why Normal Distribution Matters in ML

Normal distributions appear frequently because many natural quantities are approximately normally distributed.

More importantly, the normal distribution appears in statistical inference because of the **Central Limit Theorem**.

---

# PART VI — CENTRAL LIMIT THEOREM

# 38. Central Limit Theorem

The Central Limit Theorem, or CLT, is one of the most important ideas in statistics.

Suppose we repeatedly take random samples of size (n) from a population.

Calculate the mean of every sample.

As (n) becomes sufficiently large, the distribution of those sample means becomes approximately normal, even if the original population is not normally distributed, under standard CLT conditions.

This is enormously important.

---

# 39. Example of CLT

Suppose the population is highly skewed.

Imagine incomes:

[
20,20,25,30,35,40,50,100,200,1000
]

The population is not normally distributed.

Now repeatedly select samples of size 30 and calculate each sample mean.

The distribution of those sample means tends toward a normal distribution.

---

# 40. Sampling Distribution of Mean

If population mean is:

[
\mu
]

and population standard deviation is:

[
\sigma
]

then the sampling distribution of the sample mean has:

[
\boxed{
E[\bar X]=\mu
}
]

and:

[
\boxed{
SE(\bar X)=\frac{\sigma}{\sqrt n}
}
]

where (SE) is the **standard error**.

---

# 41. Standard Error

Standard deviation measures variation among individual observations.

Standard error measures variation among estimates such as sample means.

[
\boxed{
SE=\frac{\sigma}{\sqrt n}
}
]

As sample size increases:

[
n\uparrow
]

therefore:

[
SE\downarrow
]

This is why larger samples generally provide more precise estimates.

---

# 42. Important Difference

### Standard deviation

Spread of individual data.

### Standard error

Spread of a statistic across repeated samples.

For the sample mean:

[
SE(\bar X)=\frac{\sigma}{\sqrt n}
]

---

# PART VII — STATISTICAL INFERENCE

# 43. Population and Sample

A **population** contains all objects we are interested in.

A **sample** is a subset of the population.

Example:

Suppose we want the average height of all Indian adults.

Population:

All Indian adults.

Sample:

1,000 selected adults.

We use the sample to infer information about the population.

---

# 44. Parameter vs Statistic

A **parameter** describes a population.

Examples:

[
\mu
]

population mean.

[
\sigma
]

population standard deviation.

A **statistic** describes a sample.

Examples:

[
\bar{x}
]

sample mean.

[
s
]

sample standard deviation.

---

# PART VIII — STATISTICAL TESTS

# 45. What Is a Statistical Test?

A statistical test is a mathematical procedure used to determine whether observed data provides enough evidence against a particular assumption.

For example:

A company claims:

[
\mu=100
]

You collect data and observe:

[
\bar{x}=105
]

Is the difference due to random sampling variation, or does the evidence suggest the company's claim is wrong?

Hypothesis testing helps answer this.

---

# 46. Hypothesis Testing

Hypothesis testing involves making a claim about a population and testing it using sample data.

There are two hypotheses:

[
H_0
]

and:

[
H_1
]

or:

[
H_A
]

---

# 47. Null Hypothesis

The null hypothesis represents the default assumption.

It usually says:

* no difference
* no effect
* no relationship
* parameter equals a specified value

Example:

[
H_0:\mu=100
]

---

# 48. Alternative Hypothesis

The alternative hypothesis represents what we want evidence for.

Examples:

[
H_A:\mu\ne100
]

or:

[
H_A:\mu>100
]

or:

[
H_A:\mu<100
]

---

# 49. Example of Hypothesis Testing

Suppose a manufacturer claims average battery life is:

[
100\text{ hours}
]

You suspect it is different.

Then:

[
H_0:\mu=100
]

[
H_A:\mu\ne100
]

You collect a sample and perform a statistical test.

---

# 50. Significance Level

The significance level is denoted by:

[
\alpha
]

Common values:

[
0.05
]

[
0.01
]

[
0.10
]

If:

[
\alpha=0.05
]

we are willing to tolerate a 5% Type I error rate under the test's assumptions.

---

# 51. P-Value

The p-value is:

> The probability, assuming the null hypothesis is true, of observing a result at least as extreme as the one obtained.

Decision rule:

If:

[
p\le\alpha
]

reject (H_0).

If:

[
p>\alpha
]

fail to reject (H_0).

---

# 52. Important P-Value Misconception

A p-value is **not**:

[
P(H_0\text{ is true})
]

For example:

[
p=0.03
]

does not mean:

> There is a 3% chance that the null hypothesis is true.

Instead, it means that if (H_0) were true, results this extreme or more extreme would have probability 3% under the test's model.

---

# 53. Reject vs Fail to Reject

We usually say:

### (p\le\alpha)

[
\boxed{\text{Reject }H_0}
]

### (p>\alpha)

[
\boxed{\text{Fail to reject }H_0}
]

Do not say:

> Accept (H_0)

because failing to reject the null does not prove that the null is true.

---

# PART IX — TYPE I AND TYPE II ERRORS

# 54. Type I Error

Type I error means:

> Rejecting a true null hypothesis.

Symbolically:

[
H_0\text{ true but rejected}
]

Its probability is:

[
\boxed{\alpha}
]

Example:

A drug actually has no effect, but the test concludes that it does.

This is a **false positive**.

---

# 55. Type II Error

Type II error means:

> Failing to reject a false null hypothesis.

Symbolically:

[
H_0\text{ false but not rejected}
]

Its probability is:

[
\boxed{\beta}
]

This is a **false negative**.

---

# 56. Power

Statistical power is:

[
\boxed{
Power=1-\beta
}
]

Power is the probability of correctly detecting an actual effect.

Higher power is generally desirable.

Power depends on things such as:

* sample size
* effect size
* variability
* significance level
* test design

---

# PART X — CRITICAL VALUE

# 57. Critical Value

A critical value defines a boundary between the rejection region and non-rejection region.

For example, in a two-tailed z-test with:

[
\alpha=0.05
]

the critical values are approximately:

[
-1.96
]

and:

[
+1.96
]

Decision:

[
|z|>1.96
]

means reject (H_0).

Otherwise:

[
|z|\le1.96
]

means fail to reject (H_0).

---

# 58. P-Value Method vs Critical Value Method

There are two equivalent approaches.

### P-value approach

[
p\le\alpha
\Rightarrow
\text{reject }H_0
]

### Critical-value approach

Test statistic lies in rejection region:

[
\Rightarrow
\text{reject }H_0
]

---

# PART XI — ONE-TAILED AND TWO-TAILED TESTS

# 59. Two-Tailed Test

Used when we care about deviations in either direction.

[
H_0:\mu=\mu_0
]

[
H_A:\mu\ne\mu_0
]

Example:

> Is the average battery life different from 100 hours?

Could be higher or lower.

---

# 60. Right-Tailed Test

Used when:

[
H_A:\mu>\mu_0
]

Example:

> Is the new training method increasing productivity?

---

# 61. Left-Tailed Test

Used when:

[
H_A:\mu<\mu_0
]

Example:

> Has the new process reduced manufacturing defects?

---

# 62. Visual Intuition

For a two-tailed test:

[
\text{Reject} \quad|\quad\text{Do not reject}\quad|\quad\text{Reject}
]

For a right-tailed test:

[
\text{Do not reject}\quad|\quad\text{Reject}
]

For a left-tailed test:

[
\text{Reject}\quad|\quad\text{Do not reject}
]

---

# PART XII — Z-TEST

# 63. Z-Test

A z-test is commonly used for testing a population mean when the population standard deviation is known or when large-sample normal approximations are appropriate under the relevant assumptions.

For one sample:

[
\boxed{
z=
\frac{\bar{x}-\mu_0}
{\sigma/\sqrt n}
}
]

where:

* (\bar{x}) = sample mean
* (\mu_0) = hypothesized population mean
* (\sigma) = population standard deviation
* (n) = sample size

---

# 64. Z-Test Example

Suppose:

[
\mu_0=100
]

[
\bar{x}=105
]

[
\sigma=15
]

[
n=36
]

Then:

[
z=
\frac{105-100}
{15/\sqrt{36}}
]

# [

\frac5{15/6}
]

# [

\frac5{2.5}
]

[
=2
]

For a two-tailed test at:

[
\alpha=0.05
]

critical values:

[
\pm1.96
]

Since:

[
|2|>1.96
]

we reject (H_0).

There is statistically significant evidence that the population mean differs from 100 under the test assumptions.

---

# PART XIII — T-TEST

# 65. Why Do We Need the T-Test?

Suppose population standard deviation (\sigma) is unknown.

We estimate it using sample standard deviation (s).

Then we use the t-distribution.

For a one-sample t-test:

[
\boxed{
t=
\frac{\bar{x}-\mu_0}
{s/\sqrt n}
}
]

Degrees of freedom:

[
\boxed{df=n-1}
]

---

# 66. Z-Test vs T-Test

| Z-Test                                                | T-Test                                 |
| ----------------------------------------------------- | -------------------------------------- |
| Population SD known in classical one-sample setup     | Population SD unknown                  |
| Uses normal distribution                              | Uses t-distribution                    |
| Uses (\sigma)                                         | Uses (s)                               |
| Especially common with known (\sigma)                 | Common for means with unknown (\sigma) |
| No estimated-SD degrees of freedom in standard z-test | Uses degrees of freedom                |

As (n) becomes large, the t-distribution approaches the normal distribution.

---

# 67. Types of T-Tests

There are three major forms.

### One-sample t-test

Compare one sample mean with a known/hypothesized value.

### Independent two-sample t-test

Compare means of two independent groups.

Example:

Average salary of:

* Group A
* Group B

### Paired t-test

Compare two measurements from the same subjects.

Example:

Weight:

Before treatment vs after treatment.

---

# PART XIV — CHI-SQUARE TEST

# 68. Chi-Square Test

Chi-square tests are commonly used for **categorical data**.

Two major applications:

1. Test of independence
2. Goodness-of-fit

---

# 69. Chi-Square Test of Independence

Used to determine whether two categorical variables are associated.

Example:

Is gender associated with product preference?

Suppose:

|        | Product A | Product B |
| ------ | --------: | --------: |
| Male   |        40 |        60 |
| Female |        50 |        50 |

We test:

[
H_0:
\text{Gender and product preference are independent}
]

versus:

[
H_A:
\text{Gender and product preference are associated}
]

---

# 70. Expected Frequency

For each cell:

[
\boxed{
E=
\frac{(\text{Row Total})(\text{Column Total})}
{\text{Grand Total}}
}
]

Suppose:

Row total for Male:

[
100
]

Column total for Product A:

[
90
]

Grand total:

[
200
]

Then expected frequency:

[
E=
\frac{100\times90}{200}
]

[
=45
]

---

# 71. Chi-Square Statistic

[
\boxed{
\chi^2=
\sum
\frac{(O-E)^2}{E}
}
]

where:

* (O) = observed frequency
* (E) = expected frequency

Large differences between observed and expected frequencies produce a large chi-square statistic.

---

# 72. Degrees of Freedom for Independence Test

For a contingency table with (r) rows and (c) columns:

[
\boxed{
df=(r-1)(c-1)
}
]

For a (2\times2) table:

[
df=(2-1)(2-1)=1
]

---

# 73. Chi-Square Goodness-of-Fit

Suppose a die is claimed to be fair.

Expected probability for every number:

[
\frac16
]

You roll it 600 times.

Expected frequency for each number:

[
600\times\frac16=100
]

You compare observed frequencies against expected frequencies using:

[
\chi^2=
\sum\frac{(O-E)^2}{E}
]

The test determines whether the observed deviations are larger than expected from random variation.

---

# PART XV — ANOVA

# 74. What Is ANOVA?

ANOVA stands for:

**Analysis of Variance**

It is used to compare the means of **three or more groups**.

Example:

Suppose we have exam scores from:

* Teaching Method A
* Teaching Method B
* Teaching Method C

We want to determine whether at least one group has a different mean.

---

# 75. Why Not Perform Many T-Tests?

Suppose we have four groups:

A, B, C, D.

Pairwise comparisons:

[
A-B
]

[
A-C
]

[
A-D
]

[
B-C
]

[
B-D
]

[
C-D
]

That's:

[
\binom42=6
]

tests.

As the number of comparisons increases, the chance of false positives increases if we repeatedly use ordinary 5% tests without appropriate correction.

ANOVA provides an overall test.

---

# 76. Hypotheses in ANOVA

Suppose there are (k) groups.

Null hypothesis:

[
\boxed{
H_0:
\mu_1=\mu_2=\cdots=\mu_k
}
]

Alternative:

[
\boxed{
H_A:
\text{At least one mean differs}
}
]

Important:

ANOVA does **not** directly tell you which groups differ.

If ANOVA is significant, post-hoc tests can identify specific differences.

---

# 77. Basic Idea of ANOVA

ANOVA compares two types of variation:

### Between-group variation

How different the group means are.

### Within-group variation

How much observations vary inside each group.

If between-group variation is large relative to within-group variation, the evidence for different group means becomes stronger.

---

# 78. F-Statistic

ANOVA uses:

[
\boxed{
F=
\frac{\text{Between-group variance}}
{\text{Within-group variance}}
}
]

More formally:

[
\boxed{
F=\frac{MS_{Between}}{MS_{Within}}
}
]

If the group means are genuinely similar, the F-statistic tends not to be very large.

If group means differ substantially relative to within-group noise, (F) becomes larger.

---

# 79. ANOVA Decomposition

Total variability is decomposed into:

[
\boxed{
SS_{Total}
==========

SS_{Between}
+
SS_{Within}
}
]

where:

* (SS_{Total}) = total sum of squares
* (SS_{Between}) = between-group sum of squares
* (SS_{Within}) = within-group sum of squares

Mean squares:

[
MS_{Between}
============

\frac{SS_{Between}}{df_{Between}}
]

[
MS_{Within}
===========

\frac{SS_{Within}}{df_{Within}}
]

Then:

[
F=
\frac{MS_{Between}}
{MS_{Within}}
]

---

# 80. ANOVA Example

Suppose three teaching methods produce:

### Method A

[
70,72,68
]

### Method B

[
80,82,78
]

### Method C

[
90,88,92
]

The group means are:

[
\bar X_A=70
]

[
\bar X_B=80
]

[
\bar X_C=90
]

The means are clearly separated.

ANOVA asks:

> Are these differences large enough compared with the variability within groups that we should conclude that not all population means are equal?

That is the core idea.

---

# PART XVI — STUDENT T-DISTRIBUTION

# 81. Student's t-Distribution

The t-distribution resembles the standard normal distribution but has heavier tails.

It is used when estimating a mean using a sample standard deviation rather than a known population standard deviation.

The shape depends on degrees of freedom.

---

# 82. Degrees of Freedom

For a one-sample t-test:

[
df=n-1
]

As (df) increases, the t-distribution becomes closer to:

[
N(0,1)
]

For example:

* (df=1): very heavy tails
* (df=5): still heavy tails
* (df=30): much closer to normal
* very large (df): approximately standard normal

---

# 83. Why Heavy Tails?

When (\sigma) is unknown, we estimate it from the same sample.

That creates additional uncertainty.

The t-distribution accounts for this uncertainty with heavier tails.

---

# PART XVII — CHI-SQUARE DISTRIBUTION

# 84. Chi-Square Distribution

The chi-square distribution is commonly used for:

* variance inference
* chi-square tests
* contingency tables
* goodness-of-fit
* independence tests

It is related to sums of squared standard normal variables.

If:

[
Z_1,Z_2,\ldots,Z_k
]

are independent standard normal random variables, then:

[
X=Z_1^2+Z_2^2+\cdots+Z_k^2
]

follows a chi-square distribution with (k) degrees of freedom:

[
X\sim\chi^2_k
]

---

# 85. Properties of Chi-Square Distribution

The chi-square distribution:

* cannot be negative
* is generally right-skewed for small degrees of freedom
* becomes more symmetric as degrees of freedom increase
* depends on degrees of freedom

Its support is:

[
x\ge0
]

---

# PART XVIII — COMPLETE CONNECTION BETWEEN THE TOPICS

Now let's connect everything.

Suppose you are working for an e-commerce company.

You want to determine whether a new recommendation algorithm increases purchases.

---

## Step 1: Population

All customers:

[
Population
]

---

## Step 2: Sample

Select 10,000 customers:

[
Sample
]

---

## Step 3: Random Variable

Let:

[
X=\text{number of purchases}
]

---

## Step 4: Distribution

You model the random variable using an appropriate probability distribution.

---

## Step 5: Calculate Statistics

Calculate:

[
\bar X
]

[
s
]

---

## Step 6: Sampling

Imagine repeatedly taking samples.

The distribution of sample means becomes approximately normal under suitable CLT conditions.

---

## Step 7: Hypothesis

Suppose the old average is:

[
\mu_0=3
]

You test:

[
H_0:\mu=3
]

versus:

[
H_A:\mu>3
]

---

## Step 8: Select Test

If appropriate, use a one-sample t-test or another suitable test depending on the data and assumptions.

---

## Step 9: Calculate Test Statistic

For a one-sample t-test:

[
t=
\frac{\bar{x}-\mu_0}{s/\sqrt n}
]

---

## Step 10: Calculate P-Value

Suppose:

[
p=0.002
]

Choose:

[
\alpha=0.05
]

Since:

[
0.002<0.05
]

reject (H_0).

---

## Step 11: Business Interpretation

There is statistically significant evidence, under the test assumptions, that the new algorithm increases the average purchase metric.

This is how probability and statistics are used in real Machine Learning and Data Science workflows.

---

# PART XIX — WHEN TO USE WHICH TEST

This is extremely important for interviews and practical work.

| Problem                                                  | Common Test                    |
| -------------------------------------------------------- | ------------------------------ |
| One population mean, known (\sigma)                      | One-sample z-test              |
| One population mean, unknown (\sigma)                    | One-sample t-test              |
| Compare two independent means                            | Independent two-sample t-test  |
| Compare before/after measurements                        | Paired t-test                  |
| Compare 3+ means                                         | ANOVA                          |
| Two categorical variables                                | Chi-square independence test   |
| Compare observed categorical counts with expected counts | Chi-square goodness-of-fit     |
| Population variance inference under normality            | Chi-square-based variance test |
| Relationship between categorical variables               | Chi-square test                |

---

# PART XX — DISTRIBUTION CHEAT SHEET

| Distribution   | Type       | Typical Use                                      |
| -------------- | ---------- | ------------------------------------------------ |
| Bernoulli      | Discrete   | One binary trial                                 |
| Binomial       | Discrete   | Number of successes in (n) trials                |
| Normal         | Continuous | Continuous measurements, sampling approximations |
| t-distribution | Continuous | Mean inference with unknown (\sigma)             |
| Chi-square     | Continuous | Variance/categorical count procedures            |
| F-distribution | Continuous | ANOVA and variance-ratio procedures              |

---

# PART XXI — IMPORTANT FORMULAS

## Probability

[
P(A^c)=1-P(A)
]

[
P(A\cup B)
==========

P(A)+P(B)-P(A\cap B)
]

[
P(A|B)
======

\frac{P(A\cap B)}{P(B)}
]

[
P(A\cap B)
==========

P(A|B)P(B)
]

---

## Bayes

[
\boxed{
P(A|B)
======

\frac{P(B|A)P(A)}
{P(B)}
}
]

---

## Independence

[
\boxed{
P(A\cap B)=P(A)P(B)
}
]

---

## Expectation

[
\boxed{
E[X]=\sum_xxP(X=x)
}
]

---

## Variance

[
\boxed{
Var(X)=E[X^2]-[E(X)]^2
}
]

---

## Standard deviation

[
\boxed{
\sigma=\sqrt{Var(X)}
}
]

---

## Binomial

[
\boxed{
P(X=k)=
{n\choose k}p^k(1-p)^{n-k}
}
]

[
E[X]=np
]

[
Var(X)=np(1-p)
]

---

## Z-score

[
\boxed{
z=\frac{x-\mu}{\sigma}
}
]

---

## Standard Error

[
\boxed{
SE(\bar X)=\frac{\sigma}{\sqrt n}
}
]

or, when estimating (\sigma) using the sample:

[
SE(\bar X)=\frac{s}{\sqrt n}
]

---

## One-sample Z-test

[
\boxed{
z=
\frac{\bar{x}-\mu_0}
{\sigma/\sqrt n}
}
]

---

## One-sample T-test

[
\boxed{
t=
\frac{\bar{x}-\mu_0}
{s/\sqrt n}
}
]

[
df=n-1
]

---

## Chi-square

[
\boxed{
\chi^2=
\sum\frac{(O-E)^2}{E}
}
]

---

## Expected Frequency

[
\boxed{
E=
\frac{Row\ Total\times Column\ Total}
{Grand\ Total}
}
]

---

## ANOVA

[
\boxed{
F=
\frac{MS_{Between}}
{MS_{Within}}
}
]

and:

[
SS_{Total}
==========

SS_{Between}+SS_{Within}
]

---

# PART XXII — PRACTICE QUESTIONS

## Level 1 — Probability Fundamentals

### Q1

A fair die is rolled once. What is the probability of getting an even number?

### Q2

A coin is tossed twice. What is the probability of getting at least one Head?

### Q3

A card is drawn from a standard 52-card deck. What is the probability of drawing a King?

### Q4

If:

[
P(A)=0.7
]

what is:

[
P(A^c)?
]

### Q5

If:

[
P(A)=0.5
]

[
P(B)=0.4
]

and (A) and (B) are independent, calculate:

[
P(A\cap B)
]

---

# Level 2 — Conditional Probability

### Q6

A class has 100 students.

* 60 are male.
* 40 are female.
* 45 males passed.
* 30 females passed.

Find:

[
P(Passed|Male)
]

---

### Q7

Given:

[
P(A)=0.6
]

[
P(B)=0.5
]

[
P(A\cap B)=0.3
]

Find:

[
P(A|B)
]

---

# Level 3 — Bayes' Theorem

### Q8

A disease affects 2% of the population.

A diagnostic test has:

[
P(+|D)=0.95
]

and:

[
P(+|D^c)=0.05
]

Find:

[
P(D|+)
]

---

# Level 4 — Random Variables

### Q9

Suppose:

| X | P(X) |
| - | ---: |
| 0 |  0.2 |
| 1 |  0.5 |
| 2 |  0.3 |

Calculate:

1. (E[X])
2. (E[X^2])
3. (Var(X))
4. Standard deviation

---

# Level 5 — Binomial

### Q10

A fair coin is tossed 10 times.

What is the probability of getting exactly 6 Heads?

Use:

[
P(X=k)=
{n\choose k}p^k(1-p)^{n-k}
]

---

### Q11

A machine produces defective items with probability:

[
p=0.02
]

Suppose 100 items are produced independently.

Find the expected number of defective items.

---

# Level 6 — Normal Distribution

### Q12

Exam scores have:

[
\mu=70
]

[
\sigma=10
]

A student scores 90.

Calculate the z-score.

---

### Q13

What percentage of observations approximately lie within two standard deviations of the mean for a normal distribution?

---

# Level 7 — Central Limit Theorem

### Q14

A population has:

[
\mu=50
]

[
\sigma=20
]

A sample of:

[
n=100
]

is taken.

Find the standard error of the sample mean.

---

# Level 8 — Hypothesis Testing

### Q15

A company claims that the average battery life is 100 hours.

You want to determine whether the true average is different.

Write:

[
H_0
]

and:

[
H_A
]

---

### Q16

A test produces:

[
p=0.03
]

and:

[
\alpha=0.05
]

What is your decision?

---

### Q17

A test produces:

[
p=0.08
]

and:

[
\alpha=0.05
]

What is your decision?

---

# Level 9 — Z-Test

### Q18

A population has known standard deviation:

[
\sigma=10
]

A sample of:

[
n=100
]

has mean:

[
\bar{x}=52
]

Test:

[
H_0:\mu=50
]

against:

[
H_A:\mu\ne50
]

at:

[
\alpha=0.05
]

Calculate the z-statistic and make a decision.

---

# Level 10 — T-Test

### Q19

A sample has:

[
n=16
]

[
\bar{x}=105
]

[
s=8
]

Test:

[
H_0:\mu=100
]

Calculate the t-statistic.

Also calculate degrees of freedom.

---

# Level 11 — Chi-Square

### Q20

Suppose:

|        | Buy | Don't Buy |
| ------ | --: | --------: |
| Male   |  40 |        60 |
| Female |  30 |        70 |

Test whether gender and purchase decision are independent.

Calculate the expected frequencies.

---

# Level 12 — ANOVA

### Q21

Three groups have the following observations:

[
A={10,12,11}
]

[
B={20,19,21}
]

[
C={30,31,29}
]

Answer conceptually:

1. What is (H_0)?
2. What is (H_A)?
3. Why is ANOVA preferable to doing multiple t-tests?
4. What does a large F-statistic indicate?

---

# PART XXIII — SOLUTIONS

## Solution 1

Even numbers:

[
{2,4,6}
]

Total outcomes:

[
6
]

Therefore:

[
P(Even)=\frac36=\boxed{\frac12}
]

---

## Solution 2

Sample space:

[
{HH,HT,TH,TT}
]

At least one Head:

[
{HH,HT,TH}
]

Therefore:

[
P(\text{at least one H})=\frac34
]

[
\boxed{0.75}
]

---

## Solution 3

There are 4 Kings.

[
P(King)=\frac4{52}
]

[
=\boxed{\frac1{13}}
]

---

## Solution 4

[
P(A^c)=1-P(A)
]

[
=1-0.7
]

[
\boxed{0.3}
]

---

## Solution 5

Because they are independent:

[
P(A\cap B)=P(A)P(B)
]

[
=0.5(0.4)
]

[
\boxed{0.2}
]

---

## Solution 6

There are 60 males.

45 passed.

Therefore:

[
P(Passed|Male)=\frac{45}{60}
]

[
=\boxed{0.75}
]

---

## Solution 7

[
P(A|B)=
\frac{P(A\cap B)}
{P(B)}
]

[
=\frac{0.3}{0.5}
]

[
\boxed{0.6}
]

---

## Solution 8

Given:

[
P(D)=0.02
]

[
P(D^c)=0.98
]

[
P(+|D)=0.95
]

[
P(+|D^c)=0.05
]

First:

[
P(+)
====

0.95(0.02)+0.05(0.98)
]

[
=0.019+0.049
]

[
=0.068
]

Bayes:

[
P(D|+)
======

\frac{0.95(0.02)}
{0.068}
]

[
\approx0.2794
]

Therefore:

[
\boxed{P(D|+)\approx27.94%}
]

Again, notice that the positive predictive probability is much lower than 95% because the disease is relatively rare.

---

## Solution 9

[
E[X]
====

0(0.2)+1(0.5)+2(0.3)
]

[
=0+0.5+0.6
]

[
\boxed{E[X]=1.1}
]

Next:

[
E[X^2]
======

0^2(0.2)+1^2(0.5)+2^2(0.3)
]

[
=0+0.5+1.2
]

[
=1.7
]

Variance:

[
Var(X)=E[X^2]-[E(X)]^2
]

[
=1.7-(1.1)^2
]

[
=1.7-1.21
]

[
=\boxed{0.49}
]

Standard deviation:

[
\sigma=\sqrt{0.49}
]

[
\boxed{\sigma=0.7}
]

---

## Solution 10

[
n=10
]

[
k=6
]

[
p=0.5
]

Therefore:

[
P(X=6)
======

{10\choose6}
(0.5)^6
(0.5)^4
]

# [

210(0.5)^{10}
]

[
\boxed{P(X=6)\approx0.2051}
]

---

## Solution 11

For binomial:

[
E[X]=np
]

Therefore:

[
E[X]=100(0.02)
]

[
\boxed{2}
]

Expected number of defective products is 2.

---

## Solution 12

[
z=\frac{x-\mu}{\sigma}
]

[
=\frac{90-70}{10}
]

[
=\boxed{2}
]

The student is 2 standard deviations above the mean.

---

## Solution 13

Approximately:

[
\boxed{95%}
]

---

## Solution 14

[
SE=\frac{\sigma}{\sqrt n}
]

[
=\frac{20}{\sqrt{100}}
]

[
=\frac{20}{10}
]

[
\boxed{2}
]

---

## Solution 15

The company claims:

[
\mu=100
]

Therefore:

[
\boxed{H_0:\mu=100}
]

Because we want to determine whether it is different:

[
\boxed{H_A:\mu\ne100}
]

This is a two-tailed test.

---

## Solution 16

[
p=0.03
]

[
\alpha=0.05
]

Since:

[
p<\alpha
]

we reject the null hypothesis.

[
\boxed{\text{Reject }H_0}
]

---

## Solution 17

[
p=0.08
]

[
\alpha=0.05
]

Since:

[
p>\alpha
]

we fail to reject the null hypothesis.

[
\boxed{\text{Fail to reject }H_0}
]

---

## Solution 18

[
z=
\frac{\bar{x}-\mu_0}
{\sigma/\sqrt n}
]

# [

\frac{52-50}
{10/\sqrt{100}}
]

# [

\frac2{1}
]

[
\boxed{z=2}
]

For a two-tailed test at:

[
\alpha=0.05
]

critical values:

[
\pm1.96
]

Since:

[
2>1.96
]

we reject:

[
H_0
]

---

## Solution 19

[
t=
\frac{\bar{x}-\mu_0}
{s/\sqrt n}
]

# [

\frac{105-100}
{8/\sqrt{16}}
]

# [

\frac5{8/4}
]

# [

\frac52
]

[
\boxed{t=2.5}
]

Degrees of freedom:

[
df=n-1
]

[
=16-1
]

[
\boxed{df=15}
]

---

## Solution 20

Observed table:

|        | Buy | Don't Buy | Total |
| ------ | --: | --------: | ----: |
| Male   |  40 |        60 |   100 |
| Female |  30 |        70 |   100 |
| Total  |  70 |       130 |   200 |

Expected Male-Buy:

[
E=
\frac{100(70)}{200}
]

[
=35
]

Expected Male-Don't Buy:

[
E=
\frac{100(130)}{200}
]

[
=65
]

Similarly:

Female-Buy:

[
35
]

Female-Don't Buy:

[
65
]

Expected table:

|        | Buy | Don't Buy |
| ------ | --: | --------: |
| Male   |  35 |        65 |
| Female |  35 |        65 |

Then:

[
\chi^2=
\sum\frac{(O-E)^2}{E}
]

# [

\frac{(40-35)^2}{35}
+
\frac{(60-65)^2}{65}
+
\frac{(30-35)^2}{35}
+
\frac{(70-65)^2}{65}
]

[
\approx2.198
]

Degrees of freedom:

[
df=(2-1)(2-1)=1
]

You would compare this statistic with the appropriate chi-square distribution or compute the p-value.

---

# PART XXIV — IMPORTANT CONCEPTUAL QUESTIONS

These are the kinds of questions you should be able to answer without calculations.

### 1. What is the difference between probability and statistics?

**Probability** starts with a model and predicts possible outcomes.

**Statistics** starts with observed data and tries to infer the underlying population/model.

---

### 2. What is the difference between PMF and PDF?

PMF:

Used for discrete random variables.

[
P(X=x)
]

PDF:

Used for continuous random variables.

[
f(x)
]

For continuous variables:

[
P(X=x)=0
]

but:

[
P(a<X<b)
]

can be positive.

---

### 3. Why do we use (n-1) for sample variance?

Because estimating the population mean from the same sample consumes one degree of freedom. Dividing by (n-1) provides the usual unbiased estimator of population variance under the standard assumptions.

---

### 4. Why does standard error decrease with sample size?

Because:

[
SE=\frac{\sigma}{\sqrt n}
]

As (n) increases, (\sqrt n) increases, so SE decreases.

---

### 5. What does CLT tell us?

Under suitable conditions, the sampling distribution of the sample mean becomes approximately normal as sample size becomes sufficiently large, regardless of the population's original distribution.

---

### 6. Why is the t-distribution used?

Because when population standard deviation is unknown, we estimate it using the sample standard deviation. The t-distribution accounts for that additional uncertainty.

---

### 7. What does a p-value tell us?

It measures how unusual the observed result, or something more extreme, would be if the null hypothesis were true.

---

### 8. What is Type I error?

False positive.

[
\boxed{\text{Reject true }H_0}
]

---

### 9. What is Type II error?

False negative.

[
\boxed{\text{Fail to reject false }H_0}
]

---

### 10. What is statistical power?

[
\boxed{Power=1-\beta}
]

It is the probability of detecting an effect when the alternative is actually true, under the specified testing setup.

---

### 11. When should we use ANOVA?

When comparing the means of three or more groups in a setting where the assumptions of the chosen ANOVA procedure are reasonably appropriate.

---

### 12. Does significant ANOVA mean all groups are different?

No.

It means:

[
\boxed{\text{At least one population mean differs}}
]

You need an appropriate post-hoc procedure to determine which groups differ.

---

# PART XXV — THE MOST IMPORTANT DISTINCTIONS TO MEMORIZE

## Probability vs Conditional Probability

[
P(A)
]

asks:

> What is the probability of A?

while:

[
P(A|B)
]

asks:

> What is the probability of A after knowing B occurred?

---

## Independent vs Mutually Exclusive

Independent:

[
P(A\cap B)=P(A)P(B)
]

Mutually exclusive:

[
P(A\cap B)=0
]

---

## Population vs Sample

Population:

[
\mu,\sigma
]

Sample:

[
\bar{x},s
]

---

## Parameter vs Statistic

Parameter describes population.

Statistic describes sample.

---

## Variance vs Standard Deviation

[
Variance=\sigma^2
]

[
Standard\ Deviation=\sigma
]

---

## Standard Deviation vs Standard Error

Standard deviation:

> How spread out individual observations are.

Standard error:

> How spread out an estimator such as the sample mean would be across repeated samples.

---

## Z-Test vs T-Test

Z:

[
\frac{\bar{x}-\mu_0}{\sigma/\sqrt n}
]

T:

[
\frac{\bar{x}-\mu_0}{s/\sqrt n}
]

---

## One-Tailed vs Two-Tailed

One-tailed:

[

> ,<
> ]

Two-tailed:

[
\ne
]

---

## Type I vs Type II

Type I:

[
\text{False positive}
]

Type II:

[
\text{False negative}
]

---

## Chi-Square vs ANOVA

Chi-square:

> Primarily categorical/count data.

ANOVA:

> Compare means of multiple groups.

---

# PART XXVI — MACHINE LEARNING CONNECTION

These concepts are not just academic statistics.

They appear throughout ML.

### Probability

Used in:

* Naive Bayes
* Bayesian inference
* probabilistic models
* classification
* uncertainty estimation

### Conditional Probability

Used in:

[
P(Y|X)
]

which is fundamental to probabilistic classification.

### Bayes' Theorem

Used in:

* Naive Bayes
* Bayesian inference
* medical diagnosis
* spam filtering
* probabilistic reasoning

### Random Variables

Machine-learning features and targets can be viewed as random variables.

### Expected Value

Used extensively in:

* loss functions
* risk minimization
* probabilistic models
* reinforcement learning

### Variance

Important for:

* feature analysis
* model uncertainty
* bias-variance tradeoff
* statistical estimation

### Normal Distribution

Appears in:

* Gaussian models
* Gaussian Naive Bayes
* Gaussian mixtures
* error modeling
* statistical inference

### CLT

Provides theoretical justification for many sampling and inference procedures.

### Hypothesis Testing

Used in:

* A/B testing
* feature selection
* experimental analysis
* model comparison
* business experimentation

### Chi-Square

Useful for:

* categorical feature analysis
* independence testing
* feature selection

### ANOVA

Useful for:

* comparing groups
* experimental design
* analyzing categorical factors
* understanding whether group membership explains variation

---

# FINAL MENTAL MAP

You should remember the entire chapter like this:

```text
                         PROBABILITY
                              |
             +----------------+----------------+
             |                                 |
       Random Experiment                  Events
             |                                 |
       Sample Space                    Conditional Probability
             |                                 |
      Random Variables                      Bayes
             |
      +------+------+
      |             |
  Discrete       Continuous
      |             |
     PMF           PDF
      |             |
  Binomial        Normal
      |             |
      +------+------+
             |
       Expected Value
             |
         Variance
             |
     Standard Deviation
             |
      Sampling & Samples
             |
            CLT
             |
      Sampling Distribution
             |
       Statistical Inference
             |
      Hypothesis Testing
             |
      +------+------+---------+
      |      |      |         |
    Z-Test T-Test Chi-Square ANOVA
      |      |      |         |
      +------+------+---------+
             |
        P-Value / Critical
             |
      Statistical Decision
```

The **most important progression** for your Machine Learning preparation is:

[
\boxed{
Probability
\rightarrow
Random Variables
\rightarrow
Distributions
\rightarrow
Expectation/Variance
\rightarrow
Sampling
\rightarrow
CLT
\rightarrow
Hypothesis Testing
\rightarrow
Statistical Tests
}
]

Once this chain is clear, topics such as **confidence intervals, A/B testing, regression inference, maximum likelihood estimation, Bayesian ML, bias-variance, and many ML algorithms** become much easier to understand.
