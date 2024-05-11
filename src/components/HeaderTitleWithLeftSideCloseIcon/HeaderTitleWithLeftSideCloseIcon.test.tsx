import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';

import { HeaderTitleWithLeftSideCloseIcon } from '..';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <HeaderTitleWithLeftSideCloseIcon
        title={'accounts'}
        onPressLeft={jest.fn}
      />
    </Provider>
  );
  render(component);
});
