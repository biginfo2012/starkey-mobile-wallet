import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import BorderWalletAddressView from './BorderWalletAddressView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <BorderWalletAddressView text={'123'} />
    </Provider>
  );
  render(component);
});
