import React from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";

export default function Auth() {
  const navigate = useNavigate();

  return (
    <ResponsiveLayout className="auth-page">

      <header className="auth-brand">
        <div className="auth-brand-logo">⌣</div>
        <strong>Ddiba</strong>
      </header>

      <section className="auth-title">
        <h1>Learn your way.</h1>
      </section>

      <div className="auth-actions">

        <button className="social-login-btn">
          <img
            className="social-icon"
            src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
            alt=""
            aria-hidden="true"
          />
          Continue with Google
        </button>

        <div className="auth-divider">
          <span></span>
          <p>Or sign up with email</p>
          <span></span>
        </div>

        <form
          className="auth-form"
          onSubmit={(event) => {
            event.preventDefault();
            navigate("/onboarding");
          }}
        >
          <label className="auth-field">
            Name
            <input
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </label>

          <label className="auth-field">
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
              required
            />
          </label>

          <button type="submit" className="auth-main-btn">
            Create account
          </button>
        </form>

        <button
          type="button"
          className="auth-login-btn"
          onClick={() => navigate("/dashboard")}
        >
          Already have an account? Log in
        </button>

      </div>

    </ResponsiveLayout>
  );
}
