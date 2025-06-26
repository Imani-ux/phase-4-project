import React, { useEffect, useState } from "react";

export default function EmployerDashboard() {
  const [section, setSection] = useState("Dashboard");
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [notifications] = useState(["New applicant for Frontend Developer", "Message from Jane Doe"]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchEmployerJobs();
  }, []);

  const fetchEmployerJobs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/jobs/employer/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: jobTitle,
          description: jobDesc,
          location: "Nairobi",
          type: "Full-time",
          employer_id: user.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setJobs([...jobs, data.job]);
        setJobTitle("");
        setJobDesc("");
        setShowJobForm(false);
        setSection("My Job Listings");
      } else {
        alert(data.error || "Failed to post job");
      }
    } catch (err) {
      console.error("Error posting job:", err);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setJobs(jobs.filter((job) => job.id !== id));
      } else {
        alert("Failed to delete job");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}>
      <aside style={sidebarStyle}>
        <h3 style={{ color: "#00c6a7", fontSize: "1.6rem" }}>Employer Panel</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Dashboard", "Post a Job", "My Job Listings", "Applicants", "Messages", "Notifications", "Edit Profile"].map(item => (
              <li key={item}>
                <button onClick={() => setSection(item)} style={navBtnStyle(section === item)}>{item}</button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "3rem", color: "#fff" }}>
        {section === "Dashboard" && (
          <>
            <h2 style={{ color: "#00ffd0" }}>Dashboard Overview</h2>
            <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
              <StatCard label="Active Jobs" value={jobs.length} color="#00c6a7" />
              <StatCard label="Applicants" value={applicants.length} color="#ff9800" />
              <StatCard label="Notifications" value={notifications.length} color="#ff4d4f" />
            </div>
          </>
        )}

        {section === "Post a Job" && (
          <div>
            <h2>Post a Job</h2>
            {!showJobForm ? (
              <button onClick={() => setShowJobForm(true)} style={primaryBtnStyle}>+ New Job</button>
            ) : (
              <form onSubmit={handlePostJob} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
                <input type="text" placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required style={inputStyle} />
                <textarea placeholder="Job Description" value={jobDesc} onChange={e => setJobDesc(e.target.value)} required style={inputStyle} />
                <button type="submit" style={primaryBtnStyle}>Post Job</button>
                <button type="button" onClick={() => setShowJobForm(false)} style={cancelBtnStyle}>Cancel</button>
              </form>
            )}
          </div>
        )}

        {section === "My Job Listings" && (
          <div>
            <h2>My Job Listings</h2>
            {jobs.length === 0 ? <p>No jobs posted yet.</p> : (
              <ul style={{ padding: 0 }}>
                {jobs.map((job) => (
                  <li key={job.id} style={jobCardStyle}>
                    <div>
                      <strong>{job.title}</strong>
                      <p style={{ margin: "0.5rem 0" }}>Location: {job.location} | Type: {job.type}</p>
                    </div>
                    <div>
                      <button style={editBtnStyle}>Edit</button>
                      <button style={deleteBtnStyle} onClick={() => handleDeleteJob(job.id)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {section === "Applicants" && (
          <div>
            <h2>Applicants</h2>
            <p>Applicant view per job will be implemented soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}

// Styles & Components
const sidebarStyle = {
  width: "240px",
  background: "#1a1a2e",
  color: "#eee",
  padding: "2rem 1rem",
  boxShadow: "2px 0 12px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem"
};

function navBtnStyle(active) {
  return {
    background: "none",
    border: "none",
    color: active ? "#00ffd0" : "#ccc",
    fontWeight: active ? "bold" : "normal",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "1rem",
    margin: "0.5rem 0",
  };
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: "#1f2937",
      borderRadius: "1rem",
      padding: "2rem",
      flex: 1,
      color,
      boxShadow: `0 0 12px ${color}40`
    }}>
      <h4>{label}</h4>
      <p style={{ fontSize: "2rem" }}>{value}</p>
    </div>
  );
}

const inputStyle = {
  padding: "0.8rem",
  borderRadius: "0.4rem",
  border: "1px solid #444",
  background: "#1a1a2e",
  color: "#fff"
};

const primaryBtnStyle = {
  background: "#00c6a7",
  color: "#fff",
  padding: "0.7rem 1.5rem",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer"
};

const cancelBtnStyle = {
  background: "#ccc",
  color: "#000",
  padding: "0.7rem 1.5rem",
  border: "none",
  borderRadius: "0.5rem",
  cursor: "pointer"
};

const jobCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#1f2937",
  borderRadius: "0.7rem",
  padding: "1rem 1.5rem",
  marginBottom: "1rem",
  color: "#fff",
};

const editBtnStyle = {
  background: "#00c6a7",
  color: "#fff",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1rem",
  marginRight: "0.5rem",
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
