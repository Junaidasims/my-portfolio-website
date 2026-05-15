import fs from "fs";
import User from "../models/User.js";
import Skill from "../models/Skill.js";
import Project from "../models/Project.js";
import { absoluteUploadPath, uploadsPublicPath } from "../config/upload.js";

function sanitizeUser(u) {
  if (!u) return null;
  const o = { ...u };
  delete o.password;
  o.hasResume = Boolean(o.resume);
  return o;
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (e) {
    next(e);
  }
}

export async function patchMe(req, res, next) {
  try {
    const allowed = [
      "name",
      "role",
      "shortDescription",
      "bio",
      "education",
      "careerGoals",
      "techInterests",
      "contactEmail",
      "linkedInUrl",
    ];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.userId, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (e) {
    next(e);
  }
}

/** First-time portfolio completion — required fields before full access */
export async function completeProfile(req, res, next) {
  try {
    const { name, role, shortDescription, bio, education, careerGoals, techInterests } =
      req.body;
    if (!name?.trim() || !role?.trim() || !shortDescription?.trim()) {
      const err = new Error("name, role, and shortDescription are required");
      err.statusCode = 400;
      return next(err);
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: name.trim(),
        role: role.trim(),
        shortDescription: shortDescription.trim(),
        bio: bio?.trim() ?? "",
        education: education?.trim() ?? "",
        careerGoals: careerGoals?.trim() ?? "",
        techInterests: techInterests?.trim() ?? "",
        profileCompleted: true,
      },
      { new: true, runValidators: true }
    ).lean();
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (e) {
    next(e);
  }
}

export async function uploadResume(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error("No file uploaded");
      err.statusCode = 400;
      return next(err);
    }
    const publicPath = uploadsPublicPath(req.userId, "resume.pdf");
    const user = await User.findByIdAndUpdate(
      req.userId,
      { resume: publicPath },
      { new: true }
    ).lean();
    res.json({
      success: true,
      data: { user: sanitizeUser(user), resumeUrl: publicPath },
    });
  } catch (e) {
    next(e);
  }
}

export async function uploadProfileImage(req, res, next) {
  try {
    if (!req.file) {
      const err = new Error("No file uploaded");
      err.statusCode = 400;
      return next(err);
    }
    const publicPath = uploadsPublicPath(req.userId, req.file.filename);
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: publicPath },
      { new: true }
    ).lean();
    res.json({
      success: true,
      data: { user: sanitizeUser(user), profileImageUrl: publicPath },
    });
  } catch (e) {
    next(e);
  }
}

export async function downloadMyResume(req, res, next) {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user?.resume) {
      const err = new Error("No resume uploaded");
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
    res.download(abs, "resume.pdf");
  } catch (e) {
    next(e);
  }
}

export async function getMyPortfolioBundle(req, res, next) {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }
    const [skills, projects] = await Promise.all([
      Skill.find({ userId: req.userId }).sort({ createdAt: 1 }).lean(),
      Project.find({ userId: req.userId }).sort({ createdAt: -1 }).lean(),
    ]);
    res.json({
      success: true,
      data: { user: sanitizeUser(user), skills, projects },
    });
  } catch (e) {
    next(e);
  }
}
