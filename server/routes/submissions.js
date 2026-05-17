import { Router } from "express";
import { runCode, submitCode, getSubmissions, getUserSubmissions } from "../controllers/submissionController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = Router();

router.post("/run", auth, runCode);
router.post("/submit", auth, submitCode);
router.get("/", auth, adminOnly, getSubmissions);
router.get("/user", auth, getUserSubmissions);

export default router;
