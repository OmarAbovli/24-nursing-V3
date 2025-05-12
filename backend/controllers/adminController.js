
const { User } = require('../models/userModel');
const ServiceRequest = require('../models/serviceRequestModel');
const { sendAccountActivationEmail } = require('../utils/emailService');

/**
 * Get all users
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Activate a user account
 */
exports.activateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isActive: true,
      activationDate: new Date()
    }, {
      new: true
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Send activation email
    try {
      await sendAccountActivationEmail(user);
    } catch (emailError) {
      console.error('Error sending activation email:', emailError);
    }
    
    res.status(200).json({
      status: 'success',
      message: 'User account activated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Deactivate a user account
 */
exports.deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      isActive: false
    }, {
      new: true
    });
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'User account deactivated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a user
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all service requests (for admin dashboard)
 */
exports.getAllServiceRequests = async (req, res, next) => {
  try {
    const serviceRequests = await ServiceRequest.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: serviceRequests.length,
      data: serviceRequests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get service request statistics
 */
exports.getServiceStats = async (req, res, next) => {
  try {
    const totalRequests = await ServiceRequest.countDocuments();
    const completedRequests = await ServiceRequest.countDocuments({ status: 'completed' });
    const pendingRequests = await ServiceRequest.countDocuments({ status: 'pending' });
    const inProgressRequests = await ServiceRequest.countDocuments({ 
      status: { $in: ['assigned', 'in-progress'] } 
    });
    
    // Calculate average rating
    const ratingResult = await ServiceRequest.aggregate([
      {
        $match: {
          'rating.score': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating.score' }
        }
      }
    ]);
    
    const averageRating = ratingResult.length > 0 ? ratingResult[0].averageRating : 0;
    
    res.status(200).json({
      status: 'success',
      data: {
        totalRequests,
        completedRequests,
        pendingRequests,
        inProgressRequests,
        averageRating
      }
    });
  } catch (error) {
    next(error);
  }
};
