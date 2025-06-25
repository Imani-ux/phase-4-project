import React, { useState } from "react";

// Demo jobs (in a real app, fetch from backend or context)
const demoJobs = [
  { id: 1, title: "Frontend Developer", company: "Acme Corp", location: "Nairobi", type: "Full-time", description: "React, CSS, HTML" },
  { id: 2, title: "Backend Developer", company: "Beta Ltd", location: "Mombasa", type: "Part-time", description: "Python, Django, REST" },
];

export default function SeekerDashboard() {
  const [section, setSection] = useState("My Profile");
  const [jobs] = useState(demoJobs);
  const [applied, setApplied] = useState([]);

  const handleApply = (jobId) => {
    if (!applied.includes(jobId)) setApplied([...applied, jobId]);
  };

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
              <button onClick={() => setSection("My Profile")} style={navBtnStyle(section === "My Profile")}>
                My Profile
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Browse Jobs")} style={navBtnStyle(section === "Browse Jobs")}>
                Browse Jobs
              </button>
            </li>
            <li>
              <button onClick={() => setSection("My Applications")} style={navBtnStyle(section === "My Applications")}>
                My Applications
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Messages")} style={navBtnStyle(section === "Messages")}>
                Messages
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Settings")} style={navBtnStyle(section === "Settings")}>
                Settings
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: "2.5rem 3rem" }}>
        {section === "My Profile" && (
          <div>
            <h2>My Profile</h2>
            <p>Edit your profile, bio, skills, and upload your resume here.</p>
            {/* Add profile form here */}
          </div>
        )}
        {section === "Browse Jobs" && (
          <div>
            <h2>Browse Jobs</h2>
            <div style={{ margin: "1.5rem 0", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {jobs.length === 0 ? (
                <p>No jobs available yet.</p>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} style={jobCardStyle}>
                    <div>
                      <h3 style={{ margin: 0 }}>{job.title}</h3>
                      <p style={{ margin: "0.3rem 0" }}>
                        <strong>Company:</strong> {job.company}<br />
                        <strong>Location:</strong> {job.location}<br />
                        <strong>Type:</strong> {job.type}
                      </p>
                      <p style={{ color: "#555" }}>{job.description}</p>
                    </div>
                    <div>
                      <button
                        style={applied.includes(job.id) ? appliedBtnStyle : applyBtnStyle}
                        disabled={applied.includes(job.id)}
                        onClick={() => handleApply(job.id)}
                      >
                        {applied.includes(job.id) ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        {section === "My Applications" && (
          <div>
            <h2>My Applications</h2>
            {applied.length === 0 ? (
              <p>You haven't applied to any jobs yet.</p>
            ) : (
              <ul>
                {jobs.filter(job => applied.includes(job.id)).map(job => (
                  <li key={job.id} style={{ marginBottom: "1rem", background: "#fff", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 2px 8px #e0e7ef" }}>
                    <strong>{job.title}</strong> at {job.company} — <span style={{ color: "#00c6a7" }}>Pending</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {section === "Messages" && (
          <div>
            <h2>Messages</h2>
            <p>Chat with employers here. (Feature coming soon!)</p>
          </div>
        )}
        {section === "Settings" && (
          <div>
            <h2>Settings</h2>
            <p>Update your account settings.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// --- UI Helper Styles ---
function navBtnStyle(active) {
  return {
    background: "none",
    border: "none",
    color: active ? "#007bff" : "#333",
    fontWeight: active ? "bold" : "normal",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    padding: "0.5rem 0"
  };
}

const jobCardStyle = {
  background: "#fff",
  borderRadius: "1rem",
  boxShadow: "0 2px 12px #e0e7ef",
  padding: "1.5rem",
  minWidth: "260px",
  maxWidth: "320px",
  flex: "1 1 300px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  marginBottom: "1rem"
};

const applyBtnStyle = {
  background: "#00c6a7",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.7rem 1.5rem",
  cursor: "pointer",
  fontWeight: "bold"
};

const appliedBtnStyle = {
  ...applyBtnStyle,
  background: "#eee",
  color: "#888",
  cursor: "not-allowed"
};