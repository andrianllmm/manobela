from typing import List, Tuple

from app.services.metrics.utils.geometry import euclidean_dist

MOUTH_CORNER_LEFT = 61
MOUTH_CORNER_RIGHT = 291
INNER_LIP_TOP = 13
INNER_LIP_BOTTOM = 14


def compute_mar(
    landmarks: List[Tuple[float, float]],
    left_idx: int = MOUTH_CORNER_LEFT,
    right_idx: int = MOUTH_CORNER_RIGHT,
    top_idx: int = INNER_LIP_TOP,
    bottom_idx: int = INNER_LIP_BOTTOM,
) -> float:
    """
    Compute mouth aspect ratio (MAR).

    Args:
        landmarks: List of landmarks as (x, y) tuples
        left_idx: Index of left mouth corner landmark
        right_idx: Index of right mouth corner landmark
        top_idx: Index of upper inner lip landmark
        bottom_idx: Index of lower inner lip landmark

    Returns:
        Mouth aspect ratio
    """
    if len(landmarks) <= max(left_idx, right_idx, top_idx, bottom_idx):
        raise IndexError("Not enough landmarks to compute MAR")

    mouth_width = euclidean_dist(landmarks[left_idx], landmarks[right_idx])
    mouth_opening = euclidean_dist(landmarks[top_idx], landmarks[bottom_idx])

    return mouth_opening / mouth_width

# Integrate guard here
