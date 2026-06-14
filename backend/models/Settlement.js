import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: false // Could be global between two people or group-specific
    },
    date: {
        type: Date,
        required: true
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paidTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    notes: String
}, { timestamps: true });

export default mongoose.model('Settlement', settlementSchema);
