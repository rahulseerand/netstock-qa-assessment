-- Sample data from the assessment, plus a few made-up order_items rows for the writing questions
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  value REAL NOT NULL,
  order_date TEXT,
  required_by_date TEXT
);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL,
  stock_id INTEGER NOT NULL,
  price_each REAL NOT NULL,
  qty INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

INSERT INTO orders (id, customer_id, value) VALUES
  (1, 1, 318.99),
  (2, 1, 349.43),
  (3, 2, 264.26),
  (4, 2, 728.94),
  (5, 3, 374.94),
  (6, 1, 808.54),
  (7, 1, 529.89),
  (8, 2, 612.48),
  (9, 3, 326.13),
  (10, 3, 869.07);

-- test rows for the writing questions
INSERT INTO orders (id, customer_id, value, order_date, required_by_date) VALUES
  (50, 9, 0, '2022-11-01', '2022-11-18');

INSERT INTO order_items (id, order_id, stock_id, price_each, qty) VALUES
  (1, 50, 100, 120.00, 2),
  (2, 50, 101, 45.50, 3),
  (3, 1, 100, 99.99, 1),
  (4, 2, 102, 150.00, 1);
