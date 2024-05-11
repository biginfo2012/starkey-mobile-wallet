import AptosService from './AptosService';

// Mock the AptosClient class
jest.mock('aptos', () => {
  return {
    AptosClient: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

describe('AptosService', () => {
  let aptosService = AptosService();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('it should create', () => {
    expect(aptosService).toBeDefined();
  });
  test('The function is called with a mnemonic seed and path index 0', async () => {
    // Mock variables
    const mnemonicSeed = 'mnemonicSeed';
    const pathIndex = '0';

    // Mock getWalletUsingSeed function
    aptosService.getWalletUsingSeed = jest.fn().mockResolvedValue({
      address: 'walletAddress',
      privateKey: 'privateKey',
    });

    // Call the function
    const result = await aptosService.getWalletUsingSeed(
      mnemonicSeed,
      pathIndex,
    );

    // Assertions
    expect(aptosService.getWalletUsingSeed).toHaveBeenCalledWith(
      mnemonicSeed,
      pathIndex,
    );
    expect(result).toEqual({
      address: 'walletAddress',
      privateKey: 'privateKey',
    });
  });

  it('should be able to check and register custom tokens', async () => {
    const tokens = await aptosService.checkAndRegister('test seed phrase', {
      tokenContractAddress: 'test custom token address',
      providerNetworkRPC_URL: '',
      providerNetworkRPC_Network_Name: '',
      networkName: '',
    });
    expect(tokens).toBeDefined();
  });

  it('should be able to get the provider for the Aptos blockchain', async () => {
    const provider = aptosService.getProvider({
      tokenContractAddress: 'test custom token address',
      providerNetworkRPC_URL: '',
      providerNetworkRPC_Network_Name: '',
      networkName: '',
      id: '',
      image: '',
      title: '',
      subTitle: '',
      shortName: '',
      amount: '',
      usdAmount: '',
      networkId: '',
      tokenType: 'Native',
      coingeckoTokenId: '',
      envType: 'testNet',
      explorerAccountURL: '',
    });
    expect(provider).toBeDefined();
  });

  it('should be able to reset the wallet', async () => {
    const wallet = aptosService.resetWallet();
    expect(wallet).toBeUndefined();
  });
});
