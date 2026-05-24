const logger = require('../../utils/logger')
const longFunctionDetector = require('./detectors/longFunction')
const deepNestingDetector = require('./detectors/deepNesting')
const unusedImportsDetector = require('./detectors/unusedImports')
const duplicateLogicDetector = require('./detectors/duplicateLogic')

class StaticAnalyzer {
  constructor(language = 'javascript') {
    this.language = language
    this.detectors = [
      longFunctionDetector,
      deepNestingDetector,
      unusedImportsDetector,
      duplicateLogicDetector
    ]
  }

  analyze(code) {
    logger.log('Running static analysis', { language: this.language })

    const issues = []

    // Run each detector
    for (const detector of this.detectors) {
      try {
        const found = detector.detect(code, this.language)
        if (found && found.length > 0) {
          issues.push(...found)
        }
      } catch (error) {
        logger.warn(`Detector ${detector.name} failed`, error.message)
      }
    }

    logger.success(`Found ${issues.length} issues`)

    return {
      issueCount: issues.length,
      issues,
      detectors: this.detectors.map(d => d.name)
    }
  }

  detectLanguage(code) {
    // Simple heuristics
    if (code.includes('import ') || code.includes('export ')) {
      return 'javascript'
    }
    if (code.includes('def ') || code.includes('import ')) {
      return 'python'
    }
    if (code.includes('public class') || code.includes('package ')) {
      return 'java'
    }
    return 'unknown'
  }
}

module.exports = StaticAnalyzer