import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LessonView() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    originalText = "",
    simplifiedText = "",
    keyPoints = [],
    subject = "General",
    preferences = {},
  } = location.state || {};

  const handlePractice = () => {
    navigate("/practice", {
      state: {
        adaptedText: simplifiedText,
      },
    });
  };

  return (
    <main className="lesson-page">

      <header className="lesson-header">
        <button
          className="lesson-back-btn"
          onClick={() => navigate("/upload")}
          aria-label="Go back"
        >
          ←
        </button>

        <div className="lesson-brand">
          <div className="lesson-logo">⌣</div>
          <span>Lesson View</span>
        </div>

        <div className="lesson-header-actions">
          <button aria-label="Read aloud">🔊</button>
          <button aria-label="Bookmark lesson">🔖</button>
        </div>
      </header>

      <section className="lesson-meta-row">
        <span className="lesson-subject-pill">
          🌱 {subject}
        </span>
      </section>

      <section className="lesson-title-section">
        <h1>✨ Your adapted lesson</h1>

        <div className="lesson-calibration-pill">
          ☷ Calibrated to your saved learning preferences
        </div>
      </section>

      <section className="lesson-key-card">
        <div className="lesson-card-label">
          ✨ Adapted Explanation
        </div>

        <p
          style={{
            whiteSpace: "pre-line",
            fontSize: preferences.larger_text ? "18px" : undefined,
            lineHeight: preferences.more_spacing ? "1.9" : undefined,
          }}
        >
          {simplifiedText ||
            "No adapted lesson was received. Please go back and try again."}
        </p>
      </section>

      {keyPoints.length > 0 && (
        <section className="lesson-breakdown-card">
          <div className="lesson-breakdown-title">
            <span className="breakdown-icon">☷</span>
            <h3>Key points</h3>
          </div>

          {keyPoints.map((point, index) => (
            <div
              className="breakdown-step"
              key={`${point}-${index}`}
            >
              <div className="breakdown-number">
                {index + 1}
              </div>

              <div>
                <p>{point}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {originalText && (
        <section className="lesson-analogy-card">
          <div className="lesson-analogy-heading">
            <span>📄 Original Material</span>

            <span className="mental-model-pill">
              Before adaptation
            </span>
          </div>

          <p
            style={{
              whiteSpace: "pre-line",
            }}
          >
            {originalText}
          </p>
        </section>
      )}

      <section className="lesson-check-card">
        <div>
          <span>Ready to check your understanding?</span>

          <strong>
            Ddiba can generate practice questions from this lesson.
          </strong>
        </div>

        <button onClick={handlePractice}>
          Practice →
        </button>
      </section>

    </main>
  );
}