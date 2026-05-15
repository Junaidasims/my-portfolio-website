import mongoose from "mongoose";
import Skill, { SKILL_LEVELS } from "../models/Skill.js";

export async function listSkills(req, res, next) {
  try {
    const skills = await Skill.find({ userId: req.userId }).sort({ createdAt: 1 }).lean();
    res.json({ success: true, data: skills });
  } catch (e) {
    next(e);
  }
}

export async function createSkill(req, res, next) {
  try {
    const { skillName, level } = req.body;
    if (!skillName?.trim() || !level) {
      const err = new Error("skillName and level are required");
      err.statusCode = 400;
      return next(err);
    }
    if (!SKILL_LEVELS.includes(level)) {
      const err = new Error(`level must be one of: ${SKILL_LEVELS.join(", ")}`);
      err.statusCode = 400;
      return next(err);
    }
    const skill = await Skill.create({
      skillName: skillName.trim(),
      level,
      userId: req.userId,
    });
    res.status(201).json({ success: true, data: skill });
  } catch (e) {
    next(e);
  }
}

export async function updateSkill(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error("Invalid skill id");
      err.statusCode = 400;
      return next(err);
    }
    const { skillName, level } = req.body;
    const update = {};
    if (skillName !== undefined) update.skillName = skillName.trim();
    if (level !== undefined) {
      if (!SKILL_LEVELS.includes(level)) {
        const err = new Error(`level must be one of: ${SKILL_LEVELS.join(", ")}`);
        err.statusCode = 400;
        return next(err);
      }
      update.level = level;
    }
    const skill = await Skill.findOneAndUpdate(
      { _id: id, userId: req.userId },
      update,
      { new: true, runValidators: true }
    );
    if (!skill) {
      const err = new Error("Skill not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: skill });
  } catch (e) {
    next(e);
  }
}

export async function deleteSkill(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error("Invalid skill id");
      err.statusCode = 400;
      return next(err);
    }
    const deleted = await Skill.findOneAndDelete({ _id: id, userId: req.userId });
    if (!deleted) {
      const err = new Error("Skill not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, message: "Skill deleted" });
  } catch (e) {
    next(e);
  }
}
