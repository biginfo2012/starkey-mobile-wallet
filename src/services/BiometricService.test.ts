import BiometricService from './BiometricService';

// Mocking react-native-biometrics module
jest.mock('react-native-biometrics', () => {
  return jest.fn().mockImplementation(() => ({
    simplePrompt: jest.fn(() =>
      Promise.resolve({
        success: true,
        error: undefined,
      }),
    ),
    isSensorAvailable: jest.fn(() =>
      Promise.resolve({
        available: true,
        biometryType: 'TouchID',
        error: undefined,
      }),
    ),
    __esModule: true,
  }));
});

describe('BiometricService', () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  describe('checkBiometricSupport', () => {
    let service = BiometricService;

    test('should return supported true when biometry sensor is available', async () => {
      const result = await service.checkBiometricSupport();
      expect(result.supported).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  describe('authenticate', () => {
    let service = BiometricService;

    it('should authenticate successfully when biometric prompt succeeds', async () => {
      const result = await service.authenticate('Prompt message');
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
