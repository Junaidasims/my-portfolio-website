import { Router } from "express";
import {
  getPublicPortfolio,
  downloadPublicResume,
} from "../controllers/publicPortfolioController.js";

const router = Router();

router.get("/portfolio/:userId", getPublicPortfolio);
router.get("/resume/:userId", downloadPublicResume);

export default router;
