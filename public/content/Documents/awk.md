# AWK Programming — Complete Notes

### From Basics to Advanced | Theory + Syntax + Examples + Questions + Solutions

> `awk` is one of the most powerful text-processing tools available in Linux/Unix.
> It is especially useful for **column-based data processing, filtering, searching, calculations, reporting, log analysis, and automation**.

---

# Table of Contents

1. [What is AWK?](#1-what-is-awk)
2. [Why Learn AWK?](#2-why-learn-awk)
3. [AWK Basic Syntax](#3-awk-basic-syntax)
4. [How AWK Works](#4-how-awk-works)
5. [Records and Fields](#5-records-and-fields)
6. [Important AWK Built-in Variables](#6-important-awk-built-in-variables)
7. [Printing Data](#7-printing-data)
8. [Fields `$1`, `$2`, `$NF`, etc.](#8-fields)
9. [Field Separator `FS`](#9-field-separator-fs)
10. [Output Field Separator `OFS`](#10-output-field-separator-ofs)
11. [Record Separator `RS`](#11-record-separator-rs)
12. [Output Record Separator `ORS`](#12-output-record-separator-ors)
13. [Patterns](#13-patterns)
14. [Comparison Operators](#14-comparison-operators)
15. [Logical Operators](#15-logical-operators)
16. [Regular Expressions](#16-regular-expressions)
17. [BEGIN and END](#17-begin-and-end)
18. [Variables](#18-variables)
19. [Arithmetic Operations](#19-arithmetic-operations)
20. [Conditional Statements](#20-conditional-statements)
21. [Loops](#21-loops)
22. [Arrays](#22-arrays)
23. [Associative Arrays](#23-associative-arrays)
24. [String Functions](#24-string-functions)
25. [Numeric Functions](#25-numeric-functions)
26. [User-Defined Functions](#26-user-defined-functions)
27. [getline](#27-getline)
28. [Multiple Input Files](#28-multiple-input-files)
29. [NR vs FNR](#29-nr-vs-fnr)
30. [ARGC and ARGV](#30-argc-and-argv)
31. [Command-Line Variables](#31-command-line-variables)
32. [AWK Scripts](#32-awk-scripts)
33. [AWK with Pipes](#33-awk-with-pipes)
34. [Advanced AWK Concepts](#34-advanced-awk-concepts)
35. [Practical Log Analysis](#35-practical-log-analysis)
36. [AWK Interview Questions](#36-awk-interview-questions)
37. [Practice Questions](#37-practice-questions)
38. [Advanced Practice Problems](#38-advanced-practice-problems)
39. [AWK Cheat Sheet](#39-awk-cheat-sheet)
40. [Common Mistakes](#40-common-mistakes)
41. [Learning Path](#41-learning-path)

---

# 1. What is AWK?

`awk` is a **pattern scanning and processing language** commonly available on Unix/Linux systems.

It is designed primarily for processing structured text such as:

```text
Name Age Salary
Adarsh 24 90000
Rahul 25 75000
Aman 23 65000
```

Suppose we want to print only employees whose salary is greater than `70000`.

Using `awk`:

```bash
awk '$3 > 70000 {print $1, $3}' employees.txt
```

Output:

```text
Adarsh 90000
Rahul 75000
```

AWK is particularly good when data is arranged into:

* rows
* columns
* records
* fields

---

# 2. Why Learn AWK?

AWK is extremely useful for:

* Linux administration
* DevOps
* log analysis
* system administration
* data processing
* shell scripting
* CSV/text processing
* server monitoring
* extracting information
* calculating statistics
* generating reports

For example:

```bash
df -h | awk '$5+0 > 80 {print $0}'
```

This can identify filesystems whose disk usage is above 80%.

---

# 3. AWK Basic Syntax

The basic syntax is:

```bash
awk 'pattern { action }' file
```

Example:

```bash
awk '{print $1}' employees.txt
```

Here:

```text
awk       → command
{print $1} → action
employees.txt → input file
```

Another example:

```bash
awk '$3 > 50000 {print $1}' employees.txt
```

Here:

```text
$3 > 50000 → pattern
print $1   → action
```

General structure:

```text
awk 'pattern { action }' file
```

---

# 4. How AWK Works

AWK processes the input **one record at a time**.

Consider:

```text
Adarsh 24 90000
Rahul 25 75000
Aman 23 65000
```

AWK reads:

```text
Record 1 → Adarsh 24 90000
Record 2 → Rahul 25 75000
Record 3 → Aman 23 65000
```

By default:

```text
Record = line
Field  = word/column
```

For:

```text
Adarsh 24 90000
```

we have:

```text
$1 = Adarsh
$2 = 24
$3 = 90000
```

---

# 5. Records and Fields

## Record

A record is normally one input line.

Example:

```text
Adarsh 24 90000
```

This is one record.

AWK stores the current record in:

```bash
$0
```

Therefore:

```bash
$0
```

means:

> Entire current record.

---

## Fields

Each record consists of fields.

```text
Adarsh 24 90000
```

| Expression | Value           |
| ---------- | --------------- |
| `$0`       | Adarsh 24 90000 |
| `$1`       | Adarsh          |
| `$2`       | 24              |
| `$3`       | 90000           |

---

# 6. Important AWK Built-in Variables

AWK provides several predefined variables.

| Variable   | Meaning                           |
| ---------- | --------------------------------- |
| `$0`       | Entire current record             |
| `$1`       | First field                       |
| `$2`       | Second field                      |
| `$NF`      | Last field                        |
| `NF`       | Number of fields                  |
| `NR`       | Current record number             |
| `FNR`      | Record number within current file |
| `FS`       | Input field separator             |
| `OFS`      | Output field separator            |
| `RS`       | Input record separator            |
| `ORS`      | Output record separator           |
| `FILENAME` | Current filename                  |
| `ARGC`     | Number of command-line arguments  |
| `ARGV`     | Command-line argument array       |
| `RSTART`   | Starting position from `match()`  |
| `RLENGTH`  | Length from `match()`             |

---

# 7. Printing Data

The most basic AWK operation is:

```bash
print
```

## Print entire file

```bash
awk '{print}' file.txt
```

Equivalent:

```bash
cat file.txt
```

---

## Print entire record

```bash
awk '{print $0}' file.txt
```

---

## Print first column

```bash
awk '{print $1}' file.txt
```

---

## Print multiple columns

```bash
awk '{print $1, $3}' file.txt
```

Example:

```text
Adarsh 24 90000
Rahul 25 75000
```

Output:

```text
Adarsh 90000
Rahul 75000
```

Notice that AWK inserts a space between `$1` and `$3`.

That space comes from:

```bash
OFS
```

---

# 8. Fields

## `$1`

First field:

```bash
awk '{print $1}' file
```

## `$2`

Second field:

```bash
awk '{print $2}' file
```

## `$NF`

Last field:

```bash
awk '{print $NF}' file
```

Suppose:

```text
A B C D E
```

Then:

```text
$1  = A
$2  = B
$3  = C
$4  = D
$5  = E
$NF = E
NF  = 5
```

---

## Second-last field

AWK allows arithmetic expressions in field references:

```bash
awk '{print $(NF-1)}' file
```

Example:

```text
A B C D E
```

Output:

```text
D
```

---

## Third-last field

```bash
awk '{print $(NF-2)}' file
```

---

# 9. Field Separator `FS`

By default AWK separates fields using whitespace.

Example:

```text
Adarsh 24 90000
```

Whitespace separates:

```text
Adarsh
24
90000
```

This is controlled by:

```bash
FS
```

---

## Using `-F`

Suppose CSV data:

```text
Adarsh,24,90000
Rahul,25,75000
Aman,23,65000
```

Use:

```bash
awk -F',' '{print $1, $3}' employees.csv
```

Output:

```text
Adarsh 90000
Rahul 75000
Aman 65000
```

You can also write:

```bash
awk -F, '{print $1, $3}' employees.csv
```

---

## Setting FS inside BEGIN

```bash
awk 'BEGIN {FS=","} {print $1, $3}' employees.csv
```

---

# 10. Output Field Separator `OFS`

`OFS` controls how fields are separated when using:

```bash
print $1, $2
```

Example:

```bash
awk 'BEGIN {OFS=","} {print $1,$2,$3}' employees.txt
```

Input:

```text
Adarsh 24 90000
```

Output:

```text
Adarsh,24,90000
```

---

## Difference between FS and OFS

### FS

Input separator:

```text
CSV → comma
```

### OFS

Output separator:

```text
comma
```

Example:

```bash
awk -F',' 'BEGIN {OFS=" | "} {print $1,$2,$3}' data.csv
```

Output:

```text
Adarsh | 24 | 90000
```

---

# 11. Record Separator `RS`

`RS` determines where one record ends.

Default:

```bash
RS="\n"
```

Meaning:

> Every newline represents a new record.

---

## Example

Input:

```text
A
B
C
```

Default:

```text
Record 1 → A
Record 2 → B
Record 3 → C
```

---

## Paragraph processing

Suppose:

```text
Name: Adarsh
Age: 24

Name: Rahul
Age: 25
```

Set:

```bash
RS=""
```

This tells AWK to treat blank-line-separated paragraphs as records.

```bash
awk 'BEGIN {RS=""} {print $0}' file
```

---

# 12. Output Record Separator `ORS`

`ORS` determines how records are separated in output.

Default:

```bash
ORS="\n"
```

Example:

```bash
awk 'BEGIN {ORS=" | "} {print $1}' file
```

Input:

```text
A
B
C
```

Output:

```text
A | B | C |
```

---

# 13. Patterns

A pattern determines **which records AWK should process**.

Syntax:

```bash
awk 'pattern { action }' file
```

---

## Pattern 1: No pattern

```bash
awk '{print $1}' file
```

Action executes for every record.

---

## Pattern 2: Comparison

```bash
awk '$3 > 50000 {print $1}' employees.txt
```

Only records satisfying:

```text
$3 > 50000
```

are processed.

---

## Pattern 3: String comparison

```bash
awk '$1 == "Adarsh" {print $0}' employees.txt
```

---

## Pattern 4: Regex

```bash
awk '/error/ {print $0}' logfile
```

Prints records containing:

```text
error
```

---

# 14. Comparison Operators

AWK supports:

```text
>
<
>=
<=
==
!=
```

Example:

```bash
awk '$2 >= 18 {print $1}' students.txt
```

---

## Numeric comparison

```bash
awk '$3 > 50000' employees.txt
```

---

## String comparison

```bash
awk '$1 == "Adarsh"' employees.txt
```

---

## Not equal

```bash
awk '$2 != 25' employees.txt
```

---

# 15. Logical Operators

AWK supports:

```text
&&   AND
||   OR
!    NOT
```

---

## AND

Find employees:

```text
age > 23
AND
salary > 70000
```

```bash
awk '$2 > 23 && $3 > 70000 {print $1}' employees.txt
```

---

## OR

```bash
awk '$2 < 23 || $3 > 80000 {print $1}' employees.txt
```

---

## NOT

```bash
awk '!($2 > 23) {print $1}' employees.txt
```

---

# 16. Regular Expressions

AWK has built-in regular expression support.

Syntax:

```bash
/pattern/
```

Example:

```bash
awk '/error/ {print}' logfile
```

---

## Case-sensitive search

```bash
awk '/ERROR/ {print}' logfile
```

---

## Case-insensitive search

A common approach:

```bash
awk 'tolower($0) ~ /error/ {print}' logfile
```

---

## `~`

The `~` operator means:

> Matches regular expression.

Example:

```bash
awk '$1 ~ /^A/ {print $1}' employees.txt
```

Matches names beginning with `A`.

---

## `!~`

Means:

> Does not match regex.

```bash
awk '$1 !~ /^A/ {print $1}' employees.txt
```

---

## Useful regex patterns

### Starts with A

```regex
^A
```

### Ends with com

```regex
com$
```

### Contains error

```regex
error
```

### Only digits

```regex
^[0-9]+$
```

### Email-like pattern

```regex
^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$
```

---

# 17. BEGIN and END

AWK provides three major execution areas:

```text
BEGIN
body
END
```

---

## BEGIN

Runs before reading input.

```bash
awk 'BEGIN {print "Starting"} {print $0}' file
```

---

## END

Runs after all input has been processed.

```bash
awk '{print $1} END {print "Finished"}' file
```

---

## Classic use case

Calculate sum:

```bash
awk '{sum += $3} END {print sum}' employees.txt
```

---

## BEGIN + body + END

```bash
awk '
BEGIN {
    print "Employee Report"
}
{
    print $1, $3
}
END {
    print "Report Complete"
}
' employees.txt
```

---

# 18. Variables

Variables do not need explicit declaration.

```bash
awk '{sum = sum + $3} END {print sum}' employees.txt
```

`sum` starts effectively as `0` in numeric context.

---

## String variable

```bash
awk 'BEGIN {name="Adarsh"; print name}'
```

Output:

```text
Adarsh
```

---

## Variable assignment

```bash
awk 'BEGIN {
    age=24
    salary=90000
    print age, salary
}'
```

---

# 19. Arithmetic Operations

AWK supports:

```text
+
-
*
/
%
++
--
```

Example:

```bash
awk '{print $3 * 12}' employees.txt
```

If salary is monthly, this calculates annual salary.

---

## Sum

```bash
awk '{sum += $3} END {print sum}' employees.txt
```

---

## Average

```bash
awk '{sum += $3; count++} END {print sum/count}' employees.txt
```

---

## Maximum

```bash
awk '
BEGIN {max=0}
{
    if ($3 > max)
        max=$3
}
END {print max}
' employees.txt
```

---

## Minimum

```bash
awk '
{
    if (NR == 1 || $3 < min)
        min=$3
}
END {print min}
' employees.txt
```

---

# 20. Conditional Statements

## if

```bash
awk '{
    if ($3 > 70000)
        print $1
}' employees.txt
```

---

## if-else

```bash
awk '{
    if ($3 >= 70000)
        print $1, "High"
    else
        print $1, "Low"
}' employees.txt
```

---

## Multiple conditions

```bash
awk '{
    if ($3 >= 90000)
        grade="A"
    else if ($3 >= 70000)
        grade="B"
    else
        grade="C"

    print $1, grade
}' employees.txt
```

---

# 21. Loops

AWK supports:

```text
for
while
do-while
```

---

## For loop

```bash
awk '{
    for (i=1; i<=NF; i++)
        print $i
}' file
```

This prints every field separately.

---

## Example

Input:

```text
A B C
```

Output:

```text
A
B
C
```

---

## While loop

```bash
awk '{
    i=1
    while (i<=NF) {
        print $i
        i++
    }
}' file
```

---

# 22. Arrays

AWK arrays are **associative arrays**.

That means indexes can be strings.

Example:

```bash
awk '
BEGIN {
    marks["Adarsh"] = 90
    marks["Rahul"] = 85

    print marks["Adarsh"]
}
'
```

Output:

```text
90
```

---

# 23. Associative Arrays

One of AWK's strongest features is counting.

Suppose:

```text
apple
banana
apple
orange
banana
apple
```

Count occurrences:

```bash
awk '{count[$1]++} END {for (x in count) print x, count[x]}' file
```

Output:

```text
apple 3
banana 2
orange 1
```

---

# 24. String Functions

AWK provides many string functions.

Important ones:

```text
length()
tolower()
toupper()
substr()
index()
split()
gsub()
sub()
match()
```

---

## `length()`

```bash
awk '{print length($1)}' file
```

---

## `tolower()`

```bash
awk '{print tolower($1)}' file
```

---

## `toupper()`

```bash
awk '{print toupper($1)}' file
```

---

## `substr()`

Syntax:

```bash
substr(string, start, length)
```

Example:

```bash
awk 'BEGIN {print substr("Adarsh", 1, 3)}'
```

Output:

```text
Ada
```

---

## `index()`

Find position of substring:

```bash
awk 'BEGIN {print index("Hello World", "World")}'
```

Output:

```text
7
```

---

# 25. `split()`

`split()` divides a string into an array.

Syntax:

```text
split(string, array, separator)
```

Example:

```bash
awk '
BEGIN {
    split("apple,banana,orange", fruits, ",")
    for (i=1; i<=3; i++)
        print fruits[i]
}
'
```

Output:

```text
apple
banana
orange
```

---

# 26. `sub()` and `gsub()`

## `sub()`

Replaces the **first** matching occurrence.

```bash
awk '{sub(/old/, "new"); print}' file
```

---

## `gsub()`

Replaces **all** matching occurrences.

```bash
awk '{gsub(/old/, "new"); print}' file
```

Example:

Input:

```text
hello hello hello
```

Command:

```bash
awk '{gsub(/hello/, "hi"); print}' file
```

Output:

```text
hi hi hi
```

---

# 27. `match()`

`match()` searches a string using regex.

Example:

```bash
awk '
{
    if (match($0, /error/))
        print "Error found:", $0
}
' logfile
```

`match()` also sets:

```text
RSTART
RLENGTH
```

For example:

```bash
awk '
BEGIN {
    text="hello world"

    if (match(text, /world/)) {
        print RSTART
        print RLENGTH
    }
}
'
```

Output:

```text
7
5
```

---

# 28. Numeric Functions

Important functions include:

```text
int()
sqrt()
log()
exp()
sin()
cos()
atan2()
rand()
srand()
```

---

## `int()`

```bash
awk 'BEGIN {print int(10.75)}'
```

Output:

```text
10
```

---

## `sqrt()`

```bash
awk 'BEGIN {print sqrt(25)}'
```

Output:

```text
5
```

---

# 29. User-Defined Functions

You can create your own functions.

Syntax:

```text
function function_name(parameters) {
    statements
}
```

Example:

```bash
awk '
function square(x) {
    return x * x
}

BEGIN {
    print square(5)
}
'
```

Output:

```text
25
```

---

## Practical example

```bash
awk '
function salary_in_yearly(monthly) {
    return monthly * 12
}

{
    print $1, salary_in_yearly($3)
}
' employees.txt
```

---

# 30. `getline`

`getline` allows AWK to explicitly read another input record.

Basic:

```bash
getline
```

Example:

```bash
awk '
{
    print "Current:", $0
    getline
    print "Next:", $0
}
' file
```

`getline` is powerful but should be used carefully because it can make input flow harder to understand.

---

# 31. Multiple Input Files

Suppose:

```text
employees1.txt
employees2.txt
```

You can process both:

```bash
awk '{print $1}' employees1.txt employees2.txt
```

AWK processes them sequentially.

---

# 32. NR vs FNR

This is one of the **most important AWK concepts**.

## NR

`NR` = Number of records processed so far across **all files**.

## FNR

`FNR` = Number of records processed within the **current file**.

Suppose:

### file1

```text
A
B
```

### file2

```text
C
D
E
```

Command:

```bash
awk '{print NR, FNR, $0}' file1 file2
```

Output:

```text
1 1 A
2 2 B
3 1 C
4 2 D
5 3 E
```

Notice:

```text
NR  → continues increasing
FNR → resets for each file
```

---

# 33. Classic Use of FNR

Suppose you want to print the header only from the first file:

```bash
awk 'FNR == 1 {print "HEADER:", $0} {print}' file
```

More commonly:

```bash
awk 'FNR == 1 {print "Processing:", FILENAME} {print}' file1 file2
```

---

# 34. `FILENAME`

Shows current input filename.

```bash
awk '{print FILENAME, $0}' file1 file2
```

Output:

```text
file1 A
file1 B
file2 C
file2 D
```

---

# 35. `ARGC` and `ARGV`

AWK receives command-line arguments.

Example:

```bash
awk 'BEGIN {
    print ARGC
}' file1 file2
```

`ARGV` contains arguments.

Example:

```bash
awk 'BEGIN {
    for (i=0; i<ARGC; i++)
        print i, ARGV[i]
}' file1 file2
```

---

# 36. Command-Line Variables

You can pass variables using:

```bash
-v
```

Example:

```bash
awk -v limit=70000 '$3 > limit {print $1}' employees.txt
```

This is much cleaner than hardcoding:

```bash
70000
```

---

## Multiple variables

```bash
awk -v min=70000 -v dept="IT" '...' employees.txt
```

---

# 37. AWK Scripts

Instead of putting everything on the command line, create:

```text
script.awk
```

Example:

```awk
BEGIN {
    print "Employee Report"
}

{
    print $1, $3
}

END {
    print "End of Report"
}
```

Run:

```bash
awk -f script.awk employees.txt
```

---

# 38. AWK Program Structure

A professional AWK program often looks like:

```awk
BEGIN {
    # Initialization
}

pattern {
    # Processing
}

END {
    # Final calculations
}
```

Example:

```awk
BEGIN {
    total = 0
    count = 0
}

{
    total += $3
    count++
}

END {
    print "Total:", total
    print "Average:", total / count
}
```

---

# 39. AWK with Pipes

AWK becomes extremely powerful when combined with Linux commands.

Example:

```bash
ps aux | awk '$3 > 50 {print $1, $3, $11}'
```

Meaning:

```text
ps aux
   ↓
AWK receives process data
   ↓
CPU > 50%
   ↓
Print user, CPU and command
```

---

# 40. AWK with `grep`

Instead of:

```bash
grep "error" logfile | awk '{print $5}'
```

You can often do:

```bash
awk '/error/ {print $5}' logfile
```

AWK can perform both filtering and processing.

---

# 41. AWK with `sort`

Example:

```bash
awk '{print $1, $3}' employees.txt | sort -k2 -nr
```

Meaning:

```text
awk
 ↓
extract name + salary
 ↓
sort
 ↓
numeric reverse sorting by column 2
```

---

# 42. AWK with `uniq`

Count occurrences:

```bash
awk '{count[$1]++} END {for (x in count) print x, count[x]}' file
```

This can often replace:

```bash
sort | uniq -c
```

---

# 43. Important Advanced Concept: Dynamic Field Access

You can dynamically choose a field.

Suppose:

```text
A B C D
```

and:

```bash
i=3
```

Then:

```bash
awk -v i=3 '{print $i}' file
```

prints:

```text
C
```

This is extremely useful in scripts.

---

# 44. `$i` vs `$(i+1)`

Suppose:

```text
A B C D
```

and:

```text
i=2
```

Then:

```bash
$i
```

means:

```text
$2
```

Output:

```text
B
```

Whereas:

```bash
$(i+1)
```

means:

```text
$3
```

Output:

```text
C
```

This distinction is very important.

---

# 45. Changing Fields

AWK allows you to modify fields.

Input:

```text
Adarsh 24 90000
```

Command:

```bash
awk '{$3 = $3 * 1.10; print}' employees.txt
```

Output:

```text
Adarsh 24 99000
```

---

# 46. `$0` Reconstruction

When a field changes, AWK may reconstruct `$0`.

Example:

```bash
awk '{$2=25; print}' file
```

This changes the second field.

---

# 47. Converting CSV to TSV

Input:

```text
Adarsh,24,90000
Rahul,25,75000
```

Command:

```bash
awk -F',' 'BEGIN {OFS="\t"} {print $1,$2,$3}' file.csv
```

---

# 48. Converting TSV to CSV

```bash
awk 'BEGIN {OFS=","} {print $1,$2,$3}' file.tsv
```

---

# 49. Filtering by Number of Fields

Print only records having 3 fields:

```bash
awk 'NF == 3' file
```

Print records with more than 5 fields:

```bash
awk 'NF > 5' file
```

---

# 50. Print Empty Lines

A blank line generally has:

```text
NF == 0
```

Therefore:

```bash
awk 'NF == 0' file
```

---

# 51. Remove Empty Lines

```bash
awk 'NF > 0' file
```

This is a common AWK trick.

---

# 52. Remove Leading and Trailing Spaces

A common AWK approach:

```bash
awk '{$1=$1; print}' file
```

Why does this work?

Assigning:

```bash
$1=$1
```

forces AWK to reconstruct `$0` using `OFS`.

---

# 53. Print Line Numbers

```bash
awk '{print NR, $0}' file
```

Output:

```text
1 first line
2 second line
3 third line
```

---

# 54. Print Specific Lines

## Line 5

```bash
awk 'NR == 5' file
```

## Lines 5–10

```bash
awk 'NR >= 5 && NR <= 10' file
```

## First 10 lines

```bash
awk 'NR <= 10' file
```

## Skip first line

```bash
awk 'NR > 1' file
```

---

# 55. Skip Header

Suppose:

```text
Name Age Salary
Adarsh 24 90000
Rahul 25 75000
```

Use:

```bash
awk 'NR > 1 {print $1, $3}' employees.txt
```

---

# 56. Print Header and Modify Data

```bash
awk '
NR == 1 {
    print $0
    next
}
{
    print $1, $3
}
' employees.txt
```

---

# 57. `next`

`next` tells AWK:

> Stop processing the current record and move to the next record.

Example:

```bash
awk '
NR == 1 {
    next
}
{
    print $1
}
' employees.txt
```

This skips the header.

---

# 58. `nextfile`

Some AWK implementations support:

```bash
nextfile
```

It skips the rest of the current input file and moves to the next file.

Useful when processing many files.

---

# 59. `exit`

Stop AWK execution:

```bash
awk '
{
    print
    if (NR == 5)
        exit
}
' file
```

Only the first five records are processed.

---

# 60. Membership Testing in Arrays

Check whether an element exists:

```bash
if (name in count)
    print "Exists"
```

Example:

```bash
awk '
{
    if ($1 in seen)
        print "Duplicate:", $1
    seen[$1]++
}
' file
```

---

# 61. Delete Array Elements

```bash
delete array[key]
```

Example:

```bash
awk '
BEGIN {
    a["x"]=10
    a["y"]=20

    delete a["x"]

    for (i in a)
        print i, a[i]
}
'
```

---

# 62. Delete Entire Array

In modern AWK implementations:

```bash
delete array
```

can delete the entire array.

This is useful for resetting data structures between records/files.

---

# 63. Multi-Dimensional Data

AWK traditionally uses associative arrays, but you can simulate multiple dimensions.

Example:

```bash
count["IT", "Male"]++
```

AWK internally creates a combined index.

Modern implementations may also support more advanced array structures, but portable AWK code commonly uses:

```bash
array[key1, key2]
```

---

# 64. Counting Frequencies

Input:

```text
apple
banana
apple
orange
banana
apple
```

Solution:

```bash
awk '
{
    count[$1]++
}
END {
    for (item in count)
        print item, count[item]
}
' file
```

---

# 65. Finding Duplicate Lines

```bash
awk '
{
    count[$0]++
}
END {
    for (line in count)
        if (count[line] > 1)
            print line
}
' file
```

---

# 66. Finding Unique Lines

```bash
awk '
{
    count[$0]++
}
END {
    for (line in count)
        if (count[line] == 1)
            print line
}
' file
```

---

# 67. Sum of a Column

```bash
awk '{sum += $3} END {print sum}' file
```

---

# 68. Average of a Column

```bash
awk '
{
    sum += $3
    count++
}
END {
    print sum / count
}
' file
```

---

# 69. Maximum Value

```bash
awk '
NR == 1 {
    max=$3
}
$3 > max {
    max=$3
}
END {
    print max
}
' file
```

---

# 70. Minimum Value

```bash
awk '
NR == 1 {
    min=$3
}
$3 < min {
    min=$3
}
END {
    print min
}
' file
```

---

# 71. Find Employee With Maximum Salary

```bash
awk '
NR == 1 || $3 > max {
    max=$3
    name=$1
}
END {
    print name, max
}
' employees.txt
```

---

# 72. Find Employee With Minimum Salary

```bash
awk '
NR == 1 || $3 < min {
    min=$3
    name=$1
}
END {
    print name, min
}
' employees.txt
```

---

# 73. Percentage Calculation

Suppose:

```text
Name Marks
A 80
B 70
C 90
```

Calculate percentage out of 100:

```bash
awk 'NR > 1 {print $1, $2 "%"}' marks.txt
```

For marks out of 500:

```bash
awk 'NR > 1 {print $1, ($2/500)*100}' marks.txt
```

---

# 74. Formatting Output

AWK provides:

```bash
printf
```

Example:

```bash
awk '{printf "%-10s %5d\n", $1, $2}' file
```

Format:

```text
%-10s → left-aligned string
%5d   → integer
```

---

# 75. `printf`

Example:

```bash
awk '
BEGIN {
    printf "%-15s %10s\n", "Name", "Salary"
}
{
    printf "%-15s %10d\n", $1, $3
}
' employees.txt
```

Possible output:

```text
Name                 Salary
Adarsh                90000
Rahul                 75000
```

This is much better for report generation.

---

# 76. Floating-Point Formatting

```bash
awk 'BEGIN {printf "%.2f\n", 10/3}'
```

Output:

```text
3.33
```

---

# 77. Printing Literal `$`

Inside AWK strings, `$` has special meaning in expressions, so when constructing text be careful with shell expansion.

A common safe approach is to use single quotes around the AWK program:

```bash
awk '{print $1}' file
```

rather than:

```bash
awk "{print $1}" file
```

---

# 78. AWK and Shell Variables

Suppose shell variable:

```bash
threshold=70000
```

Pass it using:

```bash
awk -v limit="$threshold" '$3 > limit {print $1}' employees.txt
```

This is the preferred method.

---

# 79. AWK for Log Analysis

Suppose log:

```text
INFO user1 login
ERROR user2 database
INFO user3 logout
ERROR user4 timeout
```

Count errors:

```bash
awk '$1 == "ERROR" {count++} END {print count}' logfile
```

---

# 80. Extract Error Messages

```bash
awk '$1 == "ERROR" {print $0}' logfile
```

---

# 81. Count Status Codes

Suppose HTTP logs contain:

```text
GET /index.html 200
GET /login 200
GET /admin 403
GET /abc 404
```

Count each status:

```bash
awk '{count[$3]++} END {for (code in count) print code, count[code]}' access.log
```

---

# 82. Find 404 Requests

```bash
awk '$3 == 404 {print $0}' access.log
```

---

# 83. Count 404 Requests

```bash
awk '$3 == 404 {count++} END {print count}' access.log
```

---

# 84. Count Requests by IP

Suppose first column is IP:

```bash
awk '{count[$1]++} END {for (ip in count) print ip, count[ip]}' access.log
```

---

# 85. Top Requesting IPs

```bash
awk '{count[$1]++} END {for (ip in count) print count[ip], ip}' access.log | sort -nr
```

---

# 86. Disk Usage Analysis

Example:

```bash
df -h | awk 'NR > 1 && $5+0 > 80 {print $0}'
```

Why:

```bash
$5+0
```

converts something like:

```text
85%
```

into a numeric value:

```text
85
```

---

# 87. CPU Monitoring

```bash
ps aux | awk 'NR > 1 && $3 > 50 {print $1, $3, $11}'
```

---

# 88. Memory Monitoring

```bash
ps aux | awk 'NR > 1 && $4 > 50 {print $1, $4, $11}'
```

---

# 89. Extracting Environment Variables

```bash
env | awk -F= '{print $1}'
```

This prints variable names.

---

# 90. Extract PATH Entries

```bash
echo "$PATH" | awk -F: '{
    for (i=1; i<=NF; i++)
        print $i
}'
```

---

# 91. Advanced: Reading Multiple Files

Suppose:

```text
employees.txt
departments.txt
```

You can process them differently based on `FILENAME`.

```bash
awk '
FILENAME == "employees.txt" {
    print "Employee:", $0
}

FILENAME == "departments.txt" {
    print "Department:", $0
}
' employees.txt departments.txt
```

---

# 92. Advanced: Joining Two Files

Suppose:

### employees.txt

```text
101 Adarsh
102 Rahul
103 Aman
```

### salary.txt

```text
101 90000
102 75000
103 65000
```

Create lookup array from salary file and process employees.

```bash
awk '
FNR == NR {
    salary[$1] = $2
    next
}

{
    print $1, $2, salary[$1]
}
' salary.txt employees.txt
```

This is one of the most important real-world AWK patterns.

---

# 93. Understanding `FNR == NR`

This:

```bash
FNR == NR
```

is true only while processing the first file.

Why?

First file:

```text
NR  FNR
1   1
2   2
3   3
```

Second file:

```text
NR  FNR
4   1
5   2
6   3
```

Therefore:

```text
FNR == NR
```

is false after the first file begins.

---

# 94. AWK Join Pattern

General pattern:

```bash
awk '
FNR == NR {
    lookup[$1] = $2
    next
}
{
    print $1, lookup[$1]
}
' file1 file2
```

Think of it as:

```text
FILE 1
   ↓
Build lookup table
   ↓
FILE 2
   ↓
Look up values
   ↓
Print joined result
```

---

# 95. Advanced: Grouping

Suppose:

```text
IT Adarsh 90000
IT Rahul 75000
HR Aman 65000
HR Ravi 60000
```

Calculate salary by department:

```bash
awk '
{
    total[$1] += $3
}
END {
    for (dept in total)
        print dept, total[dept]
}
' employees.txt
```

---

# 96. Average Salary by Department

```bash
awk '
{
    sum[$1] += $3
    count[$1]++
}
END {
    for (dept in sum)
        print dept, sum[dept] / count[dept]
}
' employees.txt
```

---

# 97. Maximum Salary by Department

```bash
awk '
{
    dept=$1
    salary=$3

    if (!(dept in max) || salary > max[dept])
        max[dept]=salary
}
END {
    for (dept in max)
        print dept, max[dept]
}
' employees.txt
```

---

# 98. Advanced: Sorting AWK Output

AWK itself does not traditionally provide a simple general-purpose sorting command like shell `sort`.

A common pattern is:

```bash
awk '{count[$1]++} END {for (x in count) print count[x], x}' file | sort -nr
```

This is an important Unix philosophy:

```text
AWK → processing
sort → sorting
```

Use the right tool for each task.

---

# 99. Advanced: CSV Caveat

Simple CSV files can be processed using:

```bash
awk -F, '{print $1}' file.csv
```

But real CSV is more complicated.

Example:

```text
Adarsh,"New Delhi, India",90000
```

The comma inside quotes is part of the field.

A simple:

```bash
-F,
```

cannot correctly parse every valid CSV file.

For complex CSV:

* Python
* Perl
* dedicated CSV tools

may be more appropriate.

---

# 100. Advanced: Pattern Ranges

AWK supports range patterns:

```bash
awk '/START/,/END/ {print}' file
```

This prints records from the first line matching:

```text
START
```

through the next line matching:

```text
END
```

Example:

```text
abc
START
hello
world
END
xyz
```

Command:

```bash
awk '/START/,/END/' file
```

Output:

```text
START
hello
world
END
```

---

# 101. Multiple Patterns

You can have multiple rules:

```bash
awk '
$3 > 80000 {
    print "High:", $1
}

$3 < 60000 {
    print "Low:", $1
}
' employees.txt
```

Each matching rule can execute independently.

---

# 102. Pattern + Action vs Action Alone

### Action only

```bash
awk '{print $1}' file
```

Runs for every record.

### Pattern only

```bash
awk '$3 > 70000' file
```

Equivalent conceptually to:

```bash
awk '$3 > 70000 {print $0}' file
```

This is a very useful shortcut.

---

# 103. Boolean Expressions as Patterns

You can write:

```bash
awk 'NR > 1 && $3 > 70000' employees.txt
```

No explicit `{print}` is required.

AWK prints matching records.

---

# 104. String Concatenation

AWK concatenates strings simply by placing expressions next to each other.

```bash
awk 'BEGIN {
    first="Adarsh"
    last="Gupta"
    print first " " last
}'
```

Output:

```text
Adarsh Gupta
```

---

# 105. `sprintf()`

`sprintf()` returns formatted text instead of printing it.

```bash
awk 'BEGIN {
    x=sprintf("%.2f", 10/3)
    print x
}'
```

Output:

```text
3.33
```

Useful when constructing reports.

---

# 106. `system()`

AWK can execute shell commands using:

```bash
system(command)
```

Example:

```bash
awk 'BEGIN {
    system("date")
}'
```

Use this carefully because it crosses from AWK into shell execution.

---

# 107. Environment Variables

Some AWK implementations provide:

```bash
ENVIRON
```

Example:

```bash
awk 'BEGIN {
    print ENVIRON["HOME"]
}'
```

This reads the shell environment.

---

# 108. Exit Status

AWK can terminate with a status code:

```bash
exit 1
```

Useful in shell automation.

Example:

```bash
awk '
$3 > 90 {
    found=1
}
END {
    if (found)
        exit 1
    else
        exit 0
}
' file
```

Then the shell can inspect `$?`.

---

# 109. Practical DevOps Example

Check whether a service/process is consuming excessive CPU:

```bash
ps aux | awk '
NR > 1 && $3 > 80 {
    print "High CPU:", $1, $3, $11
}'
```

---

# 110. Practical DevOps Example — Disk Alert

```bash
df -P | awk '
NR > 1 {
    usage=$5
    gsub("%", "", usage)

    if (usage > 80)
        print "WARNING:", $6, usage "%"
}'
```

---

# 111. Practical DevOps Example — HTTP Errors

```bash
awk '
$9 >= 500 {
    count++
}
END {
    print "5xx errors:", count
}
' access.log
```

---

# 112. Practical DevOps Example — Error Frequency

```bash
awk '
/ERROR/ {
    count++
}
END {
    print "Total errors:", count
}
' application.log
```

---

# 113. Practical DevOps Example — Extract IPs

```bash
awk '{print $1}' access.log
```

Count:

```bash
awk '{count[$1]++} END {for (ip in count) print ip, count[ip]}' access.log
```

---

# 114. Important AWK Concepts to Master

If you're preparing for Linux/Unix exams or DevOps interviews, prioritize:

### Level 1

```text
awk syntax
$0
$1
$2
$NF
NF
NR
print
-F
```

### Level 2

```text
FS
OFS
BEGIN
END
if/else
&&
||
!
regex
~
!~
```

### Level 3

```text
arrays
counting
sum
average
min/max
for loops
functions
printf
NR vs FNR
-v
```

### Level 4

```text
FNR == NR
file joins
multiple files
getline
next
nextfile
dynamic fields
system()
ENVIRON
complex log analysis
```

---

# 115. Practice Questions — Beginner

## Q1. Print the entire file.

### Solution

```bash
awk '{print $0}' file.txt
```

Shortcut:

```bash
awk '{print}' file.txt
```

---

## Q2. Print the first column.

### Solution

```bash
awk '{print $1}' file.txt
```

---

## Q3. Print the last column.

### Solution

```bash
awk '{print $NF}' file.txt
```

---

## Q4. Print the second-last column.

### Solution

```bash
awk '{print $(NF-1)}' file.txt
```

---

## Q5. Print line number with each line.

### Solution

```bash
awk '{print NR, $0}' file.txt
```

---

## Q6. Print only lines 5 to 10.

### Solution

```bash
awk 'NR >= 5 && NR <= 10' file.txt
```

---

## Q7. Skip the first line.

### Solution

```bash
awk 'NR > 1' file.txt
```

---

# 116. Practice Questions — Filtering

Assume:

```text
Adarsh 24 90000
Rahul 25 75000
Aman 23 65000
Ravi 27 55000
```

## Q8. Print employees earning more than 70000.

### Solution

```bash
awk '$3 > 70000 {print $1}' employees.txt
```

---

## Q9. Print employees aged 24 or above.

### Solution

```bash
awk '$2 >= 24 {print $1}' employees.txt
```

---

## Q10. Print employees whose salary is between 60000 and 80000.

### Solution

```bash
awk '$3 >= 60000 && $3 <= 80000 {print $1}' employees.txt
```

---

## Q11. Print employees aged below 24 OR salary above 80000.

### Solution

```bash
awk '$2 < 24 || $3 > 80000 {print $1}' employees.txt
```

---

# 117. Practice Questions — Strings

## Q12. Print names beginning with A.

### Solution

```bash
awk '$1 ~ /^A/ {print $1}' employees.txt
```

---

## Q13. Print names not beginning with A.

### Solution

```bash
awk '$1 !~ /^A/ {print $1}' employees.txt
```

---

## Q14. Print names in uppercase.

### Solution

```bash
awk '{print toupper($1)}' employees.txt
```

---

## Q15. Print length of every name.

### Solution

```bash
awk '{print $1, length($1)}' employees.txt
```

---

# 118. Practice Questions — Arithmetic

## Q16. Calculate total salary.

### Solution

```bash
awk '{sum += $3} END {print sum}' employees.txt
```

---

## Q17. Calculate average salary.

### Solution

```bash
awk '
{
    sum += $3
    count++
}
END {
    print sum/count
}
' employees.txt
```

---

## Q18. Find maximum salary.

### Solution

```bash
awk '
NR == 1 || $3 > max {
    max=$3
}
END {
    print max
}
' employees.txt
```

---

## Q19. Find employee with highest salary.

### Solution

```bash
awk '
NR == 1 || $3 > max {
    max=$3
    name=$1
}
END {
    print name, max
}
' employees.txt
```

---

# 119. Practice Questions — Fields

## Q20. Print records having more than 3 fields.

### Solution

```bash
awk 'NF > 3' file.txt
```

---

## Q21. Print number of fields in each record.

### Solution

```bash
awk '{print NF}' file.txt
```

---

## Q22. Print the first and last field.

### Solution

```bash
awk '{print $1, $NF}' file.txt
```

---

# 120. Practice Questions — CSV

Given:

```text
Adarsh,24,90000
Rahul,25,75000
Aman,23,65000
```

## Q23. Print name and salary.

### Solution

```bash
awk -F',' '{print $1, $3}' employees.csv
```

---

## Q24. Print CSV output with `|`.

### Solution

```bash
awk -F',' 'BEGIN {OFS="|"} {print $1,$2,$3}' employees.csv
```

---

# 121. Practice Questions — Arrays

## Q25. Count how many times each word appears.

Input:

```text
apple
banana
apple
orange
banana
apple
```

### Solution

```bash
awk '
{
    count[$1]++
}
END {
    for (word in count)
        print word, count[word]
}
' file.txt
```

---

## Q26. Find duplicate lines.

### Solution

```bash
awk '
{
    count[$0]++
}
END {
    for (line in count)
        if (count[line] > 1)
            print line
}
' file.txt
```

---

## Q27. Count HTTP status codes.

### Solution

```bash
awk '
{
    count[$3]++
}
END {
    for (code in count)
        print code, count[code]
}
' access.log
```

---

# 122. Practice Questions — Department Analysis

Given:

```text
IT Adarsh 90000
IT Rahul 75000
HR Aman 65000
HR Ravi 60000
```

## Q28. Calculate total salary per department.

### Solution

```bash
awk '
{
    total[$1] += $3
}
END {
    for (dept in total)
        print dept, total[dept]
}
' employees.txt
```

---

## Q29. Calculate average salary per department.

### Solution

```bash
awk '
{
    sum[$1] += $3
    count[$1]++
}
END {
    for (dept in sum)
        print dept, sum[dept] / count[dept]
}
' employees.txt
```

---

# 123. Practice Questions — Intermediate

## Q30. Remove blank lines.

### Solution

```bash
awk 'NF > 0' file.txt
```

---

## Q31. Print only unique lines.

### Solution

```bash
awk '
{
    count[$0]++
}
END {
    for (line in count)
        if (count[line] == 1)
            print line
}
' file.txt
```

---

## Q32. Print the first line of every input file.

### Solution

```bash
awk 'FNR == 1 {print FILENAME, $0}' *.txt
```

---

## Q33. Add line numbers separately for every file.

### Solution

```bash
awk '{print FILENAME, FNR, $0}' file1 file2
```

---

# 124. Practice Questions — Advanced

## Q34. Join two files using a common ID.

### File 1

```text
101 Adarsh
102 Rahul
103 Aman
```

### File 2

```text
101 90000
102 75000
103 65000
```

### Solution

```bash
awk '
FNR == NR {
    salary[$1] = $2
    next
}
{
    print $1, $2, salary[$1]
}
' salary.txt employees.txt
```

---

## Q35. Find the most frequently occurring IP.

### Solution

```bash
awk '
{
    count[$1]++
}
END {
    for (ip in count) {
        if (count[ip] > max) {
            max=count[ip]
            best=ip
        }
    }

    print best, max
}
' access.log
```

---

# 125. Challenge Question

Given:

```text
IT Adarsh 90000
IT Rahul 75000
IT Aman 95000
HR Ravi 60000
HR Raj 70000
HR Amit 65000
```

Find the **highest-paid employee from each department**.

### Solution

```bash
awk '
{
    dept=$1
    name=$2
    salary=$3

    if (!(dept in max) || salary > max[dept]) {
        max[dept]=salary
        employee[dept]=name
    }
}
END {
    for (dept in max)
        print dept, employee[dept], max[dept]
}
' employees.txt
```

Concepts involved:

```text
associative arrays
multiple arrays
conditional logic
department grouping
maximum calculation
```

---

# 126. Expert Challenge

Given an access log:

```text
192.168.1.10 GET /index.html 200
192.168.1.20 GET /login 200
192.168.1.10 GET /admin 403
192.168.1.30 GET /abc 404
192.168.1.10 GET /xyz 500
192.168.1.20 GET /test 404
```

Find:

1. Total requests
2. Number of 2xx requests
3. Number of 4xx requests
4. Number of 5xx requests
5. Most active IP

### Solution

```bash
awk '
{
    total++

    ip[$1]++
    status=$4

    if (status >= 200 && status < 300)
        success++

    if (status >= 400 && status < 500)
        client_error++

    if (status >= 500 && status < 600)
        server_error++
}

END {
    for (x in ip) {
        if (ip[x] > max) {
            max=ip[x]
            best=x
        }
    }

    print "Total requests:", total
    print "2xx:", success
    print "4xx:", client_error
    print "5xx:", server_error
    print "Most active IP:", best, max
}
' access.log
```

---

# 127. AWK One-Liners You Should Memorize

## Print first column

```bash
awk '{print $1}' file
```

## Print last column

```bash
awk '{print $NF}' file
```

## Print line numbers

```bash
awk '{print NR, $0}' file
```

## Skip header

```bash
awk 'NR > 1' file
```

## Print lines 5–10

```bash
awk 'NR >= 5 && NR <= 10' file
```

## Remove blank lines

```bash
awk 'NF' file
```

## Count lines

```bash
awk 'END {print NR}' file
```

## Sum column

```bash
awk '{sum += $3} END {print sum}' file
```

## Average

```bash
awk '{sum += $3; n++} END {print sum/n}' file
```

## Maximum

```bash
awk 'NR==1 || $3>max {max=$3} END {print max}' file
```

## Search text

```bash
awk '/error/' file
```

## Regex on a field

```bash
awk '$1 ~ /^A/' file
```

## Count values

```bash
awk '{count[$1]++} END {for(x in count) print x,count[x]}' file
```

## CSV

```bash
awk -F',' '{print $1,$3}' file.csv
```

## Custom output separator

```bash
awk 'BEGIN {OFS=","} {print $1,$2,$3}' file
```

## Print file name

```bash
awk '{print FILENAME, $0}' file
```

## Join files

```bash
awk 'FNR==NR {a[$1]=$2; next} {print $1,a[$1]}' file1 file2
```

---

# 128. Common Mistakes

## Mistake 1 — Confusing `NF` and `$NF`

Wrong:

```bash
print $NF
```

means last field.

Correct:

```text
NF  → number of fields
$NF → value of last field
```

---

## Mistake 2 — Confusing `NR` and `FNR`

Remember:

```text
NR  → global record number
FNR → current file record number
```

---

## Mistake 3 — Forgetting `-F`

For CSV:

```bash
awk '{print $1}' data.csv
```

may not work correctly.

Use:

```bash
awk -F',' '{print $1}' data.csv
```

---

## Mistake 4 — Using `=` instead of `==`

Assignment:

```bash
x = 10
```

Comparison:

```bash
x == 10
```

---

## Mistake 5 — Shell expansion

Prefer:

```bash
awk '{print $1}' file
```

rather than:

```bash
awk "{print $1}" file
```

---

## Mistake 6 — Treating AWK as a full CSV parser

This:

```bash
-F,
```

is not sufficient for every RFC-style CSV file containing quoted commas.

---

# 129. AWK Mental Model

The easiest way to understand AWK is:

```text
INPUT
  ↓
Read one record
  ↓
Split record into fields
  ↓
Check pattern
  ↓
Execute action
  ↓
Read next record
  ↓
Repeat
  ↓
END block
```

For example:

```bash
awk '$3 > 70000 {print $1}' employees.txt
```

Think:

```text
Read line
   ↓
Split into fields
   ↓
Look at $3
   ↓
Is $3 > 70000?
   ↓
YES → print $1
NO  → skip
   ↓
Next line
```

---

# 130. AWK vs GREP vs SED

| Tool   | Best For                                |
| ------ | --------------------------------------- |
| `grep` | Searching/filtering                     |
| `sed`  | Stream editing/replacement              |
| `awk`  | Structured text processing/calculations |
| `cut`  | Simple column extraction                |
| `sort` | Sorting                                 |
| `uniq` | Duplicate counting/removal              |

Example:

### grep

```bash
grep "ERROR" logfile
```

### sed

```bash
sed 's/ERROR/WARNING/g' logfile
```

### awk

```bash
awk '$3 > 80 {print $1}' file
```

---

# 131. AWK Learning Roadmap

## Level 1 — Fundamentals

Master:

```text
awk
$0
$1
$2
$NF
NF
print
-F
```

Practice:

```bash
awk '{print $1}' file
awk '{print $NF}' file
awk '{print NF}' file
```

---

## Level 2 — Filtering

Master:

```text
>
<
>=
<=
==
!=
&&
||
!
~
!~
```

Practice:

```bash
awk '$3 > 50000' file
awk '$2 >= 18 && $3 > 50000' file
```

---

## Level 3 — Processing

Master:

```text
variables
arithmetic
if
else
for
while
printf
BEGIN
END
```

Build:

```text
salary calculator
marks calculator
report generator
```

---

## Level 4 — Arrays

Master:

```text
counting
grouping
frequency
duplicates
lookup tables
```

Build:

```text
log analyzer
IP counter
department analyzer
```

---

## Level 5 — Advanced

Master:

```text
NR
FNR
FILENAME
ARGV
ARGC
-v
next
nextfile
getline
functions
match
split
sub
gsub
```

Build:

```text
log analysis tool
CSV processor
multi-file report generator
file join utility
```

---

# 132. Interview Questions

### Q1. What is AWK?

AWK is a pattern-scanning and text-processing language used primarily for processing structured text and generating reports.

---

### Q2. What does `$0` represent?

The entire current input record.

---

### Q3. What does `$1` represent?

The first field of the current record.

---

### Q4. What does `$NF` represent?

The last field of the current record.

---

### Q5. What is `NF`?

Number of fields in the current record.

---

### Q6. Difference between `NR` and `FNR`?

```text
NR  → record number across all input files
FNR → record number within the current file
```

---

### Q7. What is `FS`?

Input field separator.

---

### Q8. What is `OFS`?

Output field separator.

---

### Q9. What is `RS`?

Input record separator.

---

### Q10. What is `ORS`?

Output record separator.

---

### Q11. What is `BEGIN`?

A block executed before processing input records.

---

### Q12. What is `END`?

A block executed after all input records have been processed.

---

### Q13. What does `~` mean?

Regular-expression matching.

Example:

```bash
$1 ~ /^A/
```

---

### Q14. What does `!~` mean?

Does not match the regular expression.

---

### Q15. Why is `FNR == NR` important?

It is commonly used to identify records belonging to the first input file when processing multiple files.

---

### Q16. How do you pass variables to AWK?

Using:

```bash
-v variable=value
```

Example:

```bash
awk -v limit=100 '$3 > limit' file
```

---

### Q17. How do you count occurrences?

Using an associative array:

```bash
count[$1]++
```

---

### Q18. What is the difference between `sub()` and `gsub()`?

```text
sub()  → replaces first matching occurrence
gsub() → replaces all matching occurrences
```

---

### Q19. What is `next`?

Stops processing the current record and immediately moves to the next record.

---

### Q20. What is `getline`?

It explicitly reads another input record or input stream.

---

# 133. Final AWK Cheat Sheet

```text
=========================================================
                    AWK CHEAT SHEET
=========================================================

BASIC
awk '{print}' file
awk '{print $0}' file
awk '{print $1}' file
awk '{print $1,$3}' file

FIELDS
$0      Entire record
$1      First field
$2      Second field
$NF     Last field
$(NF-1) Second-last field
NF      Number of fields

RECORDS
NR      Global record number
FNR     Record number in current file
FILENAME Current filename

SEPARATORS
FS      Input field separator
OFS     Output field separator
RS      Input record separator
ORS     Output record separator

FILTERING
$3 > 10
$3 < 10
$3 >= 10
$3 <= 10
$3 == 10
$3 != 10

LOGICAL
&&      AND
||      OR
!       NOT

REGEX
/pattern/
$1 ~ /pattern/
$1 !~ /pattern/

STRUCTURE
BEGIN { }
{ }
END { }

CONTROL
if
else
for
while
next
nextfile
exit

ARRAY
count[$1]++
if (x in array)
delete array[x]

STRINGS
length()
tolower()
toupper()
substr()
index()
split()
sub()
gsub()
match()
sprintf()

NUMERIC
int()
sqrt()
log()
exp()
rand()
srand()

FILES
FILENAME
NR
FNR
ARGV
ARGC

VARIABLES
-v name=value

COMMON PATTERNS
NR > 1
NR == 1
FNR == 1
FNR == NR
NF > 0
$NF
$(NF-1)

SUM
{sum += $3} END {print sum}

AVERAGE
{sum += $3; n++} END {print sum/n}

COUNT
{count++} END {print count}

FREQUENCY
{count[$1]++}
END {
    for (x in count)
        print x,count[x]
}

MAX
NR==1 || $3>max {max=$3}

MIN
NR==1 || $3<min {min=$3}

CSV
awk -F',' '{print $1,$2}' file.csv

JOIN
FNR==NR {a[$1]=$2; next}
{print $1,a[$1]}

=========================================================
```

# 134. What You Should Practice

For strong AWK proficiency, don't just memorize commands. Build these **10 mini-projects**:

1. **Employee Salary Analyzer**

   * total salary
   * average salary
   * maximum salary
   * minimum salary

2. **CSV Converter**

   * CSV → TSV
   * TSV → CSV
   * custom separators

3. **Log Analyzer**

   * count errors
   * count warnings
   * count status codes

4. **IP Analyzer**

   * count requests/IP
   * identify top IP
   * identify suspicious IPs

5. **Disk Monitor**

   * parse `df`
   * detect >80%
   * generate warning

6. **Process Monitor**

   * parse `ps`
   * detect high CPU
   * detect high memory

7. **Department Analyzer**

   * total salary by department
   * average salary
   * highest-paid employee

8. **Duplicate Detector**

   * duplicate lines
   * unique lines
   * frequency

9. **Two-File Join**

   * understand `FNR == NR`
   * build lookup arrays
   * combine datasets

10. **Production Log Report**

* total requests
* 2xx/3xx/4xx/5xx
* top IP
* most requested endpoint
* error percentage
* formatted report

---

# 135. The Most Important AWK Pattern to Remember

If you remember only one advanced pattern, remember this:

```bash
awk '
FNR == NR {
    lookup[$1] = $2
    next
}
{
    print $1, lookup[$1]
}
' file1 file2
```

It teaches several important AWK concepts simultaneously:

```text
FNR
NR
multiple files
arrays
lookup tables
next
$1
$2
```

And if you remember one basic pattern:

```bash
awk '$condition {action}' file
```

Everything else builds on this.

---

# 136. Final Mental Map

```text
                         AWK
                          │
             ┌────────────┴────────────┐
             │                         │
          PATTERN                   ACTION
             │                         │
     ┌───────┼────────┐       ┌────────┼─────────┐
     │       │        │       │        │         │
 comparison regex   range   print    printf   calculations
     │       │                │
     │       │                ├── $0
     │       │                ├── $1
     │       │                ├── $NF
     │       │                └── NF
     │       │
     └───────┴─────────────────────────────┐
                                           │
                                     DATA PROCESSING
                                           │
                              ┌────────────┼────────────┐
                              │            │            │
                           Variables     Arrays      Functions
                              │            │            │
                           sum/count    frequency    custom logic
                              │            │
                              └──────┬─────┘
                                     │
                               BEGIN / END
                                     │
                            ┌────────┴────────┐
                            │                 │
                         Input            Output
                            │                 │
                       FS / RS          OFS / ORS
                            │
                   ┌────────┴────────┐
                   │                 │
                  NR                FNR
                   │                 │
             all records       current file
                   │                 │
                   └────────┬────────┘
                            │
                       ADVANCED AWK
                            │
              ┌─────────────┼──────────────┐
              │             │              │
            Joins        Log Analysis    Automation
              │             │              │
         FNR == NR       arrays         system()
         lookup          regex          exit
         multiple files  grouping       ENVIRON
```

**Best order to study:** `awk syntax → fields → FS/OFS → patterns → regex → BEGIN/END → variables → conditions → loops → arrays → functions → NR/FNR → multiple files → joins → log analysis → advanced functions`.
