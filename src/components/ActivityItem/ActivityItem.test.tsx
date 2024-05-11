import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import ActivityItem from './ActivityItem';

describe('ActivityItem', () => {
  const mockItem = {
    from: 'senderAddress',
    to: 'receiverAddress',
    timeStamp: 1643828123000,
    value: '1000000000000000000',
    tokenDecimal: '18',
    txreceipt_status: '1',
  };

  const mockTokenType = 'ETH';

  const mockOnPress = jest.fn();

  const mockWalletAddress = 'walletAddress';

  const renderComponent = (props = {}) => {
    const defaultProps = {
      item: mockItem,
      tokenType: mockTokenType,
      onPress: mockOnPress,
      walletAddress: mockWalletAddress,
      ...props,
    };

    return render(
      <Provider store={store}>
        <ActivityItem {...defaultProps} />
      </Provider>,
    );
  };

  it('renders with custom props', () => {
    const { getByTestId } = renderComponent({
      shouldShowVerify: true,
      shouldShowBalance: true,
    });

    expect(getByTestId('activity-item-verify-icon')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = renderComponent();

    fireEvent.press(getByTestId('activity-item-pressable'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
