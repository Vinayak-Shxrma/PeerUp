import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
  <h1
    onClick={() => (window.location.href = "/")}
    className="text-2xl font-bold text-indigo-600 cursor-pointer"
  >
    PeerUp
  </h1>
  <div className="space-x-4">
    {user ? (
      <>
        <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium">
          Dashboard
        </a>
        <a href="/search" className="text-gray-600 hover:text-indigo-600 font-medium">
          Search
        </a>
        <a href="/chat" className="text-gray-600 hover:text-indigo-600 font-medium">
          Chatroom
        </a>
        <button
          onClick={logout}
          className="text-gray-600 hover:text-red-600 font-medium"
        >
          Logout
        </button>
      </>
    ) : (
      <>
        <a href="/login" className="text-gray-600 hover:text-indigo-600 font-medium">
          Login
        </a>
        <a
          href="/register"
          onClick={() => localStorage.clear()}
          className="text-gray-600 hover:text-indigo-600 font-medium"
        >
          Register
        </a>
      </>
    )}
  </div>
</nav>
  );
}