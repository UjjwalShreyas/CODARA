const express = require('express')
const { asyncHandler } = require('../../utils/errorHandler')
const { validateGithubInput } = require('../middleware/validation')
const repoFetcher = require('../../services/github/repoFetcher')
const fileFilter = require('../../services/github/fileFilter')
const StaticAnalyzer = require('../../services/analyzer/staticAnalyzer')
const ExplanationGenerator = require('../../services/aiEnricher/explanationGenerator')
const InterviewQuestionGenerator = require('../../services/aiEnricher/interviewQuestionGenerator')
const LearningRoadmapGenerator = require('../../services/aiEnricher/learningRoadmapGenerator')
const languageDetector = require('../../services/codeParser/languageDetector')
const logger = require('../../utils/logger')

const router = express.Router()

router.post('/analyze', validateGithubInput, asyncHandler(async (req, res) => {
  const { repoUrl } = req.body

  const urlParts = repoUrl.replace(/\/$/, '').split('/')
  const owner = urlParts[urlParts.length - 2]
  const repo = urlParts[urlParts.length - 1]

  logger.log(`Analyzing GitHub repo: ${owner}/${repo}`)

  // Step 1: Fetch all files
  const allFiles = await repoFetcher.fetchRepoFiles(owner, repo)
  logger.success(`Fetched ${allFiles.length} files`)

  // Step 2: Filter
  const filteredFiles = fileFilter.filterFiles(allFiles)
  logger.success(`Filtered to ${filteredFiles.length} relevant files`)

  // Step 3: Build folder tree
  const folderTree = buildFolderTree(filteredFiles)

  // Step 4: Detect tech stack
  const techStack = detectTechStack(filteredFiles)

  // Step 5: Count stats
  const stats = countStats(filteredFiles)

  // Step 6: Static analysis
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

  // Step 7: Build repo summary for AI
  const repoSummary = {
    owner,
    repo,
    techStack,
    fileCount: stats.fileCount,
    folderCount: stats.folderCount,
    componentCount: stats.componentCount,
    routeCount: stats.routeCount,
    issues: allIssues.slice(0, 10).map(i => i.title),
    topFiles: codeFiles.slice(0, 5).map(f => f.path)
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

  // Step 9: AI enrichment with rate limit handling (sequential with short delays to prevent rate limits)
  try {
    const explanations = await explanationGen.generateAll(combinedCode, detectedLang, `${owner}/${repo}`, folderTree)
    await new Promise(resolve => setTimeout(resolve, 500))

    const questions = await interviewGen.generate(combinedCode, detectedLang)
    await new Promise(resolve => setTimeout(resolve, 500))

    const roadmap = await roadmapGen.generate(allIssues, techStack)
    await new Promise(resolve => setTimeout(resolve, 500))

    const archExplanation = await generateArchitectureExplanation(repoSummary, folderTree)

    logger.success('GitHub repo analysis complete')

    res.json({
      success: true,
      data: {
        type: 'github',
        owner,
        repo,
        url: repoUrl,
        timestamp: new Date().toISOString(),

        fileCount: stats.fileCount,
        folderCount: stats.folderCount,
        componentCount: stats.componentCount,
        routeCount: stats.routeCount,

        techStack,
        architecture: detectArchitecture(filteredFiles),
        architectureExplanation: archExplanation,
        folderTree,
        patterns: detectPatterns(filteredFiles),

        issues: allIssues.slice(0, 20),
        issueCount: allIssues.length,

        explanationBeginner: explanations.explanationBeginner,
        explanationIntermediate: explanations.explanationIntermediate,
        explanationAdvanced: explanations.explanationAdvanced,

        interviewQuestions: questions,

        weaknesses: roadmap.weaknesses || [],
        learningRoadmap: roadmap.learningRoadmap || [],
        nextSteps: roadmap.nextSteps || ''
      }
    })
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

// ─── Helper Functions ────────────────────────────────────────────

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
  if (fileNames.some(f => f.endsWith('.rs'))) stack.add('Rust')
  if (fileNames.some(f => f.endsWith('.c') || f.endsWith('.cpp') || f.endsWith('.h'))) stack.add('C/C++')
  if (fileNames.some(f => f.endsWith('.cs'))) stack.add('C#')
  if (fileNames.some(f => f.endsWith('.vue'))) stack.add('Vue')
  if (fileNames.some(f => f.endsWith('.svelte'))) stack.add('Svelte')
  if (fileNames.some(f => f.includes('next.config'))) stack.add('Next.js')
  if (fileNames.some(f => f.includes('vite.config'))) stack.add('Vite')
  if (fileNames.some(f => f.includes('angular.json'))) stack.add('Angular')
  if (fileNames.some(f => f.includes('django') || f.includes('settings.py'))) stack.add('Django')
  if (fileNames.some(f => f.includes('requirements.txt'))) stack.add('Python')
  if (fileNames.some(f => f.includes('package.json'))) stack.add('Node.js')
  if (fileNames.some(f => f.includes('tailwind.config'))) stack.add('Tailwind CSS')
  if (allContent.includes('express')) stack.add('Express')
  if (allContent.includes('mongoose') || allContent.includes('mongodb')) stack.add('MongoDB')
  if (allContent.includes('prisma')) stack.add('Prisma')
  if (allContent.includes('redux')) stack.add('Redux')

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
  if (paths.some(p => p.includes('controller') || p.includes('model') || p.includes('view'))) return 'MVC (Model-View-Controller)'
  if (paths.some(p => p.includes('frontend') || p.includes('backend') || p.includes('client') || p.includes('server'))) return 'Client-Server'
  return 'Monolith'
}

function detectPatterns(files) {
  const patterns = []
  const paths = files.map(f => f.path.toLowerCase())
  if (paths.some(p => p.includes('controller'))) patterns.push('MVC Pattern')
  if (paths.some(p => p.includes('repository') || p.includes('repo'))) patterns.push('Repository Pattern')
  if (paths.some(p => p.includes('middleware'))) patterns.push('Middleware Pattern')
  if (paths.some(p => p.includes('context') || p.includes('provider'))) patterns.push('Context/Provider Pattern')
  if (paths.some(p => p.includes('hook'))) patterns.push('Custom Hooks Pattern')
  if (paths.some(p => p.includes('service'))) patterns.push('Service Layer Pattern')
  if (paths.some(p => p.includes('store') || p.includes('redux') || p.includes('zustand'))) patterns.push('State Management Pattern')
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

async function generateArchitectureExplanation(summary, folderTree) {
  const aiClient = require('../../services/aiEnricher/aiClient')
  const prompt = `
You are a senior software architect. Analyze this repository summary and explain the architecture.

Repository: ${summary.owner}/${summary.repo}
Tech Stack: ${summary.techStack.join(', ')}
Files: ${summary.fileCount}, Folders: ${summary.folderCount}
Components: ${summary.componentCount}, Routes: ${summary.routeCount}
Issues detected: ${summary.issues.join(', ')}

Folder structure:
${folderTree}

In 3-4 sentences, explain:
1. What kind of project this is
2. How it's structured
3. Any notable architectural decisions
4. One suggestion for improvement

Keep it concise and technical. Plain text only, no markdown.
`
  try {
    return await aiClient.generate(prompt)
  } catch (e) {
    return 'Architecture analysis could not be generated.'
  }
}

module.exports = router