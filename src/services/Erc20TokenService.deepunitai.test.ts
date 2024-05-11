import Erc20TokenService from './Erc20TokenService';

jest.mock('axios');

jest.mock('theme/Helper/common/Function');

jest.mock('theme/Helper/constant');

jest.mock('./EthersService');

jest.mock('./WalletSigner');

describe('Erc20TokenService', function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchAllErc20TokenBalance', () => {
    it('should handle error when fetching all erc20 token balances', async () => {
      // Arrange
      const item = [
        {
          providerNetworkRPC_URL: 'wss://example.com',
          networkName: 'testNetwork',
          isEVMNetwork: true,
          tokenContractAddress: '0x123456789',
          shortName: 'Token 1',
        },
        {
          providerNetworkRPC_URL: 'wss://example.com',
          networkName: 'testNetwork',
          isEVMNetwork: true,
          tokenContractAddress: '0x987654321',
          shortName: 'Token 2',
        },
      ];
      const error = new Error('Failed to fetch all token balances');
      Erc20TokenService().fetchAllErc20TokenBalance = jest
        .fn()
        .mockRejectedValue(error);
      // Act
      const result = await Erc20TokenService().fetchAllErc20TokenBalance(item);
      // Assert
      expect(result).toEqual([]);
    });
  });
});
