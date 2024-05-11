import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';
import 'react-native-gesture-handler/jestSetup';
import mockreactnativepermissions from 'react-native-permissions/mock';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js';
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
import '@testing-library/jest-native/extend-expect';
import 'whatwg-fetch';

// Import the mock
jest.mock('@react-native-google-signin/google-signin', () => {
  return {
    GoogleSigninButton: jest.fn().mockImplementation(() => {
      return null;
    }),
  };
});

jest.mock('@robinbobin/react-native-google-drive-api-wrapper', () => ({
  GDrive: jest.fn().mockReturnValue({
    // Mock the methods you use from GDrive here
  }),
}));

// Mock the MMKVLoader before your tests
jest.mock('react-native-mmkv-storage');
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native-share', () => ({
  default: jest.fn(),
}));

jest.mock('react-native-permissions', () => {
  return mockreactnativepermissions;
});
jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((config, reducers) => reducers),
  };
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard);

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));
jest.mock('react-native-cloud-store');
jest.mock('react-native-document-picker');
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
jest.mock('aptos');
jest.mock('ed25519-keygen/hdkey');
jest.mock('rn-mmkv-storage-flipper');
jest.mock('react-native-quick-crypto');
jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('react-native-keyboard-manager', () =>
  require('react-native-keyboard-manager/jest/mock'),
);

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: jest.fn(),
}));

jest.mock('@gorhom/bottom-sheet', () => ({
  __esModule: true,
  ...require('@gorhom/bottom-sheet/mock'),
  BottomSheetTextInput: require('react-native').TextInput,
}));

jest.mock('rn-qr-generator');
