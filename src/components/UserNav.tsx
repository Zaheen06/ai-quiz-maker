"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type User = { id: number; email: string; name?: string };

export default function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/";
  }

  if (loading) {
    return (
      <nav className="flex gap-6 text-sm">
        <div className="h-10 w-24 bg-muted animate-pulse rounded-lg"></div>
      </nav>
    );
  }

  if (!user) {
    return (
      <nav className="flex gap-4 text-sm items-center">
        <Link
          href="/auth/login"
          className="nav-link"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="btn btn-primary text-sm px-5 py-2.5"
        >
          Sign up
        </Link>
      </nav>
    );
  }

  // Helper to extract username from email
  const extractUsername = (email: string) => {
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  // Get initials - handle case where name might be an email
  const getInitials = () => {
    if (user.name) {
      if (user.name.includes('@')) {
        return user.name[0].toUpperCase();
      }
      return user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user.email[0].toUpperCase();
  };

  const initials = getInitials();

  // Get display name - handle case where name might be an email
  const displayName = (() => {
    if (user.name) {
      if (user.name.includes('@')) {
        return extractUsername(user.name);
      }
      return user.name;
    }
    return extractUsername(user.email);
  })();

  return (
    <nav className="flex gap-6 items-center relative">
      <Link
        href="/dashboard"
        className="nav-link"
      >
        <span className="nav-link-icon">📊</span>
        Dashboard
      </Link>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="profile-button"
          aria-label="User menu"
          aria-expanded={dropdownOpen}
        >
          <div className="profile-avatar">
            {initials}
          </div>
          <span className="profile-name">{displayName}</span>
          <svg
            className={`profile-chevron ${dropdownOpen ? 'rotate' : ''}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {dropdownOpen && (
          <>
            <div
              className="dropdown-overlay"
              onClick={() => setDropdownOpen(false)}
            ></div>
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  {initials}
                </div>
                <div className="dropdown-user-info">
                  <p className="dropdown-user-name">{displayName}</p>
                  <p className="dropdown-user-email">{user.email}</p>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <Link
                href="/dashboard"
                className="dropdown-item"
                onClick={() => setDropdownOpen(false)}
              >
                <span className="dropdown-item-icon">📊</span>
                <span>My Quizzes</span>
              </Link>

              <div className="dropdown-divider"></div>

              <button
                onClick={logout}
                className="dropdown-item logout-item"
              >
                <span className="dropdown-item-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
