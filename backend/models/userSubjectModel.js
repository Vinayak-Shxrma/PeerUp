import { pool } from "../config/db.js";

export const addUserSubject = async (userId, subjectId) => {
  const [result] = await pool.query(
    "INSERT INTO user_subjects (user_id, subject_id) VALUES (?, ?)",
    [userId, subjectId]
  );
  return result.insertId;
};

export const getTeachersBySubjectName = async (subjectName) => {
  const [rows] = await pool.query(
    "SELECT u.name, u.email, s.subject_name FROM users u JOIN subjects s ON u.id = s.user_id WHERE s.subject_name = ?",
    [subjectName]
  );
  return rows;
};

export const getSubjectsForUser = async (userId) => {
  const [rows] = await pool.query(
    "SELECT subject_name FROM subjects WHERE user_id = ?",
    [userId]
  );
  return rows;
};
