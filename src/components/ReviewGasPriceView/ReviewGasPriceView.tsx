import React from 'react';
import { View } from 'react-native';

import { t } from 'i18next';

import { AmountView } from '..';
import { useTheme } from '../../hooks';

type Props = {
  seconds: string;
  gasAmount: string;
  gasUsdAmount: string;
  totalAmount: string;
  totalUsdAmount: string;
  tokenType: string;
};

const ReviewGasPriceView = ({
  seconds,
  gasAmount,
  gasUsdAmount,
  totalAmount,
  totalUsdAmount,
  tokenType,
}: Props) => {
  const { Layout } = useTheme();

  const gasList = [
    {
      id: 1,
      title: t('common:estimated_gas_fee'),
      amount: gasAmount,
      usdAmount: gasUsdAmount,
      tokenType: tokenType,
    },
    {
      id: 2,
      title: t('common:estimated_time'),
      amount: t('common:seconds', {
        seconds: seconds,
      }),
    },
    {
      id: 3,
      title: t('common:total_cost'),
      amount: totalAmount,
      usdAmount: totalUsdAmount,
      tokenType: '',
    },
  ];
  return (
    <View style={Layout.fullWidth}>
      {gasList?.map(item => (
        <AmountView
          key={item?.id}
          title={item?.title}
          amount={item?.amount}
          usdAmount={item?.usdAmount}
          tokenType={item?.tokenType}
        />
      ))}
    </View>
  );
};

export default ReviewGasPriceView;
