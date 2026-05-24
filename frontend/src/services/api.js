const API_BASE = '/api'

const api = {
  async analyzeSnippet(code, language) {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'snippet', code, language })
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Analysis failed')
    }
    return data
  },

  async analyzeGithub(repoUrl) {
  const response = await fetch(`${API_BASE}/github/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repoUrl })
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || data.error || 'GitHub analysis failed')
  }
  return data
},

  async uploadZip(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed')
    }
    return data
  },

  async healthCheck() {
    const response = await fetch(`${API_BASE}/health`)
    return response.ok
  }
}

export default api