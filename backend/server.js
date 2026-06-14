import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { sequelize } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL via Sequelize
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL connected successfully via Sequelize');
        
        // Sync models (creates tables if they don't exist in DB)
        // Note: force: false is used so we don't drop existing tables in production
        await sequelize.sync({ force: false });
        console.log('Database synced');
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Shared Expenses API is running with PostgreSQL');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
