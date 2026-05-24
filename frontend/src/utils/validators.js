export const validateCode = (code) => {
  if (!code || typeof code !== 'string') {
    return { valid: false, error: 'Code must be text' }
  }

  if (code.trim().length === 0) {
    return { valid: false, error: 'Code cannot be empty' }
  }

  if (code.length > 100 * 1024) { // 100KB
    return { valid: false, error: 'Code too large (max 100KB)' }
  }

  return { valid: true }
}

export const validateLanguage = (language) => {
  const supported = ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust']
  
  if (!supported.includes(language)) {
    return { valid: false, error: `Language not supported: ${language}` }
  }

  return { valid: true }
}

export const validateGithubUrl = (url) => {
  if (!url) {
    return { valid: false, error: 'URL required' }
  }

  const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+\/?$/

  if (!githubRegex.test(url)) {
    return { valid: false, error: 'Invalid GitHub URL format' }
  }

  return { valid: true }
}

export const validateFile = (file, maxSize = 50 * 1024 * 1024) => {
  if (!file) {
    return { valid: false, error: 'File required' }
  }

  if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
    return { valid: false, error: 'Only ZIP files allowed' }
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large (max ${maxSize / 1024 / 1024}MB)` 
    }
  }

  return { valid: true }
}

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}