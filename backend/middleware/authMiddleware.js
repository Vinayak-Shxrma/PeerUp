// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
const JWT_SECRET = process.env.JWT_SECRET || "peerup_secret";

export const verifyToken = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "No token provided" });

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // attach user info
    req.user = decoded;
    // optionally fetch user details
    const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.id]);
    if (rows.length) req.userDetails = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
