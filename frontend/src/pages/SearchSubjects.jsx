import React, { useState } from "react";
import api from "../services/api";
import { useAuth } from "../Context/AuthContext";

export default function SearchSubjects() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState("");

  const handleSearch = async () => {
    try {
      const { data } = await api.get(
        `/subjects/search?q=${encodeURIComponent(query)}&userId=${user.id}`
      );
      setSubjects(data);
      if (!data.length) setMessage("No subjects found.");
    } catch {
      setMessage("❌ Failed to fetch subjects");
    }
  };

  const handleBook = async (subject_id, teacher_id) => {
    try {
      await api.post("/bookings", {
        subject_id,
        student_id: user.id,
        teacher_id,
      });
      setMessage("✅ Booking request sent!");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Booking failed.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          🔍 Search Subjects
        </h2>

        <div className="flex mb-4">
          <input
            className="flex-1 border rounded-l-lg px-3 py-2"
            placeholder="Enter subject name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-5 py-2 rounded-r-lg hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        {message && <p className="text-center text-gray-600">{message}</p>}

        <div className="space-y-4 mt-4">
          {subjects.map((s) => (
            <div key={`${s.subject_id}-${s.tutor_id}`} className="border p-4 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-indigo-600">{s.subject_name}</h3>
              <p className="text-gray-700">Tutor: {s.tutor_name}</p>
              <p className="text-gray-700">Category: {s.category}</p>
              <p className="text-gray-700">Rate: ₹{s.hourly_rate}/hr</p>
              <button
                onClick={() => handleBook(s.subject_id, s.tutor_id)}
                className="mt-2 bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
              >
                Book
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
