import React from 'react';
import { Image, Text, View } from 'react-native';

import { t } from 'i18next';

import { AnimatedRotate } from '..';
import { useTheme } from '../../hooks';
import { style } from './styles';

const TransactionProgressView = () => {
  const { Layout, Colors, Gutters, Images, Fonts } = useTheme();

  return (
    <View style={[style(Gutters, Layout, Colors).container]}>
      <AnimatedRotate
        middleView={
          <Image
            style={style(Gutters, Layout, Colors).iconProgress}
            resizeMode="cover"
            source={Images.ic_pie}
          />
        }
      />
      <View style={style(Gutters, Layout, Colors).textView}>
        <Text style={[Fonts.textSmallTinyWhiteMedium]}>
          {t('common:this_transaction_requires')}
          <Text style={[Fonts.textSmallTinyWhiteBold]}>
            {t('common:block_confirmations')}
          </Text>
          <Text style={[Fonts.textSmallTinyWhiteMedium]}>
            {t('common:to_be_completed')}
          </Text>
        </Text>
      </View>
      <Image
        style={style(Gutters, Layout, Colors).iconInfo}
        resizeMode="contain"
        source={Images.ic_info}
      />
    </View>
  );
};

export default TransactionProgressView;
