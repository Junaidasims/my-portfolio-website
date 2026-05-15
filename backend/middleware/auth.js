import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ success: false, message: "Server misconfiguration" });
  }
  try {
    const payload = jwt.verify(token, secret);
    if (!payload?.userId) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}

export function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return jwt.sign({ userId: String(userId) }, secret, { expiresIn: "7d" });
}
