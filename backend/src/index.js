const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const { errorHandler } = require('./utils/errorHandler')
const analyzeRoutes = require('./api/routes/analyze')
const githubRoutes = require('./api/routes/github')
const uploadRoutes = require('./api/routes/upload')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Routes
app.use('/api/analyze', analyzeRoutes)
app.use('/api/github', githubRoutes)
app.use('/api/upload', uploadRoutes)

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
})

module.exports = app