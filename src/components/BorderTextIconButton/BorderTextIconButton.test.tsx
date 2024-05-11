import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import BorderTextIconButton from './BorderTextIconButton';

describe('BorderTextIconButton', () => {
  const mockProps = {
    text: 'Button Text',
    onPress: jest.fn(),
    leftIconImage: 'path/to/leftIcon.png',
    btnStyle: { backgroundColor: 'red' },
    textStyle: { color: 'blue' },
    rightIconImage: 'path/to/rightIcon.png',
  };

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <BorderTextIconButton {...mockProps} />
      </Provider>,
    );

    const buttonText = getByText('Button Text');
    const button = getByTestId('button');

    expect(buttonText).toBeTruthy();
    expect(button).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <BorderTextIconButton {...mockProps} />
      </Provider>,
    );

    const button = getByTestId('button');
    fireEvent.press(button);

    expect(mockProps.onPress).toHaveBeenCalled();
  });
});
