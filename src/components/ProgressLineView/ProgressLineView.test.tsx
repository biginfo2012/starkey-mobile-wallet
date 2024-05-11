import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import ProgressLineView from './ProgressLineView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <ProgressLineView countLength={4} selectedCount={1} />
    </Provider>
  );
  render(component);
});
