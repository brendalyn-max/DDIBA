import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Auth() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("register");

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !password.trim()) {
      setError("Please enter your name and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const endpoint =
        mode === "register"
          ? `${API_BASE_URL}/api/auth/register/`
          : `${API_BASE_URL}/api/auth/login/`;

      const response = await fetch(endpoint, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          username: name.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        let message =
          data.detail ||
          data.non_field_errors?.[0] ||
          data.username?.[0] ||
          data.password?.[0] ||
          "Authentication failed.";

        throw new Error(message);
      }

      localStorage.setItem(
        "ddiba_token",
        data.token
      );

      localStorage.setItem(
        "ddiba_username",
        data.username
      );

      if (mode === "register") {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveLayout className="auth-page">

      <header className="auth-brand">
        <div className="auth-brand-logo">
          ⌣
        </div>

        <strong>Ddiba</strong>
      </header>

      <section className="auth-title">

        <h1>
          {mode === "register"
            ? "Learn your way."
            : "Welcome back."}
        </h1>

      </section>

      <div className="auth-actions">

        <button
          className="social-login-btn"
          type="button"
          disabled
        >
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

          <p>
            {mode === "register"
              ? "Or sign up with your name"
              : "Or log in with your name"}
          </p>

          <span></span>

        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <label className="auth-field">

            Name

            <input
              type="text"
              name="name"
              placeholder="Your name"
              autoComplete="username"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
            />

          </label>

          <label className="auth-field">

            Password

            <input
              type="password"
              name="password"
              placeholder={
                mode === "register"
                  ? "Create a password"
                  : "Enter your password"
              }
              autoComplete={
                mode === "register"
                  ? "new-password"
                  : "current-password"
              }
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              minLength={8}
              required
            />

          </label>

          {error && (
            <div
              style={{
                padding: "11px 12px",
                borderRadius: "12px",
                background: "#fff0f2",
                color: "#a2394a",
                fontSize: "12px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-main-btn"
            disabled={loading}
          >

            {loading
              ? (
                mode === "register"
                  ? "Creating account..."
                  : "Logging in..."
              )
              : (
                mode === "register"
                  ? "Create account"
                  : "Log in"
              )}

          </button>

        </form>

        <button
          type="button"
          className="auth-login-btn"
          disabled={loading}
          onClick={() => {
            setError("");

            setMode(
              mode === "register"
                ? "login"
                : "register"
            );
          }}
        >

          {mode === "register"
            ? "Already have an account? Log in"
            : "New to Ddiba? Create an account"}

        </button>

      </div>

    </ResponsiveLayout>
  );
}