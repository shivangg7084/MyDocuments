# 02 — Exploratory Data Analysis & Data Preprocessing

> Source: `Machine_Learning_-_Exploratory_Data_Analysis_-_Data_Preprocessing.pdf`

---

## 1. What is Data Preprocessing?

### The idea in one sentence

**Raw data is messy. Cleaning and reshaping it so an algorithm can actually use it is called data preprocessing.**

**Analogy:** you cannot cook with vegetables straight from the field. You wash off the mud, cut away the rotten parts, chop everything to a similar size. Preprocessing is exactly that — and just like cooking, it takes far longer than the "clever" part that follows.

### What a raw dataset actually looks like

| Name | Age | Salary | City | Bought |
|---|---|---|---|---|
| Ravi | 25 | 40000 | Delhi | Yes |
| Priya | **?** | 85000 | Mumbai | No |
| Amit | 31 | **(blank)** | Delhi | Yes |
| Sara | **200** | 62000 | Pune | No |

Four separate problems are visible in four rows:
1. **Priya's age is missing** (shown as `?`)
2. **Amit's salary is missing** (blank)
3. **Sara is 200 years old** — an outlier, almost certainly a typo
4. **City is text** — the model cannot do arithmetic on the word "Delhi"

And a fifth problem is invisible: **Age runs 25–31 while Salary runs 40000–85000.** Any algorithm that measures distance will treat salary as thousands of times more important, purely because of its units.

Preprocessing fixes all five.

### Points from the slides

- Data scientists usually come across raw datasets that **contain noise** and are **not fit to be readily processed** by ML algorithms.
- The data must be preprocessed **before** it is fed into ML algorithms.
- **Data Preprocessing = the process of preparing the data for analysis.**
- Preprocessing takes the **major chunk of model-building effort**, depending on the dataset.
- There are **statistical, mathematical, computational and graphical** techniques available.
- These techniques are **not limited in number** and **may not be performed in any fixed order**. Some datasets need a lot of preprocessing, others very little.

> **Why "no fixed order" matters:** you might scale before encoding, or encode before scaling. There is no single correct pipeline — it depends on your data and your algorithm.

---

## 2. The Standard Preprocessing Techniques (list them!)

1. Data loading (into data frames)
2. Handling missing data
3. Handling outliers
4. Scaling
5. Normalization
6. Binarization
7. Standardization
8. Label Encoding
9. One Hot Encoding
10. Data Visualization
11. Feature Engineering
12. Dimensionality Reduction

**Example dataset used throughout the slides:** *Census Income data* (the "Adult" dataset) from the **UCI Machine Learning Repository**, extracted from the census bureau database. The task is to predict whether a person earns `<=50K` or `>50K`.

---

## 3. Handling Missing Data

### 3.1 What counts as missing data?
A missing value can appear as:
- a **blank**,
- **NaN** (Not a Number), or
- a **special symbol** representing missing data — in the Census dataset it is a **`?`**.

> **Watch out:** the `?` is the sneaky one. Pandas sees `'?'` as an ordinary string, so `isnull()` returns **False** and you will believe your data is clean when it is not. Always run `.unique()` on your columns to spot such placeholders.

### 3.2 Why does data go missing?
- **Not recorded** during creation (the sensor was offline)
- **Optional entry** (the person simply didn't fill the field)
- **Data corruption** (a file transfer went wrong)

### 3.3 Why must we handle it?
Because **most machine learning algorithms do not support data with missing values** — they will throw an error or silently behave wrongly. You cannot compute a distance to a point whose coordinate is unknown.

### 3.4 The four techniques, with a worked example

Take this small dataset:

| Student | Sub1 | Sub2 | Sub3 |
|---|---|---|---|
| A | 95 | 85 | 30 |
| B | 93 | **NaN** | 45 |
| C | 94 | 90 | 55 |
| D | 85 | 75 | **NaN** |
| E | **NaN** | **NaN** | **NaN** |

**(a) Deleting rows with missing data**
- Delete the row if it has a lot of missing values.
- It is a **fail-safe method**, advisable **if the dataset is large enough**.
- **Not advisable** if data is small or many records have missing data — you throw away information you paid to collect.

*Applied here:* Student **E** has nothing at all, so drop that row — no loss. But dropping B, C and D too would leave you with a single student.

**(b) Replace with statistical values — "Data Imputation"**
- Replace missing values with the **Mean / Median / Mode** of that attribute's distribution.
- This process is called **data imputation**.
- **Better approach if the dataset is small** — it prevents data loss.
- **Drawback:** the imputed value **may add bias or variance.**

*Applied here:* Sub2's known values are 85, 90, 75 → mean = **83.33**. So B's Sub2 becomes 83.33.

> **Mean or median?** Use the **mean** for roughly symmetric data. Use the **median** when there are outliers — one CEO earning ₹10 crore drags the mean salary up absurdly, while the median barely moves.

**(c) Missing categorical values**
- Replacing with statistical values works **only for numerical data** — there is no "average" of Delhi and Mumbai.
- For categorical missing values you can:
  - create a **unique new category** for "missing" (sometimes the fact that it is missing is itself informative), or
  - replace with the **most-occurring category (mode)**.
- If there is **a lot** of missing data in that variable, it is **better to exclude the variable** from model building.

**(d) Predicting missing values**
- Missing values can be **predicted using existing algorithms/libraries.**
- Or by **building a model using the rest of the data** of the same dataset — treat the incomplete column as the target and the other columns as features. Most accurate, most effort.

### 3.5 Pandas commands you must recognise

```python
import pandas as pd
import numpy as np

data.isnull()                    # True/False table of what is missing
data.dropna(how='all')           # drop rows where ALL values are null
data.fillna(0)                   # fill every missing value with 0
data.replace(to_replace=np.nan, value=-1)     # replace NaN with -1
data.fillna(data.mean())         # fill each column with that column's mean
data.interpolate(method='linear', limit_direction='forward')   # imputation function
```

> **`how='all'` vs `how='any'`:** `how='all'` drops a row only if *every* value is null (safe — Student E). `how='any'` drops a row if *even one* value is null (aggressive — it would delete B, D and E).

> **Note from the slides:** the Census Income dataset has **no NaN missing values** — instead it uses `' ?'`.

---

## 4. Handling Outliers

### 4.1 What is an outlier?
> An **observation in a dataset that is different from, or far away from, the other observations.**

*Example:* in a class where everyone scored 60–80, someone scoring **5** or **100** is an outlier.

An outlier can happen because of:
- an **error scenario** — a typo, a broken sensor, wrong units (age 200)
- a **genuine scenario** — a real but unusual case (a genuinely 20-year-old millionaire)

**Why they matter:** outliers drag the mean around and distort a fitted line. One house priced at ₹50 crore among ₹50-lakh houses will tilt your entire regression.

### 4.2 Four ways to identify outliers

| Method | Type | How it works |
|---|---|---|
| **Box plot** | Graphical | Depicts numerical data through its **quartiles**; points beyond the whiskers are outliers |
| **Scatter plot** | Graphical | Shows the **relation between two variables**; stray points stand out visually |
| **Z-score** | Statistical | Describes a point by its relationship with the **mean and standard deviation** |
| **IQR** | Statistical | Uses the spread between quartiles |

### 4.3 Z-score — worked example
- The Z-score describes a data point by finding its **relationship with the Standard Deviation and the Mean** of the group of data points.
- **Rule from the slides:** in most cases, if the **Z-score > 3 or < −3**, the point is identified as an **outlier**.

```
Z = (value − mean) / standard deviation
```

*Worked example:* ages with **mean = 38** and **standard deviation = 13**.

| Age | Z-score | Verdict |
|---|---|---|
| 45 | (45−38)/13 = **0.54** | Normal |
| 60 | (60−38)/13 = **1.69** | Normal |
| 90 | (90−38)/13 = **4.00** | **Outlier** (> 3) |

**Plain meaning of Z:** *how many standard deviations away from average is this point?* A Z of 4 means "four standard deviations out" — very rare in normally distributed data.

```python
from scipy import stats
import numpy as np
z_score = np.abs(stats.zscore(census_income['age']))
print(census_income.iloc[np.where(z_score > 3)].head())
```

### 4.4 IQR — worked example
- The IQR is a **measure of statistical dispersion.**
- **IQR = Q3 − Q1** = difference between the **75th and 25th percentiles** (upper and lower quartiles).
- **Box plots use the IQR method** to display data and outliers pictorially.
- Outliers are points **below `Q1 − 1.5 × IQR`** or **above `Q3 + 1.5 × IQR`**.

*Worked example:* suppose for `age`, **Q1 = 28** and **Q3 = 48**.

```
IQR         = 48 − 28            = 20
Lower fence = 28 − 1.5 × 20      = 28 − 30 = −2
Upper fence = 48 + 1.5 × 20      = 48 + 30 = 78
```

So **any age above 78 is flagged as an outlier** (and no age can be below −2, so there is no lower outlier here). This matches the slides, which note that in the box plot of age, points **between 80–90 years are outliers**.

> **Q1, Q2, Q3 in plain terms:** sort the data; **Q1** is the value below which 25% of the data falls, **Q2** is the median (50%), **Q3** is the 75% point. The IQR is the range of the "middle half" of your data — deliberately ignoring the extremes, which is what makes it robust.

```python
Q1 = census_income['age'].quantile(0.25)
Q3 = census_income['age'].quantile(0.75)
IQR = Q3 - Q1
census_income[(census_income['age'] < (Q1 - 1.5*IQR)) |
              (census_income['age'] > (Q3 + 1.5*IQR))]
```

### 4.5 What to do with an outlier?
The identified outliers can be **corrected, removed, or treated separately** — but **the decision depends on the scenario**:

- Outlier due to **incorrect data entry** → **Remove or Correct**
  *(Age 200 is impossible. Someone typed 200 instead of 20 — fix it or drop it.)*
- Outlier due to **exceptional genuine cases** (students with high IQ, high income at a young age) → **Keep / Handle**
  *(A 22-year-old earning ₹80 lakh is unusual but real. Delete it and your model will never predict such people — and in fraud detection, the outliers **are** the thing you are hunting.)*

> **The rule of thumb: never delete an outlier just because it is inconvenient. Ask first whether it is an error or a fact.**

---

## 5. Scaling, Normalization and Standardization

**Why bother?** The values of some features can vary over wildly different ranges, **which may cause issues while model building.**

*Concrete failure:* two people differ by 1 year of age and ₹10,000 of salary. A distance-based algorithm computes:

```
distance = √( (1)² + (10000)² ) ≈ 10000
```

The age difference has effectively vanished. The algorithm is now judging on salary alone — not because salary matters more, but because rupees are smaller units than years. Scaling fixes this.

### 5.1 Scaling (Min-Max)
Squeezes values into a given range, usually **(0, 1)**.

```
x_scaled = (x − min) / (max − min)
```

*Worked example:* ages with min = 20, max = 60.

| Age | Calculation | Scaled |
|---|---|---|
| 20 | (20−20)/40 | **0.00** |
| 30 | (30−20)/40 | **0.25** |
| 60 | (60−20)/40 | **1.00** |

```python
from sklearn import preprocessing
data_scaler = preprocessing.MinMaxScaler(feature_range=(0, 1))
data_scaled = data_scaler.fit_transform(input_data)
```

### 5.2 Normalization
Rescales each **row** so its values sum (in some norm) to 1 — useful when you care about proportions rather than magnitudes.

```python
data_normalized = preprocessing.normalize(input_data, norm='l1')
```

*L1 example:* the row `[2, 3, 5]` sums to 10, so it becomes `[0.2, 0.3, 0.5]`.

### 5.3 Standardization
> **Definition (memorise):** Standardization transforms attributes with a **Gaussian distribution** and **differing means and standard deviations** into a **standard Gaussian distribution with mean = 0 and standard deviation = 1.**

```
x_standardized = (x − mean) / standard deviation
```

*Worked example:* ages with mean = 40, std = 10.

| Age | Calculation | Standardized |
|---|---|---|
| 30 | (30−40)/10 | **−1.0** |
| 40 | (40−40)/10 | **0.0** |
| 55 | (55−40)/10 | **+1.5** |

Notice that this is **exactly the Z-score formula** — standardizing a column *is* converting every value to its Z-score.

```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler().fit(input_data)
scaler.transform(input_data)
```

### Which one should I use?

| | **Min-Max Scaling** | **Standardization** |
|---|---|---|
| Result | Fixed range, e.g. [0, 1] | Mean 0, std 1 (unbounded) |
| Formula | (x − min)/(max − min) | (x − mean)/std |
| sklearn | `MinMaxScaler` | `StandardScaler` |
| Assumes | Nothing about the distribution | Roughly Gaussian data |
| Weakness | **One outlier ruins it** — a single value of 1,000,000 squashes everything else near 0 | Handles outliers better |
| Use for | Neural networks, image pixels | Most classical ML; **required before PCA** |

### 5.4 Binarization
Converts numeric values into **0 / 1** based on a threshold. *Example:* with a threshold of 50 marks, `[35, 72, 50, 91] → [0, 1, 0, 1]` — turning "marks" into "pass/fail".

---

## 6. Further Formatting / Discrepancy Checks

Use `.unique()` to see every distinct value in a column — this is how hidden junk gets caught:

```python
census_income['workClass'].unique()
# array([' State-gov', ' Self-emp-not-inc', ' Private', ' Federal-gov',
#        ' Local-gov', ' ?', ' Self-emp-inc', ' Without-pay', ' Never-worked'])
```

There it is: **`' ?'` hiding among the legitimate categories** — invisible to `isnull()`. Notice also the leading spaces in every value, another classic real-world annoyance.

In the Census dataset three features contain `'?'`:
- **workClass**
- **occupation**
- **native-country**

Those rows are dropped:
```python
census_income = census_income[census_income['workClass'] != ' ?']
census_income = census_income[census_income['occupation'] != ' ?']
census_income[census_income['native-country'] != ' ?']
```

---

## 7. Encoding Categorical Variables

Models do arithmetic. Arithmetic needs numbers. So text categories must be converted.

### 7.1 Label Encoding
**Converts each value in a column into a number.**

| City | → Label Encoded |
|---|---|
| Delhi | 0 |
| Mumbai | 1 |
| Pune | 2 |

```python
from sklearn.preprocessing import LabelEncoder
categorical_features = list(df.select_dtypes(include=['object']).columns)
for feature in categorical_features:
    df[feature] = LabelEncoder().fit_transform(df[feature])
```

### 7.2 One-Hot Encoding

**The problem with Label Encoding:** giving numbers to categories **might confuse the model into thinking the column has some kind of order or hierarchy when we clearly don't have it.**

Look at what the model now believes:
- `Pune (2) > Mumbai (1) > Delhi (0)` — a ranking that does not exist
- `(Delhi + Pune)/2 = 1 = Mumbai` — Mumbai is somehow the average of Delhi and Pune!

Both are nonsense, and a linear model will act on them.

**One-Hot encoding solves this issue.** It **splits the column into multiple binary (0/1) columns**, one per category:

| City | → | is_Delhi | is_Mumbai | is_Pune |
|---|---|---|---|---|
| Delhi | | **1** | 0 | 0 |
| Mumbai | | 0 | **1** | 0 |
| Pune | | 0 | 0 | **1** |

Now no category is larger than another — they are just three independent yes/no questions.

```python
dummies = pd.get_dummies(df[feature], prefix=feature, drop_first=False)
df = pd.concat([df, dummies], axis=1)
df = df.drop([feature], axis=1)
```

| | Label Encoding | One-Hot Encoding |
|---|---|---|
| Output | One column of integers | Many 0/1 columns |
| Implies a false order? | **Yes (the problem)** | **No** |
| Column count | Unchanged | Grows with the number of categories |
| Best for | **Ordinal** data with a real order (Low < Medium < High) | **Nominal** data with no order (city, colour) |
| Danger | Fake hierarchy | Hundreds of columns if the category has many values |

> **The honest summary:** use label encoding when an order genuinely exists (Small/Medium/Large), one-hot when it does not (Delhi/Mumbai/Pune).

---

## 8. EDA Plots

**Exploratory Data Analysis (EDA) is majorly done using plots.** Before modelling anything, *look* at your data — plots reveal in one second what a table of numbers hides.

### 8.1 Histogram — the shape of one column
Shows the **distribution** of a numeric column: where values pile up, whether it is symmetric or skewed.
```python
census_income.hist(edgecolor='black', linewidth=1.2, color='c')
```
*What to look for:* a long tail to the right (skew), or two separate humps (two hidden sub-populations).

### 8.2 Heat Map / Correlogram — how columns relate
Shows the **correlation matrix** between all numeric columns as a coloured grid, where the colour tells you the strength and direction of each relationship.
```python
sns.heatmap(census_income.corr(),
            xticklabels=census_income.corr().columns,
            yticklabels=census_income.corr().columns,
            cmap='RdYlGn', center=0, annot=True)
```
*What to look for:* two features with a correlation near **+1 or −1** are saying the same thing — that is **multicollinearity**, and you probably want to drop one.

### 8.3 Pairs Plot — everything against everything
Plots **every variable against every other variable** as a grid of scatter plots, colour-coded by class.
```python
sns.pairplot(census_income, kind="scatter", hue="income")
```
*What to look for:* a panel where the two colours separate cleanly — that pair of features alone can already classify well.

### 8.4 Box plot & Scatter plot (used for outliers)
```python
import seaborn as sns
sns.boxplot(x=census_income['age'])     # outliers visible beyond the whiskers
plt.scatter(census_income['workClass'], census_income['capital-gain'])
```

**How to read a box plot:** the **box** spans Q1 to Q3 (the middle 50% of your data), the **line inside** is the median, the **whiskers** reach out to 1.5×IQR, and **every dot beyond a whisker is a flagged outlier.**

---

# MCQ Practice — EDA & Data Preprocessing

**Q1.** Data preprocessing is best defined as:
- A) Training the model
- B) The process of preparing the data for analysis
- C) Evaluating the model
- D) Deploying the model

**Q2.** Which of the following is NOT listed as a data preprocessing technique?
- A) Label Encoding
- B) Binarization
- C) Back-propagation
- D) One Hot Encoding

**Q3.** Missing data in a dataset may appear as:
- A) Blank
- B) NaN
- C) A special symbol
- D) All of the above

**Q4.** Replacing missing values with the mean/median/mode of the attribute is called:
- A) Normalization
- B) Data imputation
- C) Binarization
- D) Encoding

**Q5.** Deleting rows with missing values is advisable when:
- A) The dataset is very small
- B) The dataset is large enough
- C) All rows have missing values
- D) The target is categorical

**Q6.** A drawback of replacing missing values with statistical values is:
- A) It always deletes data
- B) The imputed value may add bias or variance
- C) It only works on categorical data
- D) It requires GPU

**Q7.** For a **categorical** column with missing values, a valid approach is:
- A) Replace with the column mean
- B) Replace with the most-occurred category or create a new "missing" category
- C) Replace with the standard deviation
- D) Replace with the median

**Q8.** An outlier is:
- A) A missing value
- B) An observation far away from the other observations
- C) The mean of the data
- D) A duplicated row

**Q9.** Which of these is NOT a method of identifying outliers listed in the slides?
- A) Box plot
- B) Z-score
- C) IQR
- D) One-Hot Encoding

**Q10.** In most cases, a data point is treated as an outlier if its Z-score is:
- A) Greater than 1 or less than −1
- B) Greater than 2 or less than −2
- C) Greater than 3 or less than −3
- D) Exactly 0

**Q11.** IQR is calculated as:
- A) Q1 − Q3
- B) Q3 − Q1
- C) Q2 − Q1
- D) Max − Min

**Q12.** IQR is the difference between which two percentiles?
- A) 90th and 10th
- B) 75th and 25th
- C) 50th and 25th
- D) 100th and 0th

**Q13.** Which plot internally uses the IQR method to display outliers?
- A) Histogram
- B) Box plot
- C) Heat map
- D) Pairs plot

**Q14.** An outlier caused by an **incorrect data entry** should ideally be:
- A) Kept as is
- B) Removed or corrected
- C) Duplicated
- D) Converted to the mean always

**Q15.** Standardization transforms data to have:
- A) Mean 1 and standard deviation 0
- B) Mean 0 and standard deviation 1
- C) Range 0 to 1
- D) Range −1 to 1

**Q16.** `preprocessing.MinMaxScaler(feature_range=(0,1))` performs:
- A) Standardization
- B) Scaling to a given range
- C) Label encoding
- D) One-hot encoding

**Q17.** The main problem with Label Encoding is:
- A) It creates too many columns
- B) It cannot handle text
- C) The model may assume an order/hierarchy that doesn't exist
- D) It deletes rows

**Q18.** One-Hot Encoding splits a categorical column into:
- A) One numeric column
- B) Multiple binary (0/1) columns
- C) Two columns always
- D) Rows instead of columns

**Q19.** Which plot shows the correlation between all numeric variables?
- A) Histogram
- B) Heat map / Correlogram
- C) Box plot
- D) Bar chart

**Q20.** A scatter plot primarily gives:
- A) The distribution of one variable
- B) The relation between two variables
- C) The quartiles of the data
- D) The class labels

**Q21.** In the Census Income dataset, missing values are represented by:
- A) NaN
- B) `?`
- C) −1
- D) Blank strings only

**Q22.** Which three columns of the Census dataset contained `'?'`?
- A) age, education, income
- B) workClass, occupation, native-country
- C) age, salary, gender
- D) capital-gain, capital-loss, hours

**Q23.** `data.dropna(how='all')` drops rows where:
- A) Any value is null
- B) All values are null
- C) The first value is null
- D) No values are null

**Q24.** The Census Income ("Adult") dataset is downloaded from:
- A) Kaggle
- B) UCI Machine Learning Repository
- C) sklearn.datasets
- D) ImageNet

**Q25.** Exploratory Data Analysis is majorly done using:
- A) Loops
- B) Plots
- C) SQL joins
- D) Gradient descent

---

## Answer Key

| Q | Ans | Why |
|---|---|---|
| 1 | **B** | Exact definition from the slides. |
| 2 | **C** | Back-propagation is a training method, not preprocessing. |
| 3 | **D** | All three forms are listed. |
| 4 | **B** | Imputation = replacing with statistical values. |
| 5 | **B** | Fail-safe when the dataset is large enough. |
| 6 | **B** | Imputed values can add bias/variance. |
| 7 | **B** | Mean/median don't apply to categories. |
| 8 | **B** | Definition of outlier. |
| 9 | **D** | One-Hot Encoding is an encoding technique. |
| 10 | **C** | \|Z\| > 3 rule. |
| 11 | **B** | IQR = Q3 − Q1. |
| 12 | **B** | 75th − 25th percentile. |
| 13 | **B** | Box plots display IQR and outliers. |
| 14 | **B** | Error-based outliers → remove/correct. |
| 15 | **B** | Standard Gaussian: mean 0, std 1. |
| 16 | **B** | Min-max scaling to a range. |
| 17 | **C** | It fabricates a false hierarchy. |
| 18 | **B** | One binary column per category. |
| 19 | **B** | Correlogram/heat map of `df.corr()`. |
| 20 | **B** | Relation between two variables. |
| 21 | **B** | The `' ?'` symbol. |
| 22 | **B** | Listed explicitly. |
| 23 | **B** | `how='all'` means every value null. |
| 24 | **B** | UCI repository, Adult dataset. |
| 25 | **B** | "EDA is majorly done using plots." |
