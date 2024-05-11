import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { height } from 'react-native-size-scaling';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FadeAnimationRef } from 'components/FadeAnimation/FadeAnimation.types';
import { TokenListHandleType } from 'components/TokensListView/TokensListView.types';
import {
  BackgroundView,
  DashBoardHeader,
  TokensListView,
  BottomSheetWrapper,
  WalletTabsWithTotalValue,
  SortByFilterBottomSheetView,
  SafeAreaWrapper,
  HorizontalSeparatorView,
  FadeAnimation,
  BorderButton,
} from 'components/index';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import { RootState } from 'store/index';
import { setCurrentSelectedTokenById } from 'store/wallet';
import { USDollar, getWalletAddress } from 'theme/Helper/common/Function';
import { DeviceMetrics } from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import mockData from 'theme/mockData';
import ScreenNames from 'theme/screenNames';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import { style } from './style';

const Wallet = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const refFilter = useRef<TokenListHandleType>();
  const refFadeAnimation = useRef<FadeAnimationRef>();

  const { Common, Colors, Images, Gutters, Layout } = useTheme();

  const dispatch = useDispatch();
  const inset = useSafeAreaInsets();

  const networkArray = useSelector((state: RootState) => {
    return state.wallet.data.currentUserTokenArrayWithBalance;
  });

  const totalValue = useSelector((state: RootState) => {
    return state.wallet.data.totalUSDBalance;
  });

  const userInfo = useSelector((state: RootState) => {
    return {
      currentUser: state.userInfo.data.currentUser,
      config: state.userInfo.data.config,
    };
  });

  const selectedNetworkFilterObj = useSelector((state: RootState) => {
    return state.wallet.selectedNetworkFilter;
  });

  const networkEnvironment = useSelector((state: RootState) => {
    return state.wallet.data.networkEnvironment;
  });

  const getNetWorkArray = useCallback(() => {
    const networkList = Object.values(networkArray).filter(
      item => item.envType === networkEnvironment,
    );

    return Object.values(networkList);
  }, [networkArray]);

  const [walletTabsHeight, setWalletTabsHeight] = useState(0);
  const [dashBoardHeaderHeight, setDashBoardHeaderHeight] = useState(0);
  const [selectedType, setSelectedType] = useState(0); // 0 for tokens and 1 for NFTs
  const [openSortingBottomSheet, setOpenSortingBottomSheet] = useState(false);

  useUpdateEffect(() => {
    refFilter?.current?.applySortFilter(
      selectedNetworkFilterObj ? [selectedNetworkFilterObj] : [],
      'filter',
    );
  }, [selectedNetworkFilterObj]);

  const snapPoints = useMemo(
    () => [
      height -
        (walletTabsHeight +
          dashBoardHeaderHeight +
          DeviceMetrics.bottomTabBarHeight +
          inset.top +
          inset.bottom +
          (Platform.OS === 'android' ? DeviceMetrics.statusBarHeight : 0) +
          DeviceMetrics.windowScreenDifference),
      '100%',
    ],
    [walletTabsHeight, dashBoardHeaderHeight],
  );

  // Handle the change event of the token sheet (expanded or collapsed)
  const handleTokenSheetChange = useCallback((index: number) => {
    index === 0
      ? refFadeAnimation?.current?.fadeIn()
      : refFadeAnimation?.current?.fadeOut();
  }, []);

  // Handle the change event of the sorting or filtering bottom sheet
  const handleSheetChange = useCallback(
    (index: number, type: 'Sorting' | 'filter') => {
      console.log('handleSortingSheetChange', index, type);
    },
    [],
  );

  return (
    <SafeAreaWrapper>
      <>
        <FadeAnimation ref={refFadeAnimation}>
          <BackgroundView
            image={Images.background.ic_backgroundGradientWalletLayer}
          />
        </FadeAnimation>
      </>

      <View
        style={Layout.fullWidth}
        onLayout={event => {
          setDashBoardHeaderHeight(event.nativeEvent.layout.height);
        }}
      >
        <DashBoardHeader
          testID="Wallet_DashBoardHeader"
          containerStyle={Common.smallHPadding}
          rightImage={
            userInfo.currentUser?.profileIcon
              ? userInfo.currentUser?.profileIcon
              : undefined
          }
          userName={userInfo.currentUser.userName}
        />
      </View>

      <View style={style(Gutters, Layout, Colors).wrapper}>
        <View
          style={Layout.fullWidth}
          onLayout={event => {
            setWalletTabsHeight(event.nativeEvent.layout.height);
          }}
        >
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />

          <WalletTabsWithTotalValue
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            tokenAmount={USDollar().format(parseFloat(totalValue))}
            onPressFilter={() => {
              navigation.navigate(ScreenNames.NetworkFilter);
            }}
            filterName={
              selectedNetworkFilterObj?.subTitle ?? t('wallet:all_networks')
            }
            shouldShowBalance={userInfo.config.shouldHideAccountBalance}
            walletAddress={getWalletAddress(
              selectedNetworkFilterObj?.networkName ?? '',
              selectedNetworkFilterObj?.isEVMNetwork,
            )}
          />
          <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
        </View>

        <BottomSheetWrapper
          backgroundStyle={style(Gutters, Layout, Colors).bottomSheetBg}
          style={Common.bottomSheet}
          snapPoints={snapPoints}
          onChange={handleTokenSheetChange}
          isSheetOpen
          handleIndicatorStyle={{ backgroundColor: Colors.background }}
          onClose={() => {}}
        >
          <TokensListView
            testID="TokensListView"
            ref={refFilter}
            tokenList={getNetWorkArray()}
            onPressFilter={() => {}}
            onPressSort={() => {
              setOpenSortingBottomSheet(true);
            }}
            onPressRedirect={async (item: ExistingNetworksItem) => {
              await dispatch(
                setCurrentSelectedTokenById({
                  tokenId: item.shortName,
                }),
              );
              navigation.navigate(ScreenNames.TokenDetails);
            }}
            searchRightIcon={Images.ic_ascending}
            shouldShowBalance={userInfo.config.shouldHideAccountBalance}
          />
        </BottomSheetWrapper>

        <BorderButton
          btnStyle={
            parseInt(totalValue || '0', 10) === 0
              ? style(Gutters, Layout, Colors).bottomButton
              : style(Gutters, Layout, Colors).bottomBorderButton
          }
          text={t('wallet:add_Token')}
          onPress={() => {
            navigation.navigate(ScreenNames.AddToken);
          }}
          textStyle={
            parseInt(totalValue || '0', 10) === 0
              ? style(Gutters, Layout, Colors).btnTextWithWhiteColor
              : style(Gutters, Layout, Colors).btnTextWithPurpleColor
          }
        />

        {/* Sort by modal */}
        <SortByFilterBottomSheetView
          multiSelect={false}
          title={t('Sort_by')}
          onDonePress={item => {
            setOpenSortingBottomSheet(false);
            refFilter?.current?.applySortFilter(item[0], 'sorting');
          }}
          onClearPress={() => {
            refFilter?.current?.applySortFilter({}, 'clearSorting');
          }}
          isSheetOpen={openSortingBottomSheet}
          onChange={index => handleSheetChange(index, 'Sorting')}
          items={mockData.walletNetworkSorting}
          onClose={() => {
            refFilter?.current?.applySortFilter({}, 'clearSorting');
            setOpenSortingBottomSheet(false);
          }}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default Wallet;
