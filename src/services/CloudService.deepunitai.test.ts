import { Platform } from 'react-native';

import CloudService from './CloudService';
import { config, createFiles, readFiles } from './GdriveHelper';

jest.mock('./iCloudService', () => ({
  uploadToiCloud: jest.fn(),
  getFilePath: jest.fn(),
  readiCloudFile: jest.fn(),
}));
jest.mock('./GdriveHelper', () => ({
  config: jest.fn(),
  createFiles: jest.fn(),
  readFiles: jest.fn(),
}));

// Mocking the modules
describe('CloudService', function () {
  // Resetting all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restoring all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('uploadToCloud', () => {
    // Testing if GdriveHelper and its methods are being called for non-ios platform
    it('should call GdriveHelper createFiles for non-iOS', async () => {
      Platform.OS = 'android';
      const configMock = config as jest.MockedFunction<typeof config>;
      const createFilesMock = createFiles as jest.MockedFunction<
        typeof createFiles
      >;
      const localPath = 'path/to/local/file';
      const fileName = 'test.txt';
      await CloudService().uploadToCloud(localPath, fileName);
      expect(configMock).toHaveBeenCalled();
      expect(createFilesMock).toHaveBeenCalledWith(localPath, fileName);
    });
  });
  describe('readCloudFile', () => {
    // Testing if GdriveHelper and its methods are being called for non-ios platform
    it('should call GdriveHelper readFiles for non-iOS', async () => {
      Platform.OS = 'android';
      const configMock = config as jest.MockedFunction<typeof config>;
      const readFilesMock = readFiles as jest.MockedFunction<typeof readFiles>;
      await CloudService().readCloudFile();
      expect(configMock).toHaveBeenCalled();
      expect(readFilesMock).toHaveBeenCalled();
    });
  });
});

// eslint-disable-next-line jest/no-identical-title
describe('CloudService', function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('uploadToCloud', () => {
    it('should upload to Gdrive if Platform.OS is not ios and also createFiles function should be called with a input which passed to uploadToCloud', async () => {
      Platform.OS = 'android';
      const localPath = 'path/to/local/file';
      const fileName = 'file.txt';
      await CloudService().uploadToCloud(localPath, fileName);
      expect(config).toHaveBeenCalled();
      expect(createFiles).toHaveBeenCalledWith(localPath, fileName);
    });
  });
});
