import React from "react";
import RoleCard from "../components/RoleCard";
import { useNavigate } from "react-router-dom";
import "./SelectRole.css"; // Styling for layout

export default function SelectRole() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    // Optional: you can pass role info to login
    navigate("/login", { state: { role } });
  };

  return (
    <div className="select-role-container">
      <h2>Select Your Role</h2>
      <div className="role-card-wrapper">
        <RoleCard
          role="Job Seeker"
          description="Find and apply for jobs"
          onClick={() => handleSelect("seeker")}
        />
        <RoleCard
          role="Employer"
          description="Post jobs and hire talent"
          onClick={() => handleSelect("employer")}
        />
        <RoleCard
          role="Admin"
          description="Manage the platform"
          onClick={() => handleSelect("admin")}
        />
      </div>
    </div>
  );
}
