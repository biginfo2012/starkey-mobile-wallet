import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { DropDownView } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <DropDownView text={'accounts'} onPress={jest.fn} />
    </Provider>
  );
  render(component);
});
