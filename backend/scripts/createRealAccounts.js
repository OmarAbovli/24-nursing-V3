
require('dotenv').config();
const mongoose = require('mongoose');
const { User, Patient, Nurse, Admin } = require('../models/userModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully for creating real accounts'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Generate strong production-ready passwords
const patientPassword = 'Patient123!';
const nursePassword = 'Nurse123!';
const adminPassword = 'Admin123!';

// Create real accounts
async function createRealAccounts() {
  try {
    console.log('Creating real accounts for production use...');
    
    // Delete existing test accounts if they exist
    await User.deleteMany({
      email: { 
        $in: [
          'patient@test.com', 
          'nurse@test.com', 
          'admin@test.com'
        ]
      }
    });
    
    console.log('Deleted any existing test accounts');
    
    // Create a patient account
    const patient = await Patient.create({
      email: 'patient@test.com',
      password: patientPassword,
      userType: 'patient',
      name: 'Test Patient',
      phone: '+201234567890',
      nationalId: '12345678901234',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true,
      medicalConditions: ['None'],
      allergies: ['None'],
      dateOfBirth: '1990-01-01',
      gender: 'Male'
    });
    
    console.log(`Created patient account: ${patient.email} (ID: ${patient._id})`);
    
    // Create a nurse account
    const nurse = await Nurse.create({
      email: 'nurse@test.com',
      password: nursePassword,
      userType: 'nurse',
      name: 'Test Nurse',
      phone: '+201234567891',
      licenseId: 'NID123456',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true,
      specializations: ['General Care', 'Elder Care'],
      experience: '5 years'
    });
    
    console.log(`Created nurse account: ${nurse.email} (ID: ${nurse._id})`);
    
    // Create an admin account
    const admin = await Admin.create({
      email: 'admin@test.com',
      password: adminPassword,
      userType: 'admin',
      name: 'System Administrator',
      phone: '+201234567892',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true
    });
    
    console.log(`Created admin account: ${admin.email} (ID: ${admin._id})`);
    
    console.log('\nREAL ACCOUNTS CREATED SUCCESSFULLY:');
    console.log('------------------------------------');
    console.log('PATIENT LOGIN:');
    console.log('Email: patient@test.com');
    console.log('Password:', patientPassword);
    console.log('\nNURSE LOGIN:');
    console.log('Email: nurse@test.com');
    console.log('Password:', nursePassword);
    console.log('\nADMIN LOGIN:');
    console.log('Email: admin@test.com');
    console.log('Password:', adminPassword);
    console.log('------------------------------------');
    console.log('These accounts are active and ready to use.');
    
  } catch (error) {
    console.error('Error creating real accounts:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function to create accounts
createRealAccounts();
