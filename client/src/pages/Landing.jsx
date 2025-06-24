import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <section className="landing">
      <div className="landing-overlay">
        <div className="landing-content">
          <h1>Kazika Kenya</h1>
          <p>Pata kazi kwa urahisi, haraka na uhakika 🚀</p>
          <Link to="/select-role" className="cta-button">Get Started</Link>
        </div>
      </div>
    </section>
  );
}
