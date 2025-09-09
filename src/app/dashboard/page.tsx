"use client";
import "@/styles/dashboard.css";

import { useEffect, useState } from "react";

type Quiz = { id: number; topic: string; createdAt: string };

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);
  const [topic, setTopic] = useState("");
  const [creating, setCreating] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  async function clearQuizzes() {
    try {
      const res = await fetch("/api/user/quizzes/clear", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        return alert(data.error || "Failed to clear quizzes");
      }
      setQuizzes([]);
      alert("All quizzes cleared successfully!");
    } catch (error) {
      console.error("Error clearing quizzes:", error);
      alert("Failed to clear quizzes");
    }
  }

  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d => {
      if (!d.user) location.href = "/auth";
      setMe(d.user);
      // load my quizzes
      fetch("/api/user/quizzes").then(r=>r.json()).then(d=>setQuizzes(d.quizzes||[]));
    });
  }, []);

  async function createQuiz() {
    setCreating(true);
    const res = await fetch("/api/quiz/generate", { method: "POST", body: JSON.stringify({ topic }) });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) return alert(data.error || "Failed");
    setTopic("");
    setQuizzes([data.quiz, ...quizzes]);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/auth";
  }

  return (
    <div className="space-y-8">
      <div className="dashboard-header">
        <h1>Welcome{me?.name ? `, ${me.name}` : ""}</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="quiz-card">
        <label className="block text-sm mb-2">Enter topic</label>
        <div className="quiz-input">
          <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Basics of SQL Joins" />
          <button disabled={!topic || creating} onClick={createQuiz}>
            {creating ? "Generating..." : "Generate 4 Qs"}
          </button>
          <button onClick={clearQuizzes} className="clear-btn">
            Clear
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map(q => (
          <a key={q.id} href={`/quiz/${q.id}`} className="quiz-card">
            <div className="text-sm text-neutral-500">{new Date(q.createdAt).toLocaleString()}</div>
            <div className="mt-1 text-lg font-medium">{q.topic}</div>
          </a>
        ))}
        {quizzes.length === 0 && (
          <div className="text-neutral-500">No quizzes yet. Generate your first quiz above.</div>
        )}
      </div>
    </div>
  );
}
