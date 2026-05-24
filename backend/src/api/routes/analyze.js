const express = require('express')
const { asyncHandler } = require('../../utils/errorHandler')
const { validateSnippetInput } = require('../middleware/validation')
const StaticAnalyzer = require('../../services/analyzer/staticAnalyzer')
const ExplanationGenerator = require('../../services/aiEnricher/explanationGenerator')
const InterviewQuestionGenerator = require('../../services/aiEnricher/interviewQuestionGenerator')
const LearningRoadmapGenerator = require('../../services/aiEnricher/learningRoadmapGenerator')
const logger = require('../../utils/logger')

const router = express.Router()

// ── Code legitimacy checker ──────────────────────────────────────
function isLikelyCode(code, language) {
  const trimmed = code.trim()

  // Too short to be real code
  if (trimmed.length < 10) return false

  // Score based on code indicators
  let score = 0

  const codePatterns = {
    javascript: [
      /function\s+\w+\s*\(/,
      /const\s+\w+\s*=/,
      /let\s+\w+\s*=/,
      /var\s+\w+\s*=/,
      /=>\s*[{(]/,
      /if\s*\(.*\)/,
      /for\s*\(.*\)/,
      /while\s*\(.*\)/,
      /return\s+.+/,
      /console\.\w+\(/,
      /class\s+\w+/,
      /import\s+.*from/,
      /require\s*\(/,
      /\.map\(|\.filter\(|\.reduce\(/,
      /async\s+function|await\s+/,
      /\w+\s*\(.*\)\s*{/,
      /;\s*$/m,
    ],
    typescript: [
      /:\s*(string|number|boolean|void|any|never)/,
      /interface\s+\w+/,
      /type\s+\w+\s*=/,
      /function\s+\w+\s*\(/,
      /const\s+\w+\s*:/,
      /class\s+\w+/,
      /import\s+.*from/,
    ],
    python: [
      /def\s+\w+\s*\(/,
      /class\s+\w+/,
      /import\s+\w+/,
      /from\s+\w+\s+import/,
      /if\s+.+:/,
      /for\s+\w+\s+in\s+/,
      /while\s+.+:/,
      /print\s*\(/,
      /return\s+.+/,
      /=\s*\[|=\s*\{|=\s*\(/,
      /^\s{4}|\t/m,
    ],
    java: [
      /public\s+(class|static|void|int|String)/,
      /private\s+\w+/,
      /System\.out\.print/,
      /class\s+\w+\s*{/,
      /void\s+\w+\s*\(/,
      /new\s+\w+\s*\(/,
    ]
  }

  // Generic code patterns that work for any language
  const genericPatterns = [
    /[{}()[\];]/,           // brackets and semicolons
    /\w+\s*\(.*\)/,         // function calls
    /=\s*[^=]/,             // assignments
    /\/\/|\/\*|#\s/,        // comments
    /\w+\.\w+/,             // dot notation
    /"[^"]*"|'[^']*'|`[^`]*`/, // strings
    /\d+/,                  // numbers
    /\+|-|\*|\/|%|&&|\|\|/, // operators
  ]

  // Check language specific patterns
  const langPatterns = codePatterns[language] || []
  for (const pattern of langPatterns) {
    if (pattern.test(trimmed)) score += 2
  }

  // Check generic patterns
  for (const pattern of genericPatterns) {
    if (pattern.test(trimmed)) score += 1
  }

  // Random word gibberish detection
  const words = trimmed.split(/\s+/)
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length
  const hasOnlyLongRandomWords = words.every(w => w.length > 8 && !/[{}()[\];.,]/.test(w))

  // If it looks like random words with no code symbols at all
  const hasAnyCodeSymbol = /[{}()[\];=+\-*/<>!&|]/.test(trimmed)
  if (!hasAnyCodeSymbol && words.length > 3) return false

  // Check ratio of non-alphanumeric characters (code has lots of symbols)
  const symbolCount = (trimmed.match(/[{}()[\];=+\-*/<>!&|.,]/g) || []).length
  const symbolRatio = symbolCount / trimmed.length

  // Pure text has almost no symbols, code has at least 5%
  if (trimmed.length > 30 && symbolRatio < 0.03 && score < 3) return false

  logger.debug(`Code validation score: ${score}, symbolRatio: ${symbolRatio.toFixed(2)}`)

  return score >= 2
}

// ── Route ────────────────────────────────────────────────────────
router.post('/', validateSnippetInput, asyncHandler(async (req, res) => {
  const { code, language } = req.body

  logger.log('Starting full analysis', { language, codeLength: code.length })

  // Validate it's actually code
  if (!isLikelyCode(code, language)) {
    return res.status(400).json({
      success: false,
      error: 'This doesn\'t look like valid code. Please paste actual code to analyze.',
      code: 'INVALID_CODE'
    })
  }

  // Step 1: Static analysis
  const analyzer = new StaticAnalyzer(language)
  const staticResults = analyzer.analyze(code)
  logger.success(`Static analysis done — ${staticResults.issueCount} issues found`)

  // Step 2: AI enrichment (sequential with short delays to prevent rate limits)
  const explanationGen = new ExplanationGenerator()
  const interviewGen = new InterviewQuestionGenerator()
  const roadmapGen = new LearningRoadmapGenerator()

  try {
    const explanations = await explanationGen.generateAll(code, language)
    await new Promise(resolve => setTimeout(resolve, 500))

    const questions = await interviewGen.generate(code, language)
    await new Promise(resolve => setTimeout(resolve, 500))

    const roadmap = await roadmapGen.generate(staticResults.issues, [language])

    const response = {
      type: 'snippet',
      language,
      codeLength: code.length,
      timestamp: new Date().toISOString(),

      explanationBeginner: explanations.explanationBeginner,
      explanationIntermediate: explanations.explanationIntermediate,
      explanationAdvanced: explanations.explanationAdvanced,

      complexity: {
        time: 'O(n)',
        space: 'O(1)'
      },

      issues: staticResults.issues,
      issueCount: staticResults.issueCount,

      interviewQuestions: questions,

      weaknesses: roadmap.weaknesses || [],
      learningRoadmap: roadmap.learningRoadmap || [],
      nextSteps: roadmap.nextSteps || '',

      techStack: [language],
      architecture: 'Single file / Code snippet',
      architectureExplanation: 'This is a standalone code snippet, not a full project.',
      folderTree: 'N/A — snippet analysis',
      patterns: [],
      fileCount: 1,
      folderCount: 0,
      componentCount: 0,
      routeCount: 0
    }

    logger.success('Full analysis complete')
    return res.json({ success: true, data: response })

  } catch (aiError) {
    if (aiError.isRateLimit) {
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMITED',
        message: `AI services are temporarily busy. Please try again in ${aiError.retryTime}.`,
        retryTime: aiError.retryTime
      })
    }
    throw aiError
  }
}))

module.exports = router