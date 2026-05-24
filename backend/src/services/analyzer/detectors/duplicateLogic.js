
const duplicateLogicDetector = {
  name: 'duplicateLogicDetector',

  detect(code, language) {
    const issues = []
    const lines = code.split('\n')

    // Simple approach: find similar consecutive lines
    const lineMap = {}

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.length < 20 || line.startsWith('//')) continue

      if (lineMap[line]) {
        lineMap[line].push(i + 1)
      } else {
        lineMap[line] = [i + 1]
      }
    }

    // Report duplicates
    for (const [line, positions] of Object.entries(lineMap)) {
      if (positions.length > 2) {
        issues.push({
          title: 'Duplicate Logic',
          description: `This line appears ${positions.length} times (lines: ${positions.join(', ')})`,
          file: 'code.js',
          line: positions[0],
          severity: 'low',
          suggestion: 'Extract common logic into a reusable function or constant'
        })
      }
    }

    return issues
  }
}

module.exports = duplicateLogicDetector

