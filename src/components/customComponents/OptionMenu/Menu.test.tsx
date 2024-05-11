import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { Menu, MenuItem } from '.';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <Menu visible={true} onRequestClose={jest.fn}>
        <MenuItem onPress={jest.fn} text={'edit'} isShowBorder={true} />
      </Menu>
    </Provider>
  );
  render(component);
});
