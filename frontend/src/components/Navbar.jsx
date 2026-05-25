import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import MagneticButton from './shared/MagneticButton';
import { ThemeToggleButton } from './shared/ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">
          CODARA
        </Link>

        {/* Desktop links */}
        <div className="navbar-links navbar-desktop">
          <NavLink to="/" end data-text="Home">Home</NavLink>
          <NavLink to="/features" data-text="Features">Features</NavLink>
          <NavLink to="/how-it-works" data-text="How it Works">How it Works</NavLink>
          <MagneticButton 
            className="btn primary"
            onClick={() => navigate('/analyze')}
          >
            Start Analyzing
          </MagneticButton>
          <ThemeToggleButton variant="circle" />
        </div>

        {/* Mobile controls */}
        <div className="navbar-mobile-controls">
          <ThemeToggleButton variant="circle" />
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(false)} />
      
      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/features" onClick={() => setMenuOpen(false)}>Features</NavLink>
        <NavLink to="/how-it-works" onClick={() => setMenuOpen(false)}>How it Works</NavLink>
        <button 
          className="btn primary mobile-cta"
          onClick={() => { setMenuOpen(false); navigate('/analyze'); }}
        >
          Start Analyzing
        </button>
      </div>
    </nav>
  );
}
