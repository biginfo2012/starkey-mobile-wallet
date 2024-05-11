import ReactNativeBiometrics from 'react-native-biometrics';

import { t } from 'i18next';

const rnBiometrics = new ReactNativeBiometrics({
  allowDeviceCredentials: true,
});

interface BiometricService {
  checkBiometricSupport: () => Promise<{ supported: boolean; error?: string }>;
  authenticate: (
    promptMessage: string,
  ) => Promise<{ success: boolean; error?: string }>;
}

const BiometricService: BiometricService = {
  checkBiometricSupport: async () => {
    try {
      // Check if biometry sensor is available
      const biometryType = await rnBiometrics.isSensorAvailable();
      // Return boolean value based on sensor availability
      return { supported: biometryType.available };
    } catch (error) {
      // If sensor check fails, log error
      console.error('Biometric support check failed:', error);
      // Return error message
      return { supported: false, error: 'Biometric support check failed' };
    }
  },
  authenticate: async (promptMessage: string) => {
    try {
      // Call the biometric prompt
      const res = await rnBiometrics.simplePrompt({
        // Message to be displayed to the user
        promptMessage,
        // Message to be displayed if the biometric authentication fails
        fallbackPromptMessage: t('common:bioMetrics_fallBackText'),
      });
      return res;
    } catch (error) {
      // Log the error to the console
      console.error('Biometric authentication failed:', error);
      // Return an object with the error
      return { success: false, error: 'Biometric authentication failed' };
    }
  },
};

export default BiometricService;
