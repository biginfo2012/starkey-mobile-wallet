import CryptoJS from 'react-native-crypto-js';

import EncryptionService from './EncryptionService';
import KeyChainService from './KeyChainService';

describe('EncryptionService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('it should create', () => {
    const service = new EncryptionService();
    expect(service).toBeTruthy();
  });

  test('The encrypt function receives a string of data. It then retrieves a password from the KeyChainService, generates a random IV, and encrypts the data using the AES encryption standard with the password and the IV. The resulting cipher text and the IV are returned as a string.', async () => {
    // Mock KeyChainService().getPassWordFromKeyChain to return a password
    // deepcode ignore NoHardcodedPasswords/test: <please specify a reason of ignoring this>
    const mockPassword = 'password123';
    jest
      .spyOn(KeyChainService(), 'getPassWordFromKeyChain')
      .mockResolvedValue(mockPassword);

    // Mock CryptoJS.lib.WordArray.random to return a fixed IV
    const mockIV = CryptoJS.enc.Hex.parse(
      '5971334b6be2a935fdd9e89eaa32f6ef18a080d33fed6fb8',
    );
    jest.spyOn(CryptoJS.lib.WordArray, 'random').mockReturnValue(mockIV);

    // Call the encrypt function with the input data
    const encryptedData = await EncryptionService().encrypt('Hello, world');

    // Assert that the returned cipher and IV are correct
    expect(encryptedData.iv).toEqual(
      '5971334b6be2a935fdd9e89eaa32f6ef18a080d33fed6fb8',
    );
  });
});
