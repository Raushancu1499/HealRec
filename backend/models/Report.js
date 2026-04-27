import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Report name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Lab Report', 'Radiology', 'Immunization', 'Prescription', 'Vital Signs', 'Progress Notes', 'Other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  provider: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  fileUrl: {
    type: String
  },
  fileName: String,
  fileSize: String,
  results: {
    type: mongoose.Schema.Types.Mixed
  },
  notes: String,
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

reportSchema.index({ userId: 1 });
reportSchema.index({ type: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ date: -1 });

export const Report = mongoose.model('Report', reportSchema);
