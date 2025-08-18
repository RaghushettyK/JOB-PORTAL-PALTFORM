import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    company_name: { type: String, required: true },
    location: { type: String, required: true },
    employment_type: { type: String, enum: ['full-time', 'part-time', 'contract', 'remote'], required: true },
    salary_min: { type: Number },
    salary_max: { type: Number },
    experience_required: { type: String, required: true },
    skills_required: { type: [String], default: [] },
    posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'inactive', 'filled'], default: 'active' },
    applications_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JobSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
export default Job;


