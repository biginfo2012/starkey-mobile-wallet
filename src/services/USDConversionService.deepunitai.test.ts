import fetchMock from 'jest-fetch-mock';
import { store } from 'store/index';
import { USDTContractAddress } from 'theme/Helper/constant';
import { ExistingNetworksItem } from 'types/apiResponseInterfaces';

import USDConversionService from './USDConversionService';

// We are creating a mock of the store module because it's not provided
jest.mock('store', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      wallet: {
        data: {
          seedPhrase: 'mock seed phrase',
        },
      },
    })),
  },
}));

// Mocking the fetch function
describe('USDConversionService', function () {
  jest.fn();
  beforeEach(() => {
    global.fetch = fetchMock;
    jest.useFakeTimers();
    // Clear all instances and calls to constructor and all methods:
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  // Test for fetchUSDPrice method
  it('fetchUSDPrice', async () => {
    // We want to check if the fetchUSDPrice method is able to correctly fetch the price in USD,
    // And also handle errors correctly.
    const item: ExistingNetworksItem[] = [
      {
        coingeckoTokenId: 'bitcoin',
        shortName: 'BTC',
        usdAmount: 10000,
        oneDayUSDPriceChangePercentage: 0.5,
      },
    ];
    const service = USDConversionService();
    const response = await service.fetchUSDPrice({ item });
    expect(fetch).toHaveBeenCalled();
    expect(response).toBeDefined();
  });
  // Test for startUSDPriceObserver method
  it('startUSDPriceObserver', () => {
    // We want to check if the startUSDPriceObserver method is able to correctly start observing the price in USD,
    // And also handle intervals correctly.
    const item: ExistingNetworksItem[] = [
      {
        coingeckoTokenId: 'bitcoin',
        shortName: 'BTC',
        usdAmount: 10000,
        oneDayUSDPriceChangePercentage: 0.5,
      },
    ];
    const service = USDConversionService();

    service.startUSDPriceObserver(item);
    expect(store.dispatch).toHaveBeenCalled();
  });
});

// Mocking the fetch API
global.fetch = fetchMock as any;
// Test suite
describe('USDConversionService1', function () {
  let service: ReturnType<typeof USDConversionService>;
  let mockItems: ExistingNetworksItem[];
  beforeEach(() => {
    jest.clearAllMocks();
    service = USDConversionService();
    mockItems = [
      {
        id: '3',
        title: 'USDT',
        subTitle: 'Tether USD',
        shortName: 'USDT_ETH',
        amount: '0.0',
        usdAmount: '0.0',
        networkId: '2',
        networkName: 'ETH',
        tokenType: 'ERC20',
        tokenContractAddress: USDTContractAddress,
        providerNetworkRPC_URL:
          'wss://eth-goerli.g.alchemy.com/v2/barNHxwKcvdxJuDoKlbor5qx6mhT2C_O',
        providerNetworkRPC_Network_Name: 'goerli',
        explorerURL: 'https://goerli.etherscan.io/tx/$tx',
        coingeckoTokenId: 'tether',
        isFavorite: false,
        isEVMNetwork: true,
      },
    ] as ExistingNetworksItem[];
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test the fetchUSDPrice function when the API returns an error
  it('fetchUSDPrice should return error when API fails', async () => {
    // Mocking the fetch response to throw an error
    fetchMock.mockRejectOnce(new Error('API Error'));
    const result = await service.fetchUSDPrice({ item: mockItems });
    // We expect the result to be an array of objects with an error message and default values
    // We are testing to ensure that the fetchUSDPrice function correctly handles API failures
    expect(result).toEqual([
      {
        error: 'something went wrong!!',
        shortName: 'error',
        usdAmount: 0,
        oneDayUSDPriceChangePercentage: 0,
      },
    ]);
  });
});
