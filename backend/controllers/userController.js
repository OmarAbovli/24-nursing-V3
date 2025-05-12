
const { User } = require('../models/userModel');

/**
 * Get current user profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
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
 * Create user profile
 */
exports.createProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    });
    
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
 * Update user profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    // Don't allow updating of userType through this route
    if (req.body.userType) {
      delete req.body.userType;
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    });
    
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
 * Complete user profile
 */
exports.completeProfile = async (req, res, next) => {
  try {
    const profileData = {
      ...req.body,
      profileComplete: true
    };
    
    // Don't allow updating of userType through this route
    if (profileData.userType) {
      delete profileData.userType;
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, profileData, {
      new: true,
      runValidators: true
    });
    
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

// Upload profile image placeholder - would need file upload middleware
exports.uploadProfileImage = async (req, res, next) => {
  try {
    // This would normally use a file upload service like multer
    // For now we'll just update a URL
    if (!req.body.imageUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'No image URL provided'
      });
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, {
      profileImage: req.body.imageUrl
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
      data: {
        imageUrl: user.profileImage
      }
    });
  } catch (error) {
    next(error);
  }
};
