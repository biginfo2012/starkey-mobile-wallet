import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';

import NodataActivityView from './NodataActivityView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <NodataActivityView text={'test'} iconPath={Images.ic_send} />
    </Provider>
  );
  render(component);
});
