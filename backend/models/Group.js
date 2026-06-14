import mongoose from 'mongoose';

const groupMemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    leftAt: {
        type: Date,
        default: null
    }
}, { _id: false });

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    members: [groupMemberSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
