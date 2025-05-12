
const express = require('express');
const patientController = require('../controllers/patientController');
const { protect, restrictTo, isActive } = require('../middleware/authMiddleware');
const router = express.Router();

// All routes are protected and restricted to patients
router.use(protect);
router.use(restrictTo('patient'));

// Routes that don't require active account
router.get('/current-request', patientController.getCurrentRequest);
router.get('/request-history', patientController.getRequestHistory);

// Routes that require active account
router.post('/request-service', isActive, patientController.requestService);
router.post('/payment', isActive, patientController.submitPayment);
router.post('/rating', isActive, patientController.submitRating);

// Medical questions
router.post('/questions', isActive, patientController.askMedicalQuestion);
router.get('/questions', patientController.getMedicalQuestions);

module.exports = router;
