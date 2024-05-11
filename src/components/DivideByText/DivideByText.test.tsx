import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import DivideByText from './DivideByText';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <DivideByText title={'1/2'} />
    </Provider>
  );
  render(component);
});
