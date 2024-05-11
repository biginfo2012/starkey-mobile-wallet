import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { View } from 'react-native';
import { height } from 'react-native-size-scaling';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  BorderButton,
  Button,
  ErrorView,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  MultiLineTextInput,
  SafeAreaWrapper,
  WarningView,
} from 'components/index';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import Bip39Manager from 'services/Bip39Manager';
import WalletCommonService from 'services/WalletCommonService';
import { defaultNetwork } from 'theme/Helper/constant';
import {
  ScreenNames,
  ValidationSchema,
  DefaultVariables as Variables,
} from 'theme/index';
import { mockData } from 'theme/mockData';

import { style } from './style';

type FormData = {
  seedPhraseOrPrivateKey: string;
};

export default function RecoveryUsingSecretPhrase() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { Gutters, Layout, Images, Colors, Fonts } = useTheme();

  // Set up react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      seedPhraseOrPrivateKey: '',
    },
    resolver: yupResolver(ValidationSchema.seed),
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (Bip39Manager().isMnemonicValid(data.seedPhraseOrPrivateKey)) {
      const wallet = await WalletCommonService().createDefaultWallet(
        data.seedPhraseOrPrivateKey,
      );

      if (wallet?.address) {
        navigation.navigate(ScreenNames.CreateAccount, {
          redirectFrom: ScreenNames.RecoveryUsingSecretPhrase,
          selectedNetwork: defaultNetwork,
        });
      }
    } else {
      setError('seedPhraseOrPrivateKey', {
        type: 'custom',
        message: 'common:Invalid_seed_phrase',
      });
    }
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />
      <View style={style(Layout, Colors, Gutters).wrapper}>
        <HeaderWithTitleAndSubTitle
          title={t('common:Recover_wallet')}
          customSubTitleView={
            <WarningView
              warningArray={mockData.recoverWalletUsingRecoveryPhraseWarning}
            />
          }
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

        <Controller
          control={control}
          name="seedPhraseOrPrivateKey"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <View style={(Layout.center, { height: height * 0.2 })}>
                <MultiLineTextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder={t('onBoarding:ImportWallet_placeHolder')}
                  value={value}
                  hasError={
                    errors.seedPhraseOrPrivateKey?.message ? true : false
                  }
                  onEndEditing={() => {
                    setValue('seedPhraseOrPrivateKey', value, {
                      shouldValidate: true,
                    });
                  }}
                />
              </View>
              <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
              {errors.seedPhraseOrPrivateKey ? (
                <View style={[Layout.row, Layout.justifyContentBetween]}>
                  <ErrorView
                    text={t(errors?.seedPhraseOrPrivateKey?.message ?? '')}
                    iconPath={Images.ic_error_tick}
                    textColor={Colors.textError}
                  />
                  <BorderButton
                    text={t('onBoarding:clear_all')}
                    onPress={() => {
                      reset();
                    }}
                    textStyle={Fonts.textSmallBold}
                    btnStyle={style(Layout, Colors, Gutters).clearAllBtn}
                  />
                </View>
              ) : (
                <></>
              )}
            </>
          )}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.regular} />

        <Button
          text={t('common:Next')}
          colors={!isValid && Colors.disableGradientColor}
          onPress={handleSubmit(onSubmit)}
          btnTextColor={isValid ? Colors.white : Colors.buttonGrayText}
          disabled={!isValid}
        />
      </View>
    </SafeAreaWrapper>
  );
}
