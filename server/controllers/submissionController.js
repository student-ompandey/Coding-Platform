import Submission from "../models/Submission.js";
import Question from "../models/Question.js";
import User from "../models/User.js";
import { executeCode } from "../services/judge0.js";

// POST /api/submissions/run — run code without saving
export const runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;
    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required" });
    }
    const result = await executeCode(code, language, input || "");
    const statusId = result.status?.id;
    let status = "Pending";
    if (statusId === 3) status = "Accepted";
    else if (statusId === 4) status = "Wrong Answer";
    else if (statusId === 5) status = "Time Limit";
    else if (statusId === 6) status = "Compilation Error";
    else if (statusId >= 7 && statusId <= 12) status = "Runtime Error";

    res.json({
      status,
      stdout: result.stdout?.trim() || "",
      stderr: result.stderr?.trim() || "",
      compileOutput: result.compileOutput?.trim() || "",
      time: result.time ? `${result.time}s` : "-",
      memory: result.memory ? `${(result.memory / 1024).toFixed(1)}MB` : "-",
    });
  } catch (error) {
    res.status(500).json({ message: "Code execution failed", error: error.message });
  }
};

// POST /api/submissions/submit — submit code, evaluate against test cases, save
export const submitCode = async (req, res) => {
  try {
    const { code, language, questionId } = req.body;
    if (!code || !language || !questionId) {
      return res.status(400).json({ message: "Code, language, and questionId are required" });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const testCases = [...question.visibleTestCases, ...question.hiddenTestCases];
    let passed = 0;
    let finalStatus = "Accepted";
    let lastResult = null;

    if (testCases.length === 0) {
      // No test cases — just execute and save
      lastResult = await executeCode(code, language, "");
      const statusId = lastResult.status?.id;
      if (statusId === 3) finalStatus = "Accepted";
      else if (statusId === 4) finalStatus = "Wrong Answer";
      else if (statusId === 5) finalStatus = "Time Limit";
      else if (statusId === 6) finalStatus = "Compilation Error";
      else finalStatus = "Runtime Error";
      passed = finalStatus === "Accepted" ? 1 : 0;
    } else {
      for (const tc of testCases) {
        const result = await executeCode(code, language, tc.input);
        lastResult = result;
        const statusId = result.status?.id;

        if (statusId === 6) { finalStatus = "Compilation Error"; break; }
        if (statusId === 5) { finalStatus = "Time Limit"; break; }
        if (statusId >= 7 && statusId <= 12) { finalStatus = "Runtime Error"; break; }
        if (statusId === 3 && result.stdout?.trim() === tc.expectedOutput.trim()) {
          passed++;
        } else {
          finalStatus = "Wrong Answer";
        }
      }
      if (passed === testCases.length) finalStatus = "Accepted";
    }

    const totalTestCases = testCases.length || 1;
    const score = finalStatus === "Accepted" ? question.points : 0;

    // Update question stats
    question.submissions += 1;
    if (finalStatus === "Accepted") question.accepted += 1;
    await question.save();

    // Save submission
    const submission = await Submission.create({
      userId: req.user._id,
      questionId,
      language,
      code,
      status: finalStatus,
      runtime: lastResult?.time ? `${lastResult.time}s` : "-",
      memory: lastResult?.memory ? `${(lastResult.memory / 1024).toFixed(1)}MB` : "-",
      score,
      testCasesPassed: passed,
      totalTestCases,
      output: lastResult?.stdout?.trim() || lastResult?.stderr?.trim() || lastResult?.compileOutput?.trim() || "",
    });

    // Update user score if accepted and not already solved
    if (finalStatus === "Accepted" && !req.user.solvedProblems.includes(questionId)) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { score },
        $addToSet: { solvedProblems: questionId },
      });
    }

    res.json({
      submission,
      status: finalStatus,
      testCasesPassed: passed,
      totalTestCases,
      score,
    });
  } catch (error) {
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};

// GET /api/submissions — all submissions (admin)
export const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("userId", "name email")
      .populate("questionId", "title")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/submissions/user — current user's submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user._id })
      .populate("questionId", "title difficulty points")
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
