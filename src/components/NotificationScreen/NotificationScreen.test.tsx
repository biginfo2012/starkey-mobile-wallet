import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import NotificationScreen from './NotificationScreen';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NotificationScreen />
    </Provider>
  );
  render(component);
});
