import { Server } from "socket.io";
import { pool } from "../config/db.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // join personal room (client should emit 'join' with their userId)
    socket.on("join", (userId) => {
      socket.join(`user_${userId}`);
    });

    // send direct message: payload { from, to, text }
    socket.on("direct_message", async (payload) => {
      try {
        const { from, to, text } = payload;
        if (!from || !to || !text) return;

        // Save message to DB
        await pool.query("INSERT INTO messages (sender_id, receiver_id, message_text) VALUES (?, ?, ?)", [
          from,
          to,
          text,
        ]);

        // emit to receiver room and sender
        io.to(`user_${to}`).emit("new_message", { sender: from, text, sent_at: new Date().toISOString() });
        io.to(`user_${from}`).emit("new_message", { sender: from, text, sent_at: new Date().toISOString() });
      } catch (err) {
        console.error("Socket message error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  console.log("Socket.IO initialized");
};
