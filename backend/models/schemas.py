"""Shared Pydantic request/response models."""
from __future__ import annotations

from pydantic import BaseModel, Field


# ── Generic ──────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "0.1.0"
    message: str = "AIMAD backend is running"


class ErrorResponse(BaseModel):
    detail: str


# ── LLM ──────────────────────────────────────────────────────────────────────

class PromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=32000)
    system_prompt: str | None = Field(
        default="You are AIMAD, an advanced AI personal assistant inspired by Jarvis.",
    )
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    max_tokens: int = Field(default=1024, ge=1, le=8192)


class PromptResponse(BaseModel):
    content: str
    model: str
    provider: str
    usage: dict | None = None


# ── TTS ──────────────────────────────────────────────────────────────────────

class TTSSpeakRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4096)
    rate: int = Field(default=175, ge=50, le=400)
    volume: float = Field(default=1.0, ge=0.0, le=1.0)


class TTSSpeakResponse(BaseModel):
    spoken: bool
    text: str


# ── Voice ─────────────────────────────────────────────────────────────────────

class VoiceCommandRequest(BaseModel):
    transcript: str = Field(..., min_length=1, max_length=2048)


class VoiceCommandResponse(BaseModel):
    command: str
    result: str
    spoken: bool = False


# ── Image ─────────────────────────────────────────────────────────────────────

class ImageAnalysisResponse(BaseModel):
    insight: str
    model: str
    provider: str
    spoken: bool = False


# ── Orchestrate ───────────────────────────────────────────────────────────────

class OrchestrateRequest(BaseModel):
    input_type: str = Field(..., pattern="^(text|voice|image)$")
    text: str | None = None
    speak_response: bool = False


class OrchestrateResponse(BaseModel):
    result: str
    spoken: bool = False
