import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number, // Computed exact amount for this user
        required: true
    },
    // Optional details for specific split types
    percentage: Number,
    share: Number
}, { _id: false });

const expenseSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    originalAmount: Number, // If currency was USD
    splitType: {
        type: String,
        enum: ['equal', 'exact', 'percentage', 'share'],
        required: true
    },
    splits: [splitSchema],
    notes: String
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
