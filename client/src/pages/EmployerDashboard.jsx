import React, { useState } from "react";

export default function EmployerDashboard() {
  const [section, setSection] = useState("Post a Job");

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
        <h3 style={{ color: "#007bff", marginBottom: "2rem" }}>Employer Panel</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
            <li>
              <button onClick={() => setSection("Post a Job")} style={{ background: "none", border: "none", color: section === "Post a Job" ? "#007bff" : "#333", cursor: "pointer" }}>
                Post a Job
              </button>
            </li>
            <li>
              <button onClick={() => setSection("My Job Listings")} style={{ background: "none", border: "none", color: section === "My Job Listings" ? "#007bff" : "#333", cursor: "pointer" }}>
                My Job Listings
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Applicants")} style={{ background: "none", border: "none", color: section === "Applicants" ? "#007bff" : "#333", cursor: "pointer" }}>
                Applicants
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Messages")} style={{ background: "none", border: "none", color: section === "Messages" ? "#007bff" : "#333", cursor: "pointer" }}>
                Messages
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Reviews")} style={{ background: "none", border: "none", color: section === "Reviews" ? "#007bff" : "#333", cursor: "pointer" }}>
                Reviews
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
        {section === "Post a Job" && <div><h2>Post a Job</h2><p>Form to post a new job will go here.</p></div>}
        {section === "My Job Listings" && <div><h2>My Job Listings</h2><p>List of jobs you have posted.</p></div>}
        {section === "Applicants" && <div><h2>Applicants</h2><p>View and manage applicants for your jobs.</p></div>}
        {section === "Messages" && <div><h2>Messages</h2><p>Chat with job seekers here.</p></div>}
        {section === "Reviews" && <div><h2>Reviews</h2><p>See and give feedback to job seekers.</p></div>}
        {section === "Settings" && <div><h2>Settings</h2><p>Update your employer profile and preferences.</p></div>}
      </main>
    </div>
  );
}