import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  onPress: () => void;
  backGroundColor?: string;
  btnStyle?: ViewStyle;
  iconPath: ImageSourcePropType;
  textColor?: string;
};

const ButtonWithIcon = ({
  text,
  onPress,
  backGroundColor,
  btnStyle,
  iconPath,
  textColor,
}: Props) => {
  const { Layout, Colors, Fonts, Gutters } = useTheme();

  return (
    <Pressable
      testID="button"
      onPress={onPress}
      style={[
        style(
          Gutters,
          Layout,
          backGroundColor ? backGroundColor : Colors.primary,
        ).button,
        { ...btnStyle },
      ]}
    >
      <Text
        style={[
          Fonts.textRegularBold,
          Layout.fill,
          { color: textColor ? textColor : Colors.textWhite },
        ]}
      >
        {text}
      </Text>
      <Image
        style={
          style(
            Gutters,
            Layout,
            backGroundColor ? backGroundColor : Colors.primary,
          ).icon
        }
        source={iconPath}
      />
    </Pressable>
  );
};

ButtonWithIcon.defaultProps = {
  textColor: '',
  backGroundColor: '',
  btnStyle: {},
};

export default ButtonWithIcon;
