import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  points: { type: Number, required: true, default: 100 },
  starterCode: {
    "C++": { type: String, default: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}' },
    Python: { type: String, default: '# Your code here\n' },
    Java: { type: String, default: 'public class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}' },
    JavaScript: { type: String, default: '// Your code here\n' },
  },
  supportedLanguages: { type: [String], default: ["C++", "Python", "Java", "JavaScript"] },
  sampleInput: { type: String, default: "" },
  sampleOutput: { type: String, default: "" },
  explanation: { type: String, default: "" },
  hiddenTestCases: [testCaseSchema],
  visibleTestCases: [testCaseSchema],
  status: { type: String, enum: ["published", "draft"], default: "published" },
  submissions: { type: Number, default: 0 },
  accepted: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.model("Question", questionSchema);
