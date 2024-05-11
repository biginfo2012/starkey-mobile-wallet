import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  DashBoardHeader,
  HeaderWithTitleAndSubTitle,
  HorizontalSeparatorView,
  NetworkFilterRawItem,
  SearchInputBox,
} from 'components/index';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import nextFrame from 'next-frame';
import WalletCommonService from 'services/WalletCommonService';
import { RootState } from 'store/index';
import { updateLoader } from 'store/loader';
import {
  addRemoveTokenFromList,
  triggerFetchAllTokenBalanceAndStartObservers,
  updateSelectedNetworkFilter,
} from 'store/wallet';
import { applyOpacityToHexColor } from 'theme/Helper/ColorUtils';
import { getWalletAddress } from 'theme/Helper/common/Function';
import { NetWorkType, defaultNetwork } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import ScreenNames from 'theme/screenNames';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { style } from './style';

const NetworkFilter = () => {
  const { Common, Fonts, Gutters, Layout, Images, Colors } = useTheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const dispatch = useDispatch();

  const [mainnetNetworkList, setMainnetNetworkList] =
    useState<ExistingNetworksItem[]>();

  const [searchText, setSearchText] = useState('');
  const walletAddress = useSelector((state: RootState) => {
    return state.wallet.data.walletAddress[state.userInfo.data.currentUserId];
  });

  const isWalletFromSeedPhase = useSelector((state: RootState) => {
    return state.userInfo.data.currentUser.isWalletFromSeedPhase;
  });
  const [selectedItem, setSelectedItem] = useState<ExistingNetworksItem>(null);

  const tokensList = useSelector((state: RootState) => {
    return state.wallet.data.tokensList;
  });

  const [envNetworkList, setEnvNetworkList] = useState([]);

  const networkEnvironment = useSelector((state: RootState) => {
    return state.wallet.data.networkEnvironment;
  });
  const selectedNetworkFilterObj = useSelector((state: RootState) => {
    return state.wallet.selectedNetworkFilter;
  });

  const selectedTokensList = useSelector((state: RootState) => {
    return state.wallet.data.selectedTokensList[
      state.userInfo.data.currentUserId
    ];
  });

  useEffect(() => {
    // Filter the tokensList to get the list of tokens with the given network environment
    const tempFilter = Object.values(tokensList).filter(item => {
      // Check if the token type is Native or the environment type matches the given network environment
      return (
        item.tokenType === 'Native' &&
        (item.envType === networkEnvironment || !item.isCustom)
      );
    });
    // Set the environment network list to the filtered list
    setEnvNetworkList(tempFilter);
  }, [tokensList]);

  useUpdateEffect(() => {
    if (isWalletFromSeedPhase) {
      const mainNetNetworkList = envNetworkList.filter(
        item =>
          item.tokenType === 'Native' && item.subTitle?.includes(searchText),
      );
      setMainnetNetworkList(mainNetNetworkList);
    } else {
      const tokenObj = envNetworkList.filter(
        item => item.shortName === Object.keys(walletAddress)[0],
      );
      if (tokenObj[0].isEVMNetwork) {
        const mainNetNetworkList = envNetworkList.filter(
          item => item.tokenType === 'Native' && item.isEVMNetwork,
        );
        setMainnetNetworkList(mainNetNetworkList);
      } else {
        setMainnetNetworkList(getNetworkArray(Object.values(tokenObj)));
      }
    }
  }, [searchText, envNetworkList]);

  const getNetworkArray = (tokenObj: { networkName: string }[]) => {
    let mainNetNetworkList;
    if (
      tokenObj[0].networkName === NetWorkType.SUP ||
      tokenObj[0].networkName === NetWorkType.APT
    ) {
      mainNetNetworkList = envNetworkList.filter(
        item =>
          (item.tokenType === 'Native' &&
            item.networkName === NetWorkType.SUP) ||
          (item.tokenType === 'Native' && item.networkName === NetWorkType.APT),
      );
    } else {
      mainNetNetworkList = envNetworkList.filter(
        item =>
          item.tokenType === 'Native' &&
          tokenObj[0].networkName === item.networkName,
      );
    }
    return mainNetNetworkList;
  };

  useEffect(() => {
    selectedNetworkFilterObj && setSelectedItem(selectedNetworkFilterObj);
  }, [selectedNetworkFilterObj]);

  const toggleCheckBox = (itemObj: ExistingNetworksItem) => {
    setSelectedItem(prevSelectedItem => {
      return prevSelectedItem === itemObj ? null : itemObj;
    });
  };

  const handleApplyFilter = async () => {
    if (
      !getWalletAddress(
        selectedItem?.networkName,
        selectedItem?.isEVMNetwork,
      ) &&
      selectedItem
    ) {
      dispatch(
        updateLoader({
          isLoading: true,
        }),
      );
      await nextFrame();

      dispatch(
        addRemoveTokenFromList({
          token: selectedItem,
        }),
      );
      !selectedItem.isEVMNetwork &&
        (await WalletCommonService().getWalletUsingSeed(selectedItem));

      dispatch(triggerFetchAllTokenBalanceAndStartObservers());
      const updatedArray = updateItemByCustomKey(
        mainnetNetworkList,
        selectedItem.shortName,
        selectedItem,
        'shortName',
      );
      setMainnetNetworkList(updatedArray);
      dispatch(
        updateLoader({
          isLoading: false,
        }),
      );
    }
    dispatch(updateSelectedNetworkFilter({ data: selectedItem }));
    navigation.goBack();
  };

  const renderNetworkItem = ({
    item,
    index,
  }: {
    item: ExistingNetworksItem;
    index: number;
  }) => {
    return (
      <Pressable
        onPress={() => toggleCheckBox(item)}
        style={
          style(Gutters, Layout, Colors, index, mainnetNetworkList?.length)
            .itemContainer
        }
      >
        <NetworkFilterRawItem
          onPress={() => toggleCheckBox(item)}
          item={item}
          selectedItem={selectedItem}
          onCreatePress={async () => {
            dispatch(
              updateLoader({
                isLoading: true,
              }),
            );
            await nextFrame();

            dispatch(
              addRemoveTokenFromList({
                token: item,
              }),
            );
            !item.isEVMNetwork &&
              (await WalletCommonService().getWalletUsingSeed(item));

            dispatch(triggerFetchAllTokenBalanceAndStartObservers());
            const updatedArray = updateItemByCustomKey(
              mainnetNetworkList,
              item.shortName,
              item,
              'shortName',
            );
            setMainnetNetworkList(updatedArray);
            dispatch(
              updateLoader({
                isLoading: false,
              }),
            );
          }}
        />
      </Pressable>
    );
  };

  return (
    <View
      style={[
        Common.containerFillWithSmallHPadding,
        style(Gutters, Layout, Colors).container,
      ]}
    >
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
      <DashBoardHeader
        leftImage={Images.ic_back}
        rightImage={
          isWalletFromSeedPhase || selectedTokensList.includes(defaultNetwork)
            ? Images.ic_add
            : undefined
        }
        rightImageStyle={style(Gutters, Layout).headerRightImage}
        onPressLeftImage={() => {
          navigation.goBack();
        }}
        onPressRightImage={() => {
          if (selectedItem !== null) {
            setSelectedItem(null);
            dispatch(updateSelectedNetworkFilter({ data: null }));
          } else {
            if (
              isWalletFromSeedPhase ||
              selectedTokensList.includes(defaultNetwork)
            ) {
              navigation.navigate(ScreenNames.AddNetwork);
            }
          }
        }}
        shouldShowCancel={true}
        shouldShowClear={selectedItem !== null}
        leftText={t('common:cancel')}
        rightText={t('common:Clear')}
      />
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />

      <HeaderWithTitleAndSubTitle
        shouldHideBack={true}
        title={t('wallet:networkFilter')}
        subTitle={t('wallet:to_use_test_networks_switch_in_the_settings', {
          networkType:
            networkEnvironment === 'testNet'
              ? t('wallet:main')
              : t('wallet:test'),
        })}
        hasLargeTitle
      />
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

      <SearchInputBox
        placeholder={t('wallet:networkName')}
        value={searchText}
        onChangeText={text => {
          setSearchText(text);
        }}
        backGroundColor={applyOpacityToHexColor(Colors.bottomButtonBG, 0.24)}
      />
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />

      {mainnetNetworkList?.length > 0 && searchText.length ? (
        <Text style={[Fonts.textSmallMediumExtraBold]}>
          {mainnetNetworkList?.length +
            (mainnetNetworkList?.length > 1
              ? t('setting:results')
              : t('setting:result'))}
        </Text>
      ) : (
        <></>
      )}

      {/* Token List */}
      <View style={style(Gutters, Layout).flatListContainer}>
        <FlatList
          data={mainnetNetworkList}
          bounces={false}
          keyExtractor={item => item.id.toString()}
          renderItem={renderNetworkItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={Gutters.tinyBPadding}
          ListEmptyComponent={
            <Text style={Fonts.textSmallDescriptionBold}>
              {t('common:no_network_yet')}
            </Text>
          }
        />
      </View>

      <View style={style(Gutters, Layout).bottomView}>
        <Button text={t('common:apply')} onPress={handleApplyFilter} />
      </View>
    </View>
  );
};

// Function to update an item by its Short Name
function updateItemByCustomKey(
  array: any[] | undefined,
  valueOfDynamicKey: string,
  updatedItem: ExistingNetworksItem,
  keyName: string,
) {
  return array?.map((item: { [x: string]: any }) => {
    if (item[keyName] === valueOfDynamicKey) {
      return { ...item, ...updatedItem };
    }
    return item;
  });
}

export default NetworkFilter;
