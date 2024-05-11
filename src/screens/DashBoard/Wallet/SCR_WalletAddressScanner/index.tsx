import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { openSettings } from 'react-native-permissions';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BarcodeMask } from 'components/index';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import ImagePickerService from 'services/ImagePickerService';
import PermissionService from 'services/PermissionService';
import QRGeneratorService from 'services/QRGeneratorService';
import { showAlert, showToast } from 'theme/Helper/common/Function';

import { style } from './style';

const WalletAddressScanner: React.FC<any> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { getAddress } = useRoute().params as any;

  const { Layout, Fonts, Gutters } = useTheme();

  const [walletAddress, setWalletAddress] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const focusUnsubscribe = navigation.addListener('focus', () => {
      setIsActive(true);
    });

    const blurUnsubscribe = navigation.addListener('blur', () => {
      setIsActive(false);
    });
    return () => {
      focusUnsubscribe();
      blurUnsubscribe();
    };
  }, [navigation]);

  useEffect(() => {
    handleScanQrCode();
  }, []);

  const handleScanQrCode = async () => {
    // Request camera permission using PermissionService
    const isPermissionGranted =
      await PermissionService().requestCameraPermission();
    setPermissionGranted(isPermissionGranted);
    if (!isPermissionGranted) {
      showAlert(
        '',
        t('common:cameraAccess'),
        t('common:open_settings'),
        openSettings,
        t('common:cancel'),
      );
    }
  };

  useUpdateEffect(() => {
    if (walletAddress) {
      getAddress(walletAddress);
      navigation.goBack();
    }
  }, [walletAddress]);

  const chooseImage = async () => {
    const imgUrl = await ImagePickerService().imagePicker();
    if (imgUrl) {
      const qrCode = await QRGeneratorService().getQRCodeFromImage(imgUrl);
      if (qrCode !== undefined) {
        setWalletAddress(qrCode);
      } else {
        showToast('error', t('common:no_qr_found'));
      }
    }
  };

  return (
    <>
      {isActive && (
        <Camera
          style={style(Layout).rootCamera}
          scanBarcode={true}
          onReadCode={event => {
            setWalletAddress(event.nativeEvent.codeStringValue);
          }}
          showFrame={false}
        />
      )}
      <BarcodeMask
        width={300}
        height={300}
        showAnimatedLine={permissionGranted}
        onPress={chooseImage}
      />
      <View style={style(Layout).cancelView}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={[Fonts.textRegularBold, Gutters.smallMargin]}>
            {t('common:cancel')}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default WalletAddressScanner;
