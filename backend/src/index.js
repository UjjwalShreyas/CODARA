const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const dotenv = require('dotenv')

dotenv.config()

const { errorHandler } = require('./utils/errorHandler')
const securityLogger = require('./utils/securityLogger')
const analyzeRoutes = require('./api/routes/analyze')
const githubRoutes = require('./api/routes/github')
const uploadRoutes = require('./api/routes/upload')

const app = express()
const PORT = process.env.PORT || 5000
const isDev = process.env.NODE_ENV !== 'production'

// ── Security Middleware ──────────────────────────────────────────

// Helmet: sets secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet({
  contentSecurityPolicy: isDev ? false : undefined, // disable CSP in dev for hot-reload
  crossOriginEmbedderPolicy: false                  // allow cross-origin resources (API)
}))

// CORS: restrict to known origins
const allowedOrigins = [
  'http://localhost:5173',     // Vite dev server
  'http://localhost:3000',     // fallback dev port
  process.env.FRONTEND_URL    // production frontend URL from env
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }
    securityLogger.logSuspiciousActivity(origin, 'CORS_REJECTED', { origin })
    return callback(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600 // preflight cache: 10 min
}))

// Global rate limiter: 100 requests per 15 min window
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,    // Disable `X-RateLimit-*` headers
  message: { error: 'Too many requests, please try again later.' },
  handler: (req, res, next, options) => {
    securityLogger.logRateLimitBlock(
      req.ip || req.connection.remoteAddress,
      req.originalUrl,
      options.max
    )
    res.status(options.statusCode).json(options.message)
  }
})

// Strict rate limiter for analysis endpoints (expensive AI calls)
const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Analysis rate limit reached. Please wait before submitting again.' },
  handler: (req, res, next, options) => {
    securityLogger.logRateLimitBlock(
      req.ip || req.connection.remoteAddress,
      req.originalUrl,
      options.max
    )
    res.status(options.statusCode).json(options.message)
  }
})

app.use(globalLimiter)

// ── Body Parsers ─────────────────────────────────────────────────
// Reduced limits from 50mb to safer defaults (200kb allows max 100kb snippet + JSON overhead)
app.use(express.json({ limit: '200kb' }))
app.use(express.urlencoded({ limit: '200kb', extended: true }))

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/analyze', analysisLimiter, analyzeRoutes)
app.use('/api/github', analysisLimiter, githubRoutes)
app.use('/api/upload', analysisLimiter, uploadRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 CODARA Backend running on http://localhost:${PORT}`)
  if (isDev) {
    console.log(`   CORS allowed origins: ${allowedOrigins.join(', ')}`)
  }
})

module.exports = app