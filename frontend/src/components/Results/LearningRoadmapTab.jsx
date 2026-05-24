import '../../styles/results-tabs.css'

export default function LearningRoadmapTab({ data }) {
  return (
    <div className="tab-panel">
      <h2>Your Learning Roadmap</h2>
      
      <div className="card">
        <h3>Weaknesses Detected</h3>
        <div className="weaknesses-list">
          {data.weaknesses && data.weaknesses.map((weakness, i) => (
            <div key={i} className="weakness-item">
              <span className="weakness-icon">⚠️</span>
              <span>{weakness}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Recommended Learning Path</h3>
        <div className="roadmap-items">
          {data.learningRoadmap && data.learningRoadmap.map((item, i) => (
            <div key={i} className="roadmap-step">
              <div className="step-number">{i + 1}</div>
              <div className="step-content">
                <h4>{item.topic}</h4>
                <p>{item.description}</p>
                {item.resources && (
                  <div className="resources">
                    <strong>Resources:</strong>
                    <ul>
                      {item.resources.map((res, j) => (
                        <li key={j}>{res}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Next Steps</h3>
        <p>{data.nextSteps || 'Focus on the recommended learning path above.'}</p>
      </div>
    </div>
  )
}