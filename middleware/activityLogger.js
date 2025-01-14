// server/middleware/activityLogger.js
import ActivityLog from '../models/ActivityLog.js';
import geoip from 'geoip-lite';

const logActivity = async (req, user, action, details = {}) => {

    console.log(user);
  try {
    // Get IP address
    const ipAddress = 
      req.headers['x-forwarded-for'] || 
      req.connection.remoteAddress;

    // Get location from IP
    const geo = geoip.lookup(ipAddress);
    
    const logEntry = new ActivityLog({
      user: user._id,
      action,
      details
    });

    await logEntry.save();
  } catch (error) {
    console.error('Activity Logging Error:', error);
  }
};

export default logActivity;