# SQL

## Reading SQL

### 1. Which RDBMSs have you worked with?

MySQL, Microsoft SQL Server and SQLite.

### 2. What is DML and how does it differ from DDL?

DML (Data Manipulation Language) works with the data in tables: `SELECT`, `INSERT`, `UPDATE`, `DELETE`.

DDL (Data Definition Language) works with the structure of the database itself: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`. For example `ALTER TABLE orders ADD COLUMN currency` is DDL, `UPDATE orders SET value = 10 WHERE id = 1` is DML.

Another difference is that DML changes can usually be rolled back inside a transaction. In a lot of databases (MySQL and Oracle for example) DDL commits straight away.

### 3. Output of the query

First I worked out which CASE branch each row falls into:

| id | customer_id | value | value_range |
|----|-------------|-------|-------------|
| 1 | 1 | 318.99 | Greater than 100 but less than 500 |
| 2 | 1 | 349.43 | Greater than 100 but less than 500 |
| 3 | 2 | 264.26 | Greater than 100 but less than 500 |
| 4 | 2 | 728.94 | Greater than 800 but less than 800 |
| 5 | 3 | 374.94 | Greater than 100 but less than 500 |
| 6 | 1 | 808.54 | Value greater than 800 |
| 7 | 1 | 529.89 | Greater than 800 but less than 800 |
| 8 | 2 | 612.48 | Greater than 800 but less than 800 |
| 9 | 3 | 326.13 | Greater than 100 but less than 500 |
| 10 | 3 | 869.07 | Value greater than 800 |

Then grouped by customer and range:

| customer_id | value_range | customer_order_count | customer_total |
|-------------|-------------|----------------------|----------------|
| 1 | Greater than 100 but less than 500 | 2 | 668.42 |
| 1 | Greater than 800 but less than 800 | 1 | 529.89 |
| 1 | Value greater than 800 | 1 | 808.54 |
| 2 | Greater than 100 but less than 500 | 1 | 264.26 |
| 2 | Greater than 800 but less than 800 | 2 | 1341.42 |
| 3 | Greater than 100 but less than 500 | 2 | 701.07 |
| 3 | Value greater than 800 | 1 | 869.07 |

There's no `ORDER BY`, so the rows could come back in any order. I've sorted them here to make it easier to read.

I checked this by loading the data into SQLite: `cd sql && python verify.py`.

### 4. Improvements

- The labels don't match the conditions. `BETWEEN 100 AND 400` is labelled "less than 500", and `BETWEEN 500 AND 800` is labelled "Greater than 800 but less than 800".
- Nothing covers 400 to 500. A value of 450 would drop into the ELSE and be labelled "Value greater than 800".
- `BETWEEN` includes both ends, so it's easy to get overlaps or gaps at the boundaries. `>=` and `<` are clearer.
- Add an `ORDER BY` so the output is in a predictable order.
- `GROUP BY value_range` (using the alias) works in MySQL, PostgreSQL and SQLite but not in SQL Server. There you'd repeat the CASE in the GROUP BY or use a subquery.

My version:

```sql
SELECT
  customer_id,
  CASE
    WHEN value < 100 THEN 'Less than 100'
    WHEN value < 500 THEN '100 to 499.99'
    WHEN value < 800 THEN '500 to 799.99'
    ELSE '800 and over'
  END AS value_range,
  COUNT(id) AS customer_order_count,
  SUM(value) AS customer_total
FROM orders
GROUP BY customer_id, value_range
ORDER BY customer_id, value_range;
```

CASE stops at the first match, so each branch only needs the upper limit.

## Writing SQL

### 1. Order items required by 20 November 2022

I've taken "required by" to mean on or before that date.

```sql
SELECT oi.*
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.required_by_date <= '2022-11-20';
```

If `required_by_date` is a datetime and not just a date, I'd use `< '2022-11-21'` so times later on the 20th are still included.

### 2. Number of order items priced at 100.0 or more

```sql
SELECT COUNT(*) AS item_count
FROM order_items
WHERE price_each >= 100.0;
```

### 3. Total price of the items in order 50

```sql
SELECT SUM(price_each * qty) AS order_total
FROM order_items
WHERE order_id = 50;
```
