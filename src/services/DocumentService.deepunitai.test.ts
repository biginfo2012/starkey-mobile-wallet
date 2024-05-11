/* eslint-disable jest/no-identical-title */

/* eslint-disable jest/valid-expect */
import DocumentPicker, {
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker';

import DocumentService from './DocumentService';

jest.mock('react-native-document-picker', () => ({
  pickSingle: jest.fn(),
  isCancel: jest.fn(),
  isInProgress: jest.fn(),
  types: {
    json: 'json',
  },
}));

// We are mocking the 'react-native-document-picker' module since the test environment is not capable of handling the native functionality provided by the module.
describe('DocumentService', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('calls DocumentPicker with the correct arguments and returns the result', async () => {
    // Arrange
    const mockResult = { uri: 'testUri', name: 'testName', type: 'testType' };
    (DocumentPicker.pickSingle as jest.Mock).mockResolvedValue(mockResult);
    // Act
    const result = await DocumentService().documentPickerFile();
    // Assert
    expect(DocumentPicker.pickSingle).toHaveBeenCalledWith({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
      type: types.json,
    });
    expect(result).toBe(mockResult);
  });

  it('throws error when unknown error occurs', async () => {
    // Arrange
    const mockError = new Error('unknown error');
    (DocumentPicker.pickSingle as jest.Mock).mockRejectedValue(mockError);
    (isCancel as jest.Mock).mockReturnValue(false);
    (isInProgress as jest.Mock).mockReturnValue(false);
    // Assert
    expect(DocumentService().documentPickerFile()).rejects.toThrow(mockError);
  });
});

// Describe block represents a suite of tests
describe('DocumentService', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // It block represents an individual test
  it('should handle DocumentPickerFile correctly', async () => {
    // Mocking the result of DocumentPicker.pickSingle
    const mockPickerResult = {
      uri: 'file://path/to/file',
      type: 'application/json',
      name: 'file.json',
      size: 123,
    };
    (DocumentPicker.pickSingle as jest.Mock).mockResolvedValueOnce(
      mockPickerResult,
    );
    // Testing the DocumentPickerFile function
    const documentService = DocumentService();
    const result = await documentService.documentPickerFile();
    expect(result).toEqual(mockPickerResult);
    expect(DocumentPicker.pickSingle).toHaveBeenCalledWith({
      presentationStyle: 'fullScreen',
      copyTo: 'cachesDirectory',
      type: types.json,
    });
  });
  it('should handle DocumentPicker exception correctly', async () => {
    // Mocking the error
    const mockError = new Error('An error occurred');
    (DocumentPicker.pickSingle as jest.Mock).mockRejectedValueOnce(mockError);
    // Testing the DocumentPickerFile function
    const documentService = DocumentService();
    expect(documentService.documentPickerFile()).rejects.toThrow(mockError);
  });
});
