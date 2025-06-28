import React, { useEffect, useState } from "react";
import "./EmployerDashboard.css"; 

// Suppress React DevTools installation prompt
if (typeof window !== 'undefined') {
  window.__REACT_DEVTOOLS_HOOK__ = { inject: () => {} };
}

const TOWNS = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Kitale", 
  "Malindi", "Garissa", "Nyeri", "Machakos", "Meru", "Embu", "Kericho", "Naivasha"
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

  const fetchEmployerJobs = async () => {
    try {
      const res = await fetch(`http://localhost:5000/jobs/employer/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      
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
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployerJobs();
    fetchNotifications();
    fetchProfile();
  }, []);

  // Add other API functions here (handlePostJob, handleDeleteJob, etc.)

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Employer Panel</h3>
        </div>
        <nav className="nav-menu">
          {["Dashboard", "Post a Job", "My Job Listings", "Applicants", "Messages", "Notifications", "Edit Profile"].map(item => (
            <div key={item} className="nav-item">
              <button 
                className={item === section ? "active" : ""} 
                onClick={() => setSection(item)}
              >
                {item}
              </button>
            </div>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {section === "Dashboard" && (
          <>
            <h2 className="section-title">Dashboard Overview</h2>
            <div className="stat-cards">
              <div className="stat-card blue">
                <h4>Active Jobs</h4>
                <p>{jobs.length}</p>
              </div>
              <div className="stat-card orange">
                <h4>Applicants</h4>
                <p>{applicants.length}</p>
              </div>
              <div className="stat-card red">
                <h4>Notifications</h4>
                <p>{notifications.length}</p>
              </div>
            </div>
          </>
        )}

        {section === "Post a Job" && (
          <div className="card">
            <h2 className="section-title">Post a Job</h2>
            {!showJobForm ? (
              <button 
                className="btn btn-primary" 
                onClick={() => setShowJobForm(true)}
              >
                + New Job
              </button>
            ) : (
              <form onSubmit={handlePostJob} className="job-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Job Description"
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <select
                    value={jobLocation}
                    onChange={e => setJobLocation(e.target.value)}
                    required
                    className="form-control"
                  >
                    {TOWNS.map((town) => (
                      <option key={town} value={town}>{town}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <select
                    value={jobType}
                    onChange={e => setJobType(e.target.value)}
                    required
                    className="form-control"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Post Job</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowJobForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {section === "Notifications" && (
          <div className="card">
            <h2 className="section-title">Notifications</h2>
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              <div className="notification-list">
                {notifications.map((note) => (
                  <div key={note.id} className="notification-item">
                    <div className="notification-content">
                      {note.applicant_name ? (
                        <>
                          New applicant <b>{note.applicant_name}</b> for your job.
                        </>
                      ) : (
                        <>{note.message}</>
                      )}
                    </div>
                    {note.application_id && (
                      <div className="notification-actions">
                        <button 
                          className="btn btn-primary" 
                          onClick={async () => {
                            await fetch(`http://localhost:5000/applications/${note.application_id}/accept`, {
                              method: "PUT",
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            fetchNotifications();
                          }}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          onClick={async () => {
                            await fetch(`http://localhost:5000/applications/${note.application_id}/decline`, {
                              method: "PUT",
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            fetchNotifications();
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === "My Job Listings" && (
          <div>
            <h2 className="section-title">My Job Listings</h2>
            {jobs.length === 0 ? (
              <p>No jobs posted yet.</p>
            ) : (
              <div className="job-list">
                {jobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <div>
                        <h3 className="job-title">{job.title}</h3>
                        <p className="job-meta">Location: {job.location} | Type: {job.type}</p>
                      </div>
                      <div className="job-actions">
                        <button 
                          className="btn btn-edit" 
                          onClick={() => handleEditClick(job)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-delete" 
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          Delete
                        </button>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => fetchApplicants(job.id)}
                        >
                          View Applicants
                        </button>
                      </div>
                    </div>
                    {applicantsByJob[job.id] && (
                      <div className="applicants-section">
                        <h4 className="status-accepted">Applicants</h4>
                        {applicantsByJob[job.id].length === 0 ? (
                          <p>No applicants yet.</p>
                        ) : (
                          <div className="applicant-list">
                            {applicantsByJob[job.id].map(applicant => (
                              <div key={applicant.user_id} className="applicant-card">
                                {editingApplicant === applicant.user_id ? (
                                  <div className="editing-applicant">
                                    <input
                                      type="text"
                                      name="full_name"
                                      value={editingApplicantData.full_name}
                                      onChange={handleApplicantChange}
                                      placeholder="Full Name"
                                      className="form-control"
                                    />
                                    <input
                                      type="text"
                                      name="bio"
                                      value={editingApplicantData.bio}
                                      onChange={handleApplicantChange}
                                      placeholder="Bio"
                                      className="form-control"
                                    />
                                    <input
                                      type="text"
                                      name="skills"
                                      value={editingApplicantData.skills}
                                      onChange={handleApplicantChange}
                                      placeholder="Skills"
                                      className="form-control"
                                    />
                                    <input
                                      type="url"
                                      name="resume_url"
                                      value={editingApplicantData.resume_url}
                                      onChange={handleApplicantChange}
                                      placeholder="Resume URL"
                                      className="form-control"
                                    />
                                    <select
                                      name="role"
                                      value={editingApplicantData.role}
                                      onChange={handleApplicantChange}
                                      className="form-control"
                                    >
                                      <option value="seeker">Seeker</option>
                                      <option value="employer">Employer</option>
                                      <option value="admin">Admin</option>
                                    </select>
                                    <div className="form-actions">
                                      <button 
                                        className="btn btn-primary" 
                                        onClick={() => handleSaveApplicant(applicant.user_id)}
                                      >
                                        Save
                                      </button>
                                      <button 
                                        className="btn btn-secondary" 
                                        onClick={handleCancelApplicant}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="applicant-details">
                                    <div>
                                      <strong>{applicant.full_name}</strong> ({applicant.email})<br />
                                      Role: {applicant.role}<br />
                                      Bio: {applicant.bio}<br />
                                      Skills: {applicant.skills}<br />
                                      <a href={applicant.resume_url} target="_blank" rel="noopener noreferrer">
                                        Resume
                                      </a><br />
                                      Status: <span className={applicant.status === "Accepted" ? "status-accepted" : applicant.status === "Declined" ? "status-declined" : "status-pending"}>
                                        {applicant.status}
                                      </span>
                                    </div>
                                    <div className="applicant-actions">
                                      <button 
                                        className="btn btn-action" 
                                        onClick={() => handleEditApplicant(applicant)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        className="btn btn-action"
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
                                        className="btn btn-action"
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
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === "Edit Profile" && (
          <div className="card">
            <h2 className="section-title">Edit Profile</h2>
            {profileLoading ? (
              <p>Loading...</p>
            ) : (
              <form onSubmit={updateProfile} className="profile-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={profile.full_name}
                    onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Bio"
                    value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Skills (e.g. React, Python)"
                    value={profile.skills}
                    onChange={e => setProfile({ ...profile, skills: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="url"
                    placeholder="Resume URL"
                    value={profile.resume_url}
                    onChange={e => setProfile({ ...profile, resume_url: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Update Profile</button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}