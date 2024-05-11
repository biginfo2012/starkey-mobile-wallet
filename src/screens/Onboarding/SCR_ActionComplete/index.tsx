import React, { useEffect } from 'react';
import { View, Text, Image, BackHandler, Platform } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch } from 'react-redux';

import { useRoute } from '@react-navigation/native';
import {
  BackgroundView,
  HorizontalSeparatorView,
  LottieAnimations,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { AppDispatch } from 'store/index';
import { updateSettingConfig, updateUserToken } from 'store/userInfo';
import AnimationType from 'theme/Enums';
import Variables from 'theme/Variables';

export default function ActionComplete() {
  const { Common, Gutters, Layout, Images, Fonts } = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const {
    title,
    subTitle,
    imageName,
    redirectToNextScreen,
    shouldShowAnimation,
  } = useRoute().params as {
    title: string;
    subTitle: string;
    imageName: string;
    redirectToNextScreen?: () => void;
    shouldShowAnimation?: boolean;
  };

  useEffect(() => {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      Platform.OS === 'android' &&
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    return true;
  };

  /*
Waits for a 2-second delay using a Promise and setTimeout to simulate an initial loading period.
Redirect To DecryptFilePassword Screen
*/
  const init = async () => {
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true);
        if (shouldShowAnimation) {
          dispatch(
            updateUserToken({
              data: {
                token: 'token',
              },
            }),
          );
          dispatch(
            updateSettingConfig({
              config: {
                isFaceIdEnabled: true,
              },
            }),
          );
        }
      }, 2000),
    );
    redirectToNextScreen();
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundGradientLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <LottieAnimations
          type={
            shouldShowAnimation ? AnimationType.Celebration : AnimationType.None
          }
        />
        <HorizontalSeparatorView spacing={'25%'} />
        <View
          style={{
            ...Layout.colVCenter,
            ...Layout.fill,
          }}
        >
          <Image
            style={{ height: scale(160), width: scale(160) }}
            source={imageName ? imageName : Images.ic_emoji_success}
          />
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

          <Text style={[Fonts.textLargeRegular, Gutters.smallBMargin]}>
            {title}
          </Text>
          <Text style={Fonts.textRegularBold}>{subTitle}</Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
