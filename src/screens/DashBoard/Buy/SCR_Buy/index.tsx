import React from 'react';
import { View } from 'react-native';

import { BorderButton, SafeAreaWrapper } from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';

import { style } from './style';

const Buy: React.FC<any> = () => {
  const { Gutters, Layout } = useTheme();

  return (
    <SafeAreaWrapper>
      <View style={style(Gutters, Layout).subView}>
        <BorderButton text={t('common:Buy')} onPress={() => {}} />
      </View>
    </SafeAreaWrapper>
  );
};

export default Buy;
