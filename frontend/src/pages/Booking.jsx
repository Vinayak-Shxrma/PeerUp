// frontend/src/pages/Booking.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../Context/AuthContext";

export default function Booking(){
  const { subjectId, tutorId } = useParams();
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (subjectId && tutorId) {
      api.get(`/subjects/${subjectId}/slots/${tutorId}`)
        .then(res => setSlots(res.data))
        .catch(err => console.error(err));
    }
  }, [subjectId, tutorId]);

  const bookSlot = async (slotId) => {
    if (!user) return setMsg("Login required");
    try {
      await api.post("/bookings", { slot_id: slotId, student_id: user.id, teacher_id: tutorId });
      setMsg("Booking successful");
      setSlots(prev => prev.map(s => s.id === slotId ? { ...s, is_booked: 1 } : s));
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="flex justify-center px-4">
      <div className="card w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-4">Available Slots</h2>
        {slots.length === 0 && <p className="text-gray-600">No slots found</p>}
        <ul className="space-y-2">
          {slots.map(s => (
            <li key={s.id} className="flex justify-between items-center border rounded p-3">
              <div>
                <div className="font-medium">{new Date(s.start_time).toLocaleString()} → {new Date(s.end_time).toLocaleString()}</div>
                <div className="text-sm text-gray-500">{s.is_booked ? "Booked" : "Available"}</div>
              </div>
              <div>
                <button disabled={s.is_booked} onClick={()=>bookSlot(s.id)} className="bg-indigo-600 text-white px-3 py-1 rounded disabled:opacity-50">Book</button>
              </div>
            </li>
          ))}
        </ul>
        {msg && <p className="mt-3 text-center">{msg}</p>}
      </div>
    </div>
  );
}
