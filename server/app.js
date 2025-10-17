const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Connect to Firebase Firestore
connectDB();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://shunmugam-textiles-frontend.onrender.com']
    : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shunmugam Textiles API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    message: 'API Health Check', 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/supervisor', require('./routes/supervisor'));
app.use('/api/public', require('./routes/public'));

// Catch-all route for undefined endpoints
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({ message: 'API endpoint not found' });
  } else {
    res.status(404).json({ 
      message: 'This is an API server. Frontend is hosted separately.',
      frontend_url: 'https://shunmugam-textiles-frontend.onrender.com'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 