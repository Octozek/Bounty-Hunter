const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');

// Get all jobs
router.get('/', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user.id, declined: { $ne: true } });
        res.json(jobs);
    } catch (err) {
        console.error('Error fetching jobs:', err);
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

// Add new job
router.post('/', auth, async (req, res) => {
    const { company, title, pay, dateApplied, type, link } = req.body;

    try {
        const newJob = new Job({
            userId: req.user.id,
            company,
            title,
            pay,
            dateApplied,
            type,
            link
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

        await job.remove();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
