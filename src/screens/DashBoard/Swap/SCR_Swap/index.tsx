import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  Button,
  DashBoardHeader,
  SafeAreaWrapper,
  MaxSlippageBottomSheetView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import { showNotificationList } from 'theme/Helper/common/Function';
import { NetWorkType } from 'theme/Helper/constant';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

const initialHeight = scale(64);
const expandedHeight = scale(156);

const Swap: React.FC<any> = () => {
  const { Gutters, Layout, Common, Images, Colors, Fonts } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const [toggleDetails, setToggleDetails] = useState(false);

  const [openMaxSlippageBottomSheet, setOpenMaxSlippageBottomSheet] =
    useState(false);

  const fadeHeight = useRef(new Animated.Value(initialHeight)).current;

  const currentUser = useSelector((state: RootState) => {
    return state.userInfo.data.currentUser;
  });

  const handleShowHideDetails = () => {
    const targetHeight = toggleDetails ? initialHeight : expandedHeight;

    setToggleDetails(!toggleDetails);
    Animated.timing(fadeHeight, {
      toValue: targetHeight,
      duration: 500,
      useNativeDriver: false,
    }).start(({}) => {});
  };

  const handleOnClickNotification = () => {
    const dataObj = {
      isVisible: true,
    };
    showNotificationList(dataObj);
  };

  return (
    <SafeAreaWrapper>
      <BackgroundView
        image={Images.background.ic_backgroundGradientWalletLayer}
      />
      <View style={Layout.fullWidth}>
        <DashBoardHeader
          testID="Wallet_DashBoardHeader"
          containerStyle={Common.smallHPadding}
          leftImage={Images.ic_bell}
          rightImage={
            currentUser.profileIcon ? currentUser.profileIcon : undefined
          }
          userName={currentUser.userName}
          rightSideSecondImage={Images.ic_notes}
          onPressLeftImage={handleOnClickNotification}
          onPressRightSideSecondImage={() => {
            navigation.navigate(ScreenNames.SwapActivity);
          }}
        />
      </View>

      <View style={style(Gutters, Layout, Colors).container}>
        <Text style={Fonts.textLarge}>{t('swap:Swap')}</Text>

        {/* Select Netwok Container */}
        <Pressable
          style={style(Gutters, Layout, Colors).selectNetworkContainer}
          onPress={() => {
            navigation.navigate(ScreenNames.SelectNetwork);
          }}
        >
          <Text style={Fonts.textSmallBold}>{t('swap:network')}</Text>

          <View style={style(Gutters, Layout).textWithNextArrowContainer}>
            <Text style={Fonts.textSmallBold}>{'Ethereum'}</Text>
            <Image
              source={Images.ic_right}
              style={style(Gutters, Layout).nextArrowIcon}
              resizeMode="contain"
            />
          </View>
        </Pressable>

        {/* Swap From To Root Container */}
        <View>
          {/* Swap From Container */}
          <View
            style={style(Gutters, Layout, Colors).enterSwapTokenAmountContainer}
          >
            <View
              style={[
                style(Gutters, Layout).rowSpaceBetweenContainer,
                Gutters.tinyBMargin,
              ]}
            >
              <View style={style(Gutters, Layout).inputContainer}>
                <TextInput
                  onChangeText={() => {}}
                  placeholder={'0'}
                  style={[
                    Fonts.titleMediumMediumExtraBold,
                    Platform.OS === 'android' && {
                      paddingVertical: scale(-12),
                    },
                  ]}
                  placeholderTextColor={applyOpacityToHexColor(
                    Colors?.textGray600,
                    0.6,
                  )}
                  keyboardType="number-pad"
                />
              </View>

              <Pressable
                style={[
                  style(Gutters, Layout).textWithNextArrowContainer,
                  style(Gutters, Layout).textWithIconContainer,
                  {
                    backgroundColor: applyOpacityToHexColor(
                      Colors?.bottomButtonBG,
                      0.24,
                    ),
                  },
                ]}
                onPress={() => {
                  navigation.navigate(ScreenNames.SwapFrom);
                }}
              >
                <Image
                  source={Images.ic_binance}
                  style={style(Gutters, Layout).tokenIcon}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    Fonts.textSmallBold,
                    Gutters.tooExtraTinyHMargin,
                    {
                      color: Colors.textPurple,
                    },
                  ]}
                >
                  {'DAI'}
                </Text>
                <Image
                  source={Images.ic_back}
                  style={style(Gutters, Layout, Colors).nextIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
            <View style={style(Gutters, Layout).rowSpaceBetweenContainer}>
              <Text style={Fonts.textSmallTinyGrayOpacityRegular}>{'$0'}</Text>
              <Text style={Fonts.textSmallTinyGrayOpacityRegular}>
                {`${t('swap:balance')} 600 DAI`}
              </Text>
            </View>
          </View>
          {/* Swap Icon */}
          <Image
            source={Images.ic_swappedRound}
            style={style(Gutters, Layout).swappedIcon}
            resizeMode="contain"
          />
          {/* Swap To Container */}
          <View
            style={style(Gutters, Layout, Colors).enterSwapTokenAmountContainer}
          >
            <View
              style={[
                style(Gutters, Layout).rowSpaceBetweenContainer,
                Gutters.tinyBMargin,
              ]}
            >
              <View style={style(Gutters, Layout).inputContainer}>
                <TextInput
                  onChangeText={() => {}}
                  placeholder={'0'}
                  style={[
                    Fonts.titleMediumMediumExtraBold,
                    Platform.OS === 'android' && {
                      paddingVertical: scale(-12),
                    },
                  ]}
                  placeholderTextColor={applyOpacityToHexColor(
                    Colors?.textGray600,
                    0.6,
                  )}
                  keyboardType="number-pad"
                />
              </View>

              <Pressable
                style={[
                  style(Gutters, Layout).textWithNextArrowContainer,
                  style(Gutters, Layout).textWithIconContainer,
                  {
                    backgroundColor: applyOpacityToHexColor(
                      Colors?.bottomButtonBG,
                      0.24,
                    ),
                  },
                ]}
                onPress={() => {
                  navigation.navigate(ScreenNames.SwapTo);
                }}
              >
                <Image
                  source={Images.ic_binance}
                  style={style(Gutters, Layout).tokenIcon}
                  resizeMode="contain"
                />
                <Text
                  style={[
                    Fonts.textSmallBold,
                    Gutters.tooExtraTinyHMargin,
                    {
                      color: Colors.textPurple,
                    },
                  ]}
                >
                  {NetWorkType.ETH}
                </Text>
                <Image
                  source={Images.ic_back}
                  style={style(Gutters, Layout, Colors).nextIcon}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
            <View style={style(Gutters, Layout).rowSpaceBetweenContainer}>
              <Text style={Fonts.textSmallTinyGrayOpacityRegular}>{'$0'}</Text>
              <Text style={Fonts.textSmallTinyGrayOpacityRegular}>
                {`${t('swap:balance')} 0 ETH`}
              </Text>
            </View>
          </View>
        </View>

        {/* Token Conversation Details Container */}
        <Animated.View
          style={[
            style(Gutters, Layout).borderContainer,
            {
              height: fadeHeight,
              borderColor: applyOpacityToHexColor(Colors?.border, 0.6),
            },
          ]}
        >
          {/* Token Conversation Raw 1 */}
          <View
            style={[
              style(Gutters, Layout).rowSpaceBetweenContainer,
              Gutters.tinyMediumVPadding,
              Layout.alignItemsCenter,
            ]}
          >
            <Text style={Fonts.textSmallBold}>{'1 DAI ≈ 0.0016 ETH'}</Text>

            <View style={style(Gutters, Layout).textWithNextArrowContainer}>
              <Image
                source={Images.ic_gas}
                style={style(Gutters, Layout).tankIcon}
                resizeMode="contain"
              />
              <Text style={[Fonts.textSmallBold, Gutters.extraTinyHMargin]}>
                {'3.8695 DAI'}
              </Text>
              <Pressable onPress={handleShowHideDetails}>
                <Image
                  source={Images.ic_drop_down}
                  style={[
                    style(Gutters, Layout).dropIcon,
                    {
                      tintColor: applyOpacityToHexColor(
                        Colors.buttonBorderColor,
                        0.3,
                      ),
                      transform: [
                        { rotate: toggleDetails ? '180deg' : '0deg' },
                      ],
                    },
                  ]}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </View>
          {toggleDetails && (
            <>
              {/* Max Slippage Raw 2 */}
              <View
                style={[
                  style(Gutters, Layout).rowSpaceBetweenContainer,
                  Gutters.tinyMediumVPadding,
                  Layout.alignItemsCenter,
                ]}
              >
                <Text style={Fonts.textSmallBold}>
                  {t('swap:max_slippage')}
                </Text>
                <View style={style(Gutters, Layout).textWithNextArrowContainer}>
                  <Text style={Fonts.textSmallBold}>{'0.5%'}</Text>
                  <Pressable
                    onPress={() => {
                      setOpenMaxSlippageBottomSheet(true);
                    }}
                  >
                    <Image
                      source={Images.ic_edit}
                      style={style(Gutters, Layout).editIcon}
                      resizeMode="contain"
                    />
                  </Pressable>
                </View>
              </View>
              {/* Estimated Time Raw 3 */}
              <View
                style={[
                  style(Gutters, Layout).rowSpaceBetweenContainer,
                  Gutters.tinyMediumVPadding,
                  Layout.alignItemsCenter,
                ]}
              >
                <Text style={Fonts.textSmallBold}>
                  {t('swap:estimated_time')}
                </Text>
                <Text style={Fonts.textSmallBold}>{t('swap:minutes')}</Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Review Button Container */}
        <Button
          text={t('swap:review')}
          onPress={() => {
            toggleDetails && navigation.navigate(ScreenNames.SwapReview);
          }}
          colors={!toggleDetails && Colors.disableGradientColor}
          btnStyle={style(Gutters, Layout, Colors).reviewBtn}
          btnTextColor={
            toggleDetails
              ? Colors.white
              : applyOpacityToHexColor(Colors.placeholderColor, 0.3)
          }
        />
      </View>

      {/* Max Slippage modal */}
      <MaxSlippageBottomSheetView
        title={t('swap:max_slippage')}
        onDonePress={() => {}}
        isSheetOpen={openMaxSlippageBottomSheet}
        onClose={() => {
          setOpenMaxSlippageBottomSheet(false);
        }}
        doneBtnText={t('swap:apply')}
      />
    </SafeAreaWrapper>
  );
};

export default Swap;
