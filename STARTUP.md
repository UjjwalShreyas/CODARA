# CODARA Startup Guide

## First Time Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Edit .env with your keys
# - GITHUB_TOKEN: Get from https://github.com/settings/tokens
# - GEMINI_API_KEY: Get from https://ai.google.dev
# - GROQ_API_KEY: Get from https://console.groq.com
```

### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env
```

### 3. Start Development

**Window 1:**
```bash
cd backend
npm run dev
```

**Window 2:**
```bash
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

## Debugging

### Backend
- Logs appear in terminal where `npm run dev` is running
- Check `src/utils/logger.js` for log methods
- nodemon auto-restarts on file changes

### Frontend
- Vite dev server hot-reloads instantly
- Check browser console for errors
- React DevTools for component inspection

## API Testing

Use curl or Postman:

```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function add(a, b) { return a + b; }",
    "language": "javascript"
  }'
```

## Next Steps

1. Get API keys (GitHub, Gemini/Groq)
2. Implement actual AI calls in `aiEnricher/` services
3. Test each input mode (snippet, GitHub, ZIP)
4. Build out static analyzers
5. Deploy