import React, { useState } from "react";

export default function SeekerDashboard() {
  const [section, setSection] = useState("My Profile");

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
        <h3 style={{ color: "#007bff", marginBottom: "2rem" }}>My Dashboard</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
            <li>
              <button onClick={() => setSection("My Profile")} style={{ background: "none", border: "none", color: section === "My Profile" ? "#007bff" : "#333", cursor: "pointer" }}>
                My Profile
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Browse Jobs")} style={{ background: "none", border: "none", color: section === "Browse Jobs" ? "#007bff" : "#333", cursor: "pointer" }}>
                Browse Jobs
              </button>
            </li>
            <li>
              <button onClick={() => setSection("My Applications")} style={{ background: "none", border: "none", color: section === "My Applications" ? "#007bff" : "#333", cursor: "pointer" }}>
                My Applications
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Messages")} style={{ background: "none", border: "none", color: section === "Messages" ? "#007bff" : "#333", cursor: "pointer" }}>
                Messages
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
        {section === "My Profile" && <div><h2>My Profile</h2><p>Edit your profile, bio, skills, and upload your resume here.</p></div>}
        {section === "Browse Jobs" && <div><h2>Browse Jobs</h2><p>Search and filter jobs here.</p></div>}
        {section === "My Applications" && <div><h2>My Applications</h2><p>Track your job applications and their status.</p></div>}
        {section === "Messages" && <div><h2>Messages</h2><p>Chat with employers here.</p></div>}
        {section === "Settings" && <div><h2>Settings</h2><p>Update your account settings.</p></div>}
      </main>
    </div>
  );
}