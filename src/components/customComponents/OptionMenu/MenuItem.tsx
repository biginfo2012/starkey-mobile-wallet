/* eslint-disable react/require-default-props */
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  PressableProps,
  Text,
  View,
} from 'react-native';

import useTheme from 'hooks/useTheme';

import { style } from './style';

export type MenuItemProps = {
  disabled?: boolean;
  text: string;
  iconPath?: ImageSourcePropType;
  isShowBorder?: boolean;
} & PressableProps;

export function MenuItem({
  disabled = false,
  onPress,
  iconPath,
  text,
  isShowBorder,
  ...props
}: MenuItemProps) {
  const { Gutters, Layout, Fonts, Colors } = useTheme();

  return (
    <Pressable disabled={disabled} onPress={onPress} {...props}>
      <View
        style={
          isShowBorder
            ? style(Gutters, Layout, Colors).viewItemWithBorder
            : style(Gutters, Layout, Colors).viewItem
        }
      >
        <Text style={[Fonts.textRegularBlack, Layout.scrollSpaceAround]}>
          {text}
        </Text>
        <Image
          style={style(Gutters, Layout, Colors).eyeIcon}
          source={iconPath}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
}
