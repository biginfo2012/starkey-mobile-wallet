import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { BarcodeMask } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <BarcodeMask
        width={300}
        height={300}
        showAnimatedLine={true}
        onPress={jest.fn}
      />
    </Provider>
  );
  render(component);
});
