import { pool } from "../config/db.js";

/**
 * 🟢 Add new subject (auto-link to user_subjects as teacher)
 */
export const addSubject = async (req, res) => {
  try {
    const { name, category, created_by, hourly_rate } = req.body;

    if (!name || !category || !created_by)
      return res.status(400).json({ message: "Missing required fields" });

    // 1️⃣ Check if subject already exists
    const [existing] = await pool.query("SELECT id FROM subjects WHERE name = ?", [name]);
    let subjectId;

    if (existing.length) {
      // Use existing subject
      subjectId = existing[0].id;
    } else {
      // 2️⃣ Insert new subject
      const [result] = await pool.query(
        "INSERT INTO subjects (name, category, created_by) VALUES (?, ?, ?)",
        [name, category, created_by]
      );
      subjectId = result.insertId;
    }

    // 3️⃣ Check if already linked in user_subjects
    const [alreadyLinked] = await pool.query(
      "SELECT id FROM user_subjects WHERE user_id = ? AND subject_id = ? AND role = 'teach'",
      [created_by, subjectId]
    );

    if (!alreadyLinked.length) {
      // 4️⃣ Link user to subject
      await pool.query(
        "INSERT INTO user_subjects (user_id, subject_id, role, hourly_rate) VALUES (?, ?, 'teach', ?)",
        [created_by, subjectId, hourly_rate || 0]
      );
    }

    res.json({ message: "✅ Subject added successfully!", subjectId });
  } catch (err) {
    console.error("Add subject error:", err);
    res.status(500).json({ message: "❌ Failed to add subject" });
  }
};

/**
 * 🔍 Search subjects (excluding own)
 */
export const searchSubjects = async (req, res) => {
  try {
    const { q = "", userId } = req.query;

    const [rows] = await pool.query(
      `SELECT 
          s.id AS subject_id,
          s.name AS subject_name,
          s.category,
          u.id AS tutor_id,
          u.name AS tutor_name,
          us.hourly_rate
       FROM subjects s
       JOIN user_subjects us ON s.id = us.subject_id
       JOIN users u ON us.user_id = u.id
       WHERE (s.name LIKE ? OR s.category LIKE ?)
       AND u.id != ?
       ORDER BY s.name ASC`,
      [`%${q}%`, `%${q}%`, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Search subjects error:", err);
    res.status(500).json({ message: "❌ Failed to search subjects" });
  }
};
