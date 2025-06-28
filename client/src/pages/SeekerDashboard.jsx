import React, { useEffect, useState } from "react";
import "./seeker-dashboard.css"; // 👈 Make sure you import the futuristic CSS

export default function SeekerDashboard() {
  const [section, setSection] = useState("My Profile");
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState([]);
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    skills: "",
    resume_url: "",
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
        alert("Update failed: " + (data.error || "Invalid data."));
      } else {
        alert("Profile updated successfully!");
        setProfile(data.user);
      }
    } catch (err) {
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
      } else {
        alert(data.error || "Failed to apply for job");
      }
    } catch (err) {
      alert("Application failed: " + err.message);
    }
  };

  return (
    <div className="dashboard">
      <aside className="dashboard-aside">
        <h3>My Dashboard</h3>
        <ul>
          {["My Profile", "Browse Jobs", "My Applications", "Messages", "Settings"].map((label) => (
            <li key={label}>
              <button
                className={section === label ? "active" : ""}
                onClick={() => setSection(label)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className="dashboard-main">
        {section === "My Profile" && (
          <div>
            <h2>My Profile</h2>
            <form onSubmit={updateProfile} className="profile-form">
              <input
                type="text"
                placeholder="Full Name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
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
              <button type="submit" className="btn-update">Update Profile</button>
            </form>
          </div>
        )}

        {section === "Browse Jobs" && (
          <div>
            <h2>Browse Jobs</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
              {jobs.length === 0 ? (
                <p>No jobs available yet.</p>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="job-card">
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
                        className={applied.includes(job.id) ? "btn-applied" : "btn-apply"}
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
                  <li key={job.id} className="application-card">
                    <strong>{job.title}</strong> — <span style={{ color: "#00c6a7" }}>Pending</span>
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
