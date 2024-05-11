import React from 'react';
import { Image, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  BorderButton,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  SafeAreaWrapper,
  TextButton,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import BorderRadius from 'theme/BorderRadius';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

const WelcomeBack: React.FC<any> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { redirectFrom } = useRoute().params as any;
  const { Images, Gutters, Layout, Fonts } = useTheme();

  const userData = useSelector((state: RootState) => {
    return state.userInfo.data.currentUser;
  });

  /*
Redirect To Recovery Completed Screen and pass dynamic params and method for next screen
*/
  const redirectToNextScreen = () => {
    if (redirectFrom === ScreenNames.ImportWallet) {
      // navigation.push(ScreenNames.ImportExistingAssets, {
      //   redirectFrom,
      // });
      navigation.push(ScreenNames.ActionComplete, {
        title: t('onBoarding:you_are_all_good'),
        subTitle: t('onBoarding:your_wallet_has_been_imported'),
        redirectToNextScreen: () => {},
        shouldShowAnimation: true,
      });
    } else {
      navigation.push(ScreenNames.ActionComplete, {
        title: t('onBoarding:you_are_all_good'),
        subTitle: t('onBoarding:your_wallet_has_been_recovered'),
        redirectToNextScreen: () => {},
        shouldShowAnimation: true,
      });
    }
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_bg_welcome} />
      <View style={style(Gutters, Layout).subView}>
        {redirectFrom === ScreenNames.Welcome && (
          <HeaderWithTitleAndSubTitle hasLargeTitle={false} />
        )}

        <Image
          style={style(Gutters, Layout).icon}
          source={
            redirectFrom === ScreenNames.Welcome
              ? Images.ic_appLogo
              : Images.ic_avatar
          }
        />

        {redirectFrom === ScreenNames.Welcome ? (
          <Text style={Fonts.textLargeRegular}>
            {t('onBoarding:welcome_back') + '!'}
          </Text>
        ) : (
          <>
            <Text style={Fonts.titleSmall}>{t('onBoarding:welcome_back')}</Text>
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.tiny} />
            <Text style={Fonts.titleMediumMediumExtraBold}>
              {userData?.userName}
            </Text>
          </>
        )}

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.large} />
        <BorderButton
          text={
            redirectFrom === ScreenNames.Welcome
              ? t('onBoarding:via_secret_phrase')
              : t('onBoarding:new_passcode')
          }
          onPress={() => {
            if (redirectFrom === ScreenNames.Welcome) {
              navigation.navigate(ScreenNames.ChooseImportWalletMethod);
            } else {
              navigation.push(ScreenNames.SetupBioMatrices, {
                redirectToNextScreen,
              });
            }
          }}
          btnStyle={BorderRadius.MediumBorderRadius}
        />
      </View>

      {redirectFrom === ScreenNames.Welcome ? (
        <View style={style(Gutters, Layout).bottomView}>
          <TextButton
            text={t('onBoarding:get_help')}
            onPress={() => {
              navigation.navigate(ScreenNames.ChooseRecoveryMethod);
            }}
          />
        </View>
      ) : (
        <></>
      )}
    </SafeAreaWrapper>
  );
};

export default WelcomeBack;
