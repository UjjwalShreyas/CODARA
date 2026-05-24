import { useState } from 'react'
import '../../styles/inputs.css'
import Loader from '../shared/Loader'
import MagneticButton from '../shared/MagneticButton'

export default function GitHubInput({ onAnalyze, loading, error }) {
  const [repoUrl, setRepoUrl] = useState('')

  const handleSubmit = () => {
    if (!repoUrl.trim()) {
      alert('Enter a GitHub URL')
      return
    }
    onAnalyze({
      type: 'github',
      repoUrl
    })
  }

  return (
    <div className="input-form">
      <div className="form-group">
        <label>GitHub Repository URL</label>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/username/project"
        />
        <p className="hint">We'll analyze the entire repo and create an architecture map</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <MagneticButton 
          className="btn primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Loader size="20px" /> Fetching repo...
            </div>
          ) : 'Analyze Repository'}
        </MagneticButton>
        
        {error && (
          <div style={{ color: 'var(--error, #e74c3c)', fontSize: '0.9rem', fontWeight: '500' }}>
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  )
}