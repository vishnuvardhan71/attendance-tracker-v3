const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const { authLimiter } = require('../middleware/rateLimiter');

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post(
    '/signup',
    authLimiter,
    [
        check('username', 'Username is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('fullName', 'Full Name is required').not().isEmpty(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, email, fullName } = req.body;

        try {
            let user = await User.findOne({ username });

            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'Email already registered' });
            }

            user = new User({
                username,
                password,
                email,
                fullName
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };

            if (!process.env.JWT_SECRET) {
                console.error('FATAL ERROR: JWT_SECRET is not defined.');
                return res.status(500).json({ msg: 'Server error' });
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    '/login',
    authLimiter,
    [
        check('username', 'Username is required').not().isEmpty(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username });

            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: 'Invalid Credentials' });
            }

            const payload = {
                user: {
                    id: user.id,
                },
            };

            if (!process.env.JWT_SECRET) {
                console.error('FATAL ERROR: JWT_SECRET is not defined.');
                return res.status(500).json({ msg: 'Server error' });
            }

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '24h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route   GET api/auth/me
// @desc    Get current user profile (settings)
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/auth/config
// @desc    Update user configuration (Timings, Subjects)
// @access  Private
router.put('/config', auth, async (req, res) => {
    const { collegeTimings, subjects, isSetupComplete } = req.body;

    // Build profile object
    const profileFields = {};
    if (collegeTimings) profileFields.collegeTimings = collegeTimings;
    if (subjects) profileFields.subjects = subjects;
    if (typeof isSetupComplete !== 'undefined') profileFields.isSetupComplete = isSetupComplete;

    try {
        let user = await User.findById(req.user.id);

        if (user) {
            // Update
            user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: profileFields },
                { new: true }
            ).select('-password');
            return res.json(user);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   PUT api/auth/initial-stats
// @desc    Update user initial attendance stats
// @access  Private
router.put('/initial-stats', auth, async (req, res) => {
    const { total, attended, courseId } = req.body;

    try {
        if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ msg: 'Valid courseId is required' });
        }

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Ownership check
        if (course.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        course.initialStats = {
            total: Number(total) || 0,
            attended: Number(attended) || 0
        };

        await course.save();
        res.json(course.initialStats);
    } catch (err) {
        console.error('Initial Stats Error:', err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
});

module.exports = router;
