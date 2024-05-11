import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import BasicAccountsOptionsRawItem from './BasicAccountsOptionsRawItem';

describe('BasicAccountsOptionsRawItem', () => {
  const mockItem = {
    image: 'path/to/image.png',
  };

  const mockOnPress = jest.fn();

  it('renders correctly', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BasicAccountsOptionsRawItem item={mockItem} onPress={mockOnPress} />
      </Provider>,
    );

    const imageElement = getByTestId('right_image');

    expect(imageElement).toBeTruthy();
  });

  it('calls onPress when Pressable is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BasicAccountsOptionsRawItem item={mockItem} onPress={mockOnPress} />
      </Provider>,
    );

    const pressable = getByTestId('basic-accounts-options-raw-item-pressable');
    fireEvent.press(pressable);

    expect(mockOnPress).toHaveBeenCalled();
  });
});
