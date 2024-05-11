import * as bip39 from 'bip39';

import Bip39Manager from './Bip39Manager';

// Creating a suite of tests with a common label
describe('Bip39Manager', function () {
  // Instantiating Bip39Manager
  const Manager = Bip39Manager();
  // Resetting all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restoring all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test for createMnemonic function
  it('should create mnemonic', () => {
    // Mocking the bip39.generateMnemonic function
    jest.spyOn(bip39, 'generateMnemonic').mockReturnValue('mocked mnemonic');
    // Testing if the function returns the set mnemonic in test mode
    const mnemonic = Manager.createMnemonic(true);
    expect(mnemonic).toBe(
      'faint record mad siren effort before surface strategy return rubber detail dune',
    );
    // Testing if the function returns the mocked mnemonic in non-test mode
    const mnemonic2 = Manager.createMnemonic(false);
    expect(mnemonic2).toBe('mocked mnemonic');
  });
  // Test for getSeedUsingMnemonic function
  it('should get seed using mnemonic', () => {
    // Mocking the bip39.mnemonicToSeedSync function
    const mockSeed = Buffer.from('mocked seed');
    jest.spyOn(bip39, 'mnemonicToSeedSync').mockReturnValue(mockSeed);

    // Testing if the function returns the correct seed
    const seed = Manager.getSeedUsingMnemonic('mocked mnemonic');
    expect(seed).toEqual(mockSeed);
  });
  // Test for isMnemonicValid function
  it('should validate mnemonic', () => {
    // Mocking the bip39.validateMnemonic function
    jest.spyOn(bip39, 'validateMnemonic').mockReturnValue(true);

    // Testing if the function returns the correct validation
    const isValid = Manager.isMnemonicValid('mocked mnemonic');
    expect(isValid).toBe(true);
  });
});
