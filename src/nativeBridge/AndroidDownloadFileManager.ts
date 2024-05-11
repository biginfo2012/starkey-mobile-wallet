import { NativeModules, Platform } from 'react-native';

export interface AndroidDownloadFileManagerModule {
  downloadFileToPublicDownloadDirectory(
    fileName: string,
    fileContent: string,
    errorCallback: (message: string, code: string) => void,
    successCallback: (message: string, code: string) => void,
  ): void;
}

const AndroidDownloadFileManager: AndroidDownloadFileManagerModule =
  Platform.OS === 'android' && NativeModules.AndroidDownloadFileManager;

export default AndroidDownloadFileManager;
