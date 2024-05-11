import {
  renderShortAddress,
  renderSlightlyLongAddress,
  renderFullAddress,
  formatAddress,
} from './index';

// Wrap all tests within a describe function for organization
describe('Address helper functions', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Test 1: Check renderShortAddress function
  it('should render short address correctly', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const expected = '0x1234...7890';
    const result = renderShortAddress(address);
    expect(result).toEqual(expected);
  });
  // Test 2: Check renderSlightlyLongAddress function
  it('should render slightly long address correctly', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const expected = '0x1234567890123456789012...7890';
    const result = renderSlightlyLongAddress(address);
    expect(result).toEqual(expected);
  });
  // Test 3: Check renderFullAddress function
  it('should render full address correctly', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const expected = '0x1234567890123456789012345678901234567890';
    const result = renderFullAddress(address);
    expect(result).toEqual(expected);
  });
  // Test 4: Check formatAddress function
  it('should format address correctly', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const expectedShort = '0x1234...7890';
    const expectedMid = '0x1234567890123456789012...7890';
    const expectedFull = '0x1234567890123456789012345678901234567890';
    const resultShort = formatAddress(address, 'short');
    const resultMid = formatAddress(address, 'mid');
    const resultFull = formatAddress(address, 'full');
    expect(resultShort).toEqual(expectedShort);
    expect(resultMid).toEqual(expectedMid);
    expect(resultFull).toEqual(expectedFull);
  });
});

describe('Address Helper', function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  describe('renderShortAddress', () => {
    /* We want to ensure that our function correctly shortens the address as expected.
     * We also want to test the default parameter and ensure that it correctly uses 4 characters when none are provided.
     * Additionally, we want to confirm that when no address is provided, the function should return undefined.
     */
    it('should return correct short address', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const shortAddress = renderShortAddress(address, 5);
      expect(shortAddress).toEqual('0x12345...45678');
    });
    it('should return correct short address with default char length', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      const shortAddress = renderShortAddress(address);
      expect(shortAddress).toEqual('0x1234...5678');
    });
    it('should return undefined if no address is provided', () => {
      const shortAddress = renderShortAddress(undefined);
      expect(shortAddress).toBeUndefined();
    });
  });
});

// Wrapping the tests within a describe block
describe('renderSlightlyLongAddress', function () {
  // We need to reset all mocks before each test to ensure a clean slate for each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // We need to restore all mocks after each test to clean up our test environment
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should correctly render an address', () => {
    // Let's test the function with a dummy address
    const address = '0x1234567890123456789012345678901234567890';
    const result = renderSlightlyLongAddress(address);
    // We want to ensure that the function correctly slices and appends the address
    // The expected result should be the first 24 characters of the address, followed by three dots, and then the last 4 characters
    expect(result).toBe('0x1234567890123456789012...7890');
  });
  it('should return the original address if it is null or undefined', () => {
    // In case the address is null or undefined, the function should return the original value
    const nullAddress = null;
    const undefinedAddress = undefined;
    expect(renderSlightlyLongAddress(nullAddress)).toBe(nullAddress);
    expect(renderSlightlyLongAddress(undefinedAddress)).toBe(undefinedAddress);
  });
});

// Mocking the renderFullAddress function
// Mocking the renderFullAddress function
describe('Address Helper1', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe('renderFullAddress', () => {
    // We are testing that the method returns the same value it receives as input,
    // because according to the implementation, it should return the input parameter as it is
    it('should return the full address', () => {
      const mockAddress = '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1';
      const renderFullAddressMock = jest.fn(renderFullAddress);

      // const renderFullAddressMock = mocked(renderFullAddress);
      // Call the function with the mockAddress
      const result = renderFullAddressMock(mockAddress);
      // Expect the result to be the same as the input
      expect(result).toBe(mockAddress);
      // Expect the function to have been called once
      expect(renderFullAddressMock).toHaveBeenCalledTimes(1);
      // Expect the function to have been called with the correct parameter
      expect(renderFullAddressMock).toHaveBeenCalledWith(mockAddress);
    });
  });
});

describe('Address helper functions1', function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should return the short address format correctly using renderShortAddress', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const expectedShortAddress = '0x1234...5678';
    expect(renderShortAddress(address)).toEqual(expectedShortAddress);
  });
  it('should return the slightly long address format correctly using renderSlightlyLongAddress', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const expectedLongAddress = '0x1234567890abcdef123456...5678';
    expect(renderSlightlyLongAddress(address)).toEqual(expectedLongAddress);
  });
  it('should return the full address correctly using renderFullAddress', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    expect(renderFullAddress(address)).toEqual(address);
  });
  it('should format the address correctly using formatAddress', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const expectedShortAddress = '0x1234...5678';
    const expectedLongAddress = '0x1234567890abcdef123456...5678';
    expect(formatAddress(address, 'short')).toEqual(expectedShortAddress);
    expect(formatAddress(address, 'mid')).toEqual(expectedLongAddress);
    expect(formatAddress(address, 'full')).toEqual(address);
  });
});

// Reset all mocks before each test
// Restore all mocks after each test
describe('renderShortAddress', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // We want to test if the function correctly returns a short version of the address
  // when a valid address and number of characters are provided
  it('should return the short version of the address', () => {
    const address = '0x1234567890abcdef';
    const chars = 4;
    const result = renderShortAddress(address, chars);
    expect(result).toBe('0x1234...cdef');
  });
  // We want to test if the function correctly handles an empty address
  // The function should return the input as is, in this case an empty string
  it('should return the input as is when an empty address is provided', () => {
    const address = '';
    const chars = 4;
    const result = renderShortAddress(address, chars);
    expect(result).toBe('');
  });
  // We want to test if the function correctly handles when no number of characters is provided
  // The function should default to 4 characters at the start and end of the address
  it('should return the short version of the address with 4 characters at the start and end when no chars is provided', () => {
    const address = '0x1234567890abcdef';
    const result = renderShortAddress(address);
    expect(result).toBe('0x1234...cdef');
  });
});

// jest comes with a built-in mocking module which can be used for mocking
// functionalities that are not present or not being used.
// jest comes with a built-in mocking module which can be used for mocking
// functionalities that are not present or not being used.
describe('renderSlightlyLongAddress function', function () {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restore all mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Testing whether the function returns the correct output when a valid address is provided.
  it('should return a shortened address when valid address is provided', () => {
    const address = '0x123456789abcdef123456789abcdef123456789abcdef';
    const result = renderSlightlyLongAddress(address);
    expect(result).toEqual('0x123456789abcdef1234567...cdef');
  });
  // Testing whether the function returns the correct output when the address is undefined.
  it('should return undefined when address is not provided', () => {
    const address = undefined;
    const result = renderSlightlyLongAddress(address);
    expect(result).toBeUndefined();
  });
  // Testing whether the function returns the correct output when the address is an empty string.
  it('should return an empty string when address is an empty string', () => {
    const address = '';
    const result = renderSlightlyLongAddress(address);
    expect(result).toEqual('');
  });
  // Testing whether the function returns the correct output when the address is less than chars+initialChars length.
  it('should return the complete address without truncation when address is less than chars+initialChars length', () => {
    const address = '0x123456789abcdef';
    const result = renderSlightlyLongAddress(address);
    expect(result).toEqual('0x123456789abcdef');
  });
});

// Describe the test suite
describe('Address Helper2', function () {
  // Run before each test
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });
  // Run after each test
  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });
  // Test case for renderFullAddress function
  it('should return the full checksummed address', () => {
    // Define the test input and expected output
    const testAddress = '0x1234567890abcdef';
    const expectedOutput = testAddress;
    // Call the function with the test input
    const result = renderFullAddress(testAddress);
    // Expect the result to be the expected output
    expect(result).toBe(expectedOutput);
  });
});
