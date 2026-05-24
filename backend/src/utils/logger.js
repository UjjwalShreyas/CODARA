const env = require('../config/env')

const logger = {
  log: (message, data = null) => {
    if (env.isDev) {
      console.log(`[LOG] ${message}`, data || '')
    }
  },

  error: (message, error = null) => {
    console.error(`[ERROR] ${message}`, error || '')
  },

  warn: (message, data = null) => {
    console.warn(`[WARN] ${message}`, data || '')
  },

  success: (message, data = null) => {
    if (env.isDev) {
      console.log(`[SUCCESS] ✅ ${message}`, data || '')
    }
  },

  debug: (message, data = null) => {
    if (env.isDev) {
      console.log(`[DEBUG] ${message}`, data || '')
    }
  }
}

module.exports = logger