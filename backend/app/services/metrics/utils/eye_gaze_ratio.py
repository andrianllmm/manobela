import logging
from typing import Optional, Sequence

from app.services.metrics.utils.geometry import average_point

logger = logging.getLogger(__name__)

# Landmark indices for left/right eye corners, lids, and iris
LEFT_EYE_CORNERS = (33, 133)
RIGHT_EYE_CORNERS = (362, 263)
LEFT_EYE_LIDS = (159, 145)
RIGHT_EYE_LIDS = (386, 374)
LEFT_IRIS = (468, 469, 470, 471, 472)
RIGHT_IRIS = (473, 474, 475, 476, 477)


def eye_gaze_ratio(
    landmarks: Sequence[tuple[float, float]],
    corners: tuple[int, int],
    lids: tuple[int, int],
    iris_indices: tuple[int, ...],
    is_right_eye: bool = False,
) -> Optional[tuple[float, float]]:
    """
    Compute the normalized gaze ratio for one eye based on landmarks.

    This function is a pure utility and does not depend on any metric class.
    It expects landmarks as a sequence of (x, y) coordinates.

    Args:
        landmarks: Sequence of (x, y) landmark coordinates.
        corners: Tuple of indices (left_corner, right_corner).
        lids: Tuple of indices (upper_lid, lower_lid).
        iris_indices: Indices of landmarks forming the iris.
        is_right_eye: If True, mirror the x-axis so right eye aligns with left eye.

    Returns:
        Tuple (gaze_x, gaze_y) normalized between 0.0 and 1.0, or None if
        computation fails due to missing landmarks or zero-sized eye box.
    """
    # Ensure indices exist
    if max(*corners, *lids, *iris_indices) >= len(landmarks):
        return None

    left_corner, right_corner = corners
    upper_lid, lower_lid = lids

    # Compute iris center using utility function
    iris_points = [landmarks[i] for i in iris_indices]
    iris_center = average_point(iris_points)

    width = landmarks[right_corner][0] - landmarks[left_corner][0]
    height = landmarks[lower_lid][1] - landmarks[upper_lid][1]

    if width == 0 or height == 0:
        logger.debug("Zero width/height in eye landmarks")
        return None

    gaze_x = (iris_center[0] - landmarks[left_corner][0]) / width
    gaze_y = (iris_center[1] - landmarks[upper_lid][1]) / height

    if is_right_eye:
        gaze_x = 1.0 - gaze_x

    return gaze_x, gaze_y


def left_eye_gaze_ratio(
    landmarks: Sequence[tuple[float, float]],
    corners: tuple[int, int] = LEFT_EYE_CORNERS,
    lids: tuple[int, int] = LEFT_EYE_LIDS,
    iris_indices: tuple[int, ...] = LEFT_IRIS,
) -> Optional[tuple[float, float]]:
    """
    Calculates the gaze ratio of the left eye.
    """
    return eye_gaze_ratio(
        landmarks=landmarks,
        corners=corners,
        lids=lids,
        iris_indices=iris_indices,
        is_right_eye=False,
    )


def right_eye_gaze_ratio(
    landmarks: Sequence[tuple[float, float]],
    corners: tuple[int, int] = RIGHT_EYE_CORNERS,
    lids: tuple[int, int] = RIGHT_EYE_LIDS,
    iris_indices: tuple[int, ...] = RIGHT_IRIS,
) -> Optional[tuple[float, float]]:
    """
    Calculates the gaze ratio of the right eye.
    """
    return eye_gaze_ratio(
        landmarks=landmarks,
        corners=corners,
        lids=lids,
        iris_indices=iris_indices,
        is_right_eye=True,
    )
