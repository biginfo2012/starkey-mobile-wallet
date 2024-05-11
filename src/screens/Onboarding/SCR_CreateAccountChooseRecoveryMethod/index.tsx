import React from 'react';
import { View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  RecoverySelectionListView,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import Variables from 'theme/Variables';
import mockData from 'theme/mockData';
import ScreenNames from 'theme/screenNames';

export default function CreateAccountChooseRecoveryMethod() {
  const { Common, Images } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  /*
Redirect To CreatePassword Screen
*/
  const redirectToNextScreen = () => {
    navigation.navigate(ScreenNames.CreatePassword);
  };

  const redirectToBackUpFirstRecoveryPhraseScreen = () => {
    navigation.navigate(ScreenNames.BackUpFirstRecoveryPhrase, {
      isFromRevealSecretPhrase: false,
      redirectFrom: ScreenNames.CreateAccountChooseRecoveryMethod,
      userData: {},
    });
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={t('onBoarding:CreateAccountChooseRecoveryMethod_title')}
          subTitle={t('onBoarding:CreateAccountChooseRecoveryMethod_subTitle')}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <RecoverySelectionListView
          onItemPress={item => {
            if (item.id === 1) {
              navigation.push(ScreenNames.CreateAccountRecoveryVideo, {
                title: t('onBoarding:files_recovery_video_title'),
                subTitle: t('onBoarding:files_recovery_video_subTitle'),
                videoUrl:
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                btnText: t('onBoarding:get_started'),
                redirectToNextScreen,
              });
            } else {
              navigation.navigate(ScreenNames.RecoveryVideo, {
                title: t('onBoarding:recoveryVideo_title'),
                subTitle: t('onBoarding:recoveryVideo_subTitle'),
                videoUrl:
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                btnText: t('common:Next'),
                redirectToNextScreen: redirectToBackUpFirstRecoveryPhraseScreen,
              });
            }
          }}
          data={mockData.createAccount_recoveryOptions}
        />
      </View>
    </SafeAreaWrapper>
  );
}
