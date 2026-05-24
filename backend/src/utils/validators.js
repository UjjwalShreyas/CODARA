const { AppError } = require('./errorHandler')
const LIMITS = require('../config/limits')
const CONSTANTS = require('../config/constants')

const validators = {
  validateSnippet: (code, language) => {
    if (!code || typeof code !== 'string') {
      throw new AppError('Code snippet required', 400)
    }

    if (code.length > LIMITS.snippet.maxSize) {
      throw new AppError('Code snippet too large', 413)
    }

    if (!CONSTANTS.SUPPORTED_LANGUAGES.includes(language)) {
      throw new AppError('Unsupported language', 400)
    }

    return true
  },

  validateGithubUrl: (url) => {
    if (!url || typeof url !== 'string') {
      throw new AppError('GitHub URL required', 400)
    }

    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/
    if (!githubRegex.test(url)) {
      throw new AppError('Invalid GitHub URL format', 400)
    }

    return true
  },

  validateFileSize: (size, limit) => {
    if (size > limit) {
      throw new AppError('File size exceeds limit', 413)
    }
    return true
  }
}

module.exports = validators