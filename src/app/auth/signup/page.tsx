"use client";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!name || !email || !password) { setMsg("Please fill in all fields"); return; }
    if (password.length < 6) { setMsg("Password must be at least 6 characters"); return; }
    setMsg(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", { method: "POST", body: JSON.stringify({ email, password, name }) });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || "Failed");
      else { setMsg("Success! Redirecting..."); setTimeout(() => location.href = "/dashboard", 1000); }
    } catch (error) { setMsg("Network error. Please try again."); }
    finally { setLoading(false); }
  }

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
            <span style={{ fontSize: '24px' }}>✨</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Create account</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Start creating AI-powered quizzes</p>
        </div>

        <form onSubmit={submit}>
          <div style={{ marginBottom: '12px' }}>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Full name" disabled={loading} required
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2px solid #e2e8f0',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc'
              }} />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email" disabled={loading} required
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2px solid #e2e8f0',
                fontSize: '14px', outline: 'none', boxSizing: 'border-box', background: '#f8fafc'
              }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password (min 6 chars)" disabled={loading} required minLength={6}
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
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        {msg && (
          <div style={{
            marginTop: '12px', padding: '10px',
            background: msg.includes("Success") ? '#f0fdf4' : '#fef2f2',
            color: msg.includes("Success") ? '#16a34a' : '#dc2626',
            fontSize: '13px', borderRadius: '8px',
            border: msg.includes("Success") ? '1px solid #86efac' : '1px solid #fecaca',
            textAlign: 'center'
          }}>
            {msg}
          </div>
        )}

        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
          Already have an account? <a href="/auth/login" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
