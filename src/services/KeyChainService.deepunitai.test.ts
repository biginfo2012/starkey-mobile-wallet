import * as Keychain from 'react-native-keychain';

import { t } from 'i18next';
import { showAlert } from 'theme/Helper/common/Function';

import KeyChainService from './KeyChainService';

// Mocking imported modules and functions to isolate tests to KeyChainService functions only
jest.mock('react-native-keychain');
jest.mock('i18next');
jest.mock('theme/Helper/common/Function');

// Mocking imported modules and functions to isolate tests to KeyChainService functions only
describe('KeyChainService', function () {
  // Resetting all mocks before each test to ensure a clean environment for testing
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restoring all mocks after each test to clean up any remaining mock state
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Testing storePassWordInKeyChain function
  // We want to ensure that the correct password is being stored in keychain
  it('storePassWordInKeyChain should store password in keychain', async () => {
    // deepcode ignore NoHardcodedPasswords/test
    const password = 'testPassword';
    const KeyChain = KeyChainService();
    await KeyChain.storePasswordInKeyChain(password);
    expect(Keychain.setGenericPassword).toHaveBeenCalledWith('User', password);
  });
  // Testing getPassWordFromKeyChain function
  // We want to ensure that the correct password is being retrieved from keychain
  it('getPassWordFromKeyChain should retrieve password from keychain', async () => {
    // deepcode ignore NoHardcodedPasswords/test
    const password = 'testPassword';
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue({ password });
    const KeyChain = KeyChainService();
    const result = await KeyChain.getPassWordFromKeyChain();
    expect(result).toEqual(password);
  });
  // Testing getPassWordFromKeyChain function when it fails to retrieve password
  // We want to ensure that the appropriate alert is shown and the correct error message is returned
  it('getPassWordFromKeyChain should handle keychain retrieval failure', async () => {
    (Keychain.getGenericPassword as jest.Mock).mockResolvedValue(false);
    const KeyChain = KeyChainService();
    const result = await KeyChain.getPassWordFromKeyChain();
    expect(showAlert).toHaveBeenCalledWith(
      '',
      t('common:something_went_wrong_please_try_again'),
      t('common:ok'),
    );
    expect(result).toEqual('something went wrong!');
  });
});
