require('dotenv').config()
const aiClient = require('./services/aiEnricher/aiClient')

async function test() {
  console.log('Testing Gemini connection...')

  try {
    const response = await aiClient.generate(
      'Explain what this JavaScript code does in 2 sentences: function add(a, b) { return a + b; }'
    )
    console.log('✅ Gemini is working!')
    console.log('Response:', response)
  } catch (error) {
    console.error('❌ Gemini failed:', error.message)
  }
}

test()