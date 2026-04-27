# AIMAD
### pronounced: *e y e mad*

> *"Jarvis from Iron Man isn't science fiction anymore, I'm building it from scratch ;)"*

> [!CAUTION]
> **Active development.** APIs, architecture, and interfaces may change at any time. Not production-stable.

---

## What is AIMAD?

A personal AI assistant built from scratch — offline voice I/O, LLM reasoning, image analysis, and a cyberpunk React UI. Designed with clean architecture and swappable components so every piece can evolve independently.

**Author:** Eduardo J. Barrios — [@edujbarrios](https://github.com/edujbarrios)

---

## Tech Stack

| Layer      | Technology                                       |
|------------|--------------------------------------------------|
| Backend    | Python 3.11+, FastAPI 0.111                      |
| LLM        | LLM7.io (OpenAI-compatible adapter)              |
| STT        | SpeechRecognition + pocketsphinx (offline)       |
| TTS        | pyttsx3 (offline)                                |
| Image AI   | Vision API via LLM adapter                       |
| Frontend   | TypeScript, React 18, Vite                       |
| Styling    | CSS Modules — cyberpunk dark theme               |

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/edujbarrios/aimad.git
cd aimad
```

### 2. Configure environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and fill in your API keys
```

**`backend/.env`**
```
LLM_PROVIDER=llm7
LLM7_API_KEY=your_api_key
LLM7_BASE_URL=https://api.llm7.io/v1
LLM7_MODEL=gpt-4o
TTS_ENGINE=pyttsx3
STT_ENGINE=sphinx
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
```

**`frontend/.env.local`** *(optional — defaults to localhost:8000)*
```
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run

**Single command (recommended):**

```bash
npm install      # installs concurrently once
npm run dev      # starts backend + frontend in parallel
```

| Script | Action |
|---|---|
| `npm run dev` | Backend + frontend together |
| `npm run dev:backend` | Backend only |
| `npm run dev:frontend` | Frontend only |
| `npm run setup` | Install all deps (pip + npm) |

**Or with PowerShell (no Node required):**

```powershell
.\dev.ps1
```

Both options give colour-coded logs. `Ctrl+C` stops everything.

**Manual setup** (if you prefer separate terminals):

```bash
# Backend
cd backend && python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend && npm install && npm run dev
```

- Backend: `http://localhost:8000` · Swagger: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`

---

## Architecture

```
AIMAD/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── api/routes/          # Endpoint handlers
│   ├── services/            # Business logic
│   ├── adapters/            # LLM provider adapters
│   ├── commands/            # Voice command handlers
│   ├── models/              # Pydantic schemas
│   ├── config/              # Environment & settings
│   └── utils/               # Shared utilities
└── frontend/
    └── src/
        ├── components/      # UI components
        ├── pages/           # Page views
        ├── hooks/           # Custom React hooks
        ├── services/        # API client
        ├── layouts/         # Layout wrappers
        └── theme/           # CSS design tokens
```

### Design Patterns

| Pattern | Applied in |
|---|---|
| **Adapter** | `adapters/` — swap LLM providers with no core changes |
| **Strategy** | TTS + STT engines — pluggable at runtime |
| **Command** | `commands/` — each voice intent is an encapsulated object |
| **Factory** | `LLMProviderFactory` — provider instantiation |
| **Service Layer** | All business logic in `services/` |
| **Repository/Config** | Env & key management in `config/` |
| **Observer/Event bus** | `utils/events.py` — async state propagation |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/llm/prompt` | Send prompt to LLM |
| POST | `/api/voice/command` | Execute a voice command |
| POST | `/api/tts/speak` | Trigger TTS |
| POST | `/api/image/analyze` | Upload image + get AI insight |
| POST | `/api/assistant/orchestrate` | Full assistant orchestration |

---

## Roadmap

- [ ] Wake word detection ("Hey AIMAD")
- [ ] Conversation memory / context retention
- [ ] Ollama adapter (fully local LLM)
- [ ] Anthropic Claude + Google Gemini adapters
- [ ] Dynamic model routing (cheapest / fastest / best)
- [ ] Local vector memory / RAG (ChromaDB or Qdrant)
- [ ] Tool calling — web search, calendar, code execution
- [ ] Automation workflows (voice → open apps, control browser)
- [ ] Docker + CI/CD
- [ ] Multimodal memory (remember past images/interactions)

---

## Contributing

AIMAD is open source — all contributions welcome.

1. Fork the repo
2. `git checkout -b feat/your-feature`
3. Follow the existing patterns (Adapter, Strategy, Command, Service Layer)
4. Keep commits small and descriptive; never hardcode secrets
5. Open a PR against `main`

---

## License

GNU AGPL v3.0 — strong copyleft. Any network deployment must release source code. Commercial hosting requires explicit permission. See [LICENSE](LICENSE).
