import React from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">

      {/* Top */}
      <header className="welcome-header">
        <span className="gentle-pill">
          🌿 Gentle Pace
        </span>
      </header>

      {/* Hero */}
      <section className="welcome-hero-section">

        <span className="floating-chip chip-stories">
          📖 Stories & Text
        </span>

        <span className="floating-chip chip-ai">
          ❓ ✨ AI Tailored
        </span>

        <span className="sparkle-bubble">
          ✦
        </span>

        <div className="welcome-hero-circle">
          <div className="ddiba-center-logo">
            <div className="ddiba-logo-icon">
              <span className="book-shape">⌣</span>
            </div>

            <span className="ddiba-center-name">
              Ddiba
            </span>
          </div>
        </div>

        <span className="floating-chip chip-mindmaps">
          ✣ Mindmaps
        </span>

        <span className="floating-chip chip-visuals">
          💡 Quick Visuals
        </span>

      </section>

      {/* Main text */}
      <section className="welcome-text">

        <span className="stress-pill">
          ✨ Stress-Free Study
        </span>

        <h1>Learn your way.</h1>

        <p>
          An AI learning companion that adapts
          to how you learn—without judgment or
          rush.
        </p>

      </section>

      {/* Buttons */}
      <div className="welcome-actions">

        <button
          className="welcome-btn primary"
          onClick={() => navigate("/auth")}
        >
          Get Started
          <span>→</span>
        </button>

        <button
          className="welcome-btn secondary"
          onClick={() => navigate("/auth")}
        >
          Log In
        </button>

      </div>

      {/* Bottom reassurance */}
      <div className="welcome-reassurance">
        <span className="reassurance-icon">✹</span>

        <p>
          Learning should adapt to the learner.
        </p>
      </div>

    </main>
  );
}