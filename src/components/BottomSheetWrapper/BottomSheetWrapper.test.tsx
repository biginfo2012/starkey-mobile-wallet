import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { BottomSheetWrapper } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <BottomSheetWrapper snapPoints={['35%']} onClose={jest.fn} />
    </Provider>
  );
  render(component);
});
