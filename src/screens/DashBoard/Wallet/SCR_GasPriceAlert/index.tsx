import React, { useState } from 'react';
import { Keyboard, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  InputBox,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import {
  USDollar,
  getRoundDecimalValue,
  showGasPriceAlertModal,
} from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';
import { GasPriceAlertPopUpItem } from 'types/applicationInterfaces';

import { style } from './style';

const GasPriceAlert: React.FC<any> = () => {
  const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const currentTokenInfo = useSelector((state: RootState) => {
    return state.wallet.data.currentSelectedToken;
  });

  const [gasPriceValue, setGasPriceValue] = useState('');
  const [usdPriceValue, setUsdPriceValue] = useState('');

  const [disableGasPrice, setDisableGasPrice] = useState(false);
  const [disableUsdPrice, setDisableUsdPrice] = useState(false);

  const handleGasPriceChange = text => {
    setDisableUsdPrice(!!text);

    setGasPriceValue(text);
    let usdPrice = text * Math.pow(10, -9) * currentTokenInfo?.usdAmount;

    setUsdPriceValue(getRoundDecimalValue(usdPrice, 7));
  };

  const handleUsdPriceChange = text => {
    setDisableGasPrice(!!text);

    // Remove non-numeric characters and limit the length to 3
    const numericValue = text.replace(/[^0-9.]/g, '').slice(0, 10);

    // Check for invalid cases (e.g., greater than 99) and set the input value accordingly
    if (numericValue === '.' || parseFloat(numericValue) > 99) {
      setUsdPriceValue('');
      setGasPriceValue('');
    } else {
      setUsdPriceValue(numericValue);

      let gasPrice =
        (numericValue / currentTokenInfo?.usdAmount) * Math.pow(10, 9);

      setGasPriceValue(getRoundDecimalValue(gasPrice, 3).toString());
    }
  };

  const formatValueWithDollarSign = () => {
    return `$${usdPriceValue}`;
  };

  const onPressDone = () => {
    Keyboard.dismiss();
    showGasPriceAlertModal(gasPriceAlertPopUpObj);
  };

  const callOk = () => {
    navigation.popToTop();
  };

  const onPressCancel = () => {};

  let gasPriceAlertPopUpObj = {
    type: 'setGasPriceAlert',
    tokenWithAmount:
      gasPriceValue +
      ' ' +
      (currentTokenInfo?.tokenGasFeeUnitToDisplay
        ? currentTokenInfo?.tokenGasFeeUnitToDisplay
        : t('common:gwei')),
    usdAmount: USDollar(7).format(Number(usdPriceValue)),
    onPressOk: callOk,
    onPressCancel: onPressCancel,
    imagePath: Images.ic_fuel_tank,
  } as GasPriceAlertPopUpItem;

  return (
    <View
      style={[
        Common.containerFillWithSmallHPadding,
        style(Gutters, Layout, Colors).container,
      ]}
    >
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <HeaderWithTitleAndSubTitle
        title={t('wallet:set_gas_price_alert')}
        onPressNext={() => {
          if (!gasPriceValue || !usdPriceValue) {
            return;
          }

          onPressDone();
        }}
        isNextDisabled={!gasPriceValue || !usdPriceValue}
        rightButtonText={t('common:Done')}
      />

      <HorizontalSeparatorView spacing={Variables.MetricsSizes.tinySmall} />

      <Text style={Fonts.textSmallDescriptionBold}>
        {t('wallet:gas_price')}
      </Text>

      <HorizontalSeparatorView spacing={Variables.MetricsSizes.tiny} />

      <View style={style(Gutters, Layout).inputRawContainer}>
        <View style={style(Gutters, Layout).flex05}>
          <InputBox
            onChangeText={handleGasPriceChange}
            placeholder={t('wallet:zero_gwei', {
              tokenName: currentTokenInfo?.tokenGasFeeUnitToDisplay
                ? currentTokenInfo?.tokenGasFeeUnitToDisplay
                : t('common:gwei'),
            })}
            keyboardType="numeric"
            value={gasPriceValue}
            editable={!disableGasPrice}
            maxLength={10}
            backGroundColor={Colors.blackGray}
          />
        </View>
        <Text style={[Fonts.textSmallBold, style(Gutters, Layout).txtStyle]}>
          {t('common:or')}
        </Text>
        <View style={style(Gutters, Layout).flex05}>
          <InputBox
            onChangeText={handleUsdPriceChange}
            placeholder={t('wallet:zero_usd')}
            value={formatValueWithDollarSign()}
            editable={!disableUsdPrice}
            keyboardType="numeric"
            maxLength={11}
            backGroundColor={Colors.blackGray}
          />
        </View>
      </View>
    </View>
  );
};

export default GasPriceAlert;
