import { pool } from "../config/db.js";

export const findSubjectByName = async (name) => {
  const [rows] = await pool.query("SELECT * FROM subjects WHERE subject_name = ?", [name]);
  return rows[0];
};

export const addSubjectToUser = async (userId, subjectName) => {
  const [result] = await pool.query(
    "INSERT INTO subjects (user_id, subject_name) VALUES (?, ?)",
    [userId, subjectName]
  );
  return result.insertId;
};
