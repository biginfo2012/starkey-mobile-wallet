import React from 'react';
import { Image, ImageSourcePropType } from 'react-native';

import { style } from './styles';

type Props = {
  iconPath: ImageSourcePropType;
  color: string;
};

const TabBarIcon = ({ iconPath, color }: Props) => {
  return (
    <Image
      style={[style().icon, { tintColor: color }]}
      resizeMode="contain"
      source={iconPath}
    />
  );
};
export default TabBarIcon;
