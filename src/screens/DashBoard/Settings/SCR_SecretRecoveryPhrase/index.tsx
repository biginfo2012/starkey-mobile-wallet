import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BorderWalletAddressView,
  Button,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  NetworkListDropDownView,
  SafeAreaWrapper,
  WarningView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import BiometricService from 'services/BiometricService';
import { RootState } from 'store/index';
import { getWalletAddress, showToast } from 'theme/Helper/common/Function';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';
import { SortingItem } from 'types/applicationInterfaces';

import { style } from './style';

const SecretRecoveryPhrase: React.FC<any> = () => {
  const { Common, Gutters, Colors } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();
  const { redirectFrom, userData } = useRoute().params as any;
  const [selectedNetwork, setSelectedNetwork] = useState<SortingItem>();
  const [selectedWalletAddress, setSelectedWalletAddress] = useState('');

  const selectedTokensList = useSelector((state: RootState) => {
    return state.wallet.data.selectedTokensList[userData?.userId];
  });

  const walletAddress = useSelector((state: RootState) => {
    return state.wallet.data.walletAddress;
  });

  useEffect(() => {
    if (selectedNetwork?.shortName) {
      setSelectedWalletAddress(
        getWalletAddress(selectedNetwork?.shortName, false, userData?.userId),
      );
    } else if (
      !userData?.isWalletFromSeedPhase &&
      redirectFrom === ScreenNames.Accounts
    ) {
      for (const network in walletAddress[userData?.userId]) {
        setSelectedWalletAddress(
          walletAddress[userData?.userId][network].address,
        );
      }
    }
  }, [selectedNetwork?.shortName, userData?.isWalletFromSeedPhase]);

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={
            redirectFrom === ScreenNames.Accounts
              ? t('setting:show_private_key')
              : t('setting:scr_title_secret_recovery_phrase')
          }
        />

        <View style={style(Gutters).descContainer}>
          <WarningView
            warningArray={
              redirectFrom === ScreenNames.Accounts
                ? [t('setting:show_private_key_dec')]
                : [t('common:backUpRecoveryPhraseWarning')]
            }
          />
        </View>

        {userData?.isWalletFromSeedPhase && (
          <>
            <NetworkListDropDownView
              selectedNetwork={selectedNetwork}
              onSelectedNetwork={item => {
                setSelectedNetwork(item);
              }}
              filteredNetworkIds={selectedTokensList}
            />
            {selectedNetwork?.shortName && (
              <>
                <HorizontalSeparatorView
                  spacing={Variables.MetricsSizes.small}
                />
                <BorderWalletAddressView text={selectedWalletAddress} />
              </>
            )}
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
          </>
        )}

        <Button
          onPress={async () => {
            if (
              userData?.isWalletFromSeedPhase &&
              !selectedNetwork?.shortName
            ) {
              return;
            }
            // do logic
            const response = await BiometricService.authenticate(
              'Authenticate using biometric',
            );
            if (!response.success) {
              showToast('error', t('common:invalid_authentication'));
              return;
            }
            navigation.navigate(ScreenNames.BackUpFirstRecoveryPhrase, {
              isFromRevealSecretPhrase: true,
              redirectFrom,
              userData: {
                ...userData,
                shortName: selectedNetwork?.shortName,
                walletAddress: selectedWalletAddress,
              },
            });
          }}
          text={
            redirectFrom === ScreenNames.Accounts
              ? t('setting:show')
              : t('setting:reveal')
          }
          colors={
            userData?.isWalletFromSeedPhase &&
            !selectedNetwork?.shortName &&
            Colors.disableGradientColor
          }
          btnTextColor={
            userData?.isWalletFromSeedPhase && !selectedNetwork?.shortName
              ? Colors.buttonGrayText
              : Colors.white
          }
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default SecretRecoveryPhrase;
