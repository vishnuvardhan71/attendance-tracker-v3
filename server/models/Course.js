const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    year: {
        type: String, // e.g., "1", "2", "3", "4"
        required: true
    },
    semester: {
        type: String, // e.g., "1" to "8"
        required: true
    },
    index: {
        type: Number, // 0 or 1
        default: 0
    },
    isSetupComplete: {
        type: Boolean,
        default: false
    },
    initialStats: {
        total: { type: Number, default: 0 },
        attended: { type: Number, default: 0 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index to ensure unique course names per user? Optional, but good practice.
CourseSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Course', CourseSchema);
