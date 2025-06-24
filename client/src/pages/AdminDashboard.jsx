import React, { useState } from "react";

export default function AdminDashboard() {
  const [section, setSection] = useState("Dashboard Overview");

  return (
    <div style={{ display: "flex", minHeight: "80vh", background: "#f6fafd" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "#fff",
        boxShadow: "2px 0 12px #e0e7ef",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem"
      }}>
        <h3 style={{ color: "#007bff", marginBottom: "2rem" }}>Admin Panel</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
            <li>
              <button onClick={() => setSection("Dashboard Overview")} style={{ background: "none", border: "none", color: section === "Dashboard Overview" ? "#007bff" : "#333", cursor: "pointer" }}>
                Dashboard Overview
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Manage Users")} style={{ background: "none", border: "none", color: section === "Manage Users" ? "#007bff" : "#333", cursor: "pointer" }}>
                Manage Users
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Job Listings")} style={{ background: "none", border: "none", color: section === "Job Listings" ? "#007bff" : "#333", cursor: "pointer" }}>
                Job Listings
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Reports/Complaints")} style={{ background: "none", border: "none", color: section === "Reports/Complaints" ? "#007bff" : "#333", cursor: "pointer" }}>
                Reports/Complaints
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Analytics")} style={{ background: "none", border: "none", color: section === "Analytics" ? "#007bff" : "#333", cursor: "pointer" }}>
                Analytics
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Settings")} style={{ background: "none", border: "none", color: section === "Settings" ? "#007bff" : "#333", cursor: "pointer" }}>
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: "2.5rem 3rem" }}>
        {section === "Dashboard Overview" && <div><h2>Dashboard Overview</h2><p>Platform stats and summary.</p></div>}
        {section === "Manage Users" && <div><h2>Manage Users</h2><p>View, suspend, or delete user accounts.</p></div>}
        {section === "Job Listings" && <div><h2>Job Listings</h2><p>Moderate all job posts.</p></div>}
        {section === "Reports/Complaints" && <div><h2>Reports/Complaints</h2><p>Handle abuse reports here.</p></div>}
        {section === "Analytics" && <div><h2>Analytics</h2><p>See platform analytics and charts.</p></div>}
        {section === "Settings" && <div><h2>Settings</h2><p>System controls and settings.</p></div>}
      </main>
    </div>
  );
}