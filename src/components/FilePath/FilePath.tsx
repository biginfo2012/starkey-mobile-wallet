import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';

import Variables from 'theme/Variables';

import { VerticalSeparatorView } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  filePath: string;
  onPressClose: () => void;
  iconPath: ImageSourcePropType;
};

const FilePath = ({ filePath, onPressClose, iconPath }: Props) => {
  const { Layout, Fonts, Gutters } = useTheme();

  return (
    <View style={[style(Gutters, Layout).fileUrlView]}>
      <Text style={[Fonts.textSmallBold, Layout.fill]}>{filePath}</Text>
      <VerticalSeparatorView spacing={Variables.MetricsSizes.tiny} />
      <Pressable testID="button" onPress={onPressClose}>
        <Image
          style={[style(Gutters, Layout).icon]}
          resizeMode="contain"
          source={iconPath}
        />
      </Pressable>
    </View>
  );
};

export default FilePath;
