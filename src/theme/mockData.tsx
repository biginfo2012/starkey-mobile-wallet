import { Platform } from 'react-native';

import { ExistingNetworksItem } from 'types/apiResponseInterfaces';
import { RawItem, SortingItem } from 'types/applicationInterfaces';

import {
  NetWorkTypeId,
  USDCContractAddress,
  USDTContractAddress,
} from './Helper/constant';
import Images from './Images';
import Variables from './Variables';

const networksListArray: { [key: string]: ExistingNetworksItem } = {
  SUP: {
    id: '1',
    image: Images(Variables).ic_supra,
    title: 'SUPRA',
    subTitle: 'Supra',
    shortName: 'SUP',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '1',
    networkName: 'SUP',
    providerNetworkRPC_URL: 'https://rpc-devnet.supraoracles.com/rpc/v1',
    explorerURL: '',
    explorerAccountURL: '',
    providerNetworkRPC_Network_Name: 4,
    tokenGasFeeUnitToDisplay: 'gwei',
    indexerClient: '',
    tokenType: 'Native',
  },
  ETH: {
    id: '2',
    image: Images(Variables).ic_ethereum,
    title: 'ETH',
    subTitle: 'Ethereum',
    shortName: 'ETH',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '2',
    networkName: 'ETH',
    tokenType: 'Native',
    coingeckoTokenId: 'ethereum',
    isFavorite: false,
    isEVMNetwork: true,
  },
  USDT_ETH: {
    id: '3',
    image: Images(Variables).ic_usdt,
    title: 'USDT',
    subTitle: 'Tether USD',
    shortName: 'USDT_ETH',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '2',
    networkName: 'ETH',
    tokenType: 'ERC20',
    tokenContractAddress: USDTContractAddress,
    coingeckoTokenId: 'tether',
    isFavorite: false,
    isEVMNetwork: true,
    envType: 'testNet',
  },
  USDC_ETH: {
    id: '4',
    image: Images(Variables).ic_usdc,
    title: 'USDC',
    subTitle: 'USD coin',
    shortName: 'USDC_ETH',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '2',
    networkName: 'ETH',
    tokenType: 'ERC20',
    tokenContractAddress: USDCContractAddress,
    coingeckoTokenId: 'usd-coin',
    isFavorite: false,
    isEVMNetwork: true,
    envType: 'testNet',
  },
  SUI: {
    id: '7',
    image: Images(Variables).ic_sui,
    title: 'SUI',
    subTitle: 'Sui',
    shortName: 'SUI',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '5',
    networkName: 'SUI',
    tokenType: 'Native',
    coingeckoTokenId: 'sui',
    isFavorite: false,
  },
  SOL: {
    id: '8',
    image: Images(Variables).ic_solana,
    title: 'SOL',
    subTitle: 'Solana',
    shortName: 'SOL',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '6',
    networkName: 'SOL',
    tokenType: 'Native',
    coingeckoTokenId: 'solana',
    isFavorite: false,
  },

  APT: {
    id: '9',
    image: Images(Variables).ic_aptos,
    title: 'APT',
    subTitle: 'Aptos',
    shortName: 'APT',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '7',
    networkName: 'APT',
    tokenType: 'Native',
    coingeckoTokenId: 'aptos',
    isFavorite: false,
  },
  USDC_SOL: {
    id: '14',
    image: Images(Variables).ic_usdc,
    title: 'USDC',
    subTitle: 'USD coin',
    shortName: 'USDC_SOL',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '6',
    networkName: 'SOL',
    tokenType: 'ERC20',
    tokenContractAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    coingeckoTokenId: 'usd-coin',
    isFavorite: false,
    envType: 'mainNet',
  },

  USDC_Dev_SOL: {
    id: '15',
    image: Images(Variables).ic_usdc,
    title: 'USDC',
    subTitle: 'USD dev coin',
    shortName: 'USDC_Dev_SOL',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '6',
    networkName: 'SOL',
    tokenType: 'ERC20',
    tokenContractAddress: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr',
    coingeckoTokenId: 'usd-coin',
    isFavorite: false,
    envType: 'mainNet',
  },

  Wrapped_SOL_SOL: {
    id: '16',
    image: Images(Variables).ic_solana,
    title: 'Wrapped SOL',
    subTitle: 'SOL',
    shortName: 'Wrapped_SOL_SOL',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '6',
    networkName: 'SOL',
    tokenType: 'ERC20',
    tokenContractAddress: 'So11111111111111111111111111111111111111112',
    coingeckoTokenId: 'wrapped-solana',
    isFavorite: false,
    envType: 'mainNet',
  },
  Supra_APT: {
    id: '17',
    image: Images(Variables).ic_supra,
    title: 'Supra',
    subTitle: 'Supra',
    shortName: 'Supra_APT',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '7',
    networkName: 'APT',
    tokenType: 'ERC20',
    // tokenContractAddress:
    //   '0xe184ec4ed9a4483a7815b5a45a88d0d99308a343d1008f0c4fc8898b6d990a0f', // devnet
    tokenContractAddress:
      '0x321b1e29e58a9f06df26afeb16a5698ecd8136f69e025978bc4b5b071f9d0e83::BasicToken::BasicToken', // testnet
    coingeckoTokenId: '',
    isFavorite: false,
    envType: 'testNet',
  },
  Supra_SUI: {
    id: '18',
    image: Images(Variables).ic_supra,
    title: 'Supra',
    subTitle: 'Supra',
    shortName: 'Supra_SUI',
    amount: '0.0',
    usdAmount: '0.0',
    networkId: '5',
    networkName: 'SUI',
    tokenType: 'ERC20',
    tokenContractAddress:
      '0x291c571787889fcb16ef49a73f9225c37759273365bb8ba9ab5aa72d4f1f903f::supra::SUPRA',
    coingeckoTokenId: 'Supra',
    isFavorite: false,
    envType: 'testNet',
  },
};

const activityListArray = [
  {
    id: '1',
    image: Images(Variables).ic_send,
    title: 'Send',
    subTitle: 'Sept. 20 at 9:36 PM',
    amount: '≤ 1.0002',
    status: '0',
    typeId: '1',
  },
  {
    id: '2',
    image: Images(Variables).ic_trending_up_white,
    title: 'Swapped ETH to SUSHI',
    subTitle: 'Sept. 20 at 9:36 PM',
    amount: '2',
    status: '1',
    typeId: '3',
  },
];

const backUpRecoveryPhraseWarningArray = [
  'common:backUpRecoveryPhraseWarningArray1',
  'common:backUpRecoveryPhraseWarningArray3',
];

const recoverWalletUsingRecoveryPhraseWarning = [
  'common:recoverWalletUsingRecoveryPhraseWarning1',
];

const verifyRecoveryPhraseWarningArray = [
  'common:backUpRecoveryPhraseWarningArray2',
];

const walletNetworkSorting = [
  // {
  //   id: '1',
  //   image: Images(Variables).ic_alphaBaticallySort,
  //   text: 'common:Alphabetically',
  // },
  {
    id: '1',
    image: Images(Variables).ic_unfill_star,
    text: 'common:Favorites',
  },
  {
    id: '2',
    image: Images(Variables).ic_HighToLowSort,
    text: 'common:Highest_value',
  },
  {
    id: '3',
    image: Images(Variables).ic_LowToHighSort,
    text: 'common:Lowest_value',
  },
];

const tokenDetailActivityListFilter = [
  {
    id: '1',
    image: Images(Variables).ic_send,
    text: 'common:Send',
  },
  {
    id: '2',
    image: Images(Variables).ic_receive,
    text: 'common:Received',
  },
  // {
  //   id: '3',
  //   image: Images(Variables).ic_swappedToOther,
  //   text: 'common:Swapped_to_other_token',
  // },
  // {
  //   id: '4',
  //   image: Images(Variables).ic_swappedFromOther,
  //   text: 'common:Swapped_from_other_token',
  // },
  // {
  //   id: '5',
  //   image: Images(Variables).ic_sign,
  //   text: 'common:Sign',
  // },
];

const fileRecoveryOptions = [
  {
    id: '1',
    image: Images(Variables).ic_cloud,
    text: Platform.OS === 'ios' ? 'common:iCloud' : 'common:gDrive',
  },
  {
    id: '2',
    image: Images(Variables).ic_device,
    text: 'common:Device',
  },
  {
    id: '3',
    image: Images(Variables).ic_guarantor,
    text: 'common:Guardian',
  },
];

const recoveryOptions = [
  {
    id: 1,
    title: 'common:Files_recovery',
    tagText: '',
    description:
      Platform.OS === 'ios'
        ? 'common:Use_the_backup_files_from_iCloud_device_and_a_guarantor'
        : 'common:Use_the_backup_files_from_gDrive_device_and_a_guarantor',
    image: Images(Variables).ic_fileWithGradientBg,
  },
  {
    id: 2,
    title: 'common:Secret_Phrase_Recovery',
    tagText: '',
    description: 'common:Use_the_secret_recovery_phrase_you_have_saved',
    image: Images(Variables).ic_secretPhraseWithGradientBg,
  },
  // {
  //   id: 3,
  //   title: 'common:Social_Recovery',
  //   tagText: 'common:PRO',
  //   description: 'common:Ask_guarantors_to_approve_your_recovery_requests',
  //   image: Images(Variables).ic_socialRecovery,
  // },
  // {
  //   id: 4,
  //   title: 'common:Geo_Recovery',
  //   tagText: 'common:PRO',
  //   description:
  //     'common:Go_to_the_3_locations_you_set_before_and_unlock_all_of_them',
  //   image: Images(Variables).ic_geoRecovery,
  // },
];

const importWalletOptions = [
  {
    id: 1,
    title: 'onBoarding:by_secret_recovery_phrase',
    tagText: '',
    description: 'onBoarding:by_secret_recovery_phrase_des',
    image: Images(Variables).ic_seed_phase,
  },
  {
    id: 2,
    title: 'onBoarding:by_private_key',
    tagText: '',
    description: 'onBoarding:by_private_key_des',
    image: Images(Variables).ic_private_key_import,
  },
];

const createAccount_recoveryOptions = [
  {
    id: 1,
    title: 'common:Files_recovery',
    tagText: 'common:Easy',
    description: 'common:Store_your_key_backups_in_3_different_locations',
    image: Images(Variables).ic_fileWithGradientBg,
  },
  {
    id: 2,
    title: 'common:Secret_Phrase_Recovery',
    tagText: '',
    description: 'common:Take_full_control_and_be_responsible_of_your_own_key',

    image: Images(Variables).ic_secretPhraseWithGradientBg,
  },
];

const coinTypes = [Images(Variables).ic_token, Images(Variables).ic_nefts];

const SettingData = [
  {
    title: '',
    data: [
      {
        id: 1,
        type: 'common:types.viewInfo',
        title: 'common:address_book',
        image: Images(Variables).ic_right,
        redirect: 'AddressBook',
      },
      // {
      //   id: 2,
      //   type: 'common:types.viewInfo',
      //   title: 'setting:network',
      //   image: Images(Variables).ic_right,
      // },
      {
        id: 3,
        type: 'common:types.viewInfo',
        title: 'setting:security',
        image: Images(Variables).ic_right,
        redirect: 'Security',
      },
      {
        id: 4,
        type: 'common:types.toggle',
        title: 'setting:hide_balance_tokens',
        description: '',
        toggleType: 'common:toggle_types.tokenBalance',
      },
      {
        id: 5,
        type: 'common:types.toggle',
        title: 'setting:Test_Mode',
        description: '',
        toggleType: 'common:toggle_types.Test_Mode',
      },
    ],
  },
  {
    title: '',
    data: [
      {
        id: 1,
        type: 'common:types.config',
        title: 'setting:currency',
        rightText: 'setting:usd',
        image: Images(Variables).ic_right,
        // redirect: 'Currency',
      },
      {
        id: 2,
        type: 'common:types.config',
        title: 'setting:language',
        rightText: 'setting:en',
        image: Images(Variables).ic_right,
        // redirect: 'Language',
      },
      // {
      //   id: 3,
      //   type: 'common:types.toggle',
      //   title: 'setting:analytics',
      //   description: 'setting:analytics_desc',
      //   toggleType: 'common:toggle_types.analytics',
      // },
      {
        id: 4,
        type: 'common:types.cmsPage',
        title: 'setting:feedback',
        image: Images(Variables).ic_send,
      },
      {
        id: 5,
        type: 'common:types.cmsPage',
        title: 'setting:help',
        image: Images(Variables).ic_send,
      },
    ],
  },
];

const SecurityData = [
  {
    title: '',
    data: [
      {
        id: 1,
        type: 'common:types.viewInfo',
        title: 'setting:secret_recovery_phrase',
        image: Images(Variables).ic_right,
        redirect: 'SecretRecoveryPhrase',
      },
      {
        id: 2,
        type: 'common:types.viewInfo',
        title: 'setting:files_recovery',
        image: Images(Variables).ic_right,
      },
      {
        id: 4,
        type: 'common:types.toggle',
        title: 'setting:face_id_passcode_protection',
        description: 'setting:face_id_passcode_protection_desc',
        toggleType: 'common:toggle_types.faceId',
      },
      {
        id: 5,
        type: 'common:types.toggle',
        title: 'setting:hide_account_balance',
        description: '',
        toggleType: 'common:toggle_types.accountBalance',
      },
      {
        id: 6,
        type: 'common:types.viewInfo',
        title: 'setting:autolock_timer',
        image: Images(Variables).ic_right,
        redirect: 'AutoLockTimer',
      },
    ],
  },
];

const GasPriceAlertListData = [
  {
    id: 1,
    title: '10 Gwei',
    subTitle: '$0.57',
  },
  {
    id: 2,
    title: '10 Gwei',
    subTitle: '$0.57',
  },
  {
    id: 3,
    title: '10 Gwei',
    subTitle: '$0.57',
  },
];

const SwapFromToTokenListData = [
  {
    id: '1',
    image: Images(Variables).ic_supra,
    title: 'SUPRA',
    networkName: '',
    subTitle: 'Supra',
    amount: 639,
    usdAmount: 56,
    tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
    providerNetworkRPC_URL:
      'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
    providerNetworkRPC_Network_Name: 'goerli',
    explorerURL: 'https://goerli.etherscan.io',
    decimal: 1,
  },
  {
    id: '2',
    image: Images(Variables).ic_BNB,
    title: 'BTC',
    networkName: '',
    subTitle: 'Bitcoin',
    amount: 1.4,
    usdAmount: 84,
    tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
    providerNetworkRPC_URL:
      'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
    providerNetworkRPC_Network_Name: 'goerli',
    explorerURL: 'https://goerli.etherscan.io',
    decimal: 1,
  },
  {
    id: '3',
    image: Images(Variables).ic_ethereum,
    title: 'ETH',
    networkName: '',
    subTitle: 'Ethereum',
    amount: 84,
    usdAmount: 6.5,
    tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
    providerNetworkRPC_URL:
      'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
    providerNetworkRPC_Network_Name: 'goerli',
    explorerURL: 'https://goerli.etherscan.io',
    decimal: 1,
  },
  {
    id: '4',
    image: Images(Variables).ic_BNB,
    title: 'DAI',
    networkName: '',
    subTitle: 'Dai Stablecoin',
    amount: 96,
    usdAmount: 63.2,
    tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
    providerNetworkRPC_URL:
      'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
    providerNetworkRPC_Network_Name: 'goerli',
    explorerURL: 'https://goerli.etherscan.io',
    decimal: 1,
  },
  {
    id: '5',
    image: Images(Variables).ic_usdc,
    title: 'USDC',
    networkName: '',
    subTitle: 'USD coin',
    amount: 642,
    usdAmount: 6.5,
    tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
    providerNetworkRPC_URL:
      'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
    providerNetworkRPC_Network_Name: 'goerli',
    explorerURL: 'https://goerli.etherscan.io',
    decimal: 1,
  },
  {
    id: '6',
    image: Images(Variables).ic_BNB,
    title: 'BNB',
    networkName: '',
    subTitle: 'Binance Token',
    amount: 421,
    usdAmount: 69.4,
    tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
    providerNetworkRPC_URL:
      'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
    providerNetworkRPC_Network_Name: 'goerli',
    explorerURL: 'https://goerli.etherscan.io',
    decimal: 1,
  },
  {
    id: '7',
    image: Images(Variables).ic_usdc,
    title: 'USDC',
    networkName: '',
    subTitle: 'USD coin',
    amount: 425,
    usdAmount: 6.48,
    tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
    providerNetworkRPC_URL:
      'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
    providerNetworkRPC_Network_Name: 'goerli',
    explorerURL: 'https://goerli.etherscan.io',
    decimal: 1,
  },
  {
    id: '8',
    image: Images(Variables).ic_usdt,
    title: 'USDT',
    networkName: '',
    subTitle: 'Tether',
    amount: 965,
    usdAmount: 65.2,
    tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
    providerNetworkRPC_URL:
      'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
    providerNetworkRPC_Network_Name: 'goerli',
    explorerURL: 'https://goerli.etherscan.io',
    decimal: 1,
  },
];

const SelectNetworkListData = [
  {
    title: '',
    data: [
      {
        id: '1',
        image: Images(Variables).ic_supra,
        title: 'SUPRA',
        networkName: '',
        subTitle: '',
        amount: 639,
        usdAmount: 56,
        tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
        providerNetworkRPC_URL:
          'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
        providerNetworkRPC_Network_Name: 'goerli',
        explorerURL: 'https://goerli.etherscan.io',
        decimal: 1,
      },
      {
        id: '2',
        image: Images(Variables).ic_ethereum,
        title: 'Ethereum',
        networkName: '',
        subTitle: '',
        amount: 1.4,
        usdAmount: 84,
        tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
        providerNetworkRPC_URL:
          'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
        providerNetworkRPC_Network_Name: 'goerli',
        explorerURL: 'https://goerli.etherscan.io',
        decimal: 1,
      },
      {
        id: '5',
        image: Images(Variables).ic_solana,
        title: 'Solana',
        networkName: '',
        subTitle: '',
        amount: 642,
        usdAmount: 6.5,
        tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
        providerNetworkRPC_URL:
          'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
        providerNetworkRPC_Network_Name: 'goerli',
        explorerURL: 'https://goerli.etherscan.io',
        decimal: 1,
      },
      {
        id: '6',
        image: Images(Variables).ic_fantom,
        title: 'Fantom',
        networkName: '',
        subTitle: '',
        amount: 421,
        usdAmount: 69.4,
        tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
        providerNetworkRPC_URL:
          'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
        providerNetworkRPC_Network_Name: 'goerli',
        explorerURL: 'https://goerli.etherscan.io',
        decimal: 1,
      },
    ],
  },
  {
    title: 'swap:testnet',
    data: [
      {
        id: '7',
        image: Images(Variables).ic_testnet,
        title: 'Testnet A',
        networkName: '',
        subTitle: '',
        amount: 425,
        usdAmount: 6.48,
        tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
        providerNetworkRPC_URL:
          'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
        providerNetworkRPC_Network_Name: 'goerli',
        explorerURL: 'https://goerli.etherscan.io',
        decimal: 1,
      },
      {
        id: '8',
        image: Images(Variables).ic_testnet,
        title: 'Testnet B',
        networkName: '',
        subTitle: '',
        amount: 965,
        usdAmount: 65.2,
        tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
        providerNetworkRPC_URL:
          'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
        providerNetworkRPC_Network_Name: 'goerli',
        explorerURL: 'https://goerli.etherscan.io',
        decimal: 1,
      },
      {
        id: '9',
        image: Images(Variables).ic_testnet,
        title: 'Testnet C',
        networkName: '',
        subTitle: '',
        amount: 965,
        usdAmount: 65.2,
        tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
        providerNetworkRPC_URL:
          'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
        providerNetworkRPC_Network_Name: 'goerli',
        explorerURL: 'https://goerli.etherscan.io',
        decimal: 1,
      },
      // {
      //   id: '10',
      //   image: Images(Variables).ic_testnet,
      //   title: 'Testnet D',
      //   networkName: '',
      //   subTitle: '',
      //   amount: 965,
      //   usdAmount: 65.2,
      //   tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
      //   providerNetworkRPC_URL:
      //     'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
      //   providerNetworkRPC_Network_Name: 'goerli',
      //   explorerURL: 'https://goerli.etherscan.io',
      //   decimal: 1,
      // },
      // {
      //   id: '11',
      //   image: Images(Variables).ic_testnet,
      //   title: 'Testnet E',
      //   networkName: '',
      //   subTitle: '',
      //   amount: 965,
      //   usdAmount: 65.2,
      //   tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
      //   providerNetworkRPC_URL:
      //     'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
      //   providerNetworkRPC_Network_Name: 'goerli',
      //   explorerURL: 'https://goerli.etherscan.io',
      //   decimal: 1,
      // },
      // {
      //   id: '12',
      //   image: Images(Variables).ic_testnet,
      //   title: 'Testnet F',
      //   networkName: '',
      //   subTitle: '',
      //   amount: 965,
      //   usdAmount: 65.2,
      //   tokenContractAddress: '0xEEa85fdf0b05D1E0107A61b4b4DB1f345854B952',
      //   providerNetworkRPC_URL:
      //     'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
      //   providerNetworkRPC_Network_Name: 'goerli',
      //   explorerURL: 'https://goerli.etherscan.io',
      //   decimal: 1,
      // },
    ],
  },
];

const nativeNetworkList = [
  {
    id: 'SUP',
    image: Images(Variables).ic_supra,
    text: 'SUPRA',
    shortNam: 'SUP',
  },
  {
    id: 'ETH',
    image: Images(Variables).ic_ethereum,
    text: 'Ethereum',
    shortName: 'ETH',
  },
  {
    id: 'SUI',
    image: Images(Variables).ic_sui,
    text: 'Sui',
    shortName: 'SUI',
  },
  {
    id: 'SOL',
    image: Images(Variables).ic_solana,
    text: 'Solana',
    shortName: 'SOL',
  },
  {
    id: 'APT',
    image: Images(Variables).ic_aptos,
    text: 'Aptos',
    shortName: 'APT',
  },
] as SortingItem[];

const mainNetworkList = [
  {
    id: 'SUP',
    image: Images(Variables).ic_supra,
    text: 'SUPRA',
    shortName: 'SUP',
    networkId: NetWorkTypeId.SUP,
  },
  {
    id: 'ETH',
    image: Images(Variables).ic_ethereum,
    text: 'Ethereum',
    shortName: 'ETH',
    networkId: NetWorkTypeId.ETH,
  },
  {
    id: 'SUI',
    image: Images(Variables).ic_sui,
    text: 'Sui',
    shortName: 'SUI',
    networkId: NetWorkTypeId.SUI,
  },
  {
    id: 'SOL',
    image: Images(Variables).ic_solana,
    text: 'Solana',
    shortName: 'SOL',
    networkId: NetWorkTypeId.SOL,
  },
  {
    id: 'APT',
    image: Images(Variables).ic_aptos,
    text: 'Aptos',
    shortName: 'APT',
    networkId: NetWorkTypeId.APT,
  },
] as SortingItem[];

const SwapActivityListData = [
  {
    id: '1',
    swapFromImage: Images(Variables).ic_supra,
    swapToImage: Images(Variables).ic_ethereum,
    title: 'DAI to ETH',
    swapTime: 'Sept. 20 at 9:36 PM',
    amount: '0.81 ETH',
    swapStatus: 'Swapping',
    status: '1',
  },
  {
    id: '2',
    swapFromImage: Images(Variables).ic_binance,
    swapToImage: Images(Variables).ic_usdc,
    title: 'SUSHI to USDC',
    swapTime: 'Sept. 20 at 9:36 PM',
    amount: '100.28',
    swapStatus: 'Completed',
    status: '2',
  },
];

const CurrencyListData = [
  {
    id: '1',
    title: 'USD',
    shortName: 'USD',
  },
  {
    id: '2',
    title: 'AUD',
    shortName: 'AUD',
  },
  {
    id: '3',
    title: 'CAD',
    shortName: 'CAD',
  },
  {
    id: '4',
    title: 'EUR',
    shortName: 'EUR',
  },
  {
    id: '5',
    title: 'GBP',
    shortName: 'GBP',
  },
  {
    id: '6',
    title: 'JPY',
    shortName: 'JPY',
  },
] as RawItem[];

const LanguageListData = [
  {
    id: '1',
    title: 'English',
    shortName: 'EN',
  },
  {
    id: '2',
    title: 'Chinese',
    shortName: 'ZH',
  },
  {
    id: '3',
    title: 'Spanish',
    shortName: 'ES',
  },
  {
    id: '4',
    title: 'Hindi',
    shortName: 'HI',
  },
  {
    id: '5',
    title: 'Portuguese',
    shortName: 'PT',
  },
  {
    id: '6',
    title: 'Russian',
    shortName: 'RU',
  },
  {
    id: '7',
    title: 'Japanese',
    shortName: 'JA',
  },
  {
    id: '8',
    title: 'Vietnamese',
    shortName: 'VI',
  },
  {
    id: '9',
    title: 'Korean',
    shortName: 'KO',
  },
  {
    id: '10',
    title: 'Indonesian',
    shortName: 'ID',
  },
  {
    id: '11',
    title: 'Tagalog',
    shortName: 'TA',
  },
] as RawItem[];

const AddressBookFilterData = [
  {
    title: 'common:view_as',
    data: [
      {
        id: '1',
        text: 'common:default',
      },
      {
        id: '2',
        text: 'setting:network',
      },
    ],
  },
];

const NotificationListData = [
  {
    id: '1',
    // eslint-disable-next-line quotes
    title: "You got 200 SUPRA. It's your Project Blast Off rewards",
    timeAgo: '1d ago',
    isExpired: false,
    status: 'unread',
  },
  {
    id: '2',
    title: '@paul2 has removed you from the guarantors of Bubbble',
    timeAgo: '2d ago',
    isExpired: false,
    status: 'read',
  },
  {
    id: '3',
    title: 'All of the guarantors have approved the recovery requests',
    timeAgo: '5d ago',
    isExpired: false,
    status: 'read',
  },
  {
    id: '4',
    title:
      'Some of the guarantors did not approve or respond to the recovery requests',
    timeAgo: '6d ago',
    isExpired: false,
    status: 'read',
  },
  {
    id: '5',
    // eslint-disable-next-line quotes
    title: "Help recovering @paul's wallet now",
    timeAgo: '7d ago',
    isExpired: true,
    status: 'read',
  },
  {
    id: '6',
    title: '@paul has added you as a guarantor of a PRO account',
    timeAgo: '8d ago',
    isExpired: false,
    status: 'read',
  },
  {
    id: '7',
    title: 'All of the guarantors have approved the recovery requests',
    timeAgo: '9d ago',
    isExpired: false,
    status: 'read',
  },
  {
    id: '8',
    title:
      'Some of the guarantors did not approve or respond to the recovery requests',
    timeAgo: '10d ago',
    isExpired: false,
    status: 'read',
  },
  {
    id: '9',
    title: '@happylynx has removed your ownership of Bubbble',
    timeAgo: '11d ago',
    isExpired: false,
    status: 'read',
  },
  {
    id: '10',
    title: '@happylynx has added you as the owner of a PRO account',
    timeAgo: '12d ago',
    isExpired: false,
    status: 'read',
  },
];

const CreateSubAccountsOption = [
  {
    id: 1,
    type: 'common:types.viewInfo',
    title: 'common:create_sub_account',
    image: Images(Variables).ic_right,
    redirect: 'CreateEditImportAccount',
  },
];

const ImportAccountsOption = [
  {
    id: 2,
    type: 'common:types.viewInfo',
    title: 'common:import_account',
    image: Images(Variables).ic_right,
    redirect: 'ChooseImportWalletMethod',
  },
];

const ProfileImagesList = [
  {
    image: Images(Variables).ic_avatar1,
  },
  {
    image: Images(Variables).ic_avatar2,
  },
  {
    image: Images(Variables).ic_avatar3,
  },
  {
    image: Images(Variables).ic_avatar4,
  },
] as SortingItem[];

const AutoLockTimer = [
  {
    time: 2,
  },
  {
    time: 5,
  },
  {
    time: 10,
  },
  {
    time: 30,
  },
];

export const mockData = {
  networksListArray,
  activityListArray,
  backUpRecoveryPhraseWarningArray,
  recoverWalletUsingRecoveryPhraseWarning,
  verifyRecoveryPhraseWarningArray,
  walletNetworkSorting,
  tokenDetailActivityListFilter,
  fileRecoveryOptions,
  recoveryOptions,
  createAccount_recoveryOptions,
  coinTypes,
  SettingData,
  SecurityData,
  GasPriceAlertListData,
  SwapFromToTokenListData,
  SelectNetworkListData,
  SwapActivityListData,
  importWalletOptions,
  nativeNetworkList,
  mainNetworkList,
  CurrencyListData,
  LanguageListData,
  AddressBookFilterData,
  NotificationListData,
  ImportAccountsOption,
  CreateSubAccountsOption,
  ProfileImagesList,
  AutoLockTimer,
};

export default mockData;
