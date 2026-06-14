import sequelize from '../config/database.js';
import User from './User.js';
import Group from './Group.js';
import GroupMember from './GroupMember.js';
import Expense from './Expense.js';
import ExpenseSplit from './ExpenseSplit.js';
import Settlement from './Settlement.js';

// --- Associations ---

// Group & User (Created By)
Group.belongsTo(User, { as: 'creator', foreignKey: 'createdById' });
User.hasMany(Group, { foreignKey: 'createdById' });

// Group & User (Members - Many to Many via GroupMember)
Group.belongsToMany(User, { through: GroupMember, as: 'members', foreignKey: 'groupId' });
User.belongsToMany(Group, { through: GroupMember, as: 'groups', foreignKey: 'userId' });

// Expense Associations
Expense.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(Expense, { foreignKey: 'groupId' });

Expense.belongsTo(User, { as: 'payer', foreignKey: 'paidById' });
User.hasMany(Expense, { foreignKey: 'paidById' });

// Expense Splits
Expense.hasMany(ExpenseSplit, { foreignKey: 'expenseId', as: 'splits' });
ExpenseSplit.belongsTo(Expense, { foreignKey: 'expenseId' });

ExpenseSplit.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ExpenseSplit, { foreignKey: 'userId' });

// Settlement Associations
Settlement.belongsTo(Group, { foreignKey: 'groupId' });
Group.hasMany(Settlement, { foreignKey: 'groupId' });

Settlement.belongsTo(User, { as: 'payer', foreignKey: 'paidById' });
Settlement.belongsTo(User, { as: 'receiver', foreignKey: 'paidToId' });
User.hasMany(Settlement, { as: 'paymentsMade', foreignKey: 'paidById' });
User.hasMany(Settlement, { as: 'paymentsReceived', foreignKey: 'paidToId' });

export {
  sequelize,
  User,
  Group,
  GroupMember,
  Expense,
  ExpenseSplit,
  Settlement
};
