import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import PageHeader from "../components/layout/PageHeader";

export default function Auth() {
  const navigate = useNavigate();

  const [tab, setTab] = React.useState("signup");
  const [name, setName] = React.useState("Sarah");
  const [email, setEmail] = React.useState("sarah@learning.edu");
  const [password, setPassword] = React.useState("");

  const handleAuth = (event) => {
    event.preventDefault();
    // TODO: replace with real API call when authentication endpoints exist.
    navigate(tab === "signup" ? "/onboarding" : "/dashboard");
  };

  const handleQuickDemo = () => {
    // TODO: replace with real API call when authentication endpoints exist.
    navigate("/dashboard");
  };

  return (
    <ResponsiveLayout className="auth-page prototype-auth-page">
      <PageHeader variant="auth" title="Ddiba" backTo="/" logoSize={32} />

      <div className="prototype-auth-main">
        <div className="prototype-auth-tabs">
          <button type="button" className={tab === "signup" ? "active" : ""} onClick={() => setTab("signup")}>
            Sign Up
          </button>
          <button type="button" className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>
            Log In
          </button>
        </div>

        <div className="prototype-auth-title">
          <h1>{tab === "signup" ? "Create your calm space" : "Welcome back, learner"}</h1>
          <p>{tab === "signup" ? "Tell us how you like to learn so we can adapt every lesson." : "Pick up right where you left off, at your own pace."}</p>
        </div>

        <form className="prototype-auth-form" onSubmit={handleAuth}>
          {tab === "signup" && (
            <label>
              Your Preferred Name
              <input type="text" required value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Sarah" />
            </label>
          )}

          <label>
            Email Address
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@example.com" />
          </label>

          <label>
            Password
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          </label>

          <div className="auth-divider">
  <span>or</span>
</div>

<button type="button" className="google-signin-btn">
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.91c1.7-1.57 2.69-3.87 2.69-6.64z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.27c-.81.54-1.84.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.34C2.44 15.98 5.48 18 9 18z"/>
    <path fill="#FBBC05" d="M3.96 10.7c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V4.96H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.04l3-2.34z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.34C4.67 5.16 6.66 3.58 9 3.58z"/>
  </svg>
  Continue with Google
</button>

          <button type="submit" className="auth-main-btn prototype-auth-submit">
            {tab === "signup" ? "Start Onboarding" : "Go to Dashboard"}
            <Icon name="arrowRight" />
          </button>
        </form>

        <div className="prototype-auth-demo">
          <button type="button" onClick={handleQuickDemo}>
            <Icon name="sparkle" /> Instant Demo: Sign In as Sarah (5-Day Streak)
          </button>
        </div>
      </div>

      <div className="prototype-auth-pledge">
        <Icon name="sparkle" />
        <p><strong>The Ddiba Pledge</strong>No public scores, no timed pressure, and no penalties for taking breaks.</p>
      </div>

    </ResponsiveLayout>
  );
}
