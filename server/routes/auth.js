const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const { verifyToken } = require('../middleware/auth');

// Login user
router.post('/login', async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID and password are required' });
    }

    // Find user in DB and validate credentials (including admins)
    const user = await userService.validateCredentials(userId, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET || 'shunmugam_secret_key_2024',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    // When verified via Firebase, req.user will have uid/name/role
    if (req.user && req.user.uid) {
      return res.json({
        user: {
          userId: req.user.userId || req.user.uid,
          name: req.user.name || 'User',
          role: req.user.role || 'supervisor'
        }
      });
    }

    // Legacy JWT path (req.user has userId/role)
    if (req.user && req.user.userId) {
      const user = await userService.findByUserId(req.user.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return res.json({
        user: {
          userId: user.userId,
          name: user.name,
          role: user.role
        }
      });
    }

    return res.status(401).json({ message: 'Invalid token' });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router; 