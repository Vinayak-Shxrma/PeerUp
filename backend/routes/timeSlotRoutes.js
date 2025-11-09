// backend/routes/timeSlotRoutes.js
import express from "express";
import { addTimeSlot } from "../controllers/timeSlotController.js";
const router = express.Router();

router.post("/", addTimeSlot);

export default router;
