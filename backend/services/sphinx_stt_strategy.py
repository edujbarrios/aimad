"""
Sphinx (offline) STT strategy — concrete Strategy Pattern implementation.

Uses the SpeechRecognition library with pocketsphinx for fully offline
voice recognition. Requires: pip install pocketsphinx SpeechRecognition
"""
from __future__ import annotations

import speech_recognition as sr

from services.stt_strategy import STTStrategy


class SphinxSTTStrategy(STTStrategy):
    """Offline STT using pocketsphinx via SpeechRecognition."""

    def __init__(self) -> None:
        self._recogniser = sr.Recognizer()

    @property
    def engine_name(self) -> str:
        return "sphinx"

    def listen(self, timeout: int = 5) -> str | None:
        with sr.Microphone() as source:
            self._recogniser.adjust_for_ambient_noise(source, duration=0.5)
            try:
                audio = self._recogniser.listen(source, timeout=timeout)
                return self._recogniser.recognize_sphinx(audio)
            except (sr.WaitTimeoutError, sr.UnknownValueError, sr.RequestError):
                return None
