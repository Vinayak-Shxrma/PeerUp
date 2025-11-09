import { db } from "../config/db.js";

// ✅ Create a new booking (core function)
export const createBooking = async (slotId, studentId, teacherId, status = "confirmed") => {
  const [result] = await pool.query(
    "INSERT INTO bookings (slot_id, student_id, teacher_id, status) VALUES (?, ?, ?, ?)",
    [slotId, studentId, teacherId, status]
  );
  return result.insertId;
};

// ✅ Alias for backward compatibility (fixes your crash)
export const bookSlot = createBooking;

// ✅ Get all bookings for a specific user
export const getBookingsByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT b.id, b.status, ts.start_time, ts.end_time,
            s.name AS student_name, t.name AS teacher_name
     FROM bookings b
     JOIN time_slots ts ON b.slot_id = ts.id
     JOIN users s ON b.student_id = s.id
     JOIN users t ON b.teacher_id = t.id
     WHERE b.student_id = ? OR b.teacher_id = ?
     ORDER BY ts.start_time DESC`,
    [userId, userId]
  );
  return rows;
};

// ✅ Alias for old naming
export const getBookingsForUser = getBookingsByUser;

// ✅ Update booking status (cancel, complete, etc.)
export const updateBookingStatus = async (bookingId, status) => {
  await pool.query("UPDATE bookings SET status = ? WHERE id = ?", [status, bookingId]);
  return true;
};
