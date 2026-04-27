"""
Config layer — loads and validates environment variables.
Repository/Config Pattern: single source of truth for all settings.
"""
from __future__ import annotations

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application-wide settings loaded from environment variables."""

    # LLM provider
    llm_provider: str = "llm7"
    llm7_api_key: str = ""
    llm7_base_url: str = "https://api.llm7.io/v1"
    llm7_model: str = "gpt-4o"

    # TTS / STT engines
    tts_engine: str = "pyttsx3"
    stt_engine: str = "sphinx"

    # File handling
    upload_dir: str = "uploads"
    max_upload_size_mb: int = 10

    # CORS
    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached singleton of Settings."""
    return Settings()
