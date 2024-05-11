import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { openSettings } from 'react-native-permissions';
import { scale } from 'react-native-size-scaling';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
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
import PermissionService from 'services/PermissionService';
import { RootState } from 'store/index';
import { showAlert } from 'theme/Helper/common/Function';
import {
  DirectoryPath,
  FileRecoveryTempPath,
  tempRecoveryFileNamePreFix,
} from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

export default function BackUpWalletUsingDevice() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { Common, Layout, Images, Colors } = useTheme();

  const userName = useSelector((state: RootState) => {
    return state.userInfo?.data?.userName;
  });

  const [bottomTitleHeight, setBottomTitleHeight] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recoveryFileNamePreFix, setRecoveryFileNamePreFix] =
    useState(userName);

  /*
  Asynchronous function to request write storage permission
  If permission is granted, initiate the file move
  If permission is denied, show an alert with an option to open device settings
*/
  const requestPermission = async () => {
    let permissionStatus =
      await PermissionService().requestWriteStoragePermission();
    if (permissionStatus === 'granted') {
      copyFile();
    } else {
      showAlert(
        '',
        t('onBoarding:file_permission_denied'),
        t('onBoarding:go_to_setting'),
        openSettings,
      );
    }
  };

  // Asynchronous function to moveFile using FileManagerService and store a file in local
  const copyFile = async () => {
    await FileManagerService().copyFile(
      FileRecoveryTempPath + `/${tempRecoveryFileNamePreFix}1.json`,
      DirectoryPath + `/${recoveryFileNamePreFix}.json`,
    );
    showAlert(
      '',
      t('onBoarding:json_file_has_been_stored_to_folder', {
        fileName: recoveryFileNamePreFix,
        folderName: t('onBoarding:app_document'),
      }),
      t('common:ok'),
      onOkPress,
    );
  };

  const onOkPress = () => {
    navigation.navigate(ScreenNames.BackUpWalletUsingGuarantor);
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

  return (
    <View style={Layout.fill}>
      <View style={Common.containerFillWithSmallHPadding}>
        <BackgroundView
          image={Images.background.ic_device_backup_bg}
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
            title={t('common:Device')}
            subTitle={t('common:BackUpRestoreWalletUsingDevice_description')}
            middleView={
              <>
                <HorizontalSeparatorView
                  spacing={Variables.MetricsSizes.tiny}
                />
                <TitleDescriptionView
                  isTitleEditable
                  title={`${recoveryFileNamePreFix}.json`}
                  onTextChange={setRecoveryFileNamePreFix}
                />
                <HorizontalSeparatorView
                  spacing={Variables.MetricsSizes.medium}
                />

                <View style={Layout.row}>
                  <ProgressLineView countLength={4} selectedCount={3} />
                  <VerticalSeparatorView
                    spacing={Variables.MetricsSizes.large}
                  />
                  <Button
                    text={t('common:Download')}
                    onPress={async () => {
                      if (Platform.OS === 'android') {
                        const fileData = await FileManagerService().readFile(
                          FileRecoveryTempPath +
                            `/${tempRecoveryFileNamePreFix}1.json`,
                          'utf8',
                        );

                        try {
                          await FileManagerService().createFileInDownloadInAndroid(
                            `${recoveryFileNamePreFix}.json`,
                            fileData,
                          );
                          showAlert(
                            '',
                            t(
                              'onBoarding:json_file_has_been_stored_to_folder',
                              {
                                fileName: recoveryFileNamePreFix,
                                folderName: t('onBoarding:app_document'),
                              },
                            ),
                            t('common:ok'),
                            onOkPress,
                          );
                        } catch (errorCode) {
                          switch (errorCode) {
                            case 102:
                              showAlert(
                                '',
                                t('onBoarding:delete_json_file_error_message', {
                                  fileName: recoveryFileNamePreFix,
                                }),
                                t('common:ok'),
                              );
                              break;
                            case 103:
                              showAlert(
                                '',
                                t(
                                  'common:something_went_wrong_please_try_again',
                                ),
                                t('common:ok'),
                              );
                              break;
                            case 104:
                              requestPermission();
                              return;
                          }
                        }
                      } else {
                        copyFile();
                      }
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
                </View>
              </>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
