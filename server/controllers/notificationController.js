import Notification from "../models/Notification.js";

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/notifications (admin)
export const createNotification = async (req, res) => {
  try {
    const { title, message, priority } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "Title and message are required" });
    }
    const notification = await Notification.create({ title, message, priority, author: req.user.name });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
