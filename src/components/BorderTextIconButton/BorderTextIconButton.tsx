import React, { memo } from 'react';
import { Image, Pressable, Text, TextStyle, ViewStyle } from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  onPress: () => void;
  leftIconImage: any;
  btnStyle?: ViewStyle;
  textStyle?: TextStyle;
  rightIconImage?: any;
};

const BorderTextIconButton = ({
  text,
  onPress,
  leftIconImage,
  btnStyle,
  textStyle,
  rightIconImage,
}: Props) => {
  const { Layout, Colors, Fonts, Gutters } = useTheme();

  return (
    <Pressable
      testID="button"
      onPress={onPress}
      style={({ pressed }) => [
        style(Gutters, Layout, pressed, Colors).button,
        { ...btnStyle },
      ]}
    >
      <Image
        resizeMode="contain"
        style={style(Gutters, Layout, false, Colors).image}
        source={leftIconImage}
      />

      <Text style={[Fonts.textSmallBold, textStyle]}>{text}</Text>
      {rightIconImage && (
        <Image
          resizeMode="contain"
          style={style(Gutters, Layout, false, Colors).rightImage}
          source={rightIconImage}
        />
      )}
    </Pressable>
  );
};

BorderTextIconButton.defaultProps = {
  btnStyle: {},
  textStyle: {},
  rightIconImage: undefined,
};
export default memo(BorderTextIconButton);
