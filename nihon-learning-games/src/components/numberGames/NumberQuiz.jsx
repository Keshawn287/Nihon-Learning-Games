import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NumberQuiz() {
  const navigate = useNavigate();

  const numbers = [
    { jp: "ichi", en: "1" },
    { jp: "ni", en: "2" },
    { jp: "san", en: "3" },
    { jp: "yon", en: "4" },
    { jp: "go", en: "5" },
    { jp: "roku", en: "6" },
    { jp: "nana", en: "7" },
    { jp: "hachi", en: "8" },
    { jp: "kyuu", en: "9" },
    { jp: "juu", en: "10" },
  ];

  function questionType(num) {
    return [
      {
        type: "input",
        question: `What is ${num.en} in Japanese?`,
        correct: num.jp,
      },
      {
        type: "input",
        question: `What is the English meaning of ${num.jp}?`,
        correct: num.en,
      },
    ];
  }

  const mcQuestions = [
    {
      type: "mcq",
      question: "What is the proper way to refer time with Japanese numbers?",
      choices: ["yon", "hachi", "roku"],
      correct: "yon",
    },
  ];

  function buildQuiz() {
    const quiz = numbers.map((num) => {
      const variations = questionType(num);
      const randomIndex = Math.floor(Math.random() * variations.length);
      return variations[randomIndex]; // pick 1 of the 2
    });

    // Shuffle the quiz array
    for (let i = quiz.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quiz[i], quiz[j]] = [quiz[j], quiz[i]];
    }

    return [...quiz, ...mcQuestions];
  }

  const [questions, setQuestions] = useState(() => buildQuiz());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const currentQuestion = questions[currentIndex];
  const isMcq = currentQuestion.type === "mcq";

  function nextQuestion() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setFeedback("");
    } else {
      setIsFinished(true);
    }
  }

  // This handles the form submit (pressing Enter)
  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading

    const trimmed = userAnswer.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === currentQuestion.correct.toLowerCase()) {
      setFeedback("Correct!");
    } else {
      setFeedback(
        `Not quite. The correct answer is: ${currentQuestion.correct}.`
      );
    }
  }

  function handleMcqClick(choice) {
    if (feedback) return;

    if (choice.toLowerCase() === currentQuestion.correct.toLowerCase()) {
      setFeedback("Correct!");
    } else {
      setFeedback(
        `Not quite. The correct answer is: ${currentQuestion.correct}.`
      );
    }
  }

  function restartQuiz() {
    setQuestions(buildQuiz());
    setCurrentIndex(0);
    setIsFinished(false);
    setUserAnswer("");
    setFeedback("");
  }

  return (
    <section className="game-section">
      <h2>Numbers Quiz</h2>

      {!isFinished ? (
        <div className="quiz-card">
          <p className="quiz-progress">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p className="quiz-question">{currentQuestion.question}</p>

          {/* Press Enter to check answer */}
          {!isMcq ? (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type answer here"
              />
            </form>
          ) : (
            <ul className="mcq-options">
              {currentQuestion.choices.map((choice) => (
                <li key={choice}>
                  <button
                    type="button"
                    className="mcq-option-btn"
                    onClick={() => handleMcqClick(choice)}
                  >
                    {choice}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {feedback && (
            <>
              <p className="quiz-feedback">{feedback}</p>
              <button type="button" onClick={nextQuestion}>
                Next question
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="quiz-card">
          <p>You reached the end of the quiz!</p>
          <button type="button" onClick={restartQuiz}>
            Play again
          </button>
          <button type="button" onClick={() => navigate("/")}>
            Back Home
          </button>
        </div>
      )}
    </section>
  );
}
