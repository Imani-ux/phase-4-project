import React, { useEffect, useState } from "react";

export default function SeekerDashboard() {
  const [section, setSection] = useState("My Profile");
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState([]);
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    skills: "",
    resume_url: ""
  });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (token && user?.id) {
      fetchJobs();
      fetchApplications();
      fetchProfile();
    }
  }, [token, user?.id]);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/jobs/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setJobs(data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/applications/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        const appliedIds = data.map((app) => app.job_id);
        setApplied(appliedIds);
      }
    } catch (err) {
      console.error("Failed to fetch applications", err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProfile(data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Profile update failed:", data.error || data);
        alert("Update failed: " + (data.error || "Invalid data."));
      } else {
        alert("Profile updated successfully!");
        setProfile(data.user); // Ensure form reflects saved data
      }
    } catch (err) {
      console.error("Profile update error", err);
      alert("An error occurred while updating your profile.");
    }
  };

  const handleApply = async (jobId) => {
    if (applied.includes(jobId)) return;
    try {
      const res = await fetch("http://localhost:5000/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id: jobId }),
      });
      const data = await res.json();
      if (res.ok) {
        setApplied([...applied, jobId]);
        // Optionally show a success message
      } else {
        alert(data.error || "Failed to apply for job");
      }
    } catch (err) {
      alert("Application failed: " + err.message);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "80vh", background: "#f6fafd" }}>
      <aside style={asideStyle}>
        <h3 style={{ color: "#007bff", marginBottom: "2rem" }}>My Dashboard</h3>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2.2" }}>
            {["My Profile", "Browse Jobs", "My Applications", "Messages", "Settings"].map((label) => (
              <li key={label}>
                <button onClick={() => setSection(label)} style={navBtnStyle(section === label)}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: "2.5rem 3rem" }}>
        {section === "My Profile" && (
          <div>
            <h2>My Profile</h2>
            <form onSubmit={updateProfile} style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input
                type="text"
                placeholder="Full Name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                required
              />
              <textarea
                placeholder="Bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
              />
              <input
                type="text"
                placeholder="Skills (e.g. React, Python)"
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              />
              <input
                type="url"
                placeholder="Resume URL"
                value={profile.resume_url}
                onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
              />
              <button type="submit" style={applyBtnStyle}>Update Profile</button>
            </form>
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
                      <h3>{job.title}</h3>
                      <p>
                        <strong>Location:</strong> {job.location}<br />
                        <strong>Type:</strong> {job.type}<br />
                        <strong>Employer:</strong> {job.employer?.full_name || "N/A"}<br />
                        <strong>Email:</strong> {job.employer?.email || "N/A"}
                      </p>
                      <p>{job.description}</p>
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
                  <li key={job.id} style={applicationCardStyle}>
                    <strong>{job.title}</strong> — <span style={{ color: "#00c6a7" }}>Pending/Accepted/Declined</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {section === "Messages" && (
          <div><h2>Messages</h2><p>Chat with employers here. (Coming soon!)</p></div>
        )}

        {section === "Settings" && (
          <div><h2>Settings</h2><p>Update your account settings here.</p></div>
        )}
      </main>
    </div>
  );
}

// --- Styles ---
const asideStyle = {
  width: "220px",
  background: "#fff",
  boxShadow: "2px 0 12px #e0e7ef",
  padding: "2rem 1rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem"
};

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

const applicationCardStyle = {
  marginBottom: "1rem",
  background: "#fff",
  padding: "1rem",
  borderRadius: "0.5rem",
  boxShadow: "0 2px 8px #e0e7ef"
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

