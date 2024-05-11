import React from 'react';

import { render } from '@testing-library/react-native';

import SecretAddressTokenInfoView from './SecretAddressToggleWithInfoView';

// Mock dependencies
jest.mock('hooks/useTheme', () => ({
  __esModule: true,
  default: () => ({
    Colors: {},
    Gutters: {},
    Layout: {},
    Fonts: {},
  }),
}));
jest.mock('i18next', () => ({
  t: jest.fn(key => key),
}));

jest.mock(
  '../CustomToggleSwitch/CustomToggleSwitch.tsx',
  () => 'MockedCustomToggleSwitch',
);
describe('SecretAddressTokenInfoView', () => {
  const mockIsEnabled = true;

  const mockSetIsEnabled = jest.fn();

  it('renders correctly with the provided props', () => {
    const { getByText } = render(
      <SecretAddressTokenInfoView
        isEnabled={mockIsEnabled}
        setIsEnabled={mockSetIsEnabled}
      />,
    );

    expect(getByText('common:Secret_Address')).toBeTruthy();
    expect(getByText('common:secretAddressInfoText')).toBeTruthy();
  });
});
