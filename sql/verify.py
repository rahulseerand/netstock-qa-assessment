# Loads the sample data into an in-memory SQLite db and runs my queries against it.
import sqlite3
from pathlib import Path

HERE = Path(__file__).parent


def split_statements(sql_text):
    statements = []
    for chunk in sql_text.split(";"):
        lines = [l for l in chunk.splitlines() if l.strip() and not l.strip().startswith("--")]
        if lines:
            statements.append("\n".join(lines))
    return statements


def main():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    conn.executescript((HERE / "schema_and_data.sql").read_text())

    print("Reading query:")
    for row in conn.execute((HERE / "reading.sql").read_text()):
        print(f"  {row['customer_id']} | {row['value_range']} | "
              f"{row['customer_order_count']} | {row['customer_total']:.2f}")

    print("\nWriting queries:")
    for stmt in split_statements((HERE / "writing.sql").read_text()):
        print("\n" + stmt)
        for row in conn.execute(stmt):
            print("  ", dict(row))

    conn.close()


if __name__ == "__main__":
    main()
