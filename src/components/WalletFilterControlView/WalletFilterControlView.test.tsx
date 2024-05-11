import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import WalletFilterControlView from './WalletFilterControlView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <WalletFilterControlView
        onPressFilter={jest.fn}
        onPressSort={jest.fn}
        isChecked={true}
        setIsChecked={jest.fn}
      />
    </Provider>
  );
  render(component);
});
