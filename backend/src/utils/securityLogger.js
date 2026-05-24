const logger = require('./logger')

const securityLogger = {
  logAuthAttempt: (ip, endpoint, success, reason = '') => {
    const timestamp = new Date().toISOString()
    const logMsg = `[SECURITY AUDIT] [${timestamp}] Auth Attempt on ${endpoint} from IP: ${ip} | Success: ${success}${reason ? ` | Reason: ${reason}` : ''}`
    if (success) {
      logger.success(logMsg)
    } else {
      logger.warn(logMsg)
    }
  },

  logRateLimitBlock: (ip, endpoint, count) => {
    const timestamp = new Date().toISOString()
    logger.warn(`[SECURITY ALERT] [${timestamp}] Rate Limit Blocked IP: ${ip} on Endpoint: ${endpoint} (Count: ${count})`)
  },

  logSuspiciousActivity: (ip, type, details) => {
    const timestamp = new Date().toISOString()
    logger.error(`[SECURITY ALERT] [${timestamp}] Suspicious Activity Blocked! IP: ${ip} | Type: ${type} | Details: ${JSON.stringify(details)}`)
  },

  logApiError: (ip, endpoint, err) => {
    const timestamp = new Date().toISOString()
    logger.error(`[SECURITY ERROR] [${timestamp}] API Error on ${endpoint} from IP: ${ip} | Message: ${err.message}`, err.stack)
  }
}

module.exports = securityLogger
