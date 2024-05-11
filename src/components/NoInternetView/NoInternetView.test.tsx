import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import NoInternetView from './NoInternetView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NoInternetView />
    </Provider>
  );
  render(component);
});
