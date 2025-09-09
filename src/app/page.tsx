import "@/styles/home.css";

export default function Home() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">QuizNest</h1>
        <p className="hero-description">
         QuizNest is a fun and interactive platform for creating and playing quizzes that make learning exciting. Whether you're a teacher, student, or trivia enthusiast, QuizNest lets you build custom quizzes, host live sessions, and track performance—all in a sleek, gamified environment. It's where curiosity meets competition and knowledge takes flight.
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
          <a href="/auth" className="cta-button">Start Creating Quizzes</a>
          <a href="#features" className="secondary-link">Learn More</a>
        </div>
      </div>
    </div>
  );
}
