-- Query from the assessment, as given (ORDER BY added so the output is stable)
SELECT
  customer_id,
  CASE
    WHEN value < 100.0 THEN 'Less than 100'
    WHEN value BETWEEN 100.0 AND 400.0 THEN 'Greater than 100 but less than 500'
    WHEN value BETWEEN 500.0 AND 800.0 THEN 'Greater than 800 but less than 800'
    ELSE 'Value greater than 800'
  END AS value_range,
  COUNT(id) AS customer_order_count,
  SUM(value) AS customer_total
FROM orders
WHERE id <= 10
GROUP BY customer_id, value_range
ORDER BY customer_id, value_range;
