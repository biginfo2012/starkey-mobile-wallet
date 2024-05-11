import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import ReceivedTokenPopUp from './ReceivedTokenPopUp';

test('render correctly', () => {
  const componentCase = (
    <Provider store={store}>
      <ReceivedTokenPopUp />
    </Provider>
  );
  render(componentCase);
});
