import React from 'react';
import { Text } from 'react-native';

import useTheme from 'hooks/useTheme';

type Props = {
  text: string;
  pattern: string;
};

const HighlightedText = (props: Props) => {
  const { text, pattern } = props;

  const { Colors, Fonts } = useTheme();

  const regexPattern = new RegExp(`(${pattern})`, 'g');
  const parts = text.split(regexPattern);
  return (
    <Text>
      {parts.map((part, index) => {
        if (part.match(regexPattern)) {
          return (
            <Text
              key={index}
              style={[Fonts.textSmallBoldWhite, { color: Colors?.textPurple }]}
            >
              {part}
            </Text>
          );
        } else {
          return (
            <Text key={index} style={Fonts.textSmallRegular}>
              {part}
            </Text>
          );
        }
      })}
    </Text>
  );
};

export default HighlightedText;
