"""
LLM Adapter interface — Adapter Pattern.

Every LLM provider must implement this protocol so the rest of the system
never depends on a specific provider SDK.
"""
from __future__ import annotations

from abc import ABC, abstractmethod


class LLMAdapter(ABC):
    """Abstract base for all LLM provider adapters."""

    @abstractmethod
    async def complete(
        self,
        prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> dict:
        """
        Send a text prompt and return a dict with:
        - content (str)
        - model (str)
        - provider (str)
        - usage (dict | None)
        """

    @abstractmethod
    async def analyze_image(
        self,
        base64_image: str,
        prompt: str,
        mime_type: str = "image/jpeg",
    ) -> dict:
        """
        Send an image (base64-encoded) with an optional prompt.
        Return same shape as complete().
        """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Human-readable provider identifier."""
