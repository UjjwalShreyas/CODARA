import { useState } from 'react'
import '../../styles/inputs.css'
import Loader from '../shared/Loader'
import MagneticButton from '../shared/MagneticButton'
import BauhausLanguageSelector from '../shared/BauhausLanguageSelector'

export default function SnippetInput({ onAnalyze, loading, error }) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')

  const placeholders = {
    javascript: `function factorial(n) {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}`,
    typescript: `function factorial(n: number): number {\n  if (n === 0) return 1;\n  return n * factorial(n - 1);\n}`,
    python: `def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)`,
    java: `public class Main {\n    public static int factorial(int n) {\n        if (n == 0) return 1;\n        return n * factorial(n - 1);\n    }\n}`,
    cpp: `#include <iostream>\nint factorial(int n) {\n    if (n == 0) return 1;\n    return n * factorial(n - 1);\n}`,
    go: `package main\nimport "fmt"\nfunc factorial(n int) int {\n    if n == 0 {\n        return 1\n    }\n    return n * factorial(n - 1)\n}`,
    ruby: `def factorial(n)\n  return 1 if n == 0\n  n * factorial(n - 1)\nend`
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setCode(text)
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
      alert('Unable to paste from clipboard. Please allow clipboard permissions or paste manually.')
    }
  }

  const handleSubmit = () => {
    if (!code.trim()) {
      alert('Paste some code first')
      return
    }
    onAnalyze({
      type: 'snippet',
      code,
      language
    })
  }

  return (
    <div className="input-form">
      <BauhausLanguageSelector value={language} onChange={setLanguage} />

      <div className="form-group">
        <label>Paste your code</label>
        <div className="code-editor-container">
          <div className="editor-header">
            <div className="editor-header-controls">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="filename">
              snippet.{
                language === 'javascript' ? 'js' :
                language === 'typescript' ? 'ts' :
                language === 'python' ? 'py' :
                language === 'java' ? 'java' :
                language === 'cpp' ? 'cpp' :
                language === 'go' ? 'go' :
                language === 'ruby' ? 'rb' : 'txt'
              }
            </span>
            <div className="editor-header-actions">
              <button type="button" className="paste-btn" onClick={handlePaste} title="Paste from clipboard">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Paste
              </button>
            </div>
          </div>
          <textarea
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={placeholders[language] || placeholders.javascript}
            rows="12"
            spellCheck="false"
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <MagneticButton 
          className="btn primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Loader size="20px" /> Analyzing...
            </div>
          ) : 'Analyze Code'}
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