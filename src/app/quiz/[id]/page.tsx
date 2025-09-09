"use client";
import { useEffect, useState } from "react";
import { use } from "react";
import "@/styles/quiz.css";


type Question = {
  id: number; text: string; optionA: string; optionB: string; optionC: string; optionD: string; correct: string;
};
type Quiz = { id: number; topic: string; questions: Question[] };

export default function QuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [result, setResult] = useState<{score:number; total:number} | null>(null);

  useEffect(() => {
    fetch(`/api/quiz/${id}`).then(r=>r.json()).then(d=>setQuiz(d.quiz));
  }, [id]);

  function choose(qid: number, choice: string) {
    setAnswers(prev => ({ ...prev, [qid]: choice }));
  }

  async function submit() {
    const res = await fetch("/api/attempt", {
      method: "POST",
      body: JSON.stringify({ quizId: Number(id), answers }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error||"Failed");
    setResult({ score: data.attempt.score, total: data.attempt.total });
  }

  if (!quiz) return <div>Loading...</div>;

  return (
    <div className="quiz-page">
      <h1>Topic: {quiz.topic}</h1>
      <div className="space-y-4">
        {quiz.questions.map((q, idx) => {
          const selected = answers[String(q.id)];
          const option = (key: "A"|"B"|"C"|"D", label: string) => {
            let className = "option-btn";
            if (result) {
              if (key === q.correct) {
                className += " correct";
              } else if (selected === key && key !== q.correct) {
                className += " incorrect";
              }
            } else if (selected === key) {
              className += " selected";
            }
            return (
              <button
                onClick={() => choose(q.id, key)}
                className={className}
                disabled={!!result}
              >
                {key}. {label}
              </button>
            );
          };
          return (
            <div key={q.id} className="question-card">
              <div className="font-medium mb-3">{idx+1}. {q.text}</div>
              <div className="grid gap-2">
                {option("A", q.optionA)}
                {option("B", q.optionB)}
                {option("C", q.optionC)}
                {option("D", q.optionD)}
              </div>
            </div>
          );
        })}
      </div>

      {!result ? (
        <button onClick={submit} className="submit-btn">Submit</button>
      ) : (
        <div className="question-card">
          <div className="text-lg font-semibold">Your Score: {result.score} / {result.total}</div>
          <a href="/dashboard" className="mt-3 inline-block underline">Back to Dashboard</a>
        </div>
      )}
    </div>
  );
}
