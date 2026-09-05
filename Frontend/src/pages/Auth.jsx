import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isSignup = mode === "signup";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email").trim();
    const password = formData.get("password");
    const name = formData.get("name")?.trim() || "";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/${isSignup ? "register" : "login"}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isSignup ? { username: email, email, first_name: name, password } : { username: email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = data.detail || data.non_field_errors?.[0] || Object.values(data)[0]?.[0];
        throw new Error(message || "We could not complete that request.");
      }
      localStorage.setItem("ddiba_token", data.token);
      localStorage.setItem("ddiba_username", data.username);
      navigate(isSignup ? "/onboarding" : "/dashboard");
    } catch (submitError) {
      setError(submitError.message.includes("Failed to fetch") ? "The learning service is offline. Start the backend and try again." : submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ResponsiveLayout className="auth-page">

      <header className="auth-brand">
        <div className="auth-brand-logo">⌣</div>
        <strong>Ddiba</strong>
      </header>

      <section className="auth-title">
        <p className="auth-eyebrow">Your learning space</p>
        <h1>{isSignup ? "Learn your way." : "Welcome back."}</h1>
        <p>{isSignup ? "Create an account that adapts to you." : "Pick up where you left off."}</p>
      </section>

      <div className="auth-actions">

        <button type="button" className="social-login-btn" onClick={() => setError("Google sign-in is coming soon. Use email for now.")}>
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
          <p>Or continue with email</p>
          <span></span>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {isSignup && <label className="auth-field">Name<input type="text" name="name" placeholder="Your name" autoComplete="name" required /></label>}

          <label className="auth-field">
            Email address
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
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={isSignup ? "Create a password" : "Your password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength={isSignup ? 8 : undefined}
              required
            />
            <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Hide" : "Show"}</button>
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="auth-main-btn" disabled={isSubmitting}>
            {isSubmitting ? "Connecting..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        <button
          type="button"
          className="auth-login-btn"
          onClick={() => { setMode(isSignup ? "login" : "signup"); setError(""); }}
        >
          {isSignup ? "Already have an account? Log in" : "New to Ddiba? Create an account"}
        </button>

      </div>

    </ResponsiveLayout>
  );
}
