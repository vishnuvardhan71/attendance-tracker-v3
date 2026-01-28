const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const Course = require('../models/Course');

// @route   POST api/timetable/config
// @desc    Save timetable configuration
// @access  Private
router.post('/config', auth, async (req, res) => {
    try {
        const configData = req.body;
        const { courseId } = configData;

        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Valid courseId is required' });
        }

        let timetable = await Timetable.findOne({ user: req.user.id, course: courseId });

        if (timetable) {
            // Update existing configuration
            timetable.schedule = configData.timetable || {};
            timetable.config = {
                startTime: configData.startTime,
                endTime: configData.endTime,
                periodDuration: configData.periodDuration,
                lunchStart: configData.lunchStart,
                lunchDuration: configData.lunchDuration,
                subjects: configData.subjects
            };
            await timetable.save();
        } else {
            timetable = new Timetable({
                user: req.user.id,
                course: courseId,
                schedule: configData.timetable || {},
                config: {
                    startTime: configData.startTime,
                    endTime: configData.endTime,
                    periodDuration: configData.periodDuration,
                    lunchStart: configData.lunchStart,
                    lunchDuration: configData.lunchDuration,
                    subjects: configData.subjects
                }
            });
            await timetable.save();
        }

        // Mark setup as complete for this course
        if (courseId) {
            await Course.findByIdAndUpdate(courseId, { isSetupComplete: true });
        }

        res.json({ message: 'Configuration saved successfully', timetable });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET api/timetable/config
// @desc    Get timetable configuration
// @access  Private
router.get('/config', auth, async (req, res) => {
    try {
        const { courseId } = req.query;
        if (!courseId) return res.status(400).json({ message: 'CourseId is required' });

        const timetable = await Timetable.findOne({ user: req.user.id, course: courseId });
        if (!timetable) {
            return res.status(404).json({ message: 'Configuration not found' });
        }
        res.json(timetable.config || {});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET api/timetable/day
// @desc    Get timetable for a specific day
// @access  Private
router.get('/day', auth, async (req, res) => {
    try {
        const { date, courseId } = req.query;
        const [year, month, day] = date.split('-').map(Number);
        const dayOfWeek = new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'long' });

        const timetable = await Timetable.findOne({ user: req.user.id, course: courseId });
        if (!timetable || !timetable.schedule) {
            return res.json({ slots: [] });
        }

        const daySchedule = timetable.schedule[dayOfWeek] || [];
        const slots = daySchedule
            .filter(slot => slot.subject && slot.subject !== '')
            .map((slot, index) => ({
                slotId: `${dayOfWeek}-${index}`,
                time: slot.time,
                subject: slot.subject
            }));

        res.json({ slots });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/timetable
// @desc    Create or Update User Timetable (Legacy/Direct)
// @access  Private
router.post('/', auth, async (req, res) => {
    const { schedule, courseId } = req.body;

    try {
        if (!courseId) return res.status(400).json({ msg: 'courseId is required' });

        let timetable = await Timetable.findOne({ user: req.user.id, course: courseId });

        if (timetable) {
            // Update
            timetable.schedule = schedule;
            await timetable.save();
            return res.json(timetable);
        }

        // Create
        timetable = new Timetable({
            user: req.user.id,
            course: courseId,
            schedule
        });

        await timetable.save();
        res.json(timetable);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/timetable
// @desc    Get Current User Timetable
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { courseId } = req.query;
        if (!courseId) return res.status(400).json({ msg: 'courseId is required' });

        const timetable = await Timetable.findOne({ user: req.user.id, course: courseId });
        if (!timetable) {
            return res.status(404).json({ msg: 'Timetable not found' });
        }
        res.json(timetable);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
