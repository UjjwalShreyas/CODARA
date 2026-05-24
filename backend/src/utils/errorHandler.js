const logger = require('./logger')

class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'

  logger.error(err.message, err)

  // Sanitize message for 500 errors in production to avoid leaking internal details
  const isDev = process.env.NODE_ENV === 'development'
  const clientMessage = (!isDev && err.statusCode === 500) 
    ? 'An unexpected internal server error occurred.' 
    : err.message

  res.status(err.statusCode).json({
    success: false,
    error: clientMessage,
    ...(isDev && { stack: err.stack })
  })
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = {
  AppError,
  errorHandler,
  asyncHandler
}