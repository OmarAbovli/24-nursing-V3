
const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect); // All routes are protected

router.get('/profile', userController.getProfile);
router.post('/profile', userController.createProfile);
router.put('/profile', userController.updateProfile);
router.put('/complete-profile', userController.completeProfile);
router.post('/upload-profile-image', userController.uploadProfileImage);

module.exports = router;
