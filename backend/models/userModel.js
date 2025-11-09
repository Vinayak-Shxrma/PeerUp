import { db } from "../config/db.js";
import bcrypt from "bcrypt";

// ✅ Create new user
export const createUser = async (name, email, passwordHash) => {
  const [rows] = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  );
  return rows.insertId;
};

// ✅ Find user by email
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

// ✅ Find user by ID (🔥 this fixes your crash)
export const findUserById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};
