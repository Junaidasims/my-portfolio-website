import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../middleware/auth.js";

function userSafe(u) {
  if (!u) return null;
  const o = typeof u.toObject === "function" ? u.toObject() : { ...u };
  delete o.password;
  return o;
}

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      const err = new Error("name, email, and password are required");
      err.statusCode = 400;
      return next(err);
    }
    if (String(password).length < 6) {
      const err = new Error("Password must be at least 6 characters");
      err.statusCode = 400;
      return next(err);
    }
    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      const err = new Error("Email is already registered");
      err.statusCode = 409;
      return next(err);
    }
    const hash = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hash,
    });
    const token = signToken(user._id);
    res.status(201).json({
      success: true,
      data: { token, user: userSafe(user) },
    });
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      const err = new Error("email and password are required");
      err.statusCode = 400;
      return next(err);
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password"
    );
    if (!user) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      return next(err);
    }
    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) {
      const err = new Error("Invalid email or password");
      err.statusCode = 401;
      return next(err);
    }
    const token = signToken(user._id);
    user.password = undefined;
    res.json({ success: true, data: { token, user: userSafe(user) } });
  } catch (e) {
    next(e);
  }
}
