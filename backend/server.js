/**
 * Portfolio platform API — Express + MongoDB (Mongoose) + JWT
 */
import "dotenv/config";
import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

const uploadsRoot = path.join(process.cwd(), "uploads");
fs.mkdirSync(uploadsRoot, { recursive: true });
app.use("/uploads", express.static(uploadsRoot));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);

app.use(notFound);
app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
