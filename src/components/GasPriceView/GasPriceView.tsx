import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';

import { t } from 'i18next';
import Variables from 'theme/Variables';

import { AmountView, GradientSlider, HorizontalSeparatorView } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  seconds: string;
  amount: string;
  usdAmount: string;
  tokenType: string;
  sliderValue: number;
  setSliderValue: Dispatch<SetStateAction<number>>;
  // eslint-disable-next-line react/require-default-props
  borderColor?: string;
  // eslint-disable-next-line react/require-default-props
  minValue?: number;
  gasUnit: string;
  values: any[];
};

const GasPriceView = ({
  seconds,
  amount,
  usdAmount,
  tokenType,
  sliderValue,
  setSliderValue,
  borderColor,
  minValue,
  gasUnit,
  values,
}: Props) => {
  const { Layout, Colors, Gutters } = useTheme();

  const gasList = [
    {
      id: 1,
      title: t('common:estimated_gas_fee'),
      amount: amount,
      usdAmount: usdAmount,
      tokenType: tokenType,
    },
    {
      id: 2,
      title: t('common:estimated_time'),
      amount: t('common:seconds', {
        seconds: seconds,
      }),
    },
  ];

  return (
    <View
      style={[
        style(Gutters, Layout, Colors).container,
        borderColor ? { borderColor: borderColor } : {},
      ]}
    >
      {sliderValue >= 0 ? (
        <>
          <AmountView
            title={t('common:max_fee')}
            amount={t('common:gwei_amount', {
              amount: sliderValue.toFixed(8).replace(/\.?0+$/, ''),
              gasUnit: gasUnit,
            })}
          />
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
          <GradientSlider
            values={values}
            setSliderValue={setSliderValue}
            minValue={minValue ?? 0}
          />
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        </>
      ) : (
        <></>
      )}

      {gasList?.map(item => (
        <AmountView
          key={item?.id}
          title={item?.title}
          amount={
            Number(item?.amount)
              .toFixed(13)
              .replace(/\.?0+$/, '') === 'NaN'
              ? item?.amount
              : Number(item?.amount)
                  .toFixed(13)
                  .replace(/\.?0+$/, '')
          }
          usdAmount={item?.usdAmount}
          tokenType={item?.tokenType}
        />
      ))}
    </View>
  );
};

export default GasPriceView;
