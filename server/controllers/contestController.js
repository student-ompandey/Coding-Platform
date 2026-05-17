import Contest from "../models/Contest.js";

// GET /api/contests
export const getContests = async (req, res) => {
  try {
    const contests = await Contest.find().populate("questions", "title difficulty points").sort({ createdAt: -1 });
    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/contests/active
export const getActiveContest = async (req, res) => {
  try {
    const contest = await Contest.findOne({ status: { $in: ["live", "upcoming"] } })
      .populate("questions", "title difficulty points status supportedLanguages submissions accepted")
      .sort({ createdAt: -1 });
    if (!contest) return res.status(404).json({ message: "No active contest" });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/contests (admin)
export const createContest = async (req, res) => {
  try {
    const contest = await Contest.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(contest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/contests/:id (admin)
export const updateContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/contests/:id/start (admin)
export const startContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      { status: "live", startTime: new Date() },
      { new: true }
    );
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/contests/:id/end (admin)
export const endContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(
      req.params.id,
      { status: "ended", endTime: new Date() },
      { new: true }
    );
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/contests/:id/pause (admin)
export const pauseContest = async (req, res) => {
  try {
    const contest = await Contest.findByIdAndUpdate(req.params.id, { status: "paused" }, { new: true });
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json(contest);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/contests/:id/join (user)
export const joinContest = async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    if (contest.participants.includes(req.user._id)) {
      return res.status(400).json({ message: "Already joined" });
    }
    contest.participants.push(req.user._id);
    await contest.save();
    await req.user.updateOne({ joinedContest: true });
    res.json({ message: "Joined contest successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
