const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    collegeTimings: {
        startTime: { type: String, default: '09:00' },
        endTime: { type: String, default: '16:30' },
        periodDuration: { type: Number, default: 45 }, // in minutes
        breakDuration: { type: Number, default: 0 },   // in minutes
        lunchStart: { type: String, default: '12:00' },
        lunchDuration: { type: Number, default: 90 }, // in minutes
    },
    subjects: [{
        type: String
    }],
    // For easy check if setup is done
    isSetupComplete: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', UserSchema);
