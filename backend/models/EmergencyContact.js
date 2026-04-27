import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['doctor', 'family', 'hospital', 'emergency'],
    required: true
  },
  relation: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
