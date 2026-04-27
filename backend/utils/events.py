"""
Event bus — Observer/Event pattern for broadcasting assistant lifecycle events.
"""
from __future__ import annotations

from collections import defaultdict
from typing import Any, Callable

_subscribers: dict[str, list[Callable[..., None]]] = defaultdict(list)


def subscribe(event: str, handler: Callable[..., None]) -> None:
    """Register a handler for the given event name."""
    _subscribers[event].append(handler)


def publish(event: str, **payload: Any) -> None:
    """Broadcast an event to all registered handlers."""
    for handler in _subscribers.get(event, []):
        handler(**payload)


def unsubscribe(event: str, handler: Callable[..., None]) -> None:
    """Remove a specific handler from an event."""
    _subscribers[event] = [h for h in _subscribers[event] if h is not handler]
