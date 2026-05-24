import { useEffect } from 'react';
import '../styles/home.css';

export default function HowItWorks() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => el.classList.add('active'));
  }, []);

  return (
    <div className="page-content" style={{ paddingTop: '80px' }}>
      <section className="section how-it-works" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '5rem' }}>
            <span className="section-label">THE PROCESS</span>
            <h2>How CODARA breaks down your code.</h2>
          </div>
          
          <div className="process-timeline">
            <div className="process-step-expanded reveal">
              <div className="step-number-large">1</div>
              <div className="step-content">
                <h3>Provide Your Codebase</h3>
                <p>Whether it's a quick 10-line snippet you're stuck on, a downloaded ZIP file of your weekend project, or a public GitHub repository URL, CODARA ingests it instantly.</p>
                <div className="mock-terminal">
                  <code>$ git clone https://github.com/user/project.git</code>
                  <code>$ codara ingest --target ./project</code>
                  <code className="text-success">✔ Repository ingested successfully (142 files)</code>
                </div>
              </div>
            </div>

            <div className="process-step-expanded reveal">
              <div className="step-number-large">2</div>
              <div className="step-content">
                <h3>Static Analysis & Enrichment</h3>
                <p>First, we run traditional static analysis (like ESLint or SonarQube rules) to catch syntax errors and standard bugs. Then, we chunk your code and pass it through advanced LLMs to extract semantic meaning, architectural patterns, and business logic.</p>
                <div className="mock-terminal">
                  <code>Analyzing AST...</code>
                  <code>Detecting design patterns: MVC, Singleton found.</code>
                  <code className="text-success">✔ AI Enrichment complete.</code>
                </div>
              </div>
            </div>

            <div className="process-step-expanded reveal">
              <div className="step-number-large">3</div>
              <div className="step-content">
                <h3>Receive Actionable Insights</h3>
                <p>You don't just get a pass/fail grade. You get a comprehensive dashboard featuring:</p>
                <ul className="custom-bullet-list">
                  <li>Line-by-line explanations tailored to your experience level.</li>
                  <li>Specific optimization tips (e.g., "Use a Hash Map here instead of nested loops").</li>
                  <li>Mock interview questions based specifically on the files you uploaded.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
