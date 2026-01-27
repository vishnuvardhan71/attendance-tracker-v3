const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');

// @route   POST api/courses
// @desc    Create a new course
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { name, year, semester } = req.body;

        // Check if user already has 3 courses
        const count = await Course.countDocuments({ user: req.user.id });
        if (count >= 3) {
            return res.status(400).json({ msg: 'Maximum limit of 3 courses reached' });
        }

        // Check for duplicate name
        const existing = await Course.findOne({ user: req.user.id, name });
        if (existing) {
            return res.status(400).json({ msg: 'Course name already exists' });
        }

        const newCourse = new Course({
            user: req.user.id,
            name,
            year,
            semester
        });

        const course = await newCourse.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   GET api/courses
// @desc    Get all courses for user with attendance percentage
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const courses = await Course.find({ user: req.user.id }).sort({ createdAt: -1 });

        // Enhance courses with attendance data
        // This is a simplified calculation. For robust stats, we might query the Attendance model.
        // For now, let's just return the course metadata. 
        // We can add a separate 'stats' endpoint or aggregate here if needed.

        // Let's try to aggregate basic attendance stats for each course
        const coursesWithStats = await Promise.all(courses.map(async (course) => {
            const attendanceRecords = await Attendance.find({ user: req.user.id, course: course._id });

            let totalClasses = 0;
            let attendedClasses = 0;

            attendanceRecords.forEach(record => {
                if (record.records) {
                    record.records.forEach(period => {
                        if (period.status !== 'Holiday') {
                            totalClasses++;
                            if (period.status === 'Present') {
                                attendedClasses++;
                            }
                        }
                    });
                }
            });

            const percentage = totalClasses === 0 ? 0 : Math.round((attendedClasses / totalClasses) * 100);

            return {
                ...course.toObject(),
                stats: {
                    totalClasses,
                    attendedClasses,
                    percentage
                }
            };
        }));

        res.json(coursesWithStats);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Check user
        if (course.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Course.findByIdAndDelete(req.params.id);

        // Optional: Clean up related attendance records
        // await Attendance.deleteMany({ course: req.params.id });

        res.json({ msg: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
