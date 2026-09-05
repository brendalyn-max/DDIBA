import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/ui/Icon";
import ResponsiveLayout from "../components/layout/ResponsiveLayout";
import LogoMark from "../components/Logo/LogoMark";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function UploadMaterial() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("type");

  const [text, setText] = useState(
    "Photosynthesis occurs inside chloroplasts where chlorophyll pigments trap radiant solar photons. This light energy excites electrons within thylakoid membrane protein complexes, initiating photolysis to break water molecules into oxygen gas, protons, and mobile electrons."
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

    try {
      setLoading(true);
      setError("");

      const profileResponse = await fetch(
        `${API_BASE_URL}/api/profile/`
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok) {
        throw new Error(
          profileData.detail ||
            "Could not load your learning preferences."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/adapt-lesson/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            preferences: {
              short_explanations:
                profileData.short_explanations,
              step_by_step:
                profileData.step_by_step,
              examples:
                profileData.examples,
              larger_text:
                profileData.larger_text,
              more_spacing:
                profileData.more_spacing,
              shorter_paragraphs:
                profileData.shorter_paragraphs,
              highlight_words:
                profileData.highlight_words,
              read_aloud:
                profileData.read_aloud,
              pace:
                profileData.pace,
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

      navigate("/lesson", {
        state: {
          originalText: text,
          simplifiedText: data.simplified_text,
          keyPoints: data.key_points,
          subject,
          preferences: profileData,
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
    <ResponsiveLayout className="upload-material-page">

      <header className="upload-main-header">

        <div className="upload-brand">

          <LogoMark size={39} />

          <div className="upload-brand-copy">
            <small>Ddiba</small>
            <strong>Dashboard</strong>
          </div>

        </div>

        <div className="upload-header-actions">

          <span className="upload-streak-pill">
            <Icon name="flame" /> 5
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
          <Icon name="arrowLeft" />
        </button>

        <h2>New Learning Topic</h2>

        <button
          className="upload-menu-btn"
          aria-label="More options"
        >
          <Icon name="list" />
        </button>

      </section>

      <span className="upload-reader-label">
        <Icon name="sparkle" /> DDIBA INTELLIGENT READER
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
          <Icon name="sparkle" /> Free tier: 3 topics remaining
        </span>

        <button
          type="button"
          onClick={() => navigate("/subscription")}
        >
          View Plans <Icon name="sparkle" />
        </button>

      </section>

      <section className="upload-tabs">

        <button
          type="button"
          className={activeTab === "type" ? "active" : ""}
          onClick={() => setActiveTab("type")}
        >
          <Icon name="type" /> Type / Paste
        </button>

        <button
          type="button"
          className={activeTab === "voice" ? "active" : ""}
          onClick={() => setActiveTab("voice")}
        >
          <Icon name="mic" /> Voice Dictate
        </button>

        <button
          type="button"
          className={activeTab === "file" ? "active" : ""}
          onClick={() => setActiveTab("file")}
        >
          <Icon name="cloudUpload" /> Upload File
        </button>

      </section>

      {activeTab === "type" && (
        <section className="upload-text-card">

          <div className="upload-text-card-top">

            <strong>
              <Icon name="type" /> Raw text or question prompt
            </strong>

            <button
              type="button"
              onClick={() => {
                setText("");
                setError("");
              }}
            >
              <Icon name="refresh" /> Clear
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
              <Icon name="check" /> {wordCount} words entered
            </span>

            <div className="upload-text-actions">

              <button type="button">
                <Icon name="mic" /> Dictate
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    const clipboardText =
                      await navigator.clipboard.readText();

                    if (clipboardText) {
                      setText(clipboardText);
                      setError("");
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
            <Icon name="mic" />
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
            <Icon name="cloudUpload" />
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
            <Icon name="dna" /> Biology
          </button>

          <button
            type="button"
            className={subject === "History" ? "active" : ""}
            onClick={() => setSubject("History")}
          >
            <Icon name="scroll" /> History
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
          (!text.trim() && activeTab === "type")
        }
      >
        {loading ? (
          <>
            <Icon name="sparkle" />
            Ddiba is adapting your lesson...
          </>
        ) : (
          <>
            <Icon name="sparkle" />
            Make it easier
            <Icon name="arrowRight" />
          </>
        )}
      </button>

      <nav className="upload-bottom-nav">

        <button
          onClick={() => navigate("/dashboard")}
        >
          <span><Icon name="book" /></span>
          <small>Learn</small>
        </button>

        <button
          onClick={() => navigate("/practice")}
        >
          <span><Icon name="play" /></span>
          <small>Practice</small>
        </button>

        <button
          className="active"
          onClick={() => navigate("/upload")}
        >
          <span><Icon name="file" /></span>
          <small>Notes</small>
        </button>

        <button
          onClick={() => navigate("/progress")}
        >
          <span><Icon name="chart" /></span>
          <small>Progress</small>
        </button>

      </nav>

    </ResponsiveLayout>
  );
}