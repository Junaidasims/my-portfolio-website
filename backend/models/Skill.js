import mongoose from "mongoose";

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const skillSchema = new mongoose.Schema(
  {
    skillName: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: LEVELS,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const SKILL_LEVELS = LEVELS;
export default mongoose.model("Skill", skillSchema);
