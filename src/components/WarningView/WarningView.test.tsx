import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { WarningView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <WarningView warningArray={['test']} />
    </Provider>
  );
  render(component);
});
