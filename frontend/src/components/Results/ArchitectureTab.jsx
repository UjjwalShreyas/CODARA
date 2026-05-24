import '../../styles/results-tabs.css'

export default function ArchitectureTab({ data }) {
  const isSnippet = data.type === 'snippet'

  return (
    <div className="tab-panel">
      <h2>Architecture Map</h2>

      <div className="card">
        <h3>Folder Structure</h3>
        {isSnippet ? (
          <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
            Not available for snippet analysis. Upload a GitHub repo or ZIP for full architecture mapping.
          </p>
        ) : (
          <pre className="code-block">{data.folderTree || 'No structure data'}</pre>
        )}
      </div>

      <div className="card">
        <h3>Architecture</h3>
        <p style={{ color: 'var(--text-dark)', lineHeight: '1.7' }}>
          {data.architectureExplanation || data.architecture || 'No architecture data available.'}
        </p>
      </div>

      {!isSnippet && (
        <div className="card">
          <h3>Design Patterns Detected</h3>
          {data.patterns && data.patterns.length > 0 ? (
            <ul style={{ paddingLeft: '1.5rem' }}>
              {data.patterns.map((pattern, i) => (
                <li key={i} style={{ 
                  marginBottom: '0.5rem', 
                  color: 'var(--text-dark)',
                  lineHeight: '1.6'
                }}>
                  {pattern}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
              No specific patterns detected.
            </p>
          )}
        </div>
      )}

      {!isSnippet && data.techStack && data.techStack.length > 0 && (
        <div className="card">
          <h3>Tech Stack</h3>
          <div className="tech-stack">
            {data.techStack.map((tech, i) => (
              <span key={i} className="badge">{tech}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}