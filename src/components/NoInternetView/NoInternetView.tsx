/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Text, View } from 'react-native';

import { useInternetStatus } from 'customHooks/useInternetStatus';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { DeviceMetrics } from 'theme/Helper/constant';
import Variables from 'theme/Variables';

import { BackgroundView, HorizontalSeparatorView } from '..';
import { style } from './style';

export default function NoInternetView() {
  const isInternetReachable = useInternetStatus();
  const { Layout, Fonts, Colors, Images } = useTheme();

  return (
    <>
      {!isInternetReachable ? (
        <View style={style(Layout, Colors).viewTextStyle}>
          <BackgroundView image={Images.background.ic_backgroundLayer} />
          <Image
            style={{
              height: DeviceMetrics.screenWidth * 0.8,
              aspectRatio: 1,
            }}
            resizeMode="contain"
            source={Images.ic_noInternet}
          />
          <Text style={Fonts.textLarge}>{t('common:oops')}</Text>
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
          <Text style={[Fonts.textMediumRegular, Fonts.textCenter]}>
            {t('common:internetOff')}
          </Text>
        </View>
      ) : (
        <></>
      )}
    </>
  );
}
