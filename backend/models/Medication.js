import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Medication name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  dosage: {
    type: String,
    required: [true, 'Dosage is required'],
    trim: true
  },
  frequency: {
    type: String,
    required: [true, 'Frequency is required'],
    enum: ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed', 'Every other day', 'Weekly']
  },
  times: [{
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter valid time format (HH:MM)']
  }],
  instructions: {
    type: String,
    trim: true,
    maxlength: [500, 'Instructions cannot exceed 500 characters']
  },
  prescribedBy: {
    name: String,
    license: String,
    phone: String,
    email: String
  },
  pharmacy: {
    name: String,
    address: String,
    phone: String,
    fax: String
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: Date,
  remainingSupply: {
    type: Number,
    min: 0
  },
  totalSupply: {
    type: Number,
    min: 1
  },
  refills: {
    remaining: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  reminders: {
    enabled: {
      type: Boolean,
      default: true
    },
    sound: {
      type: Boolean,
      default: true
    },
    vibration: {
      type: Boolean,
      default: true
    },
    advanceNotice: {
      type: Number,
      default: 15,
      min: 0,
      max: 60
    }
  },
  adherence: {
    takenDoses: {
      type: Number,
      default: 0
    },
    missedDoses: {
      type: Number,
      default: 0
    },
    lastTaken: Date,
    streak: {
      type: Number,
      default: 0
    }
  },
  interactions: [{
    medication: String,
    severity: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      default: 'Moderate'
    },
    description: String,
    recommendation: String
  }],
  color: {
    type: String,
    enum: ['blue', 'red', 'yellow', 'green', 'purple', 'orange'],
    default: 'blue'
  },
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPrescription: {
    type: Boolean,
    default: true
  },
  prescriptionImage: String,
  category: {
    type: String,
    enum: ['Antibiotics', 'Pain Relievers', 'Chronic Conditions', 'Vitamins', 'Mental Health', 'Allergy', 'Other'],
    default: 'Other'
  }
}, {
  timestamps: true
});

// Indexes
medicationSchema.index({ userId: 1 });
medicationSchema.index({ name: 1 });
medicationSchema.index({ isActive: 1 });
medicationSchema.index({ 'reminders.enabled': 1 });

// Virtual for adherence percentage
medicationSchema.virtual('adherencePercentage').get(function() {
  const totalDoses = this.adherence.takenDoses + this.adherence.missedDoses;
  if (totalDoses === 0) return 0;
  return Math.round((this.adherence.takenDoses / totalDoses) * 100);
});

// Virtual for refill needed
medicationSchema.virtual('needsRefill').get(function() {
  if (!this.remainingSupply || !this.totalSupply) return false;
  return (this.remainingSupply / this.totalSupply) <= 0.2;
});

// Pre-save middleware
medicationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.adherence.takenDoses = 0;
    this.adherence.missedDoses = 0;
    this.adherence.streak = 0;
  }
  next();
});

export const Medication = mongoose.model('Medication', medicationSchema);
