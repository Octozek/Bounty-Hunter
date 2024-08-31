const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    portfolioLink: { type: String, default: '' },
    linkedinProfile: { type: String, default: '' },
    facebookProfile: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    githubProfile: { type: String, default: '' },
    // Add any additional fields as needed
});

module.exports = mongoose.model('User', userSchema);
