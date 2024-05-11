import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';
import {
  BackgroundView,
  BorderButton,
  Brand,
  Button,
  HorizontalSeparatorView,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { AppDispatch } from 'store/index';
import { updateSettingConfig } from 'store/userInfo';
import BorderRadius from 'theme/BorderRadius';
import { defaultNetwork } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

const Welcome: React.FC<any> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { Images, Gutters, Layout } = useTheme();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      updateSettingConfig({
        config: {
          isFaceIdEnabled: false,
          shouldHideTokenBalance: false,
          isAnalyticsEnable: false,
          currency: 'USD',
          language: 'EN',
          shouldHideAccountBalance: false,
          isSetupFileRecovery: false,
        },
      }),
    );
  }, []);

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_bg_welcome} />
      <View style={style(Gutters, Layout).subView}>
        <Brand height={120} width={120} />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.large} />
        <View>
          <Button
            text={t('onBoarding:welcome_get_a_new_wallet')}
            onPress={() => {
              navigation.navigate(ScreenNames.CreateAccount, {
                redirectFrom: ScreenNames.Welcome,
                selectedNetwork: defaultNetwork,
                animation: CardStyleInterpolators.forVerticalIOS,
              });
            }}
          />
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.tinySmall} />
          <BorderButton
            text={t('onBoarding:welcome_i_already_have_one')}
            onPress={() => {
              navigation.navigate(ScreenNames.WelcomeBack, {
                redirectFrom: ScreenNames.Welcome,
              });
            }}
            btnStyle={BorderRadius.MediumBorderRadius}
          />
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default Welcome;
