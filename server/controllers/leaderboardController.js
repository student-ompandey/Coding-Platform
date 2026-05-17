import User from "../models/User.js";

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ role: "user", status: { $ne: "disqualified" } })
      .select("name email college score solvedProblems status")
      .sort({ score: -1 })
      .limit(50);

    const leaderboard = users.map((u, i) => ({
      _id: u._id,
      rank: i + 1,
      name: u.name,
      email: u.email,
      college: u.college,
      score: u.score,
      solved: u.solvedProblems.length,
      status: u.status,
      avatar: u.name.split(" ").map(n => n[0]).join("").toUpperCase(),
    }));

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
