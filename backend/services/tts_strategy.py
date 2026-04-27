"""
TTS Strategy interface — Strategy Pattern.

Allows swapping TTS engines (pyttsx3, Coqui, ElevenLabs…) without
changing the service or route layers.
"""
from __future__ import annotations

from abc import ABC, abstractmethod


class TTSStrategy(ABC):
    """Abstract TTS engine strategy."""

    @abstractmethod
    def speak(self, text: str, rate: int = 175, volume: float = 1.0) -> bool:
        """Synthesise speech for the given text. Returns True on success."""

    @property
    @abstractmethod
    def engine_name(self) -> str:
        """Human-readable engine identifier."""
