import React from 'react';
import { Pressable, Text, ViewStyle } from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  onPress: () => void;
  btnStyle?: ViewStyle;
  testId?: string;
};

const TextButton = ({ text, onPress, btnStyle, testId }: Props) => {
  const { Layout, Fonts, Gutters } = useTheme();

  return (
    <Pressable
      hitSlop={{ top: 16, bottom: 16 }}
      testID={testId ? testId : 'button'}
      onPress={onPress}
      style={[style(Gutters, Layout).button, { ...btnStyle }]}
    >
      <Text style={Fonts.textRegularBold}>{text}</Text>
    </Pressable>
  );
};

TextButton.defaultProps = {
  btnStyle: {},
  testId: undefined,
};
export default TextButton;
