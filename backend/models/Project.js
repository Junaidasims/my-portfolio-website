import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    techStack: [{ type: String, trim: true }],
    githubLink: { type: String, trim: true, default: "" },
    liveLink: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default mongoose.model("Project", projectSchema);
