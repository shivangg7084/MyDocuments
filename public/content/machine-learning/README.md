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

### Statistics & Probability
1. What is the Central Limit Theorem and why does it matter in practice?
2. Explain the difference between Type I and Type II errors.
3. What is a p-value? What common misconceptions exist about it?
4. Explain the difference between correlation and causation with an example.
5. What is the difference between population and sample variance formulas?
6. Explain Bayes' Theorem with a real-world example.
7. What is the difference between a confidence interval and a prediction interval?
8. What is the Law of Large Numbers?
9. Explain skewness and kurtosis and what they tell you about a distribution.
10. What is the difference between parametric and non-parametric tests?

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
