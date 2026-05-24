const logger = require('../../utils/logger')
const prompts = require('./prompts')
const aiClient = require('./aiClient')

class LearningRoadmapGenerator {
  async generate(issues, techStack) {
    logger.log('Generating learning roadmap')
    try {
      const weaknesses = this.extractWeaknesses(issues)
      const prompt = prompts.generateLearningRoadmap(weaknesses, techStack)
      const result = await aiClient.generateJSON(prompt)

      if (result.raw) {
        logger.warn('Raw response, using default roadmap')
        return this.defaultRoadmap(weaknesses)
      }

      logger.success('Roadmap generated')
      return {
        weaknesses,
        learningRoadmap: result.learningRoadmap || [],
        nextSteps: result.nextSteps || 'Focus on the recommended path above.'
      }
    } catch (error) {
      logger.error('Roadmap failed', error.message)
      return this.defaultRoadmap([])
    }
  }

  extractWeaknesses(issues) {
    const map = {}
    for (const issue of issues) {
      const type = issue.title.toLowerCase()
      map[type] = (map[type] || 0) + 1
    }
    return Object.keys(map)
  }

  defaultRoadmap(weaknesses) {
    return {
      weaknesses,
      learningRoadmap: [
        {
          topic: 'Code Quality',
          description: 'Write cleaner, more maintainable code',
          resources: ['Clean Code by Robert Martin']
        },
        {
          topic: 'Design Patterns',
          description: 'Learn common patterns used in production',
          resources: ['Refactoring by Martin Fowler']
        }
      ],
      nextSteps: 'Start with code quality fundamentals.'
    }
  }
}

module.exports = LearningRoadmapGenerator