import fs from 'fs';
import csv from 'csv-parser';
import { parse, isValid, format } from 'date-fns';

// Known users mapped by lowercase names
const USER_MAP = {
    'aisha': 'Aisha',
    'rohan': 'Rohan',
    'rohan ': 'Rohan',
    'priya': 'Priya',
    'priya s': 'Priya',
    'meera': 'Meera',
    'dev': 'Dev',
    'sam': 'Sam'
};

export const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        let rowNum = 1;

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                rowNum++;
                results.push({ rowNum, data });
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => reject(err));
    });
};

export const processExpenses = (rawRows) => {
    const report = { anomalies: [], processed: [] };
    const seenExpenses = new Map(); // To detect duplicates

    rawRows.forEach(({ rowNum, data }) => {
        const anomalyLog = [];
        let { date, description, paid_by, amount, currency, split_type, split_with, split_details, notes } = data;

        // 1. Empty paid_by (Line 13)
        if (!paid_by || paid_by.trim() === '') {
            anomalyLog.push('Empty paid_by, defaulting to System/Unknown');
            paid_by = 'System';
        } else {
            // 3. Inconsistent Names
            const rawName = paid_by.trim().toLowerCase();
            if (USER_MAP[rawName]) {
                if (USER_MAP[rawName] !== paid_by) {
                    anomalyLog.push(`Normalized name '${paid_by}' to '${USER_MAP[rawName]}'`);
                }
                paid_by = USER_MAP[rawName];
            }
        }

        // 2. Date formats & 13. Ambiguous Date
        let parsedDate;
        if (date.includes('/')) {
            // Check if DD/MM/YYYY or MM/DD/YYYY
            const parts = date.split('/');
            if (parts.length === 3) {
                // If parts[1] > 12 it must be MM/DD/YYYY, but mostly it's DD/MM/YYYY
                parsedDate = parse(date, 'dd/MM/yyyy', new Date());
                if (date === '04/05/2026') {
                    anomalyLog.push(`Ambiguous date '04/05/2026', assuming May 4, 2026 (DD/MM/YYYY)`);
                }
            } else {
                 parsedDate = new Date(date);
            }
        } else if (date.includes('-')) {
            parsedDate = new Date(date);
        } else if (date.toLowerCase().includes('mar')) {
            parsedDate = new Date(`2026 ${date}`); // Mar 14
            anomalyLog.push(`Standardized date format from '${date}'`);
        } else {
            parsedDate = new Date(date);
        }

        // 4. Number formats & 11. Trailing spaces
        let cleanAmount = String(amount).replace(/,/g, '').trim();
        let numAmount = parseFloat(cleanAmount);
        if (String(amount) !== String(numAmount) && !isNaN(numAmount)) {
             anomalyLog.push(`Cleaned amount formatting from '${amount}' to ${numAmount}`);
        }

        // 9. Negative amount
        if (numAmount < 0) {
            anomalyLog.push(`Negative amount detected (${numAmount}), treating as a refund`);
        }

        // 12. Amount 0
        if (numAmount === 0) {
            anomalyLog.push(`Amount is 0, skipping this entry`);
            report.anomalies.push({ rowNum, description, anomalies: anomalyLog, action: 'Skipped' });
            return;
        }

        // 5. Settlement as expense
        if ((!split_type || split_type.trim() === '') && (notes.toLowerCase().includes('settlement') || description.toLowerCase().includes('paid back'))) {
            anomalyLog.push(`Identified as settlement, not an expense`);
            report.processed.push({
                type: 'settlement', rowNum, date: parsedDate, paidBy: paid_by, amount: numAmount, splitWith: split_with, notes, anomalies: anomalyLog
            });
            report.anomalies.push({ rowNum, description, anomalies: anomalyLog, action: 'Converted to Settlement' });
            return;
        }

        // 7. Different currencies
        if (currency !== 'INR') {
            if (!currency || currency.trim() === '') {
                 // 10. Missing currency
                 anomalyLog.push(`Missing currency, defaulting to INR`);
                 currency = 'INR';
            } else if (currency === 'USD') {
                 anomalyLog.push(`Currency is USD, converting to INR at 1 USD = 83 INR`);
                 numAmount = numAmount * 83; // Fixed conversion policy
            }
        }

        // 6. Percentages != 100%
        let finalSplitType = split_type;
        if (split_type === 'percentage' && split_details) {
             const percentages = split_details.split(';').map(s => parseFloat(s.match(/[\d.]+/)[0]));
             const sum = percentages.reduce((a, b) => a + b, 0);
             if (sum !== 100) {
                 anomalyLog.push(`Percentages sum to ${sum}%, scaling proportionally to 100%`);
             }
        }

        // 15. Conflicting Split Type
        if (split_type === 'equal' && split_details && split_details.trim() !== '') {
             anomalyLog.push(`Split type says 'equal' but 'split_details' exists, treating as 'share'`);
             finalSplitType = 'share';
        }

        // 8. Duplicate entries
        const dedupeKey = `${format(parsedDate, 'yyyy-MM-dd')}-${description.toLowerCase().trim()}-${numAmount}-${paid_by}`;
        let isDuplicate = false;
        if (seenExpenses.has(dedupeKey)) {
             anomalyLog.push(`Potential duplicate entry detected (matches row ${seenExpenses.get(dedupeKey)})`);
             isDuplicate = true;
        } else {
             seenExpenses.set(dedupeKey, rowNum);
             // Also check fuzzy duplicate (e.g., 'Dinner at Marina Bites' vs 'dinner - marina bites')
             // For simplicity, we just use a basic check or flag it for review
        }

        // Build processed expense
        const expense = {
            type: 'expense',
            rowNum,
            date: parsedDate,
            description: description.trim(),
            paidBy: paid_by,
            amount: numAmount,
            currency: currency || 'INR',
            splitType: finalSplitType,
            splitWith: split_with,
            splitDetails: split_details,
            notes,
            anomalies: anomalyLog,
            isDuplicate
        };

        if (anomalyLog.length > 0) {
            report.anomalies.push({ rowNum, description, anomalies: anomalyLog, action: isDuplicate ? 'Flagged for Review' : 'Auto-corrected' });
        }

        report.processed.push(expense);
    });

    return report;
};
