import express, { Router } from "express";
import {
  togglePinQuestion,
  updateQuestionNote,
  addQuestionsToSession,
} from "../controllers/queController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/add", protect, addQuestionsToSession);
router.post("/:id/pin", protect, togglePinQuestion);
router.post("/:id/note", protect, updateQuestionNote);

export default router;
