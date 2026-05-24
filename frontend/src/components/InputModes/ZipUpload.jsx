import { useState } from 'react'
import '../../styles/inputs.css'
import Loader from '../shared/Loader'
import MagneticButton from '../shared/MagneticButton'

export default function ZipUpload({ onAnalyze, loading, error }) {
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/zip') {
      setFile(selectedFile)
    } else {
      alert('Please select a ZIP file')
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      alert('Select a ZIP file first')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      onAnalyze({
        type: 'zip',
        uploadId: data.uploadId
      })
    } catch (error) {
      alert('Upload failed: ' + error.message)
    }
  }

  return (
    <div className="input-form">
      <div className="form-group">
        <label>Upload Project ZIP</label>
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".zip"
            onChange={handleFileChange}
            id="zip-input"
          />
          <label htmlFor="zip-input" className="file-label">
            {file ? file.name : 'Click to select ZIP file'}
          </label>
        </div>
        <p className="hint">Max 50MB. We ignore node_modules, dist, build, etc.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <MagneticButton 
          className="btn primary"
          onClick={handleSubmit}
          disabled={loading || !file}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Loader size="20px" /> Uploading...
            </div>
          ) : 'Upload & Analyze'}
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