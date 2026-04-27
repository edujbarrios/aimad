"""Image analysis route — accepts file upload and returns AI insight."""
from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from models.schemas import ImageAnalysisResponse
from services.image_service import ImageService, get_image_service

router = APIRouter(prefix="/api/image", tags=["Image"])

_ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@router.post("/analyze", response_model=ImageAnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    prompt: str = Form(default="Describe what you see in this image in detail."),
    speak: bool = Form(default=False),
    service: ImageService = Depends(get_image_service),
) -> ImageAnalysisResponse:
    """Upload an image and receive an AI-generated insight."""
    if file.content_type not in _ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Unsupported file type: {file.content_type}. Allowed: {_ALLOWED_TYPES}",
        )

    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    try:
        return await service.analyze(image_bytes, prompt=prompt, speak=speak)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Image analysis error: {exc}",
        ) from exc
