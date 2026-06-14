# Scope & Database Schema

## Anomaly Log (expenses_export.csv)

1. **Line 13 (Empty `paid_by`)**: Handled by defaulting to 'System/Unknown'.
2. **Date Formats**: Inconsistent formats (`YYYY-MM-DD`, `DD/MM/YYYY`, `MMM DD`). Normalized to ISO 8601.
3. **Inconsistent Names**: `priya`, `Priya S`, `rohan ` standardized to `Priya`, `Rohan`.
4. **Number Formats**: Line 7 has commas (`"1,200"`). Commas stripped.
5. **Settlement**: Line 14 identified as a settlement rather than an expense.
6. **Percentages != 100%**: Lines 15 & 32. Percentages proportionally scaled to 100%.
7. **Currencies**: USD detected. Converted to INR using fixed rate (1 USD = 83 INR).
8. **Duplicate Entries**: Lines 5/6 and 24/25. Flagged for review to allow user approval (Meera's request).
9. **Negative Amount**: Line 26 (`-30`). Handled as a refund.
10. **Missing Currency**: Line 28. Defaulted to INR.
11. **Trailing Spaces in Amount**: Line 29 (` 1450 `). Trimmed before parsing.
12. **Zero Amount**: Line 31 (`0`). Ignored/Skipped.
13. **Ambiguous Date**: Line 34 (`04/05/2026`). Inferred as May 4 (DD/MM/YYYY) based on surrounding chronological structure.
14. **Old Member in Split**: Line 36. Handled via Group model tracking `leftAt` dates.
15. **Conflicting Split Type**: Line 42 (Equal vs Shares). Shares prioritized.

## Database Schema (PostgreSQL)

### Users Table
- \`id\`: UUID (PK)
- \`name\`: VARCHAR
- \`email\`: VARCHAR (Nullable)
- \`createdAt\`: TIMESTAMP
- \`updatedAt\`: TIMESTAMP

### Groups Table
- \`id\`: UUID (PK)
- \`name\`: VARCHAR
- \`createdById\`: UUID (FK -> Users.id)
- \`createdAt\`: TIMESTAMP
- \`updatedAt\`: TIMESTAMP

### GroupMembers Table
- \`groupId\`: UUID (FK -> Groups.id)
- \`userId\`: UUID (FK -> Users.id)
- \`joinedAt\`: TIMESTAMP
- \`leftAt\`: TIMESTAMP

### Expenses Table
- \`id\`: UUID (PK)
- \`groupId\`: UUID (FK -> Groups.id)
- \`date\`: TIMESTAMP
- \`description\`: VARCHAR
- \`paidById\`: UUID (FK -> Users.id)
- \`amount\`: DECIMAL(10, 2)
- \`currency\`: VARCHAR (Default 'INR')
- \`originalAmount\`: DECIMAL(10, 2) (Nullable)
- \`splitType\`: ENUM ('equal', 'exact', 'percentage', 'share')
- \`notes\`: TEXT (Nullable)
- \`createdAt\`: TIMESTAMP
- \`updatedAt\`: TIMESTAMP

### ExpenseSplits Table
- \`id\`: UUID (PK)
- \`expenseId\`: UUID (FK -> Expenses.id)
- \`userId\`: UUID (FK -> Users.id)
- \`amount\`: DECIMAL(10, 2)
- \`percentage\`: DECIMAL(5, 2) (Nullable)
- \`share\`: DECIMAL(10, 2) (Nullable)

### Settlements Table
- \`id\`: UUID (PK)
- \`groupId\`: UUID (FK -> Groups.id) (Nullable)
- \`date\`: TIMESTAMP
- \`paidById\`: UUID (FK -> Users.id)
- \`paidToId\`: UUID (FK -> Users.id)
- \`amount\`: DECIMAL(10, 2)
- \`notes\`: TEXT (Nullable)
- \`createdAt\`: TIMESTAMP
- \`updatedAt\`: TIMESTAMP
