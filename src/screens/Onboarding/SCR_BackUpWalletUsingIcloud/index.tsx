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
  BottomViewTitleAndSubTitle,
  Button,
  HorizontalSeparatorView,
  ProgressLineView,
  TitleDescriptionView,
  VerticalSeparatorView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import CloudService from 'services/CloudService';
import FileManagerService from 'services/FileManagerService';
import { AppDispatch, RootState } from 'store/index';
import { updateLoader } from 'store/loader';
import { showAlert } from 'theme/Helper/common/Function';
import {
  FileRecoveryTempPath,
  ROOT_FOLDER_NAME,
  tempRecoveryFileNamePreFix,
} from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

export default function BackUpWalletUsingIcloud() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { Common, Layout, Images, Colors } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [bottomTitleHeight, setBottomTitleHeight] = useState(0);

  const userInfo = useSelector((state: RootState) => {
    return state.userInfo.data;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [recoveryFileNamePreFix, setRecoveryFileNamePreFix] = useState(
    userInfo?.userName,
  );

  const onOkPress = () => {
    navigation.navigate(ScreenNames.BackUpWalletUsingDevice);
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
          image={Images.background.ic_iCloud_bg}
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
            title={
              Platform.OS === 'ios' ? t('common:iCloud') : t('common:gDrive')
            }
            subTitle={
              Platform.OS === 'ios'
                ? t('common:BackUpRestoreWalletUsingIcloud_description')
                : t('common:BackUpRestoreWalletUsingIcloud_description1')
            }
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
                  <ProgressLineView countLength={4} selectedCount={2} />
                  <VerticalSeparatorView
                    spacing={Variables.MetricsSizes.large}
                  />
                  <Button
                    text={t('common:Backup')}
                    onPress={async () => {
                      try {
                        dispatch(
                          updateLoader({
                            isLoading: true,
                          }),
                        );

                        if (
                          tempRecoveryFileNamePreFix !== recoveryFileNamePreFix
                        ) {
                          await FileManagerService().moveFile(
                            FileRecoveryTempPath +
                              `/${tempRecoveryFileNamePreFix}0.json`,
                            FileRecoveryTempPath +
                              `/${recoveryFileNamePreFix}.json`,
                          );
                        }

                        await CloudService().uploadToCloud(
                          FileRecoveryTempPath +
                            `/${recoveryFileNamePreFix}.json`,
                          `${recoveryFileNamePreFix}.json`,
                        );

                        await FileManagerService().deleteFile(
                          FileRecoveryTempPath +
                            `/${recoveryFileNamePreFix}.json`,
                        );
                        dispatch(
                          updateLoader({
                            isLoading: false,
                          }),
                        );
                        showAlert(
                          '',
                          t('onBoarding:json_file_has_been_stored_to_folder', {
                            folderName: ROOT_FOLDER_NAME,
                            fileName: recoveryFileNamePreFix,
                            cloudName:
                              Platform.OS === 'ios'
                                ? t('common:iCloud')
                                : t('common:gDrive'),
                          }),
                          t('common:ok'),
                          onOkPress,
                        );
                      } catch (error) {
                        dispatch(
                          updateLoader({
                            isLoading: false,
                          }),
                        );
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
