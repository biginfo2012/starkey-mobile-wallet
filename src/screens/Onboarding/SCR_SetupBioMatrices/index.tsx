import React, { useEffect } from 'react';
import { BackHandler, Platform, View } from 'react-native';

import { useRoute } from '@react-navigation/native';
import {
  BackgroundView,
  Button,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import BiometricService from 'services/BiometricService';
import { showAlert, showToast } from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';

export default function SetupBioMatrices() {
  const { Common, Images } = useTheme();

  const { redirectToNextScreen } = useRoute().params as any;

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

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={t('onBoarding:setupFaceID_title')}
          subTitle={t('onBoarding:setupFaceID_description')}
          shouldHideBack={true}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <Button
          text={t('onBoarding:setupFaceID_EnableId')}
          onPress={async () => {
            // Check if biometric support is available
            const bioMetricSupportResponse =
              await BiometricService.checkBiometricSupport();
            if (!bioMetricSupportResponse.supported) {
              showAlert(
                t('onBoarding:secure_application_name_wallet'),
                t(
                  'onBoarding:please_activate_password_or_biometric_authentication_on_your_device_for_enhanced_security',
                ),
              );
              return;
            }
            // Authenticate using biometric
            const response = await BiometricService.authenticate(
              'Authenticate using biometric',
            );
            if (!response.success) {
              showToast('error', t('common:invalid_authentication'));
              return;
            }
            // Navigate to the ChooseNetwork screen
            redirectToNextScreen();
          }}
        />
      </View>
    </SafeAreaWrapper>
  );
}
