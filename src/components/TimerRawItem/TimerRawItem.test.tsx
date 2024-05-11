import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import TimerRawItem from './TimerRawItem';

describe('TimerRawItem', () => {
  const mockOnPress = jest.fn();

  it('calls onPress when Pressable is pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <TimerRawItem onPress={mockOnPress} time={2} selectedTime={2} />
      </Provider>,
    );

    const pressable = getByTestId('timer-options-raw-item-pressable');
    fireEvent.press(pressable);

    expect(mockOnPress).toHaveBeenCalled();
  });
});
