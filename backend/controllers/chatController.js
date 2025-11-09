import { pool } from "../config/db.js";

/**
 * 🟢 Send a message
 */
export const sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message_text } = req.body;

    if (!sender_id || !receiver_id || !message_text)
      return res.status(400).json({ message: "Missing data" });

    await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)",
      [sender_id, receiver_id, message_text]
    );

    res.json({ message: "✅ Message sent successfully" });
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: "❌ Failed to send message" });
  }
};

/**
 * 🟢 Fetch all messages between two users
 */
export const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const [rows] = await pool.query(
      `SELECT m.*, 
              s.name AS sender_name,
              r.name AS receiver_name
       FROM messages m
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.receiver_id = r.id
       WHERE (m.sender_id = ? AND m.receiver_id = ?)
          OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.sent_at ASC`,
      [user1, user2, user2, user1]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: "❌ Failed to fetch messages" });
  }
};

/**
 * 🟢 Get chat list — all unique users the current user has chatted with
 */
export const getChatList = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      `SELECT DISTINCT u.id, u.name
       FROM users u
       WHERE u.id IN (
          SELECT DISTINCT CASE
              WHEN sender_id = ? THEN receiver_id
              WHEN receiver_id = ? THEN sender_id
          END
          FROM messages
          WHERE sender_id = ? OR receiver_id = ?
       )
       ORDER BY u.name ASC`,
      [userId, userId, userId, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get chat list error:", err);
    res.status(500).json({ message: "❌ Failed to load chat list" });
  }
};

/**
 * 🟢 Get all available users (for starting new chats)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await pool.query(
      "SELECT id, name FROM users WHERE id != ? ORDER BY name ASC",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "❌ Failed to load users" });
  }
};
