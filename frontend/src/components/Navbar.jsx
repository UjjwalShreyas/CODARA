import { Link, NavLink, useNavigate } from 'react-router-dom';
import MagneticButton from './shared/MagneticButton';
import { ThemeToggleButton } from './shared/ThemeToggle';

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-logo">
          CODARA
        </Link>
        <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
      </div>
    </nav>
  );
}
