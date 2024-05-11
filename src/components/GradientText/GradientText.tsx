import React, { FC } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import MaskedView from '@react-native-masked-view/masked-view';
import useTheme from 'hooks/useTheme';

import { style } from './styles';

interface GradientTextProps {
  text: string;
  colors: string[];
  fontStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const GradientText: FC<GradientTextProps> = ({
  text,
  colors,
  fontStyle,
  containerStyle,
}) => {
  const { Layout } = useTheme();

  const gradient = (
    <LinearGradient
      colors={colors}
      useAngle={true}
      angle={280}
      angleCenter={{ x: 0.01, y: 0 }}
      style={Layout.fullSize}
    />
  );

  return (
    <View style={[containerStyle]}>
      <MaskedView
        style={Layout.fill}
        maskElement={<Text style={[fontStyle]}>{text}</Text>}
      >
        {gradient}
        <Text style={[fontStyle, style().fontOpacity]}>{text}</Text>
      </MaskedView>
    </View>
  );
};

GradientText.defaultProps = {
  fontStyle: {} as TextStyle,
  containerStyle: {},
};

export default GradientText;
