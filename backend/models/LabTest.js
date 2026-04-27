import mongoose from 'mongoose';

const labTestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testName: {
    type: String,
    required: true
  },
  testType: {
    type: String,
    required: true
  },
  physician: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  orderedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  fasting: {
    type: Boolean,
    default: false
  },
  instructions: String,
  labId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  results: {
    type: mongoose.Schema.Types.Mixed
  },
  resultStatus: {
    type: String,
    enum: ['Normal', 'Abnormal', 'Critical', 'Pending'],
    default: 'Pending'
  },
  completedAt: Date,
  notes: String
}, {
  timestamps: true
});

labTestSchema.index({ userId: 1 });
labTestSchema.index({ status: 1 });
labTestSchema.index({ scheduledDate: 1 });

export const LabTest = mongoose.model('LabTest', labTestSchema);
