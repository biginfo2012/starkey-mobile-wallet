import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import UserAddressView from './UserAddressView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <UserAddressView
        walletAddress={'0xb35CBc739D365732fB5Ff7620E65e47a20eAc0A3'}
        userName={'@happylynx'}
      />
    </Provider>
  );
  render(component);
});
