const CONSTANTS = require('../../config/constants')
const logger = require('../../utils/logger')

const fileFilter = {
  shouldIgnore(path) {
    // Check folders
    for (const folder of CONSTANTS.IGNORE_FOLDERS) {
      if (path.includes(`/${folder}/`) || path.startsWith(`${folder}/`)) {
        return true
      }
    }

    // Check files
    for (const file of CONSTANTS.IGNORE_FILES) {
      if (path.endsWith(file)) {
        return true
      }
    }

    // Check extensions
    for (const ext of CONSTANTS.IGNORE_EXTENSIONS) {
      if (path.endsWith(ext)) {
        return true
      }
    }

    return false
  },

  filterFiles(files) {
    logger.log('Filtering files', { total: files.length })

    const filtered = files.filter(file => !this.shouldIgnore(file.path))

    logger.success(`Filtered: ${files.length} -> ${filtered.length}`)

    return filtered
  },

  isCodeFile(path) {
    const codeExtensions = [
      '.js', '.jsx', '.ts', '.tsx',
      '.py', '.java', '.cpp', '.go', '.rs',
      '.html', '.css', '.json', '.yaml', '.yml'
    ]

    return codeExtensions.some(ext => path.endsWith(ext))
  }
}

module.exports = fileFilter