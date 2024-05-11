import React from 'react';
import { Image, ImageSourcePropType, Pressable, Text } from 'react-native';

import Variables from 'theme/Variables';

import { useTheme } from '../../hooks';
import HorizontalSeparatorView from '../HorizontalSeparatorView/HorizontalSeparatorView';
import { style } from './styles';

type Props = {
  text: string;
  onPress: () => void;
  iconPath: ImageSourcePropType;
};

const TokenAction = ({ text, onPress, iconPath }: Props) => {
  const { Layout, Fonts } = useTheme();

  return (
    <Pressable testID="button" onPress={onPress} style={[style(Layout).button]}>
      <Image
        style={[style(Layout).icon]}
        resizeMode="contain"
        source={iconPath}
      />
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.tinyMedium} />
      <Text style={Fonts.textExtraTinyRegular}>{text}</Text>
    </Pressable>
  );
};

export default TokenAction;
