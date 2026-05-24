# CODARA - AI Code Analysis Platform

**Upload code. Get brutal clarity.**

An AI + static-analysis developer assistant that analyzes code snippets or entire repositories and explains what's happening, what's broken, and how to improve it.

## Features

- 🔍 **Code Explanation** - Understand code at beginner, intermediate, or advanced level
- 🐛 **Bug Detection** - Static analysis + AI finds potential issues
-  **Architecture Analysis** - See tech stack, patterns, folder structure
-  **Interview Prep** - Questions an interviewer would ask about your code
- 📚 **Learning Roadmap** - Personalized suggestions on what to learn next
- ⚡ **Optimization Tips** - Make code faster, cleaner, more maintainable

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone/navigate to project
cd codara

# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install

# Setup environment files
cd ../backend && cp .env.example .env
cd ../frontend && cp .env.example .env
```

### Development

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

## Project Structure
codara/
├── backend/          # Express API + analyzers
│   ├── src/
│   │   ├── api/      # Routes & middleware
│   │   ├── services/ # Business logic
│   │   ├── config/   # Settings
│   │   └── utils/    # Helpers
│   └── package.json
│
├── frontend/         # React + Vite
│   ├── src/
│   │   ├── pages/    # Route pages
│   │   ├── components/
│   │   ├── services/ # API client
│   │   ├── hooks/    # Custom hooks
│   │   └── styles/   # CSS
│   └── package.json
│
└── README.md

## API Endpoints

### Code Analysis
- `POST /api/analyze` - Analyze code snippet
- `POST /api/github/analyze` - Analyze GitHub repo
- `POST /api/upload` - Upload and analyze ZIP

### Health
- `GET /api/health` - Service status

## TODO (MVP)

- [ ] Integrate AI API (Gemini/Groq)
- [ ] Complete static analyzers
- [ ] GitHub repo fetching
- [ ] ZIP extraction pipeline
- [ ] Architecture visualization
- [ ] Database for upload tracking
- [ ] Add tests
- [ ] Deploy to production

## Tech Stack

**Backend:**
- Node.js + Express
- Octokit (GitHub API)
- Custom static analyzers

**Frontend:**
- React 18
- Vite
- React Router

**AI:**
- Gemini API / Groq (for generation)

## License

MIT

## Author

Built by Myself