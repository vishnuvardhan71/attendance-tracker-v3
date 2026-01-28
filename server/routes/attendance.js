const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const Course = require('../models/Course');

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
        const { courseId } = req.query;

        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ msg: 'Valid courseId is required' });
        }

        const dayName = getDayName(date);

        // 1. Check if record exists
        let attendance = await Attendance.findOne({ user: req.user.id, formattedDate: date, course: courseId });

        if (attendance) {
            return res.json(attendance);
        }

        // 2. If no record, fetch course timetable to generate preview
        const timetable = await Timetable.findOne({ user: req.user.id, course: courseId });
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
    const { date, isHoliday, records, courseId } = req.body;

    try {
        if (!date || isHoliday === undefined || !records || !courseId) {
            return res.status(400).json({ msg: 'Please provide all required fields including courseId' });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            console.error(`Invalid courseId in POST: ${courseId}`);
            return res.status(400).json({ msg: 'Valid courseId is required' });
        }

        let attendance = await Attendance.findOne({ user: req.user.id, formattedDate: date, course: courseId });

        if (attendance) {
            attendance.isHoliday = isHoliday;
            attendance.records = records;
            if (courseId) attendance.course = courseId; // Update course association if provided
            await attendance.save();
        } else {
            attendance = new Attendance({
                user: req.user.id,
                course: courseId, // Link to course
                date: new Date(date),
                formattedDate: date,
                isHoliday,
                records
            });
            await attendance.save();
        }

        res.json(attendance);
    } catch (err) {
        console.error('Attendance Save Error:', err);
        res.status(500).json({ msg: `Server Error: ${err.message}` });
    }
});

// @route   GET api/attendance/stats
// @desc    Get attendance statistics using MongoDB Aggregation
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const { courseId } = req.query;
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ msg: 'Valid courseId is required' });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id);
        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        // 1. Fetch aggregation results, timetable, course, and first attendance record
        const [stats, timetable, course, firstRecord] = await Promise.all([
            Attendance.aggregate([
                { $match: { user: userId, course: courseObjectId, isHoliday: false } },
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
            Timetable.findOne({ user: req.user.id, course: courseId }),
            Course.findById(courseId),
            Attendance.findOne({ user: req.user.id, course: courseId }).sort({ date: 1 }) // Find earliest record
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

        // Add initial stats from course profile
        if (course && course.initialStats) {
            totalClasses += course.initialStats.total || 0;
            attendedClasses += course.initialStats.attended || 0;
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
