import React from 'react';
import { Text, View } from 'react-native';

import { t } from 'i18next';
import Variables from 'theme/Variables';

import { HorizontalSeparatorView } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
};

const BorderWalletAddressView = ({ text }: Props) => {
  const { Layout, Colors, Fonts, Gutters } = useTheme();

  return (
    <View style={[style(Gutters, Layout, Colors).button]}>
      <Text style={Fonts.textTinyDescriptionBold}>
        {t('common:wallet_address')}
      </Text>
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.tinyMedium} />
      <Text style={Fonts.textTinyBoldWhite}>{text}</Text>
    </View>
  );
};

export default BorderWalletAddressView;
