
const mongoose = require('mongoose');

const medicalQuestionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: 'open',
    enum: ['open', 'assigned', 'answered']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedToName: String,
  answer: String,
  answeredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const MedicalQuestion = mongoose.model('MedicalQuestion', medicalQuestionSchema);
module.exports = MedicalQuestion;
