/* eslint-disable react/require-default-props */
import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { gradientColorAngle } from 'theme/Helper/constant';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  onPress: () => void;
  colors?: [];
  btnStyle?: ViewStyle;
  btnTextColor?: string;
  disabled?: boolean;
  testId?: string;
};

const Button = ({
  text,
  onPress,
  colors,
  btnStyle,
  btnTextColor,
  disabled,
  testId,
}: Props) => {
  const { Layout, Colors, Fonts, Gutters } = useTheme();

  return (
    <LinearGradient
      style={[style(Gutters, Layout).circleGradient, { ...btnStyle }]}
      useAngle={true}
      angle={gradientColorAngle}
      colors={colors ? colors : Colors.primaryGradientColor}
    >
      <Pressable
        disabled={disabled}
        testID={testId ? testId : 'button'}
        onPress={onPress}
        style={style(Gutters, Layout).button}
      >
        <Text
          style={[
            Fonts.textRegularBold,
            { color: btnTextColor ? btnTextColor : Colors.white },
          ]}
        >
          {text}
        </Text>
      </Pressable>
    </LinearGradient>
  );
};

Button.defaultProps = {
  colors: undefined,
  btnTextColor: '',
  disabled: false,
};

export default Button;
