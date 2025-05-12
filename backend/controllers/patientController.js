
const ServiceRequest = require('../models/serviceRequestModel');
const MedicalQuestion = require('../models/medicalQuestionModel');
const { User, Nurse } = require('../models/userModel');
const { sendServiceRequestConfirmation } = require('../utils/emailService');

/**
 * Create a new service request
 */
exports.requestService = async (req, res, next) => {
  try {
    const { patientName, patientAge, address, serviceType, details, coordinates, broadcastToAllNurses } = req.body;
    
    const newRequest = await ServiceRequest.create({
      patientId: req.user.id,
      patientName,
      patientAge,
      address,
      serviceType, 
      details,
      coordinates,
      broadcastToAllNurses: broadcastToAllNurses || false
    });
    
    // Send confirmation email
    try {
      await sendServiceRequestConfirmation(req.user, newRequest);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }
    
    // Notify available nurses if it's a broadcast request (would be done through a queue in production)
    if (broadcastToAllNurses) {
      const availableNurses = await Nurse.find({ availabilityStatus: true });
      console.log(`Notifying ${availableNurses.length} available nurses about new request`);
      // In a real app, you'd send notifications to these nurses
    }
    
    res.status(201).json({
      status: 'success',
      data: newRequest
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the current active service request for the patient
 */
exports.getCurrentRequest = async (req, res, next) => {
  try {
    const currentRequest = await ServiceRequest.findOne({
      patientId: req.user.id,
      status: { $in: ['pending', 'assigned', 'in-progress'] }
    }).sort({ createdAt: -1 });
    
    if (!currentRequest) {
      return res.status(404).json({
        status: 'error',
        message: 'No active service requests found'
      });
    }
    
    // If request is assigned, get nurse details
    let assignedNurseDetails = null;
    if (currentRequest.assignedNurse) {
      assignedNurseDetails = await User.findById(currentRequest.assignedNurse).select('name phone profileImage');
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        request: currentRequest,
        nurse: assignedNurseDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get service request history for the patient
 */
exports.getRequestHistory = async (req, res, next) => {
  try {
    const requests = await ServiceRequest.find({
      patientId: req.user.id
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process payment for a service request
 */
exports.submitPayment = async (req, res, next) => {
  try {
    const { requestId, method, transactionNumber, amount } = req.body;
    
    const request = await ServiceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Service request not found'
      });
    }
    
    if (request.patientId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to pay for this request'
      });
    }
    
    if (request.isPaid) {
      return res.status(400).json({
        status: 'error',
        message: 'This request has already been paid for'
      });
    }
    
    // Update request payment info
    request.isPaid = true;
    request.paymentMethod = method;
    request.paymentDate = new Date();
    
    await request.save();
    
    // Update nurse balance if applicable
    if (request.assignedNurse) {
      const nurse = await Nurse.findById(request.assignedNurse);
      if (nurse) {
        const serviceFee = request.cost * 0.8; // 80% goes to nurse, 20% platform fee
        nurse.balance += serviceFee;
        nurse.totalEarned += serviceFee;
        await nurse.save();
      }
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Payment successful',
      data: {
        isPaid: true,
        paymentDate: request.paymentDate
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit rating for a service request
 */
exports.submitRating = async (req, res, next) => {
  try {
    const { requestId, rating, comment } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const request = await ServiceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Service request not found'
      });
    }
    
    if (request.patientId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to rate this request'
      });
    }
    
    if (request.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'You can only rate completed requests'
      });
    }
    
    // Add rating to request
    request.rating = {
      score: rating,
      comment: comment || '',
      date: new Date()
    };
    
    await request.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Rating submitted successfully',
      data: request.rating
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Ask a medical question
 */
exports.askMedicalQuestion = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    
    const newQuestion = await MedicalQuestion.create({
      patientId: req.user.id,
      patientName: req.user.name,
      title,
      description,
      status: 'open'
    });
    
    res.status(201).json({
      status: 'success',
      data: newQuestion
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all medical questions for the patient
 */
exports.getMedicalQuestions = async (req, res, next) => {
  try {
    const questions = await MedicalQuestion.find({
      patientId: req.user.id
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: questions.length,
      data: questions
    });
  } catch (error) {
    next(error);
  }
};
