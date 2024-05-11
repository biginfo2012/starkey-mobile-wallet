import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';

import TokenItem from './TokenItem';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <TokenItem
        item={{
          id: '1',
          image: Images.ic_supra,
          title: 'Supra',
        }}
      />
    </Provider>
  );
  render(component);
});
