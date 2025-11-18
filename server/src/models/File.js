import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    repository: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository',
        required: true
    },
    path: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

fileSchema.index({ repository: 1, path: 1 }, { unique: true });

export default mongoose.model('File', fileSchema);
