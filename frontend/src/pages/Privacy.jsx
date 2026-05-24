import { useEffect } from 'react';
import '../styles/home.css';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-content" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-label">LEGAL</span>
          <h2 style={{ marginBottom: '2rem' }}>Privacy Policy</h2>
          
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Your privacy is extremely important to us. This Privacy Policy describes how we handle, collect, and process code submissions and user interactions on CODARA.
            </p>
            
            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Process</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We process the code files, repository structure, and snippets that you input. This data is transferred to our server to run static analysis and is sent securely via HTTPS/API to LLM inference providers (like Groq or Google Gemini) to generate explanations and roadmaps.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Data Retention</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Any uploaded ZIP files are automatically extracted to a temporary directory on the server, analyzed, and then immediately deleted from storage. We do not store your source code files permanently. Analysis results are kept only in-memory or in transient states to deliver the response.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Third-Party API Usage</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              Our platform uses third-party AI models. These models process the code snippet payload to generate learning materials. We do not authorize these providers to use your submitted code for model training.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Cookies and Web Analytics</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              We may collect basic analytics logs (IP address, browser type, request timestamps) to prevent abuse and manage API rate limits.
            </p>

            <p style={{ marginTop: '3rem', fontSize: '0.9rem', opacity: 0.7 }}>
              Last updated: May 2026
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
