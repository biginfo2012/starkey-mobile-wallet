import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { MenuItem } from '.';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <MenuItem onPress={jest.fn} text={'edit'} isShowBorder={true} />
    </Provider>
  );
  render(component);
});
