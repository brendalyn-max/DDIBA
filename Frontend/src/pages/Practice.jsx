import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000";

export default function Practice() {
  const navigate = useNavigate();
  const location = useLocation();

  const adaptedText = location.state?.adaptedText || "";

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [correct, setCorrect] = useState(null);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuestions = async () => {
      if (!adaptedText) {
        setError(
          "No adapted lesson was received. Please create a lesson first."
        );
        setLoadingQuestions(false);
        return;
      }

      try {
        setLoadingQuestions(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/practice-questions/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              adapted_text: adaptedText,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail || "Could not generate practice questions."
          );
        }

        setQuestions(data.questions || []);
      } catch (err) {
        console.error(err);
        setError(
          err.message ||
            "Something went wrong while generating practice questions."
        );
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [adaptedText]);

  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !selectedAnswer.trim()) {
      return;
    }

    try {
      setSubmittingAnswer(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/evaluate-answer/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: currentQuestion.question,
            student_answer: selectedAnswer,
            reference_answer: currentQuestion.reference_answer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Could not evaluate your answer."
        );
      }

      setCorrect(data.correct);
      setFeedback(data.feedback);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Something went wrong while evaluating your answer."
      );
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((current) => current + 1);
      setSelectedAnswer("");
      setFeedback("");
      setCorrect(null);
    } else {
      navigate("/progress", {
        state: {
          questionsAnswered: questions.length,
        },
      });
    }
  };

  return (
    <main className="practice-page">

      <header className="practice-header">
        <div className="practice-brand">
          <div className="practice-logo">⌣</div>

          <div>
            <small>Ddiba</small>
            <strong>Practice</strong>
          </div>
        </div>

        <div className="practice-header-actions">
          <span className="practice-streak-pill">
            🔥 5
          </span>

          <div className="practice-avatar">
            S
          </div>
        </div>
      </header>

      <section className="practice-title-area">
        <button
          className="practice-back-btn"
          onClick={() =>
            navigate("/lesson", {
              state: {
                adaptedText,
              },
            })
          }
        >
          ←
        </button>

        <div>
          <h1>Practice Session</h1>

          <p>
            {questions.length > 0
              ? `Question ${currentIndex + 1} of ${questions.length}`
              : "Preparing your questions..."}
          </p>
        </div>

        <div className="practice-topic-icon">
          🧠
        </div>
      </section>

      {questions.length > 0 && (
        <div className="practice-progress-track">
          <div
            className="practice-progress-fill"
            style={{
              width: `${
                ((currentIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      )}

      {loadingQuestions && (
        <section className="practice-feedback-card success">
          <p>
            ✨ Ddiba is creating practice questions from your lesson...
          </p>
        </section>
      )}

      {error && (
        <section className="practice-feedback-card try-again">
          <p>{error}</p>
        </section>
      )}

      {!loadingQuestions && currentQuestion && (
        <>
          <section className="practice-question-meta">
            <span className="practice-concept-pill">
              ❓ Concept Check
            </span>

            <span>
              {currentQuestion.type === "multiple_choice"
                ? "Multiple Choice"
                : "Free Text"}
            </span>
          </section>

          <section className="practice-question">
            <h2>{currentQuestion.question}</h2>
          </section>

          {currentQuestion.type === "multiple_choice" ? (
            <section className="practice-answers">
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === option;

                return (
                  <button
                    type="button"
                    key={`${option}-${index}`}
                    className={`practice-answer ${
                      isSelected ? "correct" : ""
                    }`}
                    onClick={() => {
                      if (!feedback) {
                        setSelectedAnswer(option);
                      }
                    }}
                  >
                    <div className="practice-answer-letter">
                      {String.fromCharCode(65 + index)}
                    </div>

                    <div className="practice-answer-copy">
                      <strong>{option}</strong>
                    </div>

                    <div
                      className={`practice-answer-radio ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </div>
                  </button>
                );
              })}
            </section>
          ) : (
            <section className="practice-free-text-card">
              <textarea
                value={selectedAnswer}
                onChange={(event) =>
                  setSelectedAnswer(event.target.value)
                }
                placeholder="Type your answer in your own words..."
                disabled={Boolean(feedback)}
              />
            </section>
          )}

          {!feedback && (
            <button
              className="practice-finish-btn"
              onClick={handleSubmitAnswer}
              disabled={
                !selectedAnswer.trim() || submittingAnswer
              }
            >
              {submittingAnswer
                ? "Ddiba is checking your answer..."
                : "Check Answer →"}
            </button>
          )}

          {feedback && (
            <>
              <section
                className={`practice-feedback-card ${
                  correct ? "success" : "try-again"
                }`}
              >
                <div className="practice-feedback-top">
                  <span>
                    {correct
                      ? "🎉 Nice work!"
                      : "💡 Keep going!"}
                  </span>
                </div>

                <p>{feedback}</p>
              </section>

              <button
                className="practice-finish-btn"
                onClick={handleNextQuestion}
              >
                {currentIndex < questions.length - 1
                  ? "Next Question →"
                  : "Finish Session →"}
              </button>
            </>
          )}
        </>
      )}

      <nav className="practice-bottom-nav">
        <button
          onClick={() => navigate("/dashboard")}
        >
          <span>◈</span>
          <small>Learn</small>
        </button>

        <button
          className="active"
          onClick={() => navigate("/practice")}
        >
          <span>◉</span>
          <small>Practice</small>
        </button>

        <button
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