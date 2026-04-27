import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
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
  relationship: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  age: Number,
  bloodType: String,
  permissions: [{
    type: String,
    enum: ['view_medical', 'manage_appointments', 'emergency_contact']
  }],
  status: {
    type: String,
    enum: ['active', 'pending', 'inactive'],
    default: 'active'
  },
  healthScore: {
    type: Number,
    default: 100
  },
  conditions: [String],
  medications: [String],
  emergencyContact: {
    type: Boolean,
    default: false
  },
  isPediatric: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);
