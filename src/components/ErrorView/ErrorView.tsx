import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TextStyle,
  View,
} from 'react-native';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  iconPath?: ImageSourcePropType;
  textColor: string;
  textStyle?: TextStyle;
};

const ErrorView = ({ text, iconPath, textColor, textStyle }: Props) => {
  const { Layout, Gutters, Fonts } = useTheme();

  return (
    <View style={style(Gutters, Layout).container}>
      {iconPath && (
        <Image
          style={style(Gutters, Layout).icon}
          resizeMode="contain"
          source={iconPath}
        />
      )}
      <Text
        style={[Fonts.textTinyBold, textStyle, { color: textColor }]}
        testID="errorMessage"
      >
        {text}
      </Text>
    </View>
  );
};

ErrorView.defaultProps = {
  iconPath: undefined,
  textStyle: {},
};
export default ErrorView;
