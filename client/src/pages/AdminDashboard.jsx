import React, { useState } from "react";

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
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", color: "#e0f7fa", fontFamily: "'Segoe UI', sans-serif" }}>
      <aside style={{
        width: "250px",
        background: "#1a1a40",
        boxShadow: "2px 0 20px rgba(0,0,0,0.4)",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem"
      }}>
        <h3 style={{ color: "#00ffc3", marginBottom: "2rem", textAlign: "center" }}>⚙️ Admin Panel</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
            {['Dashboard Overview', 'Manage Users', 'Job Listings', 'Reports/Complaints', 'Analytics', 'Settings'].map((sec) => (
              <li key={sec}>
                <button onClick={() => setSection(sec)} style={navBtnStyle(section === sec)}>{sec}</button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "2.5rem 3rem" }}>
        <h2 style={{ borderBottom: "2px solid #00c6a7", paddingBottom: "0.5rem" }}>{section}</h2>

        {section === "Dashboard Overview" && (
          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", gap: "2rem" }}>
              <StatCard label="Total Users" value={users.length} color="#00ffc3" />
              <StatCard label="Total Jobs" value={jobs.length} color="#ff4d4f" />
            </div>
          </div>
        )}

        {section === "Manage Users" && (
          <div style={{ marginTop: "2rem" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.status}</td>
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
          <div style={{ marginTop: "2rem" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Title</th><th>Company</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id}>
                    <td>{j.title}</td><td>{j.company}</td><td>{j.status}</td>
                    <td><button style={deleteBtnStyle} onClick={() => handleDeleteJob(j.id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {section === "Reports/Complaints" && <p style={{ marginTop: "2rem" }}>Handle user reports here.</p>}
        {section === "Analytics" && <p style={{ marginTop: "2rem" }}>View analytics and insights.</p>}
        {section === "Settings" && <p style={{ marginTop: "2rem" }}>System preferences and configuration.</p>}
      </main>
    </div>
  );
}

function navBtnStyle(active) {
  return {
    background: active ? "#00ffc320" : "transparent",
    border: "none",
    color: active ? "#00ffc3" : "#ccc",
    fontWeight: active ? "bold" : "normal",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    transition: "0.3s ease"
  };
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "#1f1f3b",
      borderRadius: "1rem",
      boxShadow: `0 0 12px ${color}55`,
      padding: "2rem",
      minWidth: "200px",
      textAlign: "center"
    }}>
      <h4 style={{ color }}>{label}</h4>
      <p style={{ fontSize: "2rem", color }}>{value}</p>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  background: "#1f1f3b",
  borderRadius: "1rem",
  boxShadow: "0 2px 14px rgba(0, 255, 195, 0.1)",
  marginTop: "1rem",
  padding: "1rem",
  color: "#e0f7fa",
  borderCollapse: "collapse"
};

const suspendBtnStyle = {
  background: "#ff9800",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.5rem 1.2rem",
  cursor: "pointer"
};

const activateBtnStyle = {
  background: "#00c6a7",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.5rem 1.2rem",
  cursor: "pointer"
};

const deleteBtnStyle = {
  background: "#ff4d4f",
  color: "#fff",
  border: "none",
  borderRadius: "0.5rem",
  padding: "0.5rem 1.2rem",
  cursor: "pointer"
};
