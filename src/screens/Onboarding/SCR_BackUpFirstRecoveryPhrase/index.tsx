import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { height } from 'react-native-size-scaling';
import { useDispatch, useSelector } from 'react-redux';

import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  WarningView,
  BackgroundView,
  BorderTextIconButton,
  Button,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  MaskViewWithOverlay,
  SecretPhrasesList,
  VerticalSeparatorView,
  SafeAreaWrapper,
  MultiLineTextInput,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import nextFrame from 'next-frame';
import FileManagerService from 'services/FileManagerService';
import PermissionService from 'services/PermissionService';
import WalletCommonService from 'services/WalletCommonService';
import { RootState } from 'store/index';
import { updateLoader } from 'store/loader';
import {
  generateRandomNumber,
  showAlert,
  showToast,
} from 'theme/Helper/common/Function';
import { DirectoryPath } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';

import { style } from './style';

export default function BackUpFirstRecoveryPhrase() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { Gutters, Layout, Images } = useTheme();
  const dispatch = useDispatch();

  const [shouldHideRecoveryPhrase, setShouldHideRecoveryPhrase] =
    useState(true);

  const { isFromRevealSecretPhrase, redirectFrom, userData } = useRoute()
    .params as any;

  const seedPhrase = useSelector((state: RootState) => {
    return state.wallet.data.seedPhrase;
  });

  const [privateKeyOrSeedPhrase, setPrivateKeyOrSeedPhrase] = useState('');

  const walletAddress = useSelector((state: RootState) => {
    return state.wallet?.data?.walletAddress;
  });

  useEffect(() => {
    if (redirectFrom !== ScreenNames.Accounts) {
      setPrivateKeyOrSeedPhrase(seedPhrase);
    }
    if (userData?.userId) {
      if (userData?.isWalletFromSeedPhase) {
        getPrivateKey();
      } else {
        setPrivateKeyOrSeedPhrase(userData.privateKey);
      }
    }
  }, []);

  const getPrivateKey = async () => {
    dispatch(
      updateLoader({
        isLoading: true,
      }),
    );
    await nextFrame();
    setPrivateKeyOrSeedPhrase(
      WalletCommonService().getPrivateKeyUsingSeedPhrase(
        walletAddress[userData?.userId][userData?.shortName].derivationIndex,
        userData?.shortName,
      ),
    );
    dispatch(
      updateLoader({
        isLoading: false,
      }),
    );
  };

  /*
  Asynchronous function to request write storage permission
  If permission is granted, initiate the file download
  If permission is denied, show an alert with an option to open device settings
*/
  const requestPermission = async () => {
    // Request write storage permission using PermissionService
    let permissionStatus =
      await PermissionService().requestWriteStoragePermission();
    if (permissionStatus === 'granted') {
      downloadFile();
    } else {
      showAlert(
        '',
        t('onBoarding:file_permission_denied'),
        t('onBoarding:go_to_setting'),
        openSettings,
      );
    }
  };

  // Asynchronous function to Create a file using FileManagerService and download a file
  const downloadFile = async () => {
    await FileManagerService().createFile(
      DirectoryPath +
        (redirectFrom === ScreenNames.Accounts
          ? `/Secret_Private_Key_${userData?.walletAddress}.txt`
          : '/Secret_Recovery_Phrase.txt'),
      privateKeyOrSeedPhrase,
      'utf8',
      true,
    );

    showAlert(
      '',
      redirectFrom === ScreenNames.Accounts
        ? t('setting:secret_private_key_file_has_been_stored_to_folder', {
            fileName: `Secret_Private_Key_${userData?.walletAddress}.txt`,
            folderName:
              Platform.OS === 'ios'
                ? t('onBoarding:app_document')
                : t('onBoarding:app_download'),
          })
        : t(
            'onBoarding:secret_Recovery_Phrase_file_has_been_stored_to_folder',
            {
              folderName:
                Platform.OS === 'ios'
                  ? t('onBoarding:app_document')
                  : t('onBoarding:app_download'),
            },
          ),
      t('common:ok'),
    );
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <ScrollView style={style(Gutters, Layout).wrapperView} bounces={false}>
        <HeaderWithTitleAndSubTitle
          title={
            isFromRevealSecretPhrase
              ? redirectFrom === ScreenNames.Accounts
                ? t('setting:show_private_key')
                : t('setting:scr_title_secret_recovery_phrase')
              : t('onBoarding:backUpRecoveryPhrase_title')
          }
          customSubTitleView={
            <WarningView
              warningArray={
                redirectFrom === ScreenNames.Accounts
                  ? [t('setting:show_private_key_dec')]
                  : [t('common:backUpRecoveryPhraseWarning')]
              }
            />
          }
          hasLargeTitle={isFromRevealSecretPhrase}
        />
        {privateKeyOrSeedPhrase && (
          <>
            <View style={{ ...Gutters.smallVMargin }}>
              {redirectFrom === ScreenNames.Accounts ? (
                <View style={(Layout.center, { height: height * 0.15 })}>
                  <MultiLineTextInput
                    value={privateKeyOrSeedPhrase}
                    editable={false}
                  />
                </View>
              ) : (
                <>
                  <SecretPhrasesList data={seedPhrase.split(' ')} />
                  {shouldHideRecoveryPhrase && !isFromRevealSecretPhrase && (
                    <MaskViewWithOverlay
                      overlayText={t('onBoarding:Tap_to_reveal')}
                      onPress={() => setShouldHideRecoveryPhrase(false)}
                    />
                  )}
                </>
              )}
            </View>
            <View style={style(Gutters, Layout).downloadCopyButtonContainer}>
              <View style={{ ...Layout.fill }}>
                <BorderTextIconButton
                  leftIconImage={Images.ic_download}
                  text={t('onBoarding:Download')}
                  onPress={async () => {
                    if (Platform.OS === 'android') {
                      try {
                        await FileManagerService().createFileInDownloadInAndroid(
                          redirectFrom === ScreenNames.Accounts
                            ? `/Secret_Private_Key_${userData?.walletAddress}.txt`
                            : 'Secret_Recovery_Phrase.txt',
                          privateKeyOrSeedPhrase,
                        );

                        showAlert(
                          '',
                          redirectFrom === ScreenNames.Accounts
                            ? t(
                                'setting:secret_private_key_file_has_been_stored_to_folder',
                                {
                                  fileName: `Secret_Private_Key_${userData?.walletAddress}.txt`,
                                  folderName: t('onBoarding:app_download'),
                                },
                              )
                            : t(
                                'onBoarding:secret_Recovery_Phrase_file_has_been_stored_to_folder',
                                {
                                  folderName: t('onBoarding:app_download'),
                                },
                              ),
                          t('common:ok'),
                        );
                      } catch (errorCode) {
                        switch (errorCode) {
                          case 102:
                            showAlert(
                              '',
                              t('onBoarding:delete_txt_file_error_message'),
                              t('common:ok'),
                            );
                            break;
                          case 103:
                            showAlert(
                              '',
                              t('common:something_went_wrong_please_try_again'),
                              t('common:ok'),
                            );
                            break;
                          case 104:
                            requestPermission();
                            return;
                        }
                      }
                    } else {
                      downloadFile();
                    }
                  }}
                />
              </View>
              <VerticalSeparatorView spacing={Variables.MetricsSizes.tiny} />
              <View style={{ ...Layout.fill }}>
                <BorderTextIconButton
                  leftIconImage={Images.ic_copy}
                  text={t('onBoarding:Copy')}
                  onPress={() => {
                    showToast(
                      'success',
                      redirectFrom === ScreenNames.Accounts
                        ? t(
                            'setting:private_key_copied_to_clipboard_successfully',
                          )
                        : t(
                            'common:Secret_phrase_copied_to_clipboard_successfully',
                          ),
                    );
                    Clipboard.setString(privateKeyOrSeedPhrase);
                  }}
                />
              </View>
            </View>
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
            <Button
              text={
                isFromRevealSecretPhrase
                  ? t('common:Done')
                  : t('onBoarding:backUpRecoveryPhrase_buttonText')
              }
              onPress={() => {
                if (isFromRevealSecretPhrase) {
                  navigation.goBack();
                  return;
                }
                // Generate random numbers
                const randomNumbers = generateRandomNumber(3);
                let tempArray = [
                  { position: randomNumbers[0], value: '' },
                  { position: randomNumbers[1], value: '' },
                  { position: randomNumbers[2], value: '' },
                ];
                navigation.navigate(ScreenNames.VerifyRecoveryPhrase, {
                  randomPhrase: tempArray,
                });
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
