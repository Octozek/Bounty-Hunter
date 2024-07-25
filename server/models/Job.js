const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    link: { type: String },
    pay: { type: String },
    dateApplied: { type: Date, required: true },
    type: { type: String }, // frontend, backend, fullstack
    image: { type: String }, // URL to the image
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Job', jobSchema);
