module.exports = {
  // File size limits
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_ZIP_SIZE: 50 * 1024 * 1024,
  MAX_SNIPPET_SIZE: 100 * 1024, // 100KB

  // File limits
  MAX_FILES_IN_ZIP: 500,
  MAX_FILES_IN_REPO: 1000,

  // Ignore patterns
  IGNORE_FOLDERS: [
    'node_modules',
    'dist',
    'build',
    'coverage',
    '.git',
    '.next',
    '.venv',
    '__pycache__',
    'venv',
    'env'
  ],

  IGNORE_FILES: [
    '.lock',
    '.lockb',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.env',
    '.env.local'
  ],

  IGNORE_EXTENSIONS: [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.ico',
    '.svg',
    '.webp',
    '.mp4',
    '.mp3',
    '.zip',
    '.tar',
    '.gz',
    '.pdf',
    '.doc',
    '.docx'
  ],

  // Supported languages
  SUPPORTED_LANGUAGES: [
    'javascript',
    'typescript',
    'python',
    'java',
    'cpp',
    'go',
    'rust'
  ],

  // Analysis limits
  SNIPPET_COMPLEXITY_LIMIT: 50,
  LONG_FUNCTION_LINES: 50,
  DEEP_NESTING_LEVEL: 4,
  MAX_FUNCTION_PARAMS: 5,

  // API timeouts
  GITHUB_FETCH_TIMEOUT: 30000,
  AI_GENERATION_TIMEOUT: 60000,

  // Response messages
  MESSAGES: {
    SUCCESS: 'Analysis completed successfully',
    ERROR: 'An error occurred during analysis',
    INVALID_INPUT: 'Invalid input provided',
    FILE_TOO_LARGE: 'File size exceeds limit',
    UNSUPPORTED_LANGUAGE: 'Language not supported',
    GITHUB_ERROR: 'Failed to fetch GitHub repository'
  }
}