"""
TTS Service — Service Layer Pattern.

Delegates to the active TTSStrategy. Swap the strategy at init time
to change the engine without touching the route or orchestration layers.
"""
from __future__ import annotations

from functools import lru_cache

from config.settings import get_settings
from services.tts_strategy import TTSStrategy
from utils.events import publish


class TTSService:
    """Manages text-to-speech synthesis via the configured strategy."""

    def __init__(self, strategy: TTSStrategy | None = None) -> None:
        if strategy is None:
            strategy = self._build_default_strategy()
        self._strategy = strategy

    @staticmethod
    def _build_default_strategy() -> TTSStrategy:
        engine = get_settings().tts_engine
        if engine == "pyttsx3":
            from services.pyttsx3_strategy import Pyttsx3Strategy
            return Pyttsx3Strategy()
        raise ValueError(f"Unknown TTS engine: '{engine}'")

    def speak(self, text: str, rate: int = 175, volume: float = 1.0) -> bool:
        publish("tts.speak", text=text)
        result = self._strategy.speak(text, rate=rate, volume=volume)
        publish("tts.done", success=result)
        return result


@lru_cache(maxsize=1)
def get_tts_service() -> TTSService:
    return TTSService()
