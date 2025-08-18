import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema(
  {
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'interviewed', 'accepted', 'rejected'], default: 'pending' },
    cover_letter: { type: String },
    resume_url: { type: String },
  },
  { timestamps: { createdAt: 'applied_at', updatedAt: 'updated_at' } }
);

ApplicationSchema.index({ job_id: 1, applicant_id: 1 }, { unique: true });

ApplicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
export default Application;


