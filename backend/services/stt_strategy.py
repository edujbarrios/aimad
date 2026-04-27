"""
STT Strategy interface — Strategy Pattern.

Pluggable voice recognition: pocketsphinx (offline), Whisper, Google STT, etc.
"""
from __future__ import annotations

from abc import ABC, abstractmethod


class STTStrategy(ABC):
    """Abstract speech-to-text strategy."""

    @abstractmethod
    def listen(self, timeout: int = 5) -> str | None:
        """
        Listen from the microphone and return a transcript string,
        or None if nothing was heard / an error occurred.
        """

    @property
    @abstractmethod
    def engine_name(self) -> str:
        """Human-readable engine identifier."""
