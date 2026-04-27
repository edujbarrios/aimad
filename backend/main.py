"""
AIMAD — FastAPI application entry point.

Wires together all routes, CORS, and startup logic.
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import health, llm, tts, voice, image, assistant
from config.settings import get_settings
from utils.helpers import ensure_upload_dir

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    ensure_upload_dir(settings.upload_dir)
    yield
    # Shutdown (nothing to clean up for now)


app = FastAPI(
    title="AIMAD API",
    description=(
        "AIMAD — AI personal assistant backend. "
        "'Jarvis from Iron Man isn't science fiction anymore, I'm building it from scratch ;)'"
    ),
    version="0.1.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(llm.router)
app.include_router(tts.router)
app.include_router(voice.router)
app.include_router(image.router)
app.include_router(assistant.router)
