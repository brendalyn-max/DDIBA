import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadMaterial() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("type");
  const [text, setText] = useState(
    "Photosynthesis occurs inside chloroplasts where chlorophyll pigments trap radiant solar photons. This light energy excites electrons within thylakoid membrane protein complexes, initiating photolysis to break water molecules into oxygen gas, protons, and mobile electrons."
  );

  const [subject, setSubject] = useState("Biology");

  const wordCount = useMemo(() => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }, [text]);

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
          onClick={() => navigate("/dashboard")}
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
          Drop in study notes, lecture slides, textbook
          excerpts, or questions.
        </p>

      </section>

      <section className="free-tier-card">

        <span>
          ✨ Free tier: 3 topics remaining
        </span>

        <button
          type="button"
          onClick={() => navigate("/subscription")}
        >
          View Plans ✨
        </button>

      </section>

      <section className="upload-tabs">

        <button
          type="button"
          className={activeTab === "type" ? "active" : ""}
          onClick={() => setActiveTab("type")}
        >
          ≋ Type / Paste
        </button>

        <button
          type="button"
          className={activeTab === "voice" ? "active" : ""}
          onClick={() => setActiveTab("voice")}
        >
          🎙 Voice Dictate
        </button>

        <button
          type="button"
          className={activeTab === "file" ? "active" : ""}
          onClick={() => setActiveTab("file")}
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
                    // Clipboard permission may be unavailable.
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
            Speak naturally and Ddiba will turn your
            thoughts into study material.
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

          <h3>Upload Learning Material</h3>

          <p>
            Add notes, slides, or documents and Ddiba
            will prepare them for adaptive learning.
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
            className={subject === "Biology" ? "active" : ""}
            onClick={() => setSubject("Biology")}
          >
            🧬 Biology
          </button>

          <button
            type="button"
            className={subject === "History" ? "active" : ""}
            onClick={() => setSubject("History")}
          >
            📜 History
          </button>

          <button
            type="button"
            className={subject === "Math" ? "active" : ""}
            onClick={() => setSubject("Math")}
          >
            Σ Math
          </button>

        </div>

      </section>

      <button
        className="make-easier-btn"
        onClick={() => navigate("/lesson")}
        disabled={!text.trim() && activeTab === "type"}
      >
        ✨ Make it easier <span>→</span>
      </button>

      <nav className="upload-bottom-nav">

        <button
          onClick={() => navigate("/dashboard")}
        >
          <span>◈</span>
          <small>Learn</small>
        </button>

        <button
          onClick={() => navigate("/practice")}
        >
          <span>◉</span>
          <small>Practice</small>
        </button>

        <button
          className="active"
          onClick={() => navigate("/upload")}
        >
          <span>✚</span>
          <small>Notes</small>
        </button>

        <button
          onClick={() => navigate("/progress")}
        >
          <span>⌁</span>
          <small>Progress</small>
        </button>

      </nav>

    </main>
  );
}