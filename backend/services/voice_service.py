"""
Voice Service — Service Layer Pattern.

Handles the full voice pipeline: parse transcript → execute command →
optionally forward unknowns to the LLM → optionally speak the result.
"""
from __future__ import annotations

from functools import lru_cache

from commands.builtin_commands import UnknownCommand
from commands.parser import CommandParser
from config.settings import get_settings
from models.schemas import VoiceCommandResponse
from utils.events import publish


class VoiceService:
    """Orchestrates voice command parsing and execution."""

    async def handle(self, transcript: str) -> VoiceCommandResponse:
        publish("voice.received", transcript=transcript)

        command = CommandParser.parse(transcript)
        result = await command.execute()

        # Forward unrecognised input to the LLM
        if isinstance(command, UnknownCommand):
            result = await self._llm_fallback(transcript)

        publish("voice.executed", command=command.name, result=result)

        return VoiceCommandResponse(command=command.name, result=result)

    @staticmethod
    async def _llm_fallback(transcript: str) -> str:
        from adapters.factory import LLMProviderFactory

        adapter = LLMProviderFactory.create()
        response = await adapter.complete(
            prompt=transcript,
            system_prompt=(
                "You are AIMAD, an advanced AI personal assistant inspired by Jarvis. "
                "Be concise and helpful."
            ),
        )
        return response["content"]


@lru_cache(maxsize=1)
def get_voice_service() -> VoiceService:
    return VoiceService()
