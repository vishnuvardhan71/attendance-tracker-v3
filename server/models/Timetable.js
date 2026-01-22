const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Configuration settings
    config: {
        startTime: String,
        endTime: String,
        periodDuration: Number,
        lunchStart: String,
        lunchDuration: Number,
        subjects: [String]
    },
    // Map days to an array of slots
    // e.g., Monday: [{ time: "09:00-09:45", type: "Class" || "Free", subject: "Math" }]
    schedule: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    }
});

module.exports = mongoose.model('Timetable', TimetableSchema);
