/* eslint-disable react/require-default-props */
import React from 'react';
import { Pressable, Text, TextStyle, ViewStyle } from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  onPress: () => void;
  btnStyle?: ViewStyle;
  textStyle?: TextStyle;
  testId?: string;
  disabled?: boolean;
};

const BorderButton = ({
  text,
  onPress,
  btnStyle,
  textStyle,
  testId,
  disabled,
}: Props) => {
  const { Layout, Colors, Fonts, Gutters } = useTheme();

  return (
    <Pressable
      disabled={disabled}
      testID={testId ? testId : 'button'}
      onPress={onPress}
      style={({ pressed }) => [
        style(Gutters, Layout, pressed, Colors).button,
        { ...btnStyle },
      ]}
    >
      <Text style={[Fonts.textRegularBold, textStyle]}>{text}</Text>
    </Pressable>
  );
};

export default BorderButton;
