"""
Image Service — Service Layer Pattern.

Handles the full image-to-insight pipeline:
  raw bytes → base64 → LLMAdapter.analyze_image → insight → optional TTS
"""
from __future__ import annotations

from functools import lru_cache

from adapters.factory import LLMProviderFactory
from models.schemas import ImageAnalysisResponse
from utils.helpers import encode_bytes_to_base64
from utils.events import publish


class ImageService:
    """Orchestrates image upload, analysis, and optional TTS readback."""

    def __init__(self) -> None:
        self._adapter = LLMProviderFactory.create()

    async def analyze(
        self,
        image_bytes: bytes,
        prompt: str = "Describe what you see in this image in detail.",
        mime_type: str = "image/jpeg",
        speak: bool = False,
    ) -> ImageAnalysisResponse:
        publish("image.analysis.start", prompt=prompt)

        b64 = encode_bytes_to_base64(image_bytes)
        result = await self._adapter.analyze_image(b64, prompt=prompt, mime_type=mime_type)

        insight = result["content"]
        spoken = False

        if speak:
            from services.tts_service import get_tts_service
            tts = get_tts_service()
            # Read a concise summary (first 300 chars) aloud
            spoken = tts.speak(insight[:300])

        publish("image.analysis.done", insight=insight)

        return ImageAnalysisResponse(
            insight=insight,
            model=result["model"],
            provider=result["provider"],
            spoken=spoken,
        )


@lru_cache(maxsize=1)
def get_image_service() -> ImageService:
    return ImageService()
