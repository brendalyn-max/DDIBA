import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function ProfileSummary() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/profile/`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              "Could not load your learning profile."
          );
        }

        setProfile(data);

      } catch (err) {
        console.error(err);

        setError(
          err.message ||
            "Something went wrong while loading your profile."
        );

      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const accommodations = useMemo(() => {
    if (!profile) {
      return [];
    }

    const items = [];

    if (profile.short_explanations) {
      items.push("Short explanations");
    }

    if (profile.step_by_step) {
      items.push("Step-by-step guidance");
    }

    if (profile.examples) {
      items.push("Real-world examples");
    }

    if (profile.larger_text) {
      items.push("Larger text");
    }

    if (profile.more_spacing) {
      items.push("Relaxed spacing");
    }

    if (profile.shorter_paragraphs) {
      items.push("Shorter paragraphs");
    }

    if (profile.highlight_words) {
      items.push("Highlighted key words");
    }

    if (profile.read_aloud) {
      items.push("Read aloud enabled");
    }

    if (profile.pace) {
      items.push(`${profile.pace} pace`);
    }

    return items;
  }, [profile]);

  return (
    <ResponsiveLayout className="profile-summary-page">

      <header className="onboarding-topbar">

        <button
          className="onboarding-back-btn"
          onClick={() =>
            navigate("/onboarding/reading-support")
          }
          aria-label="Go back"
        >
          <Icon name="arrowLeft" />
        </button>

        <div className="onboarding-brand">
          <LogoMark size={31} />
          <span>Onboarding Goals</span>
        </div>

        <div className="onboarding-avatar">
          S
        </div>

      </header>

      <section className="profile-progress">

        <div className="profile-progress-top">
          <span>✓ STEP 4 OF 4 • COMPLETE!</span>
          <span>100% Complete</span>
        </div>

        <div className="profile-progress-track">
          <div className="profile-progress-fill"></div>
        </div>

      </section>

      <section className="profile-summary-heading">

        <h1>Your learning style</h1>

        <p>
          Here is how Ddiba is calibrated for you.
          <br />
          Your saved preferences are ready to use.
        </p>

      </section>

      <section className="learner-profile-card">

        <div className="learner-avatar">
          S
        </div>

        <div className="learner-profile-copy">

          <h3>Your Ddiba Profile</h3>

          <p>
            {profile?.pace
              ? `${profile.pace} learning pace`
              : "Personalized learner"}
          </p>

          <span className="profile-ready-pill">
            ● Calibrated & Ready
          </span>

        </div>

      </section>

      {loading && (
        <section className="ddiba-promise-card">
          <div className="promise-icon">
            <Icon name="sparkle" />
          </div>

          <div className="promise-copy">
            <h3>Loading your profile...</h3>

            <p>
              Ddiba is preparing your saved learning preferences.
            </p>
          </div>
        </section>
      )}

      {error && (
        <section className="ddiba-promise-card">

          <div className="promise-icon">
            <Icon name="help" />
          </div>

          <div className="promise-copy">

            <h3>Profile could not load</h3>

            <p>{error}</p>

          </div>

        </section>
      )}

      {!loading && !error && profile && (
        <section className="accommodations-card">

          <div className="accommodations-heading">

            <h3>
              <Icon name="list" /> Active Accommodations
            </h3>

            <span>
              {accommodations.length} applied
            </span>

          </div>

          <p className="accommodations-description">
            Customized interaction layers to keep
            explanations clear, low-stress, and engaging.
          </p>

          <div className="accommodation-chips">

            {accommodations.length > 0 ? (
              accommodations.map((item) => (
                <span
                  key={item}
                  className="accommodation-chip"
                >
                  ✓ {item}
                </span>
              ))
            ) : (
              <span className="accommodation-chip">
                ✓ Default learning settings
              </span>
            )}

          </div>

        </section>
      )}

      <section className="ddiba-promise-card">

        <div className="promise-icon">
          <Icon name="help" />
        </div>

        <div className="promise-copy">

          <h3>Our Promise to You</h3>

          <p>
            Your companion learns with you.
            If something doesn't click, we'll adapt.
          </p>

        </div>

      </section>

      <button
        className="profile-start-btn"
        onClick={() => navigate("/dashboard")}
        disabled={loading}
      >
        Start Learning <Icon name="arrowRight" />
      </button>

    </ResponsiveLayout>
  );
}