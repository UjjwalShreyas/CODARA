# Next Steps for CODARA

## Immediate (MVP Phase)

### Backend
- [ ] Integrate Gemini/Groq API calls
  - Replace placeholder `callAI()` methods
  - Test prompt engineering
  - Handle API errors gracefully

- [ ] Complete static analyzers
  - Test long function detection
  - Refine nesting detection
  - Add more detectors (cyclomatic complexity, naming conventions)

- [ ] GitHub integration
  - Implement repo tree fetching
  - Build folder structure visualization
  - Detect tech stack from files

- [ ] ZIP processing
  - Use `unzipper` or `extract-zip` npm package
  - Safe extraction with path validation
  - File filtering

### Frontend
- [ ] Test all three input modes
- [ ] Error boundary component
- [ ] Loading states + spinners
- [ ] Mobile responsiveness
- [ ] Accessibility (a11y)

### Testing
- [ ] Unit tests for analyzers
- [ ] API endpoint tests
- [ ] E2E tests for full flow

## Phase 2 (Enhancement)

- [ ] Database (MongoDB/PostgreSQL)
  - Store analyses
  - User accounts
  - Saved results

- [ ] Caching layer (Redis)
  - Cache AI responses
  - Quick re-analysis

- [ ] Advanced features
  - Code diff analysis
  - Multi-file comparison
  - Performance profiling

- [ ] UI improvements
  - Dark mode
  - Export as PDF
  - Share results link

## Phase 3 (Scaling)

- [ ] Deploy to production (Vercel/Railway)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring (Sentry)
- [ ] Analytics
- [ ] Marketing site

## API Keys Needed

1. **GitHub**
   - Go to https://github.com/settings/tokens
   - Create "Personal Access Token" (classic)
   - Scopes: `repo`, `public_repo`

2. **Gemini API**
   - Go to https://ai.google.dev
   - Create API key
   - Free tier available

3. **Groq API** (alternative)
   - Go to https://console.groq.com
   - Create API key
   - Faster inference

## Common Issues

### Backend won't start
- Check port 5000 is free: `lsof -i :5000`
- Verify Node version: `node --version`
- Delete node_modules and reinstall

### Frontend can't reach backend
- Check backend is running on 5000
- Check CORS is enabled
- Check .env has correct API_URL

### AI calls failing
- Verify API keys are valid
- Check rate limits
- Test with curl first

## Performance Tips

- Add caching for expensive operations
- Batch AI requests
- Use streaming for large responses
- Implement request debouncing frontend-side

## Resume Points

This project demonstrates:
- Full-stack architecture
- API design & REST patterns
- Static code analysis
- AI integration
- Real-world error handling
- TypeScript (upgrade later)
- Testing practices
- DevOps fundamentals