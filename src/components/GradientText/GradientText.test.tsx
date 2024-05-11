import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Colors } from 'theme/Variables';

import { GradientText } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <GradientText text={'WARNING'} colors={Colors.primaryGradientColor} />
    </Provider>
  );
  render(component);
});
