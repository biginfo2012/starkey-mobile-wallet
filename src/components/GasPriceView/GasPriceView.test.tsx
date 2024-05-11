import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { NetWorkType } from 'theme/Helper/constant';

import GasPriceView from './GasPriceView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <GasPriceView
        gwei={'118'}
        seconds={'30'}
        amount={'0.00437'}
        usdAmount={'14'}
        tokenType={NetWorkType.ETH}
      />
    </Provider>
  );
  render(component);
});
