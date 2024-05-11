import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import useTheme from 'hooks/useTheme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import { style } from './styles';

type Props = {
  isEnabled: boolean;
  onPress: () => void;
};

const CustomToggleSwitch = ({ isEnabled, onPress }: Props) => {
  const { Layout, Colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      testID="customToggleSwitch"
    >
      <LinearGradient
        angle={160}
        useAngle
        colors={
          isEnabled
            ? Colors.switchGradientColor
            : [
                applyOpacityToHexColor(Colors.switchBGColor, 0.3),
                applyOpacityToHexColor(Colors.switchBGColor, 0.3),
              ]
        }
        style={[style(Layout, Colors).container]}
      >
        {isEnabled ? (
          <View
            style={[
              style(Layout, Colors).toggle,
              style(Layout, Colors).toggleOn,
            ]}
          />
        ) : (
          <View
            style={[
              style(Layout, Colors).toggle,
              style(Layout, Colors).toggleOff,
            ]}
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomToggleSwitch;
