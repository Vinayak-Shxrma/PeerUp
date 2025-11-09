// backend/controllers/timeSlotController.js
import { pool } from "../config/db.js";

export const addTimeSlot = async (req, res) => {
  try {
    const { user_id, subject_id, start_time, end_time } = req.body;
    if (!user_id || !subject_id || !start_time || !end_time) return res.status(400).json({ message: "Missing fields" });

    const [r] = await pool.query(
      "INSERT INTO time_slots (user_id, subject_id, start_time, end_time) VALUES (?, ?, ?, ?)",
      [user_id, subject_id, start_time, end_time]
    );
    res.json({ message: "Slot added", slotId: r.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
