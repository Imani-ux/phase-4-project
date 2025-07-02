import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <section className="landing">
      <div className="landing-overlay">
        <div className="landing-content">
          <h1 className="landing-title">Kazika Kenya</h1>
          <p className="landing-subtitle">
            Pata kazi kwa urahisi, haraka na uhakika 
          </p>
          <Link to="/select-role" className="cta-button" aria-label="Get Started with Kazika Kenya">
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
