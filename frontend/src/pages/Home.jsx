import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import MagneticButton from '../components/shared/MagneticButton';
import '../styles/home.css';

export default function Home() {
  const navigate = useNavigate();
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="home-page single-color-theme" style={{ paddingTop: '80px' }}>
      <Hero />
      
      <section className="supported-languages section">
        <div className="container reveal">
          <p className="section-label white-label text-center">SUPPORTED LANGUAGES</p>
          <div className="languages-grid">
            <span>JavaScript</span>
            <span>TypeScript</span>
            <span>Python</span>
            <span>Java</span>
            <span>C++</span>
            <span>Go</span>
            <span>Ruby</span>
          </div>
        </div>
      </section>

      <section className="manifesto-section section">
        <div className="container reveal text-center">
          <h2 className="manifesto-title">Stop guessing. Start understanding.</h2>
          <p className="manifesto-text">
            Your code tells a story, but it's often written in a language that's hard to decipher. 
            CODARA translates complex logic into plain English, catches hidden bugs before they become problems, 
            and prepares you for the technical questions interviewers will actually ask.
          </p>
        </div>
      </section>

      <section className="bottom-cta section">
        <div className="container reveal text-center">
          <h2>Ready to understand your code?</h2>
          <p>Paste a snippet. Get instant clarity.</p>
          <MagneticButton 
            className="btn white-solid"
            onClick={() => navigate('/analyze')}
          >
            Start Analyzing Now
          </MagneticButton>
        </div>
      </section>
    </div>
  );
}