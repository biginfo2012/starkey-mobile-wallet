import React from 'react';
import { View, Text } from 'react-native';

import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import { style } from './style';

type Props = {
  text: string;
};
export default function TagView(props: Props) {
  const { text } = props;
  const { Colors, Gutters, Fonts } = useTheme();

  return text ? (
    <View
      style={[
        style(Gutters).container,
        {
          backgroundColor: applyOpacityToHexColor(
            text === t('common:PRO') ? Colors.textPurple : Colors.textSuccess,
            0.2,
          ),
        },
      ]}
    >
      <Text
        style={[
          Fonts.textSmallTinyWhiteMedium,
          {
            color:
              text === t('common:PRO') ? Colors.textPurple : Colors.textSuccess,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  ) : null;
}
