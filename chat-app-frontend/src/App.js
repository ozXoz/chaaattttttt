// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import Room from "./components/Room";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/rooms" element={<Room />} /> {/* Yeni eklenen route */}
        <Route path="/" element={<div>Home Page or Redirect</div>} />
      </Routes>
    </Router>
  );
}

export default App;
