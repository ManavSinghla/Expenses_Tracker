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

## Database Schema (Mongoose)

### User
- \`_id\`: ObjectId
- \`name\`: String
- \`email\`: String (Optional)
- \`createdAt\`: Date

### Group
- \`_id\`: ObjectId
- \`name\`: String
- \`members\`: Array [{ \`user\`: ObjectId, \`joinedAt\`: Date, \`leftAt\`: Date }]
- \`createdBy\`: ObjectId

### Expense
- \`_id\`: ObjectId
- \`group\`: ObjectId
- \`date\`: Date
- \`description\`: String
- \`paidBy\`: ObjectId
- \`amount\`: Number
- \`currency\`: String
- \`originalAmount\`: Number
- \`splitType\`: Enum ['equal', 'exact', 'percentage', 'share']
- \`splits\`: Array [{ \`user\`: ObjectId, \`amount\`: Number, \`percentage\`: Number, \`share\`: Number }]
- \`notes\`: String

### Settlement
- \`_id\`: ObjectId
- \`group\`: ObjectId
- \`date\`: Date
- \`paidBy\`: ObjectId
- \`paidTo\`: ObjectId
- \`amount\`: Number
- \`notes\`: String
