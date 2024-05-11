import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import BasicAccountsListRawItem from './BasicAccountsListRawItem';

describe('BasicAccountsListRawItem', () => {
  const mockItem = {
    id: '1',
    userName: 'John Doe',
    profileIcon: 'path/to/image.png',
  };

  const mockSelectedId = '1';
  const mockOnSelect = jest.fn();
  const mockOnPressMenu = jest.fn();
  const mockIsShowHideOption = true;

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <BasicAccountsListRawItem
          item={mockItem}
          selectedId={mockSelectedId}
          onSelect={mockOnSelect}
          onPressMenu={mockOnPressMenu}
          isShowHideOption={mockIsShowHideOption}
        />
      </Provider>,
    );

    const userNameElement = getByText('John Doe');
    const checkBox = getByTestId('bouncy-checkbox');

    expect(userNameElement).toBeTruthy();
    expect(checkBox).toBeTruthy();
  });

  it('calls onSelect when checkbox is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BasicAccountsListRawItem
          item={mockItem}
          selectedId={mockSelectedId}
          onSelect={mockOnSelect}
          onPressMenu={mockOnPressMenu}
          isShowHideOption={mockIsShowHideOption}
        />
      </Provider>,
    );

    const checkBox = getByTestId('bouncy-checkbox');
    fireEvent.press(checkBox);

    expect(mockOnSelect).toHaveBeenCalledWith(mockItem.id);
  });
});
