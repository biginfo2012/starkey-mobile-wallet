import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';

import AddTokenItem from './AddTokenItem';

describe('AddTokenItem', () => {
  const mockItem = {
    id: '1',
    title: 'Token Title',
    subTitle: 'Token Subtitle',
    networkName: 'Ethereum',
    image: Images.background, // Replace with the actual path
    tokenType: 'ERC20',
  };

  const mockProps = {
    item: mockItem,
    selected: true,
    onSelect: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <AddTokenItem {...mockProps} />
      </Provider>,
    );

    expect(getByText('Token Title')).toBeTruthy();
    expect(getByText('Token Subtitle')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
    expect(getByTestId('bouncy-checkbox')).toBeTruthy();
  });

  it('calls onSelect function when checkbox is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <AddTokenItem {...mockProps} />
      </Provider>,
    );
    const checkbox = getByTestId('bouncy-checkbox');

    fireEvent.press(checkbox);

    expect(mockProps.onSelect).toHaveBeenCalledWith('1');
  });
});
