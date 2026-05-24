import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SnippetInput from '../components/InputModes/SnippetInput'
import GitHubInput from '../components/InputModes/GitHubInput'
import ZipUpload from '../components/InputModes/ZipUpload'
import '../styles/analyze.css'
import api from '../services/api'
import SpeederLoader from '../components/shared/SpeederLoader'
import DotSpinner from '../components/shared/DotSpinner'

export default function Analyze() {
  const [activeTab, setActiveTab] = useState('snippet')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleAnalyze = async (data) => {
    setLoading(true)
    setError(null)

    try {
      let result

      if (data.type === 'snippet') {
        result = await api.analyzeSnippet(data.code, data.language)
      } else if (data.type === 'github') {
        result = await api.analyzeGithub(data.repoUrl)
      } else if (data.type === 'zip') {
        result = await api.uploadZip(data.file)
      }

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }

      navigate('/results', { state: { analysis: result.data } })
    } catch (err) {
  if (err.message?.includes('RATE_LIMITED') || err.message?.includes('rate limited') || err.message?.includes('429')) {
    setError('⏳ AI services are temporarily busy. Please wait a few minutes and try again.')
  } else if (err.message === 'Analysis failed') {
    setError('This doesn\'t look like valid code. Please paste actual code to analyze.')
  } else {
    setError(err.message)
  }
} finally {
      setLoading(false)
    }
  }

  return (
    <div className="analyze-page">
      <div className="container">
        <h1>Analyze Your Code</h1>

        <div className="tabs">
          <button
            className={`action-btn ${activeTab === 'snippet' ? 'active' : ''}`}
            onClick={() => setActiveTab('snippet')}
          >
            <TextRoll>Paste Snippet</TextRoll>
          </button>
          <button
            className={`action-btn ${activeTab === 'github' ? 'active' : ''}`}
            onClick={() => setActiveTab('github')}
          >
            <TextRoll>GitHub Repo</TextRoll>
          </button>
          <button
            className={`action-btn ${activeTab === 'zip' ? 'active' : ''}`}
            onClick={() => setActiveTab('zip')}
          >
            <TextRoll>Upload ZIP</TextRoll>
          </button>
        </div>



        {loading && activeTab === 'github' && (
          <SpeederLoader
            message="Fetching and analyzing repository... ~30 seconds"
          />
        )}

        {loading && activeTab !== 'github' && (
          <div className="loading-overlay">
            <DotSpinner color="var(--primary)" size="3rem" />
            <p style={{ marginTop: '1.5rem' }}>
              {activeTab === 'zip'
                ? 'Extracting and analyzing your project...'
                : 'Analyzing your code...'}
            </p>
          </div>
        )}

        {!loading && (
          <div className="tab-content">
            {activeTab === 'snippet' && (
              <SnippetInput onAnalyze={handleAnalyze} loading={loading} error={error} />
            )}
            {activeTab === 'github' && (
              <GitHubInput onAnalyze={handleAnalyze} loading={loading} error={error} />
            )}
            {activeTab === 'zip' && (
              <ZipUpload onAnalyze={handleAnalyze} loading={loading} error={error} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const STAGGER = 0.035;

const TextRoll = ({ children, className, center = false }) => {
  return (
    <motion.div
      initial="initial"
      whileHover="hovered"
      style={{ position: 'relative', display: 'flex', overflow: 'hidden' }}
      className={className}
    >
      <div style={{ display: 'flex' }}>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: 0 },
                hovered: { y: "-100%" },
              }}
              transition={{ ease: "easeInOut", delay }}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex' }}>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: { y: "100%" },
                hovered: { y: 0 },
              }}
              transition={{ ease: "easeInOut", delay }}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
};