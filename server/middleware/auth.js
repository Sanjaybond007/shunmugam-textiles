const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { admin, initFirebaseAdmin } = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Try Firebase ID token verification first (if Admin SDK is initialized)
  try {
    const app = initFirebaseAdmin();
    if (app) {
      const decoded = await admin.auth().verifyIdToken(token);
      // Prefer role from custom claims if present; default to 'supervisor' for compatibility
      const role = decoded.role || decoded.claims?.role || 'supervisor';
      req.user = {
        uid: decoded.uid,
        role,
        userId: decoded.userId || decoded.uid,
        name: decoded.name || decoded.email || 'User'
      };
      return next();
    }
  } catch (fbErr) {
    // Fall through to JWT verification
    // console.warn('Firebase token verification failed, falling back to JWT:', fbErr?.message);
  }

  // Fallback: existing JWT verification
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shunmugam_secret_key_2024');
    req.user = decoded;
    return next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  verifyToken,
  requireRole,
  hashPassword,
  comparePassword
};