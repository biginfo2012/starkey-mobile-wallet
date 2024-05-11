import WalletAddressValidationService from './WalletAddressValidationService';

describe('WalletAddressValidationService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('it should create', () => {
    expect(WalletAddressValidationService).toBeTruthy();
  });

  it('This is a happy path test case where we are testing a valid SUI network type wallet address. If the isValidSuiAddress method returns true, the function should return true.', async () => {
    const result =
      await WalletAddressValidationService().checkWalletAddressIsValidOrNot(
        '0xd41e7c36e8e54403351806dab47934ba30d3f8463b8c4d0cc02b42c323ae1ea0',
        'SUI',
      );
    expect(result).toBe(true);
  });

  it('This is a happy path test case where we are testing a valid APTOS network type wallet address. If the AptosAddress regular expression matches, the function should return true.', async () => {
    const result =
      await WalletAddressValidationService().checkWalletAddressIsValidOrNot(
        '0xd493f074959eb71547b64d8b8e791a48153863345175d22fb561c1ffe5b24e87',
        'APT',
      );
    expect(result).toBe(true);
  });

  it('This is a happy path test case where we are testing a valid SUP network type wallet address. If the AptosAddress regular expression matches, the function should return true.', async () => {
    const result =
      await WalletAddressValidationService().checkWalletAddressIsValidOrNot(
        '0xd493f074959eb71547b64d8b8e791a48153863345175d22fb561c1ffe5b24e87',
        'SUP',
      );
    expect(result).toBe(true);
  });

  it('This is a happy path test case where we are testing a valid Solana network type wallet address. If the PublicKey.isOnCurve return true, the function should return true.', async () => {
    const result =
      await WalletAddressValidationService().checkWalletAddressIsValidOrNot(
        'GMHqPEWpQDyRoHHPDhiYShnnv2ZfZ72GcKZip1XPztTJ',
        'SOL',
      );
    expect(result).toBe(true);
  });
});
