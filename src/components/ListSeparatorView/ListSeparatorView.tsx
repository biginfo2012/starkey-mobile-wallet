/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-scaling';

import useTheme from 'hooks/useTheme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import Variables from 'theme/Variables';

const ListSeparatorView = () => {
  const { Layout, Colors } = useTheme();

  return (
    <View
      style={[
        Layout.fullWidth,
        {
          height: 1,
          backgroundColor: applyOpacityToHexColor(Colors.textGray400, 0.5),
          marginLeft: scale(Variables.MetricsSizes.large + 10),
        },
      ]}
    />
  );
};

export default ListSeparatorView;
