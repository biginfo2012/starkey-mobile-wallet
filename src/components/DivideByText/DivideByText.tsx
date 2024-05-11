import React from 'react';
import { Text } from 'react-native';

import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import { useTheme } from '../../hooks';

type Props = {
  title: string;
  textColor?: string;
};

const DivideByText = ({ title, textColor }: Props) => {
  const { Colors, Fonts, Gutters } = useTheme();

  return (
    <Text
      style={[
        Gutters.extraTinyLMargin,
        Fonts.textCount,
        {
          color: textColor
            ? textColor
            : applyOpacityToHexColor(Colors.placeholderColor, 0.6),
        },
      ]}
    >
      {title}
    </Text>
  );
};

DivideByText.defaultProps = {
  textColor: '',
};

export default DivideByText;
