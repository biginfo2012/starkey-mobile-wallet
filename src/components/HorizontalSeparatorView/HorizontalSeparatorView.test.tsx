import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import Variables from 'theme/Variables';

import HorizontalSeparatorView from './HorizontalSeparatorView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <HorizontalSeparatorView spacing={Variables.MetricsSizes.medium} />
    </Provider>
  );
  render(component);
});
