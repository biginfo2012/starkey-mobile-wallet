import iCloudService from './iCloudService';

jest.mock('react-native-cloud-store');

describe('iCloudService', () => {
  const iCloudServiceInstance = iCloudService();
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('it should create', () => {
    expect(jest.createMockFromModule('./iCloudService')).toBeTruthy();
  });

  it('The getFilePath function does not require any input. It returns a string that represents the path of a file in iCloud. This is a happy path case.', async () => {
    const mockFilePath = 'Documents/Star Key0.json';

    const result = await iCloudServiceInstance.getFilePath();

    expect(result).toContain(mockFilePath);
  });
});
