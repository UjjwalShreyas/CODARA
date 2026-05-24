const logger = require('../../utils/logger')
const prompts = require('./prompts')
const aiClient = require('./aiClient')

class ExplanationGenerator {
  async generateForMode(code, language, mode, repoName = '', folderTree = '') {
    logger.log(`Generating ${mode} explanation`)
    try {
      const prompt = prompts.explainCode(code, language, mode, repoName, folderTree)
      logger.debug(`Prompt length: ${prompt.length}`)
      const text = await aiClient.generate(prompt)
      logger.success(`${mode} explanation done — length: ${text.length}`)
      return text
    } catch (error) {
      logger.error(`${mode} explanation FAILED — ${error.message}`, error)
      return `Could not generate ${mode} explanation.`
    }
  }

  async generateAll(code, language, repoName = '', folderTree = '') {
    logger.log('Generating explanations for beginner, intermediate, and advanced modes')
    
    // Attempt to generate all three modes in a single JSON request to save API calls and tokens
    try {
      const prompt = prompts.explainCodeAllModes(code, language, repoName, folderTree)
      logger.debug(`Prompt length: ${prompt.length}`)
      const response = await aiClient.generateJSON(prompt)
      
      const beginner = response.beginner || response.explanationBeginner
      const intermediate = response.intermediate || response.explanationIntermediate
      const advanced = response.advanced || response.explanationAdvanced
      
      if (beginner && intermediate && advanced) {
        logger.success('All explanations generated successfully in single AI request')
        return {
          explanationBeginner: beginner,
          explanationIntermediate: intermediate,
          explanationAdvanced: advanced
        }
      }
      logger.warn('Single AI request returned incomplete JSON, falling back to sequential generation')
    } catch (err) {
      logger.warn(`Single AI request explanation failed: ${err.message}. Falling back to sequential generation...`)
    }

    // Fallback: Generate each mode sequentially to prevent concurrent rate limits
    try {
      logger.log('Running fallback sequential explanation generation')
      const beginner = await this.generateForMode(code, language, 'beginner', repoName, folderTree)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const intermediate = await this.generateForMode(code, language, 'intermediate', repoName, folderTree)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const advanced = await this.generateForMode(code, language, 'advanced', repoName, folderTree)
      
      return {
        explanationBeginner: beginner,
        explanationIntermediate: intermediate,
        explanationAdvanced: advanced
      }
    } catch (error) {
      logger.error('generateAll sequential fallback failed', error.message)
      return {
        explanationBeginner: 'Error generating explanation.',
        explanationIntermediate: 'Error generating explanation.',
        explanationAdvanced: 'Error generating explanation.'
      }
    }
  }
}

module.exports = ExplanationGenerator