import express from 'express';
import { body, validationResult } from 'express-validator';
import { Medication } from '../models/Medication.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/medications
// @desc    Get all medications for a user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all', search = '' } = req.query;
    
    const query = { userId: req.user._id };
    
    if (status !== 'all') {
      query.isActive = status === 'active';
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const medications = await Medication.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Medication.countDocuments(query);

    res.json({
      success: true,
      data: {
        medications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching medications'
    });
  }
});

// @route   POST /api/medications
// @desc    Add new medication
// @access   Private
router.post('/', auth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Medication name is required'),
  body('dosage').trim().isLength({ min: 1, max: 50 }).withMessage('Dosage is required'),
  body('frequency').isIn(['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'As needed']).withMessage('Invalid frequency'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('times').optional().isArray(),
  body('times.*').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format')
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

    const medicationData = {
      ...req.body,
      userId: req.user._id
    };

    const medication = new Medication(medicationData);
    await medication.save();

    res.status(201).json({
      success: true,
      message: 'Medication added successfully',
      data: { medication }
    });
  } catch (error) {
    console.error('Add medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding medication'
    });
  }
});

// @route   PUT /api/medications/:id
// @desc    Update medication
// @access   Private
router.put('/:id', auth, async (req, res) => {
  try {
    let medication = await Medication.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    medication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Medication updated successfully',
      data: { medication }
    });
  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating medication'
    });
  }
});

// @route   DELETE /api/medications/:id
// @desc    Delete medication
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const medication = await Medication.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    await medication.deleteOne();

    res.json({
      success: true,
      message: 'Medication deleted successfully'
    });
  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting medication'
    });
  }
});

// @route   POST /api/medications/:id/take
// @desc    Mark medication as taken
// @access   Private
router.post('/:id/take', auth, async (req, res) => {
  try {
    const medication = await Medication.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    medication.adherence.takenDoses += 1;
    medication.adherence.lastTaken = new Date();
    medication.adherence.streak += 1;
    
    if (medication.remainingSupply) {
      medication.remainingSupply -= 1;
    }

    await medication.save();

    res.json({
      success: true,
      message: 'Medication marked as taken',
      data: { medication }
    });
  } catch (error) {
    console.error('Take medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating medication'
    });
  }
});

export default router;
