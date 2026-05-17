import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/User.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: "admin@codearena.com" });
    if (existing) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    await User.create({
      name: "Admin",
      email: "admin@codearena.com",
      college: "CodeArena HQ",
      password: "admin123",
      role: "admin",
    });

    console.log("✅ Admin user created: admin@codearena.com / admin123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
