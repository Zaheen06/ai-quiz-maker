"use client";
import { useEffect, useState, use } from "react";
import "@/styles/quiz.css";


type Question = {
  id: number; text: string; optionA: string; optionB: string; optionC: string; optionD: string; correct: string;
};
type Quiz = { id: number; topic: string; questions: Question[] };

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    fetch(`/api/quiz/${id}`).then(r => r.json()).then(d => setQuiz(d.quiz));
  }, [id]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
  }, [currentQuestionIndex]);

  // Timer logic
  useEffect(() => {
    if (!quiz || result) return;

    if (timeLeft === 0) {
      // Time up
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        submit();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quiz, result, currentQuestionIndex]);


  function choose(qid: number, choice: string) {
    if (!result) {
      setAnswers(prev => ({ ...prev, [qid]: choice }));
    }
  }

  function handleNext() {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }

  function handlePrevious() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }

  async function submit() {
    const res = await fetch("/api/attempt", {
      method: "POST",
      body: JSON.stringify({ quizId: Number(id), answers }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Failed");
    setResult({ score: data.attempt.score, total: data.attempt.total });
  }

  if (!quiz) {
    return (
      <div className="page-container quiz-page">
        <div className="question-card loading-card">
          <div className="loading-spinner"></div>
          <div className="font-medium mb-3">Loading your quiz…</div>
          <p className="text-sm text-neutral-500">
            Fetching questions and options. This usually only takes a moment.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const selected = answers[String(currentQuestion.id)];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allAnswered = quiz.questions.every(q => answers[String(q.id)]);

  const renderOption = (question: Question, key: "A" | "B" | "C" | "D", label: string, questionId: number) => {
    const userAnswer = answers[String(questionId)];
    let className = "option-btn";

    if (result) {
      // Show correct answer with green
      if (key === question.correct) {
        className += " correct";
      }
      // Show user's wrong answer with red
      if (userAnswer === key && key !== question.correct) {
        className += " incorrect";
      }
      // Dim other options
      if (key !== question.correct && userAnswer !== key) {
        className += " dimmed";
      }
    } else if (userAnswer === key) {
      className += " selected";
    }

    return (
      <button
        onClick={() => choose(questionId, key)}
        className={className}
        disabled={!!result}
        key={key}
      >
        <span className="option-letter">{key}</span>
        <span className="option-text">{label}</span>
      </button>
    );
  };

  // Review mode - show all questions with answers
  if (result && showReview) {
    return (
      <div className="page-container quiz-page review-mode">
        <header className="quiz-page-header">
          <p className="quiz-page-eyebrow">Review</p>
          <h1>{quiz.topic}</h1>
          <div className="score-banner">
            <div className="score-content">
              <span className="score-label">Your Score:</span>
              <span className="score-value">{result.score} / {result.total}</span>
              <span className="score-percentage">({Math.round((result.score / result.total) * 100)}%)</span>
            </div>
          </div>
        </header>

        <div className="review-questions">
          {quiz.questions.map((question, index) => {
            const userAnswer = answers[String(question.id)];
            const isCorrect = userAnswer === question.correct;

            return (
              <div key={question.id} className={`question-card review-card ${isCorrect ? 'correct-answer' : 'incorrect-answer'}`}>
                <div className="review-header">
                  <span className="question-number-badge">Question {index + 1}</span>
                  <span className={`answer-badge ${isCorrect ? 'badge-correct' : 'badge-incorrect'}`}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>
                <div className="font-medium mb-4 text-lg question-text">
                  {question.text}
                </div>
                <div className="quiz-options-container">
                  <div className="grid gap-3">
                    {renderOption(question, "A", question.optionA, question.id)}
                    {renderOption(question, "B", question.optionB, question.id)}
                    {renderOption(question, "C", question.optionC, question.id)}
                    {renderOption(question, "D", question.optionD, question.id)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="review-actions">
          <a href="/dashboard" className="btn btn-primary">
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Result screen
  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    const passed = percentage >= 70;

    return (
      <div className="page-container quiz-page">
        <div className={`question-card result-card ${passed ? 'result-pass' : 'result-fail'}`}>
          <div className="result-icon">
            {passed ? '🎉' : '📚'}
          </div>
          <div className="text-2xl font-bold mb-4 text-center result-title">
            {passed ? 'Congratulations!' : 'Quiz Complete!'}
          </div>
          <div className="result-score-display">
            <div className="score-circle">
              <div className="score-number">{result.score}</div>
              <div className="score-divider">/</div>
              <div className="score-total">{result.total}</div>
            </div>
            <div className="score-percentage-large">{percentage}%</div>
          </div>
          <p className="result-subtitle text-center">
            {passed
              ? 'Excellent work! You have a great understanding of this topic.'
              : 'Good effort! Review the answers below to improve your understanding.'}
          </p>
          <div className="result-actions">
            <button
              onClick={() => setShowReview(true)}
              className="btn btn-outline"
            >
              📋 Review Answers
            </button>
            <a href="/dashboard" className="btn btn-primary">
              🏠 Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking mode
  return (
    <div className="page-container quiz-page">
      <header className="quiz-page-header">
        <p className="quiz-page-eyebrow">Quiz</p>
        <h1>{quiz.topic}</h1>
        <div className="header-info-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0' }}>
          <p className="quiz-page-subtitle" style={{ margin: 0 }}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
          <div className={`timer-badge ${timeLeft <= 10 ? 'timer-warning' : ''}`} style={{
            padding: '0.25rem 0.75rem',
            background: timeLeft <= 10 ? '#fee2e2' : '#f1f5f9',
            color: timeLeft <= 10 ? '#ef4444' : '#64748b',
            borderRadius: '9999px',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            ⏱️ {timeLeft}s
          </div>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
        </div>
      </header>

      <div className="question-card">
        <div className="font-medium mb-4 text-lg">
          <span className="question-number">{currentQuestionIndex + 1}.</span> {currentQuestion.text}
        </div>
        <div className="quiz-options-container">
          <div className="grid gap-3">
            {renderOption(currentQuestion, "A", currentQuestion.optionA, currentQuestion.id)}
            {renderOption(currentQuestion, "B", currentQuestion.optionB, currentQuestion.id)}
            {renderOption(currentQuestion, "C", currentQuestion.optionC, currentQuestion.id)}
            {renderOption(currentQuestion, "D", currentQuestion.optionD, currentQuestion.id)}
          </div>
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn btn-outline"
        >
          ← Previous
        </button>
        <div className="flex gap-3">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!selected}
              className="btn btn-primary"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!allAnswered}
              className="btn btn-primary"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
