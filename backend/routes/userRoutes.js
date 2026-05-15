import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { resumeUploader, profileImageUploader } from "../config/upload.js";
import {
  getMe,
  patchMe,
  completeProfile,
  uploadResume,
  uploadProfileImage,
  downloadMyResume,
  getMyPortfolioBundle,
} from "../controllers/userController.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, patchMe);
router.post("/me/complete-profile", requireAuth, completeProfile);

router.post(
  "/me/resume",
  requireAuth,
  (req, res, next) => {
    resumeUploader(req.userId)(req, res, (err) => {
      if (err) {
        err.statusCode = 400;
        return next(err);
      }
      next();
    });
  },
  uploadResume
);

router.post(
  "/me/profile-image",
  requireAuth,
  (req, res, next) => {
    profileImageUploader(req.userId)(req, res, (err) => {
      if (err) {
        err.statusCode = 400;
        return next(err);
      }
      next();
    });
  },
  uploadProfileImage
);

router.get("/me/resume", requireAuth, downloadMyResume);
router.get("/me/portfolio", requireAuth, getMyPortfolioBundle);

export default router;
