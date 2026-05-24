const unusedImportsDetector = {
name: 'unusedImportsDetector',
detect(code, language) {
const issues = []
if (language !== 'javascript' && language !== 'typescript') {
  return issues
}

const lines = code.split('\n')
const imports = []

// Find all imports
for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  const importMatch = line.match(/import\s+(?:{([^}]*)}|(\w+))\s+from\s+['"]([^'"]+)['"]/);
  
  if (importMatch) {
    const names = importMatch[1] ? importMatch[1].split(',').map(n => n.trim()) : [importMatch[2]]
    imports.push({
      names,
      line: i + 1
    })
  }
}

// Check if imports are used
const codeWithoutImports = lines.filter((_, i) => !lines[i].match(/^import\s+/)).join('\n')

for (const imp of imports) {
  for (const name of imp.names) {
    const wordBoundaryRegex = new RegExp(`\\b${name}\\b`);
    if (name && !wordBoundaryRegex.test(codeWithoutImports)) {
      issues.push({
        title: 'Unused Import',
        description: `Import "${name}" is never used`,
        file: 'code.js',
        line: imp.line,
        severity: 'low',
        suggestion: 'Remove this unused import to keep dependencies clean'
      })
    }
  }
}

return issues
}
}
module.exports = unusedImportsDetector