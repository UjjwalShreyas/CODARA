const LIMITS = {
  // Snippet analysis
  snippet: {
    maxSize: 100 * 1024, // 100KB
    maxLines: 500,
    timeout: 30000
  },

  // GitHub repo analysis
  github: {
    maxFiles: 1000,
    maxSize: 100 * 1024 * 1024, // 100MB total
    maxFileSize: 1 * 1024 * 1024, // 1MB per file
    timeout: 60000
  },

  // ZIP upload
  zip: {
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 500,
    maxFileSize: 5 * 1024 * 1024, // 5MB per file
    timeout: 45000
  },

  // AI generation
  ai: {
    maxTokens: 2000,
    temperature: 0.7,
    timeout: 60000
  }
}

module.exports = LIMITS