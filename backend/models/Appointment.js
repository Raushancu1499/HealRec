import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['In-person', 'Video', 'Phone'],
    required: [true, 'Appointment type is required']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled'
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required']
  },
  reason: {
    type: String,
    required: [true, 'Reason for appointment is required'],
    trim: true,
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  dateTime: {
    date: {
      type: Date,
      required: [true, 'Appointment date is required']
    },
    duration: {
      type: Number,
      default: 30,
      min: [15, 'Duration must be at least 15 minutes'],
      max: [180, 'Duration cannot exceed 180 minutes']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Hospital', 'Clinic', 'Virtual', 'Home']
    },
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    room: String,
    virtualLink: String,
    phoneNumber: String
  },
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reminders: [{
    type: {
      type: String,
      enum: ['Email', 'SMS', 'Push'],
      required: true
    },
    time: {
      type: Number,
      required: true,
      min: [0, 'Reminder time must be positive']
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'hours'
    },
    sent: {
      type: Boolean,
      default: false
    }
  }],
  payment: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded', 'Insurance'],
      default: 'Pending'
    },
    method: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'Insurance', 'Cash', 'Online']
    },
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      authorizationCode: String
    }
  },
  followUp: {
    required: {
      type: Boolean,
      default: false
    },
    date: Date,
    notes: String
  },
  documents: [{
    type: {
      type: String,
      enum: ['Medical Record', 'Lab Result', 'Prescription', 'Insurance', 'Other']
    },
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    submittedAt: Date
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundIssued: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes
appointmentSchema.index({ patientId: 1, 'dateTime.date': -1 });
appointmentSchema.index({ doctorId: 1, 'dateTime.date': -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ 'dateTime.date': 1 });

// Virtual for appointment end time
appointmentSchema.virtual('endTime').get(function() {
  const endTime = new Date(this.dateTime.date);
  endTime.setMinutes(endTime.getMinutes() + this.dateTime.duration);
  return endTime;
});

// Virtual for time until appointment
appointmentSchema.virtual('timeUntil').get(function() {
  const now = new Date();
  const appointmentTime = new Date(this.dateTime.date);
  const diffMs = appointmentTime - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMs < 0) return 'Past';
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  return 'Less than 1 hour';
});

// Pre-save middleware
appointmentSchema.pre('save', function(next) {
  if (this.isNew && this.type === 'Virtual') {
    // Generate virtual meeting link for video appointments
    this.location.virtualLink = `https://meet.healrec.com/room/${this._id}`;
  }
  next();
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);
