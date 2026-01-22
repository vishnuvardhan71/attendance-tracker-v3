const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Timetable = require('../models/Timetable');
const User = require('../models/User');

// @route   POST api/timetable/config
// @desc    Save timetable configuration
// @access  Private
router.post('/config', auth, async (req, res) => {
    try {
        const configData = req.body;

        let timetable = await Timetable.findOne({ user: req.user.id });

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
            // Create new configuration
            timetable = new Timetable({
                user: req.user.id,
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

        // Mark setup as complete
        await User.findByIdAndUpdate(req.user.id, { isSetupComplete: true });

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
        const timetable = await Timetable.findOne({ user: req.user.id });
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
        const { date } = req.query;
        const [year, month, day] = date.split('-').map(Number);
        const dayOfWeek = new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'long' });

        const timetable = await Timetable.findOne({ user: req.user.id });
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
// @desc    Create or Update User Timetable
// @access  Private
router.post('/', auth, async (req, res) => {
    const { schedule } = req.body;

    try {
        let timetable = await Timetable.findOne({ user: req.user.id });

        if (timetable) {
            // Update
            timetable = await Timetable.findOneAndUpdate(
                { user: req.user.id },
                { $set: { schedule } },
                { new: true }
            );
            return res.json(timetable);
        }

        // Create
        timetable = new Timetable({
            user: req.user.id,
            schedule
        });

        await timetable.save();

        // Also mark setup as complete if not already
        await User.findByIdAndUpdate(req.user.id, { isSetupComplete: true });

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
        const timetable = await Timetable.findOne({ user: req.user.id });
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
