"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/dashboard.css";

type Attempt = {
    id: number;
    score: number;
    total: number;
    createdAt: string;
    user: { name: string | null; email: string };
    quiz: { topic: string; difficulty: string | null };
};

export default function LeaderboardPage() {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/leaderboard")
            .then((res) => res.json())
            .then((data) => {
                setAttempts(data.attempts || []);
                setLoading(false);
            });
    }, []);

    const getDisplayName = (user: { name: string | null; email: string }) => {
        if (user.name) return user.name;
        return user.email.split('@')[0];
    };

    const getAvatar = (user: { name: string | null; email: string }) => {
        const name = getDisplayName(user);
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="dashboard-container">
            <div className="section-header">
                <div>
                    <h1 className="welcome-title">Global Leaderboard 🏆</h1>
                    <p className="welcome-subtitle">See who's topping the charts!</p>
                </div>
                <Link href="/dashboard" className="btn btn-outline">
                    ← Back to Dashboard
                </Link>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading ranking...</p>
                </div>
            ) : (
                <div className="leaderboard-card" style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
                }}>
                    <div className="table-responsive">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Rank</th>
                                    <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>User</th>
                                    <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Topic</th>
                                    <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Difficulty</th>
                                    <th style={{ padding: '16px', color: '#64748b', fontWeight: '600' }}>Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.map((attempt, index) => (
                                    <tr key={attempt.id} style={{
                                        borderBottom: '1px solid #f1f5f9',
                                        backgroundColor: index < 3 ? 'rgba(255, 255, 255, 0.5)' : 'transparent'
                                    }}>
                                        <td style={{ padding: '16px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontWeight: 'bold', fontSize: '0.8rem'
                                                }}>
                                                    {getAvatar(attempt.user)}
                                                </div>
                                                <span style={{ fontWeight: '500' }}>{getDisplayName(attempt.user)}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', color: '#334155' }}>{attempt.quiz.topic}</td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem',
                                                background: attempt.quiz.difficulty === 'Hard' ? '#fee2e2' :
                                                    attempt.quiz.difficulty === 'Medium' ? '#fef3c7' : '#dcfce7',
                                                color: attempt.quiz.difficulty === 'Hard' ? '#ef4444' :
                                                    attempt.quiz.difficulty === 'Medium' ? '#d97706' : '#16a34a',
                                                fontWeight: '500'
                                            }}>
                                                {attempt.quiz.difficulty || 'Medium'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', fontWeight: 'bold', color: '#0f172a' }}>
                                            {attempt.score} / {attempt.total}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {attempts.length === 0 && (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                            No scores yet. Be the first to take a quiz!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
