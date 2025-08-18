import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    user_type: { type: String, enum: ['job_seeker', 'employer'], required: true },
    phone: { type: String },
    location: { type: String },
    company_name: { type: String },
    company_description: { type: String },
    website: { type: String },
    resume_url: { type: String },
    skills: { type: [String], default: [] },
    experience_years: { type: Number },
  },
  { timestamps: true }
);

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.password) delete ret.password;
    ret.created_at = ret.createdAt;
    ret.updated_at = ret.updatedAt;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;


