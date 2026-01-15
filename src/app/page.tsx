import "@/styles/home.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <p className="hero-badge">AI-powered quiz creation</p>
        <h1 className="hero-title">Create AI-Powered Quizzes in Seconds</h1>
        <p className="hero-description">
          Transform any topic into engaging quizzes instantly. Whether you're a teacher, student, or trivia enthusiast, QuizNest makes learning interactive and fun with AI-generated questions tailored to your needs.
        </p>
        <div className="hero-features">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <span>Instant Quiz Generation</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <span>Progress Tracking</span>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <span>Beautiful Interface</span>
          </div>
        </div>
        <div className="hero-actions">
          <Link href="/auth/signup" className="cta-button cta-button-large">
            Get Started Free →
          </Link>
          <Link href="/dashboard" className="secondary-link">
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
