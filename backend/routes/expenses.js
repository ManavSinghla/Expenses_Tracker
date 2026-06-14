import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { parseCSV, processExpenses } from '../utils/csvImporter.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/expenses/import
// Reads the CSV, parses anomalies, and returns the report
router.post('/import', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const rawRows = await parseCSV(req.file.path);
        const report = processExpenses(rawRows);

        // Clean up the uploaded file
        fs.unlinkSync(req.file.path);

        res.json(report);
    } catch (error) {
        console.error('Error importing CSV:', error);
        res.status(500).json({ error: 'Failed to process CSV' });
    }
});

// We would also need an endpoint to confirm the import after user reviews anomalies
router.post('/confirm-import', async (req, res) => {
    // Save to DB logic here
    res.json({ message: 'Import confirmed' });
});

export default router;
