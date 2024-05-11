import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import MaskViewWithOverlay from './MaskViewWithOverlay';

describe('MaskViewWithOverlay', () => {
  it('calls onPress when the component is pressed', () => {
    const mockOnPress = jest.fn();
    const overlayText = 'Test Overlay Text';

    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <MaskViewWithOverlay overlayText={overlayText} onPress={mockOnPress} />
      </Provider>,
    );

    // Find the overlay text using getByText
    const overlayTextElement = getByText(overlayText);

    // Ensure that the overlay text is rendered
    expect(overlayTextElement).toBeDefined();

    // Simulate a press on the component
    fireEvent.press(getByTestId('mask_view'));

    // Check if onPress has been called
    expect(mockOnPress).toHaveBeenCalled();
  });
});
