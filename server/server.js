const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const path = require('path');
const fs = require('fs');

if (fs.existsSync('.env')) {
    console.log('.env file exists');
} else {
    console.log('.env file does not exist');
}

dotenv.config();

console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debug log
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Debug log

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS Middleware - Allow requests from both local development and deployed frontend
const corsOptions = {
  origin: ['http://127.0.0.1:8080', 'https://bounty-hunter-mfbg.onrender.com'],
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '..', 'client')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(`MongoDB connection error: ${err}`));

// Serve client index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
