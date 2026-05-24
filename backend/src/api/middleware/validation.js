const validators = require('../../utils/validators')

const validateAnalyzeInput = (req, res, next) => {
  try {
    const { type, code, language, repoUrl, uploadId } = req.body

    if (type === 'github') {
      if (!repoUrl) return res.status(400).json({ error: 'Repository URL is required' })
      validators.validateGithubUrl(repoUrl)
    } else if (type === 'zip') {
      if (!uploadId) return res.status(400).json({ error: 'Upload ID is required' })
    } else {
      if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Code is required' })
      if (!language) return res.status(400).json({ error: 'Language is required' })
      validators.validateSnippet(code, language)
    }
    next()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const validateGithubInput = (req, res, next) => {
  try {
    const { repoUrl } = req.body
    if (!repoUrl) return res.status(400).json({ error: 'Repository URL is required' })
    validators.validateGithubUrl(repoUrl)
    next()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  validateAnalyzeInput,
  validateGithubInput,
  validateSnippetInput: validateAnalyzeInput // keeping for backward compatibility if needed elsewhere
}