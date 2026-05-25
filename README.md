# CODARA — AI-Powered Code Analysis Platform

> Paste a snippet, drop a GitHub URL, or upload a ZIP — and CODARA gives you a full breakdown of your code in seconds.

🔗 **Live Demo:** [thecodara.vercel.app](https://thecodara.vercel.app)

---

## Features

- 📖 **Code Explanation** — Explains your code at Beginner, Intermediate, and Advanced levels
- 🏗️ **Architecture Map** — Maps project structure, folder tree, and detected design patterns
- 🐛 **Issue Detection** — Finds bugs, deep nesting, unused imports, duplicate logic, and long functions
- 🎯 **Interview Prep** — Generates interview questions based on your actual code
- 🗺️ **Learning Roadmap** — Builds a personalized roadmap from your code weaknesses
- 📊 **GitHub Repo Analysis** — Analyzes entire repositories, not just snippets
- 📁 **ZIP Upload** — Upload your project as a ZIP for full analysis

---

## Tech Stack

**Frontend**
- React + Vite
- React Router
- CSS Variables + Custom Design System

**Backend**
- Node.js + Express
- Groq API (LLaMA 3.3 70B) — primary AI
- Google Gemini 2.0 Flash — automatic fallback
- GitHub API — repo fetching via ZIP archive
- Multer — ZIP upload handling
- Custom static analysis engine (no third-party linters)

**Deployment**
- Frontend → Vercel
- Backend → Render

---

## How It Works

```
User Input (snippet / GitHub URL / ZIP)
        ↓
  Input Validation
        ↓
  Static Analysis Engine
  (detects issues across 4 rule categories)
        ↓
  AI Enrichment (parallel)
  ├── Explanation Generator (3 modes)
  ├── Interview Question Generator
  └── Learning Roadmap Generator
        ↓
  Results Page (6 tabs)
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Groq API key → [console.groq.com](https://console.groq.com)
- Google Gemini API key → [aistudio.google.com](https://aistudio.google.com)
- GitHub Personal Access Token → [github.com/settings/tokens](https://github.com/settings/tokens)

### Clone the repo

```bash
git clone https://github.com/UjjwalShreyas/CODARA.git
cd CODARA
```

### Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token
```

Start the backend:

```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
codara/
├── backend/
│   └── src/
│       ├── api/
│       │   ├── routes/         # analyze.js, github.js, upload.js
│       │   └── middleware/     # validation.js, auth.js
│       ├── services/
│       │   ├── aiEnricher/     # Groq + Gemini AI clients, generators
│       │   ├── analyzer/       # Static analysis engine + rules
│       │   ├── github/         # Repo fetcher, file filter
│       │   └── fileProcessor/  # ZIP extractor, validator
│       ├── config/             # env.js, constants.js
│       └── utils/              # logger, errorHandler, validators
└── frontend/
    └── src/
        ├── components/
        │   ├── InputModes/     # SnippetInput, GitHubInput, ZipUpload
        │   ├── Results/        # 6 result tab components
        │   └── shared/         # Card, Loading, Tabs, etc.
        ├── pages/              # Home, Analyze, Results
        ├── services/           # api.js
        └── styles/             # CSS design system
```

---

## Static Analysis Rules

CODARA's custom static analysis engine detects:

| Rule | Description |
|------|-------------|
| Long Functions | Functions exceeding recommended line count |
| Deep Nesting | Code nested more than 3 levels deep |
| Unused Imports | Imported modules never referenced |
| Duplicate Logic | Repeated code blocks that should be abstracted |

---

## AI Fallback System

CODARA uses a two-tier AI system:

```
Request → Groq (LLaMA 3.3 70B)
              ↓ (if rate limited or fails)
         Gemini 2.0 Flash
              ↓ (if both fail)
         Friendly error message with retry time
```

---

## Deployment

### Backend (Render)
- Connect GitHub repo to Render
- Set root directory to `backend`
- Add environment variables in Render dashboard
- Build command: `npm install`
- Start command: `npm start`

### Frontend (Vercel)
- Connect GitHub repo to Vercel
- Set root directory to `frontend`
- Add `VITE_API_URL=https://your-render-url.onrender.com/api`
- Framework preset: Vite

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | `development` or `production` |
| `GROQ_API_KEY` | Groq API key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GITHUB_TOKEN` | GitHub personal access token |
| `FRONTEND_URL` | Production frontend URL (for CORS) |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## License

MIT

---

Built with by [Ujjwal Shreyas](https://github.com/UjjwalShreyas)
