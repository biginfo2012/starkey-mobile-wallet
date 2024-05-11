import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

import useTheme from 'hooks/useTheme';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import { style } from './style';

interface Props extends TextInputProps {
  hasError?: boolean;
  onChangeValue?: () => void;
}

export default function MultiLineTextInput(props: Props) {
  const { Gutters, Layout, Fonts, Colors } = useTheme();
  const { hasError, onChangeValue } = props;
  return (
    <TextInput
      onChange={onChangeValue}
      testID="text_input"
      textAlignVertical="top"
      multiline
      placeholderTextColor={applyOpacityToHexColor(
        Colors.placeholderColor,
        0.7,
      )}
      {...props}
      style={[
        style(Layout, Colors, Gutters, hasError).container,
        { ...Fonts.textRegular, ...Layout.fill },
      ]}
    />
  );
}

MultiLineTextInput.defaultProps = {
  hasError: false,
  onChangeValue: undefined,
};
