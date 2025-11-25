import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/CharacterMatch.css";

export default function MainKanaMemoryGame() {
  const location = useLocation();
  const navigate = useNavigate();

  // Expect: { questions: [{ kana, romaji }], title: string }
  const { questions, title } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // If somebody hits this route directly, send them away
  useEffect(() => {
    if (!questions || !questions.length) {
      navigate("/"); // or your home route
    }
  }, [questions, navigate]);

  if (!questions || !questions.length) return null;

  const currentQuestion = questions[currentIndex];

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = userAnswer.trim();
    if (!trimmed) return;

    const correct = currentQuestion.romaji.toLowerCase();
    if (trimmed.toLowerCase() === correct) {
      setFeedback("✅ Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`❌ Not quite. Answer: ${currentQuestion.romaji}`);
    }

    setTimeout(() => {
      setFeedback("");
      setUserAnswer("");

      if (currentIndex === questions.length - 1) {
        setIsFinished(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 800);
  }

  function restartGame() {
    setCurrentIndex(0);
    setUserAnswer("");
    setFeedback("");
    setScore(0);
    setIsFinished(false);
  }

  return (
    <section className="game-section">
      <div className="quiz-card">
        <h2>{title || "Kana Memory Game"}</h2>

        {!isFinished ? (
          <>
            <p className="quiz-progress">
              Question {currentIndex + 1} of {questions.length}
            </p>

            <p className="quiz-question">
              Type the romaji for:{" "}
              <span className="quiz-kana">{currentQuestion.kana}</span>
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="romaji..."
                autoFocus
              />
            </form>

            <p className="quiz-score">Score: {score}</p>
            {feedback && <p className="quiz-feedback">{feedback}</p>}
          </>
        ) : (
          <>
            <p>
              🎉 Finished! Final score: {score} / {questions.length}
            </p>
            <button className="btn-modern" type="button" onClick={restartGame}>
              Play again
            </button>
            <button
              className="btn-modern"
              type="button"
              onClick={() => navigate(-1)}
            >
              Back to selection
            </button>
          </>
        )}
      </div>
    </section>
  );
}
