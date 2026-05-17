import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Time Limit", "Runtime Error", "Compilation Error", "Pending"],
    default: "Pending",
  },
  runtime: { type: String, default: "-" },
  memory: { type: String, default: "-" },
  score: { type: Number, default: 0 },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  output: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
