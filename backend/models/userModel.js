
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// Base user schema with common fields
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false // Don't include password in query results by default
  },
  userType: {
    type: String,
    required: true,
    enum: ['patient', 'nurse', 'admin']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  address: String,
  profileComplete: {
    type: Boolean,
    default: false
  },
  profileImage: String,
  isActive: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  activationDate: Date,
  nationalId: String
}, {
  timestamps: true,
  discriminatorKey: 'userType'
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the base User model
const User = mongoose.model('User', userSchema);

// Patient-specific schema
const Patient = User.discriminator('patient', new mongoose.Schema({
  dateOfBirth: String,
  gender: String,
  emergencyContact: String,
  bloodType: String,
  medicalConditions: [String],
  allergies: [String]
}));

// Nurse-specific schema
const Nurse = User.discriminator('nurse', new mongoose.Schema({
  licenseId: String,
  specializations: [String],
  experience: String,
  availabilityStatus: {
    type: Boolean,
    default: false
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  balance: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  }
}));

// Admin-specific schema
const Admin = User.discriminator('admin', new mongoose.Schema({
  // Admin-specific fields can be added here if needed
}));

module.exports = { User, Patient, Nurse, Admin };
