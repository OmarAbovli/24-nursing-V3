
const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

// All routes are protected and restricted to admins
router.use(protect);
router.use(restrictTo('admin'));

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id/activate', adminController.activateUser);
router.put('/users/:id/deactivate', adminController.deactivateUser);
router.delete('/users/:id', adminController.deleteUser);

// Service request routes
router.get('/service-requests', adminController.getAllServiceRequests);
router.get('/service-stats', adminController.getServiceStats);

module.exports = router;
