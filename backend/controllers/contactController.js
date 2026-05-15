import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import User from "../models/User.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createContact(req, res, next) {
  try {
    const { recipientId, name, email, message } = req.body;
    if (!recipientId || !name || !email || !message) {
      const err = new Error("recipientId, name, email, and message are required");
      err.statusCode = 400;
      return next(err);
    }
    if (!mongoose.isValidObjectId(recipientId)) {
      const err = new Error("Invalid recipientId");
      err.statusCode = 400;
      return next(err);
    }
    if (!emailRegex.test(String(email))) {
      const err = new Error("Invalid email address");
      err.statusCode = 400;
      return next(err);
    }
    const recipient = await User.findById(recipientId).lean();
    if (!recipient?.profileCompleted) {
      const err = new Error("Recipient not found");
      err.statusCode = 404;
      return next(err);
    }
    await Contact.create({
      toUserId: recipientId,
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
    });
    res.status(201).json({
      success: true,
      message: "Message sent. Thank you!",
    });
  } catch (e) {
    next(e);
  }
}
