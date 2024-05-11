import { Dimensions, Platform, StatusBar } from 'react-native';
import { defaultICloudContainerPath } from 'react-native-cloud-store';
import DeviceInfo from 'react-native-device-info';

import {
  CachesDirectoryPath,
  DocumentDirectoryPath,
  DownloadDirectoryPath,
} from 'services/FileManagerService';
import { ErrorMessages, RPC_URLItem } from 'types/applicationInterfaces';

import app from '../../../../app.json';

export const CurrencySymbol = '$';
export const CurrencyName = 'USD';
export const defaultNetwork = 'ETH';
export const NetWorkType = {
  SUP: 'SUP',
  ETH: 'ETH',
  SUI: 'SUI',
  SOL: 'SOL',
  APT: 'APT',
};
export const NetWorkTypeId = {
  SUP: '1',
  ETH: '2',
  SUI: '5',
  SOL: '6',
  APT: '7',
};

export const gradientColorAngle = 155;

export const ROOT_FOLDER_NAME = `DO NOT DELETE ${app.displayName}`;

export const ETHSCHEMA = 'ethereum:';
export const MinimumUsernameCharacters = 3;
export const MaximumUsernameCharacters = 15;
export const MinimumPasswordCharacters = 9;
export const MaximumPasswordCharacters = 24;
export const MaximumTextFelidCharacters = 100;
export const MinimumPrivateKeyCharacters = 64;
export const coinGeckoPriceChartBaseURL = 'https://www.coingecko.com/en/coins/';
export const UsdConversionApiBaseURL =
  'https://api.coingecko.com/api/v3/simple/price?';
// 'https://api.coingate.com/api/v2/rates/merchant/';

export const Erc20TokenABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [],
    name: '_totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
    ],
    name: 'decreaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'addedValue', type: 'uint256' },
    ],
    name: 'increaseAllowance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const USDCContractAddress = '0x2E162941225Ae0cF35586EAF10c73f0e5404d156';
export const USDTContractAddress = '0xD139245Ed0e23D2f0b9323c9e086F06C652EcD7a';

//Note: update this array as per user selected erc20 tokens
export const Erc20TokensContractAddresses = [USDCContractAddress];

export const DirectoryPath =
  Platform?.OS === 'android' ? DownloadDirectoryPath : DocumentDirectoryPath;

export const tempRecoveryFileNamePreFix = app.displayName;

export const documentFolderName = 'Documents';

export const FileRecoveryTempPath =
  Platform?.OS === 'android'
    ? DocumentDirectoryPath + '/temp'
    : DocumentDirectoryPath + '/temp';

export const iCloudDefaultPath = defaultICloudContainerPath;
export const DirectoryDownloadPath =
  Platform?.OS === 'android' ? DownloadDirectoryPath : CachesDirectoryPath;

export const PAGINATION_COUNT = 10;
export const PAGINATION_COUNT_100 = 100;
export const PAGINATION_COUNT_20 = 20;
export const PAGINATION_COUNT_50 = 50;
export const DEFAULT_API_TIMEOUT = 5000;

export const Aptos_Coin_Register = '0x1::managed_coin::register';
export const Aptos_CoinStore =
  '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>';

// Used via Metrics.baseMargin
export const DeviceMetrics = {
  screenWidth: Dimensions?.get('screen').width,
  screenHeight: Dimensions?.get('screen').height,
  windowWidth: Dimensions?.get('window').width,
  windowHeight: Dimensions?.get('window').height,
  bottomTabBarHeight: 49,
  statusBarHeight: StatusBar?.currentHeight ?? 0,
  hasNotch: DeviceInfo.hasNotch(),
  windowScreenDifference:
    Dimensions?.get('screen').height - Dimensions?.get('window').height,
};

export const networksURLList: { [key: string]: RPC_URLItem } = {
  [NetWorkTypeId.ETH]: {
    testNet: {
      providerNetworkRPC_URL:
        'wss://eth-sepolia.g.alchemy.com/v2/HmVL5oX4dj8UJ5yACl-LQy1pPgHuUoz6',
      explorerURL: 'https://sepolia.etherscan.io/tx/$tx',
      explorerAccountURL: 'https://sepolia.etherscan.io/address/$tx',
      providerNetworkRPC_Network_Name: 'sepolia',
      networkId: NetWorkTypeId.ETH,
    },
    mainNet: {
      providerNetworkRPC_URL:
        'wss://eth-sepolia.g.alchemy.com/v2/HmVL5oX4dj8UJ5yACl-LQy1pPgHuUoz6',
      explorerURL: 'https://sepolia.etherscan.io/tx/$tx',
      explorerAccountURL: 'https://sepolia.etherscan.io/address/$tx',
      providerNetworkRPC_Network_Name: 'sepolia',
      networkId: NetWorkTypeId.ETH,
      // providerNetworkRPC_URL: 'wss://ethereum-goerli.publicnode.com	',
      // explorerURL: 'https://goerli.etherscan.io/tx/$tx',
      // explorerAccountURL: 'https://goerli.etherscan.io/address/$tx',
      // providerNetworkRPC_Network_Name: 'goerli',
      // networkId: NetWorkTypeId.ETH,
    },
  },
  [NetWorkTypeId.SUI]: {
    testNet: {
      providerNetworkRPC_URL: 'https://fullnode.testnet.sui.io:443',
      explorerURL: 'https://suiscan.xyz/testnet/tx/$tx',
      explorerAccountURL: 'https://suiscan.xyz/testnet/account/$tx',
      providerNetworkRPC_Network_Name: 97,
      networkId: NetWorkTypeId.SUI,
      tokenGasFeeUnitToDisplay: 'MIST',
    },
    mainNet: {
      providerNetworkRPC_URL: 'https://fullnode.devnet.sui.io:443',
      explorerURL: 'https://suiscan.xyz/devnet/tx/$tx',
      explorerAccountURL: 'https://suiscan.xyz/devnet/account/$tx',
      providerNetworkRPC_Network_Name: 97,
      networkId: NetWorkTypeId.SUI,
      tokenGasFeeUnitToDisplay: 'MIST',
    },
  },
  [NetWorkTypeId.SOL]: {
    testNet: {
      providerNetworkRPC_URL: 'https://api.testnet.solana.com',
      explorerURL: 'https://solscan.io/tx/$tx?cluster=testnet',
      explorerAccountURL: 'https://solscan.io/address/$tx?cluster=testnet',
      providerNetworkRPC_Network_Name: 103,
      networkId: NetWorkTypeId.SOL,
      tokenGasFeeUnitToDisplay: 'Lamports',
    },
    mainNet: {
      providerNetworkRPC_URL:
        'https://solana-devnet.g.alchemy.com/v2/oUsVF53U0zbz32eI6alwWJj-zP5VnFtT',
      explorerURL: 'https://solscan.io/tx/$tx?cluster=devnet',
      explorerAccountURL: 'https://solscan.io/address/$tx?cluster=devnet',
      providerNetworkRPC_Network_Name: 103,
      networkId: NetWorkTypeId.SOL,
      tokenGasFeeUnitToDisplay: 'Lamports',
    },
  },
  [NetWorkTypeId.APT]: {
    testNet: {
      providerNetworkRPC_URL: 'https://fullnode.testnet.aptoslabs.com/v1',
      explorerURL: 'https://explorer.aptoslabs.com/txn/$tx?network=testnet',
      explorerAccountURL:
        'https://explorer.aptoslabs.com/account/$tx?network=testnet',
      providerNetworkRPC_Network_Name: 2022,
      networkId: NetWorkTypeId.APT,
      tokenGasFeeUnitToDisplay: 'Octas',
      indexerClient:
        'https://indexer-testnet.staging.gcp.aptosdev.com/v1/graphql',
    },
    mainNet: {
      providerNetworkRPC_URL: 'https://fullnode.devnet.aptoslabs.com/v1',
      explorerURL: 'https://explorer.aptoslabs.com/txn/$tx?network=devnet',
      explorerAccountURL:
        'https://explorer.aptoslabs.com/account/$tx?network=devnet',
      providerNetworkRPC_Network_Name: 2022,
      networkId: NetWorkTypeId.APT,
      tokenGasFeeUnitToDisplay: 'Octas',
      indexerClient:
        'https://indexer-devnet.staging.gcp.aptosdev.com/v1/graphql',
    },
  },
  [NetWorkTypeId.SUP]: {
    testNet: {
      providerNetworkRPC_URL: 'https://rpc-wallet.supra.com',
      explorerURL: '',
      explorerAccountURL: '',
      providerNetworkRPC_Network_Name: 4,
      networkId: NetWorkTypeId.SUP,
      tokenGasFeeUnitToDisplay: 'gwei',
      indexerClient: '',
    },
    mainNet: {
      providerNetworkRPC_URL: 'https://rpc-wallet.supra.com',
      explorerURL: '',
      explorerAccountURL: '',
      providerNetworkRPC_Network_Name: 4,
      networkId: NetWorkTypeId.SUP,
      tokenGasFeeUnitToDisplay: 'gwei',
      indexerClient: '',
    },
  },
};

export const evmErrorMessages: ErrorMessages = {
  CALL_EXCEPTION: 'Transaction reverted',
  INVALID_ARGUMENT: 'Invalid argument provided',
  MISSING_ARGUMENT: 'Missing argument',
  UNEXPECTED_ARGUMENT: 'Unexpected argument',
  INVALID_SIGNATURE: 'Invalid signature',
  INSUFFICIENT_FUNDS: 'Insufficient balance for transaction fee',
  NONCE_EXPIRED: 'Transaction already completed',
  INVALID_TRANSACTION: 'Invalid transaction',
  INSUFFICIENT_TX_FEE: 'Insufficient transaction fee',
  STATIC_CALL_FAILED: 'Static call failed',
  GAS_ESTIMATE: 'Gas estimate failed',
  UNPREDICTABLE_GAS_LIMIT: 'Gas limit estimation failed',
  UNPREDICTABLE_GAS_PRICE: 'Gas price estimation failed',
  UNSUPPORTED_OPERATION: 'Unsupported operation',
  NETWORK_ERROR: 'Network error',
  INVALID_NETWORK: 'Invalid network',
  INVALID_RPC_RESPONSE: 'Invalid RPC response',
  TRANSACTION_FAILED: 'Transaction failed',
  TIMEOUT: 'Operation timed out',
  CLIENT_ERROR: 'Client error',
  SERVER_ERROR: 'Server error',
  RATE_LIMIT: 'Rate limit exceeded',
  PROVIDER_ERROR: 'Provider error',
  MISSING_RATE_LIMIT_HEADER: 'Missing rate limit header',
  INSUFFICIENT_POLLING: 'Insufficient polling',
  JSON_RPC_REQUEST_FAILED: 'JSON RPC request failed',
  CONNECTION_TIMEOUT: 'Connection timeout',
  POOR_RESPONSE_TIME: 'Poor response time',
  INSUFFICIENT_DATA: 'Insufficient data',
  QUERY_RESPONDED_WITH_ERROR: 'Query responded with error',
  NO_RELAY_SET: 'No relay set',
};

// https://github.com/move-language/move/blob/main/language/move-core/types/src/vm_status.rs
export const aptosErrorMessages: ErrorMessages = {
  UNKNOWN_VALIDATION_STATUS: 'Transaction status determination error',
  INVALID_SIGNATURE: 'Invalid transaction signature',
  INVALID_AUTH_KEY: 'Bad account authentication key',
  SEQUENCE_NUMBER_TOO_OLD: 'Outdated sequence number',
  SEQUENCE_NUMBER_TOO_NEW: 'New sequence number',
  INSUFFICIENT_BALANCE_FOR_TRANSACTION_FEE:
    'Insufficient balance for transaction fee',
  TRANSACTION_EXPIRED: 'Expired transaction',
  SENDING_ACCOUNT_DOES_NOT_EXIST: 'Non-existent sending account',
  REJECTED_WRITE_SET: 'Write set transaction rejected',
  INVALID_WRITE_SET: 'Invalid write set transaction',
  EXCEEDED_MAX_TRANSACTION_SIZE: 'Transaction size exceeds limit',
  UNKNOWN_SCRIPT: 'Unknown script error',
  UNKNOWN_MODULE: 'Attempt to publish a new module',
  MAX_GAS_UNITS_EXCEEDS_MAX_GAS_UNITS_BOUND: 'Max gas units exceed VM limit',
  MAX_GAS_UNITS_BELOW_MIN_TRANSACTION_GAS_UNITS:
    'Max gas units below transaction cost',
  GAS_UNIT_PRICE_BELOW_MIN_BOUND: 'Gas unit price below minimum set in VM',
  GAS_UNIT_PRICE_ABOVE_MAX_BOUND: 'Gas unit price above maximum set in VM',
  INVALID_GAS_SPECIFIER: 'Invalid gas specifier',
  SENDING_ACCOUNT_FROZEN: 'Frozen sending account',
  UNABLE_TO_DESERIALIZE_ACCOUNT: 'Account deserialization error',
  CURRENCY_INFO_DOES_NOT_EXIST: 'Currency info not found',
  INVALID_MODULE_PUBLISHER: 'Insufficient permissions to publish modules',
  NO_ACCOUNT_ROLE: 'Sending account has no role',
  BAD_CHAIN_ID: 'Incorrect chain ID',
  SEQUENCE_NUMBER_TOO_BIG: 'Sequence number too large',
  BAD_TRANSACTION_FEE_CURRENCY: 'Gas currency not registered',
  FEATURE_UNDER_GATING: 'Feature intended for future version',
  SECONDARY_KEYS_ADDRESSES_COUNT_MISMATCH:
    'Mismatch in secondary signer addresses',
  SIGNERS_CONTAIN_DUPLICATES: 'Duplicate signers detected',
  SEQUENCE_NONCE_INVALID: 'Invalid sequence nonce',
  CHAIN_ACCOUNT_INFO_DOES_NOT_EXIST:
    'Error accessing chain-specific account info',
  // eslint-disable-next-line quotes
  MODULE_ADDRESS_DOES_NOT_MATCH_SENDER: "Module address doesn't match sender",
  DUPLICATE_MODULE_NAME: 'Attempt to publish two modules with the same name',
  BACKWARD_INCOMPATIBLE_MODULE_UPDATE: 'Module update breaks compatibility',
  CYCLIC_MODULE_DEPENDENCY: 'Cyclic dependency in module update',
  RESOURCE_DOES_NOT_EXIST: 'Resource not found under the account',
  RESOURCE_ALREADY_EXISTS: 'Attempt to create an existing resource',
  UNKNOWN_STATUS: 'Unknown error',
};
