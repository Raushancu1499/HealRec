import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { FamilyMember } from '../models/FamilyMember.js';
import { CareActivity } from '../models/CareActivity.js';

const router = express.Router();

// @route   GET /api/family/members
// @desc    Get family members
// @access   Private
router.get('/members', auth, async (req, res) => {
  try {
    const members = await FamilyMember.find({ userId: req.user._id });
    
    res.json({
      success: true,
      data: { members }
    });
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching family members'
    });
  }
});

// @route   POST /api/family/invite
// @desc    Invite family member
// @access   Private
router.post('/invite', auth, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('relationship').trim().isLength({ min: 2, max: 30 }).withMessage('Relationship must be between 2-30 characters'),
  body('permissions').isArray().withMessage('Permissions must be an array'),
  body('message').optional().isString().withMessage('Message must be a string')
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

    const { email, relationship, permissions, message } = req.body;
    
    const member = new FamilyMember({
      userId: req.user._id,
      name: email.split('@')[0], // Use email prefix as name initially
      email,
      relationship,
      permissions,
      status: 'pending'
    });

    await member.save();

    res.status(201).json({
      success: true,
      message: 'Family invitation sent successfully',
      data: { invitation: member }
    });
  } catch (error) {
    console.error('Invite family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending invitation'
    });
  }
});

// @route   GET /api/family/invites
// @desc    Get pending invitations
// @access   Private
router.get('/invites', auth, async (req, res) => {
  try {
    const pendingInvites = await FamilyMember.find({ 
      userId: req.user._id,
      status: 'pending'
    });
    
    res.json({
      success: true,
      data: { pendingInvites }
    });
  } catch (error) {
    console.error('Get invitations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching invitations'
    });
  }
});

// @route   PUT /api/family/members/:id/permissions
// @desc    Update member permissions
// @access   Private
router.put('/members/:id/permissions', auth, [
  body('permissions').isArray().withMessage('Permissions must be an array')
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

    const member = await FamilyMember.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { permissions: req.body.permissions } },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json({
      success: true,
      message: 'Member permissions updated successfully',
      data: { member }
    });
  } catch (error) {
    console.error('Update permissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating permissions'
    });
  }
});

// @route   GET /api/family/activities
// @desc    Get family care activities
// @access   Private
router.get('/activities', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, memberId } = req.query;
    
    const query = { userId: req.user._id };
    if (memberId) query.memberId = memberId;

    const activities = await CareActivity.find(query)
      .sort({ createdAt: -1 })
      .populate('memberId', 'name relationship')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CareActivity.countDocuments(query);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activities'
    });
  }
});

// @route   POST /api/family/activities
// @desc    Log care activity
// @access   Private
router.post('/activities', auth, [
  body('memberId').notEmpty().withMessage('Member ID is required'),
  body('activity').trim().isLength({ min: 2, max: 100 }).withMessage('Activity must be between 2-100 characters'),
  body('description').trim().isLength({ min: 5, max: 500 }).withMessage('Description must be between 5-500 characters'),
  body('type').isIn(['medication', 'appointment', 'health_metric', 'emergency']).withMessage('Invalid activity type')
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

    const activity = new CareActivity({
      ...req.body,
      userId: req.user._id,
      caregiver: req.user.name,
      loggedBy: req.user._id
    });

    await activity.save();

    res.status(201).json({
      success: true,
      message: 'Care activity logged successfully',
      data: { activity }
    });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while logging activity'
    });
  }
});

// @route   GET /api/family/health-alerts
// @desc    Get health alerts for family members
// @access   Private
router.get('/health-alerts', auth, async (req, res) => {
  try {
    // Basic health alerts logic - in real app, this would be more complex
    const members = await FamilyMember.find({ userId: req.user._id, healthScore: { $lt: 90 } });
    
    const healthAlerts = members.map(m => ({
      id: m._id,
      memberId: m._id,
      memberName: m.name,
      type: 'health_score',
      severity: m.healthScore < 70 ? 'high' : 'medium',
      message: `Health score for ${m.name} is low: ${m.healthScore}%`,
      time: 'Just now',
      action: 'view_details'
    }));

    res.json({
      success: true,
      data: { healthAlerts }
    });
  } catch (error) {
    console.error('Get health alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching health alerts'
    });
  }
});

// @route   DELETE /api/family/members/:id
// @desc    Remove family member
// @access   Private
router.delete('/members/:id', auth, async (req, res) => {
  try {
    const member = await FamilyMember.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json({
      success: true,
      message: 'Family member removed successfully'
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing family member'
    });
  }
});

// @route   POST /api/family/members/:id/share-data
// @desc    Share medical data with member
// @access   Private
router.post('/members/:id/share-data', auth, [
  body('dataTypes').isArray().withMessage('Data types must be an array'),
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

    const member = await FamilyMember.findOne({ _id: req.params.id, userId: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.status(201).json({
      success: true,
      message: 'Medical data shared successfully',
      data: { 
        accessToken: 'mock-access-token-for-sharing',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
  } catch (error) {
    console.error('Share data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sharing medical data'
    });
  }
});

export default router;
