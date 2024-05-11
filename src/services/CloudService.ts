import { Platform } from 'react-native';

import { t } from 'i18next';

import { config, createFiles, readFiles } from './GdriveHelper';
import iCloudService from './iCloudService';

const CloudService = () => {
  /**
   * Uploads a file to the cloud storage service.
   * @param {string} localPath - The local path of the file to be uploaded.
   * @param {string} fileName - The name of the file.
   * @throws Will throw an error if the upload fails.
   */
  const uploadToCloud = async (localPath: string, fileName: string) => {
    try {
      if (Platform.OS === 'ios') {
        await iCloudService().uploadToiCloud(localPath, fileName);
      } else {
        await config();
        await createFiles(localPath, fileName);
      }
    } catch (error) {
      console.error('Error during uploadToCloud:', error);
      throw new Error(t('common:something_went_wrong_please_try_again'));
    }
  };

  /**
   * Reads the content of a file from the cloud storage service.
   * @returns {Promise<string>} A promise that resolves with the content of the file.
   */
  const readCloudFile = async (): Promise<string> => {
    try {
      if (Platform.OS === 'ios') {
        const path = await iCloudService().getFilePath();
        const content = await iCloudService().readiCloudFile(path);
        return content;
      } else {
        await config();
        const fileData = await readFiles();
        return fileData;
      }
    } catch (error) {
      console.error('Error during readCloudFile:', error);
      throw new Error(t('common:something_went_wrong_please_try_again'));
    }
  };

  return {
    uploadToCloud,
    readCloudFile,
  };
};

export default CloudService;
