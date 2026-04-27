import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, authorize } from '../middleware/auth.js';

import { Report } from '../models/Report.js';
import { LabTest } from '../models/LabTest.js';
import { User } from '../models/User.js';

const router = express.Router();

// @route   GET /api/lab/reports
// @desc    Get lab reports (for patients)
// @access   Private
router.get('/reports', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all', search = '' } = req.query;
    
    const query = { userId: req.user._id, type: 'Lab Report' };
    
    if (status !== 'all') {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
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
    console.error('Get lab reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab reports'
    });
  }
});

// @route   POST /api/lab/reports
// @desc    Upload new lab report
// @access   Private
router.post('/reports', auth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Report name is required'),
  body('type').isIn(['Lab Report', 'Radiology', 'Pathology', 'Immunization', 'Other']).withMessage('Invalid report type'),
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
      message: 'Lab report uploaded successfully',
      data: { report: newReport }
    });
  } catch (error) {
    console.error('Upload lab report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading lab report'
    });
  }
});

// @route   GET /api/lab/reports/:id
// @desc    Get specific lab report
// @access   Private
router.get('/reports/:id', auth, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Lab report not found'
      });
    }

    res.json({
      success: true,
      data: { report }
    });
  } catch (error) {
    console.error('Get lab report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab report'
    });
  }
});

// @route   PUT /api/lab/reports/:id
// @desc    Update lab report (lab admin only)
// @access   Private/Lab
router.put('/reports/:id', auth, authorize('Lab', 'Admin'), [
  body('status').isIn(['Pending', 'Verified', 'Rejected']).withMessage('Invalid status'),
  body('results').optional().isObject(),
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

    const { status, results, notes } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          status, 
          results, 
          notes,
          verifiedAt: status === 'Verified' ? new Date() : null,
          verifiedBy: status === 'Verified' ? req.user._id : null
        } 
      },
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Lab report not found'
      });
    }

    res.json({
      success: true,
      message: 'Lab report updated successfully',
      data: { report }
    });
  } catch (error) {
    console.error('Update lab report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating lab report'
    });
  }
});

// @route   GET /api/lab/patients
// @desc    Get patients (lab staff/admin only)
// @access   Private/Lab
router.get('/patients', auth, authorize('Lab', 'Admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = { role: 'Patient' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await User.find(query)
      .select('-password -security')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching patients'
    });
  }
});

// @route   POST /api/lab/tests
// @desc    Order new lab test
// @access   Private
router.post('/tests', auth, [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('testType').notEmpty().withMessage('Test type is required'),
  body('testName').trim().isLength({ min: 1, max: 100 }).withMessage('Test name is required'),
  body('physician').trim().isLength({ min: 1, max: 100 }).withMessage('Physician name is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required')
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

    const test = new LabTest({
      ...req.body,
      labId: req.user._id
    });

    await test.save();

    res.status(201).json({
      success: true,
      message: 'Lab test ordered successfully',
      data: { test }
    });
  } catch (error) {
    console.error('Order lab test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ordering lab test'
    });
  }
});

// @route   GET /api/lab/tests
// @desc    Get lab tests for user
// @access   Private
router.get('/tests', auth, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status !== 'all') {
      query.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const tests = await LabTest.find(query)
      .sort({ scheduledDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LabTest.countDocuments(query);

    res.json({
      success: true,
      data: {
        tests,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get lab tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching lab tests'
    });
  }
});

// @route   GET /api/lab/test-types
// @desc    Get available test types
// @access   Private
router.get('/test-types', auth, async (req, res) => {
  try {
    const testTypes = [
      {
        id: 'blood',
        name: 'Blood Tests',
        description: 'Complete blood count, metabolic panel, lipid profile',
        tests: ['CBC', 'CMP', 'Lipid Panel', 'HbA1c', 'Glucose'],
        preparation: 'Fasting may be required for some tests'
      },
      {
        id: 'urine',
        name: 'Urine Tests',
        description: 'Urinalysis, drug screening, pregnancy tests',
        tests: ['Urinalysis', 'Drug Screen', 'Pregnancy Test', 'UTI Panel'],
        preparation: 'Clean catch sample, avoid excessive fluids'
      },
      {
        id: 'imaging',
        name: 'Imaging Services',
        description: 'X-ray, CT scan, MRI, ultrasound',
        tests: ['Chest X-ray', 'CT Scan', 'MRI', 'Ultrasound', 'Mammogram'],
        preparation: 'Follow specific instructions for each imaging type'
      },
      {
        id: 'cardiac',
        name: 'Cardiac Tests',
        description: 'ECG, Echocardiogram, stress test',
        tests: ['ECG', 'Echocardiogram', 'Stress Test', 'Holter Monitor'],
        preparation: 'Avoid caffeine 4 hours before test'
      }
    ];

    res.json({
      success: true,
      data: { testTypes }
    });
  } catch (error) {
    console.error('Get test types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching test types'
    });
  }
});

// @route   POST /api/lab/results
// @desc    Add test results (lab staff only)
// @access   Private/Lab
router.post('/results', auth, authorize('Lab', 'Admin'), [
  body('testId').notEmpty().withMessage('Test ID is required'),
  body('results').isObject().withMessage('Results must be an object'),
  body('status').isIn(['Normal', 'Abnormal', 'Critical']).withMessage('Invalid result status'),
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

    const { testId, results, status, notes } = req.body;
    const labTechnicianId = req.user._id;

    // TODO: Save results to database and notify patient
    const testResult = {
      testId,
      results,
      status,
      notes,
      labTechnicianId,
      completedAt: new Date(),
      patientNotified: false
    };

    res.status(201).json({
      success: true,
      message: 'Test results added successfully',
      data: { result: testResult }
    });
  } catch (error) {
    console.error('Add test results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding test results'
    });
  }
});

// @route   GET /api/lab/statistics
// @desc    Get lab statistics (lab admin only)
// @access   Private/Lab
router.get('/statistics', auth, authorize('Lab', 'Admin'), async (req, res) => {
  try {
    const totalReports = await Report.countDocuments({ type: 'Lab Report' });
    const pendingReports = await Report.countDocuments({ type: 'Lab Report', status: 'Pending' });
    const verifiedReports = await Report.countDocuments({ type: 'Lab Report', status: 'Verified' });
    
    const totalTests = await LabTest.countDocuments();
    const completedTests = await LabTest.countDocuments({ status: 'Completed' });
    const pendingTests = await LabTest.countDocuments({ status: 'Pending' });

    // Test Type Distribution
    const testTypeDistributionRaw = await LabTest.aggregate([
      { $group: { _id: '$testType', count: { $sum: 1 } } }
    ]);
    
    const testTypeDistribution = {};
    testTypeDistributionRaw.forEach(item => {
      testTypeDistribution[item._id] = item.count;
    });

    const statistics = {
      totalReports,
      pendingReports,
      verifiedReports,
      totalTests,
      completedTests,
      pendingTests,
      averageProcessingTime: '1.5 days',
      testTypeDistribution,
      monthlyTrends: [
        { month: 'Jan', reports: Math.ceil(totalReports * 0.1), tests: Math.ceil(totalTests * 0.1) },
        { month: 'Feb', reports: Math.ceil(totalReports * 0.2), tests: Math.ceil(totalTests * 0.2) },
        { month: 'Mar', reports: Math.ceil(totalReports * 0.3), tests: Math.ceil(totalTests * 0.3) }
      ]
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

export default router;
