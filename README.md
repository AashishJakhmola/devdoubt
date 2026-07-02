# DevDoubt — AI-Powered Angular Development Assistant

> An intelligent doubt resolution tool built specifically for Angular development teams. Junior developers get instant, accurate answers to Angular questions while team leads gain insights into knowledge gaps.

🌐 **Live Demo:** [devdoubt.vercel.app](https://devdoubt.vercel.app)

---

## What is DevDoubt?

DevDoubt solves a real problem I experienced while mentoring interns at a SaaS startup — senior developers lose hours answering the same Angular questions repeatedly. DevDoubt gives junior developers an always-available Angular expert, while quietly building team-level insights for leads to act on.

It's not a generic ChatGPT wrapper. It's a domain-scoped AI assistant that only answers Angular-related questions, maintains conversation context, and formats responses with proper code syntax highlighting — the way a senior developer would actually answer.

---

## Live Demo

🔗 [https://devdoubt.vercel.app](https://devdoubt.vercel.app)

Try asking:
- "Why is my NgRx effect not firing?"
- "How do I implement lazy loading in Angular 20?"
- "What's the difference between NgRx and NGXS?"
- "Explain RxJS switchMap vs mergeMap with an example"

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Angular | 20.x | Core framework |
| TypeScript | 5.9 | Type safety |
| NgRx Signal Store | 20.x | State management |
| RxJS | 7.8 | Reactive programming |
| Bootstrap | 5.x | UI framework |
| SCSS | — | Centralized styling |
| Marked.js | — | Markdown rendering |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 22.x | Runtime |
| Express | 5.x | API framework |
| OpenAI SDK | — | AI integration |
| GitHub Models | GPT-4o-mini | AI model |
| CORS | — | Cross-origin handling |
| dotenv | — | Environment config |

### DevOps
| Tool | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Railway | Backend deployment |
| GitHub | Version control + CI/CD |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser                          │
│  Angular 20 (Vercel)                               │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Chat UI  │  │ NgRx Signal  │  │  Markdown    │ │
│  │Component │→ │    Store     │→ │  Renderer    │ │
│  └──────────┘  └──────────────┘  └──────────────┘ │
│         ↓ HttpClient                               │
└─────────────────────────────────────────────────────┘
                    ↓ HTTPS POST /api/chat
┌─────────────────────────────────────────────────────┐
│              Node.js + Express (Railway)             │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  CORS +  │  │  Chat Route  │  │  AI Service  │ │
│  │  Middleware│→│  /api/chat  │→ │  + Prompt    │ │
│  └──────────┘  └──────────────┘  └──────────────┘ │
│                        ↓                           │
└─────────────────────────────────────────────────────┘
                    ↓ OpenAI-compatible API
┌─────────────────────────────────────────────────────┐
│           GitHub Models (GPT-4o-mini)               │
│     Angular-scoped system prompt                    │
│     Conversation history context                    │
└─────────────────────────────────────────────────────┘
```

---

## Key Features

**AI Chat Interface**
- Real-time Angular expert responses powered by GPT-4o-mini
- Conversation history maintained for context-aware answers
- Markdown rendering with code syntax highlighting
- Typing indicator during AI response generation
- Auto-scroll to latest message

**Angular-Scoped AI**
- Custom system prompt restricts AI to Angular, TypeScript, RxJS, NgRx, and frontend topics
- Gracefully declines off-topic questions and redirects to Angular
- Structured response format: explanation → code example → common mistakes

**Professional UI**
- Responsive design — works on desktop and mobile
- Dark navy sidebar with hamburger menu on mobile
- Smart/dumb component architecture
- Signal-based `input()` and `output()` APIs throughout

---

## Angular Best Practices Demonstrated

This project was built to showcase modern Angular 20 patterns:

- **Standalone Components** — no NgModules, fully modern architecture
- **Signal Store** — NgRx Signal Store with `withState`, `withMethods`, `rxMethod`
- **Signal-based APIs** — `input()`, `output()`, `effect()` instead of decorators
- **Lazy Loading** — feature routes loaded on demand
- **Reactive Forms** — `FormControl` with `nonNullable` typing
- **RxJS patterns** — `switchMap`, `pipe`, `catchError`, `tap` in production context
- **Smart/Dumb components** — `ChatComponent` (smart) + `MessageBubbleComponent` (dumb)
- **Custom Pipes** — `MarkdownPipe` with `DomSanitizer` for safe HTML
- **Centralized SCSS** — 7-1 inspired architecture with Bootstrap variable overrides
- **HTTP interceptors** — `provideHttpClient()` with proper error handling

---

## Project Structure

```
devdoubt/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/
│   │   │   │   └── message.model.ts      # ChatMessage interface
│   │   │   ├── services/
│   │   │   │   └── chat.service.ts       # HttpClient API calls
│   │   │   └── store/
│   │   │       └── chat.store.ts         # NgRx Signal Store
│   │   ├── features/
│   │   │   └── chat/
│   │   │       ├── chat.ts               # Smart container component
│   │   │       ├── chat.html             # Chat screen template
│   │   │       └── chat.scss             # Component styles
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── message-bubble/       # Dumb presentational component
│   │       │   └── chat-input/           # Reactive form input component
│   │       └── pipes/
│   │           └── markdown.pipe.ts      # Markdown → SafeHtml transformer
│   └── styles/
│       ├── abstracts/
│       │   └── _variables.scss           # Design tokens + Bootstrap overrides
│       ├── components/
│       │   ├── _message-bubble.scss
│       │   └── _chat-input.scss
│       └── pages/
│           └── _chat.scss                # Full page layout + responsive
└── server/
    ├── index.js                          # Express app entry point
    ├── routes/
    │   └── chat.js                       # POST /api/chat endpoint
    ├── services/
    │   └── ai.js                         # GitHub Models integration
    └── prompts/
        └── system.js                     # Angular expert system prompt
```

---

## Running Locally

### Prerequisites
- Node.js v18+
- npm v9+

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/AashishJakhmola/devdoubt.git
cd devdoubt

# Install dependencies
npm install

# Start Angular dev server
ng serve
```

Open [http://localhost:4200](http://localhost:4200)

### Backend Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your GITHUB_TOKEN to .env

# Start Node.js server
node index.js
```

Server runs at [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create `server/.env`:

```env
GITHUB_TOKEN=your_github_personal_access_token
PORT=3000
```

To get a GitHub token:
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. No scopes required — just generate and copy

---

## Git Workflow

This project follows a professional branching strategy:

```
main        → production (auto-deploys to Vercel + Railway)
develop     → integration branch
feature/*   → individual features (merged to develop via PR)
```

---

## Deployment

### Frontend (Vercel)
- Connected to GitHub `main` branch
- Auto-deploys on every push
- Build command: `ng build`
- Output: `dist/devdoubt/browser`

### Backend (Railway)
- Connected to GitHub `main` branch
- Root directory: `server/`
- Start command: `node index.js`
- Environment variables set in Railway dashboard

---

## Roadmap

- [ ] Past doubts — save and search conversation history
- [ ] Team dashboard — aggregated question analytics
- [ ] Grammar and clarity analysis for junior developers
- [ ] Mentor pairing suggestions based on question patterns
- [ ] Full-stack upgrade with .NET backend integration

---

## About the Developer

Built by **Aashish Jakhmola** — Frontend Developer with 2.5+ years of Angular experience (v11–v20).

This project was built to demonstrate real-world Angular architecture, AI integration, and fullstack deployment — skills developed across Healthcare, IoT, and SaaS domains.

🔗 [LinkedIn](https://linkedin.com/in/aashish-jakhmola-1b43b6170) · 📧 ashishjakhmola97@gmail.com

---

## License

MIT License — feel free to use this project as a reference or starting point.