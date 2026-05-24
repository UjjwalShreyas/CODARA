# CODARA Architecture

## System Flow
User Input
↓
Frontend (React + Vite)
↓
API Layer (Express Routes)
↓
Validation Middleware
↓
Service Layer
├── Static Analyzer (detectors)
├── Code Parser (language detection)
├── GitHub Fetcher (repo analysis)
├── File Processor (ZIP extraction)
└── AI Enricher (Gemini/Groq)
↓
Response JSON
↓
Results Page (tabbed interface)

## Backend Services

### Static Analyzer
- Detects: long functions, deep nesting, unused imports, duplicate logic
- Language-agnostic rules engine
- Returns issues with severity levels

### Code Parser
- Auto-detects language (JS, Python, Java, etc.)
- Prepares code for analysis
- Handles syntax validation

### GitHub Service
- Fetches repo via Octokit API
- Builds file tree
- Filters ignored files/folders
- Extracts metadata

### AI Enrichment
- Generates explanations (beginner/intermediate/advanced)
- Creates interview questions
- Builds learning roadmap
- Uses Gemini or Groq API

### File Processor
- Extracts ZIP files safely
- Validates file counts/sizes
- Cleans up temporary files

## Frontend Components

### Pages
- **Home** - Marketing + features overview
- **Analyze** - Input modes (snippet/GitHub/ZIP)
- **Results** - Tabbed analysis display

### Tabs
- Overview - Tech stack, stats
- Architecture - Folder structure, patterns
- Issues - Code quality problems
- Explanation - AI-generated explainer
- Interview Prep - Questions + answers
- Learning Path - Personalized roadmap

## Data Flow
Input Data
↓
Validation
↓
Static Analysis
↓
AI Generation (parallel)
├── Explanations
├── Interview Questions
└── Learning Roadmap
↓
Aggregated Response
↓
Frontend Display

## Error Handling

- Custom AppError class with status codes
- Async try-catch wrapper (asyncHandler)
- Middleware error handler
- User-friendly error messages

## Logging

- Development mode: verbose logging
- Production mode: errors only
- Log levels: log, error, warn, success, debug

## Rate Limiting

- Basic IP-based rate limiter in auth middleware
- 100 requests per minute per IP
- Extendable for API key-based limits

## Caching Opportunities

1. Static analysis results
2. AI-generated content
3. GitHub repo metadata
4. Folder tree structures

## Security Considerations

1. Input validation on all endpoints
2. File size limits
3. Ignore patterns (node_modules, etc.)
4. Safe ZIP extraction
5. API key management via .env
6. CORS enabled for localhost dev