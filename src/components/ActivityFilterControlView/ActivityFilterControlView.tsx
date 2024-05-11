import React from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './style';

type Props = {
  onPressFilter: () => void;
  title: string;
};

const ActivityFilterControlView = ({ onPressFilter, title }: Props) => {
  const { Fonts, Images, Layout } = useTheme();

  return (
    <View style={style(Layout).container}>
      <Text style={[Fonts.textSmallMediumExtraBold, Layout.fill]}>{title}</Text>
      <TouchableOpacity testID="Filter" onPress={onPressFilter}>
        <Image
          style={style(Layout).icon}
          source={Images.ic_filter}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default ActivityFilterControlView;
