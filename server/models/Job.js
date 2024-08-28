const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
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
    notes: {
        type: String
    },
    declined: {
        type: Boolean,
        default: false
    },
    achieved: {
        type: Boolean,
        default: false
    },
    resumeText: {
        type: String, // Store the extracted text
    },
});

module.exports = mongoose.model('Job', JobSchema);
