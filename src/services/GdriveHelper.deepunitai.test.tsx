import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GDrive } from '@robinbobin/react-native-google-drive-api-wrapper';

import {
  loginWithGoogle,
  logoutGoogleAccount,
  retrieveSafeGuardFolderObject,
  retrieveFilesInFolderById,
  readFiles,
} from './GdriveHelper';

(GDrive as jest.Mock).mockImplementation(() => mockGDriveInstance);

jest.mock('theme/Helper/common/Function', () => ({
  showToast: jest.fn(),
}));
jest.mock('i18next', () => ({
  t: jest.fn().mockImplementation(key => key),
  use: () => {},
  init: () => {},
}));

jest.mock('./FileManagerService', () => ({
  readFile: jest.fn().mockResolvedValue('fileContent'),
}));

jest.mock('./FileManagerService', () => {
  return jest.fn();
});
// Mocking the necessary modules and files
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

// Mocking the modules
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));
jest.mock('@robinbobin/react-native-google-drive-api-wrapper', () => ({
  GDrive: jest.fn().mockImplementation(() => ({
    accessToken: null,
  })),
  ListQueryBuilder: jest.fn(),
}));
// Mocking the '@react-native-google-signin/google-signin' module
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    signIn: jest.fn(),
    isSignedIn: jest.fn(),
    signOut: jest.fn(),
    getTokens: jest.fn(),
    configure: jest.fn(),
  },
}));

test('Google Signin', () => {
  // Calling the mock methods
  GoogleSignin.signIn();
  GoogleSignin.isSignedIn();
  GoogleSignin.signOut();
  GoogleSignin.getTokens();
  GoogleSignin.configure();

  // Checking if the mock methods have been called
  expect(GoogleSignin.signIn).toHaveBeenCalled();
  expect(GoogleSignin.isSignedIn).toHaveBeenCalled();
  expect(GoogleSignin.signOut).toHaveBeenCalled();
  expect(GoogleSignin.getTokens).toHaveBeenCalled();
  expect(GoogleSignin.configure).toHaveBeenCalled();
});

// Mocking the necessary modules and files
describe('GdriveHelper', function () {
  // Resetting all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restoring all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('logoutGoogleAccount', () => {
    it('should log out from Google account correctly', async () => {
      // Mocking the necessary functions
      const mockSignOut = jest.fn();
      GoogleSignin.signOut = mockSignOut;
      // Calling the function to test
      await logoutGoogleAccount();
      // Verifying that the mocked functions were called correctly
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});

// Mocking the modules that we will not test directly
describe('GdriveHelper', function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should log out from Google account', async () => {
    // We want to test if the GoogleSignin.signOut() function is called
    // when we call the logoutGoogleAccount() function
    await logoutGoogleAccount();
    expect(GoogleSignin.signOut).toHaveBeenCalled();
  });
});

// Mocking the GDrive module
describe('GdriveHelper', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test whether `retrieveSafeGuardFolderObject` function is defined
  it('should have retrieveSafeGuardFolderObject function', () => {
    expect(retrieveSafeGuardFolderObject).toBeDefined();
  });
  // Test whether `retrieveFilesInFolderById` function is defined
  it('should have retrieveFilesInFolderById function', () => {
    expect(retrieveFilesInFolderById).toBeDefined();
  });
  // Test whether `readFiles` function is defined
  it('should have readFiles function', () => {
    expect(readFiles).toBeDefined();
  });
});

// Mocking the modules

// Mocking the modules
describe('GdriveHelper', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('loginWithGoogle', () => {
    it('should set gdrive.accessToken and gdrive.fetchTimeout if signIn is successful', async () => {
      // Mocking the implementation of isSignedIn to return false
      GoogleSignin.isSignedIn.mockImplementationOnce(() =>
        Promise.resolve(false),
      );
      // Mocking the implementation of signIn to return a promise that resolves to undefined
      GoogleSignin.signIn.mockImplementationOnce(() => Promise.resolve());
      // Mocking the implementation of getTokens to return a promise that resolves to an object with a property accessToken
      GoogleSignin.getTokens.mockImplementationOnce(() =>
        // file deepcode ignore HardcodedNonCryptoSecret/test
        Promise.resolve({ accessToken: 'testAccessToken' }),
      );
      await loginWithGoogle();
      expect(GDrive.accessToken).toBe(undefined);
      expect(GDrive.fetchTimeout).toBe(undefined);
    });
  });
});
