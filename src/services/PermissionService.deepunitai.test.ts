import {
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
} from 'react-native-permissions';

import PermissionService from './PermissionService';

// Mocking react-native-permissions and react-native modules
jest.mock('react-native-permissions', () => ({
  PERMISSIONS: {
    ANDROID: {
      CAMERA: 'android.permission.CAMERA',
      READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
      WRITE_EXTERNAL_STORAGE: 'android.permission.WRITE_EXTERNAL_STORAGE',
    },
    IOS: {
      CAMERA: 'ios.permission.CAMERA',
    },
  },
  request: jest.fn(),
  requestMultiple: jest.fn(),
  RESULTS: {
    GRANTED: 'granted',
    BLOCKED: 'blocked',
    DENIED: 'denied',
  },
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
  },
}));

describe('PermissionService', function () {
  // Initialize the PermissionService
  const PermissionServiceInstance = PermissionService();

  describe('requestCameraPermission', () => {
    it('should return true when camera permission is granted', async () => {
      (request as jest.Mock).mockResolvedValue(RESULTS.GRANTED);
      const result = await PermissionServiceInstance.requestCameraPermission();
      expect(result).toBe(true);
      expect(request).toHaveBeenCalledWith(PERMISSIONS.ANDROID.CAMERA);
    });
  });
  describe('requestWriteStoragePermission', () => {
    it('should return the correct status based on the permission status', async () => {
      (requestMultiple as jest.Mock).mockResolvedValue({
        'android.permission.WRITE_EXTERNAL_STORAGE': RESULTS.GRANTED,
      });
      const result =
        await PermissionServiceInstance.requestWriteStoragePermission();
      expect(result).toBe('granted');
      expect(requestMultiple).toHaveBeenCalledWith([
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ]);
    });
  });
});
