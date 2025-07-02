import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const BASE_URL = import.meta.env.VITE_API_URL;


export default function AdminDashboard() {
  const [section, setSection] = useState("Dashboard Overview");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  

  useEffect(() => {
    fetch(`${BASE_URL}/users/`)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);

    fetch(`${BASE_URL}/jobs/`)
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(console.error);
  }, []);

  const updateUserStatus = (id, status) => {
    fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then(() =>
        setUsers(users.map(u => (u.id === id ? { ...u, status } : u)))
      )
      .catch(console.error);
  };

  const deleteJob = (id) => {
    fetch(`${BASE_URL}/jobs/${id}`, { method: "DELETE" })
      .then(() => setJobs(jobs.filter(j => j.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>⚙️ Admin Panel</h3>
        <nav>
          <ul>
            {['Dashboard Overview', 'Manage Users', 'Job Listings', 'Reports/Complaints', 'Analytics', 'Settings'].map(sec => (
              <li key={sec}>
                <button onClick={() => setSection(sec)} className={section === sec ? "active" : ""}>
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
                      <button className="btn btn-suspend" onClick={() => updateUserStatus(u.id, "Suspended")}>Suspend</button>
                    ) : (
                      <button className="btn btn-activate" onClick={() => updateUserStatus(u.id, "Active")}>Activate</button>
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
                    <button className="btn btn-delete" onClick={() => deleteJob(j.id)}>Delete</button>
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
