import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import InputBox from './InputBox';

describe('InputBox', () => {
  it('renders correctly', () => {
    const mockProps = {
      totalTextCount: 0,
      minimumTextCount: 0,
      maximumTextCount: 100,
      isShowError: false,
      errMessage: '',
      shouldShowTextCount: false,
      isShowMessage: false,
      message: '',
      messageColor: '',
      messageIcon: '',
      rightIconPath: undefined,
      isSecureText: false,
      onPressRightIcon: jest.fn(),
      backGroundColor: '',
      onChangeValue: jest.fn(),
    };

    const { getByTestId } = render(
      <Provider store={store}>
        <InputBox {...mockProps} />
      </Provider>,
    );

    // You may need to adjust the test ID and placeholder text based on your actual implementation
    const inputBox = getByTestId('input_box');

    // You can add more assertions based on your component's structure and behavior
    expect(inputBox).toBeTruthy();
  });
});
