import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  priority: { type: String, enum: ["info", "warning", "urgent"], default: "info" },
  author: { type: String, default: "Admin" },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
