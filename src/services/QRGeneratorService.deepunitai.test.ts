import QRGeneratorService from './QRGeneratorService';

describe('QRGeneratorService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('it should create', () => {
    const qrGeneratorService = new QRGeneratorService();
    expect(qrGeneratorService).toBeTruthy();
  });
});
