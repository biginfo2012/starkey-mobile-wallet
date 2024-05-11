import React from 'react';
import { View, Text } from 'react-native';

import useTheme from 'hooks/useTheme';
import { USDollar } from 'theme/Helper/common/Function';

type Props = {
  title: string;
  amount: string;
  usdAmount?: string;
  tokenType?: string;
};

export default function AmountView({
  title,
  amount,
  usdAmount,
  tokenType,
}: Props) {
  const { Layout, Fonts, Gutters } = useTheme();
  return (
    <View style={[Layout.rowCenter, Gutters.tinyVMargin]}>
      <Text style={[Fonts.textSmallBoldWhite, Gutters.tinyRMargin]}>
        {title}
      </Text>
      <View style={Layout.fill}>
        <Text style={[Fonts.textSmallBoldWhite, Fonts.textRight]}>
          {`${amount ? amount : 0}${tokenType ? ' ' + tokenType : ''}`}
        </Text>
        {usdAmount && (
          <Text
            style={[Fonts.textSmallTinyGrayOpacityRegular, Fonts.textRight]}
          >
            {usdAmount !== 'NaN' ? usdAmount : USDollar(1).format(0)}
          </Text>
        )}
      </View>
    </View>
  );
}
AmountView.defaultProps = {
  usdAmount: '',
  tokenType: '',
};
