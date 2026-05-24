import { useEffect } from 'react';
import '../styles/home.css';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="page-content" style={{ paddingTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-label">LEGAL</span>
          <h2 style={{ marginBottom: '2rem' }}>Terms of Service</h2>
          
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Welcome to CODARA. By accessing or using our service, you agree to be bound by these terms. Please read them carefully before using our platform.
            </p>
            
            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              By using CODARA, you agree to these Terms of Service. If you do not agree to all of the terms and conditions, you are not authorized to use the service.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Description of Service</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              CODARA provides code analysis, design pattern detection, AI-powered code explanation, and learning insights. The service is provided "as is" and is subject to change or termination at any time.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. User Conduct & Code Submission</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              You retain ownership of any code snippets, ZIP files, or repositories you upload to CODARA. However, by submitting code, you grant us a temporary, non-exclusive license to process and analyze the code using static analyzers and AI models to generate reports. You must not submit malicious code, malware, or proprietary/secret code that you do not have permission to upload.
            </p>

            <h3 style={{ color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Limitations of Liability</h3>
            <p style={{ marginBottom: '1.5rem' }}>
              CODARA uses automated tools and AI models that can occasionally make errors or suffer from hallucinations. We do not guarantee the correctness of the code analysis, bug detection, or roadmap guidance. We are not liable for any damages arising from your use of the platform.
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
