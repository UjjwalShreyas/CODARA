const CONSTANTS = require('../../../config/constants')

const deepNestingDetector = {
  name: 'deepNestingDetector',

  detect(code, language) {
    const issues = []
    const lines = code.split('\n')
    let maxNesting = 0

    // Detect indentation style dynamically (spaces vs tabs, and space step size)
    let indentType = 'spaces'
    let tabSize = 2
    const indentSteps = []

    for (let i = 0; i < Math.min(lines.length, 100); i++) {
      const line = lines[i]
      if (line.startsWith('\t')) {
        indentType = 'tabs'
        break
      }
      const match = line.match(/^ +/)
      if (match) {
        indentSteps.push(match[0].length)
      }
    }

    if (indentType === 'spaces' && indentSteps.length > 0) {
      // Common styles: 2-space, 4-space, or 3-space
      const minIndent = Math.min(...indentSteps)
      if (minIndent === 4 || minIndent === 8) {
        tabSize = 4
      } else if (minIndent === 3) {
        tabSize = 3
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const indentation = line.search(/\S/)
      
      if (indentation === -1) continue

      // Calculate nesting level based on indentation type
      let nestingLevel = 0
      if (indentType === 'tabs') {
        const tabMatch = line.match(/^\t+/)
        nestingLevel = tabMatch ? tabMatch[0].length : 0
      } else {
        nestingLevel = Math.floor(indentation / tabSize)
      }

      if (nestingLevel > maxNesting) {
        maxNesting = nestingLevel
      }

      if (nestingLevel > CONSTANTS.DEEP_NESTING_LEVEL) {
        issues.push({
          title: 'Deep Nesting',
          description: `Code has ${nestingLevel} levels of nesting (recommended: max ${CONSTANTS.DEEP_NESTING_LEVEL})`,
          file: 'code.js',
          line: i + 1,
          severity: 'low',
          suggestion: 'Extract nested logic into separate functions or use early returns'
        })
      }
    }

    return issues
  }
}

module.exports = deepNestingDetector