import express from "express";
import {
  sendMessage,
  getMessages,
  getChatList,
  getAllUsers,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/messages/:user1/:user2", getMessages);
router.get("/list/:userId", getChatList);
router.get("/users/:userId", getAllUsers);

export default router;
