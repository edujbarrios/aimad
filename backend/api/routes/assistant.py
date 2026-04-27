"""Orchestration route — ties LLM + TTS + commands together."""
from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import OrchestrateRequest, OrchestrateResponse
from services.assistant_service import AssistantService, get_assistant_service

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])


@router.post("/orchestrate", response_model=OrchestrateResponse)
async def orchestrate(
    request: OrchestrateRequest,
    service: AssistantService = Depends(get_assistant_service),
) -> OrchestrateResponse:
    """Run the full assistant pipeline for the given input type."""
    try:
        return await service.orchestrate(request)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Orchestration error: {exc}",
        ) from exc
