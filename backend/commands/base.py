"""
Voice Command base — Command Pattern.

Each recognised voice intent is encapsulated as a VoiceCommand object
with a single execute() method. This decouples intent recognition from
execution and makes commands individually testable and extensible.
"""
from __future__ import annotations

from abc import ABC, abstractmethod


class VoiceCommand(ABC):
    """Abstract voice command."""

    @abstractmethod
    async def execute(self) -> str:
        """Execute the command and return a human-readable result string."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Command identifier used for logging and events."""
