import React from 'react';
import { Text, Image, TouchableOpacity, View } from 'react-native';

import { t } from 'i18next';

import { useTheme } from '../../hooks';
import { style } from './style';

type Props = {
  onPressSort: () => void;
  isChecked: boolean;
  setIsChecked: () => void;
};

const WalletFilterControlView = ({
  onPressSort,
  isChecked,
  setIsChecked,
}: Props) => {
  const { Fonts, Gutters, Images, Layout } = useTheme();

  const handleCheck = () => {
    setIsChecked(!isChecked);
  };
  return (
    <>
      <View style={style(Layout).container}>
        <TouchableOpacity style={Gutters.tinyRMargin} onPress={handleCheck}>
          <Image
            style={style(Layout).icon}
            source={isChecked ? Images.ic_check_white : Images.ic_uncheck_white}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={[Fonts.textTinyRegular, Layout.fill]}>
          {t('wallet:hide_zero_balance')}
        </Text>
        <TouchableOpacity onPress={onPressSort}>
          <Image
            style={style(Layout).icon}
            source={Images.ic_ascending}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default WalletFilterControlView;
