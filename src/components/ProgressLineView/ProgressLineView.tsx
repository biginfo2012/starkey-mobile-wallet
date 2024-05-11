import React from 'react';
import { View } from 'react-native';

import useTheme from 'hooks/useTheme';
import Variables from 'theme/Variables';

import { VerticalSeparatorView } from '..';
import { style } from './styles';

type Props = {
  countLength: number;
  selectedCount: number;
};

export default function ProgressLineView({
  selectedCount,
  countLength,
}: Props) {
  const { Layout, Colors } = useTheme();

  const arr = Array.from({ length: countLength }, (value, index) => index);

  return (
    <View style={Layout.rowCenter}>
      {arr.map((item, index) => (
        <View key={item}>
          <View
            style={[
              style().viewLine,
              {
                backgroundColor:
                  index < selectedCount ? Colors.textPurple : Colors.blackGray,
              },
            ]}
          />
          <VerticalSeparatorView spacing={Variables.MetricsSizes.tinyMedium} />
        </View>
      ))}
    </View>
  );
}
