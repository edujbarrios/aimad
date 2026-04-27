"""
Concrete voice commands.

Each command encapsulates a single intent. Add new commands here and
register them in the CommandParser.
"""
from __future__ import annotations


from commands.base import VoiceCommand


class GreetCommand(VoiceCommand):
    """Responds with a greeting."""

    @property
    def name(self) -> str:
        return "greet"

    async def execute(self) -> str:
        return "Hello! I am AIMAD, your personal AI assistant. How can I help you today?"


class StatusCommand(VoiceCommand):
    """Reports system/assistant status."""

    @property
    def name(self) -> str:
        return "status"

    async def execute(self) -> str:
        return "All systems operational. AIMAD is online and ready."


class HelpCommand(VoiceCommand):
    """Lists available commands."""

    @property
    def name(self) -> str:
        return "help"

    async def execute(self) -> str:
        return (
            "Available commands: greet, status, help, stop. "
            "You can also ask me any question and I will query the AI for you."
        )


class StopCommand(VoiceCommand):
    """Politely acknowledges a stop/goodbye request."""

    @property
    def name(self) -> str:
        return "stop"

    async def execute(self) -> str:
        return "Going offline. Call me when you need me."


class UnknownCommand(VoiceCommand):
    """Fallback for unrecognised intents — routes to LLM."""

    def __init__(self, transcript: str) -> None:
        self._transcript = transcript

    @property
    def name(self) -> str:
        return "unknown"

    async def execute(self) -> str:
        # The VoiceService will intercept UnknownCommand and forward to LLM
        return self._transcript
