import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Mock health data - in real app, this would come from database
const getMockHealthData = (userId) => ({
  userId,
  metrics: {
    heartRate: { current: 72, average: 68, trend: 'stable' },
    steps: { current: 8432, goal: 10000, trend: 'up' },
    sleep: { current: 7.5, goal: 8, trend: 'stable' },
    water: { current: 6, goal: 8, trend: 'down' },
    weight: { current: 70.5, goal: 68, trend: 'down' },
    bloodPressure: { systolic: 120, diastolic: 80, trend: 'stable' }
  },
  weeklyData: [
    { day: 'Mon', heartRate: 68, steps: 7500, sleep: 7.2, water: 7 },
    { day: 'Tue', heartRate: 72, steps: 9200, sleep: 6.8, water: 8 },
    { day: 'Wed', heartRate: 70, steps: 8100, sleep: 7.5, water: 6 },
    { day: 'Thu', heartRate: 75, steps: 10500, sleep: 8.1, water: 9 },
    { day: 'Fri', heartRate: 71, steps: 8432, sleep: 7.5, water: 6 },
    { day: 'Sat', heartRate: 69, steps: 6800, sleep: 8.3, water: 8 },
    { day: 'Sun', heartRate: 67, steps: 5200, sleep: 7.9, water: 7 }
  ],
  connectedDevices: [
    { id: 1, name: 'Apple Watch Series 8', type: 'watch', connected: true, battery: 85 },
    { id: 2, name: 'iPhone Health', type: 'phone', connected: true, lastSync: '2 min ago' },
    { id: 3, name: 'Fitbit Charge 5', type: 'watch', connected: false, battery: 45 }
  ]
});

// @route   GET /api/health/metrics
// @desc    Get health metrics for a user
// @access   Private
router.get('/metrics', auth, async (req, res) => {
  try {
    const healthData = getMockHealthData(req.user._id);
    
    res.json({
      success: true,
      data: healthData
    });
  } catch (error) {
    console.error('Get health metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching health metrics'
    });
  }
});

// @route   POST /api/health/metrics
// @desc    Add new health metric data
// @access   Private
router.post('/metrics', auth, [
  body('type').isIn(['heartRate', 'steps', 'sleep', 'water', 'weight', 'bloodPressure']).withMessage('Invalid metric type'),
  body('value').isNumeric().withMessage('Value must be numeric'),
  body('unit').optional().isString().withMessage('Unit must be a string'),
  body('timestamp').optional().isISO8601().withMessage('Invalid timestamp format')
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

    const { type, value, unit, timestamp = new Date() } = req.body;

    // In real app, save to database
    const newMetric = {
      userId: req.user._id,
      type,
      value,
      unit,
      timestamp: new Date(timestamp),
      source: 'manual' // Could be 'wearable', 'manual', etc.
    };

    // TODO: Save to database
    console.log('New health metric:', newMetric);

    res.status(201).json({
      success: true,
      message: 'Health metric added successfully',
      data: { metric: newMetric }
    });
  } catch (error) {
    console.error('Add health metric error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding health metric'
    });
  }
});

// @route   GET /api/health/trends
// @desc    Get health trends analysis
// @access   Private
router.get('/trends', auth, async (req, res) => {
  try {
    const { period = 'week', metric = 'all' } = req.query;
    
    // Mock trend data - in real app, calculate from database
    const trends = {
      heartRate: {
        current: 72,
        average: 68,
        trend: 'stable',
        change: '+2%',
        period
      },
      steps: {
        current: 8432,
        average: 7500,
        trend: 'up',
        change: '+12%',
        period
      },
      sleep: {
        current: 7.5,
        average: 7.2,
        trend: 'stable',
        change: '+4%',
        period
      }
    };

    const filteredTrends = metric === 'all' ? trends : { [metric]: trends[metric] };

    res.json({
      success: true,
      data: {
        trends: filteredTrends,
        period
      }
    });
  } catch (error) {
    console.error('Get health trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching health trends'
    });
  }
});

// @route   GET /api/health/predictions
// @desc    Get AI-powered health predictions
// @access   Private
router.get('/predictions', auth, async (req, res) => {
  try {
    // Mock AI predictions - in real app, use ML models
    const predictions = [
      {
        metric: 'Blood Pressure',
        current: '120/80',
        predicted: '118/78',
        timeframe: '3 months',
        confidence: 85,
        factors: ['Exercise consistency', 'Medication adherence', 'Stress management'],
        trend: 'improving'
      },
      {
        metric: 'Weight',
        current: '70.5 kg',
        predicted: '68.2 kg',
        timeframe: '6 months',
        confidence: 78,
        factors: ['Calorie deficit', 'Activity level', 'Metabolism'],
        trend: 'improving'
      }
    ];

    res.json({
      success: true,
      data: { predictions }
    });
  } catch (error) {
    console.error('Get health predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating health predictions'
    });
  }
});

// @route   POST /api/health/devices/sync
// @desc    Sync data from wearable devices
// @access   Private
router.post('/devices/sync', auth, [
  body('deviceId').notEmpty().withMessage('Device ID is required'),
  body('deviceType').isIn(['apple_watch', 'fitbit', 'google_fit']).withMessage('Invalid device type'),
  body('data').isObject().withMessage('Health data must be an object')
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

    const { deviceId, deviceType, data } = req.body;

    // Process and store wearable data
    const syncResult = {
      userId: req.user._id,
      deviceId,
      deviceType,
      syncedAt: new Date(),
      metricsProcessed: Object.keys(data).length,
      success: true
    };

    // TODO: Process and save wearable data to database
    console.log('Device sync result:', syncResult);

    res.json({
      success: true,
      message: 'Device data synced successfully',
      data: syncResult
    });
  } catch (error) {
    console.error('Device sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while syncing device data'
    });
  }
});

// @route   GET /api/health/devices
// @desc    Get connected devices
// @access   Private
router.get('/devices', auth, async (req, res) => {
  try {
    const devices = [
      { id: 1, name: 'Apple Watch Series 8', type: 'watch', connected: true, battery: 85, lastSync: '2 min ago' },
      { id: 2, name: 'iPhone Health', type: 'phone', connected: true, lastSync: '5 min ago' },
      { id: 3, name: 'Fitbit Charge 5', type: 'watch', connected: false, battery: 45 }
    ];

    res.json({
      success: true,
      data: { devices }
    });
  } catch (error) {
    console.error('Get devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching devices'
    });
  }
});

export default router;
