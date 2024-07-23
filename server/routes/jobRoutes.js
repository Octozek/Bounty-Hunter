const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Create a new job
router.post('/', auth, async (req, res) => {
    const { title, company, link, pay, dateApplied, type, image } = req.body;

    try {
        const newJob = new Job({
            title,
            company,
            link,
            pay,
            dateApplied,
            type,
            image,
            userId: req.user.id,
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all jobs for a user
router.get('/', auth, async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user.id });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get a specific job
router.get('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        res.json(job);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update a job
router.put('/:id', auth, async (req, res) => {
    const { title, company, link, pay, dateApplied, type, image } = req.body;

    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        job = await Job.findByIdAndUpdate(req.params.id, { $set: { title, company, link, pay, dateApplied, type, image } }, { new: true });

        res.json(job);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete a job
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Job.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Job removed' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
