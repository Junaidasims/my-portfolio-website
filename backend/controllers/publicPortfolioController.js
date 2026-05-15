import mongoose from "mongoose";
import fs from "fs";
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import { absoluteUploadPath } from "../config/upload.js";

function publicUser(u) {
  if (!u) return null;
  return {
    _id: u._id,
    name: u.name,
    role: u.role,
    shortDescription: u.shortDescription,
    bio: u.bio,
    education: u.education,
    careerGoals: u.careerGoals,
    techInterests: u.techInterests,
    profileImage: u.profileImage,
    hasResume: Boolean(u.resume),
    profileCompleted: u.profileCompleted,
  };
}

export async function getPublicPortfolio(req, res, next) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      const err = new Error("Invalid user id");
      err.statusCode = 400;
      return next(err);
    }
    const user = await User.findById(userId).lean();
    if (!user || !user.profileCompleted) {
      const err = new Error("Portfolio not found");
      err.statusCode = 404;
      return next(err);
    }
    const [skills, projects] = await Promise.all([
      Skill.find({ userId }).sort({ createdAt: 1 }).lean(),
      Project.find({ userId }).sort({ createdAt: -1 }).lean(),
    ]);
    res.json({
      success: true,
      data: {
        user: publicUser(user),
        skills,
        projects,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function downloadPublicResume(req, res, next) {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      const err = new Error("Invalid user id");
      err.statusCode = 400;
      return next(err);
    }
    const user = await User.findById(userId).lean();
    if (!user?.resume || !user.profileCompleted) {
      const err = new Error("Resume not available");
      err.statusCode = 404;
      return next(err);
    }
    const rel = user.resume.replace(/^\//, "");
    const abs = absoluteUploadPath(rel);
    if (!fs.existsSync(abs)) {
      const err = new Error("Resume file missing");
      err.statusCode = 404;
      return next(err);
    }
    res.download(abs, `${user.name || "resume"}.pdf`);
  } catch (e) {
    next(e);
  }
}
