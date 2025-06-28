import React, { useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [section, setSection] = useState("Dashboard Overview");
  const [users, setUsers] = useState([
    { id: 1, name: "Alice", email: "alice@email.com", role: "Seeker", status: "Active" },
    { id: 2, name: "Bob", email: "bob@email.com", role: "Employer", status: "Suspended" },
  ]);
  const [jobs, setJobs] = useState([
    { id: 1, title: "Frontend Developer", company: "Acme Corp", status: "Active" },
    { id: 2, title: "Backend Developer", company: "Beta Ltd", status: "Pending" },
  ]);

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
    <div className="dashboard">
      <aside className="sidebar">
        <h3>⚙️ Admin Panel</h3>
        <nav>
          <ul>
            {['Dashboard Overview', 'Manage Users', 'Job Listings', 'Reports/Complaints', 'Analytics', 'Settings'].map((sec) => (
              <li key={sec}>
                <button
                  onClick={() => setSection(sec)}
                  className={section === sec ? "active" : ""}
                >
                  {sec}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="main">
        <h2>{section}</h2>

        {section === "Dashboard Overview" && (
          <div className="stats">
            <div className="stat-card" style={{ boxShadow: "0 0 12px #00ffc355" }}>
              <h4 style={{ color: "#00ffc3" }}>Total Users</h4>
              <p style={{ fontSize: "2rem", color: "#00ffc3" }}>{users.length}</p>
            </div>
            <div className="stat-card" style={{ boxShadow: "0 0 12px #ff4d4f55" }}>
              <h4 style={{ color: "#ff4d4f" }}>Total Jobs</h4>
              <p style={{ fontSize: "2rem", color: "#ff4d4f" }}>{jobs.length}</p>
            </div>
          </div>
        )}

        {section === "Manage Users" && (
          <table>
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
                      <button className="btn btn-suspend" onClick={() => handleSuspend(u.id)}>Suspend</button>
                    ) : (
                      <button className="btn btn-activate" onClick={() => handleActivate(u.id)}>Activate</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {section === "Job Listings" && (
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Company</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id}>
                  <td>{j.title}</td><td>{j.company}</td><td>{j.status}</td>
                  <td>
                    <button className="btn btn-delete" onClick={() => handleDeleteJob(j.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {section === "Reports/Complaints" && <p style={{ marginTop: "2rem" }}>Handle user reports here.</p>}
        {section === "Analytics" && <p style={{ marginTop: "2rem" }}>View analytics and insights.</p>}
        {section === "Settings" && <p style={{ marginTop: "2rem" }}>System preferences and configuration.</p>}
      </main>
    </div>
  );
}
