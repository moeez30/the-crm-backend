// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    //console.log(authHeader)
    if (!authHeader) {
      return res.status(401).send({ 
        error: 'No authentication token provided' 
      });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');

    // Verify token

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
  

    // Find user
    const user = await User.findOne({ 
      _id: decoded.userId
    });

    console.log(user);

    if (!user) {
      throw new Error('User not found');
    }

    // Attach user and token to request
    req.user = user;
    req.token = token;

    // console.log(token);

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).send({ 
      error: 'Please authenticate',
      details: error.message 
    });
  }
};

// Admin-specific middleware
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Access denied' });
  }
  next();
};

export default { authMiddleware, adminMiddleware};