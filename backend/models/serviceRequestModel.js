
const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientAge: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['prescribed', 'emergency']
  },
  details: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  assignedNurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedAt: Date,
  completedAt: Date,
  broadcastToAllNurses: {
    type: Boolean,
    default: false
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  cost: {
    type: Number,
    default: function() {
      // Default cost based on service type
      return this.serviceType === 'emergency' ? 300 : 150;
    }
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentMethod: String,
  paymentDate: Date,
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: Date
  },
  additionalServices: String
}, {
  timestamps: true
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
module.exports = ServiceRequest;
