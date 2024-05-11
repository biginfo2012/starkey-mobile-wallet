import * as RNFS from '@dr.pogodin/react-native-fs';
import AndroidDownloadFileManager from 'nativeBridge/AndroidDownloadFileManager';

export const DocumentDirectoryPath = RNFS.DocumentDirectoryPath;
export const DownloadDirectoryPath = RNFS.DownloadDirectoryPath;
export const CachesDirectoryPath = RNFS.CachesDirectoryPath;

const FileManagerService = () => {
  const createDirectory = async (dirPath: string): Promise<void> => {
    try {
      await RNFS.mkdir(dirPath);
    } catch (error) {
      throw new Error(`Error creating directory: ${error.message}`);
    }
  };

  const deleteDirectory = async (dirPath: string): Promise<void> => {
    try {
      await RNFS.unlink(dirPath);
    } catch (error) {
      throw new Error(`Error deleting directory: ${error.message}`);
    }
  };

  const moveFile = async (filePath: string, targetFilePath: string) => {
    try {
      const isFileExists = await RNFS.exists(targetFilePath);
      console.log('isFileExists', isFileExists);
      if (isFileExists) {
        return;
      }
      await RNFS.moveFile(filePath, targetFilePath);
    } catch (error) {
      throw new Error(`Error moving file: ${error.message}`);
    }
  };

  const copyFile = async (filePath: string, targetFilePath: string) => {
    try {
      const isFileExists = await RNFS.exists(targetFilePath);
      console.log('isFileExists', isFileExists);
      if (isFileExists) {
        return;
      }
      await RNFS.copyFile(filePath, targetFilePath);
    } catch (error) {
      throw new Error(`Error moving file: ${error.message}`);
    }
  };

  const checkIsFileExists = async (targetFilePath: string) => {
    try {
      const isFileExists = await RNFS.exists(targetFilePath);
      return isFileExists;
    } catch (error) {
      throw new Error(`Error moving file: ${error.message}`);
    }
  };

  const createFile = async (
    filePath: string,
    fileContent: string,
    fileEncoding: 'utf8' | 'base64',
    shouldDeleteExists?: boolean,
  ): Promise<void> => {
    try {
      if (shouldDeleteExists) {
        const isFileExists = await RNFS.exists(filePath);
        if (isFileExists) {
          await RNFS.unlink(filePath);
        }
      }

      await RNFS.writeFile(filePath, fileContent, fileEncoding);
    } catch (error) {
      throw new Error(`Error creating file: ${error.message}`);
    }
  };

  const readFile = async (
    filePath: string,
    fileEncoding: 'utf8' | 'base64',
  ): Promise<string> => {
    try {
      return await RNFS.readFile(filePath, fileEncoding);
    } catch (error) {
      throw new Error(`Error reading file: ${error.message}`);
    }
  };

  const deleteFile = async (filePath: string): Promise<void> => {
    try {
      await RNFS.unlink(filePath);
    } catch (error) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  };

  const getFilesAndDirectories = async (dirPath: string): Promise<any[]> => {
    try {
      return await RNFS.readDir(dirPath);
    } catch (error) {
      throw new Error(`Error getting files and directories: ${error.message}`);
    }
  };

  const createFileInDownloadInAndroid = async (
    fileName: string,
    fileContent: string,
  ) => {
    return new Promise((resolve, reject) => {
      AndroidDownloadFileManager.downloadFileToPublicDownloadDirectory(
        fileName,
        fileContent,
        (errorMessage: string, errorCode: string) => {
          console.error('Download error:', errorMessage, errorCode);
          reject(errorCode);
        },
        (responseMessage: string, responseCode: string) => {
          resolve(responseCode);
        },
      );
    });
  };

  return {
    createDirectory,
    deleteDirectory,
    createFile,
    readFile,
    deleteFile,
    getFilesAndDirectories,
    moveFile,
    createFileInDownloadInAndroid,
    checkIsFileExists,
    copyFile,
  };
};

export default FileManagerService;
