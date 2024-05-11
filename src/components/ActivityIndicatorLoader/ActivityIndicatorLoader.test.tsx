import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import ActivityIndicatorLoader from './ActivityIndicatorLoader';

describe('ActivityIndicatorLoader', () => {
  it('renders with default props', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ActivityIndicatorLoader color={'primaryColor'} />
      </Provider>,
    );

    // Assuming you have a test ID in your style file
    const loader = getByTestId('activity-indicator-loader');

    // Verify that the default size is 'large'
    expect(loader.props.size).toBe('large');

    // Verify that the default color is the primary color from the theme
    expect(loader.props.color).toBe('primaryColor');
  });

  it('renders with custom props', () => {
    const customSize = 'small';
    const customColor = 'red';
    const customStyle = { backgroundColor: 'red' };

    const { getByTestId } = render(
      <Provider store={store}>
        <ActivityIndicatorLoader
          size={customSize}
          color={customColor}
          loaderStyle={customStyle}
        />
      </Provider>,
    );

    const loader = getByTestId('activity-indicator-loader');

    // Verify that the props are set correctly
    expect(loader.props.size).toBe(customSize);
    expect(loader.props.color).toBe(customColor);

    // Verify that the custom style is applied
    expect(loader.props.style).toContainEqual(customStyle);
  });
});
