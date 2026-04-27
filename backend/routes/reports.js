import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';

import { Report } from '../models/Report.js';

const router = express.Router();

// @route   GET /api/reports
// @desc    Get all medical reports for a user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all', search = '', type = '' } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status !== 'all') {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    if (type) {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { provider: { $regex: search, $options: 'i' } }
      ];
    }

    const reports = await Report.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Report.countDocuments(query);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reports'
    });
  }
});

// @route   GET /api/reports/types
// @desc    Get available report types
// @access   Private
router.get('/types', auth, async (req, res) => {
  try {
    const reportTypes = [
      { id: 'lab', name: 'Lab Report', description: 'Blood tests, urine tests, pathology reports' },
      { id: 'radiology', name: 'Radiology', description: 'X-rays, CT scans, MRI, ultrasound' },
      { id: 'immunization', name: 'Immunization', description: 'Vaccination records and immunization history' },
      { id: 'prescription', name: 'Prescription', description: 'Medication prescriptions and pharmacy records' },
      { id: 'vital', name: 'Vital Signs', description: 'Blood pressure, heart rate, temperature logs' },
      { id: 'progress', name: 'Progress Notes', description: 'Treatment progress and doctor notes' }
    ];

    res.json({
      success: true,
      data: { reportTypes }
    });
  } catch (error) {
    console.error('Get report types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching report types'
    });
  }
});

// @route   GET /api/reports/statistics
// @desc    Get reports statistics
// @access   Private
router.get('/statistics', auth, async (req, res) => {
  try {
    const { period = 'year' } = req.query;
    
    // Mock statistics
    const statistics = {
      totalReports: 24,
      reportsByType: {
        'Lab Report': 8,
        'Radiology': 6,
        'Immunization': 4,
        'Other': 6
      },
      reportsByStatus: {
        'Verified': 18,
        'Pending': 4,
        'Rejected': 2
      },
      monthlyTrends: [
        { month: 'Jan', count: 2 },
        { month: 'Feb', count: 3 },
        { month: 'Mar', count: 1 },
        { month: 'Apr', count: 4 }
      ],
      storageUsed: '45.2 MB',
      averageFileSize: '1.8 MB'
    };

    res.json({
      success: true,
      data: { statistics }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/reports/:id
// @desc    Get specific medical report
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching report'
    });
  }
});

// @route   POST /api/reports
// @desc    Upload new medical report
// @access   Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Report name is required'),
  body('type').isIn(['Lab Report', 'Radiology', 'Immunization', 'Prescription', 'Vital Signs', 'Progress Notes', 'Other']).withMessage('Invalid report type'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('provider').trim().isLength({ min: 1, max: 100 }).withMessage('Provider name is required')
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

    const { name, type, date, provider, notes } = req.body;
    const userId = req.user._id;

    const newReport = new Report({
      userId,
      name,
      type,
      date: new Date(date),
      provider,
      notes,
      uploadedBy: userId
    });

    await newReport.save();

    res.status(201).json({
      success: true,
      message: 'Report uploaded successfully',
      data: { report: newReport }
    });
  } catch (error) {
    console.error('Upload report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading report'
    });
  }
});

// @route   PUT /api/reports/:id
// @desc    Update medical report
// @access   Private
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('status').optional().isIn(['Pending', 'Verified', 'Rejected']).withMessage('Invalid status'),
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

    const report = await Report.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report updated successfully',
      data: { report }
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating report'
    });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete medical report
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await Report.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting report'
    });
  }
});

// @route   POST /api/reports/:id/share
// @desc    Share medical report
// @access   Private
router.post('/:id/share', auth, [
  body('recipientEmail').isEmail().normalizeEmail().withMessage('Valid recipient email is required'),
  body('message').optional().isString().withMessage('Message must be a string'),
  body('duration').optional().isIn(['1day', '1week', '1month', 'indefinite']).withMessage('Invalid duration')
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

    const { recipientEmail, message, duration = '1week' } = req.body;
    const reportId = req.params.id;

    // TODO: Generate sharing link and send email
    const shareLink = {
      id: Date.now(),
      reportId,
      sharedBy: req.user._id,
      recipientEmail,
      message,
      duration,
      createdAt: new Date(),
      expiresAt: duration === 'indefinite' ? null : new Date(Date.now() + getDurationMs(duration)),
      accessToken: 'mock-access-token-for-sharing',
      shareUrl: `https://healrec.com/shared/${Date.now()}`
    };

    function getDurationMs(duration) {
      const durations = {
        '1day': 24 * 60 * 60 * 1000,
        '1week': 7 * 24 * 60 * 60 * 1000,
        '1month': 30 * 24 * 60 * 60 * 1000
      };
      return durations[duration] || 7 * 24 * 60 * 60 * 1000; // default to 1 week
    }

    res.status(201).json({
      success: true,
      message: 'Report shared successfully',
      data: { share: shareLink }
    });
  } catch (error) {
    console.error('Share report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sharing report'
    });
  }
});

export default router;
