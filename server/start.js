#!/usr/bin/env node

// Load environment variables first
const path = require('path');
const fs = require('fs');

// Determine which .env file to load
const envFile = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '..', '.env.production')
  : path.join(__dirname, '..', '.env');

// Check if env file exists and load it
if (fs.existsSync(envFile)) {
  console.log(`Loading environment from: ${envFile}`);
  require('dotenv').config({ path: envFile });
} else {
  console.log(`Environment file not found: ${envFile}`);
  console.log('Using system environment variables');
}

// Log important environment variables (without sensitive data)
console.log('Environment Configuration:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- PORT:', process.env.PORT || 5000);
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL || 'not set');
console.log('- FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID || 'not set');

// Start the main application
require('./app.js');
