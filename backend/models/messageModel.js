import { pool } from "../config/db.js";

export const saveMessage = async (senderId, receiverId, message) => {
  const [result] = await pool.query(
    "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
    [senderId, receiverId, message]
  );
  return result.insertId;
};

export const getConversation = async (userId, peerId) => {
  const [rows] = await pool.query(
    "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at",
    [userId, peerId, peerId, userId]
  );
  return rows;
};
