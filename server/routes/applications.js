import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import Application from '../models/Application.js';
import Job from '../models/Job.js';

const router = express.Router();

// Apply for a job
router.post('/', authenticateToken, async (req, res) => {
  if (req.user.user_type !== 'job_seeker') {
    return res.status(403).json({ error: 'Only job seekers can apply for jobs' });
  }
  try {
    const { job_id, cover_letter, resume_url } = req.body;
    if (!job_id) return res.status(400).json({ error: 'Job ID is required' });

    const job = await Job.findOne({ _id: job_id, status: 'active' }).lean();
    if (!job) return res.status(404).json({ error: 'Job not found or no longer active' });

    const existing = await Application.findOne({ job_id, applicant_id: req.user.id }).lean();
    if (existing) return res.status(400).json({ error: 'You have already applied for this job' });

    const app = await Application.create({ job_id, applicant_id: req.user.id, cover_letter, resume_url });
    await Job.updateOne({ _id: job_id }, { $inc: { applications_count: 1 } });

    res.status(201).json({
      message: 'Application submitted successfully',
      applicationId: app._id.toString(),
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get user's applications (job seekers)
router.get('/my-applications', authenticateToken, async (req, res) => {
  if (req.user.user_type !== 'job_seeker') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const apps = await Application.find({ applicant_id: req.user.id })
      .populate({ path: 'job_id', select: 'title company_name location employment_type salary_min salary_max' })
      .sort({ applied_at: -1 })
      .lean();

    const mapped = apps.map(a => ({
      id: a._id.toString(),
      job_id: a.job_id?._id?.toString?.() || (a.job_id && typeof a.job_id === 'string' ? a.job_id : ''),
      applicant_id: a.applicant_id?.toString?.() || a.applicant_id,
      status: a.status,
      cover_letter: a.cover_letter,
      resume_url: a.resume_url,
      applied_at: a.applied_at,
      updated_at: a.updated_at,
      job_title: a.job_id?.title,
      company_name: a.job_id?.company_name,
      location: a.job_id?.location,
      employment_type: a.job_id?.employment_type,
      salary_min: a.job_id?.salary_min,
      salary_max: a.job_id?.salary_max,
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get applications for employer's jobs
router.get('/received', authenticateToken, async (req, res) => {
  if (req.user.user_type !== 'employer') {
    return res.status(403).json({ error: 'Access denied' });
  }
  try {
    const employerJobs = await Job.find({ posted_by: req.user.id }).select('_id').lean();
    const jobIds = employerJobs.map(j => j._id);
    const apps = await Application.find({ job_id: { $in: jobIds } })
      .populate({ path: 'job_id', select: 'title company_name' })
      .populate({ path: 'applicant_id', select: 'full_name email phone skills experience_years' })
      .sort({ applied_at: -1 })
      .lean();

    const mapped = apps.map(a => ({
      id: a._id.toString(),
      job_id: a.job_id?._id?.toString?.(),
      applicant_id: a.applicant_id?._id?.toString?.(),
      status: a.status,
      cover_letter: a.cover_letter,
      resume_url: a.resume_url,
      applied_at: a.applied_at,
      updated_at: a.updated_at,
      job_title: a.job_id?.title,
      company_name: a.job_id?.company_name,
      applicant_name: a.applicant_id?.full_name,
      applicant_email: a.applicant_id?.email,
      applicant_phone: a.applicant_id?.phone,
      applicant_skills: a.applicant_id?.skills || [],
      experience_years: a.applicant_id?.experience_years,
    }));
    res.json(mapped);
  } catch (e) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Update application status (employers only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  if (req.user.user_type !== 'employer') {
    return res.status(403).json({ error: 'Only employers can update application status' });
  }

  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'reviewed', 'interviewed', 'accepted', 'rejected'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const application = await Application.findById(id);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    const job = await Job.findOne({ _id: application.job_id, posted_by: req.user.id }).lean();
    if (!job) return res.status(404).json({ error: 'Application not found' });

    await Application.updateOne({ _id: id }, { status });
    res.json({ message: 'Application status updated successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;