import React from "react";
import "./RoleCard.css";

export default function RoleCard({ role, description, onClick }) {
  return (
    <div
      className="role-card"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={e => { if (e.key === "Enter") onClick(); }}
    >
      <h3>{role}</h3>
      <p>{description}</p>
    </div>
  );
}