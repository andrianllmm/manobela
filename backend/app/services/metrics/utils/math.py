from __future__ import annotations

from typing import Optional


def in_range(val: Optional[float], rng: tuple[float, float]) -> Optional[bool]:
    """
    Check if a value is within a specified inclusive range.
    """
    if rng[0] > rng[1]:
        raise ValueError(
            "rng must be (min_value, max_value) with min_value <= max_value"
        )

    if val is None:
        return None

    return rng[0] <= val <= rng[1]
