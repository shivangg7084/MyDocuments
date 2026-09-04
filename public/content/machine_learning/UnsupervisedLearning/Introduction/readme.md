# Introduction to Unsupervised Machine Learning


---

# 1. What is Machine Learning?

Machine Learning can broadly be divided into different categories based on whether the data contains a known output/target.

The two important categories discussed here are:

1. **Supervised Machine Learning**
2. **Unsupervised Machine Learning**

---

# 2. Supervised Machine Learning

In **supervised machine learning**, the dataset contains:

* **Independent features / Input features**
* **Dependent feature / Output feature / Target**

For example:

| Age | Experience | Salary |
| --: | ---------: | -----: |
|  25 |          2 |  4 LPA |
|  28 |          4 |  7 LPA |
|  32 |          7 | 12 LPA |
|  40 |         15 | 25 LPA |

Here:

* `Age` → Input feature
* `Experience` → Input feature
* `Salary` → Output/target

The model learns a relationship between the input features and the target.

### General structure

```text
Input Features
     ↓
 f1, f2, f3, f4
     ↓
Machine Learning Model
     ↓
Output / Target
```

For example:

```text
Age + Experience
       ↓
    ML Model
       ↓
    Salary
```

---

# 3. Types of Supervised Learning

The transcript identifies two major supervised learning problem types:

### 3.1 Regression

Regression is used when the target is generally a **continuous numerical value**.

Example:

```text
Age + Experience → Salary
```

Other examples:

* House price prediction
* Sales prediction
* Temperature prediction
* Revenue prediction

Common algorithms include:

* Linear Regression
* Decision Tree Regression
* Random Forest Regression
* Gradient Boosting
* XGBoost

---

### 3.2 Classification

Classification is used when the target represents a **class/category**.

Example:

```text
Age + Income + Credit History
              ↓
       Loan Approval
              ↓
          Yes / No
```

Other examples:

* Spam / Not Spam
* Fraud / Not Fraud
* Disease / No Disease
* Customer Churn / No Churn

Common algorithms include:

* Logistic Regression
* Decision Tree
* Random Forest
* Gradient Boosting
* XGBoost

---

# 4. What is Unsupervised Machine Learning?

In **unsupervised machine learning**, we don't have a predefined target/output feature that the model needs to predict.

This is the key difference.

### Supervised Learning

```text
Features + Target
       ↓
     Model
       ↓
Prediction
```

### Unsupervised Learning

```text
Features
   ↓
Algorithm
   ↓
Discover hidden structure/patterns
```

The transcript specifically introduces **clustering** as the unsupervised learning problem being studied.

---

# 5. What is Clustering?

**Clustering** means:

> Grouping data points into similar groups called **clusters**.

The important idea is:

```text
Similar data points
        ↓
    Same Cluster
```

while data points that are substantially different may belong to different clusters.

---

# 6. Example of Clustering

Suppose we have:

| Age | Experience | Salary |
| --: | ---------: | -----: |
|  23 |          1 |  3 LPA |
|  25 |          2 |  4 LPA |
|  27 |          3 |  5 LPA |
|  35 |         10 | 15 LPA |
|  38 |         12 | 18 LPA |
|  42 |         16 | 25 LPA |

There is **no target variable** saying:

```text
Cluster = 1
Cluster = 2
```

Instead, an unsupervised algorithm examines the available features and attempts to discover groups.

It might discover something conceptually like:

```text
             Dataset

       ┌─────────────────┐
       │ Young +          │
       │ Low Experience + │
       │ Lower Salary     │
       └─────────────────┘
              Cluster 1


       ┌─────────────────┐
       │ Older +          │
       │ More Experience +│
       │ Higher Salary    │
       └─────────────────┘
              Cluster 2
```

The algorithm isn't told beforehand what these groups mean.

It discovers the grouping from the structure of the data.

---

# 7. Important Difference: Prediction vs Grouping

This is one of the most important concepts to remember.

### Supervised Learning

We ask:

> **"Can I predict the output?"**

Example:

```text
Age + Experience → Salary
```

### Unsupervised Learning

We ask:

> **"Can I discover meaningful groups or patterns in the data?"**

Example:

```text
Age + Experience + Salary
              ↓
          Clustering
              ↓
     Cluster 1, Cluster 2, ...
```

---

# 8. Why Do We Need Clustering?

A natural question is:

> If there is no target to predict, why are we clustering the data?

Because real-world datasets often contain **hidden groups or structures** that aren't explicitly labelled.

Clustering can help us discover those groups.

Some common applications include:

* Customer segmentation
* Market segmentation
* Document grouping
* Image grouping
* Product grouping
* User behavior analysis
* Anomaly/outlier exploration
* Recommendation systems

---

# 9. Real-World Example: Customer Segmentation

The transcript gives **customer segmentation** as an important real-world example.

Suppose a company has information about customers such as:

* Salary
* Spending score
* Purchase behavior

For example:

| Customer | Salary | Spending Score |
| -------- | -----: | -------------: |
| A        |    30k |             20 |
| B        |    32k |             25 |
| C        |    35k |             30 |
| D        |    90k |             85 |
| E        |    95k |             90 |
| F        |   1.2L |             88 |

We don't have a predefined column saying:

```text
Customer A → Cluster 1
Customer B → Cluster 1
...
```

Instead, clustering can identify groups based on similarities.

For example:

```text
                Customers
                    │
                    ▼
              Clustering
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Cluster 1   Cluster 2   Cluster 3
     Low          Medium       High
    spending     spending     spending
```

---

# 10. How Customer Segmentation Helps a Business

Once customers are grouped, the company can treat different groups differently.

For example:

### Cluster 1 — Regular/High-value Customers

Characteristics:

* High spending
* Frequent purchases
* Strong interest in new products

Possible strategy:

```text
New Product
     ↓
Special Discount
     ↓
Early Access
```

---

### Cluster 2 — Occasional Customers

Characteristics:

* Moderate spending
* Purchase occasionally

Possible strategy:

```text
New Product
     ↓
Higher Promotional Discount
     ↓
Encourage Purchase
```

---

### Cluster 3 — Low-engagement Customers

Characteristics:

* Low spending
* Infrequent purchases

Possible strategy:

```text
Personalized Offers
       +
Marketing Campaign
       ↓
Increase Engagement
```

The important point is that **clustering itself doesn't decide the business strategy**.

It identifies groups, and the business uses those groups to make decisions.

---

# 11. Another Example: Student Segmentation

Suppose a college has:

* Study hours
* Attendance
* Assignment completion rate

Example:

| Student | Study Hours | Attendance | Assignment Completion |
| ------- | ----------: | ---------: | --------------------: |
| A       |           2 |        60% |                   50% |
| B       |           3 |        65% |                   55% |
| C       |           8 |        90% |                   95% |
| D       |           7 |        92% |                   90% |
| E       |           5 |        75% |                   70% |

Clustering could potentially discover groups such as:

```text
Cluster 1 → Low engagement
Cluster 2 → Medium engagement
Cluster 3 → High engagement
```

The college could then design different academic support programs for each group.

---

# 12. Another Example: E-Commerce Products

Imagine an e-commerce company has:

* Product price
* Number of purchases
* Customer rating
* Return rate

Clustering can group products according to similar characteristics.

For example:

```text
Cluster 1 → Low price + High sales
Cluster 2 → High price + High rating
Cluster 3 → Low sales + High return rate
```

The company can then investigate each group separately.

---

# 13. Another Example: News Article Clustering

Suppose we have thousands of news articles.

There may be no manually assigned category.

Clustering can potentially group articles into topics such as:

```text
        News Articles
              ↓
          Clustering
              ↓
    ┌─────────┼─────────┐
    ↓         ↓         ↓
  Sports   Politics   Technology
```

This can be useful for:

* News recommendation
* Content organization
* Search systems
* Topic discovery

---

# 14. What Does "Similar" Mean?

A very important question is:

> How does a clustering algorithm know whether two data points are similar?

Similarity is generally determined using some **distance or similarity measure**.

For numerical data, one common measure is **Euclidean distance**.

For two points:

```text
A = (x₁, y₁)
B = (x₂, y₂)
```

Euclidean distance is:

$$
d(A,B)=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}
$$

Smaller distance generally means the points are more similar in the feature space.

For example:

```text
A •
   \
    \ small distance
     \
      • B
```

A and B are relatively close.

Whereas:

```text
A •



                     • B
```

A and B are far apart.

---

# 15. Important: Feature Scaling in Clustering

Because clustering often depends on distances, **feature scaling can become extremely important**.

Suppose we have:

```text
Age        → 20–60
Salary     → 20,000–2,00,000
```

Salary has a much larger numerical scale than age.

A distance-based algorithm may therefore give salary much greater influence.

We commonly use techniques such as:

### Standardization

$$
z=\frac{x-\mu}{\sigma}
$$

or

### Min-Max Scaling

$$
x'=\frac{x-x_{min}}{x_{max}-x_{min}}
$$

This puts features onto comparable scales.

> **Interview point:** Before applying distance-based clustering, always consider whether the features need scaling.

---

# 16. Main Unsupervised Learning Topics in This Course

The provided PDF lists four important topics:

```text
Unsupervised Machine Learning
             │
             ├── 1. K-Means Algorithm
             │
             ├── 2. Hierarchical Clustering
             │
             ├── 3. DBSCAN Clustering
             │
             └── 4. Silhouette Scoring
```

The first three are clustering approaches, while **Silhouette Scoring** is used to evaluate/validate the resulting clustering model. This structure is shown on page 2 of the provided notes. 

---

# 17. K-Means Clustering

**K-Means** is one of the most popular clustering algorithms.

The basic idea is to divide data into a specified number of clusters, represented by `K`.

For example:

```text
K = 3
```

means that we want the algorithm to create **3 clusters**.

Conceptually:

```text
             Data
              │
              ▼
          K = 3
              │
      ┌───────┼───────┐
      ▼       ▼       ▼
 Cluster 1 Cluster 2 Cluster 3
```

The detailed mathematics and working of K-Means will be covered separately.

---

# 18. Hierarchical Clustering

Hierarchical clustering creates a hierarchy of clusters.

Instead of simply producing one final grouping, it can represent how data points/groups are progressively merged or separated.

A common visualization is a **dendrogram**.

Conceptually:

```text
A   B   C   D   E

│   │   │   │   │
└─┬─┘   │   └─┬─┘
  │     │     │
  └──┬──┘     │
     │        │
     └────┬───┘
          │
       One Group
```

The detailed types and mathematical working will be covered later.

---

# 19. DBSCAN

**DBSCAN** stands for:

> **Density-Based Spatial Clustering of Applications with Noise**

Unlike K-Means, DBSCAN is based on the **density of data points**.

It can be particularly useful when:

* Clusters have irregular shapes
* Data contains noise/outliers
* The number of clusters isn't known beforehand

Conceptually:

```text
     • • • •
    • • • • •
     • • • •

                         • •
                        • • •

                ×
             Noise
```

DBSCAN can identify dense regions as clusters while potentially identifying isolated observations as noise.

---

# 20. Silhouette Scoring

After creating clusters, an important question arises:

> **How good are my clusters?**

This is where **Silhouette Score** becomes useful.

The PDF specifically lists **Silhouette Scoring** as the mechanism used to validate the clustering models. 

The silhouette score considers:

1. How close a point is to other points in its **own cluster**
2. How far it is from points belonging to the **nearest other cluster**

Its value generally ranges from:

$$
-1 \leq S \leq 1
$$

A higher silhouette score generally indicates better-separated, more cohesive clusters.

### Rough interpretation

| Silhouette Score | General Interpretation        |
| ---------------: | ----------------------------- |
|     Close to `1` | Very good separation          |
|       Around `0` | Overlapping clusters          |
|         Negative | Possible incorrect assignment |

This should be used as an evaluation signal rather than blindly assuming that the highest score always represents the best business solution.

---

# 21. Complete Unsupervised Learning Workflow

A typical clustering workflow can be visualized as:

```text
                Dataset
                   │
                   ▼
           Understand Features
                   │
                   ▼
          Data Preprocessing
                   │
                   ▼
           Feature Selection
                   │
                   ▼
            Feature Scaling
                   │
                   ▼
             Clustering
                   │
       ┌───────────┼────────────┐
       ▼           ▼            ▼
    K-Means    Hierarchical    DBSCAN
       │           │            │
       └───────────┼────────────┘
                   ▼
           Evaluate Clusters
                   │
                   ▼
         Silhouette Scoring
                   │
                   ▼
       Business Interpretation
```

---

# 22. Supervised vs Unsupervised Learning

| Aspect             | Supervised ML                                         | Unsupervised ML               |
| ------------------ | ----------------------------------------------------- | ----------------------------- |
| Target variable    | Present                                               | Not predefined                |
| Main objective     | Prediction                                            | Pattern/group discovery       |
| Data               | Labelled                                              | Unlabelled                    |
| Common problems    | Regression, Classification                            | Clustering                    |
| Example            | Predict salary                                        | Group similar customers       |
| Output             | Predicted value/class                                 | Cluster/group                 |
| Example algorithms | Linear Regression, Logistic Regression, Random Forest | K-Means, Hierarchical, DBSCAN |

---

# 23. Simple Real-World Comparison

Imagine an online shopping company.

### Supervised approach

The company has historical data:

```text
Age + Salary + Previous Purchases
                 ↓
          Bought Product?
                 ↓
                Yes
```

The model learns to predict whether a customer will buy the product.

This is **supervised learning** because the historical outcome is known.

---

### Unsupervised approach

The company has:

```text
Age
Salary
Spending Score
Purchase Frequency
```

but doesn't have a predefined customer category.

The algorithm discovers:

```text
Cluster 1 → High-value customers
Cluster 2 → Occasional customers
Cluster 3 → Low-engagement customers
```

This is **unsupervised learning**.

---

# 24. Does Unsupervised Learning Mean There Is No Output At All?

Be careful with this statement.

It is better to say:

> **There is no predefined target/output variable that the model is trained to predict.**

After clustering, the algorithm **does produce information**, such as:

```text
Customer A → Cluster 1
Customer B → Cluster 2
Customer C → Cluster 1
```

But `Cluster 1`, `Cluster 2`, etc. were **not provided as labels beforehand**.

The algorithm discovered them.

---

# 25. Are Cluster Names Meaningful?

Suppose K-Means produces:

```text
Customer A → Cluster 0
Customer B → Cluster 1
Customer C → Cluster 0
```

Don't assume:

```text
Cluster 0 = Good
Cluster 1 = Bad
```

The numbers are simply identifiers.

You need to analyze the characteristics of each cluster.

For example:

```text
Cluster 0
Average Salary = ₹40K
Average Spending Score = 25

Cluster 1
Average Salary = ₹1.2L
Average Spending Score = 90
```

You may then interpret:

```text
Cluster 0 → Low-spending customers
Cluster 1 → High-value customers
```

The **business meaning comes after analyzing the clusters**.

---

# 26. Key Intuition

The entire concept can be remembered with one question.

### Supervised Learning asks:

> **"What should I predict?"**

```text
Input → Model → Known Target
```

### Unsupervised Learning asks:

> **"What structure exists in my data?"**

```text
Data → Algorithm → Hidden Groups/Patterns
```

And for clustering:

> **"Which data points are similar enough to belong together?"**

---

# 27. Quick Revision

### Supervised ML

```text
Input Features + Target
          ↓
        Model
          ↓
     Prediction
```

### Unsupervised ML

```text
Input Features
      ↓
    Model
      ↓
Patterns / Groups
```

### Clustering

```text
Similar Data Points
        ↓
     Same Group
```

### Customer Segmentation

```text
Customer Data
     ↓
  Clustering
     ↓
Customer Groups
     ↓
Different Marketing Strategies
```

### Algorithms Covered

```text
1. K-Means
2. Hierarchical Clustering
3. DBSCAN
4. Silhouette Scoring
```

---

# 28. Interview Points ⭐

### Q1. What is unsupervised learning?

Unsupervised learning is a type of machine learning where the model works with data without a predefined target variable and attempts to discover hidden patterns or structures.

### Q2. What is clustering?

Clustering is the process of grouping similar data points into clusters.

### Q3. Give an example of clustering.

**Customer segmentation** is a common example, where customers can be grouped according to characteristics such as salary, spending score, and purchasing behavior.

### Q4. What is the difference between classification and clustering?

**Classification** uses predefined labels and learns to predict them, whereas **clustering** discovers groups without predefined labels.

### Q5. Name three clustering algorithms.

* K-Means
* Hierarchical Clustering
* DBSCAN

### Q6. What is Silhouette Score used for?

It is used to evaluate how well-separated and cohesive the generated clusters are.

### Q7. Why can feature scaling be important in clustering?

Many clustering algorithms use distances. Features with much larger numerical ranges can dominate those distance calculations.

---

# 29. Final Mental Model

```text
                     MACHINE LEARNING
                            │
              ┌─────────────┴─────────────┐
              │                           │
         SUPERVISED                 UNSUPERVISED
              │                           │
       Has Target                     No predefined
              │                         Target
       ┌──────┴──────┐                    │
       │             │                    │
  Regression    Classification        Clustering
                                           │
                              ┌────────────┼────────────┐
                              │            │            │
                           K-Means   Hierarchical    DBSCAN
                              │            │            │
                              └────────────┼────────────┘
                                           │
                                           ▼
                                  Silhouette Score
                                           │
                                           ▼
                                  Cluster Evaluation
```

## One-line takeaway

> **Unsupervised machine learning helps us discover hidden structure in data when predefined target labels are not available; clustering groups similar observations together, with K-Means, Hierarchical Clustering, and DBSCAN being key approaches, and Silhouette Scoring helping evaluate the resulting clusters.**
