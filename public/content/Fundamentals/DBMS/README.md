---
description: GATE CSE study module built from lectures 1–5 of the DBMS course — data/database/DBMS, why file systems fail, schema vs instance, three-level abstraction, database languages and users, data models, the design lifecycle, and the extended ER model (specialization, generalization, aggregation, attribute types).
---

# 01-DBMS Foundations — Architecture, Abstraction, Data Models & ER Modelling

| | |
| --- | --- |
| **Subject** | Database Management Systems |
| **Topics** | Data & databases · DBMS vs file systems · Schema & instance · Three-level abstraction · DDL/DML · Database users · Query processor & storage manager · Data models · Database design lifecycle · Extended ER model |
| **Difficulty** | Easy → Advanced (the ER half is where questions actually get hard) |
| **GATE Importance** | ⭐⭐⭐⭐ (ER modelling and abstraction/data-independence are directly askable; the "history of DBMS" narration is not) |
| **Prerequisite for** | ER→Relational conversion, Relational model, Keys, Functional dependencies, Normalization, Indexing, Transactions |

> **Source note.** This module is built from a five-lecture introductory sequence
> (Introduction → DBMS architecture → data models & design lifecycle → ER basics → extended
> ER features). The lectures spend a large fraction of their runtime on course
> announcements and motivation; that material is deliberately dropped here. Everything
> technical the lectures covered is kept, reordered into exam order, and corrected where the
> lecture was loose. Corrections are marked **⚠️ Correction / Important Clarification**.
>
> One topic — **ER basics (entity, entity set, relationship, degree, mapping cardinality,
> total/partial participation, weak entity sets)** — was taught in a lecture that is *not*
> in this transcript, but lecture 5 opens by recapping it and builds directly on it. Those
> concepts are therefore summarised here at recap depth (§4.11) so this module stands on its
> own, and flagged so you know where to go deeper.

---

## 2. Why this topic matters for GATE

This module is the *entry* to DBMS, and GATE treats its two halves very differently.

**The half GATE mostly ignores as standalone questions**

- The story of "data → database → DBMS"
- Lists of database applications (airlines, banking, universities)
- Two-tier vs three-tier architecture

The lecture itself says two-tier/three-tier is "more of a semester-exam thing than a GATE
thing." That matches how the topic is usually treated — but treat it as the educator's
judgement, not as a published statistic. Learn it once, cheaply; don't drill it.

**The half that is genuinely examinable**

| Concept | How GATE tests it |
| --- | --- |
| Three levels of abstraction + **data independence** | Conceptual MCQ: *which schema change forces application programs to change?* |
| **Schema vs instance** | Definitional MCQ, and as vocabulary inside harder questions |
| **DDL vs DML**, procedural vs declarative | Classification MCQ/MSQ — `TRUNCATE`, `CREATE VIEW`, relational algebra vs SQL |
| **File-system problems** | Mapping a described failure to the right anomaly (atomicity vs isolation vs integrity) |
| **Attribute types** (simple/composite, single/multi-valued, derived, prime) | Feeds directly into ER diagram reading and, via *prime*, into all of normalization |
| **Specialization / generalization**, disjoint vs overlapping, total vs partial | Counting questions (NAT), constraint reasoning, and later the number-of-tables rules |
| **Aggregation** | "Which of these cannot be modelled without aggregation?" — recognising relationship-on-relationship |
| **Attribute inheritance** | MSQ on what exactly is inherited (attributes *and* relationship participation) |

**Question style you should expect:** overwhelmingly **conceptual MCQ/MSQ**, with
**NAT** appearing on the counting side of specialization (given `|E|` and constraints, find
max/min entities in subclasses) and later on ER→table counts. Almost nothing here is
computational in the arithmetic sense — the difficulty is precision of definitions and
noticing which constraint a question quietly changed.

**What "top-scorer level" means for this module:** you are not done when you can define
generalization. You are done when you can look at an ER fragment and immediately say *which
constraint is missing*, *whether the design is redundant*, and *what would change in the
resulting tables* — and when the words "prime", "key", "total" and "disjoint" never blur
into each other under time pressure.

---

## 3. Prerequisites

```text
Required:
- Basic set theory: set, subset, union, intersection, disjoint sets, cardinality
- What a table/row/column is (informally)
- Any one programming language with file I/O (to feel why file storage hurts)

Helpful (used only in cross-links, not required to follow this module):
- OS: mutual exclusion, race conditions  → explains concurrency anomalies
- OS/COA: disk vs RAM access cost        → explains the storage manager's job
- DSA: trees, hashing                   → previews indexing (physical design)
```

Nothing else. Specifically, you do **not** need normalization or SQL yet — both are
downstream of this module.

---

## 4. Core concepts — from zero to top-scorer level

### 4.1 Data, database, and DBMS

#### Intuition

Three words that students use interchangeably and exams do not.

- **Data** — raw facts. The number `1599` on its own.
- **Database** — those facts collected *and organised*, so each one has meaning. `1599` now
  sits in the `price` column of a `Shirt` row, so it *means* something.
- **DBMS** — the database **plus the programs** that put data in, take it out, change it,
  and protect it.

The lecture's analogy is good: in every class there is one person who knows who lives where,
who is preparing for which exam, who is doing which project. That person is the class's
*database*. What makes them useful is not only that they hold the facts — it is that you can
*ask* them and get a filtered answer. The asking machinery is the *management system*.

#### Formal definition

> **Data** is raw facts and figures with no inherent interpretation.
>
> A **database** is an organised, structured collection of *interrelated* data representing
> some aspect of the real world (an *enterprise*).
>
> A **DBMS** is a collection of interrelated data **together with a set of programs to
> access, define, construct, manipulate and share that data**.

So the standard one-liner:

```text
DBMS  =  database  +  set of programs to access it
```

#### Why it works

The "+ programs" half is the whole point. Storage without access machinery is a warehouse
with no doors. The programs must support at least:

```text
INSERT   put new data in
DELETE   remove data
UPDATE   change existing data
RETRIEVE query — pull out a specific subset
```

The lecture stresses that **retrieval is the operation used most**, and it is right: an
e-commerce shopper filters by *formal shirt · white · plain · size S* far more often than
anyone inserts a new shirt. Design pressure therefore concentrates on querying.

#### Example

Building a clothing e-commerce site:

```text
Data      : "White", "S", 1599, 3
Database  : Shirt(id, name, brand, size, quantity, price, type)
            T_Shirt(id, name, brand, size, quantity, price, colour, pattern)
            ... one organised collection of related tables
DBMS      : the system that lets the site
            - show the catalogue          (retrieve)
            - decrement quantity on order (update)
            - drop a sold-out item        (delete)
            - add new stock               (insert)
            - and stops a shopper seeing the owner's daily revenue (security)
```

#### GATE perspective

Asked only as a definitional MCQ, usually by offering a subtly wrong option: *"a database is
any collection of data"* (wrong — it must be organised and interrelated), or *"a DBMS is the
data itself"* (wrong — it is data **plus** programs).

#### Important edge cases

- A single `.csv` file *is* data, and arguably a degenerate database, but it is **not** a
  DBMS — no access programs, no constraints, no concurrency control.
- An organised collection is not automatically a database in the DBMS sense unless the items
  are **interrelated** and describe one enterprise.

#### Common trap

Thinking "database" and "DBMS" are synonyms because everyday speech says "the database went
down." In an exam, *database* = the stored data; *DBMS* = the software managing it. MySQL,
PostgreSQL and Oracle are **DBMSs**; the tables inside them are the **database**.

---

### 4.2 The design goals of a DBMS

#### Intuition

If you were the architect asked to build a new DBMS from scratch, what would you optimise?
The lecture names two goals, and a third follows from the whole discussion.

#### Formal definition

> A DBMS aims to provide a way to store and retrieve database information that is both
> **convenient** and **efficient**, while enforcing **security** — each user may access only
> the data they are authorised to, in the manner they are authorised to.

| Goal | Means | Concrete test |
| --- | --- | --- |
| **Convenience** | Easy to express what you want | A shopper clicks "white" and gets white shirts; nobody writes a program |
| **Efficiency** | Fast, and correct-by-construction | The right rows come back, quickly, without wrong rows sneaking in |
| **Security** | Per-user, per-operation authorisation | You see *your* bank balance, not your neighbour's, and cannot edit your marks |

#### Why it works

Convenience and efficiency pull in opposite directions, which is exactly why a DBMS is hard
and interesting. Letting the user say only *what* they want (convenient) means the system
must decide *how* to get it (efficiency becomes the system's problem, not the user's). That
single trade-off is the seed of query optimisation, and it reappears in §4.6 as
**declarative vs procedural** languages.

#### Example

Three security levels on the same fact, `salary = 50000`:

```text
Employee themself : may READ own salary
Manager           : may READ all salaries in their branch
Payroll admin     : may READ and UPDATE
Shopper on site   : may not even know the column exists
```

Same stored bit pattern, four different permitted views and operations.

#### GATE perspective

Rarely asked alone; appears as a distractor-heavy MCQ ("which is *not* a goal of a DBMS?").
Its real value is that it *explains* every later mechanism — so when a question asks *why*
views exist, the answer is security + convenience, not storage.

#### Important edge cases

- Security is **per-operation**, not just per-data. Read-only access to your university
  result is the canonical example: you may *see* the marks and may not *change* them.
- Efficiency here means *convenient and efficient access*, not "the fastest possible
  program." A hand-written C file-scan can beat a DBMS on one fixed query; it loses the
  moment the query changes.

#### Common trap

Answering "the goal of a DBMS is to store data." Storage is the premise, not the goal — a
file system already stores data. The goals are *convenient, efficient, secure* access.

---

### 4.3 Why not just use files? The seven disadvantages

This is the most quotable list in the whole module, and the lecture covers all seven of the
classical ones. Memorise the list, but more importantly be able to **map a described
symptom to the right name** — that is what gets tested.

Setting: you store your clothing inventory in spreadsheets/CSV files and write programs
against them.

```text
        ┌──────────────────────── FILE-PROCESSING SYSTEM ────────────────────────┐
        │                                                                        │
        │   shirts.xlsx      tshirts.csv      customers.docx      orders.xlsx    │
        │        ▲                ▲                 ▲                  ▲         │
        │        │                │                 │                  │         │
        │   prog_A.c          prog_B.py         prog_C.java       prog_D.c       │
        │                                                                        │
        │   No manager sits on top. Every file and program is independent.       │
        └────────────────────────────────────────────────────────────────────────┘
                                        │
             that missing manager is exactly what a DBMS provides
```

#### (1) Data redundancy and inconsistency

**Redundancy** — the same fact stored in more than one place. Once you have many
spreadsheets, a shirt's price may sit in two of them.

**Inconsistency** — an update applied to one copy and not the other. A shirt's price goes
₹2000 → ₹2100; the new operator changes one sheet, not knowing a second copy exists. Now two
answers to one question, and no way to tell which is right.

```text
  file1 : shirt#7 price = 2100      ← updated
  file2 : shirt#7 price = 2000      ← missed
                    │
                    └── which is correct? the system cannot say
```

The root cause is precise, and worth stating in exactly these words: **no single component
knows all the places a fact is stored.** A DBMS has that component.

> ⚠️ **Correction / Important Clarification**
> The lecture says redundancy "is possible in a DBMS too, but it is not forced — it is there
> for some good reason." That is right but easy to over-read. State it properly:
> **a DBMS controls redundancy; it does not eliminate it.**
> Controlled redundancy is normal and necessary — a foreign key value genuinely appears in
> two relations. What the DBMS guarantees is that the system *knows* about the duplication
> and can keep the copies consistent (via constraints, and later via normalization to remove
> the *uncontrolled* kind). Writing "a DBMS removes all redundancy" in an exam is wrong.

#### (2) Difficulty in accessing data

Each new question needs a new program. Male shirts in one file, female in another. A
programmer writes "fetch t-shirts by colour." Then a customer wants *both* sections
combined, black, in a specific size — a requirement nobody anticipated, so a **new program**
must be written to open both files, merge, and filter.

```text
new requirement  →  new program  →  new requirement  →  new program  →  ...
```

In a DBMS the same need is one query, and the *user* — not the programmer — composes it.
This is the practical face of the convenience goal.

#### (3) Data isolation

Data ends up **scattered across files in different formats** — some `.xlsx`, some `.docx`,
some `.csv` arriving from a customer. Writing one program that gathers a coherent answer out
of heterogeneous, scattered files is painful.

> Distinguish (2) and (3) carefully, because they feel similar:
> **(2)** is about *new queries needing new programs* — an interface problem.
> **(3)** is about *data being split across incompatible files/formats* — a layout problem.

#### (4) Integrity problems

Business rules ("constraints") are hard to enforce in files, because a constraint must be
checked by *every* program that touches the data — and any program can forget.

```text
Withdraw ₹5000 from an account holding ₹4000
   → must be refused, because balance ≥ 0 is a constraint
Phone number must be exactly 10 digits
Loan demand must not exceed the sanctioned loan amount
```

In files, each rule is buried inside application code, repeated and un-auditable. In a DBMS
you *declare* the constraint once and the system enforces it for everybody — and later,
constraints like `FOREIGN KEY` become available, which are effectively impossible to enforce
by hand across independent files.

#### (5) Atomicity problems

An operation must be **all or nothing**. The canonical example:

```text
Transfer ₹2000 from A (₹5000) to B (₹2000)

  step 1  debit A   : A = 3000     ✓ done
  step 2  credit B  : B = 4000     ✗ system crashes here

  Result on disk: A = 3000, B = 2000   →  ₹2000 has vanished
```

Atomicity demands either both steps or neither — and if we stop midway, the system must
**roll back** to the state as if the transaction never started.

The lecture adds a second, better example from real shopping sites: you reach the payment
page, the site sets that shirt's availability to 0 to reserve it, your payment **fails**, and
the availability is never restored. The item is now invisible to everyone although it is in
stock. Same defect: a partially completed operation left permanent effects.

A file system gives you no rollback for free. A DBMS does.

#### (6) Concurrent access anomalies

Two operations touching one data item *at the same time* can leave the database in a state
no single correct execution could produce.

The lecture's inventory version: one shirt in stock; a buyer in Delhi and a buyer in
Bangalore both read "available", both pay, both succeed. One shirt, two owners.

The bank version is the sharper one, and it is the classic **lost update**:

```text
Balance = 20000. Two clerks each deposit 5000, concurrently.

  clerk 1: read 20000 ──┐
  clerk 2: read 20000 ──┤   both read the SAME old value
  clerk 1: write 25000 ─┤
  clerk 2: write 25000 ─┘   second write overwrites the first

  Expected 30000. Actual 25000. One deposit is lost.
```

> ⚠️ **Correction / Important Clarification**
> The lecture calls this "mutual exclusion," borrowing the OS term. The *mechanism* is
> indeed mutual exclusion (locking), and the OS intuition transfers perfectly — but name the
> **problem** correctly in a DBMS answer. The DBMS vocabulary is:
> - the property you want = **isolation** (the *I* of ACID);
> - the machinery = **concurrency control** (locking, timestamps);
> - this specific anomaly = the **lost update** problem.
>
> Also note the distinction GATE likes: uncontrolled concurrency *and* broken atomicity both
> end in an inconsistent database, but they are different failures — atomicity is about a
> **single** transaction stopping midway, isolation is about **two or more** transactions
> interleaving badly. §13 has a trap question built on exactly this confusion.

#### (7) Security problems

In a file system, data is exposed at the level of the operating system's file permissions,
which is far too coarse.

- A store manager should see inventory, not the owner's revenue or other employees' salaries.
- A bank customer sees one account — their own — not every account in the branch.
- A student may read their result and must not write it.

And the physical exposure is real: files sit visibly in the file system, so anyone browsing
the machine can open, copy, or delete them. The lecture's example is a child clearing disk
space for a game and deleting a file the system reported as "unused for a long time."

A database's storage files are, by contrast, not meaningfully usable through the OS file
browser — the DBMS mediates all access, so authorisation can be enforced per user, per
table, per column, per operation.

#### Summary table

| # | Problem | One-line symptom | DBMS answer |
| --- | --- | --- | --- |
| 1 | Data redundancy & inconsistency | Same fact twice; one copy updated | Controlled redundancy, constraints, normalization |
| 2 | Difficulty in accessing data | Every new question needs a new program | Declarative query language |
| 3 | Data isolation | Data scattered in incompatible files/formats | One unified, structured store |
| 4 | Integrity problems | Business rules enforced by hope | Declared constraints |
| 5 | Atomicity problems | Half-done operation left permanent | Transactions + rollback |
| 6 | Concurrent-access anomalies | Two writers, one lost update | Isolation / concurrency control |
| 7 | Security problems | Everyone can reach everything | Authentication + authorisation |

#### GATE perspective

The examinable skill is *mapping*, not listing. A question describes a scenario in words and
asks which problem it illustrates. Practise the mapping in both directions.

#### Common trap

Calling the "two buyers, one shirt" case an *atomicity* failure. It is a **concurrency /
isolation** failure — nothing was left half-done; two complete operations interleaved. And
calling the failed-payment-leaves-quantity-0 case a concurrency failure — it is
**atomicity**, since only one operation was involved and it stopped midway.

---

### 4.4 Schema and instance

#### Intuition

The single most useful analogy: **schema is the type declaration, instance is the value.**

```c
int x;        /* schema   : the design — a name and a type              */
x = 42;       /* instance : the value held right now                    */
x = 43;       /* new instance, SAME schema                              */
```

A table's schema is decided once, at design time. Its instance changes every time anybody
orders a shirt.

#### Formal definition

> The **schema** is the overall *design* of the database — the structure of each table and
> of the database as a whole. It is specified at design time and changes rarely.
>
> The **instance** is the collection of information *stored in the database at a particular
> moment*. It changes with every insert, delete and update.

#### Why it works

Separating them is what makes a DBMS maintainable. Programs are written against the
**schema**, which is stable, and therefore keep working while the **instance** churns
underneath them. If programs depended on the instance, every sale would break the website.

#### Example

```text
SCHEMA of Shirt (design — set once)
┌────┬──────┬───────┬──────┬──────────┬───────┬──────┐
│ id │ name │ brand │ size │ quantity │ price │ type │
└────┴──────┴───────┴──────┴──────────┴───────┴──────┘

INSTANCE at 10:00                       INSTANCE at 10:05 (someone bought one)
┌───┬────────────────┬─────┬───┬───┬──────┬───────┐   ┌───┬────────────────┬─────┬───┬───┬──────┬───────┐
│ 1 │ Black Printed  │ XYZ │ S │ 3 │ 1599 │ Plain │   │ 1 │ Black Printed  │ XYZ │ S │ 2 │ 1599 │ Plain │
└───┴────────────────┴─────┴───┴───┴──────┴───────┘   └───┴────────────────┴─────┴───┴───┴──────┴───────┘
                                                                              ↑
                                  same schema, different instance ────────────┘
```

Events that change the **instance**: an order (quantity ↓), a sell-out (row deleted), new
stock (rows inserted), a price cut (value updated).
Events that change the **schema**: adding a `discount` column, dropping one.

#### GATE perspective

Direct definitional MCQ, and a frequent source of "which of the following changes the
schema?" classification items. It is also load-bearing vocabulary: DDL acts on the schema,
DML acts on the instance (§4.6), and the three abstraction levels each have both a schema
and an instance (§4.5).

#### Important edge cases

- There are **three schemas** in a DBMS, one per abstraction level — physical, logical and
  view (subschema) — not one. §4.5 makes this precise.
- The **logical schema** is by far the most important, because applications are written
  against it.
- An instance can be **empty** (a freshly created table). An empty instance is still a valid
  instance, and its schema is fully defined.

#### Common trap

Reading "database state" and assuming schema. *State* = instance. And the reverse trap:
thinking that because the schema is "the design", it lives only on paper — no, it is stored
in the database's own catalogue/data-dictionary.

---

### 4.5 The three levels of abstraction (and data independence)

#### Intuition

The same database is shown at three different distances, so that each audience sees exactly
what it needs and nothing else.

```text
                        ┌───────────────────────────────────┐
   end users     ───▶   │  VIEW LEVEL  (many views)         │   "my account only"
                        │  small windows onto the logical   │
                        └─────────────────┬─────────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
   DB designer   ───▶   │  LOGICAL LEVEL  (one schema)       │   tables + relationships
   applications         │  what data, and how it relates     │
                        └─────────────────┬─────────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
   DBMS internals ──▶   │  PHYSICAL LEVEL                    │   files, pages, B+ trees
                        │  how bytes actually sit on disk    │
                        └───────────────────────────────────┘
```

The lecture's framing is exactly right and worth keeping: the person who designed the tables
**knows every table and column, and has no idea where on the disk any of it lives**. That
ignorance is not a bug — it is the feature.

#### Formal definition

> **Physical level** — the lowest level; describes *how* the data is actually stored
> (records, files, blocks, access structures).
>
> **Logical level** — describes *what* data is stored and *what relationships* exist among
> it. One logical schema per database.
>
> **View level** — the highest level; describes only *part* of the database, tailored to a
> particular group of users. Many views may exist over one logical schema.

#### Why it works — data independence

This is the payoff, and it is the part the lecture leaves implicit. The reason for stacking
three levels is to **absorb change**.

| Kind | Definition | Consequence |
| --- | --- | --- |
| **Physical data independence** | The ability to change the *physical* schema without changing the *logical* schema | Switch a table's file organisation or add an index → applications untouched |
| **Logical data independence** | The ability to change the *logical* schema without changing the *views* / application programs | Split a table, add a column → views ideally shield applications |

> ⚠️ **Important addition (not in the transcript)**
> The lectures describe the three levels but never name **data independence**. Do not skip
> it — it is the single most examinable consequence of this hierarchy, and the standard
> question is built on one asymmetry:
>
> **Physical data independence is easy to achieve; logical data independence is harder.**
>
> Why: applications are written directly against the logical schema, so a logical change can
> reach them. They are *not* written against the physical schema, so physical changes stop at
> the logical boundary. This asymmetry is the answer to most questions in this area.

#### Example

Bank database, one logical schema, many views:

```text
LOGICAL : Account(acc_no, cust_id, branch, balance)
          Customer(cust_id, name, street, city)
          Employee(emp_id, name, salary, branch)

VIEWS   : customer view  → only rows where cust_id = me, only (acc_no, balance)
          branch manager → all accounts of THIS branch
          regional mgr   → all accounts of all branches in the region
          teller         → account balances, no salaries

PHYSICAL: Account stored as a heap file; B+ tree index on acc_no;
          Customer clustered by city
```

Now change the physical level — drop the B+ tree, add a hash index. Every view and every
application still works, because none of them mentioned the index. That is physical data
independence, and it is why the DBA can tune performance at 3 a.m. without a code release.

#### GATE perspective

The workhorse question: *"A change in the ___ schema requires no change in application
programs."* Or an MSQ on which statements about the three levels are true. Know that:

- views are derived from the logical schema, never directly from the physical;
- the view-level user cannot tell what else the database contains — the lecture's line is
  apt: if you are browsing sarees, you cannot tell from that page whether jeans even exist
  in the catalogue;
- each level has its own schema, and the mapping between levels is the DBMS's job.

#### Important edge cases

- **Many views, one logical schema, one physical schema.** Counting questions rely on this.
- A view is *not* required to be a subset of one table — it can join several. "A small part
  of the logical level" means a *derived* portion, not a physical slice.
- The three-level architecture is the **ANSI/SPARC** three-schema architecture; the view
  level is also called the *external* level and the logical level the *conceptual* level.
  Recognise the synonyms, because papers switch between them.

#### Common trap

Assuming the logical level knows about physical storage. It does not, deliberately. And the
mirror-image trap: assuming the view level talks to the physical level. It does not — every
view is defined over the logical schema.

---

### 4.6 Database languages — DDL and DML

#### Intuition

Two different targets need two different languages, and §4.4 already gave you the split:

```text
acts on the SCHEMA   (the design)  →  DDL   Data Definition Language
acts on the INSTANCE (the values)  →  DML   Data Manipulation Language
```

Adding a `discount` column is a *design* change → DDL. Changing a price from 2000 to 2100 is
a *value* change → DML.

#### Formal definition

> A **DDL** is a language for specifying the database schema and for altering it — creating,
> modifying and removing the structures that hold data, and declaring constraints on them.
>
> A **DML** is a language for accessing and manipulating the data organised by that schema —
> retrieval, insertion, deletion and modification of values.

| | DDL | DML |
| --- | --- | --- |
| Target | Schema | Instance |
| Typical operations | `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, constraint declarations | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| Frequency of use | Rare (design time, migrations) | Constant (every request) |
| Who uses it | DBA, designer | Applications, analysts, everyone |

#### Procedural vs non-procedural DML

The important sub-classification, and the one GATE actually asks:

> A **procedural DML** requires the user to specify **what** data is needed **and how** to
> get it.
>
> A **non-procedural** (**declarative**) **DML** requires the user to specify only **what**
> data is needed; the system decides how.

The lecture's shopping filter makes this concrete. You state your requirement — *all shirts
of brand XYZ, size S, price under ₹2000*. In a **declarative** language you stop there, and
the query processor works out the access path and the ordering. In a **procedural** language
you would additionally dictate *how* to obtain and shape it.

```text
SQL                      → non-procedural / declarative DML
Relational algebra       → procedural
Tuple/domain relational
calculus                 → non-procedural / declarative
```

This is where §4.2's convenience-vs-efficiency tension resolves: because SQL is
declarative, "how" becomes the **query optimiser's** responsibility — which is precisely why
query optimisation exists as a topic at all.

> ⚠️ **Correction / Important Clarification**
> Two refinements on the lecture's two-language picture:
>
> 1. **SQL is not "a DDL" or "a DML" — it contains both**, plus more. Commercial SQL is
>    usually split into DDL (`CREATE`/`ALTER`/`DROP`/`TRUNCATE`), DML
>    (`SELECT`/`INSERT`/`UPDATE`/`DELETE`), **DCL** (`GRANT`/`REVOKE` — the security half of
>    §4.2) and **TCL** (`COMMIT`/`ROLLBACK`/`SAVEPOINT` — the atomicity half of §4.3).
>    Questions that ask you to classify a statement expect these four buckets.
> 2. `SELECT` is the *query* part of DML. Some textbooks name it separately as **DQL**. Both
>    conventions appear in papers; if options force a choice and DQL is absent, `SELECT`
>    is DML.
>
> And the classic classification trap: **`TRUNCATE` is DDL, `DELETE` is DML.** They look
> alike (both empty a table) but `TRUNCATE` is a structural operation.

#### GATE perspective

Classification MCQ/MSQ — given five statements, which are DDL? Plus the procedural /
declarative labelling of SQL vs relational algebra vs relational calculus, which recurs
throughout the relational-model chapters.

#### Important edge cases

- `CREATE VIEW` is **DDL** — it defines a schema object — even though the view's *purpose*
  is querying.
- Constraint declarations (`PRIMARY KEY`, `CHECK`, `FOREIGN KEY`) are DDL: they are part of
  the design, which is why §4.3's integrity problem is solved at the DDL level.
- "Procedural" here is unrelated to procedural *programming*. Relational algebra is
  procedural because you specify the *sequence of operations*, not because it has loops.

#### Common trap

Mapping "language that reads data" → DDL because reading feels like "definition." Anchor on
the target instead: **schema → DDL, values → DML.** Ask "does the table's structure change?"

---

### 4.7 Database users and the DBA

#### Intuition

Users are classified by **how** they reach the database, not by how skilled they are in
general.

```text
                                                    writes?          knows DB exists?
  ┌──────────────────────┐
  │ Naive / Naïve users  │  use an application       nothing         no
  └──────────────────────┘
  ┌──────────────────────┐
  │ Application          │  write the programs       programs        yes
  │ programmers          │  naive users click        (embedded DML)
  └──────────────────────┘
  ┌──────────────────────┐
  │ Sophisticated users  │  write queries directly   queries         yes
  └──────────────────────┘
  ┌──────────────────────┐
  │ Specialized users    │  build the DBMS / exotic  the tool itself yes
  └──────────────────────┘  applications
  ┌──────────────────────┐
  │ DBA                  │  owns the whole system    everything      yes
  └──────────────────────┘
```

#### Formal definition and examples

| User class | Interacts via | Example |
| --- | --- | --- |
| **Naive users** | A ready-made application interface | Every phone user checking a balance or ordering a shirt — they use a database constantly *without knowing it exists* |
| **Application programmers** | Programs containing embedded DML | The engineer who wrote the shopping site |
| **Sophisticated users** | Queries written by hand, no application | An analyst writing SQL against production |
| **Specialized users** | They build database tools/systems themselves | The Oracle architects who built the DBMS you use |
| **Database administrator (DBA)** | Full control over schema, storage, security | The person whose job is that the database stays alive |

The lecture's observation about naive users is the memorable one: the huge majority of
database users have *no idea* they are using a database. That, it argues, is the discipline's
success — they get what they need in the form they need, and where it came from is invisible.

#### The DBA's responsibilities

```text
- schema definition and modification            (DDL)
- storage structure and access-method decisions (physical design)
- granting authorisation                        (security, DCL)
- routine maintenance: backups, cleanup, periodic jobs
- performance monitoring and tuning
```

#### GATE perspective

A straightforward "match the user type" MCQ. The only genuinely trappable pair is
**sophisticated vs specialized** — see §16.

#### Important edge cases

- A single person occupies several classes at different moments: an application programmer
  who also writes ad-hoc SQL is acting as a sophisticated user then.
- "Naive" describes *mode of access*, not intelligence. A physicist using a web form is a
  naive database user.

#### Common trap

Swapping **sophisticated** and **specialized**. Fix it with one sentence:
*sophisticated users write **queries**; specialized users write the **system**.*

> **Side note on the lecture's Oracle remark.** The lecture claims Oracle's autonomous
> database "ended the DBA's job." Treat that as commentary, not fact. Autonomous/self-tuning
> database services do automate a lot of routine DBA work (patching, backups, some tuning),
> but the DBA role — schema design, security policy, capacity and incident work — has not
> disappeared. The lecture also cites the version number loosely; Oracle's autonomous
> offering is associated with 18c and later. None of this is GATE material; it is flagged
> only so you do not repeat the claim as fact.

---

### 4.8 Inside the DBMS: query processor and storage manager

#### Intuition

Follow one command from your keyboard to the disk and back.

```text
   user / application
          │  "give me all XYZ shirts, size S, under ₹2000"
          ▼
  ┌───────────────────┐
  │  QUERY PROCESSOR  │   parses, validates, and OPTIMISES:
  │                   │   decides the cheapest way to get it
  └─────────┬─────────┘
            │  a specific, minimal request
            ▼
  ┌───────────────────┐
  │  STORAGE MANAGER  │   fetches exactly the needed blocks
  └─────────┬─────────┘
            │
            ▼
      ┌───────────┐   disk holds the database (possibly terabytes)
      │   DISK    │
      └─────┬─────┘
            │  ◀── minimise traffic on THIS arrow
            ▼
      ┌───────────┐   all processing happens here
      │    RAM    │
      └───────────┘
```

#### Formal definition

> The **query processor** interprets and optimises user requests, translating a high-level
> query into an efficient sequence of low-level operations.
>
> The **storage manager** provides the interface between the low-level data stored on disk
> and the queries/programs submitted to the system, managing what is brought into memory and
> when.

#### Why it works — the reason this split exists

A single fact drives the whole design, and it is a **COA/OS fact**, not a DBMS fact:

> **Disk access is slow — orders of magnitude slower than memory access.**

Consequences that follow in a chain:

```text
database lives on disk (too big for RAM)
        │
processing must happen in RAM
        │
so data must be transferred disk → RAM
        │
that transfer is the expensive step
        │
∴ minimise the number of transfers
        │
∴ never load the whole database, never even the whole table
        │
∴ fetch only the blocks the query truly needs
        │
∴ SOMETHING must work out what is truly needed  ← this is query optimisation
```

That last line is the justification for the query processor's existence, and it is why the
lecture insists on optimisation: a sloppy plan moves more blocks, more blocks means more disk
I/O, more I/O means higher response time — and higher response time *is* a worse product.

#### Example

`SELECT * FROM Shirt WHERE brand='XYZ' AND size='S' AND price < 2000` over a 10 GB table:

- **Without optimisation** — scan all 10 GB into memory in blocks, discard 99.99%.
- **With an index on `brand`** — the query processor chooses the index, the storage manager
  fetches a handful of blocks. Same answer; a few thousand times less I/O.

#### GATE perspective

Direct questions on this pair are mostly definitional at this stage. Its real exam value is
later: this is the mental model behind **query optimisation cost formulas** and **indexing**,
both heavily examined. Learn the chain of reasoning now and those topics stop being
arbitrary.

#### Important edge cases

- Optimisation is about *minimising disk–memory data movement*, not about minimising CPU
  work; that is why cost models count block transfers.
- The storage manager does not decide *what* to fetch semantically — it serves the request
  the query processor shaped.

#### Common trap

Believing the DBMS "loads the table into RAM and filters." It does not — not the database,
not the table. Only the required blocks move.

#### Two-tier and three-tier architecture

When the database is used over a network:

```text
TWO-TIER                                  THREE-TIER
┌──────────────┐                          ┌──────────────┐
│ client       │                          │ client       │  thin: UI only
│ + application│                          └──────┬───────┘
└──────┬───────┘                                 │ network
       │ network                          ┌──────┴───────┐
┌──────┴───────┐                          │ application  │  business logic
│  database    │                          │ server       │
│  system      │                          └──────┬───────┘
└──────────────┘                          ┌──────┴───────┐
                                          │  database    │
 application talks to the DB directly     │  system      │
                                          └──────────────┘
                                          client never touches the DB directly
```

Three-tier scales better and is more secure (the client holds no database credentials and
cannot issue arbitrary queries), which is why web applications use it. As noted in §2, the
lecture rates this as more of a semester-exam topic than a GATE one — learn it in these two
diagrams and move on.

---

### 4.9 Data models

#### Intuition

The lecture's analogy is the best one available, so use it: **a data model is to a database
what a data structure is to a program.**

In DSA, the same information can be held in an array, a linked list, a tree, or a graph —
each a different *representation* with different properties. In DBMS, the same enterprise can
be represented by an ER model, a relational model, an object-oriented model — again,
different representations.

#### Formal definition

> A **data model** is a collection of conceptual tools for describing
> **data**, **data relationships**, **data semantics** and **consistency constraints**.

Unpack the four, because the definition is often asked verbatim:

| Component | Means | Example |
| --- | --- | --- |
| Data | What items exist | A shirt has a price |
| Data relationships | How items connect | A teacher *teaches* a student |
| Data semantics | What the data *means* | `1599` means rupees, not a year |
| Consistency constraints | What values are legal | `balance ≥ 0`; phone is 10 digits |

The **semantics** point deserves emphasis, because it is the heart of the lecture's opening
argument: a bare number is useless. Ask "what is 1599?" and without context there is no
answer. Attaching meaning is not decoration — it is what makes data into information.

#### The models in your syllabus

| Model | Represents data as | Status |
| --- | --- | --- |
| **Entity-Relationship (ER) model** | Entities + relationships among them | **In syllabus** — the design language |
| **Relational model** | Tables (relations) | **In syllabus** — the implementation language |
| Object-oriented model | ER + OOP ideas (encapsulation, inheritance, abstraction) | Name only |
| Object-relational model | Relational + object features | Name only |
| Network model, Hierarchical model | Graph / tree structured records | Name only — historical |

The lecture is explicit and correct that only the first two matter for this course; for the
rest, recognise the name. Note the accurate observation that the object-oriented data model
is essentially ER *plus* the OOP concepts — inheritance in particular is already present in
the extended ER model as specialization/generalization (§4.13).

#### Why two models rather than one

This is the question that makes the whole subject coherent:

```text
ER model         →  designed for HUMANS to think in
                    "what things exist and how do they relate?"
                    drawable, discussable, close to how you describe a business

Relational model →  designed for MACHINES to store and query
                    tables, rows, columns; algebra and SQL operate on it

∴ design in ER, implement in relational, and CONVERT between them
```

That conversion step is a major GATE topic in its own right, and it is the next thing the
course does after this module.

#### GATE perspective

The four-part definition is directly quotable. Otherwise this section is scaffolding: it
tells you *why* you are about to learn ER diagrams and then immediately learn to translate
them into tables.

#### Common trap

Treating "data model" as a synonym for "schema." A **model** is the *kind* of representation
(ER, relational); a **schema** is one specific design *expressed in* a model.

---

### 4.10 The database design lifecycle

#### Intuition

You do not open a DBMS tool and start typing `CREATE TABLE`. You walk down a ladder from
*what the client wants* to *bytes on disk*, and each rung uses a different tool.

The lecture frames it as a consulting engagement — a client has a warehouse full of clothing
and wants a website — which is exactly the right framing, because step 1 is pure conversation.

#### The stages

```text
 1  REQUIREMENTS ANALYSIS
        talk to the client; what data, how much, how many entries,
        what operations, how much storage, is it even feasible?
              │
              ▼
 2  CONCEPTUAL DATABASE DESIGN                   ← ON PAPER. No tool yet.
        build the ER model / ER diagram
        entities, attributes, relationships
              │
              ▼
 3  LOGICAL DATABASE DESIGN
        convert the ER model into the RELATIONAL model
        i.e. into tables — now a DBMS tool is used
              │
              ▼
 4  SCHEMA REFINEMENT
        normalization: fine-tune the relations to remove
        insertion / deletion / updation anomalies
              │
              ▼
 5  PHYSICAL DATABASE DESIGN
        (a) storage: which data structures hold the data (e.g. B / B+ trees)
        (b) indexing: which attributes get indexed, based on how you will search
              │
              ▼
 6  SECURITY / APPLICATION DESIGN
        who may see which table, which columns, which rows;
        read vs write vs update vs delete; authentication, authorisation
```

#### Why each stage exists

- **Requirements analysis** is where feasibility is settled. The lecture's example is apt:
  the client says "store this much data," and the designer answers "then you need this much
  disk." Volume, growth and access patterns decided here constrain stages 5 and 6.
- **Conceptual design on paper** is cheap to change. Discovering a modelling mistake in a
  diagram costs minutes; discovering it after 200 tables exist costs a migration.
- **Logical design** is where the design becomes implementable, because tables are what a
  relational DBMS actually stores. Tools and standard algorithms can automate much of the
  ER→relational conversion — and you will learn to do it by hand, because that is what is
  examined.
- **Schema refinement** repairs a design that is structurally valid but behaviourally bad.
- **Physical design** is pure performance: the same tables, stored and indexed differently,
  can differ enormously in speed. Note that this stage is exactly what **physical data
  independence** (§4.5) protects you from having to revisit application code for.
- **Security design** applies §4.2's third goal, per user and per operation.

> ⚠️ **Correction / Important Clarification — the position of schema refinement**
> The lecture places schema refinement ambiguously, saying it "can be done before or after
> logical design." Fix this in your notes, because the ordering is logical, not arbitrary:
>
> **Normalization operates on relations (tables) and functional dependencies — so it comes
> AFTER the logical design that produces those relations.**
>
> You cannot apply 2NF/3NF/BCNF to an ER diagram; those normal forms are defined over a
> relation schema and a set of FDs. The standard lifecycle is therefore:
>
> ```text
> requirements → conceptual (ER) → logical (tables) → schema refinement (normalization)
>              → physical (storage + indexing) → security / application design
> ```
>
> What *is* true — and is probably what the lecture meant — is that **iteration** happens:
> discovering an anomaly during refinement can send you back to revise the conceptual design.
> Iteration between stages is normal; the *definitional* position of normalization is still
> after logical design.

#### GATE perspective

Ordering questions ("arrange the stages") and stage-identification questions ("indexing
decisions belong to which phase?" → physical). The high-value takeaway is the mapping of
*tool to stage*:

```text
ER diagram      → conceptual design
Tables          → logical design
Normal forms    → schema refinement
B+ trees, hashing, index selection → physical design
GRANT / REVOKE, views → security design
```

#### Important edge cases

- Only stages 2–5 are really in the GATE syllabus; requirements analysis is software
  engineering, and the lecture says as much.
- Stage 2 produces **no tables**. If a question mentions tables, you are at stage 3 or later.

#### Common trap

Believing the ladder is strictly one-directional. Real designs iterate — but when asked for
*the* order, give the canonical sequence above.

---

### 4.11 ER model basics — recap level

> **Scope note.** The lecture that taught this in detail is not part of this transcript;
> lecture 5 recaps it in its first two minutes and builds on it. This section therefore
> records what you must already know. If any line here is unfamiliar, that is your signal to
> study ER basics separately before §4.13.

#### The three things an ER diagram contains

```text
 ┌──────────────┐
 │  ENTITY SET  │   rectangle
 └──────────────┘

    ( attribute )   ellipse

      ◇ relationship ◇   diamond
```

> An **entity** is a real-world object, distinguishable from other objects — a particular
> teacher, a particular student, a particular car.
>
> An **entity set** is a collection of entities of the *same type* — *all* teachers.
>
> An **attribute** describes an entity set.
>
> A **relationship** is an association among entities; a **relationship set** is a set of
> relationships of the same type.

The lecture's example: every teacher on a platform is an entity; together they form the
entity set `Teacher`. Every student is an entity; together, `Student`. Between the two sets
there is a relationship — *teacher discusses with student*.

```text
 ┌──────────┐        ◇──────────◇        ┌──────────┐
 │ Teacher  │────────  discusses ────────│ Student  │
 └──────────┘        ◇──────────◇        └──────────┘
```

#### What the missing lecture covered (per lecture 5's recap)

| Concept | What it is | Careful |
| --- | --- | --- |
| **Degree** of a relationship | How many entity sets participate: **unary** (1), **binary** (2), **ternary** (3) | Degree ≠ cardinality |
| **Mapping cardinality** | 1:1, 1:N, N:1, M:N — how many entities of one set an entity of the other may relate to | The most common source of ER errors |
| **Participation** | **Total** (every entity must participate — double line) or **Partial** (may or may not — single line) | A property of *one entity set in one relationship* |
| **Weak / strong entity sets** | A **weak** entity set has no key of its own; it depends on an identifying/owner entity set | Double rectangle; identifying relationship is a double diamond |
| **Key attribute** | Uniquely identifies each entity in the entity set; the primary key is **underlined** | See §4.12 for the prime-vs-key subtlety |

> ⚠️ **Correction / Important Clarification**
> Lecture 5's recap contains two slips of vocabulary that will cost marks if you copy them:
>
> 1. It calls binary/unary/ternary "**types** of relationships." They are **degrees** of a
>    relationship. "Type" is unhelpfully vague; GATE options distinguish *degree* from
>    *cardinality*.
> 2. It says "we saw **weak and strong participation**, and total and partial participation."
>    There is no such thing as weak or strong *participation*. The correct pairing is:
>
> ```text
>    entity sets     are  WEAK or STRONG
>    participation   is   TOTAL or PARTIAL
> ```
>
> These are different ideas that happen to be *correlated*: a weak entity set always has
> **total** participation in its identifying relationship. That correlation is exactly why
> the confusion arises, and exactly what makes it trappable — see §13, Trap 5.

---

### 4.12 Types of attributes

#### Intuition

An attribute is not just a name — it has a *shape*. The shape is decided by what kind of
value it can hold, and it changes how you draw it and how it later becomes a column.

The lecture links this to **domain**: the domain is the set of permitted values for an
attribute, and classifying the attribute is how you pin the domain down precisely.

#### The four classifications

There are four independent questions to ask about any attribute:

```text
1. Can it hold MORE THAN ONE value for one entity?    → single-valued vs multi-valued
2. Can it be BROKEN INTO PARTS?                       → simple    vs composite
3. Can it be COMPUTED from other attributes?          → stored    vs derived
4. Is it PART OF A KEY?                               → prime     vs non-prime
```

They are independent — an attribute can be composite *and* multi-valued at once.

#### (a) Single-valued vs multi-valued

> **Single-valued**: only **one** value is possible for that attribute, for a given entity.
> **Multi-valued**: **more than one** value is *possible* for a given entity.

```text
Student(roll_no, name, phone_no)

roll_no  : one student → exactly one roll number   → single-valued
name     : one student → one name                  → single-valued
phone_no : one student → 2, 3, 4 numbers possible  → MULTI-VALUED
```

Notation: a multi-valued attribute is drawn as a **double ellipse**.

```text
    ( roll_no )          (( phone_no ))
   single-valued          multi-valued
```

> ⚠️ **Correction / Important Clarification**
> The lecture asks "can a student have only one name? yes — so it's single-valued," reasoning
> from the real world. Be careful: **whether an attribute is multi-valued is a decision of
> the schema designer, not a fact about reality.** A person genuinely may have several names
> (legal, maiden, alias) and a database may still declare `name` single-valued because the
> application needs only one.
>
> Get the emphasis in the definition right too: multi-valued means multiple values are
> **possible**, not that they always exist. A student with exactly one phone number does not
> make `phone_no` single-valued.

#### (b) Simple vs composite

> **Simple** (atomic): cannot be divided further; its value is complete as one unit.
> **Composite**: made up of several smaller sub-attributes, and meaningfully divisible.

```text
roll_no : 21CS043          → cannot be usefully split   → SIMPLE
address : 12 / MG Road / Pune / 411001
                           → house_no, street, city, zip → COMPOSITE
```

Notation: sub-attributes hang off the composite attribute's ellipse.

```text
                    ( address )
                   /    |    |    \
        (house_no) (street) (city) (zip_code)
```

#### (c) Stored vs derived

> **Derived**: its value can be **computed** from other attributes already present, so it
> need not be stored.

```text
date_of_birth  stored   →  age  DERIVED     ( age = today − date_of_birth )
```

Notation: a **dashed ellipse**.

```text
    ( date_of_birth )        ⌈ age ⌉      ← dashed = derived
```

The reasoning for not storing it is sound and worth stating: a stored `age` would be wrong
the day after it was written, and would need updating for every person every year. A derived
value is correct by construction.

> ⚠️ **Correction / Important Clarification**
> "Derived" means **derivable**, not "forbidden from being stored." Real systems sometimes
> *do* store a derived value deliberately — a materialised/precomputed column — trading
> storage and update cost for read speed. The defining property in ER terms is that the value
> is functionally determined by other attributes. A question saying "a derived attribute can
> never be stored" is stating a design convention as if it were a rule.

#### (d) Prime vs non-prime

> **Prime attribute**: an attribute that is **part of a key**.
> **Non-prime attribute**: an attribute that is part of no key.

Recall from §4.11: a **key** is an attribute, or set of attributes, whose value uniquely
identifies each entity in an entity set.

Notation: the primary key is **underlined**; remaining attributes are written normally.

```text
 ┌───────────────────────────────────┐
 │            Student                │
 └───────────────────────────────────┘
    ( roll_no )  ( name )  (( phone ))
       ══════
     underlined = primary key
```

> ⚠️ **Correction / Important Clarification — this one matters a lot later**
> The lecture says: *"key attribute and prime attribute are the same thing, we use the words
> interchangeably; and here key means primary key, so the underlined attribute is the prime
> attribute."*
>
> That is loose in a way that breaks normalization questions. Be precise:
>
> ```text
> prime attribute   =  an attribute belonging to SOME CANDIDATE KEY
> underlined in ER  =  the PRIMARY KEY (one chosen candidate key)
> ```
>
> A relation may have several candidate keys. Every attribute of *any* candidate key is
> prime — including attributes not in the primary key and therefore **not underlined**.
>
> **Concrete counterexample.** `R(A, B, C, D)` with candidate keys `{A}` and `{B, C}`.
> Choose `A` as primary key, so only `A` is underlined. But the prime attributes are
> `A`, `B` and `C`. `B` and `C` are prime and not underlined; `D` is the only non-prime
> attribute.
>
> This is *the* definition 2NF and 3NF are stated in terms of ("no non-prime attribute is
> partially / transitively dependent…"). Carrying the lecture's conflation into
> normalization will produce wrong answers with complete confidence. Fix it now.

#### Combining the classifications

The classifications compose, and composed attributes are exactly where questions get
interesting:

```text
Composite + multi-valued:  a customer with SEVERAL addresses, each having
                           house_no / street / city / zip
                           → double ellipse, with sub-attributes hanging off it

Composite + derived:       possible, though rare in practice
Prime + composite:         a composite primary key, e.g. (dept_code, roll_within_dept)
```

#### GATE perspective

- Classify attributes from a description — the bread-and-butter version.
- Read a diagram: identify which ellipse is dashed, which is doubled, what is underlined.
- The **prime** definition is the doorway to all of normalization.
- MSQ on "which of the following need not be stored" → derived attributes.

#### Important edge cases

- A multi-valued attribute **cannot** survive into a relational table as a single column —
  it becomes a separate table on conversion. (Forward link to ER→relational and to 1NF: a
  relation in 1NF has only atomic attribute values, so multi-valued attributes are precisely
  what 1NF forbids.)
- A composite attribute usually becomes **several columns**, one per leaf sub-attribute — the
  composite itself disappears.
- A derived attribute usually becomes **no column** at all.
- Nesting is allowed: a sub-attribute can itself be composite.

#### Common trap

Confusing **composite** with **multi-valued**. Use the counting test:

```text
"How many VALUES?"     more than one  → multi-valued
"How many PARTS in one value?"  more than one  → composite
```

`address` as one address with four parts = composite. Three phone numbers = multi-valued.
Three addresses each with four parts = both.

---

### 4.13 Specialization and generalization

#### Intuition

One entity set is too generic to hold everything you need, so you split it into more specific
ones — or you notice several sets share a common core and you factor it out. Same picture,
two directions of travel.

```text
                    ┌──────────┐
                    │  Person  │   ← higher-level (general / superclass)
                    └────┬─────┘
                         │
                      ╱─────╲      triangle = ISA
                     ╱  ISA  ╲
                    ╱─────────╲
                   │           │
            ┌──────────┐  ┌──────────┐
            │ Employee │  │ Customer │   ← lower-level (specific / subclass)
            └──────────┘  └──────────┘

   TOP → BOTTOM  =  SPECIALIZATION   (general made special)
   BOTTOM → TOP  =  GENERALIZATION   (specials made common)
```

The lecture's everyday analogy: a family has one general-purpose vehicle used for everything.
Over time more vehicles arrive, and that first one ends up used *only* for the weekly grocery
run — general became special. Run the story backwards and you have generalization.

#### Formal definition

> **Specialization** is the process of designating sub-groupings within an entity set,
> proceeding **top-down** from a general entity set to more specific ones.
>
> **Generalization** is the reverse, **bottom-up** process: several entity sets sharing
> common attributes are combined into a single higher-level entity set. It expresses a
> **containment relationship** between a higher-level entity set and one or more lower-level
> entity sets.

The link is drawn with a **triangle labelled ISA** ("is a"): *Employee* **is a** *Person*.
The `ISA` relationship is nothing other than specialization/generalization — the lecture's
reassurance here is correct: three terms, one mechanism.

#### Why it works

Two independent wins:

1. **Attribute economy.** `name`, `street`, `city` are stated once on `Person` instead of
   duplicated on both subclasses (see §4.16).
2. **Semantic precision.** A bank needs `salary` for employees and `credit_rating` for
   customers. Forcing both onto one `Person` set would leave every row with irrelevant,
   `NULL`-filled columns. Splitting lets each subclass carry only what applies to it.

#### Example

```text
Person(name, street, city)
      │
      ├── Employee : inherits name, street, city  +  salary
      └── Customer : inherits name, street, city  +  credit_rating
```

The lecture's second example: `Computer Science` specialized into `Data Science`,
`Cyber Security`, `AI` — same structure, different domain.

#### GATE perspective

Almost never asked bare. It is asked *with a constraint attached* — disjoint/overlapping
(§4.14) or total/partial (§4.15) — and later as "how many tables does this hierarchy
produce?" Learn the mechanism here so the constraints have something to attach to.

#### Important edge cases

- The **direction** is the only difference between the two words. The resulting diagram is
  identical. A question can therefore describe the same picture either way.
- A hierarchy can be **multi-level**: specialize `Employee` into `Manager` and `Clerk`.
  Attributes inherit down the whole chain.
- A lower-level entity set may participate in relationships the higher-level one does not.

#### Common trap

Answering with the wrong direction under time pressure. One-second fix:

```text
SPECIAL-ization → making things SPECIAL → going DOWN
GENERAL-ization → making things GENERAL → going UP
```

The word tells you the destination.

---

### 4.14 Disjoint vs overlapping specialization

#### Intuition

Can one entity belong to **two** subclasses at once? That single question separates the two
cases.

#### Formal definition

> A specialization is **disjoint** if an entity may belong to **at most one** lower-level
> entity set — the subclasses are mutually exclusive.
>
> A specialization is **overlapping** if an entity may belong to **more than one** lower-level
> entity set.

#### Examples — both from the lecture, and both good

**Disjoint:**

```text
                 ┌────────────┐
                 │ FourWheeler│
                 └─────┬──────┘
                    ╱ ISA ╲        disjoint
              ┌─────┴──┐ ┌─┴──────┐
              │  Car   │ │  Bus   │
              └────────┘ └────────┘

 Is a car also a bus? No. Is a bus also a car? No.
 ∴ every FourWheeler entity goes to at most ONE side.
```

**Overlapping:**

```text
                 ┌──────────┐
                 │  Person  │
                 └────┬─────┘
                   ╱ ISA ╲          overlapping
             ┌──────┴─┐ ┌─┴─────────┐
             │Employee│ │ Customer  │
             └────────┘ └───────────┘

 I work at the bank (Employee) AND I have taken a loan from it (Customer).
 ∴ ONE person entity appears in BOTH lower-level sets.
```

#### Why it works — and the counting consequence

This is where the concept becomes arithmetic, which is what makes it NAT-able. Let a
higher-level set `E` be specialized into `A₁ … Aₙ`:

```text
DISJOINT      :  Aᵢ ∩ Aⱼ = ∅  for all i ≠ j
                 ⇒  |A₁ ∪ … ∪ Aₙ|  =  |A₁| + … + |Aₙ|

OVERLAPPING   :  intersections may be non-empty
                 ⇒  |A₁ ∪ … ∪ Aₙ|  ≤  |A₁| + … + |Aₙ|
                 (strict inequality iff some entity really is in ≥ 2 sets)
```

Disjointness is precisely the condition that lets you **add** subclass sizes. Overlap forces
inclusion–exclusion. Note the cross-subject link: this is plain set theory from Discrete
Mathematics, which is exactly why GATE can make it numeric without making it long.

#### Notation

Written next to the ISA triangle — `disjoint` / `d`, or `overlapping` / `o`. Conventions vary
by textbook; a GATE question will state the constraint in words rather than rely on a symbol.

#### GATE perspective

The counting NAT: *"`|E| = 100`, specialized into A and B. If the specialization is disjoint
and total, `|A| + |B| = ?"* → exactly 100. Change one word to *overlapping* and the answer
becomes `≥ 100`. Change *total* to *partial* and it becomes `≤ 100`. §11 drills this.

#### Important edge cases

- Disjointness says **at most one**, not *exactly one*. "Exactly one" needs disjoint **and**
  total together.
- With `n ≥ 3` subclasses, "overlapping" does not mean *all* overlap — one shared entity
  anywhere is enough.
- A disjoint specialization can still be partial: a `FourWheeler` that is neither `Car` nor
  `Bus` is entirely permitted.

#### Common trap

Reading "disjoint" as "every entity is classified." It is not about *whether* an entity is
placed, only about *how many* places it may go. Coverage is the other axis — §4.15.

---

### 4.15 Total vs partial specialization / generalization

#### Intuition

The second, independent question: must **every** higher-level entity land in *some* subclass?

#### Formal definition

> **Total** specialization/generalization: **every** higher-level entity **must** belong to at
> least one lower-level entity set.
>
> **Partial** specialization/generalization: some higher-level entities **may belong to no**
> lower-level entity set.

```text
TOTAL                                PARTIAL
┌──────────┐                         ┌──────────────┐
│  Person  │ 100 entities            │ FourWheeler  │ 100 entities
└────┬─────┘                         └──────┬───────┘
   ╱ ISA ╲                                ╱ ISA ╲
 ┌───┴──┐ ┌┴─────┐                  ┌──────┴┐ ┌───┴──┐
 │ Emp  │ │ Cust │                  │  Car  │ │ Bus  │
 └──────┘ └──────┘                  └───────┘ └──────┘
 every person is an employee         some four-wheelers are neither
 or a customer (or both)             (a truck, a van) → 100 not fully covered
```

#### Why it works — the second counting rule

```text
TOTAL    :  A₁ ∪ … ∪ Aₙ  =  E      ⇒  |A₁ ∪ … ∪ Aₙ|  =  |E|
PARTIAL  :  A₁ ∪ … ∪ Aₙ  ⊆  E      ⇒  |A₁ ∪ … ∪ Aₙ|  ≤  |E|
```

Now combine with §4.14 — and this 2×2 is the single most exam-worthy table in the ER half of
this module:

| | **Disjoint** | **Overlapping** |
| --- | --- | --- |
| **Total** | `Σ\|Aᵢ\| = \|E\|` — every entity in **exactly one** subclass (a partition) | `Σ\|Aᵢ\| ≥ \|E\|` — every entity in **at least one** |
| **Partial** | `Σ\|Aᵢ\| ≤ \|E\|` — every entity in **at most one** | `Σ\|Aᵢ\|` vs `\|E\|`: **no general relation** |

The bottom-right cell is the one worth pausing on. Overlapping **partial** places no
constraint relating `Σ|Aᵢ|` and `|E|` in either direction: uncovered entities push the sum
down, multiply-classified entities push it up, and the two effects can cancel or dominate in
either direction. If a question hands you overlapping + partial and asks for a definite
numeric relation, the answer is *cannot be determined*.

Only the top-left cell is a genuine **partition** of `E` in the set-theoretic sense.

#### Notation

Total participation in the ISA relationship is shown with a **double line** from the
higher-level entity set to the ISA triangle — the same double-line convention as total
participation in an ordinary relationship.

#### GATE perspective

This is the heart of the NAT questions, and the reason the lectures' vocabulary must be
precise. Given `|E|` and a constraint pair, produce an exact value, a bound, or *undetermined*.

#### Important edge cases

- The constraints are **independent**: all four combinations are legal designs.
- `Σ|Aᵢ| = |E|` alone does **not** prove disjoint+total. Overlapping+partial can produce the
  same sum by coincidence (e.g. `|E| = 100`, one entity in both subclasses, one entity in
  neither). Equality of the sum is a *consequence*, not a *diagnosis*.
- "Total" here concerns coverage of the **higher-level** set. It says nothing about whether
  every subclass is non-empty.

#### Common trap

Confusing **total specialization** with **total participation**. They are different
statements, and §16 separates them — total specialization is about *ISA coverage of a
superclass*; total participation is about *an entity set's involvement in some relationship*.

---

### 4.16 Attribute inheritance

#### Intuition

Whatever the superclass has, the subclasses get for free. The lecture's family analogy is
charming and precise enough: a trait present in the parent shows up in the child.

#### Formal definition

> A lower-level entity set **inherits** all the attributes of the higher-level entity set to
> which it is linked, **and** the participation of the higher-level entity set in the
> relationship sets in which it participates. It may additionally have attributes (and
> relationships) of its own.

#### Example

```text
Person(name, street, city)
   │
   ├── Employee   inherits  name, street, city   +  own: salary
   └── Customer   inherits  name, street, city   +  own: credit_rating
```

Whether the person becomes an employee or a customer, the bank still needs their name and
address — so those attributes belong on `Person` and are inherited. Only what is genuinely
specific lives on the subclass.

#### Why it works

It is the same argument as any factoring of common structure: state a fact once, and there is
one place to change it and no way for copies to disagree. Note this is §4.3's redundancy
argument reappearing at the *design* level rather than the storage level.

#### GATE perspective

The MSQ, and the reason to read the formal definition carefully: **relationship participation
is inherited too, not only attributes.** Options that mention only attributes are incomplete;
options that claim inheritance runs upward are wrong.

#### Important edge cases

- Inheritance is **downward only**. `Employee` gets `Person`'s attributes; `Person` does not
  get `salary`.
- Inheritance is **transitive** through a multi-level hierarchy: specialize `Employee` into
  `Manager`, and `Manager` has `name`, `street`, `city`, `salary` plus its own.
- Inheritance is **independent of** disjoint/overlapping and total/partial. The lecture makes
  this point explicitly and it is worth keeping: those constraints govern *which entities go
  where*; inheritance governs *what attributes travel*. Changing one does not affect the other.
- The **primary key** is inherited too — which is exactly what makes the ISA hierarchy
  convertible into tables later, since the subclass tables reuse the superclass key.

#### Common trap

Thinking an overlapping specialization causes attribute duplication problems. It does not —
a person who is both employee and customer still has *one* `name` on the `Person` side; only
the subclass-specific attributes differ.

---

### 4.17 Aggregation

#### Intuition

Every relationship you have drawn so far connects **entity sets**. What if you need a
relationship whose participant is *itself a relationship*?

That is the gap aggregation fills: it lets you treat a whole relationship (together with its
participating entities) as a single higher-level abstract entity, so that a new relationship
can be attached to it.

#### The problem, concretely

The lecture builds the standard example. Start with a ternary relationship:

```text
 ┌──────────┐      ┌──────────┐      ┌──────────┐
 │ Employee │      │  Branch  │      │   Job    │
 │ id,name, │      │  name,   │      │  title,  │
 │ street,  │      │  city    │      │  level   │
 │ city     │      │          │      │          │
 └────┬─────┘      └────┬─────┘      └────┬─────┘
      │                 │                 │
      └────────────◇ works_on ◇───────────┘
                (ternary relationship)

 meaning: this EMPLOYEE works on this JOB at this BRANCH
```

Now a new requirement: **a manager manages an employee's job assignment** — not the employee
as a person, and not the job in the abstract, but *the whole works_on fact*.

The naive attempt is to add `Manager` in a ternary/quaternary relationship with the same three
entity sets:

```text
 Employee ──┐
 Branch  ───┼──◇ manages ◇── Manager        ✗ WRONG — REDUNDANT
 Job     ───┘
```

Why it is wrong, in the lecture's own words: the association among `Employee`, `Branch` and
`Job` **already exists** as `works_on`. Re-stating it inside `manages` duplicates that
information — a *redundant relationship*. The design now asserts the same triple in two
places, with no guarantee the two agree. (Note this is §4.3's redundancy-and-inconsistency
problem showing up a third time, now in ER design.)

#### The solution

Draw a box around the existing relationship and treat it as one abstract entity:

```text
    ╔══════════════════════════════════════════════╗
    ║  ┌──────────┐   ┌────────┐   ┌────────┐      ║
    ║  │ Employee │   │ Branch │   │  Job   │      ║
    ║  └────┬─────┘   └───┬────┘   └───┬────┘      ║
    ║       └─────────◇ works_on ◇─────┘           ║
    ╚═══════════════════════╤══════════════════════╝
                            │      ← the aggregate participates as a unit
                       ◇ manages ◇
                            │
                      ┌─────┴──────┐
                      │  Manager   │
                      └────────────┘
```

The dashed/solid rectangle enclosing `works_on` and its participants **is** the aggregation
notation. `manages` now has an entity set on one side and an *aggregate* on the other.

#### Formal definition

> **Aggregation** is an abstraction through which relationships are treated as higher-level
> entities, allowing a relationship set to participate in another relationship set.

#### Why it works

ER relationships are, by definition, associations *among entities* — so a relationship cannot
natively be an endpoint of another relationship. Aggregation supplies the missing type
conversion: *relationship → entity-like object*. It is a modelling device that removes
redundancy, not a new kind of data.

#### GATE perspective

- Identify when aggregation is **required**: exactly when one participant of a relationship
  is itself a relationship.
- Spot the **redundant relationship** in a diagram drawn without aggregation — this is the
  more interesting version of the question, and §9 Example 4 works it through.
- Distinguish aggregation from a plain ternary relationship: see §16.

#### Important edge cases

- Aggregation is *not* needed when the new relationship really only involves entity sets, even
  if there are three or four of them. A ternary relationship is not aggregation.
- Aggregation is not the same as a weak entity set — no identifying dependency is involved.
- "Aggregation" in ER is unrelated to SQL **aggregate functions** (`SUM`, `COUNT`). Identical
  word, unrelated meaning.

#### Common trap

Modelling the manager requirement with a higher-degree relationship because it "connects the
same things." It does connect the same things — that is precisely the redundancy. Ask: *does
my new relationship refer to a FACT that another relationship already records?* If yes,
aggregate.

---

## 5. Deep conceptual connections

### The spine of DBMS — and where this module sits on it

```text
                        DATA  →  DATABASE  →  DBMS
                                     │
                        ┌────────────┴────────────┐
                        │  why not a file system? │  ← §4.3, seven problems
                        └────────────┬────────────┘
                                     │ each problem names a later chapter
        ┌────────────────┬───────────┼────────────┬──────────────────┐
        ▼                ▼           ▼            ▼                  ▼
  redundancy &      integrity    atomicity   concurrency         security
  inconsistency     problems     problems     anomalies          problems
        │                │           │            │                  │
        ▼                ▼           └──────┬─────┘                  ▼
  NORMALIZATION     CONSTRAINTS            ▼                    AUTHORIZATION
  (FDs, 1–3NF,      (keys, FK,       TRANSACTIONS & ACID          + VIEWS
   BCNF)             CHECK)          concurrency control
        ▲                ▲
        └────────┬───────┘
                 │ both need KEYS, which need PRIME attributes
                 │
      ┌──────────┴──────────┐
      │  THIS MODULE (§4.12) │
      └─────────────────────┘
```

Read the seven file-system problems as a **table of contents for the rest of DBMS**. That is
the single most useful reframing in this module: every one of them is a chapter.

### The design pipeline and what each stage becomes

```text
  requirements
       │
       ▼
  ER MODEL  ──────────────────────────────────── §4.11–4.17 (this module)
   entity set, attribute, relationship,
   cardinality, participation, weak entity,
   specialization/generalization, aggregation
       │
       │  ER → relational conversion            ← the very next topic
       ▼
  RELATIONAL MODEL
   relation, tuple, attribute, domain, keys
       │
       ├──▶ RELATIONAL ALGEBRA (procedural)  ──┐
       │                                       ├──▶ QUERY OPTIMISATION ──┐
       ├──▶ SQL (declarative)   ───────────────┘      §4.6, §4.8         │
       │                                                                 │
       ├──▶ FUNCTIONAL DEPENDENCIES                                       │
       │         │                                                        │
       │         ├──▶ CLOSURE → CANDIDATE KEYS → PRIME ATTRIBUTES  ◀──────┤ §4.12
       │         │                                                        │
       │         └──▶ NORMALIZATION (1NF … BCNF, 4NF)                     │
       │                   ▲                                              │
       │                   └── 1NF forbids multi-valued attributes ◀──── §4.12
       │                                                                  │
       ├──▶ TRANSACTIONS: ACID, schedules, serialisability   ◀──── §4.3(5)(6)
       │                                                                  │
       └──▶ INDEXING & FILE ORGANISATION (B/B+ trees, hashing) ◀──────────┘
                   ▲                                          §4.8, §4.10(5)
                   └── physical design; protected by physical data independence §4.5
```

### Chains worth being able to recite

**Chain 1 — from an attribute to a normal form.** The chain that makes §4.12's correction
matter:

```text
attribute → key attribute → candidate key → PRIME attribute
          → definition of 2NF/3NF ("no NON-PRIME attribute may be
            partially / transitively dependent on a candidate key")
          → decomposition
```

Get "prime" wrong here and every normal-form answer downstream inherits the error.

**Chain 2 — from disk physics to query optimisation.**

```text
disk access ≫ memory access   (COA fact)
      → minimise block transfers
      → fetch only needed blocks
      → need a component to decide "needed"   → QUERY PROCESSOR
      → need indexes to make "needed" small   → INDEXING
      → index structures must be disk-friendly → B+ TREES, not BSTs
```

**Chain 3 — from abstraction to maintainability.**

```text
three levels → data independence → applications survive schema change
             → views → per-user security → authorisation
```

### Cross-subject connections

| Connection | What transfers |
| --- | --- |
| **DBMS ↔ Discrete Mathematics** | Sets, subsets, disjointness, union/intersection, cardinality → entity sets, specialization counting (§4.14–4.15). Relations as sets of tuples; functions → functional dependencies. Partial orders → schema hierarchies |
| **DBMS ↔ Operating Systems** | Mutual exclusion, race conditions, deadlock → concurrency control (§4.3(6)). File systems and buffer management → storage manager (§4.8). Atomicity/rollback ↔ journaling |
| **DBMS ↔ COA** | Memory hierarchy and disk access cost → why minimising disk–RAM transfer is *the* objective (§4.8) |
| **DBMS ↔ Data Structures** | B trees, B+ trees, hashing → indexing and physical design (§4.10(5)) |
| **DBMS ↔ Compiler Design** | Query parsing, translation and optimisation mirror front-end + optimiser phases (§4.8) |
| **DBMS ↔ Software Engineering** | Requirements analysis and the staged design lifecycle (§4.10) |
| **DBMS ↔ OOP** | Specialization/generalization **is** inheritance; the object-oriented data model is ER + OOP concepts (§4.9, §4.13, §4.16) |

### The one idea the whole module keeps repeating

```text
        SEPARATE  "WHAT"  FROM  "HOW"
```

It is the same idea, five times over:

| Instance of the idea | "What" | "How" |
| --- | --- | --- |
| Three-level abstraction (§4.5) | logical schema | physical schema |
| Declarative DML (§4.6) | the query | the access plan |
| Query processor / storage manager (§4.8) | requested rows | blocks fetched |
| ER vs relational model (§4.9) | the design | the tables |
| Data independence (§4.5) | stable interface | changeable implementation |

If you can see that all five rows are one idea, you understand this module.

---

## 6. Formulas, rules and conditions

Nothing here is arithmetic-heavy; the "formulas" are constraint rules. The **When to use**
column is the part worth memorising, because knowing a rule and knowing when it applies are
different skills.

### 6.1 Specialization / generalization counting rules

Let `E` be the higher-level entity set, specialized into lower-level sets `A₁, A₂, …, Aₙ`.

| Rule | Meaning | When to use | Common trap |
| --- | --- | --- | --- |
| `Aᵢ ∩ Aⱼ = ∅` | **Disjoint**: no entity in two subclasses | Question says disjoint / mutually exclusive / "cannot be both" | Assuming disjoint also means every entity is classified — it does not |
| `Σ\|Aᵢ\| = \|∪Aᵢ\|` | Disjointness lets you **add** subclass sizes | Any counting question stating disjoint | Adding sizes when the specialization is overlapping |
| `Σ\|Aᵢ\| ≥ \|∪Aᵢ\|` | **Overlapping**: sum over-counts shared entities | Question says overlapping / gives an entity in two subclasses | Treating `≥` as `>`; equality holds if no entity actually overlaps |
| `∪Aᵢ = E` | **Total**: every entity of `E` is in some `Aᵢ` | Question says total / "every X is either a Y or a Z" | Confusing with total *participation* (§16) |
| `∪Aᵢ ⊆ E` | **Partial**: some entities of `E` are in no `Aᵢ` | Question says partial, or gives an example belonging to neither | Assuming partial means *most* are uncovered — one suffices |
| `Σ\|Aᵢ\| = \|E\|` | **Disjoint + total** ⇒ a true partition | Both constraints stated together | Reading the equality backwards: the sum matching `\|E\|` does **not** prove disjoint+total |
| `Σ\|Aᵢ\| ≥ \|E\|` | **Overlapping + total** | Both stated | Expecting an exact value; only a bound is available |
| `Σ\|Aᵢ\| ≤ \|E\|` | **Disjoint + partial** | Both stated | Same — a bound, not a value |
| no relation | **Overlapping + partial** | Both stated | Guessing a bound; the correct answer is *cannot be determined* |

Set-theoretic summary in one line:

```text
disjoint  ⇒  you may ADD          total  ⇒  the union EQUALS E
overlapping ⇒ you must use        partial ⇒ the union is a SUBSET of E
              inclusion–exclusion
```

### 6.2 Attribute rules

| Rule | Meaning | When to use | Common trap |
| --- | --- | --- | --- |
| `A` is **prime** ⟺ `∃` candidate key `K` with `A ∈ K` | Prime is defined over **all** candidate keys | Any normalization or key question | Using the primary key only — the §4.12 correction |
| Underlined in ER = **primary key** | One chosen candidate key | Reading a diagram | Equating "underlined" with "prime" |
| Derived: `value = f(other attributes)` | Functionally determined, so need not be stored | Deciding what to store | Reading "need not" as "must not" |
| Multi-valued ⇒ not 1NF as a single column | Must become a separate relation on conversion | ER→relational; 1NF questions | Expecting one column to hold a set |
| Composite ⇒ one column per **leaf** sub-attribute | The composite itself vanishes | Counting columns after conversion | Counting the composite as its own column *as well* |
| Multi-valued **count is a possibility, not a guarantee** | "≥ 2 values *possible*" | Classifying attributes | Calling an attribute single-valued because a sample row has one value |

### 6.3 Abstraction and language rules

| Rule | Meaning | When to use | Common trap |
| --- | --- | --- | --- |
| Physical change ⇒ logical schema unchanged | **Physical data independence** — easier to achieve | "Which change needs no application change?" | Reversing the difficulty: physical is the *easy* one |
| Logical change ⇒ views *may* shield applications | **Logical data independence** — harder | Same family of questions | Claiming logical independence is fully achieved in practice |
| Views are defined over the **logical** schema | Never over the physical | View-level questions | Drawing view → physical |
| DDL ⇔ schema, DML ⇔ instance | The classification anchor | Statement-classification MCQ | `TRUNCATE` is DDL; `CREATE VIEW` is DDL |
| Declarative = *what* only; procedural = *what* + *how* | SQL declarative; relational algebra procedural | Language-classification MCQ | Assuming "procedural" refers to programming constructs |
| Counts: **1** physical schema, **1** logical schema, **many** views | Per database | Counting MCQ | Thinking there is one schema in total |

### 6.4 Design-stage mapping

| Artefact mentioned in a question | Stage it belongs to |
| --- | --- |
| Interview notes, data volume estimates | Requirements analysis |
| ER diagram, entity sets, cardinality | Conceptual design |
| Tables / relations, foreign keys | Logical design |
| 2NF, 3NF, BCNF, decomposition | Schema refinement |
| B+ tree, hashing, index selection, clustering | Physical design |
| `GRANT`, `REVOKE`, views for restriction, authentication | Security design |

---

## 7. Important cases and edge cases

Grouped by the hidden assumption each one exposes.

### Boundary and empty cases

| Case | What happens | Why it matters |
| --- | --- | --- |
| Table with **zero rows** | Valid instance; schema fully defined | "Empty database" ⇏ "no schema" |
| Entity set with **zero entities** | Legal; a subclass may be empty even under total specialization | Total constrains the *superclass*, not subclass emptiness |
| Specialization into **one** subclass | Legal; disjointness is vacuous with `n = 1` | Distractors sometimes claim ≥ 2 subclasses are required |
| **Single-entity** entity set | Legal; the key still must be declared | Uniqueness is about *possible* instances, not the current one |
| Multi-valued attribute holding **exactly one** value right now | Still multi-valued | Classification is about *possible* values |

### Equality and extremal cases

| Case | Result |
| --- | --- |
| Overlapping specialization where **no entity actually overlaps** | `Σ\|Aᵢ\| = \|∪Aᵢ\|` — equality inside a `≥` bound |
| Partial specialization where **every** entity happens to be covered | `∪Aᵢ = E` numerically, while the *constraint* stays partial |
| **Maximum** of `Σ\|Aᵢ\|`, `n = 2`, total + overlapping, `\|E\| = 100` | `200`, when every entity is in both |
| **Minimum** of `Σ\|Aᵢ\|`, `n = 2`, total + disjoint, `\|E\| = 100` | `100`, forced exactly |
| **Minimum** of `Σ\|Aᵢ\|`, partial (either kind) | `0` — no entity need be classified |

> The distinction the last three rows are teaching: a **constraint** is about what the schema
> *permits*, while a **count** is about what one instance *contains*. A partial specialization
> whose current instance happens to cover everything is still partial. GATE exploits this gap
> — see §13, Trap 3.

### Hidden assumptions in the formulas

| Assumption | If violated |
| --- | --- |
| `Σ\|Aᵢ\| = \|∪Aᵢ\|` assumes **disjoint** | Over-counts shared entities |
| `\|∪Aᵢ\| = \|E\|` assumes **total** | Over-states coverage |
| "Derived ⇒ not stored" assumes the usual convention | A materialised column is still a derived attribute |
| "Prime ⇒ underlined" assumes a single candidate key | False the moment a second candidate key exists |
| "Sum equals `\|E\|` ⇒ partition" assumes you were *told* the constraints | Overlapping+partial can coincidentally produce the same sum |

### Exception cases worth knowing

- **Redundancy in a DBMS is not zero.** Foreign keys duplicate values by design. What a DBMS
  provides is *controlled* redundancy (§4.3).
- **A weak entity set** has total participation in its identifying relationship — the one
  place where "weak" and "total" genuinely co-occur, which is why they get confused (§4.11).
- **Aggregation is not needed for ternary relationships.** Degree 3 among entity sets is
  ordinary; only a *relationship as a participant* forces aggregation (§4.17).
- **A view can span several tables.** "A part of the logical level" means derived, not a
  physical slice of one table (§4.5).
- **Attribute inheritance is unaffected** by disjoint/overlapping and total/partial. The two
  axes are orthogonal (§4.16).

---

## 8. Visual explanations

### 8.1 ER notation — the complete legend for this module

```text
 ┌──────────────┐        entity set (strong)
 │   Student    │
 └──────────────┘

 ╔══════════════╗
 ║   Loan_Pmt   ║        weak entity set (double rectangle)
 ╚══════════════╝

   ( name )              attribute — simple, single-valued, stored

   ( roll_no )           primary key — UNDERLINED
     ═══════

  (( phone ))            multi-valued attribute (double ellipse)

   ⌈ age ⌉               derived attribute (DASHED ellipse)

   ( address )           composite attribute — sub-attributes hang below
    /   |   \
 (h_no)(city)(zip)

      ◇ takes ◇          relationship set (diamond)

      ╬ takes ╬          identifying relationship (double diamond)

  A ──── ◇ r ◇ ──── B    single line  = PARTIAL participation
  A ════ ◇ r ◇ ──── B    double line  = TOTAL participation (for A)

        ╱───╲
       ╱ ISA ╲           specialization / generalization triangle
      ╱───────╲

 ╔═══════════════════╗
 ║  [E]──◇ r ◇──[F]  ║   AGGREGATION — a box enclosing a whole
 ╚═══════════════════╝   relationship, so it can participate in another
```

### 8.2 The four attribute classifications on one entity set

```text
 ┌───────────────────────────────────────────────────────────────────┐
 │                            STUDENT                                │
 └───────────────────────────────────────────────────────────────────┘
        │            │             │              │            │
    ( roll_no )  ( name )    (( phone ))    ( address )   ⌈ age ⌉
      ═══════                                /   |   \
                                        (h_no)(city)(zip)      ( dob )

   roll_no : simple, single-valued, stored, PRIME      ← underlined
   name    : simple, single-valued, stored, non-prime
   phone   : simple, MULTI-VALUED, stored, non-prime   ← double ellipse
   address : COMPOSITE, single-valued, stored          ← has sub-attributes
   age     : simple, single-valued, DERIVED            ← dashed, from dob
   dob     : simple, single-valued, stored
```

### 8.3 The specialization 2×2, drawn

```text
                        DISJOINT                     OVERLAPPING
                 (at most one subclass)         (may be in several)

          ┌──────────────────────────────┬──────────────────────────────┐
          │   E = A ⊎ B   (partition)     │   E = A ∪ B,  A∩B ≠ ∅        │
  TOTAL   │                              │                              │
 (union   │   ┌────E────┐                │   ┌────E────┐                │
  = E)    │   │AAAA BBBB│                │   │AAAXXXBBB│  X = in both   │
          │   └─────────┘                │   └─────────┘                │
          │   Σ|Aᵢ| = |E|                │   Σ|Aᵢ| ≥ |E|                │
          ├──────────────────────────────┼──────────────────────────────┤
          │   A∩B = ∅, A∪B ⊂ E            │   no constraint either way   │
 PARTIAL  │                              │                              │
 (union   │   ┌────E────┐                │   ┌────E────┐                │
  ⊆ E)    │   │AAAA BB..│  . = neither   │   │AAAXXB...│                │
          │   └─────────┘                │   └─────────┘                │
          │   Σ|Aᵢ| ≤ |E|                │   Σ|Aᵢ| ⋛ |E|                │
          └──────────────────────────────┴──────────────────────────────┘
```

### 8.4 A command's journey through the architecture

```text
  ┌─────────────┐
  │ naive user  │  clicks "white formal shirts under ₹2000"
  └──────┬──────┘
         │                                    VIEW LEVEL
  ┌──────▼──────┐                             (this user's slice only)
  │ application │  issues declarative DML
  └──────┬──────┘
         │  SELECT ... WHERE colour='white' AND price<2000
  ┌──────▼────────────┐
  │  QUERY PROCESSOR  │  parse → validate → OPTIMISE      LOGICAL LEVEL
  │                   │  chooses: use index on colour      (tables, relationships)
  └──────┬────────────┘
         │  "fetch blocks 41, 42, 77 of Shirt"
  ┌──────▼────────────┐
  │  STORAGE MANAGER  │  buffer management, file access    PHYSICAL LEVEL
  └──────┬────────────┘                                    (files, pages, B+ trees)
         │
     ┌───▼───┐  slow  ┌───────┐
     │ DISK  │ ◀────▶ │  RAM  │   ← minimise traffic on this link
     └───────┘        └───────┘
```

### 8.5 Aggregation: wrong design vs right design

```text
WRONG — redundant relationship                RIGHT — aggregation
──────────────────────────────                ────────────────────────────────

 Employee ──┐                                  ╔══════════════════════════╗
            │                                  ║ Employee ─┐              ║
 Branch  ───┼──◇ manages ◇── Manager           ║ Branch  ──┼─◇ works_on ◇ ║
            │                                  ║ Job     ──┘              ║
 Job     ───┘                                  ╚════════════╤═════════════╝
            │                                                │
 Employee ──┼──◇ works_on ◇                             ◇ manages ◇
 Branch  ───┤                                                │
 Job     ───┘                                            Manager

 The (Employee, Branch, Job) triple is         The triple is stated ONCE, in
 asserted TWICE — in works_on and again        works_on. manages attaches to
 in manages. Redundant, and the two can        that whole fact, so there is
 disagree.                                     nothing to disagree with.
```

---

## 9. Solved examples

Every example below shows **Approach → Reasoning → Result → Why**.

### Example 1 — Basic: classify every attribute

> **Original Practice Question.** An `EMPLOYEE` entity set stores: `emp_id` (unique per
> employee), `name`, `date_of_joining`, `years_of_service`, `email_ids` (an employee may
> register several), and `full_address` (house number, street, city, PIN). Classify each
> attribute and state how it is drawn.

**Approach.** Run all four classification questions (§4.12) on each attribute, in order:
multiple values? divisible? computable? part of a key?

**Reasoning.**

| Attribute | Values | Divisible | Computable | Key part | Verdict | Notation |
| --- | --- | --- | --- | --- | --- | --- |
| `emp_id` | one | no | no | **yes** | simple, single-valued, stored, **prime** | ellipse, underlined |
| `name` | one | no | no | no | simple, single-valued, stored | plain ellipse |
| `date_of_joining` | one | no | no | no | simple, single-valued, stored | plain ellipse |
| `years_of_service` | one | no | **yes** — from `date_of_joining` | no | **derived** | dashed ellipse |
| `email_ids` | **many** | no | no | no | **multi-valued** | double ellipse |
| `full_address` | one | **yes** — 4 parts | no | no | **composite** | ellipse + 4 sub-ellipses |

**Result.** One prime, one derived, one multi-valued, one composite, two plain.

**Why.** `years_of_service = today − date_of_joining`, so storing it would make it wrong
tomorrow — the defining signature of a derived attribute. `full_address` has **one** value
with **four parts** (composite); `email_ids` has **several** values each atomic
(multi-valued). Keeping that distinction is the whole point of the exercise.

---

### Example 2 — GATE level: which change breaks the applications?

> **Original Practice Question.** A university database has one logical schema, one physical
> schema, and 40 views. Which of the following changes require modification of existing
> application programs that query through views?
>
> ```text
> (i)   Replacing a heap file with a B+ tree index on Student.roll_no
> (ii)  Adding a new column scholarship to the Student table
> (iii) Dropping a column the applications actively read
> (iv)  Moving the database to a faster disk with a different block size
> ```

**Approach.** Locate each change on the three-level hierarchy (§4.5), then apply the data
independence rules (§6.3).

**Reasoning.**

```text
(i)   index change     → PHYSICAL schema
      physical data independence ⇒ logical schema untouched ⇒ views untouched
      → NO change needed                                              ✔ protected

(ii)  adding a column  → LOGICAL schema
      existing views are defined over the columns they already name;
      a NEW column is not referenced by any existing view
      → NO change needed                                              ✔ protected

(iii) dropping a column that applications READ  → LOGICAL schema
      the view depends on that column; the dependency is broken
      → CHANGE REQUIRED                                              ✗ not protected

(iv)  disk / block size → PHYSICAL schema
      → NO change needed                                              ✔ protected
```

**Result.** Only **(iii)**.

**Why.** Physical changes — (i) and (iv) — are absorbed at the logical boundary, which is
physical data independence and is the *easy* guarantee. Logical changes are only *sometimes*
absorbed, which is why logical data independence is the harder one. The discriminator inside
the logical cases is whether the change is **additive** or **subtractive**: adding a column
leaves existing view definitions valid; removing one they read does not.

**Faster route.** Sort options into physical vs logical first. Every physical option is
immediately safe, so only logical ones need thought — here that cuts four options to two,
and of those only the subtractive one breaks.

---

### Example 3 — Difficult: specialization counting under changing constraints

> **Original Practice Question.** Entity set `VEHICLE` has 500 entities and is specialized
> into `CAR`, `BUS` and `TRUCK`. Let `S = |CAR| + |BUS| + |TRUCK|`. For each case, give the
> exact value of `S`, or the tightest possible bound, or state that it cannot be determined.
>
> ```text
> (a) disjoint + total          (c) disjoint + partial
> (b) overlapping + total       (d) overlapping + partial
> (e) total, and exactly 30 vehicles are both CAR and BUS, no other overlap
> ```

**Approach.** Separate the two axes (§4.15): *disjointness* decides whether `S` equals the
union's size; *totality* decides whether the union equals 500. Then combine.

**Reasoning.**

```text
Let U = |CAR ∪ BUS ∪ TRUCK|.

disjoint     ⇒ S = U            overlapping ⇒ S ≥ U
total        ⇒ U = 500          partial     ⇒ U ≤ 500

(a) disjoint + total    : S = U and U = 500              ⇒ S = 500 exactly
(b) overlapping + total : S ≥ U, U = 500                 ⇒ S ≥ 500
                          max when all 500 are in all 3  ⇒ 500 ≤ S ≤ 1500
(c) disjoint + partial  : S = U, U ≤ 500                 ⇒ 0 ≤ S ≤ 500
(d) overlapping+partial : S ≥ U and U ≤ 500 — the two
                          inequalities point the same way
                          and do not compose into a bound
                          relating S to 500               ⇒ CANNOT BE DETERMINED
                          (S can be < 500: cover only 10 vehicles, no overlap ⇒ S = 10
                           S can be > 500: cover all 500, all in 2 sets      ⇒ S = 1000)

(e) total + exactly 30 in (CAR ∩ BUS), nothing else overlapping:
      inclusion–exclusion on a union of 500 with one pairwise overlap of 30
      S = U + (number of extra memberships)
        = 500 + 30
        = 530
```

**Result.** (a) `500` · (b) `500 ≤ S ≤ 1500` · (c) `0 ≤ S ≤ 500` · (d) cannot be determined ·
(e) `530`.

**Why.** Every part reduces to one identity:

```text
S  =  U  +  (number of "extra" memberships beyond the first for each entity)
```

Disjoint sets the extra term to 0; total fixes `U = 500`. Part (e) is the useful case because
it shows the extra term is *countable* when the question tells you the overlap — and that
double-counting adds **30**, not 60: the 30 entities are counted twice in `S` and once in `U`,
so the surplus is exactly 30.

**Trap inside this question.** Part (d) is where most marks are lost. Both constraints are
inequalities, but they push `S` in *opposite* directions relative to 500, so no bound survives.
When a question offers "cannot be determined" among the options for an overlapping+partial
setup, treat it as the likely answer.

---

### Example 4 — Top-scorer level: find the redundancy, then fix it

> **Original Practice Question.** A company database is modelled as follows.
>
> ```text
> Entity sets : EMPLOYEE(emp_id, name), PROJECT(proj_id, title),
>               SKILL(skill_code, level), AUDITOR(aud_id, name)
>
> Relationships:
>   R1 : assigned_to — ternary among EMPLOYEE, PROJECT, SKILL
>        "this employee works on this project using this skill"
>   R2 : audits — among EMPLOYEE, PROJECT, SKILL and AUDITOR
>        "this auditor audits this employee's use of this skill on this project"
> ```
>
> (i) Identify the design flaw. (ii) Give the corrected design. (iii) State the general rule
> the flaw violates. (iv) If instead `AUDITOR` audited only **projects**, would the fix still
> be needed?

**Approach.** Compare what each relationship *asserts*. Look for one association stated twice
(§4.17).

**Reasoning.**

```text
R1 asserts the triple            (EMPLOYEE, PROJECT, SKILL)
R2 asserts the same triple  PLUS (AUDITOR)

∴ the (EMPLOYEE, PROJECT, SKILL) association is recorded in TWO places.
```

Step 1 — **name the flaw.** `R2` is a *redundant relationship*: it re-states an association
already captured by `R1`. Concretely, the database can be put into a state where `R2` contains
the triple `(e₁, p₁, s₁)` while `R1` does not — asserting that an auditor audits an assignment
that does not exist. The design permits a contradiction.

Step 2 — **name what `R2` actually needs to refer to.** Not three entities; *one fact* — the
assignment. The participant on the left of `audits` is a **relationship instance**, and ER
relationships cannot take relationships as participants.

Step 3 — **apply aggregation.**

```text
 ╔════════════════════════════════════════════════╗
 ║  EMPLOYEE ──┐                                  ║
 ║  PROJECT  ──┼──◇ assigned_to ◇                 ║   ← aggregate
 ║  SKILL    ──┘                                  ║
 ╚═══════════════════════╤════════════════════════╝
                         │
                    ◇ audits ◇
                         │
                     AUDITOR
```

`audits` is now **binary**: aggregate on one side, `AUDITOR` on the other. The triple exists
once, so no contradictory state is representable.

Step 4 — **part (iv).** If `AUDITOR` audited only `PROJECT`, then `audits` would be an
ordinary binary relationship between two *entity sets*, asserting nothing that `assigned_to`
already asserts. **No aggregation needed.**

**Result.**
(i) `R2` is a redundant relationship duplicating `R1`'s association.
(ii) Aggregate `assigned_to`; make `audits` binary between the aggregate and `AUDITOR`.
(iii) *A relationship set that needs to participate in another relationship set must be
aggregated; re-listing its participant entity sets instead creates redundancy.*
(iv) No — the flaw exists only because the new relationship referred to an existing
*relationship*, not because of the number of participants.

**Why.** The hidden trap is degree. `R2` has degree 4 and *looks* like a legitimately
higher-degree relationship, and higher degree is not itself an error (part (iv) shows a
perfectly fine multi-entity design). The error is **semantic**: `R2`'s meaning presupposes
`R1`'s fact. Diagnose by asking *what does this relationship mean?* and not *how many lines
does it have?*

**Faster route.** Scan the relationship list for one whose participant set is a **superset**
of another's. `{E, P, S, A} ⊃ {E, P, S}` is the signature of a relationship-on-relationship,
and it spots the aggregation candidate in seconds.

---

## 10. GATE PYQ-style practice

> **Source discipline.** The transcript contains **no** actual GATE previous-year questions,
> so nothing below is labelled as one. Every question here is an **Original Practice
> Question** written in GATE style. Do not cite these as PYQs.

Answers follow immediately in this section (the *withheld*-answer sets are §11 and §21).

### Q1 (MCQ) — Original Practice Question

A change in the physical schema of a database requires no change in application programs.
This property is called:

```text
(A) logical data independence      (C) schema refinement
(B) physical data independence     (D) view materialisation
```

**Answer: (B).** Physical data independence insulates the logical schema — and therefore the
applications — from storage-level changes. (A) would concern changes to the *logical* schema.

### Q2 (MSQ) — Original Practice Question

Which of the following are **DDL** statements?

```text
(A) TRUNCATE TABLE Student      (C) CREATE VIEW v AS SELECT ...
(B) DELETE FROM Student         (D) ALTER TABLE Student ADD marks INT
```

**Answer: (A), (C), (D).** `TRUNCATE` is structural (DDL) even though it removes rows;
`CREATE VIEW` defines a schema object; `ALTER` changes the schema. `DELETE` operates on the
instance → DML. The `TRUNCATE`/`DELETE` pair is the classic discriminator.

### Q3 (NAT) — Original Practice Question

Entity set `E` has 250 entities and is specialized into `A` and `B`. The specialization is
**total and disjoint**. Find `|A| + |B|`.

**Answer: 250.** Total ⇒ `A ∪ B = E`; disjoint ⇒ `|A| + |B| = |A ∪ B|`. Hence exactly `|E|`.

### Q4 (MCQ) — Original Practice Question

In an ER diagram, an attribute drawn with a **dashed ellipse** and one drawn with a **double
ellipse** respectively denote:

```text
(A) multi-valued, derived        (C) composite, multi-valued
(B) derived, multi-valued        (D) derived, composite
```

**Answer: (B).** Dashed = derived; double = multi-valued. Composite attributes have no
special outline — they have sub-attributes branching from them.

### Q5 (MCQ) — Original Practice Question

Two bank clerks concurrently read a balance of ₹20,000 and each adds a ₹5,000 deposit, writing
back independently. The final stored balance is ₹25,000. This illustrates a failure of:

```text
(A) atomicity          (C) isolation (concurrent-access anomaly)
(B) integrity          (D) security
```

**Answer: (C).** Both transactions *completed*, so nothing was left half-done — this is a
lost update caused by uncontrolled interleaving. Atomicity would be the answer if one
transaction had stopped midway.

### Q6 (MSQ) — Original Practice Question

Which statements about a relational DBMS are correct?

```text
(A) A DBMS eliminates all data redundancy.
(B) A DBMS controls redundancy and can keep duplicated values consistent.
(C) SQL is a non-procedural (declarative) DML.
(D) Relational algebra is a procedural query language.
```

**Answer: (B), (C), (D).** (A) is the classic overstatement — foreign keys duplicate values
by design; the guarantee is *control*, not elimination.

### Q7 (NAT) — Original Practice Question

A database has 1 physical schema and 1 logical schema. Views are defined for 6 branch
managers, 1 regional manager and 3 auditors, each seeing a different portion. How many
**view-level schemas** does the database have?

**Answer: 10.** `6 + 1 + 3`. There are many views over one logical schema over one physical
schema — the asymmetry the question is testing.

### Q8 (MCQ) — Original Practice Question

`R(A, B, C, D)` has candidate keys `{A}` and `{B, C}`. `A` is chosen as the primary key. How
many **prime** attributes does `R` have?

```text
(A) 1        (B) 2        (C) 3        (D) 4
```

**Answer: (C) — three: `A`, `B`, `C`.** Prime means "belongs to *some* candidate key," not
"belongs to the primary key." Only `D` is non-prime. Answering (A) is the §4.12 mistake.

### Q9 (MCQ) — Original Practice Question

A manager must manage *an employee's job assignment at a branch*, where `(employee, branch,
job)` is already recorded by a ternary relationship `works_on`. The correct modelling
construct is:

```text
(A) a quaternary relationship among Employee, Branch, Job, Manager
(B) a weak entity set for Manager
(C) aggregation of works_on, with a binary relationship to Manager
(D) generalization of Employee and Manager into Person
```

**Answer: (C).** (A) re-asserts the triple that `works_on` already records — a redundant
relationship. Aggregation lets the existing *fact* participate as a unit.

### Q10 (MSQ) — Original Practice Question

A lower-level entity set in a specialization inherits, from its higher-level entity set:

```text
(A) all its attributes
(B) its participation in relationship sets
(C) its primary key
(D) any attributes defined only on sibling lower-level entity sets
```

**Answer: (A), (B), (C).** Attributes *and* relationship participation are inherited, and the
primary key comes along with the attributes (which is what makes ISA convertible into tables).
(D) is wrong — siblings do not share their own attributes.

### Q11 (MCQ) — Original Practice Question

Which sequence is the standard database design lifecycle?

```text
(A) requirements → conceptual → schema refinement → logical → physical → security
(B) requirements → conceptual → logical → schema refinement → physical → security
(C) requirements → logical → conceptual → physical → schema refinement → security
(D) conceptual → requirements → logical → physical → security → schema refinement
```

**Answer: (B).** Normalization is defined over relations and functional dependencies, so it
must follow the logical design that produces relations. (A) is the tempting wrong order — see
the §4.10 correction.

### Q12 (MSQ) — Original Practice Question

An entity set `PERSON` is specialized into `EMPLOYEE` and `CUSTOMER`, **overlapping** and
**partial**, with `|PERSON| = 100`. Which are possible values of `|EMPLOYEE| + |CUSTOMER|`?

```text
(A) 0        (B) 60        (C) 100        (D) 180
```

**Answer: all four — (A), (B), (C), (D).** Overlapping+partial imposes no relation to 100:
`0` (nobody classified), `60` (partial coverage, no overlap), `100` (coincidentally equal),
`180` (e.g. 80 in both, 20 in one). This is the "cannot be determined" cell of the 2×2 made
concrete.

---

## 11. Advanced / top-ranker practice set

**Instructions.** 14 questions. Attempt them with no notes. Solutions are in §12 — do not
read ahead. Target: 45 minutes total.

Difficulty is marked: **[H]** hard · **[VH]** very hard · **[TS]** top-scorer / trap-based.

All questions are **Original Practice Questions**.

### Q1 **[H]** (NAT)

`STAFF` has 400 entities, specialized into `TEACHING`, `ADMIN` and `SUPPORT`. The
specialization is **total**. Exactly 25 entities belong to both `TEACHING` and `ADMIN`, and
exactly 10 belong to both `ADMIN` and `SUPPORT`. No entity belongs to all three, and there is
no other overlap. Find `|TEACHING| + |ADMIN| + |SUPPORT|`.

### Q2 **[H]** (MSQ)

Which of the following, if true of a specialization of `E` into `A₁ … Aₙ`, guarantees that
`Σ|Aᵢ| = |E|`?

```text
(A) the specialization is total and disjoint
(B) Σ|Aᵢ| computed for the current instance happens to equal |E|
(C) the specialization is a partition of E
(D) the specialization is total, and no entity belongs to two lower-level sets
```

### Q3 **[VH]** (MCQ)

A database designer states: *"Every attribute that is underlined in our ER diagram is prime,
and every prime attribute in our design is underlined."* Under what condition is the **second**
half of this claim guaranteed true?

```text
(A) always — underlining and primeness are the same thing
(B) only if the entity set has exactly one candidate key
(C) only if the primary key is a single attribute
(D) only if the entity set is in BCNF
```

### Q4 **[VH]** (MSQ)

An e-commerce system exhibits the following two defects. Match each to the property violated.

```text
(i)  A shopper's payment fails on the payment page, but the item's
     availability, set to 0 when the page opened, is never restored.
(ii) Two shoppers in different cities each buy the last remaining unit,
     both payments succeed, and the warehouse finds one unit for two orders.

(A) (i) atomicity, (ii) isolation
(B) (i) isolation, (ii) atomicity
(C) (i) integrity, (ii) isolation
(D) both are consistency violations, so both are integrity failures
```

### Q5 **[VH]** (NAT)

An entity set `CUSTOMER` has a composite attribute `address` with sub-attributes
`house_no`, `street`, `city`, `pin`; a multi-valued attribute `phone`; a derived attribute
`age`; stored attributes `cust_id` (primary key), `name`, `dob`. Assuming the standard
conversion conventions (composite → one column per leaf, multi-valued → separate relation,
derived → not stored), how many **columns** does the `CUSTOMER` relation itself have?

### Q6 **[H]** (MCQ)

Which one of the following changes to a database requires the **query processor**, but not the
**storage manager**, to behave differently?

```text
(A) adding a B+ tree index on an existing column
(B) relocating the database files to a different disk
(C) rewriting a query to use a join instead of a nested subquery, same result
(D) increasing the disk block size
```

### Q7 **[VH]** (MSQ)

Which statements are true?

```text
(A) A weak entity set always has total participation in its identifying relationship.
(B) Total participation and total specialization are the same constraint.
(C) An entity set with total participation in some relationship must be a weak entity set.
(D) A weak entity set has no candidate key of its own.
```

### Q8 **[TS]** (MCQ)

`VEHICLE` is specialized into `CAR` and `BUS`. For a particular instance, `|CAR| = 70`,
`|BUS| = 50`, `|VEHICLE| = 120`. What can be concluded?

```text
(A) the specialization must be disjoint and total
(B) the specialization must be disjoint
(C) the specialization must be total
(D) nothing about the constraints can be concluded
```

### Q9 **[TS]** (MSQ)

A team stores `age` as a physical column, refreshed nightly from `date_of_birth`. Which
statements are correct?

```text
(A) age is no longer a derived attribute, because it is stored
(B) age is still a derived attribute, because its value is determined by date_of_birth
(C) storing a derived attribute can introduce an inconsistency window
(D) ER notation for age should change from dashed to solid because it is now stored
```

### Q10 **[VH]** (MCQ)

Consider a relationship `recommends` that must express: *"this mentor recommends this
student's enrolment in this course."* `enrols_in` is already a binary relationship between
`STUDENT` and `COURSE`. The minimum-redundancy model for `recommends` is:

```text
(A) a ternary relationship among MENTOR, STUDENT, COURSE
(B) a binary relationship between MENTOR and an aggregation of enrols_in
(C) a weak entity set RECOMMENDATION identified by MENTOR
(D) generalization of MENTOR and STUDENT into PERSON
```

### Q11 **[H]** (MSQ)

Which of the following are problems of a file-processing system that a DBMS specifically
addresses?

```text
(A) the same fact stored in two files, only one updated
(B) each new kind of query requiring a new application program
(C) a constraint such as "balance must not go negative" being enforceable
    only inside each application's code
(D) the impossibility of storing more than one table's worth of data
```

### Q12 **[TS]** (MCQ)

A specialization of `E` (with `|E| = n`, `n ≥ 1`) into `A` and `B` is **disjoint and partial**.
What is the maximum possible value of `|A| + |B|`, and is it attainable?

```text
(A) n, and it is attainable
(B) n − 1, because partial means at least one entity is unclassified
(C) 2n, when every entity is in both
(D) n, but it is not attainable under a partial constraint
```

### Q13 **[VH]** (MSQ)

`PERSON(name, street, city)` is specialized into `EMPLOYEE(+salary)` and
`CUSTOMER(+credit_rating)`, **overlapping** and **total**. A person `p` is both an employee and
a customer. Which statements are true of `p`?

```text
(A) p has exactly one value of name across the design
(B) p's name is inherited independently by EMPLOYEE and CUSTOMER, and the
    two copies may legitimately differ
(C) p has both salary and credit_rating
(D) EMPLOYEE inherits credit_rating because p appears in CUSTOMER as well
```

### Q14 **[TS]** (MCQ)

Which single change to a database design is **most likely** to require modifying existing
application programs, assuming views are used throughout?

```text
(A) replacing hash indexing with B+ tree indexing on the primary key
(B) splitting one table into two, preserving all columns across the pair,
    and redefining the views to reproduce the original columns
(C) removing a column that several views expose to applications
(D) adding a new table unrelated to any existing view
```

---

## 12. Advanced practice — solutions

### Q1 — **Answer: 435**

**Solution.** Use `S = U + (extra memberships)`.

```text
total ⇒ U = |TEACHING ∪ ADMIN ∪ SUPPORT| = 400

Entities counted more than once:
  25 in (TEACHING ∩ ADMIN)  → each counted twice → surplus 25
  10 in (ADMIN ∩ SUPPORT)   → each counted twice → surplus 10
  0  in all three
∴ S = 400 + 25 + 10 = 435
```

**Key insight.** An entity in exactly two subclasses contributes `2` to `Σ|Aᵢ|` but `1` to the
union — a surplus of **one per entity**, not two.

**Why tempting alternatives are wrong.** `400` ignores overlap. `470` double-counts the
surplus (`400 + 2(25) + 2(10)`). `365` subtracts instead of adds — inclusion–exclusion run in
the wrong direction, because here you are reconstructing the *sum* from the union, not the
union from the sum.

**Faster approach.** `Σ|Aᵢ| = Σ over entities of (number of subclasses it belongs to)`. With
total specialization every entity contributes ≥ 1, giving 400, and each doubly-classified
entity adds 1 more: `400 + 35`.

**Difficulty** H · **Time** ~2 min

---

### Q2 — **Answer: (A), (C), (D)**

**Solution.** `Σ|Aᵢ| = |E|` requires **both** that the sum equals the union (disjointness) and
that the union equals `E` (totality).

- **(A)** total + disjoint — exactly the two conditions. ✔
- **(C)** a *partition* of `E` means pairwise disjoint **and** covering `E` — a restatement of
  (A). ✔
- **(D)** "total, and no entity in two lower-level sets" is disjointness stated in words. ✔
- **(B)** ✘ — this is the trap. An observed numeric coincidence in one instance **guarantees**
  nothing about the schema's constraints, and does not even guarantee the equality persists
  after the next insert.

**Key insight.** Constraints are properties of the *schema*; counts are properties of an
*instance*. A count can satisfy an equation by accident.

**Counterexample for (B).** `|E| = 100`, overlapping + partial: put one entity in both
subclasses and leave one entity unclassified. Then `Σ|Aᵢ| = 100 = |E|`, yet the specialization
is neither disjoint nor total.

**Difficulty** H · **Time** ~2 min

---

### Q3 — **Answer: (B)**

**Solution.** "Every prime attribute is underlined" says *prime ⊆ primary key*. Prime is the
union of **all** candidate keys; the underline marks **one** of them. The two coincide exactly
when there is nothing else in the union — i.e. when the entity set has exactly **one**
candidate key.

**Key insight.**

```text
prime attributes = ⋃ (all candidate keys)
underlined       =    the chosen primary key
equal  ⟺  there is only one candidate key
```

**Why the others are wrong.**

- **(A)** ✘ The lecture's conflation. `R(A,B,C,D)` with keys `{A}`, `{B,C}`: `B` and `C` are
  prime and not underlined.
- **(C)** ✘ Irrelevant. A single-attribute primary key `{A}` can coexist with another candidate
  key `{B,C}`, leaving prime attributes outside the underline.
- **(D)** ✘ BCNF constrains functional dependencies, not the *number* of candidate keys. A
  BCNF relation can have several candidate keys.

**Note the asymmetry.** The *first* half of the designer's claim ("underlined ⇒ prime") is
always true, since the primary key is a candidate key. Only the converse needs the condition —
that asymmetry is what makes this a good discriminator.

**Difficulty** VH · **Time** ~2 min

---

### Q4 — **Answer: (A)**

**Solution.**

```text
(i)  ONE operation, stopped midway, permanent partial effect
     (availability decremented; payment never completed; nothing rolled back)
     → ATOMICITY

(ii) TWO operations, each individually complete, interleaved so that both
     read the same "1 available" before either wrote
     → ISOLATION (concurrent-access anomaly; a lost update)
```

**Key insight.** Count the transactions. **One** transaction leaving a partial effect is
atomicity. **Two or more** transactions interleaving into an impossible outcome is isolation.

**Why the others are wrong.**

- **(B)** ✘ Exactly reversed.
- **(C)** ✘ Integrity concerns *declared constraints* (domain, range, referential). Neither
  defect violates a stated constraint — nothing said "availability must be ≥ 1"; the failure
  is in how the operations were sequenced.
- **(D)** ✘ True but useless: both *result* in inconsistency, which is why the option is
  tempting. Inconsistency is the **symptom**; the question asks for the violated property.
  Answering at the symptom level is the trap.

**Difficulty** VH · **Time** ~2 min

---

### Q5 — **Answer: 6**

**Solution.**

```text
cust_id                       →  1 column   (primary key, stored)
name                          →  1 column
dob                           →  1 column
age      (derived)            →  0 columns  (not stored)
phone    (multi-valued)       →  0 columns  in CUSTOMER — becomes its own relation
address  (composite, 4 leaves)→  4 columns  (house_no, street, city, pin)
                                 the composite itself contributes nothing
                                 ─────────
                                 1+1+1+0+0+4 = 6
```

**Key insight.** The three non-simple attribute types behave differently on conversion:
composite **expands** to its leaves, multi-valued **leaves** the relation entirely, derived
**vanishes**.

**Why tempting alternatives are wrong.** `7` counts `address` as a column *in addition to* its
four leaves. `8` also keeps `age`. `9` keeps `phone` as a single column too — which would
violate 1NF, since a column would hold a set.

**Difficulty** VH · **Time** ~2 min

---

### Q6 — **Answer: (C)**

**Solution.** A rewritten query with the same result reaches the query processor as different
text, so parsing and plan selection differ — but if the optimiser lands on the same plan, the
blocks requested are identical, so the storage manager's work is unchanged.

**Why the others are wrong.**

- **(A)** ✘ Affects **both**: the query processor gains a new access path to consider, and the
  storage manager must maintain and traverse the index structure.
- **(B)**, **(D)** ✘ Purely physical: the storage manager is affected; the query processor's
  logic is not. These are the physical-data-independence cases.

**Key insight.** Map each change onto the pipeline of §8.4. Query rewriting sits *above* the
storage boundary; disk and index changes sit *at or below* it.

**Difficulty** H · **Time** ~1.5 min

---

### Q7 — **Answer: (A), (D)**

**Solution.**

- **(A)** ✔ A weak entity set cannot be identified without its owner, so every one of its
  entities **must** participate in the identifying relationship → total participation.
- **(D)** ✔ That is the definition: no key of its own. (It has a *discriminator* / partial key,
  which becomes a key only in combination with the owner's key.)
- **(B)** ✘ Different constraints entirely — the §4.15/§16 confusion. Total *participation* is
  about an entity set's involvement in a relationship; total *specialization* is about ISA
  coverage of a superclass.
- **(C)** ✘ The converse of (A), and false. A **strong** entity set can have total
  participation: every `EMPLOYEE` might be required to work in some `DEPARTMENT`, while
  `EMPLOYEE` still has its own key `emp_id`.

**Key insight.** (A) is true and (C) is false — total participation is **necessary** for a
weak entity set but not **sufficient**. Necessary-vs-sufficient is exactly what the option pair
is testing.

**Difficulty** VH · **Time** ~2 min

---

### Q8 — **Answer: (D)**

**Solution.** The data given are an *instance*; the options ask about *constraints*. Two
different schemas produce these same numbers:

```text
Schema 1 — disjoint + total:
   70 cars + 50 buses = 120 = |VEHICLE|, nobody overlapping, nobody uncovered  ✔ fits

Schema 2 — overlapping + partial:
   say 10 vehicles are both car and bus, and 10 vehicles are neither.
   |CAR ∪ BUS| = 70 + 50 − 10 = 110, plus 10 uncovered = 120 = |VEHICLE|       ✔ also fits
```

Both instances satisfy the given counts, so the counts cannot determine the constraints.

**Key insight.** `Σ|Aᵢ| = |E|` is a **consequence** of disjoint+total, not a **diagnosis** of
it. Implication runs one way only.

**Why (A)/(B)/(C) are wrong.** Each asserts a constraint the numbers merely *permit*.
Schema 2 above refutes all three simultaneously.

**Difficulty** TS · **Time** ~2.5 min

---

### Q9 — **Answer: (B), (C)**

**Solution.**

- **(B)** ✔ Derived means the value is **functionally determined** by other attributes. That
  property is about the *semantics*, and storage does not change it.
- **(C)** ✔ Between midnight refreshes, a stored `age` can disagree with `date_of_birth` — a
  genuine inconsistency window. This is precisely §4.3's redundancy/inconsistency problem in
  miniature, and the real reason the convention is not to store derived values.
- **(A)** ✘ Confuses the *definition* (derivable) with the *convention* (usually unstored).
- **(D)** ✘ The ER diagram records the conceptual fact that `age` is derivable; the dashed
  ellipse stays. Physical materialisation is a **physical design** decision (§4.10) and does
  not alter the conceptual model — this is data independence working in your favour.

**Key insight.** Derived is a statement about **determination**, not about **storage**.

**Difficulty** TS · **Time** ~2 min

---

### Q10 — **Answer: (B)**

**Solution.** `recommends` needs to refer to *this student's enrolment in this course* — an
`enrols_in` **relationship instance** — plus a mentor. A relationship cannot be a participant
directly, so aggregate `enrols_in` and attach a binary `recommends` between that aggregate and
`MENTOR`.

**Why the others are wrong.**

- **(A)** ✘ The tempting one. A ternary `(MENTOR, STUDENT, COURSE)` re-asserts the
  `(STUDENT, COURSE)` pair that `enrols_in` already records, so the database can hold a
  recommendation for an enrolment that does not exist. Redundant, and permits contradiction.
- **(C)** ✘ There is no identifying dependency between `MENTOR` and a recommendation; weak
  entity sets solve a different problem (lack of a key), not relationship-as-participant.
- **(D)** ✘ Generalization addresses shared attributes, not this requirement. `MENTOR` and
  `STUDENT` sharing a superclass says nothing about recommendations.

**Key insight.** The trigger for aggregation is not "more than two participants" — it is
"**one participant is itself a relationship**." Compare §9 Example 4 part (iv).

**Difficulty** VH · **Time** ~2 min

---

### Q11 — **Answer: (A), (B), (C)**

**Solution.** (A) is redundancy & inconsistency; (B) is difficulty in accessing data; (C) is
the integrity problem — all three are on the canonical list of §4.3.

**(D)** ✘ is fabricated. A file system can perfectly well store many files' worth of data.
Capacity was never the complaint — *management* was. Options that overstate the deficiency
("files cannot store X") are always suspect; the real list is about consistency, access,
integrity, atomicity, isolation and security.

**Key insight.** Every genuine item on the list is about **managing** data, never about the
**ability to hold** it.

**Difficulty** H · **Time** ~1.5 min

---

### Q12 — **Answer: (A)**

**Solution.** Disjoint gives `|A| + |B| = |A ∪ B|`; partial gives `|A ∪ B| ≤ n`. So
`|A| + |B| ≤ n`, with the maximum `n` attained when the union happens to cover all of `E`.

**Attainability is the point.** "Partial" means uncovered entities are **permitted**, not
**required**. `A ∪ B = E` is a legal instance of a partial specialization, so `n` is reached.

**Why the others are wrong.**

- **(B)** ✘ The core misreading: partial does *not* force at least one entity to be
  unclassified.
- **(C)** ✘ `2n` needs overlapping; disjointness forbids it.
- **(D)** ✘ Correct bound, wrong claim about attainability — the precise trap this question is
  built around.

**Key insight.** Constraints state what is **allowed**, not what must **occur**. Both "partial"
and "overlapping" are permissions.

**Difficulty** TS · **Time** ~2 min

---

### Q13 — **Answer: (A), (C)**

**Solution.**

- **(A)** ✔ `p` is one entity of `PERSON`, holding one `name`. Appearing in two subclasses does
  not clone the entity.
- **(C)** ✔ `p` is an employee (so has `salary`) and a customer (so has `credit_rating`). This
  is exactly what overlapping specialization is *for*.
- **(B)** ✘ Inheritance shares the superclass's attributes; it does not create independent
  copies that may diverge. Permitting divergence would reintroduce the inconsistency problem
  that factoring the attributes out was meant to remove.
- **(D)** ✘ Inheritance flows **downward from the superclass only**. Subclasses never inherit
  from siblings, regardless of overlap. `EMPLOYEE` has no `credit_rating`.

**Key insight.** Overlap is about **which sets an entity belongs to**; inheritance is about
**which attributes travel down**. The two axes are independent (§4.16), and (D) is the option
that pretends they are not.

**Difficulty** VH · **Time** ~2 min

---

### Q14 — **Answer: (C)**

**Solution.** Removing a column that views expose breaks the view definitions and therefore the
applications reading them. It is the one **subtractive logical** change in the list.

**Why the others are wrong.**

- **(A)** ✘ Purely physical → physical data independence → applications untouched.
- **(B)** ✘ The strongest distractor. Splitting a table *is* a logical change, but the question
  states the views are redefined to reproduce the original columns — which is precisely what
  logical data independence, delivered through views, is supposed to achieve. The applications
  still see what they saw.
- **(D)** ✘ Additive and unreferenced: no existing view mentions the new table.

**Key insight.** Ordered from safest to most dangerous:

```text
physical change            → safe (physical data independence)
additive logical change    → safe (nothing referenced it)
logical change absorbed
  by redefining views      → safe (this IS logical data independence)
SUBTRACTIVE logical change
  to something views expose → BREAKS applications
```

**Difficulty** TS · **Time** ~2.5 min

---

## 13. GATE traps

Each trap below is a question built directly on a misconception, several of them on the exact
places the lectures were loose.

### Trap 1 — "Prime" is not "underlined"

> `R(A, B, C, D, E)` has candidate keys `{A, B}` and `{C}`. The primary key chosen is `{C}`.
> Which attributes are non-prime?

**Correct answer:** `D` and `E`.

**Why students choose wrongly.** They answer `A`, `B`, `D`, `E` — treating everything outside
the *primary* key as non-prime. The lecture's own line ("prime attribute and key attribute are
the same thing, used interchangeably") produces exactly this error.

**Exact concept tested.** Prime = member of **some** candidate key, i.e. `⋃` of all candidate
keys = `{A, B, C}`.

**How to recognise it in the exam.** The moment a question lists **two or more candidate keys**
and then names a primary key, it is testing this. If it were not testing it, there would be no
reason to mention both.

### Trap 2 — Atomicity vs isolation

> Two users each add ₹5,000 to a ₹20,000 balance concurrently; the result is ₹25,000. Which
> ACID property is violated?

**Correct answer:** Isolation.

**Why students choose wrongly.** "Money went missing" pattern-matches to the money-transfer
example used to teach *atomicity*, so they answer atomicity.

**Exact concept tested.** Atomicity = *one* transaction must not leave partial effects.
Isolation = *concurrent* transactions must not interleave into an impossible state. Here both
transactions completed fully.

**How to recognise it.** **Count the transactions.** One → atomicity. Two or more → isolation.
Then check: did anything stop midway? If no, it cannot be atomicity.

### Trap 3 — A count is not a constraint

> `|E| = 200`, specialized into `A` and `B`, and you are told `|A| = 120`, `|B| = 80`. Is the
> specialization disjoint and total?

**Correct answer:** Cannot be concluded.

**Why students choose wrongly.** `120 + 80 = 200` looks like proof. It is a *consequence* of
disjoint+total, so the implication is run backwards.

**Exact concept tested.** Constraints describe what the schema **permits**; counts describe one
**instance**. Overlapping+partial reproduces the same numbers (20 entities in both, 20 in
neither).

**How to recognise it.** The question gives you **numbers** and asks about **constraints**.
That direction is almost always "cannot be determined."

### Trap 4 — Composite vs multi-valued

> A `CUSTOMER` may have several addresses, each with street, city and PIN. How is `address`
> classified?

**Correct answer:** Composite **and** multi-valued (double ellipse, with sub-attributes).

**Why students choose wrongly.** The classifications are treated as mutually exclusive, so one
label is chosen and the other dropped.

**Exact concept tested.** The four classifications of §4.12 are **independent axes**.

**How to recognise it.** Ask the two counting questions separately: *how many values?* and *how
many parts per value?* If both answers exceed one, both labels apply.

### Trap 5 — Weak entity set vs total participation

> "An entity set with total participation in a relationship is a weak entity set." True or
> false?

**Correct answer:** False.

**Why students choose wrongly.** The true statement is the *converse* — a weak entity set
always has total participation — and the lecture's phrase "weak and strong participation"
welds the two ideas together.

**Exact concept tested.** Necessary vs sufficient. Total participation is necessary for a weak
entity set, not sufficient. `EMPLOYEE` may be required to belong to a `DEPARTMENT` while still
having its own key.

**How to recognise it.** Any option stating one concept *implies* the other. Test it with a
strong entity set forced into total participation — the counterexample is always available.

### Trap 6 — `TRUNCATE` looks like `DELETE`

> Classify: `DELETE FROM T`, `TRUNCATE TABLE T`, `DROP TABLE T`.

**Correct answer:** DML, DDL, DDL.

**Why students choose wrongly.** `DELETE` and `TRUNCATE` both end with an empty table, so both
feel like data manipulation.

**Exact concept tested.** DDL acts on the **schema**, DML on the **instance**. `TRUNCATE` is
defined as a structural operation (it deallocates, is not row-by-row, and is generally not
rollback-able in the same way).

**How to recognise it.** Whenever `TRUNCATE` appears among options, it is there for this reason.

### Trap 7 — Which data independence is harder?

> "Logical data independence is easier to achieve than physical data independence." True or
> false?

**Correct answer:** False — it is the other way round.

**Why students choose wrongly.** "Logical" sits higher in the diagram and feels more abstract,
hence easier to insulate.

**Exact concept tested.** Applications are written **against the logical schema**, so logical
changes can reach them. Nothing is written against the physical schema, so physical changes
stop at the logical boundary.

**How to recognise it.** Any option comparing the *difficulty* of the two. Recite the reason,
not the word order.

### Trap 8 — Aggregation vs high-degree relationship

> A relationship involves four entity sets. Does it need aggregation?

**Correct answer:** Not necessarily — degree alone decides nothing.

**Why students choose wrongly.** "Aggregation" is remembered as "the thing for complicated
relationships," so a high degree triggers it.

**Exact concept tested.** Aggregation is required **iff a participant is itself a
relationship**.

**How to recognise it.** Check whether the new relationship's meaning *presupposes* a fact
another relationship already records. Structurally: is one relationship's participant list a
superset of another's?

### Trap 9 — "A DBMS removes all redundancy"

> True or false?

**Correct answer:** False — it **controls** redundancy.

**Why students choose wrongly.** The file-system section is taught as "redundancy is the
problem, DBMS is the solution," which slides into elimination.

**Exact concept tested.** Foreign keys duplicate values by design; normalization removes
*uncontrolled* redundancy. The guarantee is that the system knows about duplication and can
keep copies consistent.

**How to recognise it.** Absolute words — *all*, *eliminates*, *never*, *always* — in an option
about redundancy.

### Trap 10 — Derived means "derivable", not "never stored"

> "A derived attribute can never be stored in the database." True or false?

**Correct answer:** False.

**Why students choose wrongly.** The convention (do not store it) is memorised as the
definition.

**Exact concept tested.** Derived = functionally determined by other attributes. Materialising
it is a physical-design choice with a known cost (an inconsistency window).

**How to recognise it.** "Never"/"cannot" attached to derived attributes.

---

## 14. Top-scorer techniques

Each technique below states when to use it **and** when not to.

### T1 — Two-axis decomposition (specialization questions)

Never reason about all four combinations at once. Split:

```text
axis 1 — disjoint / overlapping  → decides:  Σ|Aᵢ|  vs  |∪Aᵢ|
axis 2 — total / partial         → decides:  |∪Aᵢ|  vs  |E|
then chain the two comparisons
```

**Use when** any specialization counting question appears. It converts a memorised 2×2 into two
one-step facts, and it handles combinations you have never seen.

**Do not use when** the question gives an explicit overlap count — then go straight to
`S = U + surplus` (T2), which is faster.

### T2 — Count memberships, not sets

```text
Σ|Aᵢ|  =  Σ over entities of (number of subclasses that entity belongs to)
```

**Use when** overlaps are quantified ("25 entities are in both"). Each entity in exactly `k`
subclasses contributes `k`, so the surplus over the union is `k − 1` per entity — which is why
§12 Q1 adds 35, not 70.

**Do not use when** you are given only set sizes and asked for the union; then use ordinary
inclusion–exclusion.

### T3 — Extreme-case testing to kill "must be" options

**Use when** an option says *must be disjoint*, *must be total*, *the maximum is unattainable*.
Construct one legal instance that violates it. One counterexample eliminates the option with
certainty — no algebra needed. This is what settles §11 Q8 and Q12.

**Do not use when** the question asks what is *possible* — there, exhibiting one instance
**proves** the option instead of killing it. Know which direction you are arguing.

### T4 — The transaction-count test

```text
one transaction, stopped midway    → ATOMICITY
two or more transactions, each complete, bad interleaving → ISOLATION
a declared rule broken             → INTEGRITY
wrong person could read/write it   → SECURITY
```

**Use when** a scenario is described in prose and you must name the violated property. Answer
in that order — count transactions *first*.

**Do not use when** the question asks for the *symptom*; every one of these produces
inconsistency, so "inconsistency" is never the discriminator.

### T5 — Additive vs subtractive change (data independence)

```text
physical change                → applications safe
logical change, ADDITIVE       → applications safe
logical change, SUBTRACTIVE on something referenced → applications break
```

**Use when** asked which change forces application modification. It resolves §9 Example 2 and
§11 Q14 in seconds.

**Do not use when** the question is about *implementation difficulty* of data independence
rather than a specific change.

### T6 — Anchor on the target, not the verb (DDL/DML)

Ask one question: **does the table's structure change?** Yes → DDL. No → DML. Ignore what the
statement *sounds* like.

**Use when** classifying SQL statements, especially with `TRUNCATE`, `CREATE VIEW`, `GRANT`,
`COMMIT` in the options.

**Do not use when** the options distinguish DCL/TCL — then classify by *purpose*: permissions →
DCL, transaction boundaries → TCL.

### T7 — Superset scan (aggregation detection)

Compare participant lists across relationships. If one is a **superset** of another and its
meaning presupposes the smaller one, aggregation is needed.

**Use when** an ER design is given as a list of relationships and you must find the flaw.

**Do not use when** the two relationships merely share entity sets without one presupposing the
other — sharing participants is normal.

### T8 — Option elimination via absolute words

Options containing *all*, *never*, *always*, *must*, *only* are wrong far more often than not
in conceptual DBMS questions, because the correct statements are hedged ("controls redundancy",
"need not be stored", "may belong to more than one").

**Use when** you are unsure and must choose. It is a **tie-breaker**, not a proof.

**Do not use when** the absolute is genuinely part of a definition — *disjoint* really does mean
*at most one*, and *total* really does mean *every*. Never let this heuristic override a
definition you know.

### T9 — Draw before you decide

For any ER question, sketch the fragment — rectangles, ellipses, the triangle, the lines. The
notation *is* the semantics: a double ellipse, a dashed outline, a double line each answer part
of the question visually.

**Use when** the question describes a design in prose.

**Do not use when** time is nearly gone and the question is single-fact definitional; drawing is
overhead there.

---

## 15. Common mistakes

| Mistake | Why it happens | Correct thinking |
| --- | --- | --- |
| Calling every non-primary-key attribute non-prime | The lecture equates prime with the underlined key | Prime = member of **any** candidate key; take the union of all candidate keys |
| Saying a DBMS eliminates all redundancy | The file-system section frames redundancy as the enemy | It **controls** redundancy; foreign keys duplicate by design |
| Labelling the "two buyers, one item" case atomicity | It resembles the money-transfer example | Two complete transactions interleaving → **isolation** |
| Labelling the "payment failed, stock stayed 0" case a concurrency bug | It happens on a busy website | One transaction, partial effect → **atomicity** |
| Concluding disjoint+total from `Σ\|Aᵢ\| = \|E\|` | The arithmetic matches | Implication runs one way; overlapping+partial can match the numbers |
| Reading *partial* as "some entity **must** be unclassified" | "Partial" sounds like incomplete coverage is mandatory | It **permits** uncovered entities; full coverage is a legal instance |
| Reading *disjoint* as "every entity is classified" | Disjoint feels like a complete split | Disjoint = **at most one** subclass; coverage is the other axis |
| Choosing one label for an attribute that has several | The four classifications look like a single menu | They are independent axes — composite **and** multi-valued is normal |
| Counting a composite attribute as its own column plus its leaves | The composite has a name, so it feels like a column | Only the **leaves** become columns; the composite disappears |
| Keeping a multi-valued attribute as one column | It is one attribute, so it looks like one column | It becomes a **separate relation** — a set in a cell violates 1NF |
| Saying a derived attribute can never be stored | Convention memorised as definition | Derived = **derivable**; materialising it is a physical-design trade-off |
| Claiming logical data independence is the easier one | "Logical" is higher up and feels more abstract | Applications are written against the logical schema, so **physical** is easier |
| Putting normalization before logical design | The lecture places it ambiguously | Normal forms are defined over **relations + FDs**, which logical design produces |
| Swapping sophisticated and specialized users | Both words mean "advanced" in ordinary English | Sophisticated write **queries**; specialized write the **system** |
| Using aggregation because a relationship has many participants | Aggregation is remembered as "for complex cases" | Use it **iff** a participant is itself a relationship |
| Assuming a subclass inherits from its siblings | Overlapping entities appear in both subclasses | Inheritance is **downward from the superclass only** |
| Treating `TRUNCATE` as DML | It empties a table like `DELETE` | Structural ⇒ **DDL** |

---

## 16. Don't confuse these

| Concept A | Concept B | The difference |
| --- | --- | --- |
| **Prime attribute** | **Primary key attribute** | Prime = in *some* candidate key; primary key = the *one* chosen key (underlined). Prime is the wider set |
| **Composite attribute** | **Multi-valued attribute** | One value with several **parts** vs several **values**. Sub-ellipses vs double ellipse |
| **Derived attribute** | **Stored attribute** | Derived is *computable from others*; whether it is physically stored is a separate decision |
| **Schema** | **Instance** | Design (rarely changes) vs current contents (changes constantly). Type vs value |
| **DDL** | **DML** | Acts on schema vs acts on instance |
| **Procedural DML** | **Declarative DML** | *What + how* (relational algebra) vs *what only* (SQL) |
| **Physical data independence** | **Logical data independence** | Insulating logical from physical (**easier**) vs insulating views/applications from logical (**harder**) |
| **Logical level** | **View level** | One complete logical schema vs many partial, user-specific windows derived from it |
| **Atomicity** | **Isolation** | One transaction must not leave partial effects vs concurrent transactions must not interleave badly |
| **Integrity problem** | **Consistency symptom** | A declared constraint being unenforceable vs the database simply holding contradictory data |
| **Specialization** | **Generalization** | Top-down (general → special) vs bottom-up (specials → general). Same diagram, opposite direction |
| **Disjoint vs overlapping** | **Total vs partial** | *How many* subclasses an entity may join vs *whether every* superclass entity must join one. Independent axes |
| **Total specialization** | **Total participation** | Every superclass entity is in some subclass (ISA coverage) vs every entity of a set takes part in a relationship |
| **Weak entity set** | **Partial participation** | No key of its own (⇒ total participation in its identifying relationship) vs an entity set that *may* skip a relationship |
| **Weak entity set** | **Entity set with total participation** | The first implies the second; the second does **not** imply the first |
| **Aggregation** | **Ternary relationship** | A relationship participating in a relationship vs three entity sets in one relationship |
| **Aggregation (ER)** | **Aggregate function (SQL)** | Modelling construct vs `SUM`/`COUNT`/`AVG`. Same word, unrelated |
| **Sophisticated user** | **Specialized user** | Writes **queries** vs builds the **DBMS/tool** |
| **Data model** | **Schema** | The *kind* of representation (ER, relational) vs one design *expressed in* it |
| **Degree of a relationship** | **Mapping cardinality** | How many entity sets participate (unary/binary/ternary) vs how many entities each may relate to (1:1, 1:N, M:N) |
| **Query processor** | **Storage manager** | Decides *what* to fetch and how to plan vs actually fetches and buffers it |
| **Two-tier** | **Three-tier** | Application talks to the DB directly vs an application server sits between client and DB |
| **Database** | **DBMS** | The stored data vs the software managing it |

---

## 17. Exam strategy

### What to identify first

Read the question and classify it within ten seconds:

```text
1. Is it DEFINITIONAL?          → answer from memory, 20–30 s, move on
2. Is it CLASSIFICATION?        → apply the anchor (schema/instance; values/parts), 30–45 s
3. Is it SPECIALIZATION COUNTING? → find the two constraint words FIRST (§14 T1)
4. Is it an ER DESIGN question?  → draw it (§14 T9)
5. Does it give NUMBERS and ask about CONSTRAINTS? → suspect "cannot be determined"
```

### What to ignore

- Narrative framing — banks, e-commerce, universities. Strip to the structure.
- The **degree** of a relationship when the question is about aggregation.
- The current **instance** when the question is about constraints (and vice versa).
- Which subclass is which. In counting questions `CAR`/`BUS` are just `A` and `B`.

### Estimating difficulty before committing

| Signal | Likely difficulty | Action |
| --- | --- | --- |
| One concept, one definition | Easy | Answer immediately |
| Two candidate keys mentioned | Medium — prime trap | Compute the union of keys |
| Both constraint axes stated | Medium | Chain the two comparisons |
| Numbers given, constraints asked | Hard | Try to build two schemas fitting the numbers |
| A relationship list where one participant set contains another | Hard | Aggregation; find the redundancy |
| "Which **must** be true" | Hard | Hunt a counterexample |

### When to skip

Skip and return if, after ~45 seconds, you cannot name **which concept** is being tested. In
this module that is unusual — the topic list is small — so failure to identify the concept
usually means the question hinges on a definition you have not nailed, and extra time will not
manufacture it.

Do **not** skip counting questions. They are mechanical once the two constraint words are
located, and they are the cheapest marks in the ER half.

### How much time to spend

```text
definitional MCQ           20–30 s
classification MCQ/MSQ     30–60 s
specialization NAT         60–90 s
ER design / aggregation    90–150 s
"cannot be determined"     up to 150 s — you must try to build two instances
```

### How to verify your answer

- **Counting questions** — sanity-check the bound. `Σ|Aᵢ|` can never exceed `n·|E|` for `n`
  subclasses, nor be negative. If total specialization holds, it can never be below `|E|`.
- **Constraint questions** — try to construct a counterexample to your own answer. If you
  succeed, the answer is wrong.
- **Classification questions** — re-read the anchor question, not the option. "Does the
  structure change?" for DDL/DML; "how many values vs how many parts?" for attributes.
- **MSQ** — evaluate every option independently. In this module the correct MSQ answer is very
  often two or three options, and "exactly one" is rarely right.
- **Prime-attribute questions** — write out the union of all candidate keys explicitly. Never
  do it in your head.

---

## 18. 5-minute revision

**Definitions**

```text
data        raw facts
database    organised collection of INTERRELATED data
DBMS        database + programs to access it
goals       convenient + efficient access, with security
schema      the design   (rare changes)   ← DDL acts here
instance    the contents (constant change) ← DML acts here
data model  tools to describe data, relationships, semantics, constraints
```

**Seven file-system problems** (each = a later DBMS chapter)

```text
1 redundancy & inconsistency     → normalization
2 difficulty accessing data      → query languages
3 data isolation                 → unified store
4 integrity problems             → constraints
5 atomicity problems             → transactions
6 concurrent-access anomalies    → concurrency control
7 security problems              → authorisation
```

**Three levels + data independence**

```text
view (many) ─ logical (one) ─ physical (one)
physical data independence : change physical, logical unaffected    EASIER
logical data independence  : change logical, views/apps unaffected  HARDER
   reason: applications are written against the LOGICAL schema
```

**Languages**

```text
DDL : CREATE ALTER DROP TRUNCATE   (schema)   ← TRUNCATE is DDL!
DML : SELECT INSERT UPDATE DELETE  (instance)
DCL : GRANT REVOKE      TCL : COMMIT ROLLBACK SAVEPOINT
SQL = declarative (what)      relational algebra = procedural (what + how)
```

**Users**

```text
naive (use an app, unaware) → application programmers (write apps)
→ sophisticated (write QUERIES) → specialized (build the SYSTEM) → DBA
```

**Design lifecycle**

```text
requirements → conceptual (ER) → logical (tables)
→ schema refinement (normalization) → physical (storage + indexing) → security
                     ↑ AFTER logical design, because normal forms need relations
```

**Attribute types**

```text
single-valued vs MULTI-VALUED   double ellipse   (multiple values POSSIBLE)
simple        vs COMPOSITE      sub-ellipses     (one value, many parts)
stored        vs DERIVED        dashed ellipse   (derivable ≠ never stored)
prime         vs non-prime      underline = PRIMARY KEY only
   PRIME = member of ANY candidate key = ⋃ (all candidate keys)
```

**Conversion effects**

```text
composite     → one column per LEAF (composite itself vanishes)
multi-valued  → a SEPARATE relation (never one column — 1NF)
derived       → NO column
```

**Extended ER**

```text
specialization  top-down (general → special)      ISA triangle
generalization  bottom-up (special → general)     same picture, other direction
attribute inheritance : attributes AND relationship participation, DOWNWARD only
aggregation     : relationship participating in a relationship
                  (needed iff a participant IS a relationship — not because of degree)
```

**The 2×2 — highest-value table in the module**

```text
               DISJOINT                OVERLAPPING
TOTAL      Σ|Aᵢ| = |E|   (partition)   Σ|Aᵢ| ≥ |E|
PARTIAL    Σ|Aᵢ| ≤ |E|                 NO RELATION — cannot be determined

disjoint    ⇒ you may ADD           total   ⇒ union = E
overlapping ⇒ inclusion–exclusion   partial ⇒ union ⊆ E
Σ|Aᵢ| = U + (extra memberships): entity in k subclasses adds k − 1
```

**Six things GATE traps most**

```text
1 prime ≠ underlined                    4 partial/overlapping are PERMISSIONS, not requirements
2 atomicity (1 txn) ≠ isolation (2 txns) 5 physical data independence is the EASY one
3 counts do NOT prove constraints        6 TRUNCATE is DDL
```

---

## 19. Active recall questions

Answer aloud or on paper **without looking above**. Answers are in §19-A — resist scrolling
until you have attempted all 22.

```text
 1. Give the one-line formula relating a DBMS to a database.
 2. Name all seven disadvantages of a file-processing system.
 3. What is the root cause of inconsistency in a file system, in one sentence?
 4. Does a DBMS eliminate redundancy? State the precise claim.
 5. Distinguish "difficulty in accessing data" from "data isolation".
 6. Schema or instance: which changes when someone buys a shirt?
 7. How many physical, logical and view schemas does a database have?
 8. Define both kinds of data independence. Which is harder, and WHY?
 9. Which statements are DDL: DELETE, TRUNCATE, CREATE VIEW, UPDATE?
10. What exactly distinguishes a procedural from a non-procedural DML? Classify SQL
    and relational algebra.
11. Difference between a sophisticated user and a specialized user?
12. Why must a DBMS minimise disk-to-RAM transfers, and which component decides what
    to transfer?
13. List the four components of the definition of a data model.
14. Give the database design lifecycle in order. Where does normalization sit, and why
    can it not come earlier?
15. What are the four independent classification axes for an attribute?
16. Define "prime attribute" precisely. Construct a relation where a prime attribute is
    NOT underlined.
17. Composite vs multi-valued: give the two counting questions that separate them.
18. Is a derived attribute forbidden from being stored? What is the cost if you store it?
19. Specialization vs generalization: what is the only difference?
20. Fill in the 2×2 of disjoint/overlapping × total/partial. Which cell yields no
    relation at all, and why?
21. What exactly does a lower-level entity set inherit? Name TWO things.
22. When is aggregation necessary? Give a case with four entity sets where it is NOT.
```

### §19-A — Answers

```text
 1. DBMS = database + set of programs to access it.

 2. Redundancy & inconsistency · difficulty accessing data · data isolation ·
    integrity problems · atomicity problems · concurrent-access anomalies ·
    security problems.

 3. No single component knows all the places a fact is stored, so an update can
    reach one copy and miss another.

 4. No. It CONTROLS redundancy — duplication is permitted and tracked, so copies can
    be kept consistent. Foreign keys duplicate values by design.

 5. Accessing data = every new query needs a new program (interface problem).
    Isolation = data scattered across files of incompatible formats (layout problem).

 6. The instance. The schema is unchanged.

 7. One physical, one logical, many views.

 8. Physical DI: change the physical schema without changing the logical schema.
    Logical DI: change the logical schema without changing views/applications.
    PHYSICAL is easier, because applications are written against the logical schema
    and never against the physical one.

 9. TRUNCATE and CREATE VIEW. (DELETE and UPDATE are DML.)

10. Procedural: specify WHAT data and HOW to get it. Non-procedural/declarative:
    WHAT only. SQL = declarative. Relational algebra = procedural.

11. Sophisticated users write QUERIES against the database.
    Specialized users build the database system/tool itself.

12. Disk access is orders of magnitude slower than memory, so block transfers dominate
    response time. The QUERY PROCESSOR decides what is needed (optimisation); the
    STORAGE MANAGER performs the fetch.

13. Data · data relationships · data semantics · consistency constraints.

14. Requirements → conceptual (ER) → logical (tables) → schema refinement
    (normalization) → physical (storage + indexing) → security/application design.
    Normalization cannot come earlier because normal forms are defined over RELATIONS
    and FUNCTIONAL DEPENDENCIES, which only logical design produces — you cannot apply
    2NF/3NF/BCNF to an ER diagram.

15. Single- vs multi-valued · simple vs composite · stored vs derived · prime vs
    non-prime. They are INDEPENDENT — an attribute can be several at once.

16. Prime = an attribute belonging to SOME candidate key (= union of all candidate keys).
    Example: R(A,B,C,D), candidate keys {A} and {B,C}, primary key A. Then B and C are
    prime but not underlined; only D is non-prime.

17. "How many VALUES for one entity?" >1 → multi-valued.
    "How many PARTS in one value?"  >1 → composite.

18. Not forbidden. Derived means DERIVABLE. Storing it (materialising) buys read speed
    and costs an inconsistency window between refreshes, plus update work.

19. Only the DIRECTION. Specialization is top-down (general → special); generalization
    is bottom-up (special → general). The resulting diagram is identical.

20.            DISJOINT            OVERLAPPING
    TOTAL      Σ|Aᵢ| = |E|         Σ|Aᵢ| ≥ |E|
    PARTIAL    Σ|Aᵢ| ≤ |E|         no relation
    The overlapping+partial cell yields nothing because uncovered entities push the sum
    BELOW |E| while multiply-classified entities push it ABOVE; the two effects can
    cancel or either can dominate, so no inequality survives in either direction.

21. (i) all attributes of the higher-level entity set — including its primary key; and
    (ii) its PARTICIPATION in relationship sets. Inheritance is downward only, and is
    unaffected by disjoint/overlapping and total/partial.

22. Necessary exactly when a PARTICIPANT of the new relationship is itself a
    RELATIONSHIP. Not needed when the participants are all entity sets, however many:
    e.g. a relationship among DOCTOR, PATIENT, HOSPITAL, INSURER is an ordinary
    degree-4 relationship — no aggregation.
```

---

## 20. Mastery checklist

- [ ] I understand the intuition — data vs database vs DBMS, and why files fail
- [ ] I know the formal definitions (database, DBMS, data model, schema, instance,
      specialization, generalization, aggregation, prime attribute)
- [ ] I can name all 7 file-system problems and map each to the DBMS chapter that solves it
- [ ] I can state both kinds of data independence and explain WHY physical is easier
- [ ] I can classify any SQL statement as DDL / DML / DCL / TCL, TRUNCATE included
- [ ] I can classify any attribute on all four axes, and draw it correctly
- [ ] I can define "prime attribute" and produce a relation where a prime attribute
      is not underlined
- [ ] I can reproduce the disjoint/overlapping × total/partial 2×2 from memory
- [ ] I can solve specialization counting questions, including "cannot be determined"
- [ ] I can state exactly what attribute inheritance transfers (two things)
- [ ] I can recognise when aggregation is required, and spot a redundant relationship
- [ ] I can give the design lifecycle in order and justify normalization's position
- [ ] I know the common traps (prime vs key, atomicity vs isolation, counts vs constraints)
- [ ] I solved the §11 advanced practice set without notes
- [ ] I reviewed my mistakes against §15
- [ ] I took the §21 final test under time pressure
- [ ] I can explain this entire module to someone else without notes

---

## 21. Top-scorer final test

**15 questions · 30 minutes · no notes.** All are **Original Practice Questions**.
Answer key, solutions and per-question analysis are in §21-A — do not look until you are done.

### Section A — GATE level (Q1–Q5)

**Q1 (MCQ)** The overall design of a database is called its:
```text
(A) instance   (B) schema   (C) data model   (D) view
```

**Q2 (MSQ)** Which are true of the three-level architecture?
```text
(A) There is exactly one logical schema.
(B) Views are defined over the physical schema.
(C) There may be many view-level schemas.
(D) The logical level is unaware of how data is physically stored.
```

**Q3 (NAT)** `E` has 300 entities, specialized into `A`, `B`, `C`, disjoint and total.
Find `|A| + |B| + |C|`.

**Q4 (MCQ)** An attribute drawn as a double ellipse in an ER diagram is:
```text
(A) composite   (B) derived   (C) multi-valued   (D) a primary key
```

**Q5 (MCQ)** Which pair correctly matches user type to mode of access?
```text
(A) sophisticated → builds the DBMS;  specialized → writes queries
(B) sophisticated → writes queries;   specialized → builds the DBMS
(C) naive → writes queries;           DBA → uses applications only
(D) application programmer → writes queries only, never programs
```

### Section B — Difficult (Q6–Q10)

**Q6 (MSQ)** `R(P, Q, R, S, T)` has candidate keys `{P}`, `{Q, R}` and `{S}`. Primary key `{P}`.
Which are **non-prime**?
```text
(A) Q   (B) R   (C) S   (D) T
```

**Q7 (NAT)** `E` has 180 entities, specialized into `X` and `Y`, **total**. Exactly 24 entities
belong to both. Find `|X| + |Y|`.

**Q8 (MCQ)** Adding a new column to a table, where existing views do not reference it, requires:
```text
(A) modifying all application programs
(B) modifying only the views that expose the table
(C) no change to existing views or applications
(D) redefining the physical schema
```

**Q9 (MSQ)** Which scenarios illustrate an **atomicity** failure?
```text
(A) Money is debited from A but never credited to B after a crash.
(B) Two clerks concurrently deposit into one account and one deposit is lost.
(C) An item's stock is decremented when the payment page opens and is never
    restored after the payment fails.
(D) A student can read but not modify their marks.
```

**Q10 (MCQ)** In the design lifecycle, deciding that `Student.roll_no` gets a B+ tree index
belongs to:
```text
(A) conceptual design   (B) logical design
(C) schema refinement   (D) physical design
```

### Section C — Top-scorer (Q11–Q15)

**Q11 (MCQ)** `E` is specialized into `A` and `B`, **overlapping and partial**, `|E| = 90`.
Which statement about `|A| + |B|` is correct?
```text
(A) it must be ≥ 90         (C) it must be ≤ 90
(B) it must equal 90        (D) no relation with 90 can be established
```

**Q12 (MSQ)** An `ORDER` entity set has: `order_id` (primary key), `order_date`,
`item_codes` (an order may contain many), `ship_address` (house_no, street, city, pin), and
`days_since_order` (computed from `order_date`). Under standard conversion conventions, which
are true of the resulting `ORDER` relation?
```text
(A) It has 6 columns.
(B) days_since_order contributes no column.
(C) item_codes becomes a separate relation.
(D) ship_address contributes 5 columns.
```

**Q13 (MCQ)** Relationships `teaches(FACULTY, COURSE)` and
`approves(HOD, FACULTY, COURSE)` are defined, where `approves` means *"this HOD approves this
faculty's teaching of this course."* The design:
```text
(A) is correct as written
(B) contains a redundant relationship and should use aggregation
(C) requires FACULTY to become a weak entity set
(D) requires generalization of HOD and FACULTY
```

**Q14 (MSQ)** Which statements are correct?
```text
(A) A weak entity set has total participation in its identifying relationship.
(B) Every entity set with total participation in some relationship is weak.
(C) Total specialization and total participation are the same constraint.
(D) A weak entity set has no candidate key of its own.
```

**Q15 (MCQ)** For a specialization of `E` into `A` and `B` with `|E| = n`, you observe
`|A| + |B| = n`. What is the strongest valid conclusion?
```text
(A) the specialization is disjoint and total
(B) the specialization is disjoint
(C) the specialization is total
(D) no conclusion about the constraints is valid
```

---

### §21-A — Answer key and solutions

```text
 1. B      2. A,C,D    3. 300     4. C      5. B
 6. D      7. 204      8. C       9. A,C   10. D
11. D     12. A,B,C   13. B      14. A,D  15. D
```

| Q | Answer | Concept tested | Difficulty | Time |
| --- | --- | --- | --- | --- |
| 1 | B | Schema vs instance | Easy | 20 s |
| 2 | A, C, D | Three-level architecture | Easy–Med | 45 s |
| 3 | 300 | Disjoint + total | Easy | 30 s |
| 4 | C | ER notation | Easy | 15 s |
| 5 | B | User classification | Easy | 30 s |
| 6 | D | **Prime attribute** | Med–Hard | 60 s |
| 7 | 204 | Overlap surplus counting | Hard | 75 s |
| 8 | C | Logical DI, additive change | Med | 45 s |
| 9 | A, C | Atomicity vs isolation | Hard | 75 s |
| 10 | D | Design-stage mapping | Med | 30 s |
| 11 | D | Overlapping + partial | Hard | 90 s |
| 12 | A, B, C | Attribute conversion counting | Hard | 120 s |
| 13 | B | Aggregation / redundancy | Hard | 100 s |
| 14 | A, D | Weak entity vs total participation | Hard | 90 s |
| 15 | D | Counts ⇏ constraints | Top-scorer | 90 s |

**Q2.** (B) is false — views are always defined over the **logical** schema, never the physical.
(D) restates physical data independence from the logical side.

**Q3.** Total ⇒ union `= 300`; disjoint ⇒ sum `=` union. Exactly `300`.

**Q6.** Prime attributes `= {P} ∪ {Q,R} ∪ {S} = {P,Q,R,S}`. Only **`T`** is non-prime.
Answering (A),(B),(C) — everything outside the primary key — is the §13 Trap 1 error, and the
question mentions three candidate keys precisely to punish it.

**Q7.** `Σ = U + surplus`. Total ⇒ `U = 180`. The 24 shared entities are each counted twice in
the sum and once in the union ⇒ surplus `= 24`. So `180 + 24 = 204`.
Common wrong answers: `180` (ignores overlap), `228` (`180 + 2×24`, double-counts the surplus),
`156` (subtracts).

**Q8.** Additive logical change that nothing references ⇒ existing views remain valid and
applications are untouched. The discriminator inside logical changes is
**additive vs subtractive** (§14 T5).

**Q9.** (A) and (C) are one transaction each, stopped midway, leaving a permanent partial
effect. (B) is **isolation** — two complete transactions, lost update. (D) is **security**
working correctly, not a failure at all. The transaction-count test (§14 T4) separates them.

**Q11.** Overlapping+partial is the "no relation" cell. Uncovered entities push the sum below
90; multiply-classified entities push it above. Concretely: `|A|+|B| = 0` (nobody classified),
`= 90` (coincidence), `= 180` (all 90 in both) are all legal. Hence **(D)**.

**Q12.** Count the columns of the `ORDER` relation itself:

```text
order_id                               →  1   (primary key, stored)
order_date                             →  1
ship_address  (composite, 4 leaves)    →  4   house_no, street, city, pin
                                             the composite itself contributes nothing
item_codes    (multi-valued)           →  0   becomes a SEPARATE relation
days_since_order (derived)             →  0   not stored
                                          ───
                                           6
```

So **(A)** is true (6 columns), **(B)** is true (derived ⇒ no column) and **(C)** is true
(multi-valued ⇒ its own relation). **(D)** is the false option: a composite attribute with four
leaves contributes **4** columns, not 5 — counting the composite *itself* as a column in
addition to its leaves is the §15 mistake row on composite attributes. Answer: **A, B, C**.

**Q13.** `approves` involves `{HOD, FACULTY, COURSE}`, whose participant set is a superset of
`teaches`'s `{FACULTY, COURSE}`, and its meaning presupposes the `teaches` fact. So `approves`
re-asserts an association already recorded — a redundant relationship. Aggregate `teaches`, then
make `approves` binary between that aggregate and `HOD`. The superset scan (§14 T7) finds this
in seconds.

**Q14.** (A) true — a weak entity set cannot be identified without its owner. (D) true — that is
its definition (it has a discriminator, not a key). (B) false — the converse; a strong entity
set such as `EMPLOYEE` may be required to participate totally in `works_in` while keeping its own
key. (C) false — ISA coverage vs relationship involvement.

**Q15.** `Σ|Aᵢ| = |E|` is a **consequence** of disjoint+total, not a diagnosis. An
overlapping+partial schema reproduces it: with `n = 100`, put 20 entities in both subclasses and
leave 20 in neither. So no constraint can be concluded ⇒ **(D)**. Compare §11 Q8 — same trap,
different surface.

---

### Scoring guide

```text
13–15  →  This module is done. Move on to ER → relational conversion.
10–12  →  Solid. Re-read §13 (traps) and redo every question you missed.
 7–9   →  Definitions are not yet precise. Re-read §4.12, §4.14–4.17, then retake.
 < 7   →  Work through §4 in full before attempting questions again.
```

**Where marks are most commonly lost on this test:** Q6 (prime attributes), Q7 (overlap
surplus), Q11 and Q15 (counts vs constraints), Q12 (composite column counting). All five are
precision failures, not knowledge gaps — which is exactly the profile this module is built to fix.

---

## Where to go next

```text
THIS MODULE ends with a complete ER model in hand.

NEXT:  ER → Relational conversion
       - entity set → table; attributes → columns
       - multi-valued attribute → its own table
       - relationship sets → tables or foreign keys, driven by cardinality
                             and participation
       - specialization hierarchies → the table-count rules, driven by
                             disjoint/overlapping and total/partial
       (this is where §4.14–4.15's 2×2 becomes a counting tool)

THEN:  Relational model → keys → functional dependencies → closure
       → candidate keys → PRIME attributes (§4.12) → normalization
```
