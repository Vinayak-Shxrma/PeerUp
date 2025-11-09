import express from "express";
import {
  createBooking,
  confirmBooking,
  rejectBooking,
  completeBooking,
  getActiveSessions,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.patch("/confirm/:bookingId", confirmBooking);
router.patch("/reject/:bookingId", rejectBooking);
router.patch("/complete/:bookingId", completeBooking);
router.get("/active/:userId", getActiveSessions);

export default router;
