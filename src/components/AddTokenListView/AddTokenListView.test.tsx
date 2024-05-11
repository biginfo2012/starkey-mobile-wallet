import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';

import AddTokenListView from './AddTokenListView';

// Mock the customHooks/useUpdateEffect hook
jest.mock('customHooks/useUpdateEffect', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('AddTokenListView', () => {
  const mockItems = [
    {
      title: 'wallet:all',
      data: [
        {
          id: '1',
          title: 'Token Title 1',
          subTitle: 'Token Subtitle 1',
          networkName: 'Ethereum',
          image: Images.background, // Replace with the actual path
          tokenType: 'ERC20',
        },
        // Add more mock data as needed
      ],
    },
    // Add more mock data sections as needed
  ];

  const mockProps = {
    items: mockItems,
    testID: 'add-token-list-view',
    handleIsAddEnable: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <Provider store={store}>
        <AddTokenListView {...mockProps} />
      </Provider>,
    );

    expect(getByTestId('add-token-list-view')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
  });

  it('calls handleIsAddEnable function when a token is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <AddTokenListView {...mockProps} />
      </Provider>,
    );
    const tokenItem = getByTestId('add-token-list-view').children[0];

    fireEvent.press(tokenItem);

    // Assuming your handleIsAddEnable function should be called with the item as an argument
    expect(mockProps.handleIsAddEnable).toHaveBeenCalledWith([
      {
        id: '1',
        title: 'Token Title 1',
        subTitle: 'Token Subtitle 1',
        networkName: 'Ethereum',
        image: Images.background,
        tokenType: 'ERC20',
      },
    ]);
  });
});
