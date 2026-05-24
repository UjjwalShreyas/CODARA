const CONSTANTS = require('../../config/constants')

const rules = {
  // Code quality rules
  MAX_FUNCTION_LENGTH: CONSTANTS.LONG_FUNCTION_LINES,
  MAX_NESTING_DEPTH: CONSTANTS.DEEP_NESTING_LEVEL,
  MAX_PARAMETERS: CONSTANTS.MAX_FUNCTION_PARAMS,
  MAX_CYCLOMATIC_COMPLEXITY: 10,

  // Naming rules
  NAMING_CONVENTION: {
    camelCase: /^[a-z][a-zA-Z0-9]*$/,
    PascalCase: /^[A-Z][a-zA-Z0-9]*$/,
    UPPER_SNAKE_CASE: /^[A-Z_]+$/
  },

  // Comment rules
  MIN_COMMENT_RATIO: 0.1, // 10% of code should be comments

  // Import rules
  MAX_IMPORTS_PER_FILE: 20,

  // Function rules
  IDEAL_FUNCTION_LENGTH: 20,
  IDEAL_FILE_LENGTH: 300,

  // Severity levels
  SEVERITY: {
    critical: 1,
    high: 2,
    medium: 3,
    low: 4,
    info: 5
  },

  // Issue categories
  CATEGORIES: {
    STYLE: 'style',
    PERFORMANCE: 'performance',
    SECURITY: 'security',
    MAINTAINABILITY: 'maintainability',
    COMPLEXITY: 'complexity'
  }
}

module.exports = rules