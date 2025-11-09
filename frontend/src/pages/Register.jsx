import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      setMsg("✅ Registration successful! Redirecting to login...");
      setTimeout(() => nav("/login"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh]">
      <div className="card w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-4">
          Create Account
        </h2>
        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border p-2 rounded"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
            Register
          </button>
        </form>
        {msg && <p className="mt-3 text-center text-sm">{msg}</p>}
        <p className="mt-3 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
