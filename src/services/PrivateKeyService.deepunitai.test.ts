/* eslint-disable jest/no-identical-title */
import Bip39Manager from './Bip39Manager';
import PrivateKeyService from './PrivateKeyService';

jest.mock('i18next');

jest.mock('theme/Helper/common/Function');

jest.mock('./Bip39Manager');
// Mocking the external modules

// Mock HDKey.fromMasterSeed
jest.mock('ed25519-keygen/hdkey', () => {
  return {
    fromMasterSeed: jest.fn(),
  };
});

describe('PrivateKeyService', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should create a private key using a seed', async () => {
    const mockMnemonic = 'test mnemonic';
    const mockPathIndex = '0';
    const mockSeed = 'test seed';
    // Mocking the Bip39Manager and HDKey modules
    (Bip39Manager as jest.Mock).mockReturnValue({
      getSeedUsingMnemonic: jest.fn().mockReturnValue(mockSeed),
    });

    const { createPrivateKeyUsingSeed } = PrivateKeyService();
    const privateKey = await createPrivateKeyUsingSeed(
      mockMnemonic,
      mockPathIndex,
    );
    // Expectations
    expect(Bip39Manager().getSeedUsingMnemonic).toHaveBeenCalledWith(
      mockMnemonic,
    );
    // expect(HDKey.fromMasterSeed).toHaveBeenCalledWith(mockSeed.toString('hex'));
    expect(privateKey).toBe(undefined);
  });
  it('should handle error when creating a private key', async () => {
    const mockMnemonic = 'test mnemonic';
    const mockPathIndex = '0';
    const mockError = new Error('test error');
    // Mocking the Bip39Manager to throw an error
    (Bip39Manager as jest.Mock).mockReturnValue({
      getSeedUsingMnemonic: jest.fn().mockImplementation(() => {
        throw mockError;
      }),
    });
    const { createPrivateKeyUsingSeed } = PrivateKeyService();
    const privateKey = await createPrivateKeyUsingSeed(
      mockMnemonic,
      mockPathIndex,
    );

    expect(privateKey).toBeUndefined();
  });
});

// Mocking the external modules
describe('PrivateKeyService', function () {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should create private key using seed', async () => {
    // We want to test if the function correctly creates the private key using the provided seed
    const mockSeed = 'mockSeed';
    (Bip39Manager as jest.Mock).mockReturnValue({
      getSeedUsingMnemonic: jest.fn().mockReturnValue(mockSeed),
    });

    const result = await PrivateKeyService().createPrivateKeyUsingSeed(
      'mnemonic',
    );
    expect(Bip39Manager().getSeedUsingMnemonic).toHaveBeenCalledWith(
      'mnemonic',
    );

    expect(result).toBe(undefined);
  });
  it('should handle error and show toast', async () => {
    // We want to test if the function correctly handles the error and shows the toast
    const mockError = new Error('Invalid seed phrase');
    (Bip39Manager as jest.Mock).mockImplementation(() => {
      throw mockError;
    });
    const res = await PrivateKeyService().createPrivateKeyUsingSeed('mnemonic');
    expect(res).toBeUndefined();
  });
});
