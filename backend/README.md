# CODARA Backend

AI-powered code analysis engine with static analysis and educational insights.

## Setup

```bash
npm install
```

## Environment

Create `.env` file (copy from `.env.example`):
PORT=5000
NODE_ENV=development
GITHUB_TOKEN=your_github_pat_here
GEMINI_API_KEY=your_key_here
GROQ_API_KEY=your_key_here

## Development

```bash
npm run dev
```

Runs on `http://localhost:5000` with hot reload (nodemon).

## Project Structure

- `src/api/routes/` - Express route handlers
- `src/api/middleware/` - Validation, auth, error handling
- `src/services/` - Business logic (analyzers, AI, file processing)
- `src/config/` - Configuration and constants
- `src/utils/` - Logger, validators, error handler

## API Endpoints

### POST /api/analyze
Analyze a code snippet.

**Request:**
```json
{
  "code": "function factorial(n) { ... }",
  "language": "javascript",
  "type": "snippet"
}
```

### POST /api/github/analyze
Analyze a GitHub repository.

**Request:**
```json
{
  "repoUrl": "https://github.com/user/project"
}
```

### POST /api/upload
Upload and analyze a ZIP file.

## TODO

- [ ] Integrate Gemini/Groq API for AI generation
- [ ] Implement ZIP extraction and analysis
- [ ] Add GitHub repo tree fetching
- [ ] Build architecture visualization
- [ ] Add database for upload tracking
- [ ] Implement caching for repeated analyses
- [ ] Add test suite

## Debug

Enable detailed logging by setting `NODE_ENV=development`.