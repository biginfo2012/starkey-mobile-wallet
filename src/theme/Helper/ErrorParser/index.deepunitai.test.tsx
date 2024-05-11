import { parseEthTransactionError } from './index';

// Mocking console.log function for testing
// Grouping related test cases using describe
describe('ErrorParser', function () {
  // Mocking console.log function for testing
  jest.spyOn(console, 'log');
  // Resetting all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restoring all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test case for parseEthTransactionError function
  it('should correctly parse the error string', () => {
    const errorString = '{"code": "error_code"}, "payload": "error_payload"}';
    const result = parseEthTransactionError(errorString);
    const expectedJsonErrorPart = { code: 'error_code' };
    const expectedJsonPayloadPart = '{ "payload": "error_payload"}';
    expect(result.jsonErrorPart).toEqual(expectedJsonErrorPart);
    expect(result.jsonPayloadPart).toEqual(expectedJsonPayloadPart);
  });
});

// Mocking console.log
describe('parseEthTransactionError', function () {
  // Mocking console.log
  jest.spyOn(global.console, 'log');
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // We want to test that the function correctly parses the input string into two separate parts
  // and returns them as JSON objects. This is important to ensure that the function is correctly
  // handling and transforming the error data.
  it('should parse the error string and return JSON object', () => {
    const errorString =
      '{"code": "SAMPLE_ERROR_CODE"}, {"message": "SAMPLE_ERROR_MESSAGE"}';
    // Perform the operation
    const result = parseEthTransactionError(errorString);
    // Verify the result
    expect(result.jsonErrorPart).toEqual({ code: 'SAMPLE_ERROR_CODE' });
  });
});
