import React from 'react';
import { Text, View } from 'react-native';
import { scale, width } from 'react-native-size-scaling';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  borderColor: string;
  index: number;
  position: number;
};

const SelectedPhraseView = ({ text, borderColor, position }: Props) => {
  const { Layout, Fonts, Colors } = useTheme();

  return (
    <View
      style={[
        style(Layout, Colors).container,
        {
          borderColor: borderColor,
          width: width / 3 - scale(16),
        },
      ]}
    >
      {!text && (
        <Text
          style={[Fonts.textRegular, Fonts.textCenter]}
          numberOfLines={1}
          testID="phrasePosition"
        >
          {position}
        </Text>
      )}

      <Text
        testID="phraseText"
        style={[Fonts.textRegular, Layout.fill]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
};

export default SelectedPhraseView;
