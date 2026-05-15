import mongoose from "mongoose";
import Project from "../models/Project.js";

export async function getProjects(req, res, next) {
  try {
    const projects = await Project.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: projects });
  } catch (e) {
    next(e);
  }
}

export async function createProject(req, res, next) {
  try {
    const { title, description, techStack, githubLink, liveLink, image } =
      req.body;
    if (!title || !description) {
      const err = new Error("title and description are required");
      err.statusCode = 400;
      return next(err);
    }
    const stack = Array.isArray(techStack)
      ? techStack
      : typeof techStack === "string"
        ? techStack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];
    const project = await Project.create({
      userId: req.userId,
      title,
      description,
      techStack: stack,
      githubLink: githubLink || "",
      liveLink: liveLink || "",
      image: image || "",
    });
    res.status(201).json({ success: true, data: project });
  } catch (e) {
    next(e);
  }
}

export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error("Invalid project id");
      err.statusCode = 400;
      return next(err);
    }
    const { title, description, techStack, githubLink, liveLink, image } =
      req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (techStack !== undefined) {
      update.techStack = Array.isArray(techStack)
        ? techStack
        : typeof techStack === "string"
          ? techStack
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
    }
    if (githubLink !== undefined) update.githubLink = githubLink;
    if (liveLink !== undefined) update.liveLink = liveLink;
    if (image !== undefined) update.image = image;

    const project = await Project.findOneAndUpdate(
      { _id: id, userId: req.userId },
      update,
      { new: true, runValidators: true }
    );
    if (!project) {
      const err = new Error("Project not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: project });
  } catch (e) {
    next(e);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      const err = new Error("Invalid project id");
      err.statusCode = 400;
      return next(err);
    }
    const deleted = await Project.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });
    if (!deleted) {
      const err = new Error("Project not found");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, message: "Project deleted" });
  } catch (e) {
    next(e);
  }
}
