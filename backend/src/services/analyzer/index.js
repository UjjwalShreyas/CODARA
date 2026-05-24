const StaticAnalyzer = require('./staticAnalyzer')
const ExplanationGenerator = require('../aiEnricher/explanationGenerator')
const InterviewQuestionGenerator = require('../aiEnricher/interviewQuestionGenerator')
const LearningRoadmapGenerator = require('../aiEnricher/learningRoadmapGenerator')
const logger = require('../../utils/logger')

class CodeAnalyzer {
  constructor(aiClient = null) {
    this.staticAnalyzer = null
    this.explanationGen = new ExplanationGenerator(aiClient)
    this.interviewGen = new InterviewQuestionGenerator(aiClient)
    this.roadmapGen = new LearningRoadmapGenerator(aiClient)
  }

  async analyzeSnippet(code, language) {
    logger.log('Starting snippet analysis', { language })

    try {
      // Static analysis
      this.staticAnalyzer = new StaticAnalyzer(language)
      const staticResults = this.staticAnalyzer.analyze(code)

      // AI enrichment (parallel)
      const [explanations, questions, roadmap] = await Promise.all([
        this.explanationGen.generateAll(code, language),
        this.interviewGen.generate(code, language),
        this.roadmapGen.generate(staticResults.issues, [language])
      ])

      logger.success('Snippet analysis complete')

      return {
        type: 'snippet',
        language,
        ...staticResults,
        ...explanations,
        interviewQuestions: questions,
        ...roadmap,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      logger.error('Snippet analysis failed', error)
      throw error
    }
  }

  async analyzeRepository(owner, repo) {
    logger.log('Starting repository analysis', { owner, repo })

    // TODO: Implement repo analysis
    return {
      type: 'repository',
      owner,
      repo,
      timestamp: new Date().toISOString()
    }
  }
}

module.exports = CodeAnalyzer