import React, { useState } from "react";

const demoApplicants = [
  { name: "Jane Doe", skills: "React, Node.js", experience: "3 years", cv: "#" },
  { name: "John Smith", skills: "Python, Django", experience: "2 years", cv: "#" },
];

export default function EmployerDashboard({ jobs, setJobs }) {
  const [section, setSection] = useState("Dashboard");
  const [applicants, setApplicants] = useState(demoApplicants);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [notifications] = useState([
    "New applicant for Frontend Developer",
    "Message from Jane Doe",
  ]);
  const [profile, setProfile] = useState({
    company: "Acme Corp",
    logo: "",
    email: "hr@acme.com",
  });

  // Add a new job
  const handlePostJob = (e) => {
    e.preventDefault();
    setJobs([
      ...jobs,
      {
        id: jobs.length + 1,
        title: jobTitle,
        company: profile.company,
        location: "Nairobi",
        type: "Full-time",
        description: jobDesc,
        views: 0,
        applicants: 0,
        saves: 0,
      },
    ]);
    setJobTitle("");
    setJobDesc("");
    setShowJobForm(false);
    setSection("My Job Listings");
  };

  // Delete a job
  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "90vh", background: "#f6fafd" }}>
      {/* Sidebar */}
      <aside style={{
        width: "240px",
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
              <button onClick={() => setSection("Dashboard")} style={navBtnStyle(section === "Dashboard")}>
                Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Post a Job")} style={navBtnStyle(section === "Post a Job")}>
                Post a Job
              </button>
            </li>
            <li>
              <button onClick={() => setSection("My Job Listings")} style={navBtnStyle(section === "My Job Listings")}>
                My Job Listings
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Applicants")} style={navBtnStyle(section === "Applicants")}>
                Applicants
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Messages")} style={navBtnStyle(section === "Messages")}>
                Messages
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Notifications")} style={navBtnStyle(section === "Notifications")}>
                Notifications
              </button>
            </li>
            <li>
              <button onClick={() => setSection("Edit Profile")} style={navBtnStyle(section === "Edit Profile")}>
                Edit Profile
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main style={{ flex: 1, padding: "2.5rem 3rem" }}>
        {/* Dashboard Overview */}
        {section === "Dashboard" && (
          <div>
            <h2 style={{ color: "#007bff" }}>Dashboard Overview</h2>
            <div style={{ display: "flex", gap: "2rem", margin: "2rem 0" }}>
              <StatCard label="Active Jobs" value={jobs.length} color="#007bff" />
              <StatCard label="Applicants" value={applicants.length} color="#00c6a7" />
              <StatCard label="Notifications" value={notifications.length} color="#ff9800" />
            </div>
            <p>Welcome back! Use the sidebar to manage your jobs and applicants.</p>
          </div>
        )}

        {/* Post a Job */}
        {section === "Post a Job" && (
          <div>
            <h2>Post a Job</h2>
            {!showJobForm ? (
              <button
                onClick={() => setShowJobForm(true)}
                style={{ background: "#007bff", color: "#fff", padding: "0.7rem 1.5rem", border: "none", borderRadius: "0.5rem", margin: "1rem 0" }}
              >
                + New Job
              </button>
            ) : (
              <form onSubmit={handlePostJob} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
                <input
                  type="text"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Job Description"
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  required
                />
                <button type="submit" style={{ background: "#007bff", color: "#fff", padding: "0.7rem", border: "none", borderRadius: "0.5rem" }}>
                  Post Job
                </button>
                <button type="button" onClick={() => setShowJobForm(false)} style={{ background: "#eee", color: "#333", border: "none", borderRadius: "0.5rem", padding: "0.7rem" }}>
                  Cancel
                </button>
              </form>
            )}
          </div>
        )}

        {/* My Job Listings */}
        {section === "My Job Listings" && (
          <div>
            <h2>My Job Listings</h2>
            {jobs.length === 0 ? (
              <p>No jobs posted yet.</p>
            ) : (
              <ul style={{ padding: 0 }}>
                {jobs.map((job) => (
                  <li key={job.id} style={jobCardStyle}>
                    <div>
                      <strong>{job.title}</strong>
                      <p style={{ margin: "0.5rem 0" }}>Views: {job.views} | Applicants: {job.applicants} | Saves: {job.saves}</p>
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

        {/* Applicants */}
        {section === "Applicants" && (
          <div>
            <h2>Applicants</h2>
            <div style={{ marginBottom: "1rem" }}>
              <input placeholder="Filter by skill..." style={{ padding: "0.5rem", borderRadius: "0.3rem", border: "1px solid #ccc" }} />
            </div>
            {applicants.length === 0 ? (
              <p>No applicants yet.</p>
            ) : (
              <ul style={{ padding: 0 }}>
                {applicants.map((a, idx) => (
                  <li key={idx} style={applicantCardStyle}>
                    <div>
                      <strong>{a.name}</strong>
                      <p>Skills: {a.skills}</p>
                      <p>Experience: {a.experience}</p>
                    </div>
                    <div>
                      <a href={a.cv} target="_blank" rel="noopener noreferrer" style={cvBtnStyle}>Download CV</a>
                      <button style={inviteBtnStyle}>Invite to Apply</button>
                      <button style={favBtnStyle}>⭐</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Messages */}
        {section === "Messages" && (
          <div>
            <h2>Messages</h2>
            <p>Chat with job seekers here. (Feature coming soon!)</p>
          </div>
        )}

        {/* Notifications */}
        {section === "Notifications" && (
          <div>
            <h2>Notifications</h2>
            <ul>
              {notifications.map((n, idx) => (
                <li key={idx} style={{ marginBottom: "1rem", background: "#fffbe6", padding: "1rem", borderRadius: "0.5rem" }}>{n}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Edit Profile */}
        {section === "Edit Profile" && (
          <div>
            <h2>Edit Profile</h2>
            <form style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 400 }}>
              <input
                type="text"
                placeholder="Company Name"
                value={profile.company}
                onChange={e => setProfile({ ...profile, company: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
              />
              <input
                type="file"
                onChange={e => setProfile({ ...profile, logo: e.target.files[0]?.name || "" })}
              />
              <button type="button" style={{ background: "#007bff", color: "#fff", padding: "0.7rem", border: "none", borderRadius: "0.5rem" }}>
                Save Changes
              </button>
            </form>
            {profile.logo && <p>Logo uploaded: {profile.logo}</p>}
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

const jobCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
  borderRadius: "0.7rem",
  boxShadow: "0 2px 8px #e0e7ef",
  padding: "1rem 1.5rem",
  marginBottom: "1rem"
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

const applicantCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#fff",
  borderRadius: "0.7rem",
  boxShadow: "0 2px 8px #e0e7ef",
  padding: "1rem 1.5rem",
  marginBottom: "1rem"
};

const cvBtnStyle = {
  background: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1rem",
  marginRight: "0.5rem",
  textDecoration: "none"
};

const inviteBtnStyle = {
  background: "#00c6a7",
  color: "#fff",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1rem",
  marginRight: "0.5rem",
  cursor: "pointer"
};

const favBtnStyle = {
  background: "#fffbe6",
  color: "#ff9800",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1rem",
  cursor: "pointer"
};