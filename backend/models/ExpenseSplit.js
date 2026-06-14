import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ExpenseSplit = sequelize.define('ExpenseSplit', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  percentage: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  share: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  }
}, {
  timestamps: false,
});

export default ExpenseSplit;
