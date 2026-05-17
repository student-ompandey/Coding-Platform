import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.js";
import questionRoutes from "./routes/questions.js";
import submissionRoutes from "./routes/submissions.js";
import contestRoutes from "./routes/contests.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import notificationRoutes from "./routes/notifications.js";
import userRoutes from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
