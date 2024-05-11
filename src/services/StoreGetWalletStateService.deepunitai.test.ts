import { store } from 'store/index';

import StoreGetWalletStateService from './StoreGetWalletStateService';

// Jest mock function for mocking the import
jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      wallet: {
        data: {
          seedPhrase: 'mock seed phrase',
        },
      },
    })),
  },
}));

// Describing a test suite for the StoreGetWalletStateService
describe('StoreGetWalletStateService', function () {
  const service = StoreGetWalletStateService();
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
    const mockState = {
      wallet: {
        data: {
          seedPhrase: 'mock seed phrase',
        },
      },
    };
    store.getState = () => mockState;
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // We want to test if the function correctly returns the seed phrase from the store
  it('should get wallet seed phrase', () => {
    // Calling the function
    const seedPhrase = service.getWalletSeedPhrase();
    // Expecting the function to return the mock seed phrase
    expect(seedPhrase).toEqual('mock seed phrase');
  });
});

// Describing test suite for StoreGetWalletStateService
describe('StoreGetWalletStateService', function () {
  const service = StoreGetWalletStateService();
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();

    const mockState = {
      wallet: {
        data: {
          seedPhrase: 'test seed phrase',
        },
      },
    };

    store.getState = () => mockState;
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test case to verify if getWalletSeedPhrase returns the correct seed phrase
  it('should return the correct seed phrase', () => {
    expect(service.getWalletSeedPhrase()).toBe('test seed phrase');
  });
});
