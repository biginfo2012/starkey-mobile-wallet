import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';

import useTheme from 'hooks/useTheme';

import { style } from './styles';

type Props = {
  overlayText: string;
  onPress: () => void;
};

export default function MaskViewWithOverlay({ overlayText, onPress }: Props) {
  const { Gutters, Layout, Images, Fonts } = useTheme();

  return (
    <TouchableOpacity
      testID="mask_view"
      onPress={onPress}
      style={style(Layout).container}
    >
      <ImageBackground
        style={style(Layout).maskImageBg}
        source={Images.ic_mask}
      />
      <View style={style(Layout).maskOverLayView}>
        <Image style={style(Layout).image} source={Images.ic_eye} />
        <Text style={{ ...Fonts.textRegularBold, ...Gutters.tinyLMargin }}>
          {overlayText}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
