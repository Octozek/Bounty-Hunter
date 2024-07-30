// server/server.js

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ origin: '*' })); // Allow all origins, adjust as needed for security

// Mongoose connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Serve the uploads directory statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '..', 'client')));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/upload', uploadRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
