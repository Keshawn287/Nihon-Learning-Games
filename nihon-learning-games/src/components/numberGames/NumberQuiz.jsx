import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/NumberQuiz.css";

export default function NumberQuiz() {
  const navigate = useNavigate();

  const numbers = [
    { jp: ["ichi"], en: ["1"] },
    { jp: ["ni"], en: ["2"] },
    { jp: ["san"], en: ["3"] },
    { jp: ["yon", "shi"], en: ["4"] },
    { jp: ["go"], en: ["5"] },
    { jp: ["roku"], en: ["6"] },
    { jp: ["nana", "shichi"], en: ["7"] },
    { jp: ["hachi"], en: ["8"] },
    { jp: ["ku", "kyuu"], en: ["9"] },
    { jp: ["juu"], en: ["10"] },
  ];

  function questionType(num) {
    return [
      {
        type: "input",
        question: `What is ${num.en[0]} in Japanese?`,
        correct: num.jp,
      },
      {
        type: "input",
        question: `What is the English meaning of ${num.jp[0]}?`,
        correct: num.en,
      },
    ];
  }

  const mcQuestions = [
    {
      type: "mcq",
      question: "Which Japanese numbers change reading when telling time?",
      choices: ["1, 2, 4, 7", "1, 3, 5", "6, 9, 10", "4, 7, 9"],
      correct: "4, 7, 9",
    },
    {
      type: "mcq",
      question: "What is 11 in Japanese?",
      choices: ["juu ichi", "ichi juu ichi", "ichi juu", "juu sen"],
      correct: "juu ichi",
    },
    {
      type: "mcq",
      question: "What is 50 in Japanese?",
      choices: ["go han", "juu go", "go juu", "go nin"],
      correct: "go juu",
    },
    {
      type: "mcq",
      question: "What is 64 in Japanese?",
      choices: ["roku yon", "juu roku yon", "yon roku", "roku juu yon"],
      correct: "roku juu yon",
    },
    {
      type: "mcq",
      question: "What does “san juu go” mean?",
      choices: ["15", "53", "30", "35"],
      correct: "35",
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
  const [score, setScore] = useState(0);

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

  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading

    const trimmed = userAnswer.trim();
    if (!trimmed) return;

    // Make sure we always work with an array of correct answers
    const correctAnswers = Array.isArray(currentQuestion.correct)
      ? currentQuestion.correct
      : [currentQuestion.correct];

    const isCorrect = correctAnswers.some(
      (ans) => ans.toLowerCase() === trimmed.toLowerCase()
    );

    if (isCorrect) {
      setFeedback("Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(
        `Not quite. The correct answer is: ${correctAnswers.join(" / ")}.`
      );
    }
  }

  function handleMcqClick(choice) {
    if (feedback) return;

    const correctAnswers = Array.isArray(currentQuestion.correct)
      ? currentQuestion.correct
      : [currentQuestion.correct];

    const isCorrect = correctAnswers.some(
      (ans) => ans.toLowerCase() === choice.toLowerCase()
    );

    if (isCorrect) {
      setFeedback("Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(
        `Not quite. The correct answer is: ${correctAnswers.join(" / ")}.`
      );
    }
  }

  function finalScore() {
    return Math.round((score / questions.length) * 100);
  }

  function restartQuiz() {
    setQuestions(buildQuiz());
    setCurrentIndex(0);
    setIsFinished(false);
    setUserAnswer("");
    setFeedback("");
    setScore("");
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
              <button
                className="btn-modern"
                type="button"
                onClick={nextQuestion}
              >
                Next question
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="quiz-card">
          <p>You reached the end of the quiz!</p>
          <p>Your final score is {finalScore()}%</p>
          <button className="btn-modern" type="button" onClick={restartQuiz}>
            Play again
          </button>
          <button
            className="btn-modern"
            type="button"
            onClick={() => navigate("/")}
          >
            Back Home
          </button>
        </div>
      )}
    </section>
  );
}

// // This handles the form submit (pressing Enter)
// function handleSubmit(e) {
//   e.preventDefault(); // stop the page from reloading

//   const trimmed = userAnswer.trim();
//   if (!trimmed) return;

//   if (trimmed.toLowerCase() === currentQuestion.correct.toLowerCase()) {
//     setFeedback("Correct!");
//     setScore((prev) => prev + 1);
//   } else {
//     setFeedback(
//       `Not quite. The correct answer is: ${currentQuestion.correct}.`
//     );
//   }
// }

// function handleMcqClick(choice) {
//   if (feedback) return;

//   if (choice.toLowerCase() === currentQuestion.correct.toLowerCase()) {
//     setFeedback("Correct!");
//     setScore((prev) => prev + 1);
//   } else {
//     setFeedback(
//       `Not quite. The correct answer is: ${currentQuestion.correct}.`
//     );
//   }
// }
