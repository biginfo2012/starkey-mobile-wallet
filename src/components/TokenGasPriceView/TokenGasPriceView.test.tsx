import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { CurrencySymbol } from 'theme/Helper/constant';
import Images from 'theme/Images';

import TokenGasPriceView from './TokenGasPriceView';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <TokenGasPriceView
        tokenIconPath={Images.ic_background}
        amount={'123\nUSDC'}
        usdAmount={`${CurrencySymbol} 132`}
        gasPriceGwei={'120'}
        usdGasPriceGwei={'14'}
        onPressAlert={jest.fn}
        onPressReceive={jest.fn}
        onPressSend={jest.fn}
        onPressSwap={jest.fn}
        onPressBuy={jest.fn}
      />
    </Provider>
  );
  render(component);
});
