import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import useTheme from 'hooks/useTheme';

import { style } from './style';

const FooterLoader = () => {
  const { Layout } = useTheme();
  return (
    <View style={style(Layout).container}>
      <ActivityIndicator size={30} />
    </View>
  );
};

export default FooterLoader;
