import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  View,
  Keyboard,
  Platform,
  BackHandler,
  Text,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BackgroundView,
  Button,
  CheckBoxView,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  InputBox,
  SafeAreaWrapper,
} from 'components/index';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import { t } from 'i18next';
import StoreUpdateReduxWalletStateService from 'services/StoreUpdateReduxWalletStateService';
import SupraService from 'services/SupraService';
import WalletCommonService from 'services/WalletCommonService';
import { AppDispatch, RootState } from 'store/index';
import {
  updateCreateUser,
  updateCurrentUser,
  updateCurrentUserId,
  updateUserName,
} from 'store/userInfo';
import { addRemoveTokenFromList, clearSelectedTokensList } from 'store/wallet';
import {
  colorPalette,
  generateRandomString,
  getRandomIndex,
} from 'theme/Helper/common/Function';
import {
  MaximumTextFelidCharacters,
  MaximumUsernameCharacters,
  MinimumUsernameCharacters,
  NetWorkType,
} from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { ValidationSchema } from 'theme/index';
import ScreenNames from 'theme/screenNames';

import { useTheme } from '../../../hooks';

type FormData = {
  userName: string;
  isBlastOffMember: boolean | undefined;
  email: string | undefined;
};

const CreateAccount: React.FC<any> = () => {
  const { Common, Images, Colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { redirectFrom, selectedNetwork } = useRoute().params as any;
  const dispatch = useDispatch<AppDispatch>();
  const [mounted, setMounted] = useState(false);
  const [isChecked, setIsChecked] = useState(
    redirectFrom === ScreenNames.FileRecovery,
  );

  const seedPhrase = useSelector((state: RootState) => {
    return state.wallet?.data?.seedPhrase;
  });

  const privateKey = useSelector((state: RootState) => {
    return state.wallet?.data?.privateKey;
  });

  const tokensList = useSelector((state: RootState) => {
    return state.wallet.data.tokensList;
  });

  const [userId] = useState(generateRandomString(5));

  // Set up react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      userName: '',
      isBlastOffMember: false,
      email: '',
    },
    resolver: yupResolver(ValidationSchema.createAccount),
  });

  useEffect(() => {
    navigation.addListener('transitionEnd', () => {
      setMounted(true);
    });
  }, [navigation]);

  useUpdateEffect(() => {
    dispatch(clearSelectedTokensList());
  }, [mounted]);

  // Asynchronous function to create mnemonic-based accounts and update the wallet state
  const createMnemonicAndAccounts = async () => {
    if (privateKey) {
      if (
        selectedNetwork === NetWorkType.SUP ||
        selectedNetwork === NetWorkType.APT
      ) {
        let walletAddress = WalletCommonService().getWalletUsingPrivateKey(
          privateKey,
          selectedNetwork,
        );
        //Create both supra and aptos
        switch (selectedNetwork) {
          case NetWorkType.SUP:
            StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
              walletAddress,
              selectedNetwork,
            );

            StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
              walletAddress,
              NetWorkType.APT,
            );

            break;
          case NetWorkType.APT:
            StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
              walletAddress,
              NetWorkType.SUP,
            );
            StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
              walletAddress,
              selectedNetwork,
            );

            break;
          default:
            break;
        }
        StoreUpdateReduxWalletStateService().updateIsWalletFromSeedPhaseInStore(
          false,
        );
      } else {
        let walletAddress = WalletCommonService().getWalletUsingPrivateKey(
          privateKey,
          selectedNetwork,
        );
        StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
          walletAddress,
          selectedNetwork,
        );
        StoreUpdateReduxWalletStateService().updateIsWalletFromSeedPhaseInStore(
          false,
        );
      }
    } else {
      let mnemonic = '';
      if (redirectFrom === ScreenNames.Welcome) {
        mnemonic = WalletCommonService().createMnemonic();
      } else {
        mnemonic = seedPhrase;
      }
      const wallet = await WalletCommonService().createDefaultWallet(mnemonic);

      const supraWallet = await SupraService().getWalletUsingSeed(mnemonic);
      StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
        supraWallet.address,
        NetWorkType.SUP,
      );
      StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
        wallet.address,
        selectedNetwork,
      );

      StoreUpdateReduxWalletStateService().updateIsWalletFromSeedPhaseInStore(
        true,
      );
    }
  };

  const redirectToNextScreen = () => {
    if (privateKey) {
      if (
        selectedNetwork === NetWorkType.SUP ||
        selectedNetwork === NetWorkType.APT
      ) {
        //Create both supra and aptos
        const tokenObj = tokensList[selectedNetwork];
        if (selectedNetwork === NetWorkType.SUP) {
          const aptosTokenObj = tokensList[NetWorkType.APT];
          dispatch(
            addRemoveTokenFromList({
              token: tokenObj,
            }),
          );
          dispatch(
            addRemoveTokenFromList({
              token: aptosTokenObj,
            }),
          );
        } else {
          const supraTokenObj = tokensList[NetWorkType.SUP];

          dispatch(
            addRemoveTokenFromList({
              token: supraTokenObj,
            }),
          );
          dispatch(
            addRemoveTokenFromList({
              token: tokenObj,
            }),
          );
        }
      } else {
        const tokenObj = tokensList[selectedNetwork];
        dispatch(
          addRemoveTokenFromList({
            token: tokenObj,
          }),
        );
      }
    } else {
      const supraTokenObj = tokensList[NetWorkType.SUP];
      const tokenObj = tokensList[selectedNetwork];
      dispatch(
        addRemoveTokenFromList({
          token: supraTokenObj,
        }),
      );
      dispatch(
        addRemoveTokenFromList({
          token: tokenObj,
        }),
      );
    }

    if (redirectFrom === ScreenNames.Welcome) {
      navigation.navigate(ScreenNames.CreateAccountChooseRecoveryMethod);
    } else {
      const user = {
        userName: getValues().userName.trim(),
        userId: userId,
        privateKey: privateKey ? privateKey : undefined,
        isWalletFromSeedPhase: privateKey ? false : true,
        profileIcon: colorPalette[getRandomIndex(colorPalette.length)],
        isPrimary: true,
      };
      dispatch(updateCreateUser({ data: [user] }));
      dispatch(updateCurrentUser({ data: user }));
      navigation.push(ScreenNames.ActionComplete, {
        title: t('onBoarding:you_are_all_good'),
        subTitle:
          redirectFrom === ScreenNames.ImportWallet
            ? t('onBoarding:your_wallet_has_been_imported')
            : t('onBoarding:your_wallet_has_been_recovered'),
        redirectToNextScreen: () => {},
        shouldShowAnimation: true,
      });
    }
  };

  // Handle form submission
  const onSubmit = (data: FormData) => {
    Keyboard.dismiss();
    if (isChecked) {
      dispatch(updateUserName({ data: { userName: data.userName.trim() } }));
      dispatch(
        updateCurrentUserId({
          data: { userId: userId },
        }),
      );
      createMnemonicAndAccounts();
      navigation.push(ScreenNames.SetupBioMatrices, {
        redirectToNextScreen,
      });
    }
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

  // right now we have set dummy link once we get Terms and condition link after we will change
  const onPressTermsOfService = () => {
    Linking.openURL('https://www.google.com/');
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <BackgroundView image={Images.background.ic_backgroundLayer} />

      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          shouldHideBack={redirectFrom === ScreenNames.Welcome}
          shouldShowCancel={redirectFrom === ScreenNames.Welcome}
          title={
            redirectFrom === ScreenNames.RecoveryUsingSecretPhrase ||
            redirectFrom === ScreenNames.FileRecovery
              ? t('onBoarding:welcome_back')
              : t('onBoarding:createAccount_title')
          }
          subTitle={t('onBoarding:createAccount_subTitle')}
          onBackPress={() => {
            WalletCommonService().resetAllWallet();
            navigation.goBack();
          }}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <Controller
          control={control}
          name="userName"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <InputBox
              maximumTextCount={MaximumUsernameCharacters}
              onChangeText={onChange}
              isShowError={errors?.userName?.message ? true : false}
              errMessage={errors?.userName?.message}
              placeholder={t('onBoarding:Account_Name')}
              totalTextCount={value.length}
              onBlur={onBlur}
              value={value}
              maxLength={MaximumTextFelidCharacters}
              shouldShowTextCount={true}
              minimumTextCount={MinimumUsernameCharacters}
              onChangeValue={prop => {
                setValue('userName', prop.nativeEvent.text, {
                  shouldValidate: true,
                });
              }}
            />
          )}
        />

        {redirectFrom !== ScreenNames.FileRecovery && (
          <>
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
            <CheckBoxView
              isChecked={isChecked}
              setIsChecked={setIsChecked}
              text={
                <Text>
                  {t('onBoarding:i_agree_to_the') + ' '}
                  <Text
                    style={{ color: Colors.textPurple }}
                    onPress={onPressTermsOfService}
                  >
                    {t('onBoarding:terms_of_service')}
                  </Text>
                </Text>
              }
            />
          </>
        )}

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        <Button
          text={t('common:Next')}
          colors={
            (errors?.userName?.message || !isChecked) &&
            Colors.disableGradientColor
          }
          onPress={handleSubmit(onSubmit)}
          btnTextColor={
            errors?.userName?.message || !isChecked
              ? Colors.buttonGrayText
              : Colors.white
          }
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default CreateAccount;
