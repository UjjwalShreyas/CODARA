const validators = require('../../utils/validators')
const securityLogger = require('../../utils/securityLogger')

/**
 * Sanitise a string by stripping dangerous patterns commonly used in
 * injection attacks. This is a defence-in-depth measure — the main
 * protection comes from never interpolating user input into shell
 * commands or database queries.
 */
function sanitizeString(input) {
  if (typeof input !== 'string') return input

  return input
    // Strip null bytes (can bypass file-path checks)
    .replace(/\0/g, '')
    // Strip common script injection vectors
    .replace(/<script[\s>]/gi, '')
    .replace(/<\/script>/gi, '')
    // Strip event-handler attributes that could execute JS
    .replace(/on\w+\s*=/gi, '')
}

/**
 * Reject payloads that contain patterns associated with prototype-pollution,
 * NoSQL injection, or OS command injection.
 */
function containsMaliciousPayload(obj) {
  const dangerous = [
    '__proto__',
    'constructor',
    'prototype',
    '$gt', '$gte', '$lt', '$lte', '$ne', '$in', '$nin', '$regex',  // NoSQL operators
    '&&', '||', '$(', '`',  // shell meta-characters
  ]

  const json = JSON.stringify(obj).toLowerCase()
  return dangerous.some(d => json.includes(d.toLowerCase()))
}

// ── Middleware: analyse input ────────────────────────────────────
const validateAnalyzeInput = (req, res, next) => {
  try {
    // Prototype-pollution / injection guard
    if (containsMaliciousPayload(req.body)) {
      securityLogger.logSuspiciousActivity(
        req.ip || 'unknown',
        'MALICIOUS_PAYLOAD_BLOCKED',
        { endpoint: req.originalUrl, keys: Object.keys(req.body) }
      )
      return res.status(400).json({ error: 'Invalid request payload' })
    }

    const { type, code, language, repoUrl, uploadId } = req.body

    if (type === 'github') {
      if (!repoUrl) return res.status(400).json({ error: 'Repository URL is required' })
      const { owner, repo } = validators.validateGithubUrl(sanitizeString(repoUrl))
      req.body.repoUrl = sanitizeString(repoUrl)
      req.body.owner = owner
      req.body.repo = repo
    } else if (type === 'zip') {
      if (!uploadId) return res.status(400).json({ error: 'Upload ID is required' })
      // uploadId should be alphanumeric / dashes only
      if (!/^[\w-]+$/.test(uploadId)) {
        return res.status(400).json({ error: 'Invalid upload ID format' })
      }
    } else {
      if (!code || typeof code !== 'string') return res.status(400).json({ error: 'Code is required' })
      if (!language || typeof language !== 'string') return res.status(400).json({ error: 'Language is required' })

      // Sanitize code — we keep it largely intact but strip null bytes
      const cleanCode = sanitizeString(code)
      const cleanLang = sanitizeString(language).toLowerCase().trim()

      validators.validateSnippet(cleanCode, cleanLang)

      // Write sanitised values back for downstream handlers
      req.body.code = cleanCode
      req.body.language = cleanLang
    }
    next()
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// ── Middleware: github input ─────────────────────────────────────
const validateGithubInput = (req, res, next) => {
  try {
    if (containsMaliciousPayload(req.body)) {
      securityLogger.logSuspiciousActivity(
        req.ip || 'unknown',
        'MALICIOUS_PAYLOAD_BLOCKED',
        { endpoint: req.originalUrl }
      )
      return res.status(400).json({ error: 'Invalid request payload' })
    }

    const { repoUrl } = req.body
    if (!repoUrl) return res.status(400).json({ error: 'Repository URL is required' })
    const { owner, repo } = validators.validateGithubUrl(sanitizeString(repoUrl))
    req.body.repoUrl = sanitizeString(repoUrl)
    req.body.owner = owner
    req.body.repo = repo
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