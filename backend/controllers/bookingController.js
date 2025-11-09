import { pool } from "../config/db.js";

// 🟢 Create booking (student → tutor)
export const createBooking = async (req, res) => {
  try {
    const { subject_id, student_id, teacher_id } = req.body;

    if (!subject_id || !student_id || !teacher_id)
      return res.status(400).json({ message: "Missing data" });

    if (student_id === teacher_id)
      return res.status(400).json({ message: "You cannot book yourself!" });

    // check if already pending/confirmed booking exists
    const [existing] = await pool.query(
      `SELECT * FROM bookings WHERE subject_id=? AND student_id=? AND teacher_id=? 
       AND status IN ('pending','confirmed')`,
      [subject_id, student_id, teacher_id]
    );
    if (existing.length)
      return res.status(400).json({ message: "Booking already requested." });

    await pool.query(
      `INSERT INTO bookings (subject_id, student_id, teacher_id, status)
       VALUES (?, ?, ?, 'pending')`,
      [subject_id, student_id, teacher_id]
    );

    res.json({ message: "Booking request sent!" });
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// 🟢 Accept booking
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const [r] = await pool.query(
      `UPDATE bookings SET status='confirmed' WHERE id=?`,
      [bookingId]
    );
    if (!r.affectedRows) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking confirmed ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to confirm booking" });
  }
};

// 🟢 Reject booking
export const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const [r] = await pool.query(
      `UPDATE bookings SET status='cancelled' WHERE id=?`,
      [bookingId]
    );
    if (!r.affectedRows) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking rejected ❌" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reject booking" });
  }
};

// 🟢 Complete session
export const completeBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const [r] = await pool.query(
      `UPDATE bookings SET status='completed' WHERE id=?`,
      [bookingId]
    );
    if (!r.affectedRows) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Session completed 🎉" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete booking" });
  }
};

// 🟢 Get all sessions for user
export const getActiveSessions = async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      `SELECT b.*, 
              s.name AS subject_name, 
              t.name AS teacher_name, 
              st.name AS student_name
       FROM bookings b
       JOIN subjects s ON b.subject_id=s.id
       JOIN users t ON b.teacher_id=t.id
       JOIN users st ON b.student_id=st.id
       WHERE b.teacher_id=? OR b.student_id=?
       ORDER BY b.created_at DESC`,
      [userId, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Fetch sessions error:", err);
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};
