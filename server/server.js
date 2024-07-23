const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ origin: 'http://127.0.0.1:8080' })); // Allow requests from your client

// Mongoose connection
mongoose.connect('mongodb://localhost:27017/bountyhunter', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '..', 'client')));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
