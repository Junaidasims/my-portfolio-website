import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, trim: true, default: "" },
    shortDescription: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "" },
    education: { type: String, trim: true, default: "" },
    careerGoals: { type: String, trim: true, default: "" },
    techInterests: { type: String, trim: true, default: "" },
    /** Relative URL path served under /uploads/... */
    resume: { type: String, trim: true, default: "" },
    profileImage: { type: String, trim: true, default: "" },
    contactEmail: { type: String, trim: true, default: "" },
    linkedInUrl: { type: String, trim: true, default: "" },
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("User", userSchema);
