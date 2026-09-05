import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";

export default function Auth() {
  const navigate = useNavigate();
  const [showEmailModal, setShowEmailModal] = useState(false);

  return (
    <main className="auth-page">

      <section className="adaptive-banner">
        <div className="adaptive-icon"><Icon name="backpack" /></div>

        <div className="adaptive-content">
          <div className="adaptive-topline">
            <span className="status-dot"></span>
            <span className="adaptive-pill"><Icon name="help" /> Adaptive Pace</span>
          </div>

          <p>
            “Take your time. There are no rushed timers or judgment here.”
          </p>
        </div>
      </section>

      <section className="auth-heading">
        <h1>Create your account</h1>

        <p>
          Start building a learning experience that
          works for you.
        </p>
      </section>

      <div className="auth-actions">

        <button
          className="auth-main-btn"
          onClick={() => setShowEmailModal(true)}
        >
          <Icon name="mail" />
          <span>Continue with Email</span>
        </button>

        <div className="auth-divider">
          <span></span>
          <p>Or Continue With</p>
          <span></span>
        </div>

        <button className="social-login-btn">
          <img
            className="social-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt=""
            aria-hidden="true"
          />
          Continue with Google
        </button>

        <button className="social-login-btn">
          <img
            className="social-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg"
            alt=""
            aria-hidden="true"
          />
          Continue with Microsoft
        </button>

        <button className="social-login-btn">
          <img
            className="social-icon"
            src="https://cdn.simpleicons.org/apple/182238"
            alt=""
            aria-hidden="true"
          />
          Continue with Apple
        </button>

      </div>

      <section className="privacy-card">

        <div className="privacy-icon">
          <Icon name="shield" />
        </div>

        <div>
          <h3>
            Encrypted & ADHD/Neurodiversity
            Friendly
          </h3>

          <p>
            Zero high-stress spam. No tracking
            across your private spaces. Change
            your sensory, audio, and visual pace
            settings anytime.
          </p>
        </div>

      </section>

      <section className="community-card">

        <div className="community-sun">
          <Icon name="sun" />
        </div>

        <div className="community-copy">
          <span>COMMUNITY RHYTHM</span>

          <strong>
            14,280 mindful learners
            <br />
            active now
          </strong>
        </div>

        <div className="community-avatars">
          <span>🙂</span>
          <span>🙂</span>
          <span>🙂</span>
          <span className="more-avatar">+9</span>
        </div>

      </section>

      {showEmailModal && (
        <div
          className="auth-modal-backdrop"
          onClick={() => setShowEmailModal(false)}
        >
          <form
            className="auth-modal"
            onClick={(event) => event.stopPropagation()}
            onSubmit={(event) => {
              event.preventDefault();
              navigate("/onboarding");
            }}
          >
            <div className="auth-modal-header">
              <h2>Create account</h2>

              <button
                type="button"
                onClick={() => setShowEmailModal(false)}
              >
                ×
              </button>
            </div>

            <label>
              Name
              <input
                type="text"
                placeholder="Your name"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                placeholder="Create a password"
                required
              />
            </label>

            <button
              type="submit"
              className="auth-main-btn"
            >
              Continue
            </button>
          </form>
        </div>
      )}

    </main>
  );
}
