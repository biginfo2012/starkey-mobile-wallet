import WalletSigner from './WalletSigner';

describe('WalletSigner service', () => {
  const service = WalletSigner();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create', () => {
    expect(service).toBeDefined();
  });
});
