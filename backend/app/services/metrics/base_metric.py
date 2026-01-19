from abc import ABC, abstractmethod
from typing import Any


class BaseMetric(ABC):
    """
    Abstract base class for all driver monitoring metrics.
    """

    @abstractmethod
    def update(self, frame_data: dict[str, Any]) -> dict[str, Any]:
        """
        Update the metric with the latest frame data.

        Args:
            frame_data: Dictionary containing preprocessed information for this frame
                        e.g., {'landmarks': [...], 'timestamp': 'ISO string'}

        Returns:
            Dictionary of metric results.
        """
        pass

    @abstractmethod
    def reset(self):
        """Reset metric state."""
        pass
