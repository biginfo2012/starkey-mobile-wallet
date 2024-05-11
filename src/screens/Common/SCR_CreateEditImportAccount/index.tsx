import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, Keyboard, Pressable, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  InputBox,
  SafeAreaWrapper,
} from 'components/index';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import StoreUpdateReduxWalletStateService from 'services/StoreUpdateReduxWalletStateService';
import SupraService from 'services/SupraService';
import WalletCommonService from 'services/WalletCommonService';
import { AppDispatch, RootState } from 'store/index';
import { updateLoader } from 'store/loader';
import {
  editUserData,
  updateCreateUser,
  updateCurrentUser,
  updateCurrentUserId,
  updateImportedUsersData,
} from 'store/userInfo';
import {
  addRemoveTokenFromList,
  updateCurrentUserNetworkList,
  updateSelectedNetworkFilter,
} from 'store/wallet';
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
  defaultNetwork,
} from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { ScreenNames, ValidationSchema } from 'theme/index';

import { style } from './style';

type FormData = {
  userName: string;
};

const CreateEditImportAccount = () => {
  const { Common, Colors, Images, Fonts, Gutters } = useTheme();
  const navigation = useNavigation<StackNavigationProp<any>>();

  const {
    title,
    subTitle,
    btnText,
    shouldShowBackIcon,
    redirectFrom,
    seedPhraseOrPrivateKey,
    selectedNetwork,
    userData,
  } = useRoute().params as any;

  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: RootState) => {
    return state.userInfo.data;
  });

  const tokensList = useSelector((state: RootState) => {
    return state.wallet.data.tokensList;
  });

  const [imgIcon, setImgIcon] = useState<String[] | string>();

  const [derivationIndex, setDerivationIndex] = useState('0');

  const [userId] = useState(generateRandomString(5));

  // Set up react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      userName:
        redirectFrom === t('common:screen_types.editAccount')
          ? userData?.userName
          : '',
    },
    resolver: yupResolver(ValidationSchema.createAccount),
  });

  useEffect(() => {
    setImgIcon(colorPalette[getRandomIndex(colorPalette.length)]);
  }, []);

  useEffect(() => {
    if (redirectFrom === t('common:screen_types.createSubAccount')) {
      setDerivationIndex(
        WalletCommonService().getNextDerivationPathIndex(defaultNetwork),
      );
    }
  }, []);

  useEffect(() => {
    if (redirectFrom === t('common:screen_types.editAccount')) {
      setImgIcon(userData?.profileIcon);
    }
  }, [userData?.userName]);

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    Keyboard.dismiss();

    const userExists = userInfo.usersData.filter(function (itemObj) {
      return (
        itemObj.userName.toLowerCase() === data.userName.trim().toLowerCase()
      );
    });

    const importedUserExists = userInfo.importedUsersData.filter(function (
      itemObj,
    ) {
      return (
        itemObj.userName.toLowerCase() === data.userName.trim().toLowerCase()
      );
    });

    if (
      (userExists?.length || importedUserExists?.length) &&
      data.userName.trim().toLowerCase() !== userData?.userName?.toLowerCase()
    ) {
      setError('userName', {
        type: 'custom',
        message: 'setting:Duplicated_label',
      });
    } else {
      if (redirectFrom === t('common:screen_types.editAccount')) {
        const user = {
          userId: userData?.userId,
          userName: getValues().userName.trim(),
          profileIcon: imgIcon,
        };
        await dispatch(editUserData(user));
        navigation.goBack();
      } else {
        dispatch(
          updateCurrentUserId({
            data: { userId: userId },
          }),
        );
      }
    }
  };

  useUpdateEffect(() => {
    const user = {
      userName: getValues().userName.trim(),
      userId: userId,
      privateKey:
        redirectFrom === t('common:screen_types.createSubAccount')
          ? undefined
          : seedPhraseOrPrivateKey,

      isWalletFromSeedPhase:
        redirectFrom === t('common:screen_types.createSubAccount'),
      profileIcon: imgIcon,
    };
    if (redirectFrom === t('common:screen_types.createSubAccount')) {
      dispatch(updateCreateUser({ data: [...userInfo.usersData, user] }));
    } else {
      dispatch(
        updateImportedUsersData({
          data: [...userInfo.importedUsersData, user],
        }),
      );
    }
    dispatch(updateCurrentUser({ data: user }));
    createSubAccount();
  }, [userInfo.currentUserId]);

  // Asynchronous function create Account and store user data and add defaults networks in redux
  const createSubAccount = async () => {
    WalletCommonService().resetAllWallet();
    dispatch(
      updateLoader({
        isLoading: true,
      }),
    );
    if (redirectFrom === t('common:screen_types.createSubAccount')) {
      const wallet = await WalletCommonService().createDefaultWallet(
        seedPhraseOrPrivateKey,
        derivationIndex,
      );

      const supraWallet = await SupraService().getWalletUsingSeed(
        seedPhraseOrPrivateKey,
        derivationIndex,
      );
      StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
        supraWallet.address,
        NetWorkType.SUP,
        derivationIndex,
      );
      StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
        wallet.address,
        selectedNetwork,
        derivationIndex,
      );
      const tokenObj = tokensList[selectedNetwork];
      const supraToken = tokensList[NetWorkType.SUP];
      await dispatch(
        addRemoveTokenFromList({
          token: supraToken,
        }),
      );
      await dispatch(
        addRemoveTokenFromList({
          token: tokenObj,
        }),
      );
    } else {
      let walletAddress = WalletCommonService().getWalletUsingPrivateKey(
        seedPhraseOrPrivateKey,
        selectedNetwork,
      );
      if (
        selectedNetwork === NetWorkType.SUP ||
        selectedNetwork === NetWorkType.APT
      ) {
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

            const SUP = tokensList[selectedNetwork];
            dispatch(
              addRemoveTokenFromList({
                token: SUP,
              }),
            );

            dispatch(
              addRemoveTokenFromList({
                token: tokensList[NetWorkType.APT],
              }),
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
            dispatch(
              addRemoveTokenFromList({
                token: tokensList[NetWorkType.SUP],
              }),
            );
            const APT = tokensList[selectedNetwork];
            dispatch(
              addRemoveTokenFromList({
                token: APT,
              }),
            );
            break;
          default:
            break;
        }
      } else {
        StoreUpdateReduxWalletStateService().updateWalletAddressInStore(
          walletAddress,
          selectedNetwork,
        );
        const tokenObj = tokensList[selectedNetwork];
        await dispatch(
          addRemoveTokenFromList({
            token: tokenObj,
          }),
        );
      }
    }
    dispatch(updateCurrentUserNetworkList({ userId: userInfo.currentUserId }));
    dispatch(updateSelectedNetworkFilter({ data: null }));
    dispatch(
      updateLoader({
        isLoading: false,
      }),
    );
    navigation.navigate(ScreenNames.Accounts);
  };

  const selectedImgIconPath = (image: string) => {
    setImgIcon(image);
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          title={title}
          subTitle={subTitle}
          shouldHideBack={shouldShowBackIcon}
          shouldShowCancel={shouldShowBackIcon}
        />

        <View style={style(Gutters).avatarContainer}>
          {typeof imgIcon === 'object' ? (
            <LinearGradient
              colors={imgIcon}
              useAngle={true}
              angle={80}
              angleCenter={{ x: 0.5, y: 0.5 }}
              style={[style(Gutters).avatarIcon]}
            />
          ) : (
            <Image source={imgIcon} style={[style(Gutters).avatarIcon]} />
          )}

          <Pressable
            onPress={() => {
              navigation.navigate(ScreenNames.ChooseImage, {
                selectedImgIconPath,
                imgIconPath: imgIcon,
              });
            }}
          >
            <Image
              source={Images.ic_round_pen}
              style={style(Gutters).penIcon}
            />
          </Pressable>
        </View>

        <Controller
          control={control}
          name="userName"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <Text
                style={[Fonts.textSmallDescriptionBold, Gutters.tinyBMargin]}
              >
                {t('onBoarding:Account_Name')}
              </Text>
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
            </>
          )}
        />

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

        <Button
          text={btnText}
          colors={errors?.userName?.message && Colors.disableGradientColor}
          onPress={handleSubmit(onSubmit)}
          btnTextColor={
            errors?.userName?.message ? Colors.buttonGrayText : Colors.white
          }
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default CreateEditImportAccount;
