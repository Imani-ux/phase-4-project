
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import SeekerDashboard from "./pages/SeekerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employer/dashboard" element={<EmployerDashboard />} />
        <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;