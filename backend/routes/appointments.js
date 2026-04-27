import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';

import { Appointment } from '../models/Appointment.js';

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments for a user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const { status = 'upcoming', page = 1, limit = 10 } = req.query;
    
    const query = { patientId: req.user._id };
    
    const now = new Date();
    if (status === 'upcoming') {
      query['dateTime.date'] = { $gte: now };
      query.status = { $nin: ['Cancelled', 'Completed', 'No Show'] };
    } else if (status === 'past') {
      query.$or = [
        { 'dateTime.date': { $lt: now } },
        { status: { $in: ['Completed', 'Cancelled', 'No Show'] } }
      ];
    } else if (status !== 'all') {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const appointments = await Appointment.find(query)
      .sort({ 'dateTime.date': status === 'upcoming' ? 1 : -1 })
      .populate('doctorId', 'name avatar specialty')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: {
        appointments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching appointments'
    });
  }
});

// @route   POST /api/appointments
// @desc    Schedule new appointment
// @access   Private
router.post('/', auth, [
  body('doctorId').notEmpty().withMessage('Doctor ID is required'),
  body('specialty').notEmpty().withMessage('Specialty is required'),
  body('dateTime.date').isISO8601().withMessage('Valid appointment date is required'),
  body('dateTime.duration').isInt({ min: 15, max: 180 }).withMessage('Duration must be between 15-180 minutes'),
  body('type').isIn(['In-person', 'Video', 'Phone']).withMessage('Invalid appointment type'),
  body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Reason must be between 5-500 characters')
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

    const appointment = new Appointment({
      ...req.body,
      patientId: req.user._id,
      status: 'Scheduled'
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Schedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while scheduling appointment'
    });
  }
});

// @route   GET /api/appointments/available-slots
// @desc    Get available appointment slots
// @access   Private
router.get('/available-slots', auth, async (req, res) => {
  try {
    const { doctorId, date, specialty } = req.query;
    
    // For now, return mock slots until doctor schedule model is implemented
    const availableSlots = [
      { date, slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'] }
    ];

    res.json({
      success: true,
      data: { availableSlots }
    });
  } catch (error) {
    console.error('Get available slots error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching available slots'
    });
  }
});

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access   Private
router.put('/:id', auth, [
  body('dateTime.date').optional().isISO8601(),
  body('status').optional().isIn(['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show']),
  body('notes').optional().isArray()
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

    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating appointment'
    });
  }
});

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, patientId: req.user._id },
      { 
        $set: { 
          status: 'Cancelled',
          'cancellation.reason': req.body.reason || 'Cancelled by patient',
          'cancellation.cancelledBy': req.user._id,
          'cancellation.cancelledAt': new Date()
        } 
      },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: { appointment }
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling appointment'
    });
  }
});

// @route   POST /api/appointments/:id/join-video
// @desc    Join video consultation
// @access   Private
router.post('/:id/join-video', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.params.id, patientId: req.user._id });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.type !== 'Video') {
      return res.status(400).json({
        success: false,
        message: 'This is not a video appointment'
      });
    }

    const videoRoom = {
      appointmentId: appointment._id,
      roomUrl: appointment.location.virtualLink || `https://meet.healrec.com/room/${appointment._id}`,
      accessToken: 'mock-jwt-token-for-video-room',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    };

    res.json({
      success: true,
      message: 'Video room access granted',
      data: videoRoom
    });
  } catch (error) {
    console.error('Join video error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while joining video consultation'
    });
  }
});

export default router;
