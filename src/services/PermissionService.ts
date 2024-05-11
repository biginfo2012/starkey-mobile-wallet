import { Platform } from 'react-native';
import {
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions';

const PermissionService = () => {
  const requestCameraPermission = async () => {
    let permissionStatus = await request(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA,
    );
    return permissionStatus === RESULTS.GRANTED;
  };

  const requestWriteStoragePermission = async () => {
    let permissionStatus = await requestMultiple([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);

    switch (permissionStatus['android.permission.WRITE_EXTERNAL_STORAGE']) {
      case RESULTS.GRANTED:
        return 'granted';
      case RESULTS.BLOCKED:
        return 'blocked';
      case RESULTS.DENIED:
        return 'denied';
    }
  };

  return {
    requestCameraPermission,
    requestWriteStoragePermission,
  };
};

export default PermissionService;
