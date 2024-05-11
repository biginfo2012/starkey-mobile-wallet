import React from 'react';

import { render } from '@testing-library/react-native';

import UserProfileView from './UserProfileView';

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

describe('UserProfileView', () => {
  it('renders correctly', () => {
    const value = 'User Profile Value';
    const size = 200;

    const { getByTestId } = render(
      <UserProfileView value={value} size={size} />,
    );

    const userProfile = getByTestId('user-profile-view');
    expect(userProfile).toBeTruthy();
  });
});
