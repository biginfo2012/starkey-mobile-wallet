import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import Brand from './Brand';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <Brand height={80} width={80} />
    </Provider>
  );

  render(component);
});
