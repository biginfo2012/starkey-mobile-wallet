import React, { memo } from 'react';
import { Image, Text, View } from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  item: any;
};

const NetworkItem = ({ item }: Props) => {
  const { Layout, Gutters, Fonts } = useTheme();

  return (
    <View style={[style(Gutters, Layout).container]}>
      <Image
        style={style(Gutters, Layout).icon}
        resizeMode="contain"
        source={item?.image}
      />
      <Text
        style={[Fonts.titleSmall, Gutters.tinyVMargin, Gutters.tinyLMargin]}
        numberOfLines={1}
      >
        {item?.title}
      </Text>
    </View>
  );
};

export default memo(NetworkItem);
