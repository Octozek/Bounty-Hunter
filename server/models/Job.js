const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
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
    dateApplied: {
        type: Date,
        required: true
    },
    type: {
        type: String
    },
    link: {
        type: String
    },
    declined: {
        type: Boolean,
        default: false
    },
    achieved: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('job', JobSchema);
