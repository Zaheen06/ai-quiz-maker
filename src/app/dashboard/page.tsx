"use client";
import "@/styles/dashboard.css";

import { useEffect, useState } from "react";

type Quiz = { id: number; topic: string; createdAt: string; difficulty?: string; questions?: any[] };

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);
  const [topic, setTopic] = useState("");
  const [creating, setCreating] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [difficulty, setDifficulty] = useState("Medium");
  const [amount, setAmount] = useState(5);

  async function clearQuizzes() {
    if (!confirm("Are you sure you want to delete all quizzes? This action cannot be undone.")) {
      return;
    }

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

  async function deleteQuiz(id: number) {
    if (!confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      const res = await fetch(`/api/quiz/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        return alert(data.error || "Failed to delete quiz");
      }
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (error) {
      console.error("Error deleting quiz:", error);
      alert("Failed to delete quiz");
    }
  }

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.user) location.href = "/auth";
      setMe(d.user);
      // load my quizzes
      fetch("/api/user/quizzes").then(r => r.json()).then(d => setQuizzes(d.quizzes || []));
    });
  }, []);

  async function createQuiz() {
    setCreating(true);
    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      body: JSON.stringify({ topic, difficulty, amount })
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) return alert(data.error || "Failed");
    setTopic("");
    setQuizzes([data.quiz, ...quizzes]);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && topic && !creating) {
      createQuiz();
    }
  };

  // Calculate statistics
  const totalQuizzes = quizzes.length;
  const recentQuizzes = quizzes.filter(q => {
    const quizDate = new Date(q.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return quizDate >= weekAgo;
  }).length;

  // Get display name - prefer name (if not an email), then username from email
  const displayName = (() => {
    // Helper to extract username from email
    const extractUsername = (email: string) => {
      const username = email.split('@')[0];
      return username.charAt(0).toUpperCase() + username.slice(1);
    };

    // Check if name exists and is not an email
    if (me?.name) {
      // If name looks like an email, extract username from it
      if (me.name.includes('@')) {
        return extractUsername(me.name);
      }
      return me.name;
    }

    // Fall back to email username
    if (me?.email) {
      return extractUsername(me.email);
    }

    return 'User';
  })();

  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-avatar-large">
            {me?.name ? me.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : me?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="welcome-text">
            <p className="dashboard-eyebrow">Dashboard</p>
            <h1 className="welcome-title">Welcome back, {displayName}! 👋</h1>
            <p className="welcome-subtitle">Ready to create some amazing quizzes?</p>
            {me?.email && <p className="welcome-email">{me.email}</p>}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <p className="stat-label">Total Quizzes</p>
            <p className="stat-value">{totalQuizzes}</p>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <p className="stat-label">This Week</p>
            <p className="stat-value">{recentQuizzes}</p>
          </div>
        </div>

        <div className="stat-card stat-card-accent">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <p className="stat-label">AI Powered</p>
            <p className="stat-value">100%</p>
          </div>
        </div>
      </div>

      {/* Create Quiz Section */}
      <div className="create-quiz-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Create New Quiz</h2>
            <p className="section-description">Generate AI-powered quizzes on any topic in seconds</p>
          </div>
        </div>

        <div className="quiz-creator-card">
          <div className="quiz-creator-content">
            <label className="quiz-label">
              <span className="quiz-label-icon">💡</span>
              What would you like to learn about?
            </label>
            <p className="quiz-helper-text">
              Be specific for better results – for example: <span>"Introduction to React Hooks"</span> or <span>"Python Data Structures"</span>
            </p>

            <div className="quiz-input-wrapper">
              <input
                value={topic}
                onChange={e => setTopic(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., JavaScript ES6 Features, Machine Learning Basics..."
                disabled={creating}
                className="quiz-input-field"
              />

              <div className="quiz-options-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="quiz-select-field"
                  disabled={creating}
                  style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <label style={{ fontSize: '0.9rem', color: '#64748b' }}>Questions:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={amount}
                    onChange={e => setAmount(parseInt(e.target.value))}
                    className="quiz-number-field"
                    disabled={creating}
                    style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', width: '60px' }}
                  />
                </div>
              </div>

              <div className="quiz-actions">
                <button
                  disabled={!topic || creating}
                  onClick={createQuiz}
                  className="generate-btn"
                >
                  {creating ? (
                    <>
                      <span className="spinner"></span>
                      <span>Generating Quiz...</span>
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✨</span>
                      <span>Generate Quiz</span>
                    </>
                  )}
                </button>
                {quizzes.length > 0 && (
                  <button onClick={clearQuizzes} className="clear-btn">
                    <span className="btn-icon">🗑️</span>
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quizzes List Section */}
      <section className="quizzes-section">
        <div className="section-header">
          <h2 className="section-title">Your Quizzes</h2>
          {quizzes.length > 0 && (
            <p className="section-count">{quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'}</p>
          )}
        </div>

        {quizzes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">No quizzes yet</h3>
            <p className="empty-state-description">
              Create your first AI-powered quiz using the form above to get started!
            </p>
            <div className="empty-state-features">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Instant Generation</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Custom Topics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Track Progress</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="quizzes-grid">
            {quizzes.map((q, index) => (
              <div key={q.id} className="quiz-card-wrapper" style={{ animationDelay: `${index * 0.05}s` }}>
                <a href={`/quiz/${q.id}`} className="quiz-card-modern">
                  <div className="quiz-card-header">
                    <span className="quiz-card-badge">
                      <span className="badge-icon">🤖</span>
                      AI Generated
                    </span>
                    <span className="quiz-card-date">
                      {new Date(q.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="quiz-card-body">
                    <h3 className="quiz-card-title">{q.topic}</h3>
                    <div className="quiz-card-info">
                      <span className="quiz-info-item">
                        <span className="info-icon">❓</span>
                        {q.questions ? q.questions.length : '5'} Questions
                      </span>
                      {q.difficulty && (
                        <span className="quiz-info-item">
                          <span className="info-icon">📊</span>
                          {q.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="quiz-card-footer">
                    <span className="quiz-card-cta">
                      Start Quiz
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </a>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteQuiz(q.id);
                  }}
                  className="quiz-delete-btn"
                  aria-label="Delete quiz"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6.5 7.5V11.5M9.5 7.5V11.5M4 4H12V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
