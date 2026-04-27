"""Shared utility helpers."""
from __future__ import annotations

import base64
import os
from pathlib import Path


def encode_image_to_base64(image_path: str | Path) -> str:
    """Read an image file and return its base64-encoded string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def encode_bytes_to_base64(data: bytes) -> str:
    """Encode raw bytes to a base64 string."""
    return base64.b64encode(data).decode("utf-8")


def ensure_upload_dir(upload_dir: str) -> Path:
    """Create the upload directory if it does not exist and return its Path."""
    path = Path(upload_dir)
    path.mkdir(parents=True, exist_ok=True)
    return path


def safe_filename(filename: str) -> str:
    """Strip directory components and keep only the base filename."""
    return os.path.basename(filename)
