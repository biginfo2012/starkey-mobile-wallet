import {
  createDir,
  defaultICloudContainerPath,
  exist,
  getDefaultICloudContainerPath,
  readFile,
  unlink,
  upload,
} from 'react-native-cloud-store';

import { t } from 'i18next';
import { showToast } from 'theme/Helper/common/Function';
import {
  documentFolderName,
  tempRecoveryFileNamePreFix,
} from 'theme/Helper/constant';

const iCloudService = () => {
  const getFilePath = async () => {
    return (
      defaultICloudContainerPath +
      `/${documentFolderName}/${tempRecoveryFileNamePreFix}0.json`
    );
  };

  const deleteiCloudFolderOrFile = async (folderPath: string) => {
    await unlink(folderPath);
  };

  const getICloudPath = async () => {
    return await getDefaultICloudContainerPath();
  };

  const uploadToiCloud = async (localPath: string, fileName: string) => {
    const icloudPath = await getICloudPath();
    try {
      try {
        await createDir(icloudPath + `/${documentFolderName}/`);
      } catch (error) {
        throw 'create dir error!';
      }
      const isFileExists = await exist(
        icloudPath + `/${documentFolderName}/` + fileName,
      );
      if (isFileExists) {
        await deleteiCloudFolderOrFile(
          icloudPath + `/${documentFolderName}/` + fileName,
        );
      }
      try {
        await upload(
          localPath,
          icloudPath + `/${documentFolderName}/` + fileName,
        );
      } catch (error) {
        throw 'Upload file error!';
      }
    } catch (e) {
      console.error('e', e);
    }
  };

  const readiCloudFile = async (filePathForRead: string) => {
    try {
      let content = await readFile(filePathForRead);
      return content;
    } catch (e) {
      console.error('e', e);
      showToast('error', t('common:Recovery_File_does_not_exist'));
    }
  };

  return {
    getFilePath,
    deleteiCloudFolderOrFile,
    uploadToiCloud,
    readiCloudFile,
  };
};

export default iCloudService;
