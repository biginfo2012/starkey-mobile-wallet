import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';

import useTheme from 'hooks/useTheme';
import { USDollar, getRoundDecimalValue } from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';

import { HorizontalSeparatorView } from '..';
import { style } from './style';

type Props = {
  iconPath: ImageSourcePropType;
  title: string;
  amount: string;
  usdAmount: string;
  tokenType: string;
};

export default function TokenAmountWithImageView({
  iconPath,
  title,
  amount,
  usdAmount,
  tokenType,
}: Props) {
  const { Layout, Fonts, Colors } = useTheme();

  return (
    <View style={Layout.center}>
      {iconPath ? (
        <Image
          style={style().icon}
          source={typeof iconPath === 'string' ? { uri: iconPath } : iconPath}
        />
      ) : (
        <View style={style(Layout, Colors).textImage}>
          <Text style={[Fonts.titleSmall, { color: Colors?.blackGray }]}>
            {tokenType?.[0]}
          </Text>
        </View>
      )}
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <Text style={Fonts.textOpacityRegularBold}>{title}</Text>
      <Text style={Fonts.textLarge}>
        {getRoundDecimalValue(amount, 6) + ' ' + tokenType}
      </Text>
      <Text style={Fonts.textSmallDescriptionBold}>
        {USDollar(8).format(usdAmount)}
      </Text>
    </View>
  );
}
