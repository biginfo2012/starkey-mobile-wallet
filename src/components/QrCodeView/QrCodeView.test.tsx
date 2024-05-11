import React from 'react';

import { render } from '@testing-library/react-native';

import QrCodeView from './QrCodeView';

// Mock the ViewShot component
jest.mock('react-native-view-shot', () => 'ViewShot');

// Mock the useTheme hook
jest.mock('hooks/useTheme', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    Layout: {},
    Colors: {},
    Gutters: {},
    Common: {},
    Images: {},
  })),
}));

describe('QrCodeView', () => {
  it('renders correctly', () => {
    const value = 'QR Code Value';
    const size = 200;

    const { getByTestId } = render(<QrCodeView value={value} size={size} />);

    const qrCode = getByTestId('qr-code');
    expect(qrCode).toBeTruthy();
  });
});
