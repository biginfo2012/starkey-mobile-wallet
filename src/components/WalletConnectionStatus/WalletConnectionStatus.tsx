import React, { memo } from 'react';
import { View, Text } from 'react-native';

import useWalletConnectionStatus from 'customHooks/useWalletConnectionStatus';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';

import VerticalSeparatorView from '../VerticalSeparatorView/VerticalSeparatorView';
import { style } from './styles';

const WalletConnectionStatus = () => {
  const { status } = useWalletConnectionStatus();
  const { Fonts, Layout, Colors } = useTheme();

  return (
    <View style={{ ...Layout.rowHCenter }}>
      <View
        style={{
          ...style().container,
          backgroundColor:
            status === 'Connected'
              ? Colors.textSuccess
              : applyOpacityToHexColor(Colors.textGray600, 0.3),
        }}
      />
      <VerticalSeparatorView />
      <Text
        testID="status_text"
        style={
          status === 'Connected'
            ? { ...Fonts.textRegularBold }
            : { ...Fonts.text30OpacityRegular }
        }
      >
        {status === 'Connected'
          ? t('common:Connected')
          : t('common:Not_connected')}
      </Text>
    </View>
  );
};

export default memo(WalletConnectionStatus);
