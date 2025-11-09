import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import api from "../services/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatRoom() {
  const { user } = useAuth();
  const [chatList, setChatList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef(null);

  // 🟢 Load chat list and all users
  useEffect(() => {
    if (user?.id) {
      api.get(`/chat/list/${user.id}`)
        .then((res) => setChatList(res.data))
        .catch(() => console.log("Failed to load chat list"));

      api.get(`/chat/users/${user.id}`)
        .then((res) => setAllUsers(res.data))
        .catch(() => console.log("Failed to load users"));
    }
  }, [user]);

  // 🟢 Load messages when user selected
  const loadMessages = async (receiverId) => {
    setSelectedUser(allUsers.find((u) => u.id === receiverId) || chatList.find((u) => u.id === receiverId));
    try {
      const { data } = await api.get(`/chat/messages/${user.id}/${receiverId}`);
      setMessages(data);
    } catch {
      console.log("Failed to load messages");
    }
  };

  // 🟢 Socket listener (receive messages)
  useEffect(() => {
    socket.on("receive_message", (data) => {
      // Only add if message is from someone else
      if (data.sender_id !== user.id) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => socket.off("receive_message");
  }, [user]);

  // 🟢 Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const msgData = {
      sender_id: user.id,
      receiver_id: selectedUser.id,
      message_text: newMessage,
    };

    try {
      await api.post("/chat/send", msgData);
      socket.emit("send_message", msgData);

      setMessages((prev) => [...prev, msgData]);
      setNewMessage("");
    } catch {
      console.log("Failed to send message");
    }
  };

  // 🟢 Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-[85vh] bg-gradient-to-br from-indigo-50 via-slate-50 to-white">
      {/* Sidebar */}
      <div className="w-1/4 border-r bg-white shadow-inner overflow-y-auto rounded-l-xl">
        <h2 className="text-lg font-semibold text-center py-3 bg-indigo-600 text-white rounded-tl-xl">
          💬 Chat Room
        </h2>

        {/* Recent Chats */}
        <div>
          <h3 className="px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100">
            Recent Chats
          </h3>
          {chatList.length === 0 ? (
            <p className="text-center text-gray-400 py-2">No chats yet</p>
          ) : (
            chatList.map((u) => (
              <div
                key={u.id}
                className={`p-3 border-b cursor-pointer hover:bg-indigo-100 ${
                  selectedUser?.id === u.id ? "bg-indigo-200" : ""
                }`}
                onClick={() => loadMessages(u.id)}
              >
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">ID: {u.id}</p>
              </div>
            ))
          )}
        </div>

        {/* All Users */}
        <div>
          <h3 className="px-3 py-2 text-sm font-semibold text-gray-600 bg-gray-100">
            All Users
          </h3>
          {allUsers.length === 0 ? (
            <p className="text-center text-gray-400 py-2">No users found</p>
          ) : (
            allUsers.map((u) => (
              <div
                key={u.id}
                className={`p-3 border-b cursor-pointer hover:bg-indigo-100 ${
                  selectedUser?.id === u.id ? "bg-indigo-200" : ""
                }`}
                onClick={() => loadMessages(u.id)}
              >
                <p className="font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">ID: {u.id}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white shadow-lg rounded-r-xl">
        {selectedUser ? (
          <>
            <div className="p-3 border-b flex justify-between items-center bg-indigo-600 text-white">
              <h3 className="text-lg font-semibold">
                Chat with {selectedUser.name}
              </h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">No messages yet</p>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`my-2 flex ${
                      msg.sender_id === user.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-2 rounded-lg shadow-sm ${
                        msg.sender_id === user.id
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{msg.message_text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef}></div>
            </div>

            <div className="p-3 border-t flex gap-3 bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
