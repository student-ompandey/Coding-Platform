import { Router } from "express";
import { getUsers, banUser, disqualifyUser, activateUser, getStats } from "../controllers/userController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", auth, adminOnly, getUsers);
router.get("/stats", auth, adminOnly, getStats);
router.put("/:id/ban", auth, adminOnly, banUser);
router.put("/:id/disqualify", auth, adminOnly, disqualifyUser);
router.put("/:id/activate", auth, adminOnly, activateUser);

export default router;
