import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react-native';
import { store } from 'store/index';
import { Images } from 'theme';
import { CurrencySymbol, NetWorkType } from 'theme/Helper/constant';

import ExistingTokenItem from './ExistingTokenItem';

test('render correctly', () => {
  const component = (
    <Provider store={store}>
      <ExistingTokenItem
        item={{
          id: '1',
          image: Images.ic_solana,
          title: NetWorkType.SOL,
          subTitle: 'Solana',
          amount: '1000',
          usdAmount: CurrencySymbol + '1000',
        }}
      />
    </Provider>
  );
  render(component);
});
