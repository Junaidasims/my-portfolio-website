import fs from "fs";
import path from "path";
import multer from "multer";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export function ensureUserDir(userId) {
  const dir = path.join(UPLOAD_ROOT, "users", String(userId));
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/** Multer factory: store resume as resume.pdf (PDF only) */
export function resumeUploader(userId) {
  const dest = ensureUserDir(userId);
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, _file, cb) => cb(null, "resume.pdf"),
  });
  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed"));
      }
      cb(null, true);
    },
  }).single("resume");
}

/** Profile image: jpeg/png/webp/gif */
export function profileImageUploader(userId) {
  const dest = ensureUserDir(userId);
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".jpg";
      cb(null, `profile${ext}`);
    },
  });
  return multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const ok = /^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype);
      if (!ok) return cb(new Error("Only image files are allowed"));
      cb(null, true);
    },
  }).single("image");
}

export function uploadsPublicPath(userId, filename) {
  return `/uploads/users/${userId}/${filename}`;
}

export function absoluteUploadPath(webOrRelativePath) {
  const rel = String(webOrRelativePath).replace(/^\//, "");
  return path.join(process.cwd(), rel);
}
