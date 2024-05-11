import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { ActivityFilterControlView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <ActivityFilterControlView onPressFilter={jest.fn} title={'test'} />
    </Provider>
  );
  render(component);
});
