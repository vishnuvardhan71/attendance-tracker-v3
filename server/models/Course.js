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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index to ensure unique course names per user? Optional, but good practice.
CourseSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Course', CourseSchema);
