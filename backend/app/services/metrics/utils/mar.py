from __future__ import annotations

from typing import Optional, Sequence

from app.services.face_landmarker import FaceLandmark2D
from app.services.metrics.utils.geometry import euclidean_dist

UPPER_LIP = 13
LOWER_LIP = 14
LEFT_MOUTH_CORNER = 61
RIGHT_MOUTH_CORNER = 291

MOUTH_LANDMARK_INDICES: tuple[int, int, int, int] = (
    UPPER_LIP,
    LOWER_LIP,
    LEFT_MOUTH_CORNER,
    RIGHT_MOUTH_CORNER,
)


def compute_mar(landmarks: Sequence[FaceLandmark2D]) -> Optional[float]:
    """
    Compute the Mouth Aspect Ratio (MAR).

    MAR measures the vertical opening of the mouth relative to its width.

    Computation:
        MAR = vertical_distance / horizontal_distance

        where:
            vertical_distance = distance between upper and lower lip landmarks
            horizontal_distance = distance between left and right mouth corners

    Interpretation:
        - Higher MAR values indicate a more open mouth.
        - Lower MAR values indicate a more closed mouth.
        - Commonly used for detecting yawning, speaking, or mouth activity.

    Args:
        landmarks: A sequence of 2D face landmarks.

    Returns:
        The MAR value or None if required landmarks are missing or invalid.
    """
    if len(landmarks) <= max(MOUTH_LANDMARK_INDICES):
        return None

    top = landmarks[UPPER_LIP]
    bottom = landmarks[LOWER_LIP]
    left = landmarks[LEFT_MOUTH_CORNER]
    right = landmarks[RIGHT_MOUTH_CORNER]

    if any(len(p) < 2 for p in (top, bottom, left, right)):
        return None

    horizontal = euclidean_dist(left, right)
    if horizontal <= 1e-9:
        return None

    vertical = euclidean_dist(top, bottom)
    return vertical / horizontal
