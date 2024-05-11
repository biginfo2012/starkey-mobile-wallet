import React from 'react';
import { Image, Pressable, SectionList, Text, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  CustomToggleSwitch,
  HeaderWithTitleAndSubTitle,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import BiometricService from 'services/BiometricService';
import { AppDispatch, RootState } from 'store/index';
import { updateSettingConfig } from 'store/userInfo';
import { showToast } from 'theme/Helper/common/Function';
import mockData from 'theme/mockData';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

const Security: React.FC<any> = () => {
  const { Common, Gutters, Layout, Colors, Fonts } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();
  const { title } = useRoute().params as any;

  const dispatch = useDispatch<AppDispatch>();
  const isWalletFromSeedPhase = useSelector(
    (state: RootState) => state.wallet.data.isWalletFromSeedPhase,
  );
  const config = useSelector((state: RootState) => state.userInfo.data.config);

  const redirectToCreatePasswordScreen = () => {
    navigation.navigate(ScreenNames.CreatePassword);
  };

  const renderSecurityItem = ({ item, index, section }): React.JSX.Element => {
    return (
      <View
        style={
          style(Gutters, Layout, Colors, index, section.data.length)
            .rawRootContainer
        }
      >
        <Pressable
          testID="button"
          onPress={() => {
            if (item.title === 'setting:files_recovery') {
              navigation.push(ScreenNames.CreateAccountRecoveryVideo, {
                title: t('onBoarding:files_recovery_video_title'),
                subTitle: t('onBoarding:files_recovery_video_subTitle'),
                videoUrl:
                  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                btnText: t('onBoarding:get_started'),
                redirectToNextScreen: redirectToCreatePasswordScreen,
              });
            } else {
              if (item?.redirect === ScreenNames.SecretRecoveryPhrase) {
                navigation.navigate(ScreenNames.SecretRecoveryPhrase, {
                  redirectFrom: ScreenNames.Security,
                  userData: {},
                });
              } else {
                item?.redirect && navigation.navigate(item?.redirect);
              }
            }
          }}
          style={style(Gutters, Layout).rawItemStyle}
        >
          {rawRenderSecurityItem(item)}
        </Pressable>
      </View>
    );
  };

  const rawRenderSecurityItem = item => {
    switch (t(item.type)) {
      case t('common:types.viewInfo'):
        return (
          <>
            <Text style={Fonts.textSmallBoldWhite}>{t(item.title)}</Text>
            <Image
              testID="right_image"
              style={{
                height: scale(12),
                width: scale(12),
              }}
              resizeMode="contain"
              source={item.image}
            />
          </>
        );
      case t('common:types.toggle'):
        return (
          <>
            <View style={style(Gutters, Layout).toogleContainer}>
              <Text style={Fonts.textSmallBoldWhite}>{t(item.title)}</Text>
              {item.description && (
                <Text style={Fonts.textSmallTinyGrayOpacityRegular}>
                  {t(item.description)}
                </Text>
              )}
            </View>

            <CustomToggleSwitch
              isEnabled={
                t(item.toggleType) === t('common:toggle_types.faceId')
                  ? config.isFaceIdEnabledForTransaction
                  : config.shouldHideAccountBalance
              }
              onPress={async () => {
                if (t(item.toggleType) === t('common:toggle_types.faceId')) {
                  if (config.isFaceIdEnabledForTransaction === true) {
                    const response = await BiometricService.authenticate(
                      'Authenticate using biometric',
                    );
                    if (!response.success) {
                      showToast('error', t('common:invalid_authentication'));
                      return;
                    }
                  }
                  dispatch(
                    updateSettingConfig({
                      config: {
                        isFaceIdEnabledForTransaction:
                          !config.isFaceIdEnabledForTransaction,
                      },
                    }),
                  );
                } else {
                  if (config.shouldHideAccountBalance === true) {
                    const response = await BiometricService.authenticate(
                      'Authenticate using biometric',
                    );
                    if (!response.success) {
                      showToast('error', t('common:invalid_authentication'));
                      return;
                    }
                  }
                  dispatch(
                    updateSettingConfig({
                      config: {
                        shouldHideAccountBalance:
                          !config.shouldHideAccountBalance,
                      },
                    }),
                  );
                }
              }}
            />
          </>
        );
    }
  };

  // Use map to iterate over each item in the SecurityData array
  const filteredSecurityData = mockData.SecurityData.map(item => {
    if (item.data) {
      let excludedOptionsIds: number[] = [];
      if (!isWalletFromSeedPhase) {
        excludedOptionsIds = [1, 2, 3];
      } else if (config.isSetupFileRecovery === true) {
        excludedOptionsIds = [2];
      }
      const filteredData = item.data.filter(
        dataItem => !excludedOptionsIds.includes(dataItem.id),
      );
      return { ...item, data: filteredData }; // write condition in case of user skipped files recovery in that case need to show file and social recovery options
    }
    return item;
  });

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle title={t(title)} />
        <SectionList
          sections={filteredSecurityData}
          keyExtractor={(item, index) => `${item.id + index}`}
          renderItem={renderSecurityItem}
          renderSectionHeader={() => (
            <View style={style(Gutters, Layout).sectionHeader} />
          )}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default Security;
