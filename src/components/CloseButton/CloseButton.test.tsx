import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import CloseButton from './CloseButton';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <CloseButton onPress={jest.fn} />
    </Provider>
  );
  render(component);
});
