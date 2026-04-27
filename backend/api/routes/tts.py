"""TTS route — triggers offline speech synthesis."""
from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import TTSSpeakRequest, TTSSpeakResponse
from services.tts_service import TTSService, get_tts_service

router = APIRouter(prefix="/api/tts", tags=["TTS"])


@router.post("/speak", response_model=TTSSpeakResponse)
async def speak(
    request: TTSSpeakRequest,
    service: TTSService = Depends(get_tts_service),
) -> TTSSpeakResponse:
    """Convert text to speech using the offline TTS engine."""
    try:
        spoken = service.speak(request.text, rate=request.rate, volume=request.volume)
        return TTSSpeakResponse(spoken=spoken, text=request.text)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"TTS engine error: {exc}",
        ) from exc
