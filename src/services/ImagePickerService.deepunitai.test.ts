import ImagePickerService from './ImagePickerService';

jest.mock('react-native-image-picker', () => ({
  __esModule: true,
}));

describe('ImagePickerService', () => {
  let service = ImagePickerService();

  beforeEach(() => {
    jest.setTimeout(10000);
    jest.resetAllMocks();
    service = ImagePickerService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('it should create', () => {
    expect(service).toBeTruthy();
  });
});
