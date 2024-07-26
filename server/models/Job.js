const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    company: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    pay: {
        type: String
    },
    type: {
        type: String
    },
    dateApplied: {
        type: Date,
        required: true
    },
    link: {
        type: String
    },
    declined: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('job', JobSchema);
