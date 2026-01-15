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
    if (!name || !email || !password) {
      setMsg("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setMsg("Password must be at least 6 characters");
      return;
    }
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (!res.ok) setMsg(data.error || "Failed");
      else {
        setMsg("Success! Redirecting...");
        setTimeout(() => location.href = "/dashboard", 1000);
      }
    } catch (error) {
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero">
      <div className="container">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold gradient-text mb-2 float">AI Quiz Maker</h2>
            <p className="text-muted-foreground">Generate intelligent quizzes with AI</p>
          </div>
          <div className="glass card p-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Join Us</h1>
            <form onSubmit={submit}>
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white text-black"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white text-black"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white text-black"
                  placeholder="Enter your password (min. 6 characters)"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">At least 6 characters</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? "Processing..." : "Continue"}
              </button>
            </form>
            {msg && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${msg.includes("Success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {msg}
              </div>
            )}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/auth/login" className="font-medium text-muted-foreground hover:text-accent bg-transparent transition-colors">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
