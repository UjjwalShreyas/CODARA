const LIMITS = require('../../config/limits')
const logger = require('../../utils/logger')

const fileValidator = {
  validateSnippetFile(code, language) {
    if (!code || typeof code !== 'string') {
      throw new Error('Code must be a string')
    }

    if (code.length > LIMITS.snippet.maxSize) {
      throw new Error(`Code exceeds size limit (${LIMITS.snippet.maxSize} bytes)`)
    }

    const lines = code.split('\n').length
    if (lines > LIMITS.snippet.maxLines) {
      throw new Error(`Code exceeds line limit (${LIMITS.snippet.maxLines} lines)`)
    }

    logger.success('Snippet validation passed')
    return true
  },

  validateZipFile(fileSize) {
    if (fileSize > LIMITS.zip.maxSize) {
      throw new Error(`ZIP file exceeds size limit (${LIMITS.zip.maxSize / 1024 / 1024}MB)`)
    }

    logger.success('ZIP validation passed')
    return true
  },

  validateFileCount(count) {
    if (count > LIMITS.zip.maxFiles) {
      throw new Error(`Too many files (${count}), limit: ${LIMITS.zip.maxFiles}`)
    }

    return true
  },

  validateIndividualFile(fileSize) {
    if (fileSize > LIMITS.zip.maxFileSize) {
      throw new Error(`Individual file exceeds limit (${LIMITS.zip.maxFileSize / 1024 / 1024}MB)`)
    }

    return true
  }
}

module.exports = fileValidator