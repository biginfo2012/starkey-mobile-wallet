import React from 'react';

import { render } from '@testing-library/react-native';

import WalletConnectionStatus from './WalletConnectionStatus';

// Mock the customHooks/useWalletConnectionStatus module
jest.mock('customHooks/useWalletConnectionStatus', () => ({
  __esModule: true,
  default: jest.fn(() => ({ status: 'Connected' })), // Mock the hook to return a connected status
}));

// Mock the hooks/useTheme module
jest.mock('hooks/useTheme', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    Fonts: {
      textRegularBold: {},
      text30OpacityRegular: {},
    },
    Layout: {
      rowHCenter: {},
    },
    Colors: {
      textSuccess: 'successColor',
      textGray600: 'gray600Color',
    },
    MetricsSizes: {
      tiny: 0,
    },
  })),
}));

// Mock the i18next module
jest.mock('i18next', () => ({
  t: jest.fn(key => key), // simple mock for the translation function
}));

// Mock the theme/Helper/ColorUtils module
jest.mock('theme/Helper/ColorUtils', () => ({
  applyOpacityToHexColor: jest.fn((color, _opacity) => color),
}));

describe('WalletConnectionStatus', () => {
  it('renders correctly when connected', () => {
    const { getByTestId, getByText } = render(<WalletConnectionStatus />);

    // Check if the status text is rendered
    expect(getByTestId('status_text')).toBeTruthy();

    // Check if the connected status is rendered
    expect(getByText('common:Connected')).toBeTruthy();
  });
});
