import React from 'react';
import { Text } from 'react-native';

import { render } from '@testing-library/react-native';

import SafeAreaWrapper from './SafeAreaWrapper';

// Mock the useTheme hook
jest.mock('hooks/useTheme', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    Common: {
      container: {
        flex: 1,
      },
    },
  })),
}));

describe('SafeAreaWrapper', () => {
  it('renders children with default props', () => {
    const { getByTestId } = render(
      <SafeAreaWrapper>
        <Text testID="child">Child Component</Text>
      </SafeAreaWrapper>,
    );

    const childComponent = getByTestId('child');
    expect(childComponent).toBeTruthy();
  });

  it('renders children with applyToOnlyTopEdge prop', () => {
    const { getByTestId } = render(
      <SafeAreaWrapper applyToOnlyTopEdge={false}>
        <Text testID="child">Child Component</Text>
      </SafeAreaWrapper>,
    );

    const childComponent = getByTestId('child');
    expect(childComponent).toBeTruthy();
  });
});
