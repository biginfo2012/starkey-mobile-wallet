import React, { memo, useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageBackground,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';

import { Menu, MenuItem } from 'components/customComponents/OptionMenu';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import { showToast } from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';

import HorizontalSeparatorView from '../HorizontalSeparatorView/HorizontalSeparatorView';
import TokenAction from '../TokenAction/TokenAction';
import { style } from './styles';

type Props = {
  amount: string;
  usdAmount: string;
  gasPriceGwei: string;
  usdGasPriceGwei: string;
  onPressHide: () => void;
  onPressAlert: () => void;
  onPressReceive: () => void;
  onPressSend: () => void;
  onPressSwap: () => void;
  onPressBuy: () => void;
  tokenIconPath: ImageSourcePropType;
  onPressFavorite: () => void;
  onPressCollect: (() => void) | null;
  isFavorite: boolean;
  shouldShowBalance?: boolean;
  isGasFeeFetching?: boolean;
  isShowHide?: boolean;
};

const TokenGasPriceView = (props: Props) => {
  const { Layout, Gutters, Fonts, Images, Colors } = useTheme();

  const {
    amount,
    usdAmount,
    gasPriceGwei,
    usdGasPriceGwei,
    // onPressAlert,
    onPressReceive,
    onPressSend,
    // onPressSwap,
    onPressBuy,
    onPressHide,
    tokenIconPath,
    onPressFavorite,
    onPressCollect,
    isFavorite,
    shouldShowBalance,
    isGasFeeFetching,
    isShowHide,
  } = props;

  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

  useUpdateEffect(() => {
    if (isFavorite) {
      showToast('success', t('common:added_to_favorites'));
    } else {
      showToast('error', t('common:removed_from_favorites'));
    }
  }, [isFavorite]);

  const renderOptionMenu = () => (
    <View style={style(Gutters, Layout, Colors).menuRow}>
      {!isShowHide && (
        <Menu
          visible={visible}
          anchor={
            <TouchableOpacity
              style={style(Gutters, Layout, Colors).menuBtn}
              onPress={showMenu}
            >
              <Image
                style={style(Gutters, Layout, Colors).menuIcon}
                source={Images.ic_option_menu_horizontal}
                resizeMode="contain"
              />
            </TouchableOpacity>
          }
          onRequestClose={hideMenu}
          style={style(Gutters, Layout, Colors).menuView}
        >
          <MenuItem
            onPress={() => {
              hideMenu();
              onPressHide();
            }}
            text={t('wallet:hide_token')}
            iconPath={Images.ic_eye_off}
          />
        </Menu>
      )}

      <TouchableOpacity
        style={[
          style(Gutters, Layout, Colors).menuBtn,
          style(Gutters, Layout, Colors).menuStarBtn,
        ]}
        onPress={onPressFavorite}
      >
        <Image
          style={style(Gutters, Layout, Colors).menuIcon}
          source={isFavorite ? Images.ic_fill_star : Images.ic_unfill_star}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={style(Gutters, Layout, Colors).container}>
      <ImageBackground
        style={style(Gutters, Layout, Colors).subContainer}
        resizeMode="stretch"
        source={Images.ic_token_bg}
      >
        <View style={style(Gutters, Layout, Colors).viewToken}>
          {tokenIconPath ? (
            <Image
              style={style(Gutters, Layout, Colors).tokenIcon}
              resizeMode="contain"
              source={
                typeof tokenIconPath === 'string'
                  ? { uri: tokenIconPath }
                  : tokenIconPath
              }
            />
          ) : (
            <View style={style(Gutters, Layout, Colors).textImage}>
              <Text style={[Fonts.titleSmall, { color: Colors.blackGray }]}>
                {amount?.split('\n')[1][0]}
              </Text>
            </View>
          )}
          <View style={[Layout.fill]}>
            {!shouldShowBalance ? (
              <Text style={[Fonts.titleMedium]}>{amount}</Text>
            ) : (
              <Image
                style={style(Gutters, Layout, Colors).monkeyIconStyle}
                source={Images.ic_no_evil_monkey}
                resizeMode="contain"
              />
            )}

            {usdAmount && (
              <Text
                style={[
                  Fonts.textSmallBold,
                  {
                    color: applyOpacityToHexColor(Colors.placeholderColor, 0.6),
                  },
                ]}
              >
                {!shouldShowBalance ? usdAmount : t('common:hidden_symbol')}
              </Text>
            )}
          </View>
          {renderOptionMenu()}
        </View>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

        <View style={style(Gutters, Layout, Colors).viewToken}>
          {gasPriceGwei.split(' ')[0] !== '0' || !isGasFeeFetching ? (
            <>
              <Image
                style={style(Gutters, Layout, Colors).gasIcon}
                resizeMode="contain"
                source={Images.ic_gas}
              />
              <Text style={[Fonts.textRegularBold, Layout.fill]}>
                {`${gasPriceGwei}\n`}
                <Text
                  style={[
                    Fonts.textTinyBold,
                    {
                      color: applyOpacityToHexColor(
                        Colors.placeholderColor,
                        0.6,
                      ),
                    },
                  ]}
                >
                  {usdGasPriceGwei}
                </Text>
              </Text>
            </>
          ) : (
            <View>
              <ActivityIndicator color={Colors.white} />
            </View>
          )}
          {/* <BorderButton
            text={t('wallet:alerts')}
            onPress={onPressAlert}
            btnStyle={style(Gutters, Layout, Colors).alertBtn}
            textStyle={Fonts.textSmallBold}
          /> */}
        </View>
      </ImageBackground>
      <View style={style(Gutters, Layout, Colors).viewAction}>
        {onPressCollect && (
          <TokenAction
            text={t('common:Collect')}
            iconPath={Images.ic_collect}
            onPress={onPressCollect}
          />
        )}

        <TokenAction
          text={t('common:Receive')}
          iconPath={Images.ic_receive}
          onPress={onPressReceive}
        />
        <TokenAction
          text={t('common:Send')}
          iconPath={Images.ic_send}
          onPress={onPressSend}
        />
        {/* <TokenAction
          text={t('common:Swap')}
          iconPath={Images.ic_swap}
          onPress={onPressSwap}
        /> */}
        <TokenAction
          text={t('common:Stake')}
          iconPath={Images.ic_spark}
          onPress={onPressBuy}
        />
      </View>
    </View>
  );
};

TokenGasPriceView.defaultProps = {
  shouldShowBalance: false,
  isGasFeeFetching: false,
  isShowHide: false,
};

export default memo(TokenGasPriceView);
