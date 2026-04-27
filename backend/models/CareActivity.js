import mongoose from 'mongoose';

const careActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['medication', 'appointment', 'health_metric', 'emergency'],
    required: true
  },
  caregiver: String,
  loggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const CareActivity = mongoose.model('CareActivity', careActivitySchema);
