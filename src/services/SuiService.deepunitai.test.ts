import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { store } from 'store/index';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';
import { ActivityRequestType } from 'types/applicationInterfaces';

import SuiService from './SuiService';

jest.mock('@mysten/sui.js/keypairs/ed25519', () => ({
  Ed25519Keypair: {
    deriveKeypair: jest.fn().mockImplementation(() => ({
      getPublicKey: jest.fn().mockReturnValue({
        toSuiAddress: jest.fn().mockReturnValue('address'),
      }),
      export: jest.fn().mockReturnValue({ privateKey: 'privateKey' }),
    })),
    fromSecretKey: jest.fn().mockReturnValue({
      getPublicKey: jest.fn().mockReturnValue({
        toSuiAddress: jest.fn().mockReturnValue('address'),
      }),
    }),
  },
}));

jest.mock('./StoreUpdateReduxWalletStateService', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    updateWalletAddressInStore: jest.fn(),
    updatePrivateKeyInStore: jest.fn(),
    updateMultipleTokenBalanceInStore: jest.fn(),
  })),
}));

jest.mock('./WalletCommonService', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    getBalanceAfterTransaction: jest.fn(),
  })),
}));

jest.mock('./WalletSigner', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    signWallet: jest.fn().mockResolvedValue('signature'),
  })),
}));

describe('SuiService', function () {
  let suiService: ReturnType<typeof SuiService>;
  beforeEach(() => {
    suiService = SuiService();
  });
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  describe('getWalletUsingSeed', () => {
    it('should display an error toast and log the error if it occurs during the wallet fetch process', async () => {
      const mnemonic = 'test mnemonic';
      const error = new Error('Failed to fetch wallet SuiService');
      jest.spyOn(Ed25519Keypair, 'deriveKeypair').mockImplementation(() => {
        throw error;
      });
      const response = await suiService.getWalletUsingSeed(mnemonic);

      expect(response).toBeUndefined();
    });
  });
  describe('getWalletUsingPrivateKey', () => {
    it('should display an error toast and log the error if it occurs during the wallet fetch process', () => {
      const privateKey = 'privateKey';
      const error = new Error('getWalletUsingPrivateKey error');
      jest.spyOn(Ed25519Keypair, 'fromSecretKey').mockImplementation(() => {
        throw error;
      });
      const result = suiService.getWalletUsingPrivateKey(privateKey);
      expect(result).toEqual('');
    });
  });
  describe('getKeypairUsingSeed', () => {
    it('should get the keypair using a seed phrase from the store', () => {
      jest.spyOn(store, 'getState').mockReturnValue({
        wallet: {
          data: {
            seedPhrase: 'seed phrase',
          },
        },
        userInfo: {
          data: {
            currentUser: {
              isWalletFromSeedPhase: true,
              seedPhrase: 'seed phrase',
            },
          },
        },
      } as any);
      const result = suiService.getKeypairUsingSeed();
      expect(result).toBeUndefined();
    });
    it('should get the keypair using the hex private key from the store', () => {
      jest.spyOn(store, 'getState').mockReturnValue({
        userInfo: {
          data: {
            currentUser: {
              isWalletFromSeedPhase: false,
              privateKey: 'privateKey',
            },
          },
        },
      } as any);
      const result = suiService.getKeypairUsingSeed();
      expect(result).toBeUndefined();
    });
  });
  describe('getProvider', () => {
    it('should create a new SUI client using the provided URL from the network item', () => {
      const item: ExistingNetworksItem = {
        id: '1',
        image: 'tokenImage.png',
        title: 'Token Title',
        subTitle: 'Token Subtitle',
        shortName: 'TKN',
        amount: '100',
        usdAmount: '50',
        networkId: '1',
        networkName: 'Mainnet',
        tokenType: 'ERC20',
        providerNetworkRPC_URL: 'https://mainnet.rpc.url',
        providerNetworkRPC_Network_Name: 'Mainnet',
        coingeckoTokenId: 'coingeckoTokenId',
      };
      const result = suiService.getProvider(item);
      expect(result).toBeDefined();
    });
  });
  describe('getDecimals', () => {
    it('should retrieve the decimals using the SUI client from the token object', async () => {
      const coinType = 'coinType';
      const tokenObj: ExistingNetworksItem = {
        amount: '',
        coingeckoTokenId: '',
        explorerURL: '',
        id: '',
        image: '',
        indexerClient: '',
        networkId: '',
        networkName: '',
        providerNetworkRPC_Network_Name: '',
        providerNetworkRPC_URL: '',
        shortName: '',
        subTitle: '',
        title: '',
        tokenContractAddress: '',
        tokenGasFeeUnitToDisplay: '',
        tokenType: 'Native',
        usdAmount: '',
      };
      const result = await suiService.getDecimals(coinType, tokenObj);
      expect(result).toEqual(9);
    });
  });
  describe('getBalance', () => {
    it('should fetch the balance for the provided address using the SUI provider', async () => {
      const address = 'address';
      const tokenObj: ExistingNetworksItem = {
        amount: '',
        coingeckoTokenId: '',
        explorerURL: '',
        id: '',
        image: '',
        indexerClient: '',
        networkId: '',
        networkName: '',
        providerNetworkRPC_Network_Name: '',
        providerNetworkRPC_URL: '',
        shortName: '',
        subTitle: '',
        title: '',
        tokenContractAddress: '',
        tokenGasFeeUnitToDisplay: '',
        tokenType: 'Native',
        usdAmount: '',
      };
      const result = await suiService.getBalance(address, tokenObj);
      expect(result).toBeUndefined();
    });
  });

  describe('selectCoins', () => {
    describe('getTokenActivityListByAddress', () => {
      it('should retrieve the list of token activities associated with the specified wallet address', async () => {
        const tokenInfoObject: ExistingNetworksItem = {
          id: '1',
          image: 'tokenImage.png',
          title: 'Token Title',
          subTitle: 'Token Subtitle',
          shortName: 'TKN',
          amount: '100',
          usdAmount: '50',
          networkId: '1',
          networkName: 'Mainnet',
          tokenType: 'ERC20',
          providerNetworkRPC_URL: 'https://mainnet.rpc.url',
          providerNetworkRPC_Network_Name: 'Mainnet',
          coingeckoTokenId: 'coingeckoTokenId',
        };

        const params: ActivityRequestType = {
          walletAddress: 'address',
          txtType: 'SUI',
          page: 1,
          tokenInfo: tokenInfoObject,
        };
        const result = await suiService.getTokenActivityListByAddress(params);
        expect(result).toEqual({ data: [], isNativeToken: true });
      });
      it('should handle the case when page is not equal to 1', async () => {
        const tokenInfoObject: ExistingNetworksItem = {
          id: '1',
          image: 'tokenImage.png',
          title: 'Token Title',
          subTitle: 'Token Subtitle',
          shortName: 'TKN',
          amount: '100',
          usdAmount: '50',
          networkId: '1',
          networkName: 'Mainnet',
          tokenType: 'ERC20',
          providerNetworkRPC_URL: 'https://mainnet.rpc.url',
          providerNetworkRPC_Network_Name: 'Mainnet',
          coingeckoTokenId: 'coingeckoTokenId',
        };

        const params: ActivityRequestType = {
          walletAddress: 'address',
          txtType: 'SUI',
          page: 2,
          tokenInfo: tokenInfoObject,
        };
        const result = await suiService.getTokenActivityListByAddress(params);
        expect(result).toEqual({ data: [], isNativeToken: true });
      });
    });
    describe('getTokenTransactionDetails', () => {
      it('should fetch details of a specific token transaction', async () => {
        const tokenInfoObject: ExistingNetworksItem = {
          id: '1',
          image: 'tokenImage.png',
          title: 'Token Title',
          subTitle: 'Token Subtitle',
          shortName: 'TKN',
          amount: '100',
          usdAmount: '50',
          networkId: '1',
          networkName: 'Mainnet',
          tokenType: 'ERC20',
          providerNetworkRPC_URL: 'https://mainnet.rpc.url',
          providerNetworkRPC_Network_Name: 'Mainnet',
          coingeckoTokenId: 'coingeckoTokenId',
        };

        const params: ActivityRequestType = {
          walletAddress: '0xYourWalletAddress',
          txtType: 'someText',
          contractAddress: '0xContractAddress',
          page: 1,
          blockNumber: 123,
          netWorkName: 'Mainnet',
          tokenInfo: tokenInfoObject,
          hash: '0xTransactionHash',
        };

        const result = await suiService.getTokenTransactionDetails(params);
        expect(result).toEqual([]);
      });
    });
  });
});
