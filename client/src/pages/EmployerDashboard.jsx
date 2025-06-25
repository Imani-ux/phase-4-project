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

  const handleDeleteJob = (id) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}>
      <aside style={{
        width: "240px",
        background: "#1a1a2e",
        color: "#eee",
        padding: "2rem 1rem",
        boxShadow: "2px 0 12px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem"
      }}>
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

        {section === "Applicants" && (
          <div>
            <h2>Applicants</h2>
            {applicants.length === 0 ? <p>No applicants yet.</p> : (
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
                      <button style={inviteBtnStyle}>Invite</button>
                      <button style={favBtnStyle}>★</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

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

const applicantCardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#1f2937",
  borderRadius: "0.7rem",
  padding: "1rem 1.5rem",
  marginBottom: "1rem",
  color: "#fff"
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
  background: "#2c2c54",
  color: "#ffd700",
  border: "none",
  borderRadius: "0.4rem",
  padding: "0.4rem 1rem",
  cursor: "pointer"
};
