import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Job Seeker");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redirect based on role
    if (role === "Admin") navigate("/admin/dashboard");
    else if (role === "Employer") navigate("/employer/dashboard");
    else navigate("/seeker/dashboard");
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option>Job Seeker</option>
          <option>Employer</option>
          <option>Admin</option>
        </select>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}