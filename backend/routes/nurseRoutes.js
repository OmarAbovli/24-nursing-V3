
const express = require('express');
const nurseController = require('../controllers/nurseController');
const { protect, restrictTo, isActive } = require('../middleware/authMiddleware');
const router = express.Router();

// All routes are protected and restricted to nurses
router.use(protect);
router.use(restrictTo('nurse'));

// Routes that don't require active account
router.post('/profile', nurseController.updateProfile);

// Routes that require active account
router.post('/availability', isActive, nurseController.toggleAvailability);
router.get('/requests', isActive, nurseController.getRequests);
router.get('/request-history', isActive, nurseController.getRequestHistory);
router.post('/requests/:requestId/accept', isActive, nurseController.acceptRequest);
router.post('/requests/:requestId/complete', isActive, nurseController.completeService);

// Medical questions
router.get('/questions', isActive, nurseController.getUnansweredQuestions);
router.post('/questions/:questionId/answer', isActive, nurseController.answerQuestion);

module.exports = router;
