import React, { useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const isSignup = mode === "signup";

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const endpoint = isSignup
        ? "register"
        : "login";

      const payload = isSignup
        ? {
            username: email.trim(),
            email: email.trim(),
            first_name: name.trim(),
            password,
          }
        : {
            username: email.trim(),
            password,
          };

      const response = await fetch(
        `http://127.0.0.1:8000/api/${endpoint}/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The server returned an unexpected response."
        );
      }

      if (!response.ok) {
        const message =
          data.detail ||
          data.non_field_errors?.[0] ||
          data.username?.[0] ||
          data.email?.[0] ||
          data.password?.[0] ||
          "We could not complete that request.";

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

      if (data.first_name) {
        localStorage.setItem(
          "ddiba_name",
          data.first_name
        );
      } else if (name.trim()) {
        localStorage.setItem(
          "ddiba_name",
          name.trim()
        );
      }

      const destination = isSignup
        ? "/onboarding"
        : location.state?.from ||
          "/dashboard";

      navigate(
        destination,
        {
          replace: true,
        }
      );
    } catch (submitError) {
      console.error(
        "Authentication error:",
        submitError
      );

      if (
        submitError.message?.includes(
          "Failed to fetch"
        )
      ) {
        setError(
          "The learning service is offline. Start the backend and try again."
        );
      } else {
        setError(
          submitError.message ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setPassword("");
  };

  return (
    <ResponsiveLayout
      className="auth-page prototype-auth-page"
    >
      <PageHeader
        variant="auth"
        title="Ddiba"
        backTo="/"
        logoSize={32}
      />

      <div className="prototype-auth-main">

        <div className="prototype-auth-tabs">

          <button
            type="button"
            className={
              isSignup
                ? "active"
                : ""
            }
            onClick={() =>
              switchMode("signup")
            }
          >
            Sign Up
          </button>

          <button
            type="button"
            className={
              !isSignup
                ? "active"
                : ""
            }
            onClick={() =>
              switchMode("login")
            }
          >
            Log In
          </button>

        </div>

        <div className="prototype-auth-title">

          <h1>
            {isSignup
              ? "Create your calm space"
              : "Welcome back, learner"}
          </h1>

          <p>
            {isSignup
              ? "Tell us how you like to learn so we can adapt every lesson."
              : "Pick up right where you left off, at your own pace."}
          </p>

        </div>

        <form
          className="prototype-auth-form"
          onSubmit={handleSubmit}
        >

          {isSignup && (
            <label>
              Your Preferred Name

              <input
                type="text"
                name="name"
                required
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="e.g. Sarah"
                autoComplete="name"
              />

            </label>
          )}

          <label>
            Email Address

            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              placeholder="student@example.com"
              autoComplete="email"
            />

          </label>

          <label>
            Password

            <div
              style={{
                position: "relative",
              }}
            >

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                required
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="••••••••"
                autoComplete={
                  isSignup
                    ? "new-password"
                    : "current-password"
                }
                minLength={
                  isSignup
                    ? 8
                    : undefined
                }
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (visible) =>
                      !visible
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </label>

          {error && (
            <p
              className="auth-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-main-btn prototype-auth-submit"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? "Connecting..."
              : isSignup
              ? "Start Onboarding"
              : "Go to Dashboard"}

            {!isSubmitting && (
              <Icon name="arrowRight" />
            )}

          </button>

        </form>

        <div className="auth-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <button
          type="button"
          className="google-signin-btn"
          onClick={() =>
            setError(
              "Google sign-in is coming soon. Use email for now."
            )
          }
        >

          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.91c1.7-1.57 2.69-3.87 2.69-6.64z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.27c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.34C2.44 15.98 5.48 18 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.96 10.7c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V4.96H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.04l3-2.34z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.34C4.67 5.16 6.66 3.58 9 3.58z"
            />
          </svg>

          Continue with Google

        </button>

      </div>

      <div className="prototype-auth-pledge">

        <Icon name="sparkle" />

        <p>
          <strong>
            The Ddiba Pledge
          </strong>

          No public scores, no timed
          pressure, and no penalties
          for taking breaks.
        </p>

      </div>

    </ResponsiveLayout>
  );
}