
"use client";
import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg("");
    setLoading(true);
    const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body: any = { email, password };
    if (mode === "signup") body.name = name;
    try {
      const res = await fetch(url, { method: "POST", body: JSON.stringify(body) });
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
            <h1 className="text-2xl font-bold mb-6 text-center">{mode === "login" ? "Welcome Back" : "Join Us"}</h1>
            {mode === "signup" && (
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-2">Full Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white text-black"
                  placeholder="Enter your full name"
                />
              </div>
            )}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white text-black"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 bg-white text-black"
                placeholder="Enter your password"
              />
            </div>
            <button
              onClick={submit}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? "Processing..." : "Continue"}
            </button>
            {msg && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${msg.includes("Success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {msg}
              </div>
            )}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className={`font-medium transition-colors duration-200 rounded px-3 py-2 ${
                  mode === "login"
                    ? "text-muted-foreground hover:text-accent bg-transparent"
                    : "text-muted-foreground hover:text-accent bg-transparent"
                }`}
              >
                {mode === "login" ? "Create an account" : "Log in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>    
  );
}
