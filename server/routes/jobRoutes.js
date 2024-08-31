const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const multer = require('multer');
const { processResume } = require('../utils/resumeProcessor');

// Set up multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all jobs
router.get('/', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user.id, declined: { $ne: true }, achieved: { $ne: true } });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Fetch all achieved jobs
router.get('/achieved', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user.id, achieved: true });
        res.json(jobs);
    } catch (err) {
        console.error('Error fetching achieved jobs:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Fetch all declined jobs
router.get('/declined', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user.id, declined: true });
        res.json(jobs);
    } catch (err) {
        console.error('Error fetching declined jobs:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add new job with resume text extraction
router.post('/', auth, upload.single('resume'), async (req, res) => {
    const { company, title, pay, dateApplied, type, link, notes } = req.body;

    try {
        let resumeText = '';
        if (req.file) {
            resumeText = await processResume(req.file.buffer);
        }

        const newJob = new Job({
            userId: req.user.id,
            company,
            title,
            pay,
            dateApplied,
            type,
            link,
            notes,
            resumeText // Save the processed resume text instead of the file
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error('Error adding job:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Decline job
router.put('/:id/decline', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        job.declined = true;
        await job.save();
        res.json(job);
    } catch (err) {
        console.error('Error declining job:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Achieve job
router.put('/:id/achieve', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        job.achieved = true;
        await job.save();
        res.json(job);
    } catch (err) {
        console.error('Error achieving job:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete job
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Job.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
