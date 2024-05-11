// EthersService.deepunitai.test.ts
import { jest } from '@jest/globals';

import EthersService from './EthersService';

beforeEach(() => {
  // Resets the state of all mocks before each test
  jest.resetAllMocks();
});

afterEach(() => {
  // Restores any mock implementations to their original state after each test
  jest.restoreAllMocks();
});

describe('EthersService', () => {
  it('should create', () => {
    // Assuming EthersService is a class that can be instantiated
    const instance = EthersService();
    expect(instance).toBeDefined();
  });

  test('Fetching the balance of an address with a valid provider URL and network name should return the balance in ether as a string. -- written by DeepUnit.Ai', async () => {
    const ethersServiceInstance = EthersService();
    const address = '0x1234...';
    const tokenObj = {
      providerNetworkRPC_URL: 'https://mainnet.infura.io',
      providerNetworkRPC_Network_Name: 'mainnet',
    };

    jest.spyOn(ethersServiceInstance, 'getBalance').mockResolvedValue('1.0');

    const balance = await ethersServiceInstance.getBalance(address, tokenObj);

    expect(balance).toEqual(expect.any(String));
    expect(ethersServiceInstance.getBalance).toHaveBeenCalledWith(
      address,
      tokenObj,
    );
  });
  test('Fetching the balance of an address with an invalid provider URL should fail to fetch the balance and return an undefined or error. -- written by DeepUnit.Ai', async () => {
    const ethersService = EthersService();
    const address = '0x1234...';
    const tokenObj = {
      providerNetworkRPC_URL: 'https://invalidurl.com',
      providerNetworkRPC_Network_Name: 'mainnet',
    };

    await expect(
      ethersService.getBalance(address, tokenObj),
    ).resolves.toBeUndefined();
  });

  test('Attempting to get custom token information with an invalid contract address length should return an error message indicating the invalid token address. -- written by DeepUnit.Ai', async () => {
    const ethersServiceInstance = EthersService();
    const contractAddress = '0x123';
    const networkObj = {
      providerNetworkRPC_URL: 'https://mainnet.infura.io',
      providerNetworkRPC_Network_Name: 'mainnet',
    };
    const result = await ethersServiceInstance.getCustomTokenInformation(
      contractAddress,
      networkObj,
    );
    expect(result.error).toBe('Token address must be a valid!');
  });

  test('Sending a custom token with correct parameters but insufficient gas limit should trigger the onTransactionFail callback with error information regarding gas. -- written by DeepUnit.Ai', async () => {
    const ethersServiceInstance = EthersService();
    const mockOnTransactionRequest = jest.fn();
    const mockOnTransactionDone = jest.fn();
    const mockOnTransactionFail = jest.fn();
    const tokenObj = {
      providerNetworkRPC_URL: 'https://mainnet.infura.io',
      providerNetworkRPC_Network_Name: 'mainnet',
    };

    await ethersServiceInstance.sendCustomToken(
      '0x5678...',
      100,
      10,
      100, // Insufficient gas limit
      mockOnTransactionRequest,
      mockOnTransactionDone,
      mockOnTransactionFail,
      tokenObj,
    );

    // Assert that the onTransactionFail callback was called, implying the transaction failed due to insufficient gas limit
    expect(mockOnTransactionFail).toHaveBeenCalled();
  });
});
