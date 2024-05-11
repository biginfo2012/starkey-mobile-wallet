import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { VerticalSeparatorView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <VerticalSeparatorView spacing={8} />
    </Provider>
  );
  render(component);
});
