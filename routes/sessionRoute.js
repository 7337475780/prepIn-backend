import express, { Router } from "express";

import {
  createSession,
  getMySessions,
  getSessionById,
  deleteSession,
} from "../controllers/sessionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.delete("/:id", protect, deleteSession);

export default router;
