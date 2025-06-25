import React, { useState } from "react";

// Demo data for users and jobs
const demoUsers = [
  { id: 1, name: "Alice", email: "alice@email.com", role: "Seeker", status: "Active" },
  { id: 2, name: "Bob", email: "bob@email.com", role: "Employer", status: "Suspended" },
];
const demoJobs = [
  { id: 1, title: "Frontend Developer", company: "Acme Corp", status: "Active" },
  { id: 2, title: "Backend Developer", company: "Beta Ltd", status: "Pending" },
];

export default function AdminDashboard() {
  const [section, setSection] = useState("Dashboard Overview");
  const [users, setUsers] = useState(demoUsers);
  const [jobs, setJobs] = useState(demoJobs);

  // Example handlers
  const handleSuspend = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: "Suspended" } : u));
  };
  const handleActivate = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: "Active" } : u));
  };
  const handleDeleteJob = (id) => {
    setJobs(jobs.filter(j => j.id !== id));
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
        <h3 style={{ color: "#007bff", marginBottom: "2rem" }}>Admin Panel</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
            <li>
              <button onClick={() => setSection("Dashboard Overview")} style={navBtnStyle(section === "Dashboard Overview")}>
                Dashboard Overview
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Manage Users")} style={navBtnStyle(section === "Manage Users")}>
                Manage Users
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Job Listings")} style={navBtnStyle(section === "Job Listings")}>
                Job Listings
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Reports/Complaints")} style={navBtnStyle(section === "Reports/Complaints")}>
                Reports/Complaints
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Analytics")} style={navBtnStyle(section === "Analytics")}>
                Analytics
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
        {section === "Dashboard Overview" && (
          <div>
            <h2>Dashboard Overview</h2>
            <div style={{ display: "flex", gap: "2rem", margin: "2rem 0" }}>
              <StatCard label="Total Users" value={users.length} color="#007bff" />
              <StatCard label="Total Jobs" value={jobs.length} color="#00c6a7" />
            </div>
            <p>Platform stats and summary.</p>
          </div>
        )}
        {section === "Manage Users" && (
          <div>
            <h2>Manage Users</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.status}</td>
                    <td>
                      {u.status === "Active" ? (
                        <button style={suspendBtnStyle} onClick={() => handleSuspend(u.id)}>Suspend</button>
                      ) : (
                        <button style={activateBtnStyle} onClick={() => handleActivate(u.id)}>Activate</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {section === "Job Listings" && (
          <div>
            <h2>Job Listings</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id}>
                    <td>{j.title}</td>
                    <td>{j.company}</td>
                    <td>{j.status}</td>
                    <td>
                      <button style={deleteBtnStyle} onClick={() => handleDeleteJob(j.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {section === "Reports/Complaints" && (
          <div>
            <h2>Reports/Complaints</h2>
            <p>Handle abuse reports here.</p>
          </div>
        )}
        {section === "Analytics" && (
          <div>
            <h2>Analytics</h2>
            <p>See platform analytics and charts.</p>
          </div>
        )}
        {section === "Settings" && (
          <div>
            <h2>Settings</h2>
            <p>System controls and settings.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// --- UI Helper Styles and Components ---

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

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: "1rem",
      boxShadow: "0 2px 12px #e0e7ef",
      padding: "2rem",
      minWidth: "180px",
      flex: 1,
      textAlign: "center"
    }}>
      <h4 style={{ color }}>{label}</h4>
      <p style={{ fontSize: "2rem", color }}>{value}</p>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  background: "#fff",
  borderRadius: "0.7rem",
  boxShadow: "0 2px 8px #e0e7ef",
  margin: "1.5rem 0",
  borderCollapse: "collapse"
};

const suspendBtnStyle = {
  background: "#ff9800",
  color: "#fff",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1rem",
  cursor: "pointer"
};

const activateBtnStyle = {
  background: "#00c6a7",
  color: "#fff",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1rem",
  cursor: "pointer"
};

const deleteBtnStyle = {
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1rem",
  cursor: "pointer"
};