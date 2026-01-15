"use client";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase-client";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const res = await fetch("/api/auth/provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error("Failed to authenticate session");
      window.location.href = "/dashboard";
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") setError("Sign in cancelled.");
      else setError("Authentication failed. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); setLoading(false); return; }
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '28px 28px 24px',
        boxShadow: '0 20px 40px -12px rgba(0,0,0,0.25)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
            boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
          }}>
            <span style={{ fontSize: '24px' }}>🧠</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Sign in to continue to QuizNest</p>
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} style={{
          width: '100%', padding: '11px 16px', background: 'white', border: '2px solid #e2e8f0',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          fontSize: '14px', fontWeight: '600', color: '#334155', cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1, marginBottom: '16px'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 16px 0', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
        </div>

        <form onSubmit={handleEmailLogin}>
          <div style={{ marginBottom: '12px' }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email" disabled={loading}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2px solid #e2e8f0',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc'
              }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" disabled={loading}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2px solid #e2e8f0',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc'
              }} />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '11px 16px', borderRadius: '10px', border: 'none',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white',
            fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.35)'
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '12px', padding: '10px', background: '#fef2f2', color: '#dc2626',
            fontSize: '13px', borderRadius: '8px', border: '1px solid #fecaca', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          Don't have an account? <a href="/auth/signup" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
