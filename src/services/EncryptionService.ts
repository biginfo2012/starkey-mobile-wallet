import CryptoJS from 'react-native-crypto-js';

import KeyChainService from './KeyChainService';

const IV_SIZE = 16;
interface EncryptedData {
  cipher: any;
  iv: any;
}

const EncryptionService = () => {
  const encrypt = async (data: string): Promise<any> => {
    try {
      // Get the password from the keychain
      const passWord = await KeyChainService().getPassWordFromKeyChain();
      // Generate a random IV
      const iv = CryptoJS.lib.WordArray.random(IV_SIZE);
      // Encrypt the data
      const cipher = CryptoJS.AES.encrypt(data, passWord, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
      // Return the cipher and the IV
      return {
        cipher: cipher,
        iv: iv.toString(),
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  };

  const decrypt = async (encryptedData: EncryptedData): Promise<string> => {
    try {
      // Get the password from the keychain
      const passWord = await KeyChainService().getPassWordFromKeyChain();
      // Parse the IV
      const parsedIV = CryptoJS.enc.Hex.parse(encryptedData.iv);
      // Decrypt the data
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedData.cipher,
        passWord,
        {
          iv: parsedIV,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        },
      );
      // Return the decrypted data as a string
      return decryptedBytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  };

  return {
    encrypt,
    decrypt,
  };
};

export default EncryptionService;
