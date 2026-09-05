import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function UploadMaterial() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("type");

  const [text, setText] = useState(
    "Photosynthesis occurs inside chloroplasts where chlorophyll pigments absorb light energy."
  );

  const [subject, setSubject] = useState("Biology");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const wordCount = useMemo(() => {
    if (!text.trim()) return 0;

    return text.trim().split(/\s+/).length;
  }, [text]);

  const handleAdaptLesson = async () => {
    if (!text.trim()) {
      setError("Please enter some learning material first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
       * First fetch the learner's saved preferences.
       */
      const profileResponse = await fetch(
        `${API_BASE_URL}/api/profile/`
      );

      if (!profileResponse.ok) {
        throw new Error(
          "Could not load your learning preferences."
        );
      }

      const profile = await profileResponse.json();

      /*
       * Send lesson text + preferences to Django.
       */
      const response = await fetch(
        `${API_BASE_URL}/api/adapt-lesson/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            text: text,

            preferences: {
              short_explanations:
                profile.short_explanations,

              step_by_step:
                profile.step_by_step,

              examples:
                profile.examples,

              larger_text:
                profile.larger_text,

              more_spacing:
                profile.more_spacing,

              shorter_paragraphs:
                profile.shorter_paragraphs,

              highlight_words:
                profile.highlight_words,

              read_aloud:
                profile.read_aloud,

              pace:
                profile.pace,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Ddiba could not adapt this lesson."
        );
      }

      /*
       * Send the real AI result to LessonView.
       */
      navigate("/lesson", {
        state: {
          originalText: text,

          simplifiedText:
            data.simplified_text,

          keyPoints:
            data.key_points,

          subject: subject,

          preferences: profile,
        },
      });

    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Something went wrong while adapting your lesson."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload-material-page">

      <header className="upload-main-header">

        <div className="upload-brand">

          <div className="upload-logo">
            ⌣
          </div>

          <div className="upload-brand-copy">
            <small>Ddiba</small>
            <strong>Dashboard</strong>
          </div>

        </div>

        <div className="upload-header-actions">

          <span className="upload-streak-pill">
            🔥 5
          </span>

          <div className="upload-avatar">
            S
          </div>

        </div>

      </header>

      <section className="upload-subheader">

        <button
          className="upload-back-btn"
          onClick={() =>
            navigate("/dashboard")
          }
          aria-label="Back"
        >
          ←
        </button>

        <h2>New Learning Topic</h2>

        <button
          className="upload-menu-btn"
          aria-label="More options"
        >
          ☷
        </button>

      </section>

      <span className="upload-reader-label">
        ✨ DDIBA INTELLIGENT READER
      </span>

      <section className="upload-heading">

        <h1>
          What are you learning
          <br />
          today?
        </h1>

        <p>
          Drop in study notes, lecture slides,
          textbook excerpts, or questions.
        </p>

      </section>

      <section className="free-tier-card">

        <span>
          ✨ Free tier: 3 topics remaining
        </span>

        <button
          type="button"
          onClick={() =>
            navigate("/subscription")
          }
        >
          View Plans ✨
        </button>

      </section>

      <section className="upload-tabs">

        <button
          type="button"
          className={
            activeTab === "type"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("type")
          }
        >
          ≋ Type / Paste
        </button>

        <button
          type="button"
          className={
            activeTab === "voice"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("voice")
          }
        >
          🎙 Voice Dictate
        </button>

        <button
          type="button"
          className={
            activeTab === "file"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("file")
          }
        >
          ☁ Upload File
        </button>

      </section>

      {activeTab === "type" && (

        <section className="upload-text-card">

          <div className="upload-text-card-top">

            <strong>
              ≋ Raw text or question prompt
            </strong>

            <button
              type="button"
              onClick={() => setText("")}
            >
              ↻ Clear
            </button>

          </div>

          <textarea
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            placeholder="Paste or type what you're learning..."
          />

          <div className="upload-text-card-bottom">

            <span className="word-count-pill">
              ◉ {wordCount} words entered
            </span>

            <div className="upload-text-actions">

              <button type="button">
                🎙 Dictate
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const clipboardText =
                      await navigator.clipboard.readText();

                    if (clipboardText) {
                      setText(clipboardText);
                    }

                  } catch {
                    setError(
                      "Clipboard permission was not available."
                    );
                  }
                }}
              >
                ▣ Paste latest
              </button>

            </div>

          </div>

        </section>

      )}

      {activeTab === "voice" && (

        <section className="upload-alternative-card">

          <div className="alternative-icon">
            🎙
          </div>

          <h3>Voice Dictation</h3>

          <p>
            Speak naturally and Ddiba will turn
            your thoughts into study material.
          </p>

          <button type="button">
            Start Dictating
          </button>

        </section>

      )}

      {activeTab === "file" && (

        <section className="upload-alternative-card">

          <div className="alternative-icon">
            ☁
          </div>

          <h3>
            Upload Learning Material
          </h3>

          <p>
            Add notes, slides, or documents
            and Ddiba will prepare them for
            adaptive learning.
          </p>

          <label className="upload-file-label">

            Choose File

            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
            />

          </label>

        </section>

      )}

      <section className="subject-framing">

        <p>
          Add quick subject framing:
        </p>

        <div className="subject-options">

          <button
            type="button"
            className={
              subject === "Biology"
                ? "active"
                : ""
            }
            onClick={() =>
              setSubject("Biology")
            }
          >
            🧬 Biology
          </button>

          <button
            type="button"
            className={
              subject === "History"
                ? "active"
                : ""
            }
            onClick={() =>
              setSubject("History")
            }
          >
            📜 History
          </button>

          <button
            type="button"
            className={
              subject === "Math"
                ? "active"
                : ""
            }
            onClick={() =>
              setSubject("Math")
            }
          >
            Σ Math
          </button>

        </div>

      </section>

      {error && (
        <div
          style={{
            marginTop: "14px",
            padding: "12px",
            borderRadius: "14px",
            background: "#fff0f2",
            color: "#a2394a",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      <button
        className="make-easier-btn"
        onClick={handleAdaptLesson}
        disabled={
          loading ||
          (!text.trim() &&
            activeTab === "type")
        }
      >

        {loading
          ? "✨ Ddiba is adapting your lesson..."
          : (
            <>
              ✨ Make it easier
              <span>→</span>
            </>
          )
        }

      </button>

      <nav className="upload-bottom-nav">

        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <span>◈</span>
          <small>Learn</small>
        </button>

        <button
          onClick={() =>
            navigate("/practice")
          }
        >
          <span>◉</span>
          <small>Practice</small>
        </button>

        <button
          className="active"
          onClick={() =>
            navigate("/upload")
          }
        >
          <span>✚</span>
          <small>Notes</small>
        </button>

        <button
          onClick={() =>
            navigate("/progress")
          }
        >
          <span>⌁</span>
          <small>Progress</small>
        </button>

      </nav>

    </main>
  );
}