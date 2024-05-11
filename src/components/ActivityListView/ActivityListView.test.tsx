import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import ActivityListView from './ActivityListView';

describe('ActivityListView', () => {
  const mockTokenList = [
    {
      id: '1',
      blockHash: 'blockHash1',
    },
    {
      id: '2',
      blockHash: 'blockHash2',
    },
  ];

  const mockOnPressFilter = jest.fn();
  const mockOnPressItem = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      tokenList: mockTokenList,
      onPressFilter: mockOnPressFilter,
      tokenType: 'ETH',
      onPressItem: mockOnPressItem,
      walletAddress: 'walletAddress',
      shouldShowLoader: false,
      shouldShowBalance: false,
      shouldShowNoData: false,
      ...props,
    };

    return render(
      <Provider store={store}>
        <ActivityListView {...defaultProps} />
      </Provider>,
    );
  };

  it('calls onPressFilter when filter button is pressed', () => {
    const { getByTestId } = renderComponent();

    fireEvent.press(getByTestId('Filter'));
    expect(mockOnPressFilter).toHaveBeenCalled();
  });

  it('calls onPressItem when an activity item is pressed', () => {
    const { getAllByTestId } = renderComponent();

    fireEvent.press(getAllByTestId('activity-item-pressable')[0]);
    expect(mockOnPressItem).toHaveBeenCalledWith(mockTokenList[0]);
  });
});
