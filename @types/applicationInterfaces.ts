import { ImageSourcePropType } from 'react-native';

import { ExistingNetworksItem } from './apiResponseInterfaces';

export interface SortingItem {
  id: string;
  image: ImageSourcePropType;
  text: string;
  shortName?: string;
  networkId?: string;
}

export interface ErrorMessages {
  [key: string]: string;
}

export interface RecoveryOptionItemType {
  id: string;
  image: string;
  text: string;
}

export interface RecoveryOptionItem {
  id: number;
  title: string;
  tagText: string;
  description: string;
  image: any;
}

export interface PopUpItem {
  isVisible?: boolean;
  popupTitle: string;
  popupTitleValueParams: {};
  popupDescription?: string;
  popupDescriptionValueParams: {};
  buttonOkText: string;
  okButtonType?: 'primary' | 'destructive';
  buttonCancelText?: string;
  onPressOk: () => void;
  onPressCancel?: () => void;
  iconPath: ImageSourcePropType;
  imagePath?: ImageSourcePropType;
  seconds?: string;
  amount?: string;
  usdAmount?: string;
  tokenType?: string;
  isFromAddToken?: boolean;
}

export interface TokenReceivePopUpItem {
  type: 'tokenReceive' | 'tokenSend';
  symbol: string;
  tokenObj: ExistingNetworksItem;
  isExists: boolean;
  amount: string;
  onPressOk: () => void;
  onPressCancel?: () => void;
}

export interface GasPriceAlertPopUpItem {
  type: 'setGasPriceAlert';
  tokenWithAmount: string;
  usdAmount: string;
  onPressOk: () => void;
  onPressCancel: () => void;
  imagePath: ImageSourcePropType;
}

export interface ActivityRequestType {
  walletAddress: string;
  txtType: string;
  contractAddress?: string;
  page: number;
  blockNumber?: number;
  netWorkName?: string | number;
  tokenInfo: ExistingNetworksItem;
  hash?: string;
}

export interface NetworkFilteringType {
  title: string;
  data: SortingItem[];
}

export interface EVMNativeTokenBalanceRequestType {
  walletAddress: string;
  netWorkName: string | number;
  shortName: string;
}

// Define the type for the token balance formatted object
export interface TokenBalanceFormatted {
  tokenBalance: string;
  tokenName: string;
}

export interface TokenUSDBalanceFormatted {
  tokenName: string;
  tokenUSDPrice: string;
}

export interface SettingConfig {
  isFaceIdEnabled: boolean;
  shouldHideTokenBalance: boolean;
  isAnalyticsEnable: boolean;
  currency: string;
  language: string;
  shouldHideAccountBalance: boolean;
  isSetupFileRecovery: boolean;
  isFaceIdEnabledForTransaction: boolean;
  autoLockTimer: number;
}

export interface RPC_URLItem {
  [key: string]: URLItem;
}

export interface URLItem {
  providerNetworkRPC_URL: string;
  explorerURL: string;
  providerNetworkRPC_Network_Name: string | number;
  networkId: string;
  tokenGasFeeUnitToDisplay?: string;
  indexerClient?: string;
  explorerAccountURL: string;
}

export interface GasFeeData {
  gasPrice: null | bigint | string | number;
  maxFeePerGas: null | bigint | string | number;
  maxPriorityFeePerGas: null | bigint | string | number;
  gasUsed?: null | bigint | string | number;
}

export interface CustomTokenInfo {
  decimals: string | number;
  name: string;
  symbol: string;
  type?: string;
  contractAddress: string;
  logoURI?: string;
  error?: string;
  balance?: string;
}

export interface RawItem {
  id: string;
  title: string;
  shortName: string;
}

export interface AddressItem {
  id: number;
  userName: string;
  address: string;
  networkName: string;
  shortName: string;
  isEVMNetwork: boolean;
  profileIcon: string | string[]; // icon url or color array
}

export interface RecentTrnAddressItem {
  address: string;
  networkShortName: string;
  profileIcon: string | string[]; // icon url or color array
  userId: string;
  userName?: string;
}
