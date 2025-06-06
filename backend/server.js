const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const playerRoutes = require('./routes/players');
const matchRoutes = require('./routes/matches');
const newsRoutes = require('./routes/news');
const galleryRoutes = require('./routes/gallery');
const sponsorRoutes = require('./routes/sponsors');
const contactRoutes = require('./routes/contact');

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/football-team', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (uploads)
app.use('/resources', express.static(path.join(__dirname, 'uploads')));

// Serve admin panel
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/sponsors', sponsorRoutes);
app.use('/api/contact', contactRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});