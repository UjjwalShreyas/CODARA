import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import OverviewTab from '../components/Results/OverviewTab'
import ArchitectureTab from '../components/Results/ArchitectureTab'
import IssuesTab from '../components/Results/IssuesTab'
import ExplanationTab from '../components/Results/ExplanationTab'
import InterviewTab from '../components/Results/InterviewTab'
import LearningRoadmapTab from '../components/Results/LearningRoadmapTab'
import '../styles/results.css'
import MagneticButton from '../components/shared/MagneticButton'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const analysis = location.state?.analysis

  if (!analysis) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2>No analysis data.</h2>
        <MagneticButton onClick={() => navigate('/analyze')} className="btn primary" style={{ marginTop: '1rem' }}>Go back</MagneticButton>
      </div>
    )
  }

  if (analysis.error || analysis.success === false) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--text-dark)' }}>
        <h2>Analysis Failed</h2>
        <p style={{ color: 'var(--error)', fontSize: '1.2rem', margin: '2rem 0' }}>
          {analysis.error || 'An unknown error occurred during analysis.'}
        </p>
        <MagneticButton onClick={() => navigate('/analyze')} className="btn primary">Try Again</MagneticButton>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> },
    { id: 'architecture', label: 'Architecture', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> },
    { id: 'issues', label: 'Issues', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg> },
    { id: 'explanation', label: 'Explanation', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
    { id: 'interview', label: 'Interview Prep', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    { id: 'roadmap', label: 'Learning Path', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> },
  ]

  return (
    <div className="results-page">
      <div className="container">
        <MagneticButton className="back-btn" onClick={() => navigate('/analyze')}>← Back</MagneticButton>
        
        <div className="menu">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`link ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="link-icon">{tab.icon}</span>
              <span className="link-title">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && <OverviewTab data={analysis} />}
          {activeTab === 'architecture' && <ArchitectureTab data={analysis} />}
          {activeTab === 'issues' && <IssuesTab data={analysis} />}
          {activeTab === 'explanation' && <ExplanationTab data={analysis} />}
          {activeTab === 'interview' && <InterviewTab data={analysis} />}
          {activeTab === 'roadmap' && <LearningRoadmapTab data={analysis} />}
        </div>
      </div>
    </div>
  )
}