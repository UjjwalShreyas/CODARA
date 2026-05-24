const logger = require('../../utils/logger')
const prompts = require('./prompts')
const aiClient = require('./aiClient')

class InterviewQuestionGenerator {
  async generate(code, language) {
    logger.log('Generating interview questions')
    try {
      const prompt = prompts.generateInterviewQuestions(code, language)
      const result = await aiClient.generateJSON(prompt)

      let questions = []

      if (Array.isArray(result)) {
        questions = result
      } else if (result.questions && Array.isArray(result.questions)) {
        questions = result.questions
      } else if (result.raw) {
        logger.warn('Got raw response, using fallback')
        questions = this.fallback()
      }

      logger.success(`Generated ${questions.length} questions`)
      return questions
    } catch (error) {
      logger.error('Interview questions failed', error.message)
      return this.fallback()
    }
  }

  fallback() {
    return [
      {
        question: 'What does this code do?',
        answer: 'Unable to generate analysis at this time.',
        followUp: 'Can you walk through the logic?'
      }
    ]
  }
}

module.exports = InterviewQuestionGenerator