import { Router } from "express";
import { getContests, getActiveContest, createContest, updateContest, startContest, endContest, pauseContest, joinContest } from "../controllers/contestController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", getContests);
router.get("/active", getActiveContest);
router.post("/", auth, adminOnly, createContest);
router.put("/:id", auth, adminOnly, updateContest);
router.put("/:id/start", auth, adminOnly, startContest);
router.put("/:id/end", auth, adminOnly, endContest);
router.put("/:id/pause", auth, adminOnly, pauseContest);
router.post("/:id/join", auth, joinContest);

export default router;
