import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Job from '../models/Job.js';

const router = express.Router();

// Get all jobs with filtering
router.get('/', async (req, res) => {
  try {
    const { search, location, employment_type, salary_min } = req.query;

    const filter = { status: 'active' };
    if (search) {
      const regex = new RegExp(String(search), 'i');
      Object.assign(filter, { $or: [ { title: regex }, { description: regex }, { company_name: regex } ] });
    }
    if (location) Object.assign(filter, { location: new RegExp(String(location), 'i') });
    if (employment_type) Object.assign(filter, { employment_type });
    if (salary_min) Object.assign(filter, { salary_min: { $gte: Number(salary_min) } });

    const jobs = await Job.find(filter).sort({ createdAt: -1 }).lean();
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

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).lean();
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const mapped = {
      ...job,
      id: job._id.toString(),
      created_at: job.createdAt,
      updated_at: job.updatedAt,
    };
    delete mapped._id;
    delete mapped.__v;
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Create job (employers only)
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.user_type !== 'employer') {
    return res.status(403).json({ error: 'Only employers can post jobs' });
  }
  try {
    const {
      title,
      description,
      requirements,
      company_name,
      location,
      employment_type,
      salary_min,
      salary_max,
      experience_required,
      skills_required
    } = req.body;

    if (!title || !description || !requirements || !company_name || !location || !employment_type || !experience_required) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const job = await Job.create({
      title,
      description,
      requirements,
      company_name,
      location,
      employment_type,
      salary_min,
      salary_max,
      experience_required,
      skills_required: Array.isArray(skills_required) ? skills_required : [],
      posted_by: req.user.id,
    });

    res.status(201).json({
      message: 'Job posted successfully',
      jobId: job._id.toString(),
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findOne({ _id: id, posted_by: req.user.id });
    if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });

    const updates = { ...req.body };
    if (updates.skills_required && !Array.isArray(updates.skills_required)) delete updates.skills_required;

    await Job.updateOne({ _id: id }, updates);
    res.json({ message: 'Job updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Job.deleteOne({ _id: id, posted_by: req.user.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;