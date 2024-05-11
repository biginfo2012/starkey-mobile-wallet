// __mocks__/react-native-mmkv-storage.js

// Mock the entire module
const MMKVLoaderMock = {
  withServiceName: jest.fn().mockReturnThis(),
  withEncryption: jest.fn().mockReturnThis(), // For chaining methods
  initialize: jest.fn().mockReturnValue({
    getItem: jest.fn(key => `Mocked Value for key: ${key}`),
    setItem: jest.fn(),
    // Add more mock functions here if required.
  }),
};

export const MMKVLoader = jest.fn().mockImplementation(() => MMKVLoaderMock);
