import WalletCommonService from './WalletCommonService';

describe('WalletCommonService', () => {
  const service = WalletCommonService();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });

  test('input: None output: A randomly generated mnemoni type: Happy path', () => {
    const mnemonic = service.createMnemonic();
    expect(mnemonic).toBeDefined();
  });

  test('input: Empty contract address, network object output: An error message stating that a token address needs to be enteredtype: Error state', async () => {
    const contractAddress = '';
    const networkObj = {
      networkName: 'ETH',
    };

    const result = await service.getCustomTokenInfoByTokenAddress(
      contractAddress,
      networkObj,
    );

    expect(result).toEqual({
      error: 'Please enter a token address!',
    });
  });
});
