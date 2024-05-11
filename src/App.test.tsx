import React from 'react';
import 'react-native';
// Note: test renderer must be required after react-native.
import { Provider } from 'react-redux';

// Note: import explicitly to use the types shiped with jest.
import { it } from '@jest/globals';

import App from './App';
import { store } from './store';

it('App renders correctly', () => {
  const component = (
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(component).toBeDefined();
});
