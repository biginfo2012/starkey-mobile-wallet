import React from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-scaling';

import { useTheme } from '../../hooks';

type Props = {
  spacing?: number;
};

const VerticalSeparatorView = ({ spacing }: Props) => {
  const { MetricsSizes } = useTheme();

  return (
    <View
      style={{ width: spacing ? scale(spacing) : scale(MetricsSizes.tiny) }}
    />
  );
};

VerticalSeparatorView.defaultProps = {
  spacing: null,
};

export default VerticalSeparatorView;
