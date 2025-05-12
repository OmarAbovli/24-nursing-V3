
const { User, Patient, Nurse, Admin } = require('../models/userModel');
const { createSendToken } = require('../utils/jwtUtils');
const { sendNewAccountNotificationToAdmin } = require('../utils/emailService');

/**
 * Register a new user
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, userType, name, phone, nationalId, isActive = false } = req.body;
    
    // Log registration attempt with basic info (no password)
    console.log(`Registration attempt for ${email} as ${userType} at ${new Date().toISOString()}`);
    console.log(`Registration data:`, {
      email,
      userType,
      name,
      phone: phone ? "Provided" : "Not provided",
      nationalId: nationalId ? "Provided" : "Not provided"
    });
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Registration failed: User with email ${email} already exists`);
      return res.status(400).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }
    
    // Create user based on user type
    let newUser;
    try {
      switch(userType) {
        case 'patient':
          newUser = await Patient.create({
            email, 
            password, 
            userType, 
            name, 
            phone, 
            nationalId,
            isActive
          });
          break;
        case 'nurse':
          newUser = await Nurse.create({
            email, 
            password, 
            userType, 
            name, 
            phone,
            isActive,
            nationalId
          });
          break;
        case 'admin':
          // Admins are always created active
          newUser = await Admin.create({
            email, 
            password, 
            userType, 
            name, 
            phone,
            isActive: true,
            activationDate: new Date()
          });
          break;
        default:
          return res.status(400).json({
            status: 'error',
            message: 'Invalid user type'
          });
      }
      
      console.log(`User registered successfully: ${email} (${userType}) with ID: ${newUser._id}`);
    } catch (createError) {
      console.error('Error creating user:', createError);
      // Check for validation errors
      if (createError.name === 'ValidationError') {
        const errors = Object.values(createError.errors).map(err => err.message);
        return res.status(400).json({
          status: 'error',
          message: 'Validation error',
          details: errors
        });
      }
      
      // Check for duplicate key errors (typically email)
      if (createError.code === 11000) {
        return res.status(400).json({
          status: 'error',
          message: 'Email already exists'
        });
      }
      
      return res.status(500).json({
        status: 'error',
        message: 'Error creating user account',
        details: createError.message
      });
    }
    
    // Notify admins about new registration
    try {
      const admins = await Admin.find();
      if (admins.length > 0) {
        // Send notification to the first admin
        await sendNewAccountNotificationToAdmin(admins[0], newUser);
        console.log(`Notification sent to admin about new registration: ${email}`);
      } else {
        console.log('No admin accounts found to notify');
      }
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
      // Don't fail the registration if email fails
    }
    
    // Send token to client
    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

/**
 * Login user
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log(`Login attempt for ${email} at ${new Date().toISOString()}`);
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }
    
    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`Login failed: ${email} - User not found`);
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }
    
    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch (passwordError) {
      console.error(`Password comparison error for ${email}:`, passwordError);
      return res.status(500).json({
        status: 'error',
        message: 'Error during authentication. Please try again.'
      });
    }
    
    if (!isPasswordValid) {
      console.log(`Login failed: ${email} - Invalid password`);
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }
    
    console.log(`Login successful: ${email} (${user.userType}) with ID: ${user._id}`);
    
    // Check if account is active
    if (!user.isActive) {
      console.log(`Login notice: ${email} - Account not activated yet`);
      // We still log them in but with a warning
    }
    
    // Send token to client
    createSendToken(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
