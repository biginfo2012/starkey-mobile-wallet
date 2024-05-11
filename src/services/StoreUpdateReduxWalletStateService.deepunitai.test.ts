import { store } from 'store/index';
import {
  updateWalletAddress,
  updateBalance,
  updateUSDRate,
  updateSeedPhrase,
  updateBalanceInBatch,
  updatePrivateKey,
} from 'store/wallet';
import {
  TokenBalanceFormatted,
  TokenUSDBalanceFormatted,
} from 'types/applicationInterfaces';

import StoreUpdateReduxWalletStateService from './StoreUpdateReduxWalletStateService';

// Mocking the store dispatch method
jest.mock('store/index', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));

// Mocking the wallet actions
jest.mock('store/wallet', () => ({
  updateWalletAddress: jest.fn(),
  updateBalance: jest.fn(),
  updateUSDRate: jest.fn(),
  updateSeedPhrase: jest.fn(),
  updateBalanceInBatch: jest.fn(),
  updatePrivateKey: jest.fn(),
}));

// Mocking the wallet actions
// Mocking the store dispatch method
// Mocking the wallet actions
describe('StoreUpdateReduxWalletStateService', function () {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test for updateBalanceInStore function
  it('should dispatch an update balance action', async () => {
    const service = StoreUpdateReduxWalletStateService();
    const data: TokenBalanceFormatted = {
      tokenName: 'test',
      tokenBalance: '100',
    };
    await service.updateBalanceInStore(data);
    expect(updateBalance).toHaveBeenCalledWith(data);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });
  // Test for updateMultipleTokenBalanceInStore function
  it('should dispatch an update balance in batch action', async () => {
    const service = StoreUpdateReduxWalletStateService();
    const data: TokenBalanceFormatted[] = [
      { tokenName: 'test', tokenBalance: '100' },
    ];
    await service.updateMultipleTokenBalanceInStore(data);
    expect(updateBalanceInBatch).toHaveBeenCalledWith(data);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });
  // Test for updateWalletAddressInStore function
  it('should dispatch an update wallet address action', async () => {
    const service = StoreUpdateReduxWalletStateService();
    const walletAddress = 'testAddress';
    const networkName = 'testNetwork';
    const derivationIndex = '0';
    await service.updateWalletAddressInStore(
      walletAddress,
      networkName,
      derivationIndex,
    );
    expect(updateWalletAddress).toHaveBeenCalledWith({
      walletAddress,
      networkName,
      derivationIndex,
    });
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });
  // Test for updateSeedPhraseInStore function
  it('should dispatch an update seed phrase action', async () => {
    const service = StoreUpdateReduxWalletStateService();
    const seed = 'testSeed';
    await service.updateSeedPhraseInStore(seed);
    expect(updateSeedPhrase).toHaveBeenCalledWith({ seedPhrase: seed });
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });
  // Test for updatePrivateKeyInStore function
  it('should dispatch an update private key action', async () => {
    const service = StoreUpdateReduxWalletStateService();
    const privateKey = 'testPrivateKey';
    await service.updatePrivateKeyInStore(privateKey);
    expect(updatePrivateKey).toHaveBeenCalledWith({ privateKey });
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });
  // Test for updateUSDRateInStore function
  it('should dispatch an update USD rate action', async () => {
    const service = StoreUpdateReduxWalletStateService();
    const data: TokenUSDBalanceFormatted = {
      tokenName: 'test',
      tokenUSDPrice: '1',
    };
    await service.updateUSDRateInStore(data);
    expect(updateUSDRate).toHaveBeenCalledWith(data);
    expect(store.dispatch).toHaveBeenCalledTimes(1);
  });
});
