import { useEffect } from 'react';
import '../styles/home.css';

export default function Features() {
  useEffect(() => {
    window.scrollTo(0, 0);
    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => el.classList.add('active'));
  }, []);

  return (
    <div className="page-content" style={{ paddingTop: '80px' }}>
      <section className="section features-section" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '4rem' }}>
            <span className="section-label">WHAT YOU GET</span>
            <h2>Everything your code mentor never told you.</h2>
          </div>
          
          <div className="features-list">
            {/* Feature 1 */}
            <div className="feature-row reveal">
              <div className="feature-text">
                <h3>Code Explanation</h3>
                <p>We don't just highlight syntax. CODARA parses your code line-by-line and generates plain-English explanations tailored to your skill level. Stop guessing what that complex regex or nested loop does.</p>
                <ul className="feature-bullets">
                  <li>Context-aware variable tracking</li>
                  <li>Plain-english logic translation</li>
                  <li>Complexity breakdown</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div className="mock-code-window">
                  <div className="mock-window-header">
                    <span className="dot bg-red"></span><span className="dot bg-yellow"></span><span className="dot bg-green"></span>
                  </div>
                  <pre><code>{`// CODARA Insight:
// This function uses memoization to cache
// expensive recursive calls, reducing
// time complexity from O(2^n) to O(n).`}</code></pre>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="feature-row reverse reveal">
              <div className="feature-text">
                <h3>Bug & Risk Detection</h3>
                <p>Catch edge cases and anti-patterns before they hit production. Our engine combines robust static analysis tools with AI pattern recognition to flag memory leaks, unhandled exceptions, and security vulnerabilities.</p>
                <ul className="feature-bullets">
                  <li>Security vulnerability scanning</li>
                  <li>Anti-pattern detection</li>
                  <li>Performance bottleneck alerts</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div className="mock-alert-window error">
                  <strong>⚠️ Critical Issue Found</strong>
                  <p>Potential SQL Injection on line 42. Unsanitized user input `req.body.id` is concatenated directly into the query string.</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="feature-row reveal">
              <div className="feature-text">
                <h3>Architecture & Interview Prep</h3>
                <p>Upload a full repository and watch CODARA map out your entire tech stack, database schema, and design patterns. Then, test your knowledge with auto-generated interview questions based precisely on the code you just wrote.</p>
                <ul className="feature-bullets">
                  <li>Repository dependency mapping</li>
                  <li>Auto-generated Q&A flashcards</li>
                  <li>Personalized learning roadmap</li>
                </ul>
              </div>
              <div className="feature-visual">
                <div className="mock-qa-window">
                  <strong>Q: Why did you choose a Set over an Array here?</strong>
                  <div className="answer-blur">
                    A: Because checking for existence in a Set is O(1) time complexity, whereas Array.includes() is O(n), making the lookup significantly faster for large datasets.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
