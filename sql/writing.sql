-- 1. Order items required by 20 November 2022 (on or before)
SELECT oi.*
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
WHERE o.required_by_date <= '2022-11-20';

-- 2. Number of order items priced at 100.0 or more
SELECT COUNT(*) AS item_count
FROM order_items
WHERE price_each >= 100.0;

-- 3. Total price of the items in order 50
SELECT SUM(price_each * qty) AS order_total
FROM order_items
WHERE order_id = 50;
