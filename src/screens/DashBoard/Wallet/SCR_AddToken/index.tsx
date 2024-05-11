import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from '@react-navigation/native';
import {
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  InputBox,
  SafeAreaWrapper,
  TabBar,
  WalletTokenItem,
  AddTokenListView,
  NetworkListDropDownView,
} from 'components/index';
import useDebounce from 'customHooks/useDebounce';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import nextFrame from 'next-frame';
import WalletCommonService from 'services/WalletCommonService';
import { AppDispatch, RootState } from 'store/index';
import { updateLoader } from 'store/loader';
import {
  addRemoveTokenFromList,
  triggerFetchAllTokenBalanceAndStartObservers,
} from 'store/wallet';
import {
  generateRandomString,
  showConfirmationModal,
  showToast,
} from 'theme/Helper/common/Function';
import {
  NetWorkType,
  defaultNetwork,
  networksURLList,
} from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { ValidationSchema } from 'theme/index';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';
import { PopUpItem, SortingItem } from 'types/applicationInterfaces';

import { style } from './style';

type FormData = {
  contractAddress: string;
  symbol: string;
  decimal: string;
};

const AddToken = () => {
  const navigation = useNavigation();

  const { Common, Fonts, Colors } = useTheme();

  const tokensList = useSelector((state: RootState) => {
    return state.wallet.data.tokensList;
  });

  const [envNetworkList, setEnvNetworkList] = useState([]);

  const walletAddress = useSelector((state: RootState) => {
    return state.wallet.data.walletAddress[state.userInfo.data.currentUserId];
  });

  const networkArray = useSelector((state: RootState) => {
    return state.wallet.data.currentUserTokenArrayWithBalance;
  });

  const isWalletFromSeedPhase = useSelector((state: RootState) => {
    return state.userInfo.data.currentUser.isWalletFromSeedPhase;
  });

  const selectedTokensList = useSelector((state: RootState) => {
    return (
      state.wallet.data.selectedTokensList[state.userInfo.data.currentUserId] ??
      []
    );
  });

  const networkEnvironment = useSelector((state: RootState) => {
    return state.wallet.data.networkEnvironment;
  });

  const [selectedNetwork, setSelectedNetwork] = useState<SortingItem>();

  const [allNetworkList, setAllNetworkList] = useState([]);

  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [isAddEnable, setIsAddEnable] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ExistingNetworksItem>({});
  const [selectedTokenList, setSelectedTokenList] = useState([]);

  const tabs = ['common:tab_types.search', 'common:tab_types.custom_tokens'];

  useEffect(() => {
    // Filter the tokensList to get the list of tokens with the given network environment
    const tempFilter = Object.values(tokensList).filter(item => {
      // Check if the token type is Native or the environment type matches the given network environment
      return (
        (item.tokenType === 'Native' && !item.isCustom) ||
        item.envType === networkEnvironment
      );
    });
    // Set the environment network list to the filtered list
    setEnvNetworkList(tempFilter);
  }, [tokensList]);

  const getCustomTokenWithoutSelected = () => {
    let customTokenWithoutSelected = [];
    // Filter out tokens that are not part of the selected tokens list
    for (const tokenObj of envNetworkList) {
      // Filter out tokens that are part of the selected tokens list
      if (
        !isWalletFromSeedPhase &&
        selectedTokensList.includes(defaultNetwork)
      ) {
        // Filter out tokens that are not part of the selected tokens list
        if (tokenObj.isEVMNetwork && tokenObj.tokenType !== 'ERC20') {
          customTokenWithoutSelected.push(tokenObj);
        }
      }
      // Filter out tokens that are part of the selected tokens list
      if (
        tokenObj.tokenType === 'Native' &&
        selectedTokensList.includes(tokenObj.shortName)
      ) {
        // Filter out tokens that are part of the selected tokens list
        let tempFilter = envNetworkList.filter(
          item =>
            item.tokenType !== 'Native' &&
            item.networkName === tokenObj.networkName,
        );
        customTokenWithoutSelected.push(...tempFilter);
      }
    }
    // Filter out tokens that are not part of the selected tokens list
    let filterTokens = Object.values(customTokenWithoutSelected).filter(
      item => !selectedTokensList.includes(item.shortName),
    );

    return filterTokens;
  };

  useUpdateEffect(() => {
    let walletNetworkFiltering = [];
    let filterTokenList = [];

    if (isWalletFromSeedPhase) {
      filterTokenList = envNetworkList.filter(
        item =>
          item.tokenType === 'Native' &&
          // item.isCustom !== true &&
          !selectedTokensList.includes(item.shortName),
      );
      filterTokenList = filterTokenList.concat(getCustomTokenWithoutSelected());
    } else {
      if (!selectedTokensList.length) {
        filterTokenList = envNetworkList.filter(
          item =>
            item.shortName === Object.keys(walletAddress)[0] &&
            item.isCustom !== true,
        );
      } else {
        if (
          Object.keys(walletAddress)[0] === NetWorkType.SUP ||
          Object.keys(walletAddress)[0] === NetWorkType.APT
        ) {
          filterTokenList = envNetworkList.filter(
            item =>
              item.tokenType === 'Native' &&
              !selectedTokensList.includes(item.shortName) &&
              (item.networkName === NetWorkType.SUP ||
                item.networkName === NetWorkType.APT) &&
              item.isCustom !== true,
          );
          let filterArrayForGetErc20TokenWhoseNativeNetworkEnabled =
            envNetworkList.filter(
              item =>
                item.tokenType !== 'Native' &&
                selectedTokensList.includes(item.networkName) &&
                item.isCustom !== true,
            );
          let filterTokenWhoseAlreadyAddedInSelectedList = Object.values(
            filterArrayForGetErc20TokenWhoseNativeNetworkEnabled,
          ).filter(item => !selectedTokensList.includes(item.shortName));
          filterTokenList = filterTokenList.concat(
            filterTokenWhoseAlreadyAddedInSelectedList,
          );
        } else {
          filterTokenList = getCustomTokenWithoutSelected();
        }
      }
    }

    walletNetworkFiltering = [
      {
        title: filterTokenList.length ? 'wallet:all' : t('common:no_token_yet'),
        data: filterTokenList,
      },
    ];

    setAllNetworkList(walletNetworkFiltering);
  }, [envNetworkList]);

  // Set up react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      contractAddress: '',
      symbol: '',
      decimal: '',
    },
    resolver: yupResolver(ValidationSchema.addCustomToken),
  });

  const watchContractAddress = watch('contractAddress', '');

  const watchSymbol = watch('symbol', '');

  const debouncedContractAddress = useDebounce<string>(
    watchContractAddress,
    300,
  );

  const onPressOk = () => {
    navigation.goBack();
  };

  // Handle form submission
  const onSubmit = async (_data: FormData) => {
    Keyboard.dismiss();

    if (
      Object.values(networkArray)?.filter(
        item => item.tokenContractAddress === selectedItem.tokenContractAddress,
      ).length === 0
    ) {
      dispatch(
        addRemoveTokenFromList({
          token: selectedItem,
        }),
      );

      if (isWalletFromSeedPhase) {
        if (!selectedItem.isEVMNetwork) {
          selectedItem.tokenType !== 'ERC20' &&
            (await WalletCommonService().getWalletUsingSeed(
              selectedItem,
              WalletCommonService().getDerivationPathIndex(
                selectedItem.networkName,
              ),
            ));
        }
      }
      dispatch(triggerFetchAllTokenBalanceAndStartObservers());
      const popUpMaxAmountSendObj = {
        isVisible: true,
        isFromAddToken: true,
        popupTitle: t('wallet:You_have_added_token', {
          token: selectedItem.title,
        }),
        buttonOkText: t('common:Great'),
        okButtonType: 'primary',
        onPressOk: onPressOk,
        iconPath: selectedItem.image,
      } as PopUpItem;
      showConfirmationModal(popUpMaxAmountSendObj);
    } else {
      showToast('info', 'Token already added!');
    }
    navigation.goBack();
  };

  // Handle add token
  const addSelectedToken = async () => {
    dispatch(
      updateLoader({
        isLoading: true,
      }),
    );
    var i = 0;
    do {
      var currentItem = selectedTokenList[i];
      await nextFrame();

      dispatch(
        addRemoveTokenFromList({
          token: currentItem,
        }),
      );

      if (isWalletFromSeedPhase) {
        if (!currentItem.isEVMNetwork) {
          currentItem.tokenType !== 'ERC20' &&
            (await WalletCommonService().getWalletUsingSeed(currentItem));
        }
      }
      dispatch(triggerFetchAllTokenBalanceAndStartObservers());

      i++;
    } while (i < selectedTokenList.length);
    dispatch(
      updateLoader({
        isLoading: false,
      }),
    );
    navigation.goBack();
  };

  useUpdateEffect(() => {
    setIsAddEnable(isValid);
  }, [isValid]);

  useUpdateEffect(() => {
    //reset form before fetching token info
    setValue('symbol', '');
    setValue('decimal', '');
    setError('contractAddress', null);
    //fetch token info by contract address before that validate with api call
    fetchTokenInfo();
  }, [debouncedContractAddress]);

  // watchSymbol
  useUpdateEffect(() => {
    setSelectedItem(prevSelectedItem => ({
      ...prevSelectedItem,
      title: watchSymbol.trim(),
    }));
  }, [watchSymbol]);

  const fetchTokenInfo = async () => {
    if (!selectedNetwork) {
      return;
    }
    const { decimals, error, symbol, logoURI, name, balance } =
      await WalletCommonService().getCustomTokenInfoByTokenAddress(
        debouncedContractAddress,
        networkArray[selectedNetwork?.id],
      );

    if (!isDirty) {
      return;
    }
    if (error) {
      console.log('Error: ', error);
      setError('contractAddress', {
        message: error,
      });
      return;
    } else {
      setError('contractAddress', null);
    }

    setValue('symbol', symbol, {
      shouldValidate: true,
    });
    setValue('decimal', decimals.toString(), {
      shouldValidate: true,
    });

    const shortName = generateRandomString(6) + '_' + selectedNetwork?.id;
    const tokenObject = {
      title: symbol,
      subTitle: name,
      shortName: shortName,
      amount: balance?.toString() || '0.0',
      usdAmount: '0.0',
      image: logoURI ? logoURI : undefined,
      networkName: selectedNetwork?.id,
      tokenType: 'ERC20',
      tokenContractAddress: watchContractAddress,
      isEVMNetwork: tokensList[selectedNetwork?.id].isEVMNetwork,
      ...networksURLList[selectedNetwork?.networkId][networkEnvironment],
      isCustom: true,
      envType: networkEnvironment,
    } as Partial<ExistingNetworksItem>;
    setSelectedItem(tokenObject);
  };

  return (
    <SafeAreaWrapper applyToOnlyTopEdge={false}>
      <View style={Common.containerFillWithSmallHPadding}>
        <HeaderWithTitleAndSubTitle
          shouldHideBack={true}
          shouldShowCancel={true}
          onPressNext={
            activeTab === 1 ? handleSubmit(onSubmit) : addSelectedToken
          }
          rightButtonText={'Add'}
          title={t('wallet:add_token_title')}
          isNextDisabled={!isAddEnable ? true : false}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={index => {
            setActiveTab(index);
            setIsAddEnable(false);
          }}
          activeTabStyle={{
            backgroundColor: Colors.textGray800,
          }}
          activeTabTextStyle={{
            color: Colors.white,
          }}
        />
        <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
        {activeTab === 0 && (
          <AddTokenListView
            testID="AddTokenListView"
            items={allNetworkList}
            handleIsAddEnable={items => {
              setSelectedTokenList(items);
              setIsAddEnable(items.length === 0 ? false : true);
            }}
          />
        )}
        {activeTab === 1 && (
          <>
            <Text style={Fonts.textOpacityRegular}>
              {t('wallet:custom_tokens_title')}
            </Text>
            <Text style={[Fonts.textOpacityRegular, style(Colors).subTitle]}>
              {t('wallet:custom_tokens_subtitle')}
            </Text>
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
            <NetworkListDropDownView
              selectedNetwork={selectedNetwork}
              onSelectedNetwork={item => {
                if (item.id === selectedNetwork?.id) {
                  return;
                }
                reset();
                setSelectedNetwork(item);
              }}
              filteredNetworkIds={selectedTokensList}
            />
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
            <Controller
              control={control}
              name="contractAddress"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <>
                  <InputBox
                    onChangeText={onChange}
                    isShowError={
                      errors?.contractAddress?.message ? true : false
                    }
                    errMessage={errors?.contractAddress?.message}
                    placeholder={t('wallet:contract_address')}
                    onBlur={onBlur}
                    value={value}
                    backGroundColor={Colors.inputBackground}
                    editable={selectedNetwork?.id ? true : false}
                  />
                </>
              )}
            />
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
            <Controller
              control={control}
              name="symbol"
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <>
                  <InputBox
                    onChangeText={onChange}
                    placeholder={t('wallet:symbol')}
                    onBlur={onBlur}
                    value={value}
                    backGroundColor={Colors.inputBackground}
                    editable={selectedNetwork?.id ? true : false}
                    maxLength={10}
                  />
                </>
              )}
            />
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
            <Controller
              control={control}
              name="decimal"
              rules={{
                required: false,
              }}
              render={({ field: { onChange, value, onBlur } }) => (
                <>
                  <InputBox
                    onChangeText={onChange}
                    placeholder={t('wallet:decimal')}
                    onBlur={onBlur}
                    value={value}
                    backGroundColor={Colors.inputBackground}
                    keyboardType="number-pad"
                    editable={false}
                  />
                </>
              )}
            />

            <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

            {isValid && <WalletTokenItem item={selectedItem} />}
          </>
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default AddToken;
