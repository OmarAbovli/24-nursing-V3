
require('dotenv').config();
const mongoose = require('mongoose');
const { User, Patient, Nurse, Admin } = require('../models/userModel');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully for creating test accounts'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Create test accounts
const createTestAccounts = async () => {
  try {
    console.log('Starting to create test accounts...');
    
    // Clear existing test accounts
    await User.deleteMany({
      email: { 
        $in: [
          'patient@test.com', 
          'nurse@test.com', 
          'admin@test.com'
        ]
      }
    });
    console.log('Cleared existing test accounts');
    
    // Create patient account
    const testPatient = await Patient.create({
      email: 'patient@test.com',
      password: 'Patient123!',
      userType: 'patient',
      name: 'Test Patient',
      phone: '+201234567890',
      nationalId: '12345678901234',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true,
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      emergencyContact: '+201234567899',
      bloodType: 'A+'
    });
    console.log('Created test patient account:', testPatient.email);
    
    // Create nurse account
    const testNurse = await Nurse.create({
      email: 'nurse@test.com',
      password: 'Nurse123!',
      userType: 'nurse',
      name: 'Test Nurse',
      phone: '+201234567891',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true,
      licenseId: 'NUR123456',
      specializations: ['General Care', 'Elderly Care'],
      experience: '5 years',
      availabilityStatus: true
    });
    console.log('Created test nurse account:', testNurse.email);
    
    // Create admin account
    const testAdmin = await Admin.create({
      email: 'admin@test.com',
      password: 'Admin123!',
      userType: 'admin',
      name: 'Test Admin',
      phone: '+201234567892',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true
    });
    console.log('Created test admin account:', testAdmin.email);
    
    console.log('All test accounts created successfully');
    
    // Create an additional set of real accounts as requested
    console.log('Creating real accounts...');
    
    // Create real patient account
    const realPatient = await Patient.create({
      email: 'realpatient@example.com',
      password: 'RealPatient123!',
      userType: 'patient',
      name: 'Real Patient',
      phone: '+201234567893',
      nationalId: '12345678901235',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true,
      dateOfBirth: '1985-05-15',
      gender: 'Female',
      emergencyContact: '+201234567894',
      bloodType: 'B+'
    });
    console.log('Created real patient account:', realPatient.email);
    
    // Create real nurse account
    const realNurse = await Nurse.create({
      email: 'realnurse@example.com',
      password: 'RealNurse123!',
      userType: 'nurse',
      name: 'Real Nurse',
      phone: '+201234567895',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true,
      licenseId: 'NUR654321',
      specializations: ['Pediatric Care', 'Intensive Care'],
      experience: '8 years',
      availabilityStatus: true
    });
    console.log('Created real nurse account:', realNurse.email);
    
    // Create real admin account
    const realAdmin = await Admin.create({
      email: 'realadmin@example.com',
      password: 'RealAdmin123!',
      userType: 'admin',
      name: 'Real Admin',
      phone: '+201234567896',
      isActive: true,
      activationDate: new Date(),
      profileComplete: true
    });
    console.log('Created real admin account:', realAdmin.email);
    
    console.log('All real accounts created successfully');
    
    console.log('\nYou can use these credentials to login:');
    console.log('-----------------------------------');
    console.log('Patient: patient@test.com / Patient123!');
    console.log('Nurse: nurse@test.com / Nurse123!');
    console.log('Admin: admin@test.com / Admin123!');
    console.log('-----------------------------------');
    console.log('Real Patient: realpatient@example.com / RealPatient123!');
    console.log('Real Nurse: realnurse@example.com / RealNurse123!');
    console.log('Real Admin: realadmin@example.com / RealAdmin123!');
    console.log('-----------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating accounts:', error);
    process.exit(1);
  }
};

createTestAccounts();
