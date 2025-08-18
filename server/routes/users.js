import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Job from '../models/Job.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    delete user.password;
    user.id = user._id.toString();
    delete user._id;
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.skills && !Array.isArray(update.skills)) delete update.skills;
    const result = await User.findByIdAndUpdate(req.user.id, update, { new: true }).lean();
    if (!result) return res.status(404).json({ error: 'User not found' });
    delete result.password;
    result.id = result._id.toString();
    delete result._id;
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get employer's jobs
router.get('/my-jobs', authenticateToken, async (req, res) => {
  if (req.user.user_type !== 'employer') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const jobs = await Job.find({ posted_by: req.user.id }).sort({ createdAt: -1 }).lean();
    const mapped = jobs.map(j => ({
      ...j,
      id: j._id.toString(),
      created_at: j.createdAt,
      updated_at: j.updatedAt,
      _id: undefined,
      __v: undefined,
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;