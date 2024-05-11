module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    '<rootDir>/jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@?ptomasroos/react-native-multi-slider|@react-native-community|@react-navigation|uuid)',
  ],
  collectCoverageFrom: [
    '<rootDir>/src/Components/**/*.jsx',
    '<rootDir>/src/App.jsx',
    '<rootDir>/src/Components/**/*.tsx',
    '<rootDir>/src/App.tsx',
  ],
  coverageReporters: ['html', 'text', 'text-summary', 'cobertura'],
  testMatch: ['**/*.test.ts?(x)', '**/*.test.js?(x)'],
  modulePathIgnorePatterns: ['e2e'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svgMock.js',
  },
};
