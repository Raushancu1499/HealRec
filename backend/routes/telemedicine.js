import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { Appointment } from '../models/Appointment.js';
import { User } from '../models/User.js';

const router = express.Router();

// @route   GET /api/telemedicine/doctors
// @desc    Get available doctors for telemedicine
// @access   Private
router.get('/doctors', auth, async (req, res) => {
  try {
    const { specialty, search, page = 1, limit = 10 } = req.query;
    
    const query = { role: 'Doctor' };
    
    if (specialty) {
      query.specialty = { $regex: specialty, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialty: { $regex: search, $options: 'i' } }
      ];
    }

    const doctors = await User.find(query)
      .select('name specialty rating reviews experience languages avatar')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching doctors'
    });
  }
});

// @route   POST /api/telemedicine/consultations
// @desc    Start new telemedicine consultation
// @access   Private
router.post('/consultations', auth, [
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('type').isIn(['video', 'phone']).withMessage('Consultation type must be video or phone'),
  body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Reason must be between 5-500 characters'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('duration').optional().isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15-180 minutes')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { doctorId, type, reason, scheduledDate, duration = 30 } = req.body;

    const consultation = new Appointment({
      patientId: req.user._id,
      doctorId,
      type: type === 'video' ? 'Video' : 'Phone',
      reason,
      date: new Date(scheduledDate),
      duration,
      status: 'Scheduled',
      roomUrl: type === 'video' ? `https://meet.healrec.com/room/${Date.now()}` : null
    });

    await consultation.save();

    res.status(201).json({
      success: true,
      message: 'Telemedicine consultation scheduled successfully',
      data: { consultation }
    });
  } catch (error) {
    console.error('Schedule consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while scheduling consultation'
    });
  }
});

// @route   GET /api/telemedicine/consultations
// @desc    Get user's telemedicine consultations
// @access   Private
router.get('/consultations', auth, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;
    
    const query = { 
      patientId: req.user._id,
      type: { $in: ['Video', 'Phone'] }
    };

    if (status !== 'all') {
      query.status = status;
    }

    const consultations = await Appointment.find(query)
      .populate('doctorId', 'name specialty')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: {
        consultations,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching consultations'
    });
  }
});

// @route   POST /api/telemedicine/rooms/:roomId/join
// @desc    Join video consultation room
// @access   Private
router.post('/rooms/:roomId/join', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    res.json({
      success: true,
      message: 'Room access granted',
      data: {
        roomId,
        userId: req.user._id,
        accessToken: 'mock-jwt-token-for-video-room',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        permissions: ['video', 'audio', 'chat', 'screen_share']
      }
    });
  } catch (error) {
    console.error('Join room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while joining room'
    });
  }
});

// @route   POST /api/telemedicine/rooms/:roomId/end
// @desc    End video consultation
// @access   Private
router.post('/rooms/:roomId/end', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { duration, notes = '', rating } = req.body;
    
    // Update appointment status to completed
    await Appointment.findOneAndUpdate(
      { roomUrl: { $regex: roomId } },
      { $set: { status: 'Completed', notes } }
    );

    res.json({
      success: true,
      message: 'Consultation ended successfully'
    });
  } catch (error) {
    console.error('End consultation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ending consultation'
    });
  }
});

// @route   GET /api/telemedicine/specialties
// @desc    Get available telemedicine specialties
// @access   Private
router.get('/specialties', auth, async (req, res) => {
  try {
    const specialties = [
      { id: 'primary', name: 'Primary Care', description: 'General health and preventive care' },
      { id: 'mental', name: 'Mental Health', description: 'Psychiatry and psychology services' },
      { id: 'cardiology', name: 'Cardiology', description: 'Heart and cardiovascular health' },
      { id: 'dermatology', name: 'Dermatology', description: 'Skin conditions and treatments' },
      { id: 'pediatrics', name: 'Pediatrics', description: 'Children\'s healthcare' }
    ];

    res.json({
      success: true,
      data: { specialties }
    });
  } catch (error) {
    console.error('Get specialties error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching specialties'
    });
  }
});

// @route   POST /api/telemedicine/prescriptions
// @desc    Send prescription after consultation
// @access   Private
router.post('/prescriptions', auth, [
  body('consultationId').notEmpty().withMessage('Consultation ID is required'),
  body('medications').isArray().withMessage('Medications must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    res.status(201).json({
      success: true,
      message: 'Prescription sent successfully'
    });
  } catch (error) {
    console.error('Send prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending prescription'
    });
  }
});

export default router;
