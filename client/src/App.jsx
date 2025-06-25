import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import SeekerDashboard from "./pages/SeekerDashboard";

const initialJobs = [
  { id: 1, title: "Frontend Developer", company: "Acme Corp", location: "Nairobi", type: "Full-time", description: "React, CSS, HTML" },
  { id: 2, title: "Backend Developer", company: "Beta Ltd", location: "Mombasa", type: "Part-time", description: "Python, Django, REST" },
];

function App() {
  const [jobs, setJobs] = useState(initialJobs);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employer/dashboard" element={
          <EmployerDashboard jobs={jobs} setJobs={setJobs} />
        } />
        <Route path="/seeker/dashboard" element={
          <SeekerDashboard jobs={jobs} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;