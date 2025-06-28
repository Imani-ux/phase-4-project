import React from "react";
import RoleCard from "../components/RoleCard";
import { useNavigate } from "react-router-dom";
import "./SelectRole.css"; // Import the CSS

export default function SelectRole() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate("/login");
  };

  return (
    <div className="select-role-container">
      <h2>Select Your Role</h2>
      <div className="role-card-wrapper">
        <RoleCard role="Job Seeker" description="Find and apply for jobs" onClick={() => handleSelect("Job Seeker")} />
        <RoleCard role="Employer" description="Post jobs and hire talent" onClick={() => handleSelect("Employer")} />
        <RoleCard role="Admin" description="Manage the platform" onClick={() => handleSelect("Admin")} />
      </div>
    </div>
  );
}
