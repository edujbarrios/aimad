"""
Command Parser — maps transcript text to a VoiceCommand object.

Uses simple keyword matching for now. Replace with intent classification
(NLU model, LLM zero-shot, etc.) without changing the command objects.
"""
from __future__ import annotations

from commands.base import VoiceCommand
from commands.builtin_commands import (
    GreetCommand,
    HelpCommand,
    StatusCommand,
    StopCommand,
    UnknownCommand,
)

_KEYWORD_MAP: list[tuple[tuple[str, ...], type[VoiceCommand]]] = [
    (("hello", "hi", "hey", "greet"), GreetCommand),
    (("status", "are you", "online", "operational"), StatusCommand),
    (("help", "what can you do", "commands"), HelpCommand),
    (("stop", "quit", "bye", "goodbye", "shutdown"), StopCommand),
]


class CommandParser:
    """Parses a transcript string into the most appropriate VoiceCommand."""

    @staticmethod
    def parse(transcript: str) -> VoiceCommand:
        normalised = transcript.lower().strip()
        for keywords, command_cls in _KEYWORD_MAP:
            if any(kw in normalised for kw in keywords):
                return command_cls()
        return UnknownCommand(transcript)
