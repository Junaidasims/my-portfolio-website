import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skillController.js";

const router = Router();

router.use(requireAuth);
router.get("/", listSkills);
router.post("/", createSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
