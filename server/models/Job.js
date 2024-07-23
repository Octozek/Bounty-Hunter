const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    link: { type: String },
    pay: { type: String },
    dateApplied: { type: Date },
    type: { type: String },
    image: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Job', jobSchema);
