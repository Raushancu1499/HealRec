import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { EmergencyContact } from '../models/EmergencyContact.js';
import { User } from '../models/User.js';

const router = express.Router();

// @route   POST /api/emergency/sos
// @desc    Trigger emergency SOS alert
// @access   Private
router.post('/sos', auth, [
  body('location').optional().isObject(),
  body('emergencyType').optional().isString(),
  body('notes').optional().isString()
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

    const { location, emergencyType, notes } = req.body;
    const userId = req.user._id;

    // In a real app, this would trigger external alerts
    const emergencyAlert = {
      id: Date.now(),
      userId,
      location: location || {
        address: 'Current location not available',
        coordinates: null
      },
      emergencyType: emergencyType || 'Medical Emergency',
      notes,
      timestamp: new Date(),
      status: 'Active'
    };
    
    console.log('EMERGENCY SOS TRIGGERED:', emergencyAlert);

    res.status(201).json({
      success: true,
      message: 'Emergency alert activated',
      data: { 
        alert: emergencyAlert,
        instructions: 'Stay calm. Emergency contacts and services are being notified.'
      }
    });
  } catch (error) {
    console.error('Emergency SOS error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during emergency activation'
    });
  }
});

// @route   GET /api/emergency/contacts
// @desc    Get emergency contacts
// @access   Private
router.get('/contacts', auth, async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user._id });
    
    res.json({
      success: true,
      data: { contacts }
    });
  } catch (error) {
    console.error('Get emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching emergency contacts'
    });
  }
});

// @route   POST /api/emergency/contacts
// @desc    Add emergency contact
// @access   Private
router.post('/contacts', auth, [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
  body('phone').notEmpty().withMessage('Please provide a valid phone number'),
  body('type').isIn(['doctor', 'family', 'hospital', 'emergency']).withMessage('Invalid contact type'),
  body('relation').trim().isLength({ min: 2, max: 30 }).withMessage('Relation must be between 2-30 characters')
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

    const newContact = new EmergencyContact({
      ...req.body,
      userId: req.user._id
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: { contact: newContact }
    });
  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding emergency contact'
    });
  }
});

// @route   GET /api/emergency/medical-info
// @desc    Get medical information for emergency responders
// @access   Private
router.get('/medical-info', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('profile.medicalInfo name');
    
    // If user doesn't have medicalInfo field, provide some defaults based on schema
    const medicalInfo = user.profile?.medicalInfo || {
      bloodType: 'Unknown',
      allergies: [],
      conditions: [],
      medications: [],
      emergencyContact: 'Not set',
      medicalId: user._id
    };
    
    res.json({
      success: true,
      data: { medicalInfo }
    });
  } catch (error) {
    console.error('Get medical info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching medical information'
    });
  }
});

// @route   GET /api/emergency/hospitals
// @desc    Get nearby hospitals
// @access   Private
router.get('/hospitals', auth, async (req, res) => {
  try {
    const { radius = 10 } = req.query;
    
    // Mock nearby hospitals (in real app, use Google Maps API)
    const hospitals = [
      {
        id: 1,
        name: 'City General Hospital',
        address: '123 Medical Center Dr',
        distance: '0.8 miles',
        phone: '(555) 456-7890',
        emergency: true,
        rating: 4.5,
        waitTime: '15 min',
        specialties: ['Emergency', 'Cardiology', 'Trauma']
      }
    ];
    
    res.json({
      success: true,
      data: { 
        hospitals,
        searchRadius: `${radius} miles`
      }
    });
  } catch (error) {
    console.error('Get hospitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while finding nearby hospitals'
    });
  }
});

// @route   GET /api/emergency/protocols
// @desc    Get emergency response protocols
// @access   Private
router.get('/protocols', auth, async (req, res) => {
  try {
    const protocols = [
      {
        id: 1,
        title: 'Heart Attack',
        symptoms: ['Chest pain', 'Shortness of breath', 'Pain in arm/jaw'],
        actions: ['Call 911 immediately', 'Chew aspirin if available', 'Stay calm and rest'],
        icon: 'heart'
      },
      {
        id: 2,
        title: 'Stroke',
        symptoms: ['Face drooping', 'Arm weakness', 'Speech difficulty'],
        actions: ['Call 911 immediately', 'Note time symptoms started', 'Don\'t give food/drink'],
        icon: 'brain'
      }
    ];
    
    res.json({
      success: true,
      data: { protocols }
    });
  } catch (error) {
    console.error('Get protocols error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching emergency protocols'
    });
  }
});

// @route   POST /api/emergency/test-alert
// @desc    Test emergency alert system
// @access   Private
router.post('/test-alert', auth, [
  body('contactId').notEmpty().withMessage('Contact ID is required'),
  body('message').optional().isString().withMessage('Message must be a string')
], async (req, res) => {
  try {
    const { contactId, message = 'This is a test emergency alert from HealRec' } = req.body;

    const contact = await EmergencyContact.findOne({ _id: contactId, userId: req.user._id });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.json({
      success: true,
      message: `Test alert sent to ${contact.name}`,
      data: { 
        sentAt: new Date(),
        status: 'Sent'
      }
    });
  } catch (error) {
    console.error('Test alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending test alert'
    });
  }
});

// @route   GET /api/emergency/location
// @desc    Get current location for emergency services
// @access   Private
router.get('/location', auth, async (req, res) => {
  try {
    const location = {
      address: 'Current Device Location',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      timestamp: new Date()
    };

    res.json({
      success: true,
      data: { location }
    });
  } catch (error) {
    console.error('Get location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting location'
    });
  }
});

export default router;
