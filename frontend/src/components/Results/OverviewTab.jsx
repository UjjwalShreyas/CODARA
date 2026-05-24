import '../../styles/results-tabs.css'

export default function OverviewTab({ data }) {
  return (
    <div className="tab-panel">
      <h2>Project Overview</h2>
      
      <div className="card">
        <h3>Tech Stack</h3>
        <div className="tech-stack">
          {data.techStack && data.techStack.map((tech, i) => (
            <span key={i} className="badge">{tech}</span>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Architecture</h3>
        <p>{data.architecture || 'Architecture analysis pending...'}</p>
      </div>

      <div className="card">
        <h3>Repository Stats</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-value">{data.fileCount || 0}</span>
            <span className="stat-label">Files</span>
          </div>
          <div className="stat">
            <span className="stat-value">{data.folderCount || 0}</span>
            <span className="stat-label">Folders</span>
          </div>
          <div className="stat">
            <span className="stat-value">{data.componentCount || 0}</span>
            <span className="stat-label">Components</span>
          </div>
          <div className="stat">
            <span className="stat-value">{data.routeCount || 0}</span>
            <span className="stat-label">Routes</span>
          </div>
        </div>
      </div>
    </div>
  )
}