import React, { useState } from 'react';
import { Platform, View } from 'react-native';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  BackgroundView,
  Button,
  FromDeviceView,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  SafeAreaWrapper,
} from 'components/index';
import { t } from 'i18next';
import DocumentService from 'services/DocumentService';
import FileManagerService from 'services/FileManagerService';
import { RsDecode } from 'services/SeedPhraseFileDecoderService';
import WalletCommonService from 'services/WalletCommonService';
import { showAlert } from 'theme/Helper/common/Function';
import { defaultNetwork } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';
import { RecoveryOptionItemType } from 'types/applicationInterfaces';

import { useTheme } from '../../../../hooks';
import { style } from './style';

type ParamList = {
  Params: { selectedRecoveryOptions: RecoveryOptionItemType[] };
};
const FileRecovery: React.FC<any> = () => {
  const { Common, Images, Layout, Gutters } = useTheme();
  const navigation = useNavigation();

  const { params } = useRoute<RouteProp<ParamList, 'Params'>>();
  const [cloudRecoveryStatus, setCloudRecoveryStatus] = useState<
    'success' | 'none'
  >('none');

  const isRecoveryFromIcloudSelected =
    params?.selectedRecoveryOptions?.filter(value => value.id === '1')?.length >
    0;

  const isRecoveryFromDeviceSelected =
    params?.selectedRecoveryOptions?.filter(value => value.id === '2')?.length >
    0;

  const isRecoveryFromGuarantorSelected =
    params?.selectedRecoveryOptions?.filter(value => value.id === '3')?.length >
    0;

  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const [recoveryDataArray, setRecoveryDataArray] = useState<any[]>([]);

  const [importButtonClicked, setImportButtonClicked] =
    useState<boolean>(false);

  // Function to add recovery data to an array
  const addToRecoveryData = (
    data: string | object,
    _isLocalFile: boolean,
  ): { error: null | string } => {
    const arr = recoveryDataArray;
    //data validation if valid then push otherwise return error object
    let isValidData;
    let parsedData;

    if (!data) {
      return { error: t('common:file_not_found!') };
    }

    parsedData = data;
    isValidData = data.includes('cipher') && data.includes('iv');

    if (isValidData) {
      arr.push(parsedData);

      setRecoveryDataArray([]);
      setRecoveryDataArray(arr);
      return { error: null };
    } else {
      return { error: t('common:invalid_file') };
    }
  };

  const openPicker = async () => {
    let file = await DocumentService().documentPickerFile();
    if (!file) {
      return;
    }
    const fileData = await FileManagerService().readFile(
      file?.fileCopyUri.split('%20').join(' '),
      'utf8',
    );
    return { file: file, fileData: fileData };
  };

  const addPickedFile = async (file: any, fileData?: string) => {
    if (file && fileData) {
      const array = selectedFiles;
      array.push({
        ...file,
        ...{
          fileStatus: 'selected',
          isError: false,
          data: fileData,
        },
      });
      setSelectedFiles([]);
      setSelectedFiles(array);
    }
  };

  // Asynchronous function to get accounts based on a mnemonic and Create a wallet using the provided mnemonic using WalletCommonService
  const getAccounts = async (mnemonic: string) => {
    const wallet = await WalletCommonService().createDefaultWallet(mnemonic);
    if (wallet?.address) {
      navigation.navigate(ScreenNames.CreateAccount, {
        redirectFrom: ScreenNames.FileRecovery,
        selectedNetwork: defaultNetwork,
      });
    }
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={t('onBoarding:FilesRecoveryLocationSelection_title')}
          hasLargeTitle={false}
        />
        {isRecoveryFromIcloudSelected && (
          <FromDeviceView
            title={
              Platform.OS === 'ios'
                ? t('onBoarding:from_iCloud')
                : t('onBoarding:from_gDrive')
            }
            buttonName={t('onBoarding:select_file')}
            onPress={async () => {
              const fileData = await openPicker();
              const res = addToRecoveryData(fileData?.fileData, false);
              if (res?.error == null) {
                setCloudRecoveryStatus('success');
              } else {
                setCloudRecoveryStatus('none');
              }
            }}
            shouldShowUserCloudID
            cloudRecoveryStatus={cloudRecoveryStatus}
          />
        )}

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />

        <FromDeviceView
          totalNumberOfFiles={isRecoveryFromIcloudSelected ? 1 : 2}
          title={
            isRecoveryFromDeviceSelected && isRecoveryFromGuarantorSelected
              ? t('onBoarding:From_device_and_guarantor')
              : t('onBoarding:from_device')
          }
          subTitle={
            isRecoveryFromDeviceSelected && isRecoveryFromGuarantorSelected
              ? t('onBoarding:Select_files_to_import', {
                  number: 2,
                })
              : ''
          }
          buttonName={
            isRecoveryFromIcloudSelected && selectedFiles?.length > 0
              ? t('onBoarding:import')
              : selectedFiles?.length < 2
              ? t('onBoarding:select_file')
              : t('onBoarding:import')
          }
          filePath={selectedFiles}
          onPress={async () => {
            if (
              (isRecoveryFromIcloudSelected === false &&
                selectedFiles.length < 2) ||
              (isRecoveryFromIcloudSelected && selectedFiles.length < 1)
            ) {
              const response = await openPicker();
              await addPickedFile(response?.file, response?.fileData);
            } else {
              let arr = selectedFiles;
              const fetchAndStoreAllFileData = async () => {
                for (let index = 0; index < selectedFiles.length; index++) {
                  const res = addToRecoveryData(arr[index].data, true);
                  if (res?.error === null) {
                    arr[index] = {
                      ...arr[index],
                      ...{ fileStatus: 'success', isError: false },
                    };
                  } else {
                    arr[index] = {
                      ...arr[index],
                      ...{ fileStatus: 'none', isError: true },
                    };
                  }
                }
              };
              await fetchAndStoreAllFileData();

              setImportButtonClicked(
                isRecoveryFromIcloudSelected
                  ? arr?.filter(item => item.fileStatus === 'success')
                      .length === 1 && cloudRecoveryStatus === 'success'
                  : arr?.filter(item => item.fileStatus === 'success')
                      .length === 2,
              );
              //reset and reassign array to trigger ui update.
              setSelectedFiles([]);
              setSelectedFiles(arr);
            }
          }}
          onPressClose={index1 => {
            setImportButtonClicked(false);
            const obj = selectedFiles[index1];
            if (obj.fileStatus === 'success') {
              return;
            }
            const filteredArray = selectedFiles.filter(
              (_, index) => index !== index1,
            );
            const filteredDataArray = recoveryDataArray.filter((item, _) => {
              return item !== obj.data;
            });
            setRecoveryDataArray(filteredDataArray);
            if (filteredArray?.length) {
              setSelectedFiles(filteredArray);
            } else {
              setSelectedFiles([]);
            }
          }}
        />
        {importButtonClicked && (
          <Button
            btnStyle={style(Layout, Gutters).bottomButton}
            text={t('common:Recover_wallet')}
            onPress={async () => {
              try {
                const response = await RsDecode(recoveryDataArray);

                if (response?.result_test === 0) {
                  getAccounts(response?.recoveredSeed);
                } else {
                  showAlert(
                    '',
                    t(
                      'common:File_decryption_failed_try_with_valid_password_and_file',
                    ),
                  );
                }
              } catch (error) {
                if (error?.toString()?.includes('Decrypt')) {
                  showAlert(
                    '',
                    t(
                      'common:File_decryption_failed_try_with_valid_password_and_file!',
                    ),
                  );
                } else {
                  showAlert('', error?.toString());
                }
              }
            }}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default FileRecovery;
