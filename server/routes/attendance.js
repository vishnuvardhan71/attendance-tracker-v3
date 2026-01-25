const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const User = require('../models/User');

// Helper to get day name (robust alternative to locale-dependent methods)
const getDayName = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
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
            return res.json({
                formattedDate: date,
                isHoliday: false,
                records: []
            });
        }

        const validSlots = daySchedule
            .filter(slot => slot.time !== 'Lunch Break' && slot.subject)
            .map(slot => ({
                periodTime: slot.time,
                subject: slot.subject,
                status: 'Absent'
            }));

        return res.json({
            formattedDate: date,
            isHoliday: false,
            records: validSlots,
            isNew: true
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
    const { date, isHoliday, records } = req.body;

    try {
        if (!date || isHoliday === undefined || !records) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        let attendance = await Attendance.findOne({ user: req.user.id, formattedDate: date });

        if (attendance) {
            attendance.isHoliday = isHoliday;
            attendance.records = records;
            await attendance.save();
        } else {
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
// @desc    Get attendance statistics using MongoDB Aggregation
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // 1. Fetch aggregation results, timetable, user profile, and first attendance date in parallel
        const [stats, timetable, user, firstRecord] = await Promise.all([
            Attendance.aggregate([
                { $match: { user: userId, isHoliday: false } },
                { $unwind: "$records" },
                { $match: { "records.status": { $ne: "Holiday" } } },
                {
                    $group: {
                        _id: "$records.subject",
                        total: { $sum: 1 },
                        attended: { $sum: { $cond: [{ $eq: ["$records.status", "Present"] }, 1, 0] } }
                    }
                }
            ]),
            Timetable.findOne({ user: req.user.id }),
            User.findById(req.user.id),
            Attendance.findOne({ user: req.user.id }).sort({ date: 1 }) // Find earliest record
        ]);

        const subjectStats = {};
        let totalClasses = 0;
        let attendedClasses = 0;

        // Initialize with all subjects from config
        if (timetable && timetable.config && timetable.config.subjects) {
            timetable.config.subjects.forEach(subject => {
                subjectStats[subject] = { total: 0, attended: 0 };
            });
        }

        // Fill in aggregation results
        stats.forEach(stat => {
            subjectStats[stat._id] = {
                total: stat.total,
                attended: stat.attended
            };
            totalClasses += stat.total;
            attendedClasses += stat.attended;
        });

        // Add initial stats from user profile
        if (user && user.initialStats) {
            totalClasses += user.initialStats.total || 0;
            attendedClasses += user.initialStats.attended || 0;
        }

        const overallPercentage = totalClasses === 0 ? 0 : (attendedClasses / totalClasses) * 100;

        // Determine earliest attendance date from records or fallback to today
        const rawDate = firstRecord ? firstRecord.date : new Date();
        const firstDate = new Date(rawDate).toLocaleDateString('en-GB');

        res.json({
            totalClasses,
            attendedClasses,
            overallPercentage,
            subjectStats,
            firstDate
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
