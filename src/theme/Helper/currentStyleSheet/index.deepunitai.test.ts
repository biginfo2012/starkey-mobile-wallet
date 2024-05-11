import { StyleSheet } from 'react-native-size-scaling';

import getStyleSheet from './index';

// Jest mock function for StyleSheet
jest.mock('react-native-size-scaling', () => ({
  StyleSheet: jest.fn(),
}));

// Jest mock function for StyleSheet
// Jest mock function for StyleSheet
// Describe block represents a suite of tests
describe('getStyleSheet', function () {
  // Resets all information stored in the mock function instance before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });
  // Restores all mocks back to their original value after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
  // Individual test
  it('should return StyleSheet from react-native-size-scaling', () => {
    // Calling the function
    const styleSheet = getStyleSheet();
    // Assertion to test if the returned object is StyleSheet
    expect(styleSheet).toBe(StyleSheet);
    // We want to ensure the function is consistently returning the correct StyleSheet object,
    // hence we're testing if the function returns the expected object.
  });
});
