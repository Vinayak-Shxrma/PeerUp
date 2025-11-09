import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [message, setMessage] = useState("");

  const fetchSessions = async () => {
    try {
      const { data } = await api.get(`/bookings/active/${user.id}`);
      setSessions(data);
    } catch {
      setMessage("Failed to load sessions");
    }
  };

  const updateStatus = async (id, action) => {
    try {
      await api.patch(`/bookings/${action}/${id}`);
      fetchSessions();
      setMessage(`Booking ${action}ed successfully`);
    } catch {
      setMessage(`Failed to ${action} booking`);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-6 px-4">
      <div className="card text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">
          Welcome, {user?.name} 👋
        </h1>
        <p className="text-gray-600">
          Manage your subjects, bookings, and chats easily.
        </p>
      </div>

      <div className="card flex flex-wrap justify-center gap-4">
        <Link to="/search" className="btn">🔍 Search Subjects</Link>
        <Link to="/add" className="btn">➕ Add Subject</Link>
        <Link to="/chat" className="btn">💬 Chatroom</Link>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-3">
          📚 Your Sessions
        </h2>
        {message && <p className="text-center text-gray-600">{message}</p>}
        {sessions.length === 0 ? (
          <p className="text-gray-500 text-center">No sessions yet.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div key={s.id} className="border p-3 rounded shadow-sm bg-gray-50">
                <h3 className="text-lg font-semibold text-indigo-600">
                  {s.subject_name}
                </h3>
                <p>👨‍🏫 Teacher: {s.teacher_name}</p>
                <p>👨‍🎓 Student: {s.student_name}</p>
                <p>
                  Status:{" "}
                  <span
                    className={
                      s.status === "confirmed"
                        ? "text-green-600"
                        : s.status === "cancelled"
                        ? "text-red-600"
                        : s.status === "completed"
                        ? "text-blue-600"
                        : "text-yellow-600"
                    }
                  >
                    {s.status}
                  </span>
                </p>

                {user.id === s.teacher_id && s.status === "pending" && (
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => updateStatus(s.id, "confirm")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(s.id, "reject")}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {user.id === s.teacher_id && s.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(s.id, "complete")}
                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
