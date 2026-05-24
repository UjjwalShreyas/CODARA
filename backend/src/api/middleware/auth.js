const logger = require('../../utils/logger')

const rateLimiter = {
  requests: {},

  check(ip) {
    const now = Date.now()
    const limit = 100 // requests per minute
    const window = 60000

    if (!this.requests[ip]) {
      this.requests[ip] = []
    }

    this.requests[ip] = this.requests[ip].filter(t => now - t < window)

    if (this.requests[ip].length >= limit) {
      return false
    }

    this.requests[ip].push(now)
    return true
  }
}

const authMiddleware = {
  rateLimitCheck: (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress

    if (!rateLimiter.check(ip)) {
      logger.warn('Rate limit exceeded', { ip })
      return res.status(429).json({ error: 'Too many requests' })
    }

    next()
  },

  // TODO: Add API key validation
  // TODO: Add JWT validation for future auth system

  validateApiKey: (req, res, next) => {
    // Placeholder for API key validation
    next()
  }
}

module.exports = authMiddleware