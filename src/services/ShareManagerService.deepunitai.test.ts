import Share from 'react-native-share';

import ShareManagerService from './ShareManagerService';

// Mocking react-native-share module
jest.mock('react-native-share', () => {
  return {
    open: jest.fn(),
  };
});

// Mocking react-native-share module
describe('ShareManagerService', function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  it('should share the text', async () => {
    // Arrange
    const shareText = 'Hello World';
    const service = ShareManagerService();
    // Act
    await service.shareText(shareText);
    // Assert
    expect(Share.open).toHaveBeenCalledWith({ message: shareText });
  });
  it('should share the image', async () => {
    // Arrange
    const imagePath = 'path/to/image.jpg';
    const service = ShareManagerService();
    // Act
    await service.shareImage(imagePath);
    // Assert
    expect(Share.open).toHaveBeenCalledWith({ url: imagePath });
  });
  it('should share the JSON file', async () => {
    // Arrange
    const filePath = 'path/to/file.json';
    const service = ShareManagerService();
    // Act
    await service.shareJsonFile(filePath);
    // Assert
    expect(Share.open).toHaveBeenCalledWith({
      url: `file://${filePath}`,
      type: 'application/json',
    });
  });
  it('should share the URL', async () => {
    // Arrange
    const url = 'https://example.com';
    const service = ShareManagerService();
    // Act
    await service.shareURL(url);
    // Assert
    expect(Share.open).toHaveBeenCalledWith({ url: url });
  });
  it('should share the file', async () => {
    // Arrange
    const filePath = 'path/to/file.txt';
    const service = ShareManagerService();
    // Act
    await service.shareFile(filePath);
    // Assert
    expect(Share.open).toHaveBeenCalledWith({ url: `file://${filePath}` });
  });
});
