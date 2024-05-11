import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { TagView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <TagView text={'test'} />
    </Provider>
  );
  render(component);
});
