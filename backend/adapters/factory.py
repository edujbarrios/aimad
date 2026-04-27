"""
LLM Provider Factory — Factory Pattern.

Centralises adapter instantiation. Adding a new provider means adding one
branch here; no other code changes.
"""
from __future__ import annotations

from adapters.base import LLMAdapter
from config.settings import get_settings


class LLMProviderFactory:
    """Creates and returns the correct LLMAdapter for the configured provider."""

    _registry: dict[str, type[LLMAdapter]] = {}

    @classmethod
    def register(cls, name: str, adapter_cls: type[LLMAdapter]) -> None:
        """Register a new adapter under a provider name."""
        cls._registry[name] = adapter_cls

    @classmethod
    def create(cls, provider: str | None = None) -> LLMAdapter:
        """Return an adapter instance for the given provider name.

        Falls back to the value in settings if provider is None.
        """
        from adapters.llm7_adapter import LLM7Adapter  # local import to avoid circular

        # Auto-register known providers on first call
        if not cls._registry:
            cls.register("llm7", LLM7Adapter)

        if provider is None:
            provider = get_settings().llm_provider

        adapter_cls = cls._registry.get(provider)
        if adapter_cls is None:
            available = list(cls._registry.keys())
            raise ValueError(
                f"Unknown LLM provider '{provider}'. Available: {available}"
            )

        return adapter_cls()
