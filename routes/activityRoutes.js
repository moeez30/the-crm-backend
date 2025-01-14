// server/routes/activityRoutes.js
import express from 'express';
// import router from express.Router();
import ActivityLog from '../models/ActivityLog.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// Get Activity Logs with Filtering and Pagination
router.get('/logs', 
  auth.authMiddleware, 
  auth.adminMiddleware, 
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 10, 
        action, 
        startDate, 
        endDate,
        userId 
      } = req.query;

      // Validate page and limit
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Number(limit));

      // Build filter object
      const filter = {};

      if (action) filter.action = action;
      if (userId) filter.user = userId;
      
      if (startDate && endDate) {
        filter.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      // Fetch logs with pagination and populate user details
      const logs = await ActivityLog.find(filter)
        .sort({ timestamp: -1 })
        .populate('user', 'name email role')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      // Get total count for pagination
      const total = await ActivityLog.countDocuments(filter);

      console.log(logs);

      res.json({
        logs,
        totalPages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        totalLogs: total
      });
    } catch (error) {
      console.error('Activity Logs Fetch Error:', error);
      res.status(500).json({ 
        message: 'Error fetching activity logs',
        error: error.message 
      });
    }
  }
);


export default router;