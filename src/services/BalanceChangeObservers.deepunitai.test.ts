/* eslint-disable quotes */
// BalanceChangeObservers.deepunitai.test.ts
import { jest } from '@jest/globals';
import { store } from 'store/index';
import { injectStore } from 'theme/Helper/common/Function';

import BalanceChangeObservers from './BalanceChangeObservers';

beforeEach(() => {
  injectStore(store);
});

// Reset all mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
});

// Restore all mocks after each test
afterEach(() => {
  jest.restoreAllMocks();
});

describe('BalanceChangeObservers', () => {
  it('should create', () => {
    // Assuming BalanceChangeObservers is a class, function or a factory.
    // You might need to adjust this based on what BalanceChangeObservers actually exports.
    const instance = BalanceChangeObservers();
    expect(instance).toBeDefined();
  });
  test('fetches and stores ERC20 token balance when getAndStoreERC20TokenBalance is called with a specific wallet address, contract, and network item -- written by DeepUnit.Ai', async () => {
    const mockContract = {
      balanceOf: jest.fn().mockResolvedValue('1000'),
      decimals: jest.fn().mockResolvedValue(18),
    };
    const mockItem = {
      networkName: 'ETH',
      isEVMNetwork: true,
      shortName: 'DAI',
    };
    const mockWalletAddress = '0x123';

    const instance = BalanceChangeObservers();
    const spy = jest.spyOn(instance, 'getAndStoreERC20TokenBalance');
    await instance.getAndStoreERC20TokenBalance(
      mockWalletAddress,
      mockContract,
      mockItem,
    );

    expect(spy).toHaveBeenCalledWith(mockWalletAddress, mockContract, mockItem);
    expect(mockContract.balanceOf).toHaveBeenCalledWith(mockWalletAddress);
    expect(mockContract.decimals).toHaveBeenCalled();
  });
  test('This case examines the interval setup for fetching Aptos token balances periodically. When fetchAllAptosTokenBalances is invoked with an array of Aptos tokens, it first clears any existing intervals for these tokens to avoid duplication. Then, it sets up a new interval to fetch Aptos token balances every 20 seconds, ensuring the Redux store remains updated with the latest balances. -- written by DeepUnit.Ai', () => {
    jest.useFakeTimers();
    const tokens = [{ id: '1', networkName: 'APT', tokenName: 'APT Token 1' }];
    const instance = BalanceChangeObservers();
    const spyClearInterval = jest.spyOn(global, 'clearInterval');
    const spySetInterval = jest.spyOn(global, 'setInterval');

    instance.fetchAllAptosTokenBalances(tokens);

    expect(spyClearInterval).toHaveBeenCalled();
    expect(spySetInterval).toHaveBeenCalledWith(expect.any(Function), 20000);
    jest.runOnlyPendingTimers(); // simulate the interval function being called

    jest.useRealTimers();
  });
  test('Testing fetchAllSolanaTokenBalances with an empty array to ensure it gracefully exits without making any dispatch calls, as there are no tokens to fetch balances for. -- written by DeepUnit.Ai', async () => {
    const instance = BalanceChangeObservers();
    const dispatchSpy = jest.spyOn(
      instance,
      'dispatchGetAllSolanaTokenBalance',
    );
    instance.fetchAllSolanaTokenBalances([]);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
  test("Testing fetchAndStoreNonSupportedNetworkERC20TokenBalances with tokens from a non-EVM and non-supported network to ensure it filters out these tokens and doesn't attempt to fetch balances for them. -- written by DeepUnit.Ai", async () => {
    const instance = BalanceChangeObservers();
    const spy = jest.spyOn(instance, 'getAndStoreERC20TokenBalance');
    const tokens = [
      { networkName: 'UNKNOWN', isEVMNetwork: false, shortName: 'UNK' },
    ];

    await instance.fetchAndStoreNonSupportedNetworkERC20TokenBalances(tokens);

    expect(spy).not.toHaveBeenCalled();
  });
  test("Testing 'startErc20TokenTransferEventObserver' with an unsupported network item to ensure that no observer is set up, as the function should only handle EVM-compatible networks or specified non-EVM networks like Solana. -- written by DeepUnit.Ai", async () => {
    const instance = BalanceChangeObservers();
    const mockItem = { networkName: 'UNKNOWN', isEVMNetwork: false };
    const spy = jest.spyOn(instance, 'startErc20TokenTransferEventObserver');
    await instance.startErc20TokenTransferEventObserver(mockItem);
    expect(spy).toHaveBeenCalledWith(mockItem);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
  test("Testing fetchNativeTokenBalance with an unsupported network type to verify the function's ability to handle and skip networks for which it has no specific fetching logic. -- written by DeepUnit.Ai", () => {
    const instance = BalanceChangeObservers();
    const item = { networkName: 'UNKNOWN' };
    const consoleSpy = jest.spyOn(console, 'log');
    instance.fetchNativeTokenBalance(item);
    expect(consoleSpy).not.toHaveBeenCalledWith(
      'Fetching operation performed for UNKNOWN network',
    );
  });
});
