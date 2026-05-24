import '../../styles/results-tabs.css'

export default function IssuesTab({ data }) {
  return (
    <div className="tab-panel">
      <h2>Code Issues & Improvements</h2>
      
      {data.issues && data.issues.length > 0 ? (
        <div className="issues-list">
          {data.issues.map((issue, i) => (
            <div key={i} className={`issue-card severity-${issue.severity}`}>
              <div className="issue-header">
                <h4>{issue.title}</h4>
                <span className="severity-badge">{issue.severity}</span>
              </div>
              <p>{issue.description}</p>
              <div className="issue-location">
                <code>{issue.file}:{issue.line}</code>
              </div>
              {issue.suggestion && (
                <div className="suggestion">
                  <strong>💡 Suggestion:</strong> {issue.suggestion}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-issues">No major issues detected! 🎉</p>
      )}
    </div>
  )
}