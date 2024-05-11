import React, { useEffect, useRef, useState } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ActivityListHandleType } from 'components/ActivityListView/ActivityListView.types';
import {
  ActivityListView,
  BorderButton,
  DashBoardHeader,
  HorizontalSeparatorView,
  SafeAreaWrapper,
  SortByFilterBottomSheetView,
  TokenGasPriceView,
  TokenPriceView,
} from 'components/index';
import useUpdateEffect from 'customHooks/useUpdateEffect';
import useTheme from 'hooks/useTheme';
import { t } from 'i18next';
import SupraService from 'services/SupraService';
import WalletCommonService from 'services/WalletCommonService';
import { getTokenActivityListFetch } from 'services/apiActions';
import { AppDispatch, RootState } from 'store/index';
import {
  setTokenAsFavorite,
  hideTokenFromList,
  updateTokenTransactionDetails,
  updateSelectedNetworkFilter,
} from 'store/wallet';
import {
  USDollar,
  getRoundDecimalValue,
  getWalletAddress,
  showConfirmationModal,
  showToast,
} from 'theme/Helper/common/Function';
import {
  DeviceMetrics,
  NetWorkType,
  coinGeckoPriceChartBaseURL,
} from 'theme/Helper/constant';
import Variables from 'theme/Variables';
import { mockData } from 'theme/mockData';
import ScreenNames from 'theme/screenNames';
import { ActivityItemInterface } from 'types/apiResponseInterfaces';
import { PopUpItem } from 'types/applicationInterfaces';

import { style } from './style';

const TokenDetails: React.FC<any> = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const refFilter = useRef<ActivityListHandleType>();
  const [mounted, setMounted] = useState(false);

  const { Common, Images, Gutters } = useTheme();

  const dispatch = useDispatch<AppDispatch>();

  const shouldShowBalance = useSelector(
    (state: RootState) => state.userInfo.data.config.shouldHideAccountBalance,
  );
  const currentTokenInfo = useSelector((state: RootState) => {
    return state.wallet.data.currentSelectedToken;
  });

  const activityList = useSelector((state: RootState) => {
    return state.wallet.data.activityList;
  });

  const apiError = useSelector((state: RootState) => {
    return state.wallet.errorActivityList;
  });

  const shouldShowLoader = useSelector((state: RootState) => {
    return state.wallet.loaderActivityList;
  });

  const activityListFooterLoader = useSelector((state: RootState) => {
    return state.wallet.data.activityListFooterLoader;
  });

  const nativeCurrencyToken = useSelector((state: RootState) => {
    return currentTokenInfo?.tokenType === 'Native'
      ? currentTokenInfo
      : state.wallet.data.currentUserTokenArrayWithBalance[
          currentTokenInfo?.networkName
        ];
  });

  const [openFilterBottomSheet, setOpenFilterBottomSheet] = useState(false);
  const [shouldShowFooterLoader, setShouldShowFooterLoader] = useState(false);
  const [currentPage] = useState(1);
  const [estimatedGasFeeInGwei, setEstimatedGasFeeInGwei] = useState(0);

  const [isGasFeeFetching, setIsGasFeeFetching] = useState(true);

  const selectedNetworkFilterObj = useSelector((state: RootState) => {
    return state.wallet.selectedNetworkFilter;
  });

  const callOk = () => {
    showToast('error', t('common:token_hidden'));
    dispatch(
      hideTokenFromList({
        token: currentTokenInfo,
      }),
    );
    if (selectedNetworkFilterObj?.id === currentTokenInfo?.id) {
      dispatch(updateSelectedNetworkFilter({ data: null }));
    }
    navigation.goBack();
  };

  const onPressCancel = () => {};

  const popUpLogOutObj = {
    isVisible: true,
    popupTitle: t('wallet:hide_custom_network_title'),
    popupDescription: t('wallet:hide_custom_network_des'),
    buttonOkText: t('common:Hide_Now'),
    okButtonType: 'destructive',
    buttonCancelText: t('common:cancel'),
    onPressOk: callOk,
    onPressCancel: onPressCancel,
    iconPath: Images.ic_cancel_transaction,
  } as PopUpItem;

  const getGasFees = async () => {
    setIsGasFeeFetching(true);
    let feeData;
    try {
      feeData = await WalletCommonService().getFeeData(currentTokenInfo);
    } catch (error) {
      feeData = error;
    } finally {
      setIsGasFeeFetching(false);
      setEstimatedGasFeeInGwei(feeData?.gasPrice);
    }
  };

  useEffect(() => {
    navigation.addListener('transitionEnd', () => {
      setMounted(true);
    });
  }, [navigation]);

  useUpdateEffect(() => {
    getGasFees();
  }, [mounted]);

  useUpdateEffect(() => {
    if (currentPage !== 1) {
      setShouldShowFooterLoader(activityListFooterLoader);
    }
  }, [activityListFooterLoader]);

  useEffect(() => {
    dispatch(
      getTokenActivityListFetch({
        walletAddress: getFormattedWalletAddress(),
        txtType: currentTokenInfo?.title,
        contractAddress: currentTokenInfo?.tokenContractAddress ?? '',
        page: currentPage,
        netWorkName: currentTokenInfo?.providerNetworkRPC_Network_Name,
        tokenInfo: currentTokenInfo,
        hash: activityList?.length
          ? activityList[activityList?.length - 1].hash
          : '',
      }),
    );
  }, [currentPage]);

  const getFormattedWalletAddress = () => {
    return getWalletAddress(
      currentTokenInfo?.networkName,
      currentTokenInfo?.isEVMNetwork,
    );
  };

  return (
    <>
      <SafeAreaWrapper applyToOnlyTopEdge={false}>
        <View style={Common.containerFillWithSmallHPadding}>
          <ScrollView
            overScrollMode="never"
            bounces={false}
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
          >
            <DashBoardHeader
              leftImage={Images.ic_back}
              onPressLeftImage={() => {
                navigation.goBack();
              }}
            />
            <HorizontalSeparatorView spacing={Variables.MetricsSizes.small} />
            <TokenGasPriceView
              tokenIconPath={currentTokenInfo?.image}
              amount={
                (getRoundDecimalValue(currentTokenInfo?.amount) ?? '0') +
                '\n' +
                currentTokenInfo?.title
              }
              usdAmount={
                currentTokenInfo?.amount * currentTokenInfo?.usdAmount > 0
                  ? USDollar().format(
                      currentTokenInfo?.amount * currentTokenInfo?.usdAmount,
                    )
                  : undefined
              }
              gasPriceGwei={
                (estimatedGasFeeInGwei
                  ? getRoundDecimalValue(estimatedGasFeeInGwei) ?? '0'
                  : 0) +
                ' ' +
                (nativeCurrencyToken?.tokenGasFeeUnitToDisplay
                  ? nativeCurrencyToken?.tokenGasFeeUnitToDisplay
                  : t('common:gwei'))
              }
              usdGasPriceGwei={
                USDollar(15).format(
                  getRoundDecimalValue(
                    (estimatedGasFeeInGwei ? estimatedGasFeeInGwei : 0) *
                      Math.pow(
                        10,
                        nativeCurrencyToken?.shortName === NetWorkType.APT
                          ? -8
                          : -9,
                      ) *
                      nativeCurrencyToken?.usdAmount,
                  ),
                ) ?? '0'
              }
              onPressAlert={() => {}}
              onPressReceive={() => {
                navigation.navigate(ScreenNames.ReceiveToken);
              }}
              onPressSend={() => {
                navigation.navigate(ScreenNames.WalletTokenSendFrom);
              }}
              onPressCollect={
                nativeCurrencyToken?.shortName === NetWorkType.SUP
                  ? () => {
                      SupraService().collectTokenFromFaucet(currentTokenInfo);
                    }
                  : null
              }
              onPressSwap={() => {}}
              onPressBuy={() => {}}
              onPressHide={() => {
                if (
                  currentTokenInfo?.isCustom &&
                  currentTokenInfo?.tokenType === 'Native'
                ) {
                  setTimeout(() => {
                    showConfirmationModal(popUpLogOutObj);
                  }, 400);
                } else {
                  callOk();
                }
              }}
              isFavorite={currentTokenInfo?.isFavorite}
              onPressFavorite={() => {
                dispatch(
                  setTokenAsFavorite({
                    shortName: currentTokenInfo?.shortName,
                  }),
                );
              }}
              shouldShowBalance={shouldShowBalance}
              isGasFeeFetching={isGasFeeFetching}
              isShowHide={
                currentTokenInfo?.shortName === NetWorkType.SUP ||
                currentTokenInfo?.shortName === NetWorkType.ETH
              }
            />

            {currentTokenInfo?.coingeckoTokenId && (
              <>
                <HorizontalSeparatorView
                  spacing={Variables.MetricsSizes.small}
                />
                <TokenPriceView
                  title={currentTokenInfo?.title + ' ' + t('common:Price')}
                  amount={USDollar().format(currentTokenInfo?.usdAmount ?? 0)}
                  percentage={
                    currentTokenInfo?.oneDayUSDPriceChangePercentage?.toFixed(
                      2,
                    ) ?? 0 + ''
                  }
                  onPress={() => {
                    Linking.openURL(
                      `${coinGeckoPriceChartBaseURL}${currentTokenInfo?.coingeckoTokenId}`,
                    );
                  }}
                />
              </>
            )}

            <HorizontalSeparatorView spacing={Variables.MetricsSizes.regular} />
            <ActivityListView
              tokenType={currentTokenInfo?.title}
              walletAddress={getFormattedWalletAddress()}
              ref={refFilter}
              tokenList={activityList}
              onPressFilter={() => {
                setOpenFilterBottomSheet(true);
              }}
              onPressItem={(item: ActivityItemInterface) => {
                if (item?.hash === '') {
                  dispatch(updateTokenTransactionDetails(item));
                  navigation.navigate(ScreenNames.ActivityDetails, {
                    isFrom: 'send',
                    activityItemObj: {},
                  });
                } else {
                  navigation.navigate(ScreenNames.ActivityDetails, {
                    isFrom: 'activityList',
                    activityItemObj: item,
                  });
                }
              }}
              shouldShowLoader={shouldShowLoader}
              shouldShowFooterLoader={shouldShowFooterLoader}
              shouldShowBalance={shouldShowBalance}
              shouldShowNoData={apiError !== ''}
            />
          </ScrollView>
          {apiError !== '' && activityList?.length === 0 && (
            <View
              style={
                DeviceMetrics.hasNotch
                  ? style(Gutters).bottomViewTiny
                  : style(Gutters).bottomView
              }
            >
              {currentTokenInfo?.explorerAccountURL && (
                <BorderButton
                  text={t('wallet:view_full_history_on_explorer')}
                  onPress={() => {
                    Linking.openURL(
                      currentTokenInfo?.explorerAccountURL?.replace(
                        '$tx',
                        getFormattedWalletAddress(),
                      ),
                    );
                  }}
                />
              )}
            </View>
          )}
        </View>
      </SafeAreaWrapper>
      {/* Filter modal */}
      <SortByFilterBottomSheetView
        onChange={() => {}}
        multiSelect={true}
        title={t('common:Filter')}
        onDonePress={item => {
          setOpenFilterBottomSheet(false);
          refFilter?.current?.applySortFilter(item, 'filter');
        }}
        onClearPress={() => {
          refFilter?.current?.applySortFilter({}, 'clearFilter');
        }}
        isSheetOpen={openFilterBottomSheet}
        items={mockData.tokenDetailActivityListFilter}
        onClose={() => {
          refFilter?.current?.applySortFilter({}, 'clearFilter');
          setOpenFilterBottomSheet(false);
        }}
      />
    </>
  );
};

export default TokenDetails;
