import { createAsyncThunk } from '@reduxjs/toolkit';
import nextFrame from 'next-frame';
import { store } from 'store/index';
import {
  EnvironmentType,
  ExistingNetworksItem,
} from 'types/apiResponseInterfaces';
import {
  ActivityRequestType,
  EVMNativeTokenBalanceRequestType,
} from 'types/applicationInterfaces';

import AptosService from './AptosService';
import BalanceChangeObservers from './BalanceChangeObservers';
import EthersService from './EthersService';
import SolanaService from './SolanaService';
import SuiService from './SuiService';
import USDConversionService from './USDConversionService';
import WalletCommonService from './WalletCommonService';

export const getTokenActivityListFetch = createAsyncThunk(
  'getTokenActivityListFetch',
  async (data: ActivityRequestType) => {
    let activityList = [];
    const service = WalletCommonService().getServiceByNetworkName(
      data.tokenInfo.networkName,
    );
    activityList = await service.getTokenActivityListByAddress(data);
    if (
      store.getState().wallet.data.currentSelectedToken?.networkName ===
      data.tokenInfo.networkName
    ) {
      return activityList ? activityList : { data: [], isNativeToken: true };
    } else {
      return null;
    }
  },
);

export const getTokenTransactionDetailsFetch = createAsyncThunk(
  'getTokenTransactionDetailsFetch',
  async (data: any) => {
    let activityInfo = [];
    const service = WalletCommonService().getServiceByNetworkName(
      data.tokenInfo.networkName,
    );
    activityInfo = await service.getTokenTransactionDetails(data);
    return activityInfo;
  },
);

export const getEVMNativeTokenBalanceFetch = createAsyncThunk(
  'getEVMNativeTokenBalanceFetch',
  async (data: EVMNativeTokenBalanceRequestType) => {
    const activityInfo = await EthersService().getEVMNativeTokenBalance(data);
    return activityInfo;
  },
);

export const getUSDPrice = createAsyncThunk(
  'getUSDPrice',
  async (data: { item: ExistingNetworksItem[] }) => {
    const activityInfo = await USDConversionService().fetchUSDPrice(data);
    return activityInfo;
  },
);

export const getAllTokenBalanceAndStartObservers = createAsyncThunk(
  'getAllTokenBalanceAndStartObservers',
  async (data: {
    data: { [key: string]: ExistingNetworksItem };
    networkEnvironment: EnvironmentType;
  }) => {
    const tokenArray = Object.values(data?.data).filter(
      item => item.envType === data?.networkEnvironment,
    );
    const usdConversionService = USDConversionService();
    const balanceChangeObservers = BalanceChangeObservers();
    balanceChangeObservers.removeListeners();
    balanceChangeObservers.stopSolanaObservers();
    usdConversionService.removeListeners();

    const ERC20Tokens = tokenArray.filter(
      (item: ExistingNetworksItem) => item?.tokenType === 'ERC20',
    );

    await nextFrame();
    balanceChangeObservers.fetchAllErc20TokenBalances(ERC20Tokens);

    ERC20Tokens.forEach(async item => {
      await nextFrame();
      balanceChangeObservers.startErc20TokenTransferEventObserver(item);
    });

    await nextFrame();
    usdConversionService.startUSDPriceObserver(tokenArray);
    await nextFrame();
    const EVMNativeTokensArr = tokenArray?.filter(
      item => item.tokenType === 'Native',
    );

    EVMNativeTokensArr.forEach(async item => {
      await nextFrame();
      balanceChangeObservers.startEthBalanceObserver(item);
    });
  },
);

export const getSolanaCustomTokensBalanceFetch = createAsyncThunk(
  'getSolanaCustomTokensBalanceFetch',
  async (data: { item: ExistingNetworksItem[] }) => {
    const activityInfo = await SolanaService().getSolanaCustomTokenBalance(
      data.item,
    );
    return activityInfo;
  },
);

export const getAptosCustomTokensBalanceFetch = createAsyncThunk(
  'getAptosCustomTokensBalanceFetch',

  async (data: { item: ExistingNetworksItem[] }) => {
    const activityInfo = await AptosService().getAptosCustomTokenBalance(
      data.item,
    );
    return activityInfo;
  },
);

export const getSuiCustomTokensBalanceFetch = createAsyncThunk(
  'getSuiCustomTokensBalanceFetch',

  async (data: { item: ExistingNetworksItem[] }) => {
    const activityInfo = await SuiService().getSuiCustomTokenBalance(data.item);
    return activityInfo;
  },
);
