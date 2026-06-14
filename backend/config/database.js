import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/expenses_app', {
  dialect: 'postgres',
  logging: false, // Set to console.log to see SQL queries
});

export default sequelize;
