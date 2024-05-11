import React from 'react';
import { View, Text, Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  Button,
  DashBoardHeader,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

const SwapReview = () => {
  const { Gutters, Layout, Common, Images, Colors, Fonts } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <SafeAreaWrapper>
      <BackgroundView
        image={Images.background.ic_backgroundGradientWalletLayer}
      />
      <View style={Layout.fullWidth}>
        <DashBoardHeader
          testID="Wallet_DashBoardHeader"
          containerStyle={Common.smallHPadding}
          leftImage={Images.ic_back}
          onPressLeftImage={() => {
            navigation.goBack();
          }}
        />
      </View>
      {/* Root Container */}
      <View style={Common.containerFillWithSmallHPadding}>
        {/* Token Swap Details */}
        <View style={style(Gutters, Layout).tokenDetailsContainer}>
          {/* Swap From Raw 1 */}
          <View style={Layout.alignItemsCenter}>
            <Text
              style={[
                Fonts.textSmallBold,
                Gutters.extraTinyBMargin,
                {
                  color: applyOpacityToHexColor(Colors?.placeholderColor, 0.6),
                },
              ]}
            >
              {t('swap:Swap')}
            </Text>
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <Image
                source={Images.ic_binance}
                style={style(Gutters, Layout).tokenIcon}
                resizeMode="contain"
              />
              <Text style={Fonts.titleMedium}>{'500 DAI'}</Text>
            </View>
          </View>

          {/* Down Icon Raw 2*/}
          <View style={Layout.alignItemsCenter}>
            <View
              style={[
                style(Gutters, Layout).shadow,
                {
                  shadowColor: applyOpacityToHexColor(Colors?.textGray800, 0.3),
                },
              ]}
            >
              <Image
                source={Images.ic_swap_down}
                style={style(Gutters, Layout).swapDownIcon}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Swap To Raw 3 */}
          <View style={Layout.alignItemsCenter}>
            <Text
              style={[
                Fonts.textSmallBold,
                Gutters.extraTinyBMargin,
                {
                  color: applyOpacityToHexColor(Colors?.placeholderColor, 0.6),
                },
              ]}
            >
              {t('swap:receive')}
            </Text>
            <View style={[Layout.row, Layout.alignItemsCenter]}>
              <Image
                source={Images.ic_binance}
                style={style(Gutters, Layout).tokenIcon}
                resizeMode="contain"
              />
              <Text style={Fonts.titleMedium}>{'0.81 ETH'}</Text>
            </View>
          </View>
        </View>

        {/* Swap Details Container */}
        <View
          style={[
            style(Gutters, Layout).reviewDetailsContainer,
            {
              backgroundColor: applyOpacityToHexColor(
                Colors?.inputBackground,
                0.4,
              ),
            },
          ]}
        >
          {/* Provider Raw 1 */}
          <View
            style={[
              style(Gutters, Layout).rowSpaceBetweenContainer,
              Gutters.tinyMediumVPadding,
              Layout.alignItemsCenter,
            ]}
          >
            <Text style={Fonts.textSmallBold}>{t('swap:provider')}</Text>
            <Text style={Fonts.textSmallBold}>{'Uniswap'}</Text>
          </View>
          {/* Rate Raw 2 */}
          <View
            style={[
              style(Gutters, Layout).rowSpaceBetweenContainer,
              Gutters.tinyMediumVPadding,
              Layout.alignItemsCenter,
            ]}
          >
            <Text style={Fonts.textSmallBold}>{t('swap:rate')}</Text>
            <Text style={Fonts.textSmallBold}>{'1 DAI ≈ 0.0016 ETH'}</Text>
          </View>
          {/* Estimated Fee Raw 3 */}
          <View
            style={[
              style(Gutters, Layout).rowSpaceBetweenContainer,
              Gutters.tinyMediumVPadding,
              Layout.alignItemsCenter,
            ]}
          >
            <Text style={Fonts.textSmallBold}>{t('swap:estimated_fee')}</Text>
            <Text style={Fonts.textSmallBold}>{'3.8695 DAI'}</Text>
          </View>
          {/* Estimated Time Raw 4*/}
          <View
            style={[
              style(Gutters, Layout).rowSpaceBetweenContainer,
              Gutters.tinyMediumVPadding,
              Layout.alignItemsCenter,
            ]}
          >
            <Text style={Fonts.textSmallBold}>{t('swap:estimated_time')}</Text>
            <Text style={Fonts.textSmallBold}>{t('swap:minutes')}</Text>
          </View>
        </View>

        {/* Swap Button */}
        <Button
          text={t('swap:Swap')}
          onPress={() => {
            navigation.navigate(ScreenNames.SwapActivity);
          }}
          btnStyle={style(Gutters, Layout).swapBtn}
          btnTextColor={Colors.white}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default SwapReview;
