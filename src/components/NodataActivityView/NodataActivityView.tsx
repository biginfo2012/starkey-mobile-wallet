import React from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

import Variables from 'theme/Variables';

import { Button, HorizontalSeparatorView } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  iconPath: ImageSourcePropType;
  onButtonPress?: () => void;
  buttonText?: string;
};

const NodataActivityView = ({
  text,
  iconPath,
  onButtonPress,
  buttonText,
}: Props) => {
  const { Layout, Fonts, Gutters } = useTheme();

  return (
    <View style={[Layout.fill, Layout.center]}>
      <Image style={style(Gutters).icon} source={iconPath} />
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <Text style={Fonts.textSmallTinyGrayOpacityBold}>{text}</Text>
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
      {onButtonPress && (
        <Button
          onPress={onButtonPress}
          text={buttonText ?? ''}
          btnStyle={style(Gutters).button}
        />
      )}
    </View>
  );
};

NodataActivityView.defaultProps = {
  onButtonPress: undefined,
  buttonText: '',
};

export default NodataActivityView;
