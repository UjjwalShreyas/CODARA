import { useState } from 'react'
import '../../styles/results-tabs.css'

export default function ExplanationTab({ data }) {
  const [mode, setMode] = useState('beginner')

  const explanations = {
    beginner: data.explanationBeginner,
    intermediate: data.explanationIntermediate,
    advanced: data.explanationAdvanced
  }

  const formatExplanation = (text) => {
    if (!text) return null
    return text
      .split('\n')
      .filter(p => p.trim().length > 0)
      .map((paragraph, i) => (
        <p key={i} style={{ marginBottom: '1rem', lineHeight: '1.8', color: 'var(--text-dark)' }}>
          {paragraph.trim()}
        </p>
      ))
  }

  const modeDescriptions = {
    beginner: 'Simple explanation — no jargon',
    intermediate: 'Assumes some programming knowledge',
    advanced: 'Technical deep dive'
  }

  return (
    <div className="tab-panel">
      <h2>Code Explanation</h2>

      <div className="explanation-modes">
        {['beginner', 'intermediate', 'advanced'].map(m => (
          <button
            key={m}
            className={`mode-btn ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <p style={{ 
        fontSize: '0.85rem', 
        color: 'var(--text-light)', 
        marginBottom: '1rem',
        fontStyle: 'italic' 
      }}>
        {modeDescriptions[mode]}
      </p>

      <div className="card">
        {explanations[mode]
          ? formatExplanation(explanations[mode])
          : <p style={{ color: 'var(--text-light)' }}>Generating explanation...</p>
        }
      </div>

      {data.complexity && (
        <div className="card">
          <h3>Complexity Analysis</h3>
          <div className="complexity-grid">
            <div className="complexity-item">
              <strong>Time Complexity</strong>
              <code>{data.complexity.time}</code>
            </div>
            <div className="complexity-item">
              <strong>Space Complexity</strong>
              <code>{data.complexity.space}</code>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}