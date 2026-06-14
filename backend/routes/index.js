import express from 'express';
import expenseRoutes from './expenses.js';
import groupRoutes from './groups.js';
import userRoutes from './users.js';

const router = express.Router();

router.use('/expenses', expenseRoutes);
router.use('/groups', groupRoutes);
router.use('/users', userRoutes);

export default router;
