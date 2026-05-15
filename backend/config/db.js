/**
 * MongoDB connection via Mongoose.
 * Set MONGO_URI in .env (local mongod or MongoDB Atlas).
 */
import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log("MongoDB connected");
}
