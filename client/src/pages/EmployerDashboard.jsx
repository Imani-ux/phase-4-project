import React, { useEffect, useState } from "react";

const TOWNS = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kitale", "Malindi", "Garissa", "Nyeri", "Machakos", "Meru", "Embu", "Kericho", "Naivasha"
];

export default function EmployerDashboard() {
  const [section, setSection] = useState("Dashboard");
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobLocation, setJobLocation] = useState(TOWNS[0]);
  const [jobType, setJobType] = useState("Full-time");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [editJobData, setEditJobData] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [applicantsByJob, setApplicantsByJob] = useState({});
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [editingApplicantData, setEditingApplicantData] = useState({});
  const [profile, setProfile] = useState({
    full_name: "",
    bio: "",
    skills: "",
    resume_url: ""
  });
  const [profileLoading, setProfileLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchEmployerJobs();
    fetchNotifications();
    fetchProfile();
    // eslint-disable-next-line
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

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/jobs/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      setNotifications([]);
    }
  };

  const fetchApplicants = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/jobs/${jobId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setApplicantsByJob((prev) => ({ ...prev, [jobId]: data }));
    } catch (err) {
      setApplicantsByJob((prev) => ({ ...prev, [jobId]: [] }));
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/jobs/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: jobTitle,
          description: jobDesc,
          location: jobLocation,
          type: jobType,
        }),
      });

      const data = await res.json();
      if (res.ok && data.job) {
        await fetchEmployerJobs();
        setJobTitle("");
        setJobDesc("");
        setJobLocation(TOWNS[0]);
        setJobType("Full-time");
        setShowJobForm(false);
        setSection("My Job Listings");
      } else {
        alert(data.error ? data.error : JSON.stringify(data));
      }
    } catch (err) {
      alert("Error posting job: " + err.message);
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

  // --- Edit Job Logic ---
  const handleEditClick = (job) => {
    setEditJobId(job.id);
    setEditJobData({
      title: job.title,
      description: job.description,
      location: job.location,
      type: job.type,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editJobData),
      });
      const data = await res.json();
      if (res.ok) {
        await fetchEmployerJobs();
        setEditJobId(null);
        setEditJobData({});
      } else {
        alert(data.error || "Failed to update job");
      }
    } catch (err) {
      alert("Error updating job: " + err.message);
    }
  };

  const handleEditCancel = () => {
    setEditJobId(null);
    setEditJobData({});
  };

  // --- Profile logic ---
  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProfile(data);
    } catch (err) {
      // Optionally handle error
    }
    setProfileLoading(false);
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

  const handleEditApplicant = (applicant) => {
    setEditingApplicant(applicant.user_id);
    setEditingApplicantData({ ...applicant });
  };

  const handleApplicantChange = (e) => {
    const { name, value } = e.target;
    setEditingApplicantData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveApplicant = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/jobs/applicants/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingApplicantData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Applicant updated!");
        setEditingApplicant(null);
        setEditingApplicantData({});
        // Optionally refresh applicants for the job
        const jobId = jobs.find(j => applicantsByJob[j.id]?.some(a => a.user_id === userId))?.id;
        if (jobId) fetchApplicants(jobId);
      } else {
        alert(data.error || "Failed to update applicant");
      }
    } catch (err) {
      alert("Error updating applicant: " + err.message);
    }
  };

  const handleCancelApplicant = () => {
    setEditingApplicant(null);
    setEditingApplicantData({});
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
                <input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  required
                  style={inputStyle}
                />
                <textarea
                  placeholder="Job Description"
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  required
                  style={inputStyle}
                />
                <select
                  value={jobLocation}
                  onChange={e => setJobLocation(e.target.value)}
                  required
                  style={inputStyle}
                >
                  {TOWNS.map((town) => (
                    <option key={town} value={town}>{town}</option>
                  ))}
                </select>
                <select
                  value={jobType}
                  onChange={e => setJobType(e.target.value)}
                  required
                  style={inputStyle}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
                <button type="submit" style={primaryBtnStyle}>Post Job</button>
                <button type="button" onClick={() => setShowJobForm(false)} style={cancelBtnStyle}>Cancel</button>
              </form>
            )}
          </div>
        )}

        {section === "Notifications" && (
          <div>
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              <ul>
                {notifications.map((note) => (
                  <li key={note.id} style={{
                    background: "#fff",
                    color: "#222",
                    borderRadius: "0.5rem",
                    marginBottom: "1rem",
                    padding: "1rem",
                    boxShadow: "0 2px 8px #e0e7ef"
                  }}>
                    {note.message}
                  </li>
                ))}
              </ul>
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
                    <div style={{ width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong>{job.title}</strong>
                          <p style={{ margin: "0.5rem 0" }}>Location: {job.location} | Type: {job.type}</p>
                        </div>
                        <div>
                          <button style={editBtnStyle} onClick={() => handleEditClick(job)}>Edit</button>
                          <button style={deleteBtnStyle} onClick={() => handleDeleteJob(job.id)}>Delete</button>
                          <button style={primaryBtnStyle} onClick={() => fetchApplicants(job.id)}>View Applicants</button>
                        </div>
                      </div>
                      {applicantsByJob[job.id] && (
                        <div style={{ marginTop: "1rem", background: "#222", borderRadius: "0.5rem", padding: "1rem" }}>
                          <h4 style={{ color: "#00ffd0" }}>Applicants</h4>
                          {applicantsByJob[job.id].length === 0 ? (
                            <p>No applicants yet.</p>
                          ) : (
                            <ul>
                              {applicantsByJob[job.id].map(applicant => (
                                <li key={applicant.user_id} style={{ marginBottom: "1rem", background: "#fff", color: "#222", borderRadius: "0.5rem", padding: "0.7rem" }}>
                                  {editingApplicant === applicant.user_id ? (
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                      <input
                                        type="text"
                                        name="full_name"
                                        value={editingApplicantData.full_name}
                                        onChange={handleApplicantChange}
                                        placeholder="Full Name"
                                        style={inputStyle}
                                      />
                                      <input
                                        type="text"
                                        name="bio"
                                        value={editingApplicantData.bio}
                                        onChange={handleApplicantChange}
                                        placeholder="Bio"
                                        style={inputStyle}
                                      />
                                      <input
                                        type="text"
                                        name="skills"
                                        value={editingApplicantData.skills}
                                        onChange={handleApplicantChange}
                                        placeholder="Skills"
                                        style={inputStyle}
                                      />
                                      <input
                                        type="url"
                                        name="resume_url"
                                        value={editingApplicantData.resume_url}
                                        onChange={handleApplicantChange}
                                        placeholder="Resume URL"
                                        style={inputStyle}
                                      />
                                      <select
                                        name="role"
                                        value={editingApplicantData.role}
                                        onChange={handleApplicantChange}
                                        style={inputStyle}
                                      >
                                        <option value="seeker">Seeker</option>
                                        <option value="employer">Employer</option>
                                        <option value="admin">Admin</option>
                                      </select>
                                      <button style={actionBtnStyle} onClick={() => handleSaveApplicant(applicant.user_id)}>Save</button>
                                      <button style={actionBtnStyle} onClick={handleCancelApplicant}>Cancel</button>
                                    </div>
                                  ) : (
                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                      <div style={{ flex: 1 }}>
                                        <strong>{applicant.full_name}</strong> ({applicant.email})<br />
                                        Role: {applicant.role}<br />
                                        Bio: {applicant.bio}<br />
                                        Skills: {applicant.skills}<br />
                                        <a href={applicant.resume_url} target="_blank" rel="noopener noreferrer">Resume</a><br />
                                        Status: <span style={{ color: applicant.status === "Accepted" ? "#00c6a7" : applicant.status === "Declined" ? "#ff4d4f" : "#888" }}>{applicant.status}</span>
                                      </div>
                                      <button style={actionBtnStyle} onClick={() => handleEditApplicant(applicant)}>Edit</button>
                                      <button
                                        style={actionBtnStyle}
                                        onClick={async () => {
                                          await fetch(`http://localhost:5000/applications/${applicant.application_id}/accept`, {
                                            method: "PUT",
                                            headers: { Authorization: `Bearer ${token}` }
                                          });
                                          fetchApplicants(job.id);
                                        }}
                                        disabled={applicant.status === "Accepted"}
                                      >
                                        Accept
                                      </button>
                                      <button
                                        style={actionBtnStyle}
                                        onClick={async () => {
                                          await fetch(`http://localhost:5000/applications/${applicant.application_id}/decline`, {
                                            method: "PUT",
                                            headers: { Authorization: `Bearer ${token}` }
                                          });
                                          fetchApplicants(job.id);
                                        }}
                                        disabled={applicant.status === "Declined"}
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
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

        {section === "Edit Profile" && (
          <div>
            <h2>Edit Profile</h2>
            {profileLoading ? (
              <p>Loading...</p>
            ) : (
              <form onSubmit={updateProfile} style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={profile.full_name}
                  onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Bio"
                  value={profile.bio}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Skills (e.g. React, Python)"
                  value={profile.skills}
                  onChange={e => setProfile({ ...profile, skills: e.target.value })}
                />
                <input
                  type="url"
                  placeholder="Resume URL"
                  value={profile.resume_url}
                  onChange={e => setProfile({ ...profile, resume_url: e.target.value })}
                />
                <button type="submit" style={primaryBtnStyle}>Update Profile</button>
              </form>
            )}
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

const actionBtnStyle = {
  background: "#00c6a7",
  color: "#fff",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1.2rem",
  marginRight: "0.5rem",
  cursor: "pointer",
  fontSize: "1rem",
  minWidth: "90px"
};
