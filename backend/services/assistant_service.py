"""
Assistant Service — orchestration layer.

Ties LLM, TTS, and voice services together into a single pipeline
entry point. Routes calls based on input_type.
"""
from __future__ import annotations

from functools import lru_cache

from models.schemas import OrchestrateRequest, OrchestrateResponse
from utils.events import publish


class AssistantService:
    """Top-level orchestrator for the AIMAD assistant pipeline."""

    async def orchestrate(self, request: OrchestrateRequest) -> OrchestrateResponse:
        publish("assistant.orchestrate.start", input_type=request.input_type)

        result = ""
        spoken = False

        if request.input_type == "text" and request.text:
            result = await self._handle_text(request.text)
        elif request.input_type == "voice" and request.text:
            # transcript already resolved by caller
            from services.voice_service import get_voice_service
            voice_resp = await get_voice_service().handle(request.text)
            result = voice_resp.result
        else:
            result = "No valid input provided."

        if request.speak_response and result:
            from services.tts_service import get_tts_service
            spoken = get_tts_service().speak(result[:300])

        publish("assistant.orchestrate.done", result=result)
        return OrchestrateResponse(result=result, spoken=spoken)

    @staticmethod
    async def _handle_text(text: str) -> str:
        from adapters.factory import LLMProviderFactory
        adapter = LLMProviderFactory.create()
        resp = await adapter.complete(
            prompt=text,
            system_prompt=(
                "You are AIMAD, an advanced AI personal assistant inspired by Jarvis. "
                "Be concise, insightful, and helpful."
            ),
        )
        return resp["content"]


@lru_cache(maxsize=1)
def get_assistant_service() -> AssistantService:
    return AssistantService()
