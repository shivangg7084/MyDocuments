# 02 — Exploratory Data Analysis & Data Preprocessing

> Source: `Machine_Learning_-_Exploratory_Data_Analysis_-_Data_Preprocessing.pdf`

---

## 1. What is Data Preprocessing?

**Simple idea:** Raw data is messy. Cleaning and reshaping it so an algorithm can actually use it is called **data preprocessing**.

Key points from the slides:

- Data scientists usually come across raw datasets that **contain noise** and are **not fit to be readily processed** by ML algorithms.
- The data must be preprocessed **before** it is fed into ML algorithms.
- **Data Preprocessing = the process of preparing the data for analysis.**

### Facts worth memorising
- Preprocessing takes the **major chunk of model-building effort**, depending on the dataset.
- There are **statistical, mathematical, computational and graphical** techniques available.
- These techniques are **not limited in number** and **may not be performed in any fixed order**. Some datasets need a lot of preprocessing, others very little.

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

**Example dataset used throughout the slides:** *Census Income data* (the "Adult" dataset) from the **UCI Machine Learning Repository**, extracted from the census bureau database.

---

## 3. Handling Missing Data

### 3.1 What counts as missing data?
A missing value can appear as:
- a **blank**,
- **NaN**, or
- a **special symbol** representing missing data (in the Census dataset, it is a **`?`**).

### 3.2 Why does data go missing?
- **Not recorded** during creation
- **Optional entry** (the person simply didn't fill it)
- **Data corruption**

### 3.3 Why must we handle it?
Because **most machine learning algorithms do not support data with missing values** — they will simply throw an error or behave wrongly.

### 3.4 The four techniques

**(a) Deleting rows with missing data**
- Delete the row if it has a lot of missing values.
- It is a **fail-safe method**, advisable **if the dataset is large enough**.
- **Not advisable** if data is small or there are many records with missing data (you lose too much information).

**(b) Replace with statistical values — "Data Imputation"**
- Replace missing values with the **Mean / Median / Mode** of that attribute's distribution.
- This process is called **data imputation**.
- **Better approach if the dataset is small** — it prevents data loss.
- **Drawback:** the imputed value **may add bias or variance**.

**(c) Missing categorical values**
- Replacing with statistical values works **only for numerical data**.
- For categorical missing values you can:
  - create a **unique new category** for "missing", or
  - replace with the **most-occurring category (mode)**.
- If there is a **lot** of missing data in that variable, it is **better to exclude the variable** from model building.

**(d) Predicting missing values**
- Missing values can be **predicted using existing algorithms/libraries**.
- Or by **building a model using the rest of the data** of the same dataset.

### 3.5 Pandas commands you must recognise

```python
import pandas as pd
import numpy as np

data.isnull()                    # check for null values (True/False table)
data.dropna(how='all')           # drop records where ALL values are null
data.fillna(0)                   # fill missing values with 0
data.replace(to_replace=np.nan, value=-1)   # replace NaN with -1
data.fillna(data.mean())         # fill with the column mean
data.interpolate(method='linear', limit_direction='forward')  # imputation function
```

> **Note from the slides:** the Census Income dataset has **no NaN missing values** — instead it uses `' ?'`.

---

## 4. Handling Outliers

### 4.1 What is an outlier?
An **observation in a dataset that is different from, or far away from, the other observations**.

An outlier can happen because of:
- an **error scenario** (wrong data entry), or
- a **genuine scenario** (a real but unusual case).

### 4.2 Four ways to identify outliers

| Method | Type | How it works |
|---|---|---|
| **Box plot** | Graphical | Depicts numerical data through its **quartiles**; points outside the whiskers are outliers |
| **Scatter plot** | Graphical | Shows the **relation between two variables**; stray points stand out |
| **Z-score** | Statistical | Describes a point by its relationship with the **mean and standard deviation** |
| **IQR** | Statistical | Uses the spread between quartiles |

### 4.3 Z-score
- The Z-score describes a data point by finding its **relationship with the Standard Deviation and the Mean** of the group of data points.
- **Rule from the slides:** in most cases, if the **Z-score > 3 or < −3**, the point is identified as an **outlier**.

```python
from scipy import stats
import numpy as np
z_score = np.abs(stats.zscore(census_income['age']))
print(census_income.iloc[np.where(z_score > 3)].head())
```

### 4.4 IQR (Interquartile Range)
- The IQR is a **measure of statistical dispersion**.
- **IQR = Q3 − Q1** = difference between the **75th and 25th percentiles** (upper and lower quartiles).
- **Box plots use the IQR method** to display data and outliers pictorially.
- Outliers are points **below `Q1 − 1.5 × IQR`** or **above `Q3 + 1.5 × IQR`**.

```python
Q1 = census_income['age'].quantile(0.25)
Q3 = census_income['age'].quantile(0.75)
IQR = Q3 - Q1
census_income[(census_income['age'] < (Q1 - 1.5*IQR)) |
              (census_income['age'] > (Q3 + 1.5*IQR))]
```

### 4.5 What to do with an outlier?
The identified outliers can be **corrected, removed, or treated separately** — **the decision depends on the scenario**:

- Outlier due to **incorrect data entry** → **Remove or Correct**
- Outlier due to **exceptional genuine cases** (students with high IQ, high income at a young age) → **Keep / Handle**

---

## 5. Scaling, Normalization and Standardization

**Why?** The values of some features can vary over wildly different ranges (age 17–90 vs salary 20,000–90,000), **which may cause issues while model building**. So we bring them into a comparable range.

### 5.1 Scaling (Min-Max)
Squeezes values into a given range, usually **(0, 1)**.

```python
from sklearn import preprocessing
data_scaler = preprocessing.MinMaxScaler(feature_range=(0, 1))
data_scaled = data_scaler.fit_transform(input_data)
```

### 5.2 Normalization
Rescales the rows/vector, e.g. **L1 norm**.

```python
data_normalized = preprocessing.normalize(input_data, norm='l1')
```

### 5.3 Standardization
> **Definition (memorise):** Standardization is a technique to transform attributes with a **Gaussian distribution** and **differing means and standard deviations** into a **standard Gaussian distribution with mean = 0 and standard deviation = 1**.

```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler().fit(input_data)
scaler.transform(input_data)
```

| | Min-Max Scaling | Standardization |
|---|---|---|
| Result range | Fixed range, e.g. [0, 1] | Mean 0, Std 1 (unbounded) |
| sklearn class | `MinMaxScaler` | `StandardScaler` |
| Assumes | Nothing about distribution | Gaussian-ish distribution |

### 5.4 Binarization
Converts numeric values into **0 / 1** based on a threshold (listed as one of the preprocessing techniques).

---

## 6. Further Formatting / Discrepancy Checks

Use `.unique()` to check for discrepancies in a column:

```python
census_income['age'].unique()
census_income['workClass'].unique()
# array([' State-gov', ' Self-emp-not-inc', ' Private', ' Federal-gov',
#        ' Local-gov', ' ?', ' Self-emp-inc', ' Without-pay', ' Never-worked'])
```

In the Census dataset the following three features contain `'?'`:
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

Models need numbers, not words. Two encodings:

### 7.1 Label Encoding
- **Converts each value in a column into a number** (e.g. Private→0, State-gov→1, …).

```python
from sklearn.preprocessing import LabelEncoder
categorical_features = list(df.select_dtypes(include=['object']).columns)
for feature in categorical_features:
    df[feature] = LabelEncoder().fit_transform(df[feature])
```

### 7.2 One-Hot Encoding
- **Problem with Label Encoding:** giving numbers to categories **might confuse the model into thinking the column has some kind of order or hierarchy** when clearly it does not (e.g. it may think `Private(2) > State-gov(1)`).
- **One-Hot encoding solves this issue.**
- It **splits the column into multiple binary (0/1) columns**, one per category present in that column.

```python
dummies = pd.get_dummies(df[feature], prefix=feature, drop_first=False)
df = pd.concat([df, dummies], axis=1)
df = df.drop([feature], axis=1)
```

| | Label Encoding | One-Hot Encoding |
|---|---|---|
| Output | One column of integers | Many 0/1 columns |
| Implies order? | **Yes (a problem)** | **No** |
| Column count | Unchanged | Grows with number of categories |

---

## 8. EDA Plots

**Exploratory Data Analysis (EDA) is majorly done using plots.** The three important plots listed:

### 8.1 Histogram
Shows the **distribution** of each numeric column.
```python
census_income.hist(edgecolor='black', linewidth=1.2, color='c')
```

### 8.2 Heat Map / Correlogram
Shows the **correlation matrix** between all numeric columns as a coloured grid.
```python
sns.heatmap(census_income.corr(),
            xticklabels=census_income.corr().columns,
            yticklabels=census_income.corr().columns,
            cmap='RdYlGn', center=0, annot=True)
```

### 8.3 Pairs Plot
Plots **every variable against every other variable** as a grid of scatter plots.
```python
sns.pairplot(census_income, kind="scatter", hue="income")
```

### 8.4 Box plot & Scatter plot (used for outliers)
```python
import seaborn as sns
sns.boxplot(x=census_income['age'])     # outliers visible beyond the whiskers
plt.scatter(census_income['workClass'], census_income['capital-gain'])
```

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
