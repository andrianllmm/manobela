import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

type CameraRecordButtonProps = {
  isRecording: boolean;
  disabled?: boolean;
  onPress: () => void;
};

const RECORD_RED = 'hsl(0, 84.2%, 60.2%)';
const RECORD_RED_DISABLED = 'rgba(255, 0, 0, 0.55)';

/**
 * Recording button for the camera view.
 */
export const CameraRecordButton = ({
  isRecording,
  disabled = false,
  onPress,
}: CameraRecordButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
      accessibilityState={{ disabled }}
      style={[styles.button, disabled && styles.disabledButton]}>
      <View style={[styles.outerRing, disabled && styles.disabledRing]}>
        <View
          style={[
            isRecording ? styles.stopSquare : styles.innerDot,
            { backgroundColor: RECORD_RED },
            disabled && { backgroundColor: RECORD_RED_DISABLED },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.5,
  },

  outerRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  innerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  stopSquare: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },

  disabledRing: {
    borderColor: 'rgba(255,255,255,0.6)',
  },
});
