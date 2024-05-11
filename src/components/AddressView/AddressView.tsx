import React, { memo } from 'react';
import {
  Image,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';
import { t } from 'i18next';
import { showToast } from 'theme/Helper/common/Function';

import { useTheme } from '../../hooks';
import { style } from './styles';

type Props = {
  text: string;
  btnStyle?: ViewStyle;
  textStyle?: TextStyle;
  walletAddress: string;
};

const AddressView = ({ text, btnStyle, textStyle, walletAddress }: Props) => {
  const { Layout, Colors, Fonts, Gutters, Images } = useTheme();
  return (
    <View
      style={[style(Gutters, Layout, Colors).button, { ...btnStyle }]}
      testID="button"
    >
      <Text style={[Fonts.textSmallTinyWhiteMedium, textStyle]}>{text}</Text>
      <Pressable
        onPress={() => {
          showToast('success', t('common:Wallet_address_copied'));
          Clipboard.setString(walletAddress);
        }}
      >
        <Image
          resizeMode="contain"
          style={style(Gutters, Layout, Colors).rightImage}
          source={Images.ic_copy_gray}
        />
      </Pressable>
    </View>
  );
};

AddressView.defaultProps = {
  btnStyle: {},
  textStyle: {},
};
export default memo(AddressView);
