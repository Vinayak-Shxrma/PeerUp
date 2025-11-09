import { db } from "../config/db.js";
// ✅ Add (create) a new time slot for a tutor
export const addTimeSlot = async (userId, startTime, endTime) => {
  const [result] = await pool.query(
    "INSERT INTO time_slots (user_id, start_time, end_time, is_booked) VALUES (?, ?, ?, 0)",
    [userId, startTime, endTime]
  );
  return result.insertId;
};

// ✅ Alias for backward compatibility (fixes your crash)
export const createSlot = addTimeSlot;

// ✅ Get all available slots for a specific teacher
export const getAvailableSlotsByUser = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM time_slots WHERE user_id = ? AND is_booked = 0 ORDER BY start_time ASC",
    [userId]
  );
  return rows;
};

// ✅ Alias (so old code using `getAvailableSlotsForTeacher` keeps working)
export const getAvailableSlotsForTeacher = getAvailableSlotsByUser;

// ✅ Book a slot
export const bookSlot = async (slotId, studentId, teacherId) => {
  await pool.query("UPDATE time_slots SET is_booked = 1 WHERE id = ?", [slotId]);
  const [result] = await pool.query(
    "INSERT INTO bookings (slot_id, student_id, teacher_id, status) VALUES (?, ?, ?, 'confirmed')",
    [slotId, studentId, teacherId]
  );
  return result.insertId;
};

// ✅ Get all booked slots for a user (as student or teacher)
export const getUserBookings = async (userId) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.status, ts.start_time, ts.end_time, 
            s.name AS student_name, t.name AS teacher_name
     FROM bookings b
     JOIN time_slots ts ON ts.id = b.slot_id
     JOIN users s ON s.id = b.student_id
     JOIN users t ON t.id = b.teacher_id
     WHERE b.student_id = ? OR b.teacher_id = ?`,
    [userId, userId]
  );
  return rows;
};
