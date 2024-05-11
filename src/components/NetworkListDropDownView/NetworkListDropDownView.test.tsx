import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import NetworkListDropDownView from './NetworkListDropDownView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NetworkListDropDownView
        selectedNetwork={jest.fn}
        onSelectedNetwork={jest.fn}
      />
    </Provider>
  );
  render(component);
});
