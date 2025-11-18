import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    stars: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    forks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Repository'
    }],
    language: {
        type: String,
        default: ''
    },
    topics: [{
        type: String
    }]
}, {
    timestamps: true
});

repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

export default mongoose.model('Repository', repositorySchema);
