const Groq = require('groq-sdk')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const env = require('../../config/env')
const logger = require('../../utils/logger')

const groq = new Groq({ 
  apiKey: env.GROQ_API_KEY,
  timeout: 15000 // 15 seconds
})
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

class AIClient {
  constructor() {
    this.geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  }

  async generateWithGroq(prompt, model = 'llama-3.1-8b-instant') {
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: model,
      max_tokens: 1500
    })
    return completion.choices[0]?.message?.content || ''
  }

  async generateWithGemini(prompt) {
    const result = await this.geminiModel.generateContent(prompt, { requestOptions: { timeout: 15000 } })
    return result.response.text()
  }

  async generate(prompt) {
  try {
    logger.log('Calling Groq API')
    const text = await this.generateWithGroq(prompt)
    logger.success('Groq response received')
    return text
  } catch (groqError) {
    logger.warn(`Groq failed: ${groqError.message}`)
    logger.warn('Falling back to Gemini...')
    try {
      const text = await this.generateWithGemini(prompt)
      logger.success('Gemini fallback response received')
      return text
    } catch (geminiError) {
      const groqRetryMatch = groqError.message?.match(/try again in (\d+m[\d.]+s)/)
      const geminiRetryMatch = geminiError.message?.match(/retry in ([\d.]+s)/)
      const retryTime = groqRetryMatch?.[1] || geminiRetryMatch?.[1] || '10 minutes'

      logger.error('Gemini error: ' + geminiError.message)
      logger.error('Both AI providers rate limited')
      const err = new Error('RATE_LIMITED')
      err.retryTime = retryTime
      err.isRateLimit = true
      throw err
    }
  }
}

  async generateJSON(prompt) {
    logger.log('Calling Groq API (JSON mode)')
    try {
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY raw valid JSON. No markdown. No backticks. No explanation. Just the JSON object.`
      const text = await this.generate(jsonPrompt)
      const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
      try {
        return JSON.parse(cleaned)
      } catch (parseError) {
        logger.warn('Direct JSON parse failed, trying robust extraction')
        const extracted = this.extractJSON(text)
        if (extracted) {
          return extracted
        }
        logger.warn('Robust JSON extraction failed, returning raw object wrapper')
        return { raw: cleaned }
      }
    } catch (error) {
      logger.error('JSON generation failed', error.message)
      throw error
    }
  }

  extractJSON(text) {
    const firstBrace = text.indexOf('{')
    const firstBracket = text.indexOf('[')
    
    let startIdx = -1
    let isObject = true
    
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      startIdx = firstBrace
      isObject = true
    } else if (firstBracket !== -1) {
      startIdx = firstBracket
      isObject = false
    }
    
    if (startIdx !== -1) {
      const searchChar = isObject ? '}' : ']'
      const endIdx = text.lastIndexOf(searchChar)
      if (endIdx !== -1 && endIdx > startIdx) {
        const candidate = text.substring(startIdx, endIdx + 1)
        try {
          return JSON.parse(candidate)
        } catch (e) {
          logger.warn('Extracted JSON block failed to parse: ' + e.message)
        }
      }
    }
    return null
  }
}

module.exports = new AIClient()