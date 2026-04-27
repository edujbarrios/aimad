"""Voice command route — receives transcript and executes matched command."""
from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import VoiceCommandRequest, VoiceCommandResponse
from services.voice_service import VoiceService, get_voice_service

router = APIRouter(prefix="/api/voice", tags=["Voice"])


@router.post("/command", response_model=VoiceCommandResponse)
async def execute_voice_command(
    request: VoiceCommandRequest,
    service: VoiceService = Depends(get_voice_service),
) -> VoiceCommandResponse:
    """Parse a transcript and execute the matching voice command."""
    try:
        return await service.handle(request.transcript)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Voice command error: {exc}",
        ) from exc
