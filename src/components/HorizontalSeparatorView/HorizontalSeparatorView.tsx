import React from 'react';
import { View } from 'react-native';
import { scale } from 'react-native-size-scaling';

type Props = {
  spacing?: number | string;
};

const HorizontalSeparatorView = ({ spacing }: Props) => {
  return (
    <View
      style={{
        height: spacing
          ? typeof spacing === 'string'
            ? spacing
            : scale(spacing)
          : scale(8),
      }}
    />
  );
};

HorizontalSeparatorView.defaultProps = {
  spacing: null,
};

export default HorizontalSeparatorView;
