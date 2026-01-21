import logging
from collections import deque
from typing import Optional

from app.core.config import settings
from app.services.metrics.base_metric import BaseMetric, MetricOutputBase
from app.services.metrics.frame_context import FrameContext
from app.services.metrics.utils.ear import average_ear
from app.services.smoother import ScalarSmoother

logger = logging.getLogger(__name__)


class EyeClosureMetricOutput(MetricOutputBase):
    ear_alert: bool
    ear: Optional[float]
    perclos_alert: bool
    perclos: Optional[float]


class EyeClosureMetric(BaseMetric):
    """
    Eye closure metric using EAR per frame and PERCLOS over a rolling window.
    Thresholds and window size are configurable per instance.
    """

    DEFAULT_EAR_THRESHOLD = 0.15
    DEFAULT_PERCLOS_THRESHOLD = 0.4
    DEFAULT_WINDOW_SEC = 10
    DEFAULT_SMOOTHER_ALPHA = 0.6

    def __init__(
        self,
        ear_threshold: float = DEFAULT_EAR_THRESHOLD,
        perclos_threshold: float = DEFAULT_PERCLOS_THRESHOLD,
        window_sec: int = DEFAULT_WINDOW_SEC,
        smoother_alpha: float = DEFAULT_SMOOTHER_ALPHA,
    ):
        """
        Args:
            ear_threshold: EAR value below which eyes are considered closed.
            perclos_threshold: PERCLOS ratio above which alert is triggered.
            window_sec: Rolling window duration in seconds.
            smoother_alpha: Smoother alpha for EAR smoothing.
        """

        self.ear_threshold = ear_threshold
        self.perclos_threshold = perclos_threshold

        # Convert seconds to frames based on backend target FPS
        self.window_size = max(1, int(window_sec * settings.target_fps))

        self.eye_history: deque[bool] = deque(maxlen=self.window_size)

        self.ear_smoother = ScalarSmoother(alpha=smoother_alpha, max_missing=3)

    def update(self, context: FrameContext) -> EyeClosureMetricOutput:
        landmarks = context.face_landmarks
        if not landmarks:
            perclos = self._perclos()
            return {
                "ear_alert": False,
                "ear": None,
                "perclos_alert": perclos >= self.perclos_threshold,
                "perclos": perclos,
            }

        # Computer EAR
        try:
            raw_ear = average_ear(landmarks)
            ear_value = self.ear_smoother.update(raw_ear)
        except (IndexError, ZeroDivisionError) as e:
            logger.debug(f"EAR computation failed: {e}")
            perclos = self._perclos()
            return {
                "ear_alert": False,
                "ear": None,
                "perclos_alert": perclos >= self.perclos_threshold,
                "perclos": perclos,
            }

        if ear_value is None:
            perclos = self._perclos()
            return {
                "ear_alert": False,
                "ear": None,
                "perclos_alert": perclos >= self.perclos_threshold,
                "perclos": perclos,
            }

        ear_alert = ear_value < self.ear_threshold
        self.eye_history.append(ear_alert)

        # Compute PERCLOS
        perclos = self._perclos()
        perclos_alert = perclos >= self.perclos_threshold

        return {
            "ear_alert": ear_alert,
            "ear": ear_value,
            "perclos_alert": perclos_alert,
            "perclos": perclos,
        }

    def reset(self):
        self.ear_smoother.reset()
        self.eye_history.clear()

    def _perclos(self) -> float:
        return (
            sum(self.eye_history) / len(self.eye_history) if self.eye_history else 0.0
        )
