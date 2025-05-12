
const ServiceRequest = require('../models/serviceRequestModel');
const MedicalQuestion = require('../models/medicalQuestionModel');
const { Nurse } = require('../models/userModel');
const { sendServiceAssignmentNotification, sendServiceCompletionNotification } = require('../utils/emailService');

/**
 * Update nurse profile
 */
exports.updateProfile = async (req, res, next) => {
  try {
    // We'll use the generic user controller for most profile updates,
    // but this is for nurse-specific fields
    const nurseProfile = req.body;
    
    const nurse = await Nurse.findByIdAndUpdate(req.user.id, nurseProfile, {
      new: true,
      runValidators: true
    });
    
    if (!nurse) {
      return res.status(404).json({
        status: 'error',
        message: 'Nurse not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: nurse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggle nurse availability status
 */
exports.toggleAvailability = async (req, res, next) => {
  try {
    const { available, location } = req.body;
    
    const updateData = { availabilityStatus: available };
    
    // Update location if provided
    if (location) {
      updateData.location = location;
    }
    
    const nurse = await Nurse.findByIdAndUpdate(req.user.id, updateData, {
      new: true
    });
    
    if (!nurse) {
      return res.status(404).json({
        status: 'error',
        message: 'Nurse not found'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        available: nurse.availabilityStatus,
        location: nurse.location
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available service requests
 */
exports.getRequests = async (req, res, next) => {
  try {
    // Find pending requests that are broadcasted to all nurses
    const pendingRequests = await ServiceRequest.find({
      status: 'pending',
      broadcastToAllNurses: true
    }).sort({ createdAt: -1 });
    
    res.status(200).json({
      status: 'success',
      results: pendingRequests.length,
      data: pendingRequests
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get service request history for the nurse
 */
exports.getRequestHistory = async (req, res, next) => {
  try {
    const requests = await ServiceRequest.find({
      assignedNurse: req.user.id
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
 * Accept a service request
 */
exports.acceptRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { location } = req.body;
    
    const request = await ServiceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Service request not found'
      });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'This request is no longer available'
      });
    }
    
    // Update request
    request.status = 'assigned';
    request.assignedNurse = req.user.id;
    request.assignedAt = new Date();
    
    await request.save();
    
    // Update nurse location if provided
    if (location) {
      await Nurse.findByIdAndUpdate(req.user.id, {
        location
      });
    }
    
    // Send notification to patient
    try {
      const patient = await User.findById(request.patientId);
      if (patient) {
        await sendServiceAssignmentNotification(patient, request, req.user);
      }
    } catch (emailError) {
      console.error('Error sending service assignment notification:', emailError);
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Request accepted successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Complete a service
 */
exports.completeService = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { additionalServices } = req.body;
    
    const request = await ServiceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        status: 'error',
        message: 'Service request not found'
      });
    }
    
    if (request.assignedNurse.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not assigned to this request'
      });
    }
    
    if (request.status !== 'assigned' && request.status !== 'in-progress') {
      return res.status(400).json({
        status: 'error',
        message: 'This request cannot be completed'
      });
    }
    
    // Update request
    request.status = 'completed';
    request.completedAt = new Date();
    if (additionalServices) {
      request.additionalServices = additionalServices;
    }
    
    await request.save();
    
    // Send notification to patient
    try {
      const patient = await User.findById(request.patientId);
      if (patient) {
        await sendServiceCompletionNotification(patient, request);
      }
    } catch (emailError) {
      console.error('Error sending service completion notification:', emailError);
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Service completed successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Answer a medical question
 */
exports.answerQuestion = async (req, res, next) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;
    
    const question = await MedicalQuestion.findById(questionId);
    
    if (!question) {
      return res.status(404).json({
        status: 'error',
        message: 'Question not found'
      });
    }
    
    if (question.status === 'answered') {
      return res.status(400).json({
        status: 'error',
        message: 'This question has already been answered'
      });
    }
    
    // Update question
    question.status = 'answered';
    question.assignedTo = req.user.id;
    question.assignedToName = req.user.name;
    question.answer = answer;
    question.answeredAt = new Date();
    
    await question.save();
    
    res.status(200).json({
      status: 'success',
      message: 'Question answered successfully',
      data: question
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get unanswered medical questions
 */
exports.getUnansweredQuestions = async (req, res, next) => {
  try {
    const questions = await MedicalQuestion.find({
      status: 'open'
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
