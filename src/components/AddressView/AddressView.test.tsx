import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import AddressView from './AddressView';

describe('AddressView', () => {
  const mockProps = {
    text: 'Button Text',
    btnStyle: { backgroundColor: 'red' },
    textStyle: { color: 'blue' },
    walletAddress: '0xb35CBc739D365732fB5Ff7620E65e47a20eAc0A3',
  };

  it('renders correctly', () => {
    const { getByText, getByTestId } = render(
      <Provider store={store}>
        <AddressView {...mockProps} />
      </Provider>,
    );

    const buttonText = getByText('Button Text');
    const button = getByTestId('button');

    expect(buttonText).toBeTruthy();
    expect(button).toBeTruthy();
  });
});
