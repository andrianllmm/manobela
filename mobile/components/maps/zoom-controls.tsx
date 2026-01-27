import { View, TouchableOpacity } from 'react-native';
import { Plus, Minus } from 'lucide-react-native';
import { useTheme } from '@react-navigation/native';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function ZoomControls({ onZoomIn, onZoomOut }: ZoomControlsProps) {
  const { colors } = useTheme();

  return (
    <View className="absolute bottom-24 left-4 flex-col gap-2">
      {/* Zoom In Button */}
      <TouchableOpacity
        onPress={onZoomIn}
        className="rounded-full bg-background/80 p-3 shadow-lg active:bg-background">
        <Plus color={colors.text} size={20} />
      </TouchableOpacity>

      {/* Zoom Out Button */}
      <TouchableOpacity
        onPress={onZoomOut}
        className="rounded-full bg-background/80 p-3 shadow-lg active:bg-background">
        <Minus color={colors.text} size={20} />
      </TouchableOpacity>
    </View>
  );
}
