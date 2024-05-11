import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { scale } from 'react-native-size-scaling';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  BorderButton,
  BottomViewTitleAndSubTitle,
  Button,
  HorizontalSeparatorView,
  ProgressLineView,
  TitleDescriptionView,
  VerticalSeparatorView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import FileManagerService from 'services/FileManagerService';
import ShareManagerService from 'services/ShareManagerService';
import { RootState } from 'store/index';
import {
  updateCreateUser,
  updateCurrentUser,
  updateSettingConfig,
} from 'store/userInfo';
import { colorPalette, getRandomIndex } from 'theme/Helper/common/Function';
import {
  FileRecoveryTempPath,
  tempRecoveryFileNamePreFix,
} from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

export default function BackUpWalletUsingGuarantor() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { Common, Layout, Images, Colors } = useTheme();
  const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true);
  const dispatch = useDispatch();
  const [bottomTitleHeight, setBottomTitleHeight] = useState(0);
  const userInfo = useSelector((state: RootState) => {
    return state.userInfo.data;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recoveryFileNamePreFix, setRecoveryFileNamePreFix] = useState(
    userInfo?.userName,
  );
  /*
Redirect To ActionComplete Screen and pass dynamic params and method for view congratulations
*/
  const redirectToNextScreen = () => {
    navigation.push(ScreenNames.ActionComplete, {
      title: t('onBoarding:congratulations_title'),
      subTitle: t('onBoarding:congratulations_subTitle'),
      redirectToNextScreen: () => {},
      shouldShowAnimation: true,
    });
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
   update and store user data in redux
  */
  const updateUserInfo = () => {
    const user = {
      userName: userInfo.userName,
      userId: userInfo.currentUserId,
      isWalletFromSeedPhase: true,
      profileIcon: colorPalette[getRandomIndex(colorPalette.length)],
      isPrimary: true,
    };
    dispatch(updateCreateUser({ data: [user] }));
    dispatch(updateCurrentUser({ data: user }));
    navigation.push(ScreenNames.ActionComplete, {
      title: t('onBoarding:your_wallet_is_secured'),
      subTitle: t('onBoarding:your_recovery_setting_is_all_set_up'),
      imageName: Images.ic_emoji_completed,
      redirectToNextScreen,
    });
  };

  return (
    <View style={Layout.fill}>
      <View style={Common.containerFillWithSmallHPadding}>
        <BackgroundView
          image={Images.background.ic_share_guardian_bg}
          bottom={-(bottomTitleHeight + 50)}
        />
      </View>

      <KeyboardAvoidingView
        style={Layout.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={scale(Platform.OS === 'ios' ? -25 : 0)}
      >
        <View style={style(Layout).bottomView}>
          <BottomViewTitleAndSubTitle
            onLayout={event => {
              setBottomTitleHeight(event.nativeEvent.layout.height);
            }}
            title={t('common:Guardian')}
            subTitle={t('common:BackUpRestoreWalletUsingGuarantor_description')}
            middleView={
              <>
                <TitleDescriptionView
                  isTitleEditable
                  title={`${recoveryFileNamePreFix}.json`}
                  onTextChange={setRecoveryFileNamePreFix}
                />
                <HorizontalSeparatorView
                  spacing={Variables.MetricsSizes.medium}
                />
                <View style={Layout.row}>
                  <ProgressLineView countLength={4} selectedCount={4} />
                  <VerticalSeparatorView
                    spacing={Variables.MetricsSizes.large}
                  />
                  {isNextDisabled ? (
                    <Button
                      text={t('common:Share')}
                      onPress={async () => {
                        setIsNextDisabled(false);
                        await FileManagerService().copyFile(
                          FileRecoveryTempPath +
                            `/${tempRecoveryFileNamePreFix}2.json`,
                          FileRecoveryTempPath +
                            `/${recoveryFileNamePreFix}.json`,
                        );

                        ShareManagerService().shareJsonFile(
                          FileRecoveryTempPath +
                            `/${recoveryFileNamePreFix}.json`,
                        );
                      }}
                      btnStyle={Layout.fill}
                    />
                  ) : (
                    <>
                      <BorderButton
                        text={t('common:Share')}
                        onPress={async () => {
                          await FileManagerService().copyFile(
                            FileRecoveryTempPath +
                              `/${tempRecoveryFileNamePreFix}2.json`,
                            FileRecoveryTempPath +
                              `/${recoveryFileNamePreFix}.json`,
                          );

                          ShareManagerService().shareJsonFile(
                            FileRecoveryTempPath +
                              `/${recoveryFileNamePreFix}.json`,
                          );
                        }}
                        btnStyle={style(Layout).shareBtn}
                        colors={
                          !recoveryFileNamePreFix?.length &&
                          Colors.disableGradientColor
                        }
                        btnTextColor={
                          !recoveryFileNamePreFix?.length
                            ? Colors.buttonGrayText
                            : Colors.white
                        }
                        disabled={!recoveryFileNamePreFix?.length}
                      />
                      <VerticalSeparatorView
                        spacing={Variables.MetricsSizes.tiny}
                      />
                      <Button
                        text={t('common:Done')}
                        onPress={async () => {
                          await FileManagerService().deleteDirectory(
                            FileRecoveryTempPath,
                          );
                          dispatch(
                            updateSettingConfig({
                              config: {
                                isSetupFileRecovery: true,
                              },
                            }),
                          );
                          userInfo?.token
                            ? navigation.popToTop()
                            : updateUserInfo();
                        }}
                        btnStyle={Layout.fill}
                        colors={
                          !recoveryFileNamePreFix?.length &&
                          Colors.disableGradientColor
                        }
                        btnTextColor={
                          !recoveryFileNamePreFix?.length
                            ? Colors.buttonGrayText
                            : Colors.white
                        }
                        disabled={!recoveryFileNamePreFix?.length}
                      />
                    </>
                  )}
                </View>
              </>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
