// server/models/ActivityLog.js
import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      // User Actions
      'LOGIN', 
      'LOGOUT', 
      'PROFILE_UPDATE',
      
      // CRM Actions
      'CREATE_USER',
      'UPDATE_USER',
      'DELETE_USER',
      'CREATE_OPPORTUNITY',
      'UPDATE_OPPORTUNITY',
      'DELETE_OPPORTUNITY',,
      'CREATE_EXPENSE',
      
      // Admin Actions
      'CHANGE_USER_ROLE',
      'SUSPEND_USER',
      'ACTIVATE_USER',
      'EDIT_PERMISSIONS'
    ]
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const ActivityLog =  mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog;