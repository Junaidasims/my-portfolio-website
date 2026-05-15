import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = Router();

router.use(requireAuth);
router.get("/", getProjects);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
