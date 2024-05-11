import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import MultiLineTextInput from './MultiLineTextInput';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <MultiLineTextInput />
    </Provider>
  );
  render(component);
});

describe('MultiLineTextInput', () => {
  it('renders TextInput component with correct props', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <MultiLineTextInput hasError={false} />
      </Provider>,
    );

    const textInput = getByTestId('text_input');

    expect(textInput.props.textAlignVertical).toBe('top');
    expect(textInput.props.multiline).toBe(true);
    expect(textInput.props.placeholderTextColor).toEqual(expect.any(String));
    expect(textInput.props.style).toEqual(expect.any(Array));
  });

  it('applies style based on hasError prop', () => {
    const { getByTestId, rerender } = render(
      <Provider store={store}>
        <MultiLineTextInput hasError={false} />
      </Provider>,
    );
    const textInput = getByTestId('text_input');

    const initialStyle = textInput.props.style;

    rerender(
      <Provider store={store}>
        <MultiLineTextInput hasError={true} />
      </Provider>,
    );
    const updatedStyle = getByTestId('text_input').props.style;

    expect(updatedStyle).not.toEqual(initialStyle);
  });

  it('triggers onChange prop when text is entered', () => {
    const mockOnChange = jest.fn();
    const { getByTestId } = render(
      <Provider store={store}>
        <MultiLineTextInput hasError={false} onChangeText={mockOnChange} />
      </Provider>,
    );

    const textInput = getByTestId('text_input');
    fireEvent(textInput, 'onChangeText', 'Test input');
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('Test input');
  });
});
