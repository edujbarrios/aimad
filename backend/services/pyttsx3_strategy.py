"""
pyttsx3 TTS strategy — concrete Strategy Pattern implementation.

Runs fully offline. Thread-safe: re-initialises the engine per call to avoid
the pyttsx3 'run loop already started' error in async contexts.
"""
from __future__ import annotations

import pyttsx3

from services.tts_strategy import TTSStrategy


class Pyttsx3Strategy(TTSStrategy):
    """Offline TTS using pyttsx3."""

    @property
    def engine_name(self) -> str:
        return "pyttsx3"

    def speak(self, text: str, rate: int = 175, volume: float = 1.0) -> bool:
        try:
            engine = pyttsx3.init()
            engine.setProperty("rate", rate)
            engine.setProperty("volume", volume)
            engine.say(text)
            engine.runAndWait()
            engine.stop()
            return True
        except Exception:
            return False
