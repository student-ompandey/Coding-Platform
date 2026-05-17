import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  startTime: { type: Date },
  endTime: { type: Date },
  duration: { type: Number, default: 120 }, // in minutes
  status: { type: String, enum: ["upcoming", "live", "paused", "ended"], default: "upcoming" },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  maxParticipants: { type: Number, default: 500 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Contest", contestSchema);
