import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import WalletTokenItem from './WalletTokenItem';

// Mock the i18next module
jest.mock('i18next', () => ({
  t: jest.fn(key => key), // simple mock for the translation function
}));

describe('WalletTokenItem', () => {
  const mockItem = {
    title: 'Token Title',
    networkName: 'Ethereum',
    amount: 100,
    usdAmount: 1.5,
    isFavorite: true,
  };

  it('renders correctly with item data', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <WalletTokenItem item={mockItem} shouldShowBalance={false} />{' '}
      </Provider>,
    );
    // Check if the title and network name are rendered
    expect(getByTestId('Token Title')).toBeTruthy();
    expect(getByTestId('Ethereum')).toBeTruthy();

    // Check if the favorite star icon is rendered
    expect(getByTestId('star-icon')).toBeTruthy();
  });

  it('renders balance correctly when shouldShowBalance is true', () => {
    const { getAllByText } = render(
      <Provider store={store}>
        <WalletTokenItem item={mockItem} shouldShowBalance={true} />
      </Provider>,
    );

    const titleElements = getAllByText('common:hidden_symbol');

    // Check if the balance is hidden when shouldShowBalance is true
    expect(titleElements.length).toBe(2);
  });

  it('renders balance correctly when shouldShowBalance is false', () => {
    const { getByText } = render(
      <Provider store={store}>
        <WalletTokenItem item={mockItem} shouldShowBalance={false} />
      </Provider>,
    );

    // Check if the balance is displayed when shouldShowBalance is false
    expect(getByText('100')).toBeTruthy();
    expect(getByText('$150')).toBeTruthy(); // Assuming your USDollar format matches this
  });
});
