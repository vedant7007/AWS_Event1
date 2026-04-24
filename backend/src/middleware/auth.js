const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token
 */
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token', details: err.message });
  }
}

/**
 * Middleware to verify admin access
 */
function verifyAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
}

/**
 * Generate JWT token
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.userId,
      teamId: user.teamId,
      role: user.role,
      name: user.name
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}

/**
 * Error handler middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status,
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  verifyToken,
  verifyAdmin,
  generateToken,
  errorHandler
};
