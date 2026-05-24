const CONSTANTS = require('../../../config/constants')

const longFunctionDetector = {
  name: 'longFunctionDetector',

  detect(code, language) {
    const issues = []
    const lines = code.split('\n')

    let inFunction = false
    let functionStart = 0
    let functionName = ''
    let braceCount = 0
    let functionIndent = 0

    for (let i = 0; i < lines.length; i++) {
      const origLine = lines[i]
      const line = origLine.trim()

      if (!inFunction) {
        if (language === 'javascript' || language === 'typescript') {
          if (line.match(/^(async\s+)?function\s+\w+|^\s*(?:const|let|var)\s+\w+\s*=\s*(async\s*)?\(/)) {
            inFunction = true
            functionStart = i
            const nameMatch = line.match(/(?:function\s+(\w+)|(\w+)\s*=)/)
            functionName = nameMatch ? (nameMatch[1] || nameMatch[2]) : 'anonymous'
            braceCount = (origLine.match(/{/g) || []).length
          }
        } else if (language === 'python') {
          if (line.match(/^def\s+\w+/)) {
            inFunction = true
            functionStart = i
            const nameMatch = line.match(/def\s+(\w+)/)
            functionName = nameMatch ? nameMatch[1] : 'function'
            const indentMatch = origLine.match(/^(\s*)/)
            functionIndent = indentMatch ? indentMatch[1].length : 0
          }
        } else if (language === 'java' || language === 'cpp') {
          if (line.match(/^(?:public|private|protected|static|\s)*\w+\s+\w+\s*\([^)]*\)\s*(?:throws\s+\w+\s*)?{/)) {
            inFunction = true
            functionStart = i
            const nameMatch = line.match(/(\w+)\s*\(/)
            functionName = nameMatch ? nameMatch[1] : 'method'
            braceCount = (origLine.match(/{/g) || []).length
          }
        }
      } else {
        if (language === 'javascript' || language === 'typescript' || language === 'java' || language === 'cpp') {
          braceCount += (origLine.match(/{/g) || []).length - (origLine.match(/}/g) || []).length

          if (braceCount <= 0) {
            const functionLength = i - functionStart + 1
            if (functionLength > CONSTANTS.LONG_FUNCTION_LINES) {
              issues.push({
                title: 'Long Function',
                description: `Function "${functionName}" is ${functionLength} lines long`,
                file: 'code.js',
                line: functionStart + 1,
                severity: 'medium',
                suggestion: 'Consider breaking this function into smaller, focused functions'
              })
            }
            inFunction = false
          }
        } else if (language === 'python') {
          const indentMatch = origLine.match(/^(\s*)/)
          const currentIndent = indentMatch ? indentMatch[1].length : 0
          
          if (line !== '' && !line.startsWith('#') && currentIndent <= functionIndent && i > functionStart) {
            const functionLength = i - functionStart
            if (functionLength > CONSTANTS.LONG_FUNCTION_LINES) {
              issues.push({
                title: 'Long Function',
                description: `Function "${functionName}" is ${functionLength} lines long`,
                file: 'code.py',
                line: functionStart + 1,
                severity: 'medium',
                suggestion: 'Consider breaking this function into smaller, focused functions'
              })
            }
            inFunction = false
            i--
          }
        }
      }
    }

    if (inFunction && language === 'python') {
      const functionLength = lines.length - functionStart
      if (functionLength > CONSTANTS.LONG_FUNCTION_LINES) {
        issues.push({
          title: 'Long Function',
          description: `Function "${functionName}" is ${functionLength} lines long`,
          file: 'code.py',
          line: functionStart + 1,
          severity: 'medium',
          suggestion: 'Consider breaking this function into smaller, focused functions'
        })
      }
    }

    return issues
  }
}

module.exports = longFunctionDetector