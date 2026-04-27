"""
LLM7 provider adapter — Adapter Pattern.

LLM7.io exposes an OpenAI-compatible API, so we use the openai SDK
pointed at the LLM7 base URL. Swapping to real OpenAI is just a config change.
"""
from __future__ import annotations

import openai
from adapters.base import LLMAdapter
from config.settings import get_settings


class LLM7Adapter(LLMAdapter):
    """Concrete adapter for the LLM7.io provider."""

    def __init__(self) -> None:
        settings = get_settings()
        self._client = openai.AsyncOpenAI(
            api_key=settings.llm7_api_key,
            base_url=settings.llm7_base_url,
        )
        self._model = settings.llm7_model

    @property
    def provider_name(self) -> str:
        return "llm7"

    async def complete(
        self,
        prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> dict:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        choice = response.choices[0]
        return {
            "content": choice.message.content or "",
            "model": response.model,
            "provider": self.provider_name,
            "usage": response.usage.model_dump() if response.usage else None,
        }

    async def analyze_image(
        self,
        base64_image: str,
        prompt: str,
        mime_type: str = "image/jpeg",
    ) -> dict:
        data_url = f"data:{mime_type};base64,{base64_image}"
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": data_url}},
                ],
            }
        ]

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            max_tokens=1024,
        )

        choice = response.choices[0]
        return {
            "content": choice.message.content or "",
            "model": response.model,
            "provider": self.provider_name,
            "usage": response.usage.model_dump() if response.usage else None,
        }
