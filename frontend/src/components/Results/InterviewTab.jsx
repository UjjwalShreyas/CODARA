import { useState } from 'react'
import '../../styles/results-tabs.css'

export default function InterviewTab({ data }) {
  const [expandedQ, setExpandedQ] = useState(null)

  return (
    <div className="tab-panel">
      <h2>Interview Preparation</h2>
      
      <p className="section-intro">
        Questions an interviewer might ask about this code:
      </p>

      <div className="questions-list">
        {data.interviewQuestions && data.interviewQuestions.map((q, i) => (
          <div key={i} className="question-card">
            <button 
              className="question-header"
              onClick={() => setExpandedQ(expandedQ === i ? null : i)}
            >
              <span className="q-number">Q{i + 1}</span>
              <span className="q-text">{q.question}</span>
              <span className="toggle-icon">{expandedQ === i ? '▼' : '▶'}</span>
            </button>
            
            {expandedQ === i && (
              <div className="question-answer">
                <p>{q.answer}</p>
                {q.followUp && (
                  <div className="follow-up">
                    <strong>Follow-up:</strong> {q.followUp}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="card tips-card">
        <h3>Interview Tips</h3>
        <ul>
          <li>Explain your thought process, not just the code</li>
          <li>Be ready to discuss trade-offs and alternatives</li>
          <li>Mention edge cases you considered</li>
          <li>Talk about performance optimizations</li>
        </ul>
      </div>
    </div>
  )
}