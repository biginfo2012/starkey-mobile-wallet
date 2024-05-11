import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { scale, width } from 'react-native-size-scaling';

import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  onPress: () => void;
  isDisabled: boolean;
};

const PhraseView = ({ text, onPress, isDisabled }: Props) => {
  const { Layout, Gutters, Fonts, Colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        style(Gutters, Layout).container,
        {
          width: width / 4 - scale(20),
          backgroundColor: isDisabled
            ? applyOpacityToHexColor(Colors.inputBackground, 0.4)
            : applyOpacityToHexColor(Colors.textPurple, 0.15),
        },
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text
        testID="phraseText"
        style={[
          Fonts.titleSmall,
          {
            color: isDisabled
              ? applyOpacityToHexColor(Colors.textGray600, 0.6)
              : Colors.textPurple,
          },
        ]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default PhraseView;
