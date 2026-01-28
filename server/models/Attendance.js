const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    date: {
        type: Date,
        required: true
    },
    formattedDate: { // "YYYY-MM-DD" for easy querying
        type: String,
        required: true
    },
    isHoliday: {
        type: Boolean,
        default: false
    },
    overallStatus: { // Optional: 'Present', 'Absent', 'Holiday'
        type: String
    },
    records: [{
        periodTime: String,
        subject: String,
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Holiday'],
            default: 'Absent'
        }
    }]
});

// Compound index to ensure one record per user per date per course
AttendanceSchema.index({ user: 1, formattedDate: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
