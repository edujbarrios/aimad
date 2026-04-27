"""
LLM Service — Service Layer Pattern.

Sits between the route layer and the adapter layer. Handles business logic
(prompt shaping, error normalisation, event publishing) without coupling to
HTTP or any specific LLM SDK.
"""
from __future__ import annotations

from functools import lru_cache

from adapters.factory import LLMProviderFactory
from models.schemas import PromptRequest, PromptResponse
from utils.events import publish


class LLMService:
    """Orchestrates prompt completion via the configured LLM adapter."""

    def __init__(self) -> None:
        self._adapter = LLMProviderFactory.create()

    async def complete(self, request: PromptRequest) -> PromptResponse:
        publish("llm.request", prompt=request.prompt)

        result = await self._adapter.complete(
            prompt=request.prompt,
            system_prompt=request.system_prompt,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
        )

        publish("llm.response", content=result["content"])

        return PromptResponse(
            content=result["content"],
            model=result["model"],
            provider=result["provider"],
            usage=result.get("usage"),
        )


@lru_cache(maxsize=1)
def get_llm_service() -> LLMService:
    return LLMService()
