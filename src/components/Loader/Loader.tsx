import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from 'store/index';

import { ActivityIndicatorLoader } from '..';

export default function Loader() {
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);

  return isLoading ? (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        position: 'absolute',
        backgroundColor: 'transparent',
      }}
    >
      <ActivityIndicatorLoader />
    </View>
  ) : (
    <></>
  );
}
