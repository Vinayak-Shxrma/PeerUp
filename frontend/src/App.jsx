import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SearchSubjects from "./pages/SearchSubjects";
import AddSubject from "./pages/AddSubject";
import ChatRoom from "./pages/ChatRoom";

export default function App() {
  const { user, logout } = useAuth();

  const handleRegisterClick = () => {
    localStorage.clear(); // clear any existing session
    window.location.href = "/register";
  };

  return (
    <Router>
      {/* Navbar */}
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
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/search"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Search
              </Link>
              <Link
                to="/chat"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Chatroom
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Login
              </Link>
              <button
                onClick={handleRegisterClick}
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Routes */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={user ? <Dashboard /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/search"
            element={user ? <SearchSubjects /> : <Login />}
          />
          <Route path="/add" element={user ? <AddSubject /> : <Login />} />
          <Route path="/chat" element={user ? <ChatRoom /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}
