import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { SearchInputBox } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <SearchInputBox placeholder={'test'} onChangeText={jest.fn} />
    </Provider>
  );
  render(component);
});
