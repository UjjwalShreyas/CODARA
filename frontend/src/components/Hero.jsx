import { useNavigate } from 'react-router-dom';
import '../styles/hero.css';
import MagneticButton from './shared/MagneticButton';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content fade-in-up">
          <h1>Your code, finally explained.</h1>
          <p>
            CODARA analyzes your code — from a single function to an entire GitHub repository — and tells you exactly what it does, what's broken, and what to learn next. Built for students and junior developers who want real feedback, not just syntax highlighting.
          </p>
          
          <div className="hero-buttons">
            <MagneticButton 
              className="btn white-solid"
              onClick={() => navigate('/analyze')}
            >
              Analyze Code Now
            </MagneticButton>
            <MagneticButton 
              className="btn outline-white"
              onClick={() => navigate('/how-it-works')}
            >
              See How It Works
            </MagneticButton>
          </div>

          <div className="hero-badges">
            <div className="hero-badge">
              <span className="hero-badge-icon"> 🙈</span>
              No account needed
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon"> 🙉</span>
              Works with GitHub, ZIP, or pasted code
            </div>
            <div className="hero-badge">
              <span className="hero-badge-icon"> 🙊</span>
              Free to use, Powered by Groq AI ⚡
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}