import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { CurrencySymbol } from 'theme/Helper/constant';

import TokenPriceView from './TokenPriceView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <TokenPriceView
        title={'ETH Price'}
        amount={CurrencySymbol + '3,403.83'}
        percentage={'1.20%'}
        onPress={() => {}}
      />
    </Provider>
  );
  render(component);
});
