---
description: GATE CSE module — DBMS foundations, file-system drawbacks, schema vs instance, three-level abstraction, DDL/DML, data models, and the Extended ER model (specialization, generalization, aggregation, attribute types). Compressed to exam-essentials plus an advanced problem set.
---

# 01-DBMS Foundations — Architecture, Abstraction, Data Models & ER Modelling

| | |
| --- | --- |
| **Subject** | Database Management Systems |
| **Scope** | Intro · File-system drawbacks · Schema/instance · 3-level abstraction · DDL/DML · Users · Query processor & storage manager · Data models · Design lifecycle · ER + Extended ER |
| **GATE weight** | ⭐⭐⭐⭐ for ER/EER and data independence · ⭐ for history, applications, 2-tier/3-tier |
| **Feeds into** | ER→Relational conversion · Keys · FDs · Normalization · Transactions |

> **Read this first.** Roughly 60% of GATE marks from this module come from **one third of it**:
> the Extended ER model (§2.10–§2.15) and data independence (§2.4). The architecture narration
> is background. Sections are ordered for study; the **[⭐]** tag marks what actually gets asked.

---

## 1. What is actually asked

| Asked directly, almost every cycle | Asked rarely / never standalone |
| --- | --- |
| Specialization & generalization counting **[⭐]** | History of DBMS |
| Disjoint/overlapping × total/partial **[⭐]** | Lists of DB applications |
| Aggregation — when it is required **[⭐]** | 2-tier vs 3-tier architecture |
| Attribute classification **[⭐]** | Names of DBMS vendors |
| Physical vs logical data independence **[⭐]** | Exact internals of buffer manager |
| DDL vs DML classification | Data dictionary field layout |
| Weak entity vs total participation | |

The lecture itself flags 2-tier/3-tier as "a semester-exam thing, not really GATE." That
judgement is correct — know the one-line difference and move on.

---

## 2. Core concepts

### 2.1 Data, database, DBMS

- **Data** — raw facts. `23`, `"Anil"`.
- **Information** — data in context. `age = 23`.
- **Database** — organised collection of interrelated data.
- **DBMS** — software managing the database *plus* controlled access to it.
- **Database system** = database + DBMS + applications.

**Example.** A college stores students, courses, enrolments. The `.dbf` files are the
database; Oracle/MySQL is the DBMS; the admission portal is the application.

> **Key idea for the whole module:** a DBMS exists to put a *layer of software* between the
> user and the bytes on disk. Almost every advantage below is a consequence of that layer.

---

### 2.2 Why file systems fail — the seven problems

| # | Problem | One-line meaning | Concrete example |
| - | ------- | ---------------- | ---------------- |
| 1 | **Redundancy & inconsistency** | Same fact stored in many files; copies drift apart | Address in both `savings.txt` and `loan.txt`; updated in one only |
| 2 | **Difficulty accessing data** | Every new query needs a new program | "List customers in pincode 4110xx with balance > 5000" needs fresh code |
| 3 | **Data isolation** | Data scattered across files/formats | Joining `.txt` + `.csv` + `.dat` by hand |
| 4 | **Integrity problems** | Constraints live in code, not data | `balance ≥ 0` enforced in 12 programs, forgotten in the 13th |
| 5 | **Atomicity problems** | Partial updates survive a crash | Transfer debits A, crashes before crediting B |
| 6 | **Concurrent-access anomalies** | Simultaneous updates interfere | Two withdrawals read ₹500, both write ₹400 |
| 7 | **Security problems** | Cannot restrict per user | Clerk can read salary of CEO |

**⚠️ Trap.** A DBMS **controls** redundancy; it does **not** eliminate it. Foreign keys are
deliberate redundancy, and denormalization reintroduces it on purpose.

**⚠️ Trap.** Problems 5 and 6 are different. **Atomicity** = all-or-nothing for *one*
transaction. **Concurrency/isolation** = correctness when *many* transactions interleave.
GATE swaps these words in options routinely.

---

### 2.3 Schema vs instance **[⭐]**

- **Schema** — the design/structure. Changes rarely.
- **Instance** — the data at a given moment. Changes constantly.

**Analogy.** Schema is the variable *declaration*; instance is its *value* right now.

**Example.** `Student(roll, name, dept)` is the schema. The 1,200 rows in it today are the
instance. Inserting a row changes the instance, not the schema.

Schemas exist at each abstraction level: **physical schema**, **logical schema**, **subschema**
(view).

---

### 2.4 Three-level abstraction & data independence **[⭐⭐]**

```text
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │   View 1     │  │   View 2     │  │   View 3     │   ← External / View level
        └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     (what each user sees)
               └─────────────────┼─────────────────┘
                        ┌────────┴────────┐
                        │  Logical level  │   ← what data, what relationships (DBA's view)
                        └────────┬────────┘
                        ┌────────┴────────┐
                        │ Physical level  │   ← how stored: files, blocks, indices
                        └─────────────────┘
```

| Level | Answers | Who cares |
| ----- | ------- | --------- |
| **Physical (internal)** | *How* is it stored? B+ tree? Heap? Which blocks? | System designers |
| **Logical (conceptual)** | *What* data exists and how does it relate? | DBA, designers |
| **View (external)** | What subset does *this* user see? | End users, apps |

**Data independence** = ability to change one level without disturbing the level above.

| Type | Definition | Difficulty |
| ---- | ---------- | ---------- |
| **Physical data independence** | Change physical schema without changing logical schema | **Easier** — achieved well in practice |
| **Logical data independence** | Change logical schema without changing views/applications | **Harder** — apps depend directly on logical structure |

**Example (physical).** Adding a B+ tree index on `Student.roll`, or moving the table to an
SSD, changes *nothing* in your SQL. Physical independence held.

**Example (logical).** Splitting `Employee(id, name, dept, salary)` into `Employee(id, name, dept)`
and `Salary(id, salary)` breaks every application that did `SELECT salary FROM Employee`.
Logical independence is violated — which is precisely why it is the harder one.

> **The rule that answers most questions here:** *additive* logical changes (adding a column,
> adding a table) usually preserve logical independence; *subtractive or restructuring*
> changes (splitting, removing, renaming) usually break it.

**⚠️ Trap.** "Which data independence is harder to achieve?" → **Logical.** Students reverse
this because physical sounds more technical.

---

### 2.5 Database languages — DDL & DML

| | **DDL** | **DML** |
| --- | --- | --- |
| Acts on | **Structure** (schema) | **Data** (instance) |
| Commands | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME` | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| Output | Updates the **data dictionary** (metadata) | Changes rows |
| Auto-commit | Yes | No |

Also examinable:
- **DCL** — `GRANT`, `REVOKE` (authorization)
- **TCL** — `COMMIT`, `ROLLBACK`, `SAVEPOINT`

**DML flavours**
- **Procedural** — say *what* you want **and how** to get it → **Relational Algebra**
- **Declarative / non-procedural** — say only *what* → **Tuple/Domain Relational Calculus**, SQL

**⚠️ Trap.** `DELETE` is DML (row-level, rollback-able, fires triggers, `WHERE` allowed).
`TRUNCATE` is **DDL** (deallocates pages, auto-commits, no `WHERE`, no row triggers). They
look alike and are classified differently.

> **Anchor on the target, not the verb.** `DROP TABLE` and `DELETE FROM` both "remove things" —
> but DROP targets *structure* (DDL) and DELETE targets *rows* (DML).

---

### 2.6 Users and the DBA

| User | Interacts via | Example |
| ---- | ------------- | ------- |
| **Naive / parametric** | Pre-built forms & apps | Bank teller, ATM user |
| **Application programmer** | Host language + embedded SQL | Writes the ATM software |
| **Sophisticated** | Direct query language | Analyst running ad-hoc SQL |
| **Specialized** | Custom/complex applications | CAD, expert systems |
| **DBA** | Full control | Everything below |

**DBA duties:** schema definition, storage & access-method definition, schema/physical
modification, authorization grants, routine maintenance (backups, tuning, capacity).

---

### 2.7 Inside the DBMS

**Query processor**
- **DDL interpreter** → interprets DDL, records metadata in the data dictionary
- **DML compiler** → translates DML into an evaluation plan; includes the **query optimizer**
- **Query evaluation engine** → executes the chosen plan

**Storage manager**
- **Authorization & integrity manager** — permission and constraint checks
- **Transaction manager** — atomicity + consistency under concurrency/failure
- **File manager** — disk space and data structure allocation
- **Buffer manager** — moves blocks disk ↔ main memory *(performance-critical)*

**Data structures on disk:** data files, **data dictionary** (metadata), indices, statistical data.

**Flow of a query:**
```text
SQL → parser → DML compiler → optimizer → evaluation plan
    → evaluation engine → storage manager → buffer manager → disk
```

---

### 2.8 Data models

| Model | Idea | Status |
| ----- | ---- | ------ |
| **ER model** | Entities + relationships; a *design* tool | Conceptual design |
| **Relational** | Tables (relations) of rows and columns | Dominant |
| **Object-based** | OOP concepts in the DB | Niche |
| **Semi-structured** | Same "type" may carry different attribute sets — XML, JSON | Growing |
| *Network / Hierarchical* | Graph / tree of records | Legacy |

**Key distinction.** ER is **not** an implementation model — it is a *design* model that gets
*converted* into the relational model.

---

### 2.9 Database design lifecycle

```text
Requirements  →  Conceptual design  →  Logical design  →  Schema refinement
 (what users      (ER diagram)          (relational         (normalization)
  need)                                  schema)
                        →  Physical design  →  Implementation
                           (indices, storage)
```

| Stage | Produces | Tool |
| ----- | -------- | ---- |
| Conceptual | ER diagram | ER model |
| Logical | Tables, keys | ER→Relational rules |
| Refinement | Redundancy-free schema | FDs, normal forms |
| Physical | Indices, file organisation | Cost estimates |

This module ends at **conceptual design**. Everything after is the next modules.

---

### 2.10 ER basics — recap depth **[⭐]**

| Concept | Notation | Note |
| ------- | -------- | ---- |
| Entity set | Rectangle | A *set*; an entity is one member |
| Weak entity set | **Double** rectangle | No key of its own |
| Attribute | Ellipse | |
| Key attribute | **Underlined** | |
| Relationship set | Diamond | |
| Identifying relationship | **Double** diamond | Links weak set to its owner |
| Total participation | **Double** line | Every entity must participate |
| Partial participation | Single line | |
| Discriminator / partial key | **Dashed** underline | Distinguishes weak entities of one owner |

**Degree of a relationship**
- **Unary (recursive)** — `Employee supervises Employee`
- **Binary** — `Student enrols Course` (most common)
- **Ternary** — `Employee works_on (Branch, Job)`

**Mapping cardinality:** 1:1, 1:N, N:1, M:N.

**Weak entity set.** Existence depends on an owner and it has no key of its own.
*Example:* `Loan_Payment` has `payment_no` unique only within its `Loan` → `payment_no` is a
discriminator, and the full key is `(loan_no, payment_no)`.

**⚠️ Trap.** Weak entity ⇒ total participation in its identifying relationship. But total
participation does **not** imply weak. `Employee works_in Department` may be total while
`Employee` remains a strong entity set with its own key.

---

### 2.11 Attribute types **[⭐]**

| Type | Meaning | Notation | Example |
| ---- | ------- | -------- | ------- |
| **Simple (atomic)** | Cannot be divided | Ellipse | `roll_no`, `age` |
| **Composite** | Splits into sub-parts | Ellipse with child ellipses | `name` → first/middle/last; `address` → street/city/pin |
| **Single-valued** | One value per entity | Ellipse | `roll_no` — one per student |
| **Multi-valued** | Many values per entity | **Double** ellipse | `phone_no` — a student may have 3 |
| **Derived** | Computable from others | **Dashed** ellipse | `age` from `DOB` |
| **Stored** | Physically kept | Ellipse | `DOB` |
| **Key** | Uniquely identifies | Underlined | `roll_no` |
| **NULL** | Unknown / not applicable | — | `middle_name` absent |

**Example set on one entity:**
```text
Student( roll_no[key, simple, single]
       , name[composite → first, last]
       , phone[multi-valued]
       , DOB[stored]
       , age[derived from DOB] )
```

**⚠️ Trap — composite vs multi-valued.** *Composite* = one value with **parts**
(`address` = street + city + pin). *Multi-valued* = **many** values of the same kind
(three phone numbers). "Multiple addresses, each with street/city/pin" is both:
a multi-valued composite attribute.

**⚠️ Trap — derived ≠ never stored.** Derived means *derivable*. A system may still cache it.

**Conversion note (used later).** Composite → one column per leaf. Multi-valued → a
**separate table**. Derived → usually not stored.

---

### 2.12 Specialization & generalization **[⭐⭐]**

Both produce the same **ISA hierarchy**; they differ only in *direction*.

| | **Specialization** | **Generalization** |
| --- | --- | --- |
| Direction | **Top-down** | **Bottom-up** |
| Process | Split a set into subsets | Merge sets into a superset |
| Driver | Subgroups have *distinguishing* attributes | Common attributes found |
| Example | `Person` → `Employee`, `Customer` | `Car`, `Truck` → `Vehicle` |

**Terminology:** higher-level = **superclass**; lower-level = **subclass**. Notation: a
triangle labelled **ISA**.

**Example.**
```text
                Person(SSN, name, street, city)
                          △ ISA
            ┌─────────────┴─────────────┐
     Employee(salary)            Customer(credit_rating)
```
`Employee` has SSN, name, street, city **and** salary.

---

### 2.13 Specialization constraints — the 2×2 **[⭐⭐]**

Two **independent** axes. Every GATE question here is really asking you to locate a cell.

|  | **Total** (every superclass entity is in ≥1 subclass) | **Partial** (some may be in none) |
| --- | --- | --- |
| **Disjoint (d)** — in at most 1 subclass | Σ\|subclass\| = \|super\| | Σ\|subclass\| ≤ \|super\| |
| **Overlapping (o)** — may be in many | \|∪ subclass\| = \|super\|, Σ ≥ \|super\| | \|∪ subclass\| ≤ \|super\| |

**Notation:** `d` or `o` in a circle at the ISA triangle; **double line** = total,
single line = partial.

**Example (disjoint + total).** `Person → {Male, Female}`: everyone is exactly one.
**Example (overlapping + partial).** `Person → {Employee, Student}`: some are both, some neither.

**The counting identity that solves most numericals** (inclusion–exclusion, 2 subclasses):

```text
|A ∪ B| = |A| + |B| − |A ∩ B|

Total        ⇒ |A ∪ B| = |Super|
Disjoint     ⇒ |A ∩ B| = 0
```

For 3 subclasses:
```text
|A∪B∪C| = |A|+|B|+|C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|
```

> **Technique — count memberships, not sets.** If an entity sits in 2 subclasses it
> contributes **2** to Σ\|subclass\| but **1** to \|∪\|. The gap
> `Σ|subclass| − |∪|` is exactly the **overlap surplus**.

---

### 2.14 Attribute inheritance

- A subclass **inherits all attributes** of its superclass.
- It also inherits **participation in the superclass's relationship sets**.
- Inheritance flows **downward only** — subclass-specific attributes do not rise.
- The subclass's key **is** the superclass's key.

**Example.** If `Person(SSN, name)` and `Employee` adds `salary`, then
`Employee` effectively has `(SSN, name, salary)` with key `SSN`. If `Person` participates in
`lives_in`, `Employee` does too.

**Multiple inheritance.** A subclass with more than one superclass inherits from all — this
is a **lattice**, not a tree.

---

### 2.15 Aggregation **[⭐⭐]**

**Definition.** Treat a **relationship set as if it were a higher-level entity set**, so that
it can participate in another relationship.

**Use it when:** you need a relationship **whose participant is itself a relationship**, not
an entity.

**The lecture's example — worth memorising.**

Ternary relationship already exists:
```text
Employee(ID, name, street, city) ──┐
Branch(branch_name, city)        ──┼── works_on ──> (title, level)
Job(title, level)                ──┘
```
Now a **manager** must manage *an employee's job at a branch* — i.e. manage the
`works_on` fact, not the three entities separately.

**Wrong design** — a second relationship `manages(Employee, Branch, Job, Manager)`:
```text
Manager ── manages ── Employee, Branch, Job     ✗ REDUNDANT
```
This repeats the `(Employee, Branch, Job)` association that `works_on` already records.

**Right design** — aggregate `works_on`, then relate:
```text
   ┌─────────────────────────────────────┐
   │  Employee ─┐                        │
   │  Branch  ──┼── works_on             │  ← box = aggregation
   │  Job     ──┘                        │
   └──────────────────┬──────────────────┘
                      │
                   manages
                      │
                   Manager
```
**Notation:** a **box/rectangle drawn around** the relationship and its participants.

> **Detection technique — the superset scan.** If a proposed relationship's participant list
> is a **superset** of an existing relationship's participants (plus one new entity), you are
> looking at an aggregation, not a higher-degree relationship.

**⚠️ Trap — aggregation vs ternary relationship.** A ternary relationship links **three
entity sets**. Aggregation links **an entity set to a relationship set**. If one "participant"
is itself a relationship, it is aggregation.

---

## 3. Rule sheet — memorise this page

**Specialization counting**
```text
Disjoint    ⇒ pairwise intersections = 0
Total       ⇒ union = |Superclass|
Partial     ⇒ union ≤ |Superclass|
"Neither"   = |Super| − |A ∪ B|
Overlap surplus = Σ|subclass| − |union|
```

**ER → table counts for a specialization** (superclass S, k subclasses)

| Constraint | Method | Tables |
| ---------- | ------ | -----: |
| Any | Superclass + subclass tables | `1 + k` |
| **Disjoint + Total** only | Subclass tables only (superclass attributes copied down) | `k` |
| Overlapping | Subclass-only is **invalid** (row duplication) | must use `1 + k` |

**Attribute → column rules**
```text
simple        → 1 column
composite     → 1 column per LEAF (the parent contributes none)
multi-valued  → separate table (owner_key, value); never a column
derived       → normally no column
```

**Abstraction / language**
```text
Physical independence : easier
Logical independence  : harder
Additive logical change      → usually safe
Restructuring logical change → usually breaks applications
DDL → structure (auto-commit) | DML → data
TRUNCATE = DDL, DELETE = DML
Relational Algebra = procedural | Relational Calculus = declarative
```

**Notation cheat-line**
```text
double rectangle = weak entity      double ellipse = multi-valued
double diamond   = identifying rel. dashed ellipse = derived
double line      = total particip.  underline      = key
dashed underline = discriminator    box around rel.= aggregation
```

---

## 4. GATE traps — compact

| # | Trap | Reality |
| - | ---- | ------- |
| 1 | "DBMS removes all redundancy" | It **controls** it. FKs/denormalization are deliberate redundancy |
| 2 | Atomicity = concurrency | Atomicity = all-or-nothing (one txn). Isolation = interleaving (many txns) |
| 3 | Physical independence is harder | **Logical** is harder |
| 4 | Composite = multi-valued | Composite = one value with parts. Multi-valued = many values |
| 5 | Derived = never stored | Derived = *derivable*; may be cached |
| 6 | Total participation ⇒ weak entity | False. Weak ⇒ total, not the converse |
| 7 | `TRUNCATE` behaves like `DELETE` | TRUNCATE is DDL: auto-commit, no `WHERE`, no row triggers |
| 8 | Aggregation = ternary relationship | Aggregation relates an entity to a **relationship** |
| 9 | Underlined attribute = prime attribute | "Prime" is an FD/normalization term (member of *some* candidate key) |
| 10 | Specialization and generalization are opposites in *result* | Same ISA structure; opposite *direction of thinking* |
| 11 | A count is a constraint | "Currently 0 entities are in both" ≠ "disjoint is declared" |
| 12 | Subclass has its own key | It inherits the superclass key |

---

## 5. Solved examples

### Example 1 — Attribute classification *(easy)*

`Employee(emp_id, name{first,last}, email_ids, DOB, experience_years)` where an employee may
hold several email addresses and `experience_years` is computed from `joining_date`.

<details><summary>Solution</summary>

| Attribute | Classification | Columns after conversion |
| --------- | -------------- | -----: |
| `emp_id` | simple, single-valued, **key** | 1 |
| `name` | **composite** (first, last) | 2 (leaves only) |
| `email_ids` | **multi-valued** | 0 → separate table |
| `DOB` | simple, stored | 1 |
| `experience_years` | **derived** | 0 |

`Employee` table = **4 columns**; plus `Employee_Email(emp_id, email)` → **2 tables**.
</details>

---

### Example 2 — Data independence *(GATE level)*

Which change can be made **without** modifying existing applications?

- (A) Splitting `Employee(id, name, dept, salary)` into two relations
- (B) Creating a B+ tree index on `Employee.id`
- (C) Renaming column `dept` to `department`
- (D) Dropping column `salary`

<details><summary>Solution — (B)</summary>

(B) is a **physical** change. Queries are unaffected → physical data independence holds.

(A), (C), (D) all alter the **logical** schema in a restructuring/subtractive way, so
existing SQL breaks. This is exactly why logical independence is the harder one.
</details>

---

### Example 3 — Specialization counting *(difficult)*

`Person` is specialized into `Employee` and `Student`, **overlapping and total**.
`|Person| = 900`, `|Employee| = 600`, `|Student| = 500`.

(a) How many persons are both?
(b) Keeping the same subclass sizes, can the specialization instead be declared **disjoint**?
(c) With `|Employee| = 600`, `|Student| = 200` and **disjoint + partial**, how many are in neither?

<details><summary>Solution</summary>

**(a)** Total ⇒ `|E ∪ S| = |Person| = 900`.
```text
|E ∩ S| = |E| + |S| − |E ∪ S|
        = 600 + 500 − 900
        = 200
```

**(b) No — the constraint is infeasible.**
```text
Disjoint ⇒ |E ∩ S| = 0 ⇒ |E ∪ S| = 600 + 500 = 1100
But       |E ∪ S| ≤ |Person| = 900
1100 > 900  →  contradiction
```
Disjointness is impossible at these sizes. Whenever `Σ|subclass| > |Super|`, the
specialization **must** be overlapping, and the excess `1100 − 900 = 200` is forced into the
intersection — which is exactly the answer to (a).

**(c)** Disjoint ⇒ `|E ∪ S| = 600 + 200 = 800`. Partial allows entities in neither:
```text
neither = |Person| − |E ∪ S| = 900 − 800 = 100
```

> **Habit:** compare `Σ|subclass|` against `|Super|` *before* computing anything.
> `Σ > |Super|` ⇒ overlapping is forced. `Σ < |Super|` ⇒ partial is forced.
> `Σ = |Super|` ⇒ consistent with disjoint + total.
</details>

---

### Example 4 — Aggregation detection *(top-scorer)*

A schema has `works_on(Employee, Branch, Job)`. Requirement: record **which manager manages
each employee's assignment at a branch**. A designer proposes
`manages(Manager, Employee, Branch, Job)`.

<details><summary>Solution</summary>

**Superset scan:** `manages` participants ⊇ `works_on` participants, plus `Manager`.
That is the aggregation signature.

**Why the proposal is wrong:** `manages` re-records the `(Employee, Branch, Job)` triple
already stored by `works_on` → **redundant relationship**. Worse, nothing forces the triple in
`manages` to also exist in `works_on`, so the two can contradict each other.

**Correct:** aggregate `works_on` into a higher-level entity, then create a **binary**
relationship `manages(Manager, ⟨works_on⟩)`.

**Relationship-set count:** 2 (`works_on`, `manages`) — not 2 independent ternary/4-ary sets.
</details>

---

## 6. Advanced practice — top-ranker set

> 18 questions. **[H]** hard · **[VH]** very hard · **[TS]** top-scorer.
> Attempt **without** opening solutions. Target: 14+/18.

**Q1 [H] (NAT).** `Vehicle` is specialized into `Car`, `Truck`, `Bus` — **overlapping, total**.
`|Vehicle| = 500`, `|Car| = 300`, `|Truck| = 250`, `|Bus| = 150`. Exactly 40 vehicles belong to
all three. No vehicle is outside these. Find the number belonging to **exactly two** subclasses.

**Q2 [VH] (MSQ).** `Person → {Employee, Customer}`, **disjoint + partial**, `|Person| = 1000`,
`|Employee| = 400`, `|Customer| = 350`. Which are true?
(A) 250 persons are in neither (B) `|E ∪ C| = 750` (C) Converting with subclass-tables-only is
valid (D) Superclass + subclass tables = 3 tables

**Q3 [VH] (MCQ).** A specialization of `A` into `A1, A2` is **disjoint and total**.
Which conversion is lossless **only because** of those two constraints — i.e. would become
lossy if either constraint were dropped?
(A) 3 tables: `A`, `A1`, `A2` (B) 2 tables: `A1`, `A2` with `A`'s attributes copied into both
(C) 1 table with a type discriminator and nullable columns (D) None — all three are always lossless

**Q4 [TS] (MSQ).** `Employee works_on (Branch, Job)` is ternary. `Manager manages` the whole
`works_on` association. Which are true?
(A) `manages` is a binary relationship after aggregation
(B) Without aggregation the model has a redundant relationship set
(C) Aggregation converts `works_on` into an entity **set** conceptually
(D) Aggregation increases the degree of `works_on` to 4

**Q5 [H] (NAT).** `Student(roll[key], name{first,mid,last}, phones[multi], addr{street,city,pin},
CGPA[derived], DOB)`. After ER→relational conversion, how many **columns** does the `Student`
table have? *(count only Student, exclude derived)*

**Q6 [VH] (MCQ).** Which single change is guaranteed to preserve **logical** data independence?
(A) Renaming a relation (B) Adding a new attribute at the end of a relation
(C) Merging two relations into one (D) Changing a column's data type from `INT` to `VARCHAR`

**Q7 [TS] (MSQ).** Select the statements that are **false**.
(A) A weak entity set always has total participation in its identifying relationship
(B) An entity set with total participation must be weak
(C) A weak entity set's discriminator is underlined with a solid line
(D) A weak entity set may have a relationship with a set other than its owner

**Q8 [H] (MCQ).** `TRUNCATE TABLE T` vs `DELETE FROM T`. Which is correct?
(A) Both are DML and both can be rolled back
(B) TRUNCATE is DDL, auto-commits, and does not fire row-level triggers
(C) DELETE is DDL and faster for full-table removal
(D) Both reset identity/auto-increment counters identically

**Q9 [VH] (MSQ).** `Person → {Male, Female}` disjoint+total and `Person → {Employee, Student}`
overlapping+partial exist **simultaneously** on the same `Person`. Which hold?
(A) This is a specialization **lattice** only if some subclass has 2 superclasses
(B) Both specializations may coexist on one superclass
(C) An entity can be `Male` and `Employee` and `Student` at once
(D) Disjointness of the first forces disjointness of the second

**Q10 [TS] (MCQ).** A relationship `R` is proposed between entity set `M` and relationship set
`W(X, Y, Z)`. The designer instead models it as a 4-ary relationship `R'(M, X, Y, Z)`.
The **most precise** consequence is:
(A) `R'` cannot represent that a particular `(X,Y,Z)` combination exists in `W`
(B) `R'` is semantically equivalent and simply uses more storage
(C) `R'` permits `(X,Y,Z)` triples inconsistent with `W`, i.e. loses a referential guarantee
(D) `R'` violates first normal form

**Q11 [H] (MSQ).** Which are **physical**-level concerns only?
(A) Choice of B+ tree vs hash index (B) Number of attributes in a relation
(C) Block size and record layout on disk (D) Whether a view exposes `salary`

**Q12 [VH] (NAT).** `A → {A1, A2, A3}` overlapping+total, `|A| = 200`. `Σ|Ai| = 260`.
No entity is in all three. How many entities are in **exactly two** subclasses?

**Q13 [TS] (MSQ).** Which statements about attribute inheritance are true?
(A) A subclass inherits the superclass's participation in relationship sets
(B) A subclass's primary key is its own newly defined attribute
(C) Attributes defined on a subclass are visible to the superclass
(D) In a lattice, a subclass inherits from all its superclasses

**Q14 [VH] (MCQ).** The statement *"currently, no Person is both an Employee and a Customer"*
appears in a requirements document. This justifies:
(A) Declaring the specialization disjoint
(B) Declaring it overlapping
(C) Nothing about the constraint — it describes an instance, not a schema rule
(D) Declaring it total

**Q15 [H] (MCQ).** Which sequence correctly orders the database design lifecycle?
(A) Requirements → Logical → Conceptual → Physical
(B) Requirements → Conceptual → Logical → Refinement → Physical
(C) Conceptual → Requirements → Physical → Logical
(D) Requirements → Physical → Logical → Conceptual

**Q16 [TS] (MSQ).** A `Loan_Payment` weak entity has discriminator `payment_no`, owner
`Loan(loan_no)`. Which are true?
(A) Its primary key is `(loan_no, payment_no)`
(B) `payment_no` alone is unique across the whole set
(C) Deleting a `Loan` must delete its payments
(D) The identifying relationship is drawn as a double diamond

**Q17 [VH] (NAT).** `E` has attributes: 2 simple single-valued, 1 composite with 3 leaves,
1 composite with 2 leaves (one of which is itself composite with 2 leaves), 1 multi-valued,
1 derived. How many **columns** does `E`'s table have?

**Q18 [TS] (MSQ).** Which are true about the three-level architecture?
(A) There is exactly one logical schema per database
(B) There may be many external schemas
(C) Physical data independence is generally easier to achieve than logical
(D) A view is part of the physical schema

---

## 7. Advanced practice — solutions

<details><summary><b>Q1 — Answer: 120</b></summary>

Overlapping + total ⇒ `|C ∪ T ∪ B| = 500`.
Let `e1, e2, e3` = counts in exactly 1, 2, 3 subclasses. Given `e3 = 40`.
```text
e1 + e2 + e3 = 500                    (union)
e1 + 2·e2 + 3·e3 = 300+250+150 = 700  (membership sum)
```
Subtract: `e2 + 2·e3 = 200` ⇒ `e2 = 200 − 80 = **120**`.

*Technique: membership-sum minus union isolates the overlap.*
</details>

<details><summary><b>Q2 — Answer: (A), (B), (D)</b></summary>

Disjoint ⇒ `|E ∩ C| = 0` ⇒ `|E ∪ C| = 400 + 350 = 750` → **(B)** ✓
Neither = `1000 − 750 = 250` → **(A)** ✓
**(C)** ✗ — subclass-tables-only requires **total**. Here it is partial, so the 250 persons in
neither subclass would be **lost**.
**(D)** ✓ — `1 + k = 1 + 2 = 3`.
</details>

<details><summary><b>Q3 — Answer: (B)</b></summary>

**(B) is the constraint-dependent one.** Subclass-tables-only works here because:
- **total** ⇒ every `A` entity appears in some subclass table → nothing is lost
- **disjoint** ⇒ no entity appears in two subclass tables → nothing is duplicated

Drop **total** → entities in neither subclass vanish. Drop **disjoint** → entities in both are
stored twice, and the two copies can drift apart.

(A) and (C) stay lossless regardless of the constraints, so they are not the answer.

> **Rule:** subclass-only conversion is legal **only** under disjoint + total.
</details>

<details><summary><b>Q4 — Answer: (A), (B), (C)</b></summary>

(A) ✓ After aggregating `works_on`, `manages` links `Manager` ↔ ⟨works_on⟩ → **binary**.
(B) ✓ A 4-ary `manages(Manager, Employee, Branch, Job)` repeats the triple `works_on` stores.
(C) ✓ That is precisely the definition — treat a relationship set as a higher-level entity set.
(D) ✗ `works_on` stays ternary. Aggregation wraps it; it does not change its degree.
</details>

<details><summary><b>Q5 — Answer: 8</b></summary>

```text
roll                  → 1   key, simple
name{first,mid,last}  → 3   leaves only
addr{street,city,pin} → 3   leaves only
DOB                   → 1   stored
phones                → 0   multi-valued → separate table
CGPA                  → 0   derived → not stored
                      ────
                         8
```

**Common errors:** counting the composite *parent* as a column too (gives 10), or giving
`phones` a column (gives 9).
</details>

<details><summary><b>Q6 — Answer: (B)</b></summary>

Logical data independence = change the logical schema without touching applications.
- **(B)** Adding an attribute at the end: existing queries naming columns explicitly still
  work → safe. **Additive change.**
- (A), (C), (D) are renaming/restructuring/type changes → break existing SQL.

*Rule: additive logical changes preserve independence; restructuring ones do not.*
</details>

<details><summary><b>Q7 — Answer: (B), (C)</b></summary>

(A) TRUE — weak entity sets always have total participation in the identifying relationship.
**(B) FALSE** — total participation does not imply weakness. A strong set can be total.
**(C) FALSE** — the discriminator is underlined with a **dashed** line.
(D) TRUE — a weak entity set may participate in other, non-identifying relationships.
</details>

<details><summary><b>Q8 — Answer: (B)</b></summary>

`TRUNCATE` is **DDL**: deallocates data pages, auto-commits, cannot use `WHERE`, does not fire
row-level triggers. `DELETE` is **DML**: row-by-row, logged, rollback-able, fires triggers.
(D) is false — behaviour on identity counters differs (TRUNCATE typically resets, DELETE does not).
</details>

<details><summary><b>Q9 — Answer: (B), (C)</b></summary>

(A) ✗ A lattice requires a subclass with **multiple superclasses**; two independent
specializations of one superclass is still a tree (hierarchy).
(B) ✓ A superclass may have several independent specializations on different criteria.
(C) ✓ The two specializations are independent, so Male ∧ Employee ∧ Student is permitted
(the second is overlapping).
(D) ✗ The axes are independent across different specializations.
</details>

<details><summary><b>Q10 — Answer: (C)</b></summary>

The 4-ary `R'` stores `(M, X, Y, Z)` tuples with **no guarantee** that `(X,Y,Z)` actually
appears in `W`. Aggregation makes `R` reference the *existing* `W` instance, preserving that
referential guarantee.
(A) is too strong — `R'` *can* record the combination, it just cannot guarantee consistency.
(B) ignores the semantic loss. (D) is unrelated to 1NF.
</details>

<details><summary><b>Q11 — Answer: (A), (C)</b></summary>

(A) ✓ index structure choice = physical. (C) ✓ block size/record layout = physical.
(B) ✗ number of attributes = **logical**. (D) ✗ view contents = **external/view** level.
</details>

<details><summary><b>Q12 — Answer: 60</b></summary>

Total ⇒ union = 200. `e3 = 0`.
```text
e1 + e2 = 200
e1 + 2·e2 = 260
```
Subtract ⇒ `e2 = **60**`.
</details>

<details><summary><b>Q13 — Answer: (A), (D)</b></summary>

(A) ✓ Participation in the superclass's relationships is inherited.
(B) ✗ The subclass's primary key **is the superclass's key**.
(C) ✗ Inheritance is downward only.
(D) ✓ That is what a specialization lattice means.
</details>

<details><summary><b>Q14 — Answer: (C)</b></summary>

"Currently no person is both" describes the **instance** at one moment. A disjointness
constraint is a **schema** rule that must hold for *all* future instances.

> **A count is not a constraint.** This distinction is a recurring GATE discriminator.
</details>

<details><summary><b>Q15 — Answer: (B)</b></summary>

Requirements → Conceptual (ER) → Logical (relational schema) → Schema refinement
(normalization) → Physical → Implementation.
</details>

<details><summary><b>Q16 — Answer: (A), (C), (D)</b></summary>

(A) ✓ owner key + discriminator.
(B) ✗ `payment_no` is unique only **within one loan** — that is what "discriminator" means.
(C) ✓ Existence dependency ⇒ cascading delete.
(D) ✓ Identifying relationship = double diamond.
</details>

<details><summary><b>Q17 — Answer: 8</b></summary>

Resolve the nested composite first:

```text
composite #2 has 2 children:
      child_1  → plain leaf                    → 1
      child_2  → composite with 2 leaves       → 2
                                                ───
                              leaves of #2 =      3
```

Now total the columns:

```text
2 simple single-valued      → 2
composite #1 (3 leaves)     → 3
composite #2 (3 leaves)     → 3
multi-valued                → 0   separate table
derived                     → 0
                            ───
                              8
```

**Only true leaves become columns** — nesting depth is irrelevant, and intermediate composite
nodes contribute nothing.
</details>

<details><summary><b>Q18 — Answer: (A), (B), (C)</b></summary>

(A) ✓ One logical schema per database.
(B) ✓ Many external schemas/views.
(C) ✓ Physical independence is the easier one.
(D) ✗ A view belongs to the **external** level.
</details>

---

## 8. Don't confuse these

| A | B | Discriminator |
| - | - | ------------- |
| Schema | Instance | Design vs data-right-now |
| Physical independence | Logical independence | Logical is harder |
| Composite attribute | Multi-valued attribute | Parts of one value vs many values |
| Derived | Stored | Derivable vs physically kept |
| Specialization | Generalization | Top-down vs bottom-up |
| Disjoint/Overlapping | Total/Partial | *Which* subclass vs *whether any* subclass |
| Weak entity set | Total participation | Weak ⇒ total; total ⇏ weak |
| Aggregation | Ternary relationship | Participant is a relationship vs three entities |
| DDL | DML | Structure vs data |
| `TRUNCATE` | `DELETE` | DDL vs DML |
| Atomicity | Isolation | One transaction vs many |
| Key attribute (ER) | Prime attribute (FD) | Underlined vs member of some candidate key |

---

## 9. Rapid revision — 5 minutes

```text
DBMS exists to insert a software layer between user and disk.
7 file-system problems: redundancy, access, isolation, integrity,
                        atomicity, concurrency, security.
Schema = design (static)      Instance = data (dynamic)
3 levels: physical → logical → view
  Physical independence : EASIER      Logical independence : HARDER
  Additive logical change = safe ; restructuring = breaks apps
DDL = structure (auto-commit, TRUNCATE here)   DML = data (DELETE here)
RA = procedural        RC/SQL = declarative

ER:  rect=entity  double rect=weak  diamond=rel  double diamond=identifying
     ellipse=attr double ellipse=multi  dashed ellipse=derived
     underline=key  dashed underline=discriminator  double line=total
     box around relationship = AGGREGATION

Attributes → columns:  composite→leaves  multi-valued→new table  derived→none

EER: Specialization=top-down   Generalization=bottom-up
     Subclass inherits attributes AND relationships; key = superclass key
     2x2:  disjoint/overlapping  ×  total/partial
       Total    ⇒ union = |Super|
       Disjoint ⇒ intersections = 0
       Σ|sub| − |union| = overlap surplus
     Subclass-only conversion valid ONLY if disjoint + total

Aggregation: needed when a relationship must participate in a relationship.
             Superset scan detects it. Avoids a redundant relationship set.
```

---

## 10. Mastery checklist

- [ ] I can state all 7 file-system drawbacks and give an example of each
- [ ] I can say which data independence is harder **and why**
- [ ] I can predict whether a given schema change breaks applications
- [ ] I can classify any attribute and count its resulting columns
- [ ] I can place a specialization in the 2×2 from a worded description
- [ ] I can solve 3-subclass overlap problems with inclusion–exclusion
- [ ] I know when subclass-only conversion is legal (disjoint + total)
- [ ] I can spot an aggregation using the superset scan
- [ ] I can explain why the non-aggregated design is redundant **and unsafe**
- [ ] I never confuse a count with a constraint

---

## Next module

```text
THIS MODULE  → a complete conceptual (ER) design

NEXT         → ER to Relational conversion
                 entity set → table
                 multi-valued attribute → own table
                 relationship → table or FK (driven by cardinality + participation)
                 specialization → table-count rules from §3

THEN         → Relational model → keys → FDs → closure → candidate keys
               → prime attributes → normalization
```
