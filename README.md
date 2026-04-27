# AIMAD

> **"Jarvis from Iron Man isn't science fiction anymore, I'm building it from scratch ;)"**

**Author:** Eduardo J. Barrios — [@edujbarrios](https://github.com/edujbarrios)

---

## Vision

AIMAD is a personal AI assistant inspired by Jarvis from Iron Man, built entirely from scratch with a strong software architecture, clean design patterns, modularity, and future scalability in mind.

The assistant is capable of:
- Understanding **voice commands offline**
- **Speaking back** using offline TTS (pyttsx3)
- Connecting to **LLM APIs** for reasoning and execution (LLM7.io and others)
- **Understanding uploaded images / screenshots** and providing contextual insights
- Interpreting image content through the AI pipeline and responding with **both text and voice output**
- Future support for **tool calling** and advanced agent workflows

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | Python 3.11+, FastAPI, pyttsx3      |
| LLM        | LLM7.io API (OpenAI-compatible)     |
| Voice STT  | SpeechRecognition + pocketsphinx / Whisper (offline) |
| TTS        | pyttsx3 (offline)                   |
| Image AI   | OpenAI Vision / LLaVA via adapter   |
| Frontend   | TypeScript, React 18, Vite          |
| Styling    | Tailwind CSS (cyberpunk dark theme) |
| Comms      | REST API (FastAPI ↔ React)          |

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip / venv
- npm or pnpm

---

### Backend Setup

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Fill in your API keys in .env

uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.
Swagger docs at `http://localhost:8000/docs`.

---

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend will be at `http://localhost:5173`.

---

### Run Everything at Once (Recommended)

Start both backend and frontend with a **single command** from the project root.

#### Option A — `npm run dev` (Node-based, cross-platform)

```bash
# One-time setup: installs concurrently
npm install

# Start both services in parallel
npm run dev
```

Backend logs appear in **cyan**, frontend logs in **magenta**. `Ctrl+C` stops both.

| Script | Action |
|---|---|
| `npm run dev` | Start backend + frontend together |
| `npm run dev:backend` | Backend only |
| `npm run dev:frontend` | Frontend only |
| `npm run setup` | Install all deps (frontend npm + backend pip) |

#### Option B — `.\dev.ps1` (Windows PowerShell, no Node required)

```powershell
.\dev.ps1
```

Runs both services as background jobs with color-coded output. `Ctrl+C` shuts them both down cleanly.

---

## Environment Variables

### Backend (`backend/.env`)

```
LLM_PROVIDER=llm7
LLM7_API_KEY=your_llm7_api_key_here
LLM7_BASE_URL=https://api.llm7.io/v1
LLM7_MODEL=gpt-4o
TTS_ENGINE=pyttsx3
STT_ENGINE=sphinx
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
```

### Frontend (`frontend/.env.local`)

```
VITE_API_BASE_URL=http://localhost:8000
```

---

## Architecture Overview

```
AIMAD/
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── requirements.txt
│   ├── .env.example
│   ├── api/
│   │   └── routes/              # All route modules
│   ├── services/                # Business logic (Service Layer)
│   ├── adapters/                # LLM provider adapters (Adapter Pattern)
│   ├── commands/                # Voice command handlers (Command Pattern)
│   ├── models/                  # Pydantic request/response models
│   ├── config/                  # Config & env loading (Repository/Config Layer)
│   └── utils/                   # Shared utilities
│
└── frontend/
    ├── src/
    │   ├── components/          # Reusable UI components
    │   ├── pages/               # Page-level views
    │   ├── services/            # API client (frontend service layer)
    │   ├── hooks/               # Custom React hooks
    │   ├── layouts/             # Layout wrappers
    │   └── theme/               # Cyberpunk theme tokens
    └── public/
```

---

## Design Patterns Used

| Pattern              | Where Applied                                      |
|----------------------|----------------------------------------------------|
| **Adapter Pattern**  | LLM providers (`adapters/`) — swap LLM7, OpenAI, Ollama with no core changes |
| **Strategy Pattern** | TTS engines and STT engines — pluggable at runtime |
| **Command Pattern**  | Voice commands — each command is an encapsulated object |
| **Factory Pattern**  | Provider initialization — `LLMProviderFactory`     |
| **Service Layer**    | All business logic isolated in `services/`         |
| **Repository/Config**| Environment & API key management in `config/`      |
| **Observer/Event**   | Assistant event bus for async state propagation    |

---

## Image Understanding Workflow

```
User uploads image / screenshot
        ↓
Frontend → POST /api/image/analyze
        ↓
ImageService.analyze(image_bytes, prompt)
        ↓
LLMAdapter.analyze_image(base64_image, prompt)
        ↓
LLM returns text insight
        ↓
[Optional] TTSService.speak(insight_summary)
        ↓
Frontend displays insight + plays audio response
```

Supported inputs:
- Screenshots (UI, desktop, web)
- Photos
- Documents / scanned pages
- Diagrams & charts

---

## Voice + TTS Workflow

```
User presses voice button or uses wake word
        ↓
STTStrategy.listen() → transcribed text
        ↓
CommandParser.parse(text) → VoiceCommand object
        ↓
CommandExecutor.execute(command) → result
        ↓
TTSStrategy.speak(result)
        ↓
[If LLM needed] → LLMAdapter.complete(prompt)
```

---

## API Endpoints

| Method | Endpoint                 | Description                        |
|--------|--------------------------|------------------------------------|
| GET    | `/health`                | Health check                       |
| POST   | `/api/llm/prompt`        | Send prompt to LLM                 |
| POST   | `/api/voice/command`     | Execute a voice command            |
| POST   | `/api/tts/speak`         | Trigger TTS for given text         |
| POST   | `/api/image/analyze`     | Upload image + get AI insight      |
| POST   | `/api/assistant/orchestrate` | Full assistant orchestration   |

---

## Roadmap / TODO

### Near-term
- [ ] Improve offline voice recognition accuracy
- [ ] Add wake word detection (e.g., "Hey AIMAD")
- [ ] Add conversation memory / context retention
- [ ] Improve image analysis (OCR, diagram interpretation)
- [ ] Expand TTS voices and speed controls

### Experimental APIs
- [ ] Tool calling support (function calling via LLM)
- [ ] Web search tool integration
- [ ] Calendar & reminder tool
- [ ] Code execution tool (sandboxed)

### LLM Connectivity
- [ ] Add Ollama adapter (fully local LLM)
- [ ] Add Anthropic Claude adapter
- [ ] Add Google Gemini adapter
- [ ] Dynamic model routing (cheapest/fastest/best based on task)

### Multimodal & Memory
- [ ] Multimodal memory (remember past images/interactions)
- [ ] Local vector memory / RAG with ChromaDB or Qdrant
- [ ] Persistent session context across restarts

### Automation
- [ ] Automation workflow builder
- [ ] Trigger actions from voice commands (open apps, control browser, etc.)
- [ ] Webhook / integration support

### Infrastructure
- [ ] Docker support
- [ ] CI/CD pipeline
- [ ] Configuration UI for managing API keys + settings

---

## Contributing

AIMAD is **fully open source** — contributions are welcome and encouraged!

Whether you want to add a new LLM adapter, improve the voice pipeline, build a new frontend component, fix a bug, or extend the roadmap — all PRs are appreciated.

### How to contribute

1. **Fork** the repository
2. **Create a branch** for your feature or fix: `git checkout -b feat/my-feature`
3. **Make your changes** — follow the existing architecture and design patterns
4. **Commit** with clear, small messages (see commit style in this repo)
5. **Push** and open a **Pull Request** against `main`

### Guidelines
- Follow the existing design patterns (Adapter, Strategy, Command, Factory, Service Layer)
- Keep commits small and descriptive
- Never hardcode secrets — use `.env` and `.env.example`
- Keep backend (Python/FastAPI) and frontend (TypeScript/React) cleanly separated
- If adding a new LLM provider, implement `LLMAdapter` and register it in `LLMProviderFactory`
- If adding a new TTS/STT engine, implement the corresponding Strategy interface

### Ideas for contributions
- New LLM provider adapters (Ollama, Anthropic, Gemini…)
- Improved offline voice recognition (Whisper local)
- Wake word detection
- RAG / local vector memory integration
- Docker + deployment configs
- UI themes and components
- Tool calling implementations
- Automation workflows

All contributors will be credited. Let's build Jarvis together.

---

## License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for full terms.

---

*AIMAD — because Jarvis was always possible.*
