import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';

import BackgroundView from './BackgroundView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <BackgroundView image={Images.ic_background} />
    </Provider>
  );
  render(component);
});
