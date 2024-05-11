import * as Keychain from 'react-native-keychain';

import { t } from 'i18next';
import { showAlert } from 'theme/Helper/common/Function';

// Constants
const SERVICE_NAME = 'User';

const KeyChainService = () => {
  const storePasswordInKeyChain = async (password: string) => {
    await Keychain.setGenericPassword(SERVICE_NAME, password);
  };

  const getPassWordFromKeyChain = async () => {
    try {
      const response = await Keychain.getGenericPassword();
      if (response) {
        return response.password;
      } else {
        showAlert(
          '',
          t('common:something_went_wrong_please_try_again'),
          t('common:ok'),
        );
        return 'something went wrong!';
      }
    } catch (error) {
      console.error('Error retrieving password from Keychain:', error);
      // Handle the error, log it, or show a more informative message to the user.
      showAlert(
        '',
        t('common:something_went_wrong_please_try_again'),
        t('common:ok'),
      );
      return 'something went wrong!';
    }
  };

  return {
    storePasswordInKeyChain,
    getPassWordFromKeyChain,
  };
};

export default KeyChainService;
