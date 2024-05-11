import React from 'react';
import { Provider } from 'react-redux';

import { render, fireEvent } from '@testing-library/react-native';
import { store } from 'store/index';

import AddToAddressBookView from './AddToAddressBookView';

describe('AddToAddressBookView', () => {
  const mockSetIsChecked = jest.fn();
  const mockSetAddressBookUsername = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      isChecked: false,
      setIsChecked: mockSetIsChecked,
      setAddressBookUsername: mockSetAddressBookUsername,
      ...props,
    };

    return render(
      <Provider store={store}>
        <AddToAddressBookView {...defaultProps} />
      </Provider>,
    );
  };

  it('renders with default props', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('checkbox-view')).toBeTruthy();
  });

  it('calls setIsChecked when CheckBox is pressed', () => {
    const { getByTestId } = renderComponent();

    fireEvent.press(getByTestId('checkbox-view'));
    expect(mockSetIsChecked).toHaveBeenCalledWith(true);
  });

  it('renders InputBox when isChecked is true', () => {
    const { getByTestId } = renderComponent({ isChecked: true });

    expect(getByTestId('input_box')).toBeTruthy();
  });
});
