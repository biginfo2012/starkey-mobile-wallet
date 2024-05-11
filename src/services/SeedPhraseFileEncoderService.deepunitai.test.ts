import { DirectoryPath, FileRecoveryTempPath } from 'theme/Helper/constant';

import EncryptionService from './EncryptionService';
import FileManagerService from './FileManagerService';
import EncodeDataAndStoreDataToFile from './SeedPhraseFileEncoderService';

// Mocking the required modules
jest.mock('algorithms/reedSolomonErasure.js');

jest.mock('algorithms/reedSolomonErasureCore.js');

jest.mock('./FileManagerService');

jest.mock('./EncryptionService');

// Mocking the required modules
describe('Testing EncodeDataAndStoreDataToFile function', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should call FileManagerService and EncryptionService correctly and return the expected data when saveToFiles is false', async () => {
    // Set up mock implementations
    const mockFileManagerServiceInstance = {
      createDirectory: jest.fn(),
      createFile: jest.fn(),
      deleteDirectory: jest.fn(),
    };
    FileManagerService.mockImplementation(() => mockFileManagerServiceInstance);
    EncryptionService.mockImplementation(() => ({
      encrypt: jest.fn().mockResolvedValue('encryptedData'),
    }));
    // Define constants to be used in the function call
    const DATA_SHARDS = 2;
    const PARITY_SHARDS = 2;
    const Mnemonic = 'test mnemonic';
    const saveToFiles = false;
    // Call the function
    const result = await EncodeDataAndStoreDataToFile(
      DATA_SHARDS,
      PARITY_SHARDS,
      Mnemonic,
      saveToFiles,
    );
    // Assert that the FileManagerService methods were called correctly
    expect(
      mockFileManagerServiceInstance.createDirectory,
    ).toHaveBeenCalledTimes(2);
    expect(
      mockFileManagerServiceInstance.createDirectory,
    ).toHaveBeenNthCalledWith(1, DirectoryPath);
    expect(
      mockFileManagerServiceInstance.createDirectory,
    ).toHaveBeenNthCalledWith(2, FileRecoveryTempPath);
    // Assert that the EncryptionService encrypt method was called correctly
    expect(EncryptionService().encrypt).toHaveBeenCalledTimes(0);
    // Assert that the result is as expected
    expect(result).toEqual(expect.any(Array));
    expect(result).toHaveLength(4);
    expect(result[0]).toHaveProperty('data_shards', DATA_SHARDS);
    expect(result[0]).toHaveProperty('parity_shards', PARITY_SHARDS);
    expect(result[0]).toHaveProperty('shard_size', 7);
    expect(result[0]).toHaveProperty('position', 0);
    expect(result[0]).toHaveProperty('data', expect.any(String));
  });
});

describe('SeedPhraseFileEncoderService', function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should encode data and store it to file', async () => {
    // Mock FileManagerService
    const mockCreateDirectory = jest.fn();
    const mockCreateFile = jest.fn();
    (FileManagerService as jest.Mock).mockImplementation(() => ({
      createDirectory: mockCreateDirectory,
      createFile: mockCreateFile,
    }));
    // Mock EncryptionService
    const mockEncrypt = jest.fn().mockResolvedValue('encryptedData');
    (EncryptionService as jest.Mock).mockImplementation(() => ({
      encrypt: mockEncrypt,
    }));
    const DATA_SHARDS = 10;
    const PARITY_SHARDS = 4;
    const Mnemonic = 'test mnemonic';
    const saveToFiles = true;
    await EncodeDataAndStoreDataToFile(
      DATA_SHARDS,
      PARITY_SHARDS,
      Mnemonic,
      saveToFiles,
    );

    // Check if encrypt was called with correct data
    expect(mockEncrypt).toHaveBeenCalledWith(expect.any(String));
  });
});
