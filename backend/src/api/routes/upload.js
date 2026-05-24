const express = require('express')
const multer = require('multer')
const path = require('path')
const os = require('os')
const { asyncHandler } = require('../../utils/errorHandler')
const zipExtractor = require('../../services/fileProcessor/zipExtractor')
const fileFilter = require('../../services/github/fileFilter')
const StaticAnalyzer = require('../../services/analyzer/staticAnalyzer')
const ExplanationGenerator = require('../../services/aiEnricher/explanationGenerator')
const InterviewQuestionGenerator = require('../../services/aiEnricher/interviewQuestionGenerator')
const LearningRoadmapGenerator = require('../../services/aiEnricher/learningRoadmapGenerator')
const languageDetector = require('../../services/codeParser/languageDetector')
const logger = require('../../utils/logger')

const router = express.Router()

// Multer config — store in temp folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir())
  },
  filename: (req, file, cb) => {
    cb(null, `codara_upload_${Date.now()}.zip`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/zip' ||
      file.mimetype === 'application/x-zip-compressed' ||
      file.originalname.endsWith('.zip')
    ) {
      cb(null, true)
    } else {
      cb(new Error('Only ZIP files allowed'), false)
    }
  }
})

// POST /api/upload
router.post('/', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }

  const zipPath = req.file.path
  const extractTo = path.join(os.tmpdir(), `codara_ext_${Date.now()}`)

  logger.log('ZIP upload received', { size: req.file.size, zipPath })

  try {
    // Step 1: Extract ZIP
    await zipExtractor.extractZip(zipPath, extractTo)
    logger.success('ZIP extracted')

    // Step 2: Read all files
    const allFiles = await zipExtractor.readAllFiles(extractTo)
    logger.success(`Read ${allFiles.length} files from ZIP`)

    // Step 3: Filter files
    const filteredFiles = fileFilter.filterFiles(allFiles)
    logger.success(`Filtered to ${filteredFiles.length} files`)

    // Step 4: Build folder tree
    const folderTree = buildFolderTree(filteredFiles)

    // Step 5: Detect tech stack
    const techStack = detectTechStack(filteredFiles)

    // Step 6: Count stats
    const stats = countStats(filteredFiles)

    // Step 7: Static analysis
    const allIssues = []
    let codeFiles = filteredFiles
      .filter(f => isCoreCodeFile(f.path))
      .sort((a, b) => getFileImportanceScore(b.path) - getFileImportanceScore(a.path))
      .slice(0, 8)

    // Fallback if no core files found
    if (codeFiles.length === 0) {
      codeFiles = filteredFiles.filter(f => isCodeFile(f.path)).slice(0, 20)
    }

    for (const file of codeFiles) {
      try {
        const lang = languageDetector.detect(file.content)
        if (lang === 'unknown') continue
        const analyzer = new StaticAnalyzer(lang)
        const result = analyzer.analyze(file.content)
        allIssues.push(...result.issues.map(issue => ({
          ...issue,
          file: file.path
        })))
      } catch (e) {
        logger.warn(`Static analysis failed for ${file.path}`)
      }
    }

    // Step 8: Combined code sample for AI
    const MAX_TOTAL_LENGTH = 5000;
    let currentLength = 0;
    const combinedCodeArr = [];
    
    for (const f of codeFiles) {
      if (currentLength >= MAX_TOTAL_LENGTH) break;
      let content = f.content || '';
      const remaining = MAX_TOTAL_LENGTH - currentLength;
      if (content.length > remaining) {
        content = content.slice(0, remaining) + '\n...[Content Truncated]...';
      }
      combinedCodeArr.push(`// File: ${f.path}\n${content}`);
      currentLength += content.length;
    }
    const combinedCode = combinedCodeArr.join('\n\n');

    const detectedLang = techStack.length > 0 ? techStack.join(', ') : 'code';

    const explanationGen = new ExplanationGenerator()
    const interviewGen = new InterviewQuestionGenerator()
    const roadmapGen = new LearningRoadmapGenerator()

    const explanations = await explanationGen.generateAll(combinedCode, detectedLang, req.file.originalname, folderTree)
    await new Promise(resolve => setTimeout(resolve, 500))

    const questions = await interviewGen.generate(combinedCode, detectedLang)
    await new Promise(resolve => setTimeout(resolve, 500))

    const roadmap = await roadmapGen.generate(allIssues, techStack)

    logger.success('ZIP analysis complete')

    res.json({
      success: true,
      data: {
        type: 'zip',
        filename: req.file.originalname,
        timestamp: new Date().toISOString(),

        // Stats
        fileCount: stats.fileCount,
        folderCount: stats.folderCount,
        componentCount: stats.componentCount,
        routeCount: stats.routeCount,

        // Tech
        techStack,
        architecture: detectArchitecture(filteredFiles),
        architectureExplanation: 'Analyzed from uploaded ZIP file.',
        folderTree,
        patterns: detectPatterns(filteredFiles),

        // Issues
        issues: allIssues.slice(0, 20),
        issueCount: allIssues.length,

        // AI content
        explanationBeginner: explanations.explanationBeginner,
        explanationIntermediate: explanations.explanationIntermediate,
        explanationAdvanced: explanations.explanationAdvanced,

        // Interview
        interviewQuestions: questions,

        // Roadmap
        weaknesses: roadmap.weaknesses || [],
        learningRoadmap: roadmap.learningRoadmap || [],
        nextSteps: roadmap.nextSteps || ''
      }
    })
  } catch (error) {
    if (error.isRateLimit) {
      return res.status(429).json({
        success: false,
        error: 'RATE_LIMITED',
        message: `AI services are temporarily busy. Please try again in ${error.retryTime}.`,
        retryTime: error.retryTime
      })
    }
    throw error
  } finally {
    // Always clean up extracted files
    try { await zipExtractor.cleanup(extractTo) } catch (_) { /* non-blocking */ }
  }
}))

module.exports = router

// ─── Helper Functions (same as github route) ────────────────────

function buildFolderTree(files) {
  const tree = {}
  for (const file of files) {
    const parts = file.path.split('/')
    let current = tree
    for (const part of parts) {
      if (!current[part]) current[part] = {}
      current = current[part]
    }
  }
  return renderTree(tree, '', 0)
}

function renderTree(node, prefix, depth) {
  if (depth > 4) return ''
  let result = ''
  const entries = Object.keys(node)
  for (let i = 0; i < entries.length; i++) {
    const key = entries[i]
    const isLast = i === entries.length - 1
    result += prefix + (isLast ? '└── ' : '├── ') + key + '\n'
    if (Object.keys(node[key]).length > 0) {
      result += renderTree(node[key], prefix + (isLast ? '    ' : '│   '), depth + 1)
    }
  }
  return result
}

function detectTechStack(files) {
  const stack = new Set()
  const fileNames = files.map(f => f.path.toLowerCase())
  const allContent = files.slice(0, 10).map(f => f.content || '').join('\n')

  if (fileNames.some(f => f.endsWith('.tsx') || f.endsWith('.jsx'))) stack.add('React')
  if (fileNames.some(f => f.endsWith('.ts') || f.endsWith('.tsx'))) stack.add('TypeScript')
  if (fileNames.some(f => f.endsWith('.py'))) stack.add('Python')
  if (fileNames.some(f => f.endsWith('.java'))) stack.add('Java')
  if (fileNames.some(f => f.endsWith('.go'))) stack.add('Go')
  if (fileNames.some(f => f.endsWith('.c') || f.endsWith('.cpp') || f.endsWith('.h'))) stack.add('C/C++')
  if (fileNames.some(f => f.endsWith('.cs'))) stack.add('C#')
  if (fileNames.some(f => f.endsWith('.rs'))) stack.add('Rust')
  if (fileNames.some(f => f.endsWith('.vue'))) stack.add('Vue')
  if (fileNames.some(f => f.includes('next.config'))) stack.add('Next.js')
  if (fileNames.some(f => f.includes('vite.config'))) stack.add('Vite')
  if (fileNames.some(f => f.includes('tailwind.config'))) stack.add('Tailwind CSS')
  if (fileNames.some(f => f.includes('package.json'))) stack.add('Node.js')
  if (allContent.includes('express')) stack.add('Express')
  if (allContent.includes('mongoose') || allContent.includes('mongodb')) stack.add('MongoDB')
  if (allContent.includes('redux')) stack.add('Redux')
  if (allContent.includes('prisma')) stack.add('Prisma')

  return [...stack]
}

function countStats(files) {
  const folders = new Set()
  let componentCount = 0
  let routeCount = 0

  for (const file of files) {
    const parts = file.path.split('/')
    if (parts.length > 1) folders.add(parts.slice(0, -1).join('/'))
    const lower = file.path.toLowerCase()
    if (lower.includes('component') || lower.endsWith('.jsx') || lower.endsWith('.tsx')) componentCount++
    if (lower.includes('route') || lower.includes('router') || lower.includes('controller')) routeCount++
  }

  return { fileCount: files.length, folderCount: folders.size, componentCount, routeCount }
}

function detectArchitecture(files) {
  const paths = files.map(f => f.path.toLowerCase())
  if (paths.some(p => p.includes('microservice'))) return 'Microservices'
  if (paths.some(p => p.includes('controller') || p.includes('model'))) return 'MVC'
  if (paths.some(p => p.includes('frontend') || p.includes('backend'))) return 'Client-Server'
  return 'Monolith'
}

function detectPatterns(files) {
  const patterns = []
  const paths = files.map(f => f.path.toLowerCase())
  if (paths.some(p => p.includes('controller'))) patterns.push('MVC Pattern')
  if (paths.some(p => p.includes('middleware'))) patterns.push('Middleware Pattern')
  if (paths.some(p => p.includes('hook'))) patterns.push('Custom Hooks Pattern')
  if (paths.some(p => p.includes('service'))) patterns.push('Service Layer Pattern')
  if (paths.some(p => p.includes('store') || p.includes('redux'))) patterns.push('State Management Pattern')
  return patterns
}

function isCodeFile(filePath) {
  return /\.(js|jsx|ts|tsx|py|java|go|rs|cpp|c|cs)$/.test(filePath)
}

function isCoreCodeFile(filePath) {
  if (!isCodeFile(filePath)) return false;
  
  const fileName = filePath.split('/').pop().toLowerCase();
  
  // Ignore configuration/boilerplate files
  const configFiles = [
    'tailwind.config', 'vite.config', 'postcss.config', 'webpack.config',
    'next.config', 'nuxt.config', 'svelte.config', 'gatsby-config',
    'eslint.config', 'prettier.config', 'jest.config', 'babel.config',
    'tsconfig', 'jsconfig', 'package', 'package-lock', 'yarn', 'pnpm-lock'
  ];
  
  if (configFiles.some(cfg => fileName.startsWith(cfg))) {
    return false;
  }
  
  // Ignore hidden configuration files
  if (fileName.startsWith('.')) {
    return false;
  }
  
  // Ignore test files
  if (fileName.includes('.test.') || fileName.includes('.spec.') || fileName.includes('test-') || fileName.includes('-test')) {
    return false;
  }
  
  return true;
}

function getFileImportanceScore(filePath) {
  const lowerPath = filePath.toLowerCase();
  let score = 0;
  
  // Prioritize files in source directories
  if (lowerPath.includes('src/') || lowerPath.includes('app/') || lowerPath.includes('lib/')) {
    score += 10;
  }
  
  // Prioritize core components, routers, controllers, models, views
  if (lowerPath.includes('component')) score += 5;
  if (lowerPath.includes('route') || lowerPath.includes('router') || lowerPath.includes('api/')) score += 5;
  if (lowerPath.includes('controller')) score += 5;
  if (lowerPath.includes('model') || lowerPath.includes('service')) score += 4;
  if (lowerPath.includes('view') || lowerPath.includes('page')) score += 4;
  
  // De-prioritize files in config, setup, scripts, or assets folders
  if (lowerPath.includes('config/') || lowerPath.includes('setup/')) score -= 5;
  if (lowerPath.includes('script/') || lowerPath.includes('scripts/')) score -= 5;
  if (lowerPath.includes('asset/') || lowerPath.includes('assets/')) score -= 5;
  
  return score;
}