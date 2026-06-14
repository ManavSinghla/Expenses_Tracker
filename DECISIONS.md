# Decisions Log

This document records the significant architectural and product decisions made during the development of the Shared Expenses App.

## 1. Tech Stack Choice
- **Options Considered:** Ruby on Rails (SQL), MERN (MongoDB), PERN (PostgreSQL, Express, React, Node).
- **Decision:** PERN stack (PostgreSQL with Sequelize ORM).
- **Why:** The prompt explicitly stated "Use relational DBs only". While MERN was initially considered due to an add-on request, we adhered strictly to the "relational DBs only" requirement by adopting PostgreSQL.

## 2. Currency Conversion Policy
- **Options Considered:** Live Exchange Rate API vs. Hardcoded Rate.
- **Decision:** Hardcoded conversion (1 USD = 83 INR) at the time of import.
- **Why:** It satisfies Priya's requirement ("half the trip was in dollars") without relying on external third-party API dependencies that could fail or require keys. Both original and converted amounts are stored.

## 3. Handling Duplicate Entries
- **Options Considered:** Silent merge vs. Auto-delete vs. Flag for review.
- **Decision:** Flag for review.
- **Why:** Meera explicitly requested: "I want to approve anything the app deletes or changes." The importer generates an anomaly report that flags potential duplicates but does not automatically delete them.

## 4. Simplified Balances (Aisha's Request)
- **Options Considered:** Track every individual transaction edge vs. Compute net balances and minimize transactions.
- **Decision:** Minimized Cash Flow Algorithm (who owes whom, done).
- **Why:** Aisha requested "just one number per person". The system calculates net balances and provides a simplified graph of who pays whom.

## 5. Settlement Handling
- **Decision:** Treat rows without a `split_type` and with "paid back" as settlements, not expenses.
- **Why:** Standard expenses increase debt, settlements reduce it.

## 6. Time-Bound Memberships
- **Decision:** The Group model tracks `joinedAt` and `leftAt` dates for members.
- **Why:** Sam moved in mid-April, Meera moved out in March. Expenses are only split among members who are active in the group on the expense's `date`.
