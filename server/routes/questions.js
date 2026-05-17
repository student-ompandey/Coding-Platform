import { Router } from "express";
import { getQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion } from "../controllers/questionController.js";
import { auth, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", getQuestions);
router.get("/:id", getQuestion);
router.post("/", auth, adminOnly, createQuestion);
router.put("/:id", auth, adminOnly, updateQuestion);
router.delete("/:id", auth, adminOnly, deleteQuestion);

export default router;
