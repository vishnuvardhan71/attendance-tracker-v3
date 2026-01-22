const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const User = require('../models/User');

// Helper to get day name
const getDayName = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// @route   GET api/attendance/date/:date
// @desc    Get attendance for a specific date (or generate from timetable)
// @access  Private
router.get('/date/:date', auth, async (req, res) => {
    try {
        const { date } = req.params; // YYYY-MM-DD
        const dayName = getDayName(date);

        // 1. Check if record exists
        let attendance = await Attendance.findOne({ user: req.user.id, formattedDate: date });

        if (attendance) {
            return res.json(attendance);
        }

        // 2. If no record, fetch user timetable to generate preview
        const timetable = await Timetable.findOne({ user: req.user.id });
        if (!timetable) {
            return res.status(404).json({ msg: 'Timetable not set up' });
        }

        const daySchedule = timetable.schedule[dayName];

        if (!daySchedule || daySchedule.length === 0) {
            // It might be a weekend or no classes
            return res.json({
                formattedDate: date,
                isHoliday: false,
                records: []
            });
        }

        // Filter out free periods if you want, or keep them to show gaps
        // The requirement says "Skip lunch break slot". Lunch is likely handled in frontend rendering or configuration, 
        // but if it's in the timetable slots, we filter here.
        // Assuming timetable slots have a type.

        const validSlots = daySchedule.map(slot => ({
            periodTime: slot.time,
            subject: slot.subject,
            status: 'Absent' // Default status for new day
        }));

        return res.json({
            formattedDate: date,
            isHoliday: false,
            records: validSlots,
            isNew: true // Flag to tell frontend this is generated
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   POST api/attendance
// @desc    Save/Mark attendance for a date
// @access  Private
router.post('/', auth, async (req, res) => {
    const { date, isHoliday, records } = req.body; // date is YYYY-MM-DD string

    try {
        let attendance = await Attendance.findOne({ user: req.user.id, formattedDate: date });

        if (attendance) {
            // Update
            attendance.isHoliday = isHoliday;
            attendance.records = records;
            await attendance.save();
        } else {
            // Create
            attendance = new Attendance({
                user: req.user.id,
                date: new Date(date),
                formattedDate: date,
                isHoliday,
                records
            });
            await attendance.save();
        }

        res.json(attendance);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/attendance/stats
// @desc    Get attendance statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const allAttendance = await Attendance.find({ user: req.user.id });
        const timetable = await Timetable.findOne({ user: req.user.id });

        let totalClasses = 0;
        let attendedClasses = 0;
        const subjectStats = {};

        // 1. Initialize subjectStats with all subjects from timetable configuration
        if (timetable && timetable.config && timetable.config.subjects) {
            timetable.config.subjects.forEach(subject => {
                subjectStats[subject] = { total: 0, attended: 0 };
            });
        }

        // 2. Aggregate attendance from all marked records
        allAttendance.forEach(day => {
            if (day.isHoliday) return; // Skip holidays

            day.records.forEach(record => {
                // Ensure subject entry exists
                if (!subjectStats[record.subject]) {
                    subjectStats[record.subject] = { total: 0, attended: 0 };
                }

                // Only count if status is not Holiday
                if (record.status !== 'Holiday') {
                    subjectStats[record.subject].total++;
                    totalClasses++;

                    if (record.status === 'Present') {
                        subjectStats[record.subject].attended++;
                        attendedClasses++;
                    }
                }
            });
        });

        const overallPercentage = totalClasses === 0 ? 0 : (attendedClasses / totalClasses) * 100;

        res.json({
            totalClasses,
            attendedClasses,
            overallPercentage,
            subjectStats
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
