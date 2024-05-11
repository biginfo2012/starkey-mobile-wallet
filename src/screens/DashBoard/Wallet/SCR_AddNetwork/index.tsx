import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  InputBox,
  WalletTokenItem,
  WarningView,
} from 'components/index';
import useDebounce from 'customHooks/useDebounce';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import EthersService from 'services/EthersService';
import { RootState } from 'store/index';
import {
  addRemoveTokenFromList,
  triggerFetchAllTokenBalanceAndStartObservers,
} from 'store/wallet';
import {
  generateRandomString,
  getWalletAddress,
  showConfirmationModal,
} from 'theme/Helper/common/Function';
import {
  MaximumPasswordCharacters,
  defaultNetwork,
} from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { ValidationSchema } from 'theme/index';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';
import { PopUpItem } from 'types/applicationInterfaces';

import { style } from './style';

type FormData = {
  networkUrl: string;
  networkName: string;
  chainId: string;
};

const AddNetwork = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();

  const { Common, Fonts, Gutters, Colors } = useTheme();

  const [isChainURLValid, setIsChainURLValid] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExistingNetworksItem>({});

  const [addNetworkUrl, setAddNetworkUrl] = useState('');
  const debouncedValue = useDebounce<string>(addNetworkUrl, 500);

  const tokensList = useSelector((state: RootState) => {
    return state.wallet.data.tokensList;
  });

  const networkEnvironment = useSelector((state: RootState) => {
    return state.wallet.data.networkEnvironment;
  });

  // Set up react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    resetField,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    defaultValues: {
      networkUrl: '',
      networkName: '',
      chainId: '',
    },
    resolver: yupResolver(ValidationSchema.addNetwork),
  });

  const onPressOk = () => {};
  // Handle form submission
  const onSubmit = async (data: FormData) => {
    Keyboard.dismiss();

    const checkChainId = obj =>
      obj.providerNetworkRPC_URL.trim() === data.networkUrl.trim();
    if (!Object.values(tokensList).some(checkChainId)) {
      const popUpMaxAmountSendObj = {
        isVisible: true,
        isFromAddToken: true,
        popupTitle: t('wallet:You_have_added_token', {
          token: getValues().networkName.trim(),
        }),
        buttonOkText: t('common:Great'),
        okButtonType: 'primary',
        onPressOk: onPressOk,
      } as PopUpItem;
      showConfirmationModal(popUpMaxAmountSendObj);

      dispatch(
        addRemoveTokenFromList({
          token: selectedItem,
        }),
      );

      dispatch(triggerFetchAllTokenBalanceAndStartObservers());
      navigation.goBack();
    } else {
      setError('chainId', {
        type: 'custom',
        message: 'wallet:network_is_already_added',
      });
    }
  };

  useUpdateEffect(() => {
    if (addNetworkUrl) {
      checkRPCUrl(addNetworkUrl);
    }
  }, [debouncedValue]);

  // check RPC Url in EthersService and get chain data
  const checkRPCUrl = async (url: string) => {
    try {
      const chainData = await EthersService()
        .getNetworkInfoFromUrl(url)
        .getNetwork();
      if (chainData?.name && chainData?.name !== 'unknown') {
        setValue('networkName', chainData.name.toUpperCase(), {
          shouldValidate: true,
        });
      } else {
        setValue('networkName', '');
        setError('networkName', {
          type: 'custom',
          message: 'wallet:enter_network_name',
        });
      }
      setValue('chainId', chainData.chainId.toString());
      setIsChainURLValid(true);
      createTokenInfo();
    } catch (error) {
      setValue('networkName', '');
      setValue('chainId', '');
      setError('networkUrl', {
        type: 'custom',
        message: 'wallet:enter_correct_network_url',
      });
      setIsChainURLValid(false);
      setSelectedItem({});
    }
  };

  const createTokenInfo = async () => {
    const shortName = generateRandomString(6);
    const tokenObject = {
      title: getValues().networkName.trim(),
      shortName: shortName,
      subTitle: getValues().networkName.trim(),
      amount: '0.0',
      usdAmount: '0.0',
      networkId: generateRandomString(3),
      networkName: getValues().networkName.trim(),
      tokenType: 'Native',
      providerNetworkRPC_URL: getValues().networkUrl.trim(),
      providerNetworkRPC_Network_Name: Number(getValues().chainId.trim()),
      isFavorite: false,
      isEVMNetwork: true,
      isCustom: true,
      envType: networkEnvironment,
    } as Partial<ExistingNetworksItem>;
    setSelectedItem(tokenObject);
    try {
      const balance = await EthersService().fetchEthBalance(
        getWalletAddress(defaultNetwork),
        tokenObject,
      );
      setSelectedItem({ ...tokenObject, amount: balance });
    } catch (error) {
      console.log('balance error', error);
    }
  };

  return (
    <View
      style={[Common.containerFillWithSmallHPadding, style(Colors).container]}
    >
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <HeaderWithTitleAndSubTitle
        title={t('wallet:addNetwork')}
        subTitle={t('wallet:addNetworkDesc')}
        onPressNext={handleSubmit(onSubmit)}
        rightButtonText={t('common:add')}
        shouldShowCancel={true}
        shouldHideBack={true}
        isNextDisabled={!isChainURLValid || !isValid}
      />
      <Text style={[Fonts.textOpacityRegular, style(Colors).subTitle]}>
        {t('wallet:how_can_i_find')}
      </Text>
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <Controller
          control={control}
          name="networkUrl"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <InputBox
                onChangeText={onChange}
                isShowError={errors?.networkUrl?.message ? true : false}
                errMessage={errors?.networkUrl?.message}
                placeholder={t('wallet:network_url')}
                onBlur={onBlur}
                value={value}
                backGroundColor={Colors.blackGray}
                onChangeValue={prop => {
                  if (prop.nativeEvent.text !== addNetworkUrl) {
                    resetField('chainId');
                    resetField('networkName');
                    setIsChainURLValid(false);
                    setSelectedItem({});
                  }
                  setValue('networkUrl', prop.nativeEvent.text, {
                    shouldValidate: true,
                  });
                  setAddNetworkUrl(prop.nativeEvent.text);
                }}
              />
              <Text
                style={[Fonts.textTinyDescriptionRegular, Gutters.tinyTMargin]}
              >
                {t('wallet:network_url_info')}
              </Text>
            </>
          )}
        />

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

        <Controller
          control={control}
          name="networkName"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <>
              <InputBox
                onChangeText={onChange}
                isShowError={errors?.networkName?.message ? true : false}
                errMessage={errors?.networkName?.message}
                placeholder={t('wallet:name')}
                onBlur={onBlur}
                value={value}
                backGroundColor={Colors.blackGray}
                editable={isChainURLValid}
                maxLength={MaximumPasswordCharacters}
                onChangeValue={prop => {
                  setValue('networkName', prop.nativeEvent.text, {
                    shouldValidate: true,
                  });
                  createTokenInfo();
                }}
              />
            </>
          )}
        />

        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

        <Controller
          control={control}
          name="chainId"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <InputBox
              onChangeText={onChange}
              placeholder={t('wallet:chain_id_decimal')}
              value={value}
              backGroundColor={Colors.blackGray}
              editable={false}
              isShowError={errors?.chainId?.message ? true : false}
              errMessage={errors?.chainId?.message}
              onBlur={onBlur}
            />
          )}
        />

        <Text style={[Fonts.textTinyDescriptionRegular, Gutters.tinyTMargin]}>
          {t('wallet:chain_id_decimal_info')}
        </Text>
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        {isValid && selectedItem ? (
          <WalletTokenItem item={selectedItem} />
        ) : (
          <WarningView warningArray={[t('wallet:add_network_note')]} />
        )}
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
      </ScrollView>
    </View>
  );
};

export default AddNetwork;
