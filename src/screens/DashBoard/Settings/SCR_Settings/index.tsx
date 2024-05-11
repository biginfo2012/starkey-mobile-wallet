/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Image, Pressable, SectionList, Text, View } from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BorderButton,
  CustomToggleSwitch,
  DashBoardHeader,
  SafeAreaWrapper,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import BalanceChangeObservers from 'services/BalanceChangeObservers';
import StoreUpdateReduxWalletStateService from 'services/StoreUpdateReduxWalletStateService';
import USDConversionService from 'services/USDConversionService';
import WalletCommonService from 'services/WalletCommonService';
import { AppDispatch, RootState } from 'store/index';
import { updateSettingConfig } from 'store/userInfo';
import { showConfirmationModal } from 'theme/Helper/common/Function';
import mockData from 'theme/mockData';
import { PopUpItem } from 'types/applicationInterfaces';

import packageJson from '../../../../../package.json';
import { style } from './style';

const Settings: React.FC<any> = () => {
  const { Common, Gutters, Layout, Fonts, Images, Colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: RootState) => state.userInfo.data);

  const networkEnvironment = useSelector((state: RootState) => {
    return state.wallet.data.networkEnvironment;
  });

  /**
   * Define a function callOk which is intended to be executed when the user confirms logout the account
   * Define a function onPressCancel which is intended to be executed when the user cancels logout the account
   * Define an object popUpLogOutObj that holds properties for a pop-up confirmation dialog
   */
  const callOk = () => {
    BalanceChangeObservers().removeListeners();
    USDConversionService().removeListeners();
    WalletCommonService().resetAllWallet();
    dispatch({ type: 'RESET_APP' });
  };
  const onPressCancel = () => {};

  const popUpLogOutObj = {
    isVisible: true,
    popupTitle: t('common:Log_Out'),
    popupDescription: t('common:log_out_description'),
    buttonOkText: t('common:Log_Out'),
    okButtonType: 'primary',
    buttonCancelText: t('common:cancel'),
    onPressOk: callOk,
    onPressCancel: onPressCancel,
    iconPath: Images.ic_cancel_transaction,
  } as PopUpItem;

  const getSwitchOnOff = (type: string) => {
    if (type === t('common:toggle_types.analytics')) {
      return userInfo.config.isAnalyticsEnable;
    } else if (type === t('common:toggle_types.tokenBalance')) {
      return userInfo.config.shouldHideTokenBalance;
    } else if (type === t('common:toggle_types.Test_Mode')) {
      return networkEnvironment === 'testNet';
    }
  };

  const renderSettingItem = ({ item, index, section }): React.JSX.Element => {
    return (
      <Pressable
        testID="button"
        style={
          style(Gutters, Layout, Colors, index, section.data.length)
            .rawRootContainer
        }
        onPress={() => {
          item?.redirect &&
            navigation.navigate(item?.redirect, {
              title: item.title,
            });
        }}
      >
        {rawRenderSettingItem(item)}
      </Pressable>
    );
  };

  const rawRenderSettingItem = item => {
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
      case t('common:types.config'):
        return (
          <>
            <Text style={Fonts.textSmallBoldWhite}>{t(item.title)}</Text>
            <View style={style(Gutters, Layout).rawItemStyle}>
              <Text
                style={[
                  style(Gutters, Layout).rightTextStyle,
                  Fonts.textSmallBoldWhite,
                ]}
              >
                {t(item.rightText)}
              </Text>
            </View>
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
              isEnabled={getSwitchOnOff(t(item.toggleType))}
              onPress={() => {
                if (t(item.toggleType) === t('common:toggle_types.analytics')) {
                  dispatch(
                    updateSettingConfig({
                      config: {
                        isAnalyticsEnable: !userInfo.config.isAnalyticsEnable,
                      },
                    }),
                  );
                } else if (
                  t(item.toggleType) === t('common:toggle_types.Test_Mode')
                ) {
                  if (networkEnvironment === 'mainNet') {
                    StoreUpdateReduxWalletStateService().updateNetworkEnvironmentInStore(
                      'testNet',
                    );
                  } else {
                    StoreUpdateReduxWalletStateService().updateNetworkEnvironmentInStore(
                      'mainNet',
                    );
                  }
                } else {
                  dispatch(
                    updateSettingConfig({
                      config: {
                        shouldHideTokenBalance:
                          !userInfo.config.shouldHideTokenBalance,
                      },
                    }),
                  );
                }
              }}
            />
          </>
        );
      case t('common:types.cmsPage'):
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
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={Layout.fullWidth}>
        <DashBoardHeader
          testID="Settings_DashBoardHeader"
          containerStyle={Common.smallHPadding}
          rightImage={
            userInfo.currentUser.profileIcon
              ? userInfo.currentUser.profileIcon
              : undefined
          }
          userName={userInfo.currentUser.userName}
          onPressLeftImage={() => {}}
          middleView={
            <Text style={[Fonts.titleSmall]}>{t('setting:setting')}</Text>
          }
        />
      </View>

      <SectionList
        sections={mockData.SettingData}
        keyExtractor={(item, index) => `${item.id + index}`}
        renderItem={renderSettingItem}
        renderSectionHeader={() => (
          <View style={style(Gutters, Layout).sectionHeader} />
        )}
      />
      <View style={style(Gutters, Layout).bottomView}>
        <BorderButton
          text={t('common:Log_Out')}
          onPress={() => {
            showConfirmationModal(popUpLogOutObj);
          }}
          btnStyle={style(Gutters, Layout).bottomButtonStyle}
        />
        <Text
          style={[
            Fonts.textTinyDescriptionLightRegular,
            { textAlign: 'center' },
          ]}
        >
          {`${t('common:Version')} ${packageJson.version}`}
        </Text>
      </View>
    </SafeAreaWrapper>
  );
};

export default Settings;
