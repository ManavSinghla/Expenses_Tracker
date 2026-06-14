import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GroupMember = sequelize.define('GroupMember', {
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  leftAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: false,
});

export default GroupMember;
