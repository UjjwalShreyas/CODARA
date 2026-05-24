import { useEffect } from 'react';
import '../styles/home.css';

export default function Disclaimer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-content" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-label">LEGAL</span>
          <h2 style={{ marginBottom: '2rem' }}>Disclaimer</h2>
          
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Please read this disclaimer carefully before using CODARA.
            </p>
            
            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Educational and Informational Purposes Only</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              The analysis, roadmap, recommendations, and explanations provided by CODARA are for educational and informational purposes only. They are intended as a tool to help developers understand code patterns and prepare for software engineering interviews. They should not be considered professional development advice.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. AI Hallucinations and Errors</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              CODARA relies heavily on Large Language Models (LLMs) to construct answers, roadmaps, and explanations. LLMs are known to occasionally hallucinate facts, generate buggy code modifications, or misidentify programming concepts. You should always verify the AI output and cross-reference it with official programming documentation.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. No Security or Correctness Warranties</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              While CODARA performs static analysis to find potential bugs and security vulnerabilities, we make no representation or warranty that our platform will detect all vulnerabilities, bugs, or defects, or that our recommendations are correct, secure, or free from error.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Use at Your Own Risk</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              You assume full responsibility for any changes you make to your codebase based on findings or suggestions from CODARA. Under no circumstances shall CODARA or its contributors be held liable for database corruptions, server crashes, security exploits, or data loss occurring on your systems.
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
