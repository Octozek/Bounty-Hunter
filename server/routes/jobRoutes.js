const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Create a new job
router.post('/', auth, async (req, res) => {
    const { title, company, link, pay, dateApplied, type } = req.body;

    try {
        const newJob = new Job({
            title,
            company,
            link,
            pay,
            dateApplied,
            type,
            userId: req.user,
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error('Error creating job:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Get all jobs for a user
router.get('/', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user });
        res.json(jobs);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Delete a job
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.userId.toString() !== req.user) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await job.remove();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

module.exports = router;
