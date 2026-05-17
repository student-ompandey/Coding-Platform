import User from "../models/User.js";
import Submission from "../models/Submission.js";
import Contest from "../models/Contest.js";

// GET /api/users (admin)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ score: -1 });

    const usersWithAvatar = users.map(u => ({
      ...u.toObject(),
      avatar: u.name.split(" ").map(n => n[0]).join("").toUpperCase(),
      solved: u.solvedProblems.length,
    }));

    res.json(usersWithAvatar);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/users/:id/ban (admin)
export const banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "banned" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/users/:id/disqualify (admin)
export const disqualifyUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "disqualified" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/users/:id/activate (admin)
export const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: "active" }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/users/stats (admin dashboard)
export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeParticipants = await User.countDocuments({ role: "user", joinedContest: true });
    const totalSubmissions = await Submission.countDocuments();
    const acceptedSubmissions = await Submission.countDocuments({ status: "Accepted" });
    const activeContest = await Contest.findOne({ status: "live" });

    res.json({
      totalUsers,
      activeParticipants,
      totalSubmissions,
      acceptedSubmissions,
      contestStatus: activeContest ? "Live" : "No Active Contest",
      systemStatus: "Online",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
