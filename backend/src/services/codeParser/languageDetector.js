const languageDetector = {
  detect(code) {
    const indicators = {
      javascript: [
        /\bfunction\s+\w+\s*\(|=>|const\s+\w+\s*=|var\s+\w+|import\s+.*from|require\(/,
        /console\.(log|error|warn)|document\.|window\./
      ],
      typescript: [
        /:\s*(string|number|boolean|interface|type|enum|generic)/,
        /interface\s+\w+|type\s+\w+\s*=/
      ],
      python: [
        /^def\s+\w+|^class\s+\w+|^import\s+\w+|^from\s+\w+\s+import/,
        /:\s*$|elif\s|except:/
      ],
      java: [
        /\bpublic\s+(class|interface|void|static)/,
        /\bprivate\s+\w+|System\.out\.println/
      ]
    }

    let scores = {}

    for (const [lang, patterns] of Object.entries(indicators)) {
      scores[lang] = 0
      for (const pattern of patterns) {
        const matches = code.match(pattern)
        scores[lang] += matches ? matches.length : 0
      }
    }

    const detected = Object.keys(scores).reduce((a, b) =>
      scores[a] > scores[b] ? a : b
    )

    return scores[detected] > 0 ? detected : 'unknown'
  }
}

module.exports = languageDetector