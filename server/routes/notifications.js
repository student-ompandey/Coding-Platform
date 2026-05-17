import { Router } from "express";
import { getNotifications, createNotification } from "../controllers/notificationController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", getNotifications);
router.post("/", auth, adminOnly, createNotification);

export default router;
