import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <Link to="/" className="footer-logo">CODARA</Link>
            <div className="footer-tagline" style={{marginTop: '1rem'}}>
              Made for developers, by developers
            </div>
          </div>
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <a href="https://github.com/UjjwalShreyas" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 CODARA</span>
          <span>Built by Shreyas.G, with love ❤️</span>
          <span>All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
