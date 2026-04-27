"""LLM prompt route — delegates to LLMService."""
from fastapi import APIRouter, Depends, HTTPException, status
from models.schemas import PromptRequest, PromptResponse
from services.llm_service import LLMService, get_llm_service

router = APIRouter(prefix="/api/llm", tags=["LLM"])


@router.post("/prompt", response_model=PromptResponse)
async def send_prompt(
    request: PromptRequest,
    service: LLMService = Depends(get_llm_service),
) -> PromptResponse:
    """Send a prompt to the configured LLM provider and return the response."""
    try:
        return await service.complete(request)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"LLM provider error: {exc}",
        ) from exc
