import ReedSolomonErasure from 'algorithms/reedSolomonErasure.js';

import EncryptionService from './EncryptionService';
import { RsDecode } from './SeedPhraseFileDecoderService';

jest.mock('algorithms/reedSolomonErasureCore.js');

jest.mock('./EncryptionService');
// Mocking the modules
jest.mock('algorithms/reedSolomonErasure.js');

// Mocking the imported modules
describe('SeedPhraseFileDecoderService', function () {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('RsDecode should successfully decode the seed phrase file', async () => {
    // Mocking the decryption of the file data
    (EncryptionService as jest.Mock).mockReturnValue({
      decrypt: jest.fn().mockResolvedValue(
        JSON.stringify({
          shard_size: 10,
          data_shards: 5,
          parity_shards: 5,
          position: 1,
          data: 'test_data',
        }),
      ),
    });
    // Mocking the reconstruct method of ReedSolomonErasure
    const mockReconstruct = jest.fn().mockReturnValue(0);
    (ReedSolomonErasure as jest.Mock).mockImplementation(() => {
      return { reconstruct: mockReconstruct };
    });
    // Creating dummy file data
    const fileData = Array(10).fill(
      JSON.stringify({ encrypted: 'dummy_data' }),
    );
    // Making the call to RsDecode
    const result = await RsDecode(fileData);
    // Assertions to check if the functions were called with correct parameters
    expect(EncryptionService).toHaveBeenCalledTimes(fileData.length + 1);
    expect(ReedSolomonErasure).toHaveBeenCalledTimes(1);
    expect(mockReconstruct).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      result_test: 0,
      recoveredSeed: expect.any(String),
    });
  });
});
