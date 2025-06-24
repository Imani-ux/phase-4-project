import React from "react";
import RoleCard from "../components/RoleCard";

export default function SelectRole() {
  const handleSelect = (role) => {
    alert(`Selected: ${role}`);
    // You can navigate or set state here later
  };

  return (
    <div style={{ maxWidth: 700, margin: "3rem auto", textAlign: "center" }}>
      <h2>Select Your Role</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginTop: "2rem", flexWrap: "wrap" }}>
        <RoleCard role="Job Seeker" description="Find and apply for jobs" onClick={() => handleSelect("Job Seeker")} />
        <RoleCard role="Employer" description="Post jobs and hire talent" onClick={() => handleSelect("Employer")} />
        <RoleCard role="Admin" description="Manage the platform" onClick={() => handleSelect("Admin")} />
      </div>
    </div>
  );
}